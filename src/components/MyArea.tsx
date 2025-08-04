
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Book, Play, Clock, CheckCircle2, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserCourse {
  id: string;
  course_id: string;
  status: string;
  purchased_at: string;
  course: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    icon: string;
  };
}

interface CourseLesson {
  id: string;
  title: string;
  description: string;
  order_index: number;
  video_url: string;
  presentation_url: string;
  duration_minutes: number;
  progress?: {
    completed: boolean;
    watch_time_seconds: number;
  };
}

const MyArea = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courseLessons, setCourseLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  const fetchUserCourses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          course:courses (
            id,
            title,
            subtitle,
            description,
            color,
            icon
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      setUserCourses(data as UserCourse[]);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את הקורסים שלך",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseLessons = async (courseId: string) => {
    setLessonsLoading(true);
    try {
      // Fetch lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Fetch user progress for these lessons
      const { data: progress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user?.id)
        .in('lesson_id', lessons.map(l => l.id));

      if (progressError) throw progressError;

      // Combine lessons with progress
      const lessonsWithProgress = lessons.map(lesson => ({
        ...lesson,
        progress: progress.find(p => p.lesson_id === lesson.id)
      }));

      setCourseLessons(lessonsWithProgress);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את שיעורי הקורס",
        variant: "destructive"
      });
    } finally {
      setLessonsLoading(false);
    }
  };

  const updateLessonProgress = async (lessonId: string, watchTime: number, completed: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          watch_time_seconds: watchTime,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Refresh lessons to show updated progress
      if (selectedCourse) {
        fetchCourseLessons(selectedCourse);
      }
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את ההתקדמות",
        variant: "destructive"
      });
    }
  };

  const calculateCourseProgress = (courseId: string) => {
    const courseLessonsForCourse = courseLessons.filter(l => l.course_id === courseId);
    if (courseLessonsForCourse.length === 0) return 0;

    const completedLessons = courseLessonsForCourse.filter(l => l.progress?.completed).length;
    return Math.round((completedLessons / courseLessonsForCourse.length) * 100);
  };

  const switchToLessonsTab = () => {
    const lessonsTab = document.querySelector('[data-value="lessons"]') as HTMLButtonElement;
    if (lessonsTab) {
      lessonsTab.click();
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-8">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">היכנס לחשבון</h2>
            <p className="text-muted-foreground mb-4">
              כדי לראות את האזור האישי שלך יש להתחבר לחשבון
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              התחבר לחשבון
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-muted-foreground">טוען אזור אישי...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">האזור האישי שלי</h1>
        <p className="text-muted-foreground">
          ברוך הבא {user.email} - כאן תמצא את כל הקורסים שלך
        </p>
      </div>

      {userCourses.length === 0 ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">אין לך קורסים עדיין</h2>
            <p className="text-muted-foreground mb-4">
              לאחר הרשמה לקורס ואישור המנהל, הקורסים שלך יופיעו כאן
            </p>
            <Button onClick={() => window.location.href = '#courses'}>
              צפה בקורסים הזמינים
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses" data-value="courses">הקורסים שלי</TabsTrigger>
            <TabsTrigger value="lessons" data-value="lessons">תכני הקורס</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userCourses.map((userCourse) => (
                <Card key={userCourse.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">
                          {userCourse.course.title}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {userCourse.course.subtitle}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        רשום
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {userCourse.course.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>
                        נרשמת ב: {new Date(userCourse.purchased_at).toLocaleDateString('he-IL')}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>התקדמות:</span>
                        <span>{calculateCourseProgress(userCourse.course_id)}%</span>
                      </div>
                      <Progress value={calculateCourseProgress(userCourse.course_id)} />
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => {
                        setSelectedCourse(userCourse.course_id);
                        fetchCourseLessons(userCourse.course_id);
                        switchToLessonsTab();
                      }}
                    >
                      <Play className="h-4 w-4 ml-2" />
                      המשך לימוד
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            {!selectedCourse ? (
              <Card className="text-center">
                <CardContent className="py-8">
                  <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    בחר קורס כדי לראות את השיעורים
                  </p>
                </CardContent>
              </Card>
            ) : lessonsLoading ? (
              <Card className="text-center">
                <CardContent className="py-8">
                  <p className="text-muted-foreground">טוען שיעורים...</p>
                </CardContent>
              </Card>
            ) : courseLessons.length === 0 ? (
              <Card className="text-center">
                <CardContent className="py-8">
                  <p className="text-muted-foreground">
                    אין שיעורים בקורס זה עדיין
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {courseLessons.map((lesson, index) => (
                  <Card key={lesson.id} className={`overflow-hidden ${lesson.progress?.completed ? 'border-green-200 bg-green-50/50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          lesson.progress?.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {lesson.progress?.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-medium mb-1">
                                {lesson.title}
                              </h3>
                              {lesson.description && (
                                <p className="text-sm text-muted-foreground">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                            {lesson.duration_minutes && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration_minutes} דק'</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {lesson.video_url && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Open video in new tab
                                  window.open(lesson.video_url, '_blank');
                                  // Mark as in progress or completed
                                  if (!lesson.progress?.completed) {
                                    updateLessonProgress(lesson.id, lesson.duration_minutes ? lesson.duration_minutes * 60 : 0, true);
                                  }
                                }}
                              >
                                <Play className="h-4 w-4 ml-1" />
                                צפה בוידאו
                              </Button>
                            )}
                            
                            {lesson.presentation_url && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(lesson.presentation_url, '_blank')}
                              >
                                📊 מצגת
                              </Button>
                            )}

                            {!lesson.progress?.completed && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateLessonProgress(lesson.id, 0, true)}
                              >
                                <CheckCircle2 className="h-4 w-4 ml-1" />
                                סמן כהושלם
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MyArea;
