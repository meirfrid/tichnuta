import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Plus, Edit, Trash2, Save, X, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface CoursePeriod {
  id: string;
  course_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

const CoursePeriods = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [periods, setPeriods] = useState<CoursePeriod[]>([]);
  const [editingPeriod, setEditingPeriod] = useState<CoursePeriod | null>(null);
  const [showNewPeriodForm, setShowNewPeriodForm] = useState(false);
  const [periodForm, setPeriodForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
    fetchCourse();
    fetchPeriods();
  }, [courseId, isAdmin]);

  const fetchCourse = async () => {
    if (!courseId) return;
    const { data } = await supabase.from("courses").select("*").eq("id", courseId).single();
    if (data) setCourse(data);
  };

  const fetchPeriods = async () => {
    if (!courseId) return;
    const { data } = await supabase
      .from("course_periods")
      .select("*")
      .eq("course_id", courseId)
      .order("start_date", { ascending: false });
    if (data) setPeriods(data);
  };

  const handleSavePeriod = async () => {
    if (!periodForm.name || !periodForm.start_date || !periodForm.end_date || !courseId) {
      toast({ title: "שגיאה", description: "יש למלא את כל השדות", variant: "destructive" });
      return;
    }

    if (new Date(periodForm.start_date) >= new Date(periodForm.end_date)) {
      toast({ title: "שגיאה", description: "תאריך התחלה חייב להיות לפני תאריך סיום", variant: "destructive" });
      return;
    }

    try {
      if (editingPeriod) {
        const { error } = await supabase
          .from("course_periods")
          .update({
            name: periodForm.name,
            start_date: periodForm.start_date,
            end_date: periodForm.end_date,
            is_active: periodForm.is_active,
          })
          .eq("id", editingPeriod.id);

        if (error) throw error;
        toast({ title: "תקופת לימוד עודכנה בהצלחה" });
      } else {
        const { error } = await supabase.from("course_periods").insert({
          course_id: courseId,
          name: periodForm.name,
          start_date: periodForm.start_date,
          end_date: periodForm.end_date,
          is_active: periodForm.is_active,
        });

        if (error) throw error;
        toast({ title: "תקופת לימוד נוספה בהצלחה" });
      }

      setPeriodForm({ name: "", start_date: "", end_date: "", is_active: true });
      setEditingPeriod(null);
      setShowNewPeriodForm(false);
      fetchPeriods();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const handleDeletePeriod = async (periodId: string) => {
    if (!confirm("האם למחוק תקופת לימוד זו?")) return;

    try {
      const { error } = await supabase.from("course_periods").delete().eq("id", periodId);
      if (error) throw error;
      toast({ title: "תקופת לימוד נמחקה בהצלחה" });
      fetchPeriods();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const togglePeriodActive = async (period: CoursePeriod) => {
    try {
      const { error } = await supabase
        .from("course_periods")
        .update({ is_active: !period.is_active })
        .eq("id", period.id);

      if (error) throw error;
      toast({ title: period.is_active ? "תקופה בוטלה" : "תקופה הופעלה" });
      fetchPeriods();
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    }
  };

  const startEditPeriod = (period: CoursePeriod) => {
    setEditingPeriod(period);
    setPeriodForm({
      name: period.name,
      start_date: period.start_date,
      end_date: period.end_date,
      is_active: period.is_active,
    });
    setShowNewPeriodForm(true);
  };

  const cancelEdit = () => {
    setEditingPeriod(null);
    setPeriodForm({ name: "", start_date: "", end_date: "", is_active: true });
    setShowNewPeriodForm(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMMM yyyy", { locale: he });
    } catch {
      return dateStr;
    }
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
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              ניהול תקופות לימוד: {course?.title}
            </CardTitle>
            <CardDescription>הגדר תקופות לימוד זמינות להרשמה (לדוגמה: נובמבר 2025 - יולי 2026)</CardDescription>
          </CardHeader>
          <CardContent>
            {!showNewPeriodForm && (
              <Button onClick={() => setShowNewPeriodForm(true)}>
                <Plus className="ml-2 h-4 w-4" />
                הוסף תקופת לימוד
              </Button>
            )}

            {showNewPeriodForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingPeriod ? "ערוך תקופת לימוד" : "תקופת לימוד חדשה"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>שם התקופה *</Label>
                    <Input
                      value={periodForm.name}
                      onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })}
                      placeholder="לדוגמה: נובמבר 2025 - יולי 2026"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>תאריך התחלה *</Label>
                      <Input
                        type="date"
                        value={periodForm.start_date}
                        onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>תאריך סיום *</Label>
                      <Input
                        type="date"
                        value={periodForm.end_date}
                        onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={periodForm.is_active}
                      onCheckedChange={(checked) =>
                        setPeriodForm({ ...periodForm, is_active: checked })
                      }
                    />
                    <Label>תקופה פעילה (מוצגת בטופס הרשמה)</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSavePeriod}>
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
                  <TableHead>שם התקופה</TableHead>
                  <TableHead>תאריך התחלה</TableHead>
                  <TableHead>תאריך סיום</TableHead>
                  <TableHead>פעילה</TableHead>
                  <TableHead className="text-left">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      אין תקופות לימוד עדיין
                    </TableCell>
                  </TableRow>
                ) : (
                  periods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell className="font-medium">{period.name}</TableCell>
                      <TableCell>{formatDate(period.start_date)}</TableCell>
                      <TableCell>{formatDate(period.end_date)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={period.is_active}
                          onCheckedChange={() => togglePeriodActive(period)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEditPeriod(period)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePeriod(period.id)}
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

export default CoursePeriods;
