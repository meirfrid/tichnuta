import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Plus, Edit, Trash2, Save, X, ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  video_url: string | null;
  slides_url: string | null;
  is_preview: boolean;
}

const CourseLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    video_url: "",
    slides_url: "",
    is_preview: false,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
    fetchCourse();
    fetchLessons();
  }, [courseId, isAdmin]);

  const fetchCourse = async () => {
    if (!courseId) return;
    const { data } = await supabase.from("courses").select("*").eq("id", courseId).single();
    if (data) setCourse(data);
  };

  const fetchLessons = async () => {
    if (!courseId) return;
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");
    if (data) setLessons(data);
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.title || !courseId) {
      toast({ title: "שגיאה", description: "יש למלא שם שיעור", variant: "destructive" });
      return;
    }

    try {
      if (editingLesson) {
        const { error } = await supabase
          .from("lessons")
          .update({
            title: lessonForm.title,
            description: lessonForm.description || null,
            video_url: lessonForm.video_url || null,
            slides_url: lessonForm.slides_url || null,
            is_preview: lessonForm.is_preview,
          })
          .eq("id", editingLesson.id);

        if (error) throw error;
        toast({ title: "שיעור עודכן בהצלחה" });
      } else {
        const maxOrder =
          lessons.length > 0 ? Math.max(...lessons.map((l) => l.order_index)) : -1;
        const { error } = await supabase.from("lessons").insert({
          course_id: courseId,
          title: lessonForm.title,
          description: lessonForm.description || null,
          video_url: lessonForm.video_url || null,
          slides_url: lessonForm.slides_url || null,
          is_preview: lessonForm.is_preview,
          order_index: maxOrder + 1,
        });

        if (error) throw error;
        toast({ title: "שיעור נוסף בהצלחה" });
      }

      setLessonForm({ title: "", description: "", video_url: "", slides_url: "", is_preview: false });
      setEditingLesson(null);
      setShowNewLessonForm(false);
      fetchLessons();
    } catch (error: any) {
      console.error("Error saving lesson:", error);
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("האם למחוק שיעור זה?")) return;

    try {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw error;
      toast({ title: "שיעור נמחק בהצלחה" });
      fetchLessons();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const handleMoveLesson = async (lessonId: string, direction: "up" | "down") => {
    const currentIndex = lessons.findIndex((l) => l.id === lessonId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const updatedLessons = [...lessons];
    [updatedLessons[currentIndex], updatedLessons[targetIndex]] = [
      updatedLessons[targetIndex],
      updatedLessons[currentIndex],
    ];

    try {
      for (let i = 0; i < updatedLessons.length; i++) {
        await supabase.from("lessons").update({ order_index: i }).eq("id", updatedLessons[i].id);
      }
      toast({ title: "סדר השיעורים עודכן" });
      fetchLessons();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const startEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || "",
      video_url: lesson.video_url || "",
      slides_url: lesson.slides_url || "",
      is_preview: lesson.is_preview,
    });
    setShowNewLessonForm(true);
  };

  const cancelEdit = () => {
    setEditingLesson(null);
    setLessonForm({ title: "", description: "", video_url: "", slides_url: "", is_preview: false });
    setShowNewLessonForm(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6">
          <ArrowRight className="ml-2 h-4 w-4" />
          חזרה לניהול
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ניהול שיעורים: {course?.title}</CardTitle>
            <CardDescription>הוסף, ערוך וסדר שיעורים לקורס</CardDescription>
          </CardHeader>
          <CardContent>
            {!showNewLessonForm && (
              <Button onClick={() => setShowNewLessonForm(true)}>
                <Plus className="ml-2 h-4 w-4" />
                הוסף שיעור חדש
              </Button>
            )}

            {showNewLessonForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingLesson ? "ערוך שיעור" : "שיעור חדש"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>שם השיעור *</Label>
                    <Input
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      placeholder="למשל: מבוא ל-Python"
                    />
                  </div>
                  <div>
                    <Label>תיאור</Label>
                    <Textarea
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                      placeholder="תיאור קצר של השיעור"
                    />
                  </div>
                  <div>
                    <Label>קישור לוידאו</Label>
                    <Input
                      value={lessonForm.video_url}
                      onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                      placeholder="https://vimeo.com/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      קישור להטמעה (iframe) של Vimeo, YouTube, Cloudflare Stream וכו'
                    </p>
                  </div>
                  <div>
                    <Label>קישור למצגת</Label>
                    <Input
                      value={lessonForm.slides_url}
                      onChange={(e) => setLessonForm({ ...lessonForm, slides_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={lessonForm.is_preview}
                      onCheckedChange={(checked) =>
                        setLessonForm({ ...lessonForm, is_preview: checked })
                      }
                    />
                    <Label>שיעור לתצוגה מקדימה (נגיש ללא הרשאה)</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveLesson}>
                      <Save className="ml-2 h-4 w-4" />
                      שמור
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="ml-2 h-4 w-4" />
                      ביטול
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>סדר</TableHead>
                  <TableHead>שם השיעור</TableHead>
                  <TableHead>תצוגה מקדימה</TableHead>
                  <TableHead>וידאו</TableHead>
                  <TableHead>מצגת</TableHead>
                  <TableHead className="text-left">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      אין שיעורים עדיין
                    </TableCell>
                  </TableRow>
                ) : (
                  lessons.map((lesson, index) => (
                    <TableRow key={lesson.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>{lesson.is_preview ? "✓" : "—"}</TableCell>
                      <TableCell>{lesson.video_url ? "✓" : "—"}</TableCell>
                      <TableCell>{lesson.slides_url ? "✓" : "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveLesson(lesson.id, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveLesson(lesson.id, "down")}
                            disabled={index === lessons.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => startEditLesson(lesson)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseLessons;
