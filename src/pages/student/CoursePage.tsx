import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle, Lock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  video_url: string | null;
  slides_url: string | null;
  is_preview: boolean;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  slug: string;
}

const CoursePage = () => {
  const { courseSlug } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      if (!user || !courseSlug) return;

      try {
        setLoading(true);

        // Fetch course - check if courseSlug is a UUID first
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseSlug);
        
        let courseQuery = supabase
          .from("courses")
          .select("*")
          .eq("active", true);
        
        if (isUUID) {
          courseQuery = courseQuery.or(`slug.eq.${courseSlug},id.eq.${courseSlug}`);
        } else {
          courseQuery = courseQuery.eq("slug", courseSlug);
        }
        
        const { data: courseData, error: courseError } = await courseQuery.single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Check access
        const { data: accessData, error: accessError } = await supabase
          .from("course_allowed_emails")
          .select("id")
          .eq("course_id", courseData.id)
          .eq("email", user.email)
          .maybeSingle();

        console.log("Access check:", { accessData, accessError, userEmail: user.email, courseId: courseData.id });

        setHasAccess(!!accessData);

        if (!accessData) {
          toast({
            title: "אין הרשאה",
            description: "אין לך גישה לקורס זה",
            variant: "destructive",
          });
          return;
        }

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseData.id)
          .order("order_index");

        if (lessonsError) throw lessonsError;
        setLessons(lessonsData || []);
      } catch (error: any) {
        console.error("Error fetching course:", error);
        toast({
          title: "שגיאה",
          description: "לא הצלחנו לטעון את הקורס",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [user, courseSlug, toast]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">הקורס לא נמצא</h2>
              <Button onClick={() => navigate("/dashboard")}>חזרה לדשבורד</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">אין לך גישה לקורס זה</h2>
              <p className="text-muted-foreground mb-4">
                צור קשר עם מנהל האתר לקבלת גישה
              </p>
              <Button onClick={() => navigate("/dashboard")}>חזרה לדשבורד</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            ← חזרה לדשבורד
          </Button>

          <Card className="mb-8">
            <CardHeader className={`${course.color} text-white rounded-t-lg`}>
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                {course.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">שיעורי הקורס</h2>

          {lessons.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">עדיין אין שיעורים בקורס זה</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/learn/${courseSlug}/${lesson.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-muted-foreground">שיעור {index + 1}:</span>
                          {lesson.title}
                          {lesson.is_preview && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              תצוגה מקדימה
                            </span>
                          )}
                        </CardTitle>
                        {lesson.description && (
                          <CardDescription className="mt-2">
                            {lesson.description}
                          </CardDescription>
                        )}
                      </div>
                      <PlayCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
