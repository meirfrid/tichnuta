import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, FileText, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
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
  slug: string;
}

const LessonPage = () => {
  const { courseSlug, lessonId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!user || !courseSlug || !lessonId) return;

      try {
        setLoading(true);

        // Fetch course
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .or(`slug.eq.${courseSlug},id.eq.${courseSlug}`)
          .eq("active", true)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Check access
        const { data: accessData } = await supabase
          .from("course_allowed_emails")
          .select("id")
          .eq("course_id", courseData.id)
          .eq("email", user.email)
          .single();

        setHasAccess(!!accessData);

        if (!accessData) {
          toast({
            title: "אין הרשאה",
            description: "אין לך גישה לשיעור זה",
            variant: "destructive",
          });
          return;
        }

        // Fetch all lessons for navigation
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseData.id)
          .order("order_index");

        if (lessonsError) throw lessonsError;
        setAllLessons(lessonsData || []);

        // Fetch specific lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from("lessons")
          .select("*")
          .eq("id", lessonId)
          .single();

        if (lessonError) throw lessonError;
        setLesson(lessonData);
      } catch (error: any) {
        console.error("Error fetching lesson:", error);
        toast({
          title: "שגיאה",
          description: "לא הצלחנו לטעון את השיעור",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [user, courseSlug, lessonId, toast]);

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course || !lesson || !hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">אין לך גישה לשיעור זה</h2>
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
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/learn/${courseSlug}`)}
            className="mb-6"
          >
            ← חזרה לקורס
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
              {lesson.description && (
                <CardDescription className="text-base">
                  {lesson.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {lesson.video_url ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  <iframe
                    src={lesson.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                  <p className="text-muted-foreground">אין וידאו זמין לשיעור זה</p>
                </div>
              )}

              {lesson.slides_url && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(lesson.slides_url!, "_blank")}
                >
                  <FileText className="ml-2 h-4 w-4" />
                  פתח מצגת
                  <ExternalLink className="mr-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between gap-4">
            {prevLesson ? (
              <Button
                variant="outline"
                onClick={() => navigate(`/learn/${courseSlug}/${prevLesson.id}`)}
                className="flex-1"
              >
                <ChevronRight className="ml-2 h-4 w-4" />
                שיעור קודם: {prevLesson.title}
              </Button>
            ) : (
              <div className="flex-1" />
            )}

            {nextLesson ? (
              <Button
                onClick={() => navigate(`/learn/${courseSlug}/${nextLesson.id}`)}
                className="flex-1"
              >
                שיעור הבא: {nextLesson.title}
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LessonPage;
