
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseId, userId } = await req.json();
    
    if (!courseId || !userId) {
      throw new Error("Course ID and User ID are required");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get course details
    const { data: course, error: courseError } = await supabaseClient
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      throw new Error("Course not found");
    }

    // Check if user already purchased this course
    const { data: existingPurchase } = await supabaseClient
      .from('user_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'completed')
      .single();

    if (existingPurchase) {
      throw new Error("Course already purchased");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'ils',
          product_data: {
            name: `${course.title} - ${course.subtitle}`,
            description: course.description,
          },
          unit_amount: course.price_number * 100, // Convert to agorot
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/course/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/course/${courseId}`,
      metadata: {
        courseId,
        userId,
      },
    });

    // Create pending purchase record
    await supabaseClient
      .from('user_purchases')
      .insert({
        user_id: userId,
        course_id: courseId,
        stripe_session_id: session.id,
        amount_paid: course.price_number * 100,
        currency: 'ILS',
        status: 'pending'
      });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Payment error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
