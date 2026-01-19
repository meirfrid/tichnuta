import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Plus, Edit, Trash2, Save, RefreshCw, Settings } from 'lucide-react';

interface CourseVariant {
  id: string;
  course_id: string;
  name: string;
  gender: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string | null;
  min_grade: string | null;
  max_grade: string | null;
  learning_period: string | null;
  is_active: boolean;
  sort_order: number;
}

interface CoursePeriod {
  id: string;
  name: string;
  is_active: boolean;
}

const GRADES = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח'];
const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
const GENDERS = [
  { value: 'בן', label: 'בנים' },
  { value: 'בת', label: 'בנות' },
  { value: 'מעורב', label: 'מעורב' }
];

const CourseVariants = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [variants, setVariants] = useState<CourseVariant[]>([]);
  const [periods, setPeriods] = useState<CoursePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVariant, setEditingVariant] = useState<CourseVariant | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'מעורב',
    location: '',
    day_of_week: 'ראשון',
    start_time: '',
    end_time: '',
    min_grade: '',
    max_grade: '',
    learning_period: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
      toast({
        title: "גישה נדחתה",
        description: "רק מנהלי האתר יכולים לגשת לאזור זה",
        variant: "destructive"
      });
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  useEffect(() => {
    if (courseId && isAdmin) {
      fetchCourse();
      fetchVariants();
      fetchPeriods();
    }
  }, [courseId, isAdmin]);

  const fetchCourse = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (!error && data) {
      setCourse(data);
    }
  };

  const fetchVariants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('course_variants')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order')
      .order('gender')
      .order('location');
    
    if (error) {
      console.error('Error fetching variants:', error);
      toast({
        title: "שגיאה בטעינת מקבצים",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setVariants(data || []);
    }
    setLoading(false);
  };

  const fetchPeriods = async () => {
    const { data, error } = await supabase
      .from('course_periods')
      .select('id, name, is_active')
      .eq('course_id', courseId)
      .eq('is_active', true)
      .order('start_date');
    
    if (!error && data) {
      setPeriods(data);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      gender: 'מעורב',
      location: '',
      day_of_week: 'ראשון',
      start_time: '',
      end_time: '',
      min_grade: '',
      max_grade: '',
      learning_period: '',
      is_active: true,
      sort_order: variants.length
    });
    setEditingVariant(null);
    setShowForm(false);
  };

  const handleEdit = (variant: CourseVariant) => {
    setEditingVariant(variant);
    setFormData({
      name: variant.name,
      gender: variant.gender,
      location: variant.location,
      day_of_week: variant.day_of_week,
      start_time: variant.start_time,
      end_time: variant.end_time || '',
      min_grade: variant.min_grade || '',
      max_grade: variant.max_grade || '',
      learning_period: variant.learning_period || '',
      is_active: variant.is_active,
      sort_order: variant.sort_order
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.location || !formData.start_time) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות החובה (שם, מיקום, שעת התחלה)",
        variant: "destructive"
      });
      return;
    }

    const variantData = {
      course_id: courseId,
      name: formData.name,
      gender: formData.gender,
      location: formData.location,
      day_of_week: formData.day_of_week,
      start_time: formData.start_time,
      end_time: formData.end_time || null,
      min_grade: formData.min_grade === 'none' ? null : (formData.min_grade || null),
      max_grade: formData.max_grade === 'none' ? null : (formData.max_grade || null),
      learning_period: formData.learning_period === 'none' ? null : (formData.learning_period || null),
      is_active: formData.is_active,
      sort_order: formData.sort_order
    };

    try {
      if (editingVariant) {
        const { error } = await supabase
          .from('course_variants')
          .update(variantData)
          .eq('id', editingVariant.id);

        if (error) throw error;
        toast({ title: "מחזור לימוד עודכן בהצלחה" });
      } else {
        const { error } = await supabase
          .from('course_variants')
          .insert(variantData);

        if (error) throw error;
        toast({ title: "מחזור לימוד נוסף בהצלחה" });
      }

      resetForm();
      fetchVariants();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      toast({
        title: "שגיאה בשמירת מחזור לימוד",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (variantId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את מחזור הלימוד?')) return;

    try {
      const { error } = await supabase
        .from('course_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;
      toast({ title: "מחזור לימוד נמחק בהצלחה" });
      fetchVariants();
    } catch (error: any) {
      toast({
        title: "שגיאה במחיקת מחזור לימוד",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (variant: CourseVariant) => {
    try {
      const { error } = await supabase
        .from('course_variants')
        .update({ is_active: !variant.is_active })
        .eq('id', variant.id);

      if (error) throw error;
      fetchVariants();
    } catch (error: any) {
      toast({
        title: "שגיאה בעדכון סטטוס",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Auto-generate name when fields change
  useEffect(() => {
    if (formData.location && formData.day_of_week && formData.start_time) {
      const genderLabel = GENDERS.find(g => g.value === formData.gender)?.label || formData.gender;
      const gradeRange = formData.min_grade && formData.max_grade 
        ? ` כיתות ${formData.min_grade}-${formData.max_grade}` 
        : formData.min_grade ? ` כיתה ${formData.min_grade}` : '';
      const autoName = `${formData.location} | ${genderLabel} | יום ${formData.day_of_week} ${formData.start_time}${gradeRange}`;
      
      if (!editingVariant || formData.name === editingVariant.name) {
        setFormData(prev => ({ ...prev, name: autoName }));
      }
    }
  }, [formData.location, formData.day_of_week, formData.start_time, formData.gender, formData.min_grade, formData.max_grade]);

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
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <ArrowRight className="h-4 w-4 ml-2" />
                חזור לניהול
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ניהול מחזורי לימוד</h1>
                <p className="text-sm text-muted-foreground">{course?.title}</p>
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
                <CardTitle>מחזורי לימוד</CardTitle>
                <CardDescription>
                  הגדר מחזורי לימוד (מגדר + מיקום + יום/שעה + כיתות + תקופת לימוד)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchVariants} variant="outline">
                  <RefreshCw className="h-4 w-4 ml-2" />
                  רענן
                </Button>
                <Button onClick={() => { resetForm(); setShowForm(true); }}>
                  <Plus className="h-4 w-4 ml-2" />
                  הוסף מחזור לימוד
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showForm && (
              <div className="mb-6 p-6 border rounded-lg bg-muted/30 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {editingVariant ? 'עריכת מחזור לימוד' : 'הוספת מחזור לימוד חדש'}
                  </h3>
                  <Button variant="outline" onClick={resetForm}>ביטול</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label>שם מחזור הלימוד (נוצר אוטומטית)</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="השם נוצר אוטומטית מהפרטים"
                    />
                  </div>

                  <div>
                    <Label>מגדר *</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map(g => (
                          <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>מיקום *</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="למשל: אונליין Zoom / בית ספר X"
                    />
                  </div>

                  <div>
                    <Label>יום בשבוע *</Label>
                    <Select 
                      value={formData.day_of_week} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map(day => (
                          <SelectItem key={day} value={day}>יום {day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>שעת התחלה *</Label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>שעת סיום</Label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>כיתה מינימלית</Label>
                    <Select 
                      value={formData.min_grade} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, min_grade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר כיתה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">ללא הגבלה</SelectItem>
                        {GRADES.map(grade => (
                          <SelectItem key={grade} value={grade}>כיתה {grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>כיתה מקסימלית</Label>
                    <Select 
                      value={formData.max_grade} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, max_grade: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר כיתה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">ללא הגבלה</SelectItem>
                        {GRADES.map(grade => (
                          <SelectItem key={grade} value={grade}>כיתה {grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>תקופת לימוד</Label>
                    <Select 
                      value={formData.learning_period} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, learning_period: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר תקופה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">ללא תקופה</SelectItem>
                        {periods.map(period => (
                          <SelectItem key={period.id} value={period.name}>{period.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label>מחזור פעיל</Label>
                  </div>

                  <div>
                    <Label>סדר מיון</Label>
                    <Input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full md:w-auto">
                  <Save className="h-4 w-4 ml-2" />
                  {editingVariant ? 'עדכן מחזור לימוד' : 'שמור מחזור לימוד'}
                </Button>
              </div>
            )}

            {variants.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>אין מחזורי לימוד לקורס זה.</p>
                <p className="text-sm mt-2">הוסף מחזור לימוד ראשון כדי להתחיל.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>שם</TableHead>
                      <TableHead>מגדר</TableHead>
                      <TableHead>מיקום</TableHead>
                      <TableHead>יום ושעה</TableHead>
                      <TableHead>כיתות</TableHead>
                      <TableHead>תקופה</TableHead>
                      <TableHead>פעיל</TableHead>
                      <TableHead>פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variants.map((variant) => (
                      <TableRow key={variant.id} className={!variant.is_active ? 'opacity-50' : ''}>
                        <TableCell className="font-medium">{variant.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            variant.gender === 'בן' ? 'default' : 
                            variant.gender === 'בת' ? 'secondary' : 'outline'
                          }>
                            {GENDERS.find(g => g.value === variant.gender)?.label || variant.gender}
                          </Badge>
                        </TableCell>
                        <TableCell>{variant.location}</TableCell>
                        <TableCell>
                          יום {variant.day_of_week} {variant.start_time}
                          {variant.end_time && `-${variant.end_time}`}
                        </TableCell>
                        <TableCell>
                          {variant.min_grade && variant.max_grade 
                            ? `${variant.min_grade}-${variant.max_grade}`
                            : variant.min_grade || variant.max_grade || '-'}
                        </TableCell>
                        <TableCell>{variant.learning_period || '-'}</TableCell>
                        <TableCell>
                          <Switch
                            checked={variant.is_active}
                            onCheckedChange={() => toggleActive(variant)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(variant)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(variant.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseVariants;
