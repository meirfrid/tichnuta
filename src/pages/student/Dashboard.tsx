import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import scratchLogo from "@/assets/scratch-logo.png";
import pythonLogo from "@/assets/python-logo.png";
import appinventorLogo from "@/assets/appinventor-logo.png";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  slug: string;
}

const getCourseImage = (title: string): string | null => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('סקראץ') || lowerTitle.includes('scratch')) {
    return scratchLogo;
  }
  if (lowerTitle.includes('פייתון') || lowerTitle.includes('python')) {
    return pythonLogo;
  }
  if (lowerTitle.includes('אפליקציות') || lowerTitle.includes('app')) {
    return appinventorLogo;
  }
  return null;
};

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get courses where user's email is in allowed emails
        const { data: allowedEmails, error: emailsError } = await supabase
          .from("course_allowed_emails")
          .select("course_id")
          .eq("email", user.email);

        if (emailsError) throw emailsError;

        if (!allowedEmails || allowedEmails.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }

        const courseIds = allowedEmails.map((e) => e.course_id);

        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .in("id", courseIds)
          .eq("active", true)
          .order("sort_order");

        if (coursesError) throw coursesError;

        setCourses(coursesData || []);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        toast({
          title: "שגיאה",
          description: "לא הצלחנו לטעון את הקורסים שלך",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
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

          {courses.length === 0 ? (
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
              {courses.map((course) => {
                const courseImage = getCourseImage(course.title);
                return (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                    onClick={() => navigate(`/learn/${course.slug || course.id}`)}
                  >
                    {courseImage && (
                      <div className="h-48 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
                        <img 
                          src={courseImage} 
                          alt={course.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <CardHeader className={courseImage ? '' : `${course.color} text-white rounded-t-lg`}>
                      <CardTitle className={courseImage ? '' : 'text-white'}>{course.title}</CardTitle>
                      <CardDescription className={courseImage ? '' : 'text-white/90'}>
                        {course.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>
                      <Button className="w-full mt-4" variant="outline">
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
