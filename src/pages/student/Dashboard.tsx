import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, GraduationCap, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import scratchLogo from "@/assets/scratch-logo.png";
import pythonLogo from "@/assets/python-logo.png";
import appinventorLogo from "@/assets/appinventor-logo.png";

interface VariantAccess {
  variant_id: string;
  variant_name: string;
  course_id: string;
  course_title: string;
  course_subtitle: string;
  course_description: string;
  course_color: string;
  course_slug: string;
  course_image_url: string | null;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string | null;
  gender: string;
  learning_period: string | null;
}

const getCourseImage = (access: VariantAccess): string | null => {
  if (access.course_image_url) return access.course_image_url;
  const lowerTitle = access.course_title.toLowerCase();
  if (lowerTitle.includes('סקראץ') || lowerTitle.includes('scratch')) return scratchLogo;
  if (lowerTitle.includes('פייתון') || lowerTitle.includes('python')) return pythonLogo;
  if (lowerTitle.includes('אפליקציות') || lowerTitle.includes('app')) return appinventorLogo;
  return null;
};

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [variantAccesses, setVariantAccesses] = useState<VariantAccess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchMyAccess = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const allAccesses: VariantAccess[] = [];

        // 1. Fetch course-level access (original system)
        const { data: courseEmails } = await supabase
          .from("course_allowed_emails")
          .select("course_id")
          .eq("email", user.email);

        if (courseEmails && courseEmails.length > 0) {
          const courseIds = courseEmails.map(e => e.course_id);
          const { data: courses } = await supabase
            .from("courses")
            .select("*")
            .in("id", courseIds)
            .eq("active", true)
            .order("sort_order");

          const legacyAccesses: VariantAccess[] = (courses || []).map(c => ({
            variant_id: "",
            variant_name: "",
            course_id: c.id,
            course_title: c.title,
            course_subtitle: c.subtitle,
            course_description: c.description,
            course_color: c.color,
            course_slug: c.slug,
            course_image_url: c.image_url || null,
            location: "",
            day_of_week: "",
            start_time: "",
            end_time: null,
            gender: "",
            learning_period: null,
          }));
          allAccesses.push(...legacyAccesses);
        }

        // 2. Fetch variant-level access (new system)
        const { data: variantEmails, error: variantError } = await supabase
          .from("variant_allowed_emails")
          .select("variant_id")
          .eq("email", user.email);

        if (variantError) throw variantError;

        const variantIds = variantEmails?.map(v => v.variant_id) || [];

        if (variantIds.length > 0) {
          const { data: variants, error: variantsError } = await supabase
            .from("course_variants")
            .select("*, courses!course_variants_course_id_fkey(id, title, subtitle, description, color, slug, image_url)")
            .in("id", variantIds)
            .eq("is_active", true);

          if (variantsError) throw variantsError;

          const variantAccesses: VariantAccess[] = (variants || [])
            .filter((v: any) => v.courses)
            .map((v: any) => ({
              variant_id: v.id,
              variant_name: v.name,
              course_id: v.courses.id,
              course_title: v.courses.title,
              course_subtitle: v.courses.subtitle,
              course_description: v.courses.description,
              course_color: v.courses.color,
              course_slug: v.courses.slug,
              course_image_url: v.courses.image_url || null,
              location: v.location,
              day_of_week: v.day_of_week,
              start_time: v.start_time,
              end_time: v.end_time,
              gender: v.gender,
              learning_period: v.learning_period,
            }));
          allAccesses.push(...variantAccesses);
        }

        setVariantAccesses(allAccesses);
      } catch (error: any) {
        console.error("Error fetching access:", error);
        toast({
          title: "שגיאה",
          description: "לא הצלחנו לטעון את הקורסים שלך",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyAccess();
  }, [user, toast]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-3xl font-bold">הקורסים שלי</h1>
          </div>

          {variantAccesses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">אין לך קורסים עדיין</h2>
                <p className="text-muted-foreground mb-4">
                  כשתירשם לקורס או כשמנהל האתר יוסיף אותך, הקורסים שלך יופיעו כאן
                </p>
                <Button onClick={() => navigate("/")}>חזרה לעמוד הבית</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {variantAccesses.map((access) => {
                const courseImage = getCourseImage(access);
                const isVariantBased = !!access.variant_id;
                const navigateTo = isVariantBased
                  ? `/learn/${access.course_slug || access.course_id}/variant/${access.variant_id}`
                  : `/learn/${access.course_slug || access.course_id}`;

                return (
                  <Card
                    key={access.variant_id || access.course_id}
                    className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                    onClick={() => navigate(navigateTo)}
                  >
                    {courseImage && (
                      <div className="h-48 overflow-hidden">
                        <img src={courseImage} alt={access.course_title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardHeader className={courseImage ? '' : `${access.course_color} text-white rounded-t-lg`}>
                      <CardTitle className={courseImage ? '' : 'text-white'}>{access.course_title}</CardTitle>
                      <CardDescription className={courseImage ? '' : 'text-white/90'}>
                        {access.course_subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {isVariantBased && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {access.location && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 ml-1" />
                              {access.location}
                            </Badge>
                          )}
                          {access.day_of_week && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 ml-1" />
                              יום {access.day_of_week} {access.start_time}
                            </Badge>
                          )}
                          {access.learning_period && (
                            <Badge variant="secondary" className="text-xs">
                              {access.learning_period}
                            </Badge>
                          )}
                        </div>
                      )}
                      <Button className="w-full" variant="outline">
                        המשך ללמוד
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
