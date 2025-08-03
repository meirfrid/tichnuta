
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

const PaymentSuccess = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (sessionId && courseId) {
      verifyPayment();
    }
  }, [sessionId, courseId]);

  const verifyPayment = async () => {
    try {
      // Verify payment with Stripe
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data.paid) {
        setVerified(true);
        
        // Fetch course details
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();
          
        if (courseData) {
          setCourse(courseData);
        }
      }

    } catch (error) {
      console.error('Payment verification error:', error);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">מאמת תשלום...</h2>
            <p className="text-muted-foreground">אנא המתן</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                {verified ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <span className="text-red-500 text-2xl">×</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">
                {verified ? "תשלום בוצע בהצלחה!" : "שגיאה בתשלום"}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {verified ? (
                <div>
                  <p className="text-muted-foreground mb-6">
                    הרכישה של הקורס "{course?.title}" הושלמה בהצלחה.
                    <br />
                    כעת תוכל לגשת לכל התכנים של הקורס.
                  </p>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate(`/course/${courseId}`)}
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      כניסה לקורס
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      חזרה לעמוד הבית
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-6">
                    אירעה שגיאה בעת עיבוד התשלום. 
                    אנא צור קשר לקבלת עזרה.
                  </p>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate(`/course/${courseId}`)}
                      className="w-full"
                    >
                      חזרה לקורס
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="w-full"
                    >
                      חזרה לעמוד הבית
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
