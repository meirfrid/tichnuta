
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Play, Clock, Users, Star, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Check if user has purchased the course
      if (user) {
        const { data: purchaseData } = await supabase
          .from('user_purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .eq('status', 'completed')
          .single();

        setHasPurchased(!!purchaseData);
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את פרטי הקורס",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setPurchasing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-course-payment', {
        body: { courseId, userId: user.id }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "שגיאה בתשלום",
        description: "לא ניתן ליצור תשלום. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "מתחילים": return "bg-green-100 text-green-800";
      case "בסיסי": return "bg-blue-100 text-blue-800";
      case "בינוני": return "bg-orange-100 text-orange-800";
      case "מתקדם": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">טוען קורס...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">קורס לא נמצא</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
            {hasPurchased && (
              <Badge className="bg-green-100 text-green-800">
                נרכש
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {course.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {course.subtitle}
          </p>
          <p className="text-muted-foreground mb-6">
            {course.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{course.group_size}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {course.price_text}
              </span>
            </div>
          </div>

          {!hasPurchased && (
            <Button
              onClick={handlePurchase}
              disabled={purchasing}
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-4"
            >
              {purchasing ? "מעביר לתשלום..." : "רכישת הקורס"}
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Features */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>מה נלמד בקורס</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Lessons List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>תכנית הקורס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        hasPurchased || lesson.is_free
                          ? "bg-background border-border"
                          : "bg-muted/30 border-muted"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {hasPurchased || lesson.is_free ? (
                          <Play className="h-6 w-6 text-primary" />
                        ) : (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {index + 1}. {lesson.title}
                        </h4>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {lesson.description}
                          </p>
                        )}
                        {lesson.duration_minutes && (
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration_minutes} דקות
                            </span>
                          </div>
                        )}
                      </div>

                      {lesson.is_free && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          חינם
                        </Badge>
                      )}
                      
                      {(hasPurchased || lesson.is_free) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                        >
                          צפייה
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
