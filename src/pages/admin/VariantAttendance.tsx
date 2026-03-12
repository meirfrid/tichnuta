import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Save, RefreshCw, Users } from 'lucide-react';

interface AttendanceRecord {
  variant_id: string;
  student_email: string;
  lesson_date: string;
  attended: boolean;
}

const DAYS_MAP: Record<string, number> = {
  'ראשון': 0, 'שני': 1, 'שלישי': 2, 'רביעי': 3, 'חמישי': 4, 'שישי': 5, 'שבת': 6
};

const VariantAttendance = () => {
  const { courseId, variantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [variant, setVariant] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [students, setStudents] = useState<{ email: string; name: string }[]>([]);
  const [attendance, setAttendance] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [period, setPeriod] = useState<{ start_date: string; end_date: string } | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (variantId && isAdmin) {
      fetchData();
    }
  }, [variantId, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchVariant(), fetchStudents(), fetchAttendance()]);
    setLoading(false);
  };

  const fetchVariant = async () => {
    const { data: variantData } = await supabase
      .from('course_variants')
      .select('*')
      .eq('id', variantId)
      .single();

    if (variantData) {
      setVariant(variantData);

      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', variantData.course_id)
        .single();
      if (courseData) setCourse(courseData);

      // Fetch the learning period dates
      if (variantData.learning_period) {
        const { data: periodData } = await supabase
          .from('course_periods')
          .select('start_date, end_date')
          .eq('course_id', variantData.course_id)
          .eq('name', variantData.learning_period)
          .single();
        if (periodData) setPeriod(periodData);
      }
    }
  };

  const fetchStudents = async () => {
    // Get students from registrations linked to this variant with status 'נרשם'
    const { data: registrations } = await supabase
      .from('registrations')
      .select('name, email')
      .eq('variant_id', variantId!)
      .eq('status', 'נרשם');

    // Get students from variant_allowed_emails (fallback)
    const { data: variantEmails } = await supabase
      .from('variant_allowed_emails')
      .select('email')
      .eq('variant_id', variantId!);

    const studentMap = new Map<string, string>();
    // First add registrations (they have names)
    registrations?.forEach(r => studentMap.set(r.email.toLowerCase(), r.name));
    // Add variant emails that aren't already from registrations
    variantEmails?.forEach(e => {
      const email = e.email.toLowerCase();
      if (!studentMap.has(email)) {
        studentMap.set(email, email.split('@')[0]);
      }
    });

    const result = Array.from(studentMap.entries())
      .map(([email, name]) => ({ email, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setStudents(result);
  };

  const fetchAttendance = async () => {
    const { data } = await supabase
      .from('variant_attendance')
      .select('student_email, lesson_date, attended')
      .eq('variant_id', variantId!);

    const map = new Map<string, boolean>();
    data?.forEach(record => {
      map.set(`${record.student_email}|${record.lesson_date}`, record.attended);
    });
    setAttendance(map);
  };

  // Generate lesson dates: first weekday in start month through last weekday in end month
  const lessonDates = useMemo(() => {
    if (!variant || !period) return [];

    const dayIndex = DAYS_MAP[variant.day_of_week];
    if (dayIndex === undefined) return [];

    const dates: string[] = [];
    // Start from the 1st of the start month
    const startParts = period.start_date.split('-');
    const rangeStart = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, 1);
    // End at the last day of the end month
    const endParts = period.end_date.split('-');
    const rangeEnd = new Date(parseInt(endParts[0]), parseInt(endParts[1]), 0); // last day of end month

    // Find first matching day in start month
    const current = new Date(rangeStart);
    while (current.getDay() !== dayIndex && current <= rangeEnd) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= rangeEnd) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 7);
    }

    return dates;
  }, [variant, period]);

  const toggleAttendance = (email: string, date: string) => {
    const key = `${email}|${date}`;
    setAttendance(prev => {
      const next = new Map(prev);
      next.set(key, !prev.get(key));
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build all records from current state
      const records: AttendanceRecord[] = [];
      for (const student of students) {
        for (const date of lessonDates) {
          const key = `${student.email}|${date}`;
          records.push({
            variant_id: variantId!,
            student_email: student.email,
            lesson_date: date,
            attended: attendance.get(key) || false,
          });
        }
      }

      // Upsert in batches
      const batchSize = 100;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const { error } = await supabase
          .from('variant_attendance')
          .upsert(batch, { onConflict: 'variant_id,student_email,lesson_date' });
        if (error) throw error;
      }

      toast({ title: "הנוכחות נשמרה בהצלחה" });
    } catch (error: any) {
      toast({ title: "שגיאה בשמירת נוכחות", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
  };

  // Count attendance per student
  const getStudentStats = (email: string) => {
    let present = 0;
    for (const date of lessonDates) {
      if (attendance.get(`${email}|${date}`)) present++;
    }
    return `${present}/${lessonDates.length}`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate(`/admin/courses/${courseId}/variants`)}>
                <ArrowRight className="h-4 w-4 ml-2" />
                חזור למחזורי לימוד
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">נוכחות תלמידים</h1>
                <p className="text-sm text-muted-foreground">{course?.title} - {variant?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>מעקב נוכחות</CardTitle>
                <CardDescription>
                  {period 
                    ? `תקופה: ${period.start_date} עד ${period.end_date} | יום ${variant?.day_of_week} | ${lessonDates.length} שיעורים`
                    : 'לא הוגדרה תקופת לימוד למחזור זה. יש לשייך תקופת לימוד כדי לראות תאריכים.'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchData} variant="outline">
                  <RefreshCw className="h-4 w-4 ml-2" />
                  רענן
                </Button>
                <Button onClick={handleSave} disabled={saving || lessonDates.length === 0}>
                  <Save className="h-4 w-4 ml-2" />
                  {saving ? 'שומר...' : 'שמור נוכחות'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>אין תלמידים משויכים למחזור לימוד זה.</p>
                <p className="text-sm mt-2">הוסף תלמידים דרך ניהול הרשאות.</p>
              </div>
            ) : lessonDates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>לא נמצאו תאריכי שיעורים.</p>
                <p className="text-sm mt-2">ודא שתקופת הלימוד מוגדרת נכון במחזור הלימוד.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="sticky right-0 bg-card z-10 border p-2 text-right min-w-[180px]">תלמיד/ה</th>
                      {lessonDates.map(date => (
                        <th key={date} className="border p-2 text-center min-w-[60px] whitespace-nowrap">
                          {formatDate(date)}
                        </th>
                      ))}
                      <th className="border p-2 text-center min-w-[70px]">סה״כ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.email} className="hover:bg-muted/50">
                        <td className="sticky right-0 bg-card z-10 border p-2 font-medium text-right" title={student.email}>
                          {student.name}
                        </td>
                        {lessonDates.map(date => {
                          const key = `${student.email}|${date}`;
                          const isChecked = attendance.get(key) || false;
                          const isPast = new Date(date) <= new Date();
                          return (
                            <td key={date} className={`border p-2 text-center ${!isPast ? 'bg-muted/20' : ''}`}>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleAttendance(student.email, date)}
                                className="mx-auto"
                              />
                            </td>
                          );
                        })}
                        <td className="border p-2 text-center font-semibold">
                          {getStudentStats(student.email)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VariantAttendance;
