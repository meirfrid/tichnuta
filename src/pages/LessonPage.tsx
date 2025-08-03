
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Clock, FileText, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (lessonId && user) {
      fetchLessonData();
    }
  }, [lessonId, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && hasAccess) {
      interval = setInterval(() => {
        setWatchTime(prev => {
          const newTime = prev + 1;
          updateProgress(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, hasAccess]);

  const fetchLessonData = async () => {
    try {
      // Fetch lesson details
      const { data: lessonData, error: lessonError } = await supabase
        .from('course_lessons')
        .select('*, courses(*)')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;
      
      setLesson(lessonData);
      setCourse(lessonData.courses);

      // Fetch all lessons in the course
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', lessonData.course_id)
        .order('order_index');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Check access - either free lesson or purchased course
      let access = lessonData.is_free;
      
      if (!access) {
        const { data: purchaseData } = await supabase
          .from('user_purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', lessonData.course_id)
          .eq('status', 'completed')
          .single();

        access = !!purchaseData;
      }

      setHasAccess(access);

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (progressData) {
        setProgress(progressData);
        setWatchTime(progressData.watch_time_seconds || 0);
      }

    } catch (error) {
      console.error('Error fetching lesson data:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את השיעור",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (currentWatchTime: number) => {
    if (!hasAccess || !user || !lesson) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          watch_time_seconds: currentWatchTime,
          completed: currentWatchTime >= (lesson.duration_minutes * 60 * 0.8), // 80% completion
          completed_at: currentWatchTime >= (lesson.duration_minutes * 60 * 0.8) ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const navigateToLesson = (direction: 'prev' | 'next') => {
    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (targetIndex >= 0 && targetIndex < lessons.length) {
      const targetLesson = lessons[targetIndex];
      navigate(`/lesson/${targetLesson.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">טוען שיעור...</div>
        </div>
      </div>
    );
  }

  if (!lesson || !hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">אין גישה לשיעור</h1>
          <p className="text-muted-foreground mb-6">
            {!lesson ? "שיעור לא נמצא" : "יש לרכוש את הקורס כדי לצפות בשיעור זה"}
          </p>
          <Button onClick={() => navigate(`/course/${course?.id}`)}>
            חזרה לקורס
          </Button>
        </div>
      </div>
    );
  }

  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const completionPercentage = lesson.duration_minutes 
    ? Math.min((watchTime / (lesson.duration_minutes * 60)) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/course/${course?.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לקורס: {course?.title}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg relative">
                  {lesson.video_url ? (
                    <iframe
                      src={lesson.video_url}
                      title={lesson.title}
                      className="w-full h-full rounded-t-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>וידאו יועלה בקרוב</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {lesson.title}
                  </h1>
                  
                  {lesson.description && (
                    <p className="text-muted-foreground mb-4">
                      {lesson.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">התקדמות</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(completionPercentage)}%
                      </span>
                    </div>
                    <Progress value={completionPercentage} className="w-full" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}
                        {lesson.duration_minutes && ` / ${lesson.duration_minutes}:00`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Presentation */}
            {lesson.presentation_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    מצגת השיעור
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <iframe
                    src={lesson.presentation_url}
                    title="מצגת השיעור"
                    className="w-full h-96 border rounded"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Lesson Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>שיעורי הקורס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((l, index) => (
                    <div
                      key={l.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        l.id === lessonId
                          ? "bg-primary/10 border-primary"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => navigate(`/lesson/${l.id}`)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {index + 1}.
                        </span>
                        <span className="text-sm font-medium truncate">
                          {l.title}
                        </span>
                      </div>
                      {l.duration_minutes && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{l.duration_minutes} דקות</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToLesson('prev')}
                    disabled={currentIndex === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 ml-1" />
                    קודם
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToLesson('next')}
                    disabled={currentIndex === lessons.length - 1}
                    className="flex-1"
                  >
                    הבא
                    <ArrowRight className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
