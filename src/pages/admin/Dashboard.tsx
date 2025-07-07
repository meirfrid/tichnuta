import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings, 
  BookOpen, 
  Users, 
  MessageSquare, 
  BarChart3, 
  LogOut,
  Save,
  Eye,
  RefreshCw,
  Trash2,
  Plus,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { siteContent, saveSiteContent, resetToDefault } = useSiteContent();

  // Redirect if not admin
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const [courses, setCourses] = useState<any[]>([]);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    icon: 'Code2',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    features: [''],
    duration: '',
    group_size: '',
    level: 'מתחילים',
    price_text: '',
    price_number: 0
  });

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "שגיאה בטעינת קורסים",
          description: "לא ניתן לטעון את רשימת הקורסים",
          variant: "destructive"
        });
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const saveCourse = async () => {
    try {
      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            ...courseForm,
            features: courseForm.features.filter(f => f.trim() !== '')
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        
        toast({
          title: "קורס עודכן בהצלחה",
        });
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert({
            ...courseForm,
            features: courseForm.features.filter(f => f.trim() !== ''),
            sort_order: courses.length + 1
          });

        if (error) throw error;
        
        toast({
          title: "קורס נוסף בהצלחה",
        });
      }

      setEditingCourse(null);
      setShowNewCourseForm(false);
      setCourseForm({
        title: '',
        subtitle: '',
        description: '',
        icon: 'Code2',
        color: 'bg-gradient-to-br from-blue-500 to-blue-600',
        features: [''],
        duration: '',
        group_size: '',
        level: 'מתחילים',
        price_text: '',
        price_number: 0
      });
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "שגיאה בשמירת קורס",
        description: "אנא נסה שוב",
        variant: "destructive"
      });
    }
  };

  const editCourse = (course: any) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      icon: course.icon,
      color: course.color,
      features: course.features.length > 0 ? course.features : [''],
      duration: course.duration,
      group_size: course.group_size,
      level: course.level,
      price_text: course.price_text,
      price_number: course.price_number
    });
    setShowNewCourseForm(true);
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הקורס?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .update({ active: false })
        .eq('id', courseId);

      if (error) throw error;
      
      toast({
        title: "קורס נמחק בהצלחה",
      });
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "שגיאה במחיקת קורס",
        variant: "destructive"
      });
    }
  };

  const addFeature = () => {
    setCourseForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        toast({
          title: "שגיאה בטעינת נתונים",
          description: "לא ניתן לטעון את רשימת הנרשמים",
          variant: "destructive"
        });
      } else {
        setRegistrations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'enrolled':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateRegistrationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        toast({
          title: "שגיאה בעדכון סטטוס",
          description: "לא ניתן לעדכן את הסטטוס",
          variant: "destructive"
        });
      } else {
        fetchRegistrations();
        toast({
          title: "סטטוס עודכן בהצלחה",
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSaveContent = () => {
    try {
      // Force save the current content
      localStorage.setItem('siteContent', JSON.stringify(siteContent));
      toast({
        title: "התוכן נשמר בהצלחה",
        description: "השינויים יוצגו באתר מיד",
      });
    } catch (error) {
      toast({
        title: "שגיאה בשמירה",
        description: "אנא נסה שוב",
        variant: "destructive"
      });
    }
  };

  const handleResetContent = () => {
    resetToDefault();
    toast({
      title: "התוכן איופס",
      description: "חזרנו להגדרות המקוריות",
    });
  };

  const handleLogout = () => {
    navigate('/');
    toast({
      title: "התנתקת בהצלחה",
      description: "ביי ביי!",
    });
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">אזור ניהול</h1>
                <p className="text-sm text-muted-foreground">תכנותא - ניהול האתר</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 ml-2" />
                תצוגה מקדימה
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                התנתק
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">
              <Settings className="h-4 w-4 ml-2" />
              תוכן האתר
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 ml-2" />
              קורסים
            </TabsTrigger>
            <TabsTrigger value="students">
              <Users className="h-4 w-4 ml-2" />
              תלמידים
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 ml-2" />
              דוחות
            </TabsTrigger>
          </TabsList>

          {/* Site Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>עריכת תוכן האתר</CardTitle>
                    <CardDescription>
                      ערוך את כל הטקסטים והתוכן שמוצגים באתר
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleResetContent} className="text-destructive hover:text-destructive">
                    <RefreshCw className="h-4 w-4 ml-2" />
                    איפוס לברירת מחדל
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">סקציית הפתיחה (Hero)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="heroTitle">כותרת ראשית</Label>
                      <Input
                        id="heroTitle"
                        value={siteContent.heroTitle}
                        onChange={(e) => saveSiteContent({ heroTitle: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="heroButtonText">טקסט כפתור</Label>
                      <Input
                        id="heroButtonText"
                        value={siteContent.heroButtonText}
                        onChange={(e) => saveSiteContent({ heroButtonText: e.target.value })}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="heroSubtitle">תת כותרת</Label>
                      <Textarea
                        id="heroSubtitle"
                        value={siteContent.heroSubtitle}
                        onChange={(e) => saveSiteContent({ heroSubtitle: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="heroDescription">תיאור</Label>
                      <Textarea
                        id="heroDescription"
                        value={siteContent.heroDescription}
                        onChange={(e) => saveSiteContent({ heroDescription: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">סקציית האודות</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="aboutTitle">כותרת אודות</Label>
                      <Input
                        id="aboutTitle"
                        value={siteContent.aboutTitle}
                        onChange={(e) => saveSiteContent({ aboutTitle: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="aboutDescription1">פסקה ראשונה</Label>
                      <Textarea
                        id="aboutDescription1"
                        value={siteContent.aboutDescription1}
                        onChange={(e) => saveSiteContent({ aboutDescription1: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="aboutDescription2">פסקה שנייה</Label>
                      <Textarea
                        id="aboutDescription2"
                        value={siteContent.aboutDescription2}
                        onChange={(e) => saveSiteContent({ aboutDescription2: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="aboutDescription3">פסקה שלישית</Label>
                      <Textarea
                        id="aboutDescription3"
                        value={siteContent.aboutDescription3}
                        onChange={(e) => saveSiteContent({ aboutDescription3: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="missionTitle">כותרת המשימה</Label>
                        <Input
                          id="missionTitle"
                          value={siteContent.missionTitle}
                          onChange={(e) => saveSiteContent({ missionTitle: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="missionDescription">תיאור המשימה</Label>
                        <Textarea
                          id="missionDescription"
                          value={siteContent.missionDescription}
                          onChange={(e) => saveSiteContent({ missionDescription: e.target.value })}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">סטטיסטיקות</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="studentsCount">מספר תלמידים</Label>
                      <Input
                        id="studentsCount"
                        value={siteContent.studentsCount}
                        onChange={(e) => saveSiteContent({ studentsCount: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="experienceYears">שנות ניסיון</Label>
                      <Input
                        id="experienceYears"
                        value={siteContent.experienceYears}
                        onChange={(e) => saveSiteContent({ experienceYears: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="satisfactionRate">אחוז שביעות רצון</Label>
                      <Input
                        id="satisfactionRate"
                        value={siteContent.satisfactionRate}
                        onChange={(e) => saveSiteContent({ satisfactionRate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Values */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">ערכים</h3>
                  <div className="space-y-4">
                    {siteContent.values.map((value, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div>
                          <Label htmlFor={`valueTitle${index}`}>כותרת ערך {index + 1}</Label>
                          <Input
                            id={`valueTitle${index}`}
                            value={value.title}
                            onChange={(e) => {
                              const newValues = [...siteContent.values];
                              newValues[index] = { ...newValues[index], title: e.target.value };
                              saveSiteContent({ values: newValues });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`valueDescription${index}`}>תיאור ערך {index + 1}</Label>
                          <Textarea
                            id={`valueDescription${index}`}
                            value={value.description}
                            onChange={(e) => {
                              const newValues = [...siteContent.values];
                              newValues[index] = { ...newValues[index], description: e.target.value };
                              saveSiteContent({ values: newValues });
                            }}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courses Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">סקציית הקורסים</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="coursesTitle">כותרת סקציית קורסים</Label>
                      <Input
                        id="coursesTitle"
                        value={siteContent.coursesTitle}
                        onChange={(e) => saveSiteContent({ coursesTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="coursesSubtitle">תת כותרת קורסים</Label>
                      <Textarea
                        id="coursesSubtitle"
                        value={siteContent.coursesSubtitle}
                        onChange={(e) => saveSiteContent({ coursesSubtitle: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">פרטי יצירת קשר</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">טלפון</Label>
                      <Input
                        id="contactPhone"
                        value={siteContent.contactPhone}
                        onChange={(e) => saveSiteContent({ contactPhone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">אימייל</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={siteContent.contactEmail}
                        onChange={(e) => saveSiteContent({ contactEmail: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactAddress">כתובת</Label>
                      <Input
                        id="contactAddress"
                        value={siteContent.contactAddress}
                        onChange={(e) => saveSiteContent({ contactAddress: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">כותרת תחתונה</h3>
                  <div>
                    <Label htmlFor="footerDescription">תיאור בכותרת התחתונה</Label>
                    <Input
                      id="footerDescription"
                      value={siteContent.footerDescription}
                      onChange={(e) => saveSiteContent({ footerDescription: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSaveContent} className="flex-1">
                    <Save className="h-4 w-4 ml-2" />
                    שמור שינויים
                  </Button>
                  <Button variant="outline" onClick={handlePreview}>
                    <Eye className="h-4 w-4 ml-2" />
                    תצוגה מקדימה
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>ניהול קורסים</CardTitle>
                    <CardDescription>
                      ערוך קורסים קיימים או הוסף קורסים חדשים ({courses.length} קורסים)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={fetchCourses} variant="outline">
                      <RefreshCw className="h-4 w-4 ml-2" />
                      רענן
                    </Button>
                    <Button onClick={() => {
                      setShowNewCourseForm(true);
                      setEditingCourse(null);
                      setCourseForm({
                        title: '',
                        subtitle: '',
                        description: '',
                        icon: 'Code2',
                        color: 'bg-gradient-to-br from-blue-500 to-blue-600',
                        features: [''],
                        duration: '',
                        group_size: '',
                        level: 'מתחילים',
                        price_text: '',
                        price_number: 0
                      });
                    }}>
                      <Plus className="h-4 w-4 ml-2" />
                      הוסף קורס חדש
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showNewCourseForm ? (
                  <div className="space-y-6 p-6 border rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {editingCourse ? 'עריכת קורס' : 'הוספת קורס חדש'}
                      </h3>
                      <Button variant="outline" onClick={() => {
                        setShowNewCourseForm(false);
                        setEditingCourse(null);
                      }}>
                        ביטול
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="courseTitle">שם הקורס</Label>
                        <Input
                          id="courseTitle"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="למשל: פיתוח משחקים בפייתון"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="courseSubtitle">גילאים/כיתות</Label>
                        <Input
                          id="courseSubtitle"
                          value={courseForm.subtitle}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="למשל: כיתות ז'-ח'"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="courseDescription">תיאור הקורס</Label>
                        <Textarea
                          id="courseDescription"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="תיאור מפורט על הקורס..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="courseIcon">אייקון</Label>
                        <Select value={courseForm.icon} onValueChange={(value) => setCourseForm(prev => ({ ...prev, icon: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Code2">Code2</SelectItem>
                            <SelectItem value="Gamepad2">Gamepad2</SelectItem>
                            <SelectItem value="Smartphone">Smartphone</SelectItem>
                            <SelectItem value="Bot">Bot</SelectItem>
                            <SelectItem value="Monitor">Monitor</SelectItem>
                            <SelectItem value="Laptop">Laptop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="courseLevel">רמה</Label>
                        <Select value={courseForm.level} onValueChange={(value) => setCourseForm(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="מתחילים">מתחילים</SelectItem>
                            <SelectItem value="בסיסי">בסיסי</SelectItem>
                            <SelectItem value="בינוני">בינוני</SelectItem>
                            <SelectItem value="מתקדם">מתקדם</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="courseDuration">משך שיעור</Label>
                        <Input
                          id="courseDuration"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="למשל: שעה וחצי שבועית"
                        />
                      </div>

                      <div>
                        <Label htmlFor="courseGroupSize">גודל קבוצה</Label>
                        <Input
                          id="courseGroupSize"
                          value={courseForm.group_size}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, group_size: e.target.value }))}
                          placeholder="למשל: עד 8 ילדים"
                        />
                      </div>

                      <div>
                        <Label htmlFor="coursePriceText">טקסט מחיר</Label>
                        <Input
                          id="coursePriceText"
                          value={courseForm.price_text}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, price_text: e.target.value }))}
                          placeholder="למשל: ₪280 לחודש"
                        />
                      </div>

                      <div>
                        <Label htmlFor="coursePriceNumber">מחיר מספרי</Label>
                        <Input
                          id="coursePriceNumber"
                          type="number"
                          value={courseForm.price_number}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, price_number: parseInt(e.target.value) || 0 }))}
                          placeholder="280"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>תכונות הקורס</Label>
                      <div className="space-y-2 mt-2">
                        {courseForm.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateFeature(index, e.target.value)}
                              placeholder="תכונה של הקורס..."
                              className="flex-1"
                            />
                            {courseForm.features.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeFeature(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addFeature}>
                          <Plus className="h-4 w-4 ml-2" />
                          הוסף תכונה
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={saveCourse} className="flex-1">
                        <Save className="h-4 w-4 ml-2" />
                        {editingCourse ? 'עדכן קורס' : 'שמור קורס חדש'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">אין קורסים. הוסף קורס חדש לתחילת העבודה.</p>
                    ) : (
                      courses.map((course) => (
                        <div key={course.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{course.title}</h4>
                              <p className="text-muted-foreground">{course.subtitle}</p>
                              <p className="text-sm mt-2">{course.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                <div>
                                  <span className="font-medium">משך: </span>
                                  {course.duration}
                                </div>
                                <div>
                                  <span className="font-medium">קבוצה: </span>
                                  {course.group_size}
                                </div>
                                <div>
                                  <span className="font-medium">רמה: </span>
                                  {course.level}
                                </div>
                                <div>
                                  <span className="font-medium">מחיר: </span>
                                  {course.price_text}
                                </div>
                              </div>
                              {course.features && course.features.length > 0 && (
                                <div className="mt-3">
                                  <span className="font-medium text-sm">תכונות: </span>
                                  <div className="text-sm text-muted-foreground">
                                    {course.features.join(' • ')}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editCourse(course)}
                              >
                                <Edit className="h-4 w-4 ml-1" />
                                ערוך
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteCourse(course.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 ml-1" />
                                מחק
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>ניהול תלמידים</CardTitle>
                    <CardDescription>
                      רשימת התלמידים וההרשמות ({registrations.length} פניות)
                    </CardDescription>
                  </div>
                  <Button onClick={fetchRegistrations} variant="outline">
                    <RefreshCw className="h-4 w-4 ml-2" />
                    רענן
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">טוען נתונים...</p>
                ) : registrations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    אין פניות בינתיים. ברגע שמישהו ישלח טופס יצירת קשר, הפרטים יופיעו כאן.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>רשימת הפניות וההרשמות</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>שם</TableHead>
                          <TableHead>טלפון</TableHead>
                          <TableHead>אימייל</TableHead>
                          <TableHead>קורס</TableHead>
                          <TableHead>הודעה</TableHead>
                          <TableHead>סטטוס</TableHead>
                          <TableHead>תאריך</TableHead>
                          <TableHead>פעולות</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">{registration.name}</TableCell>
                            <TableCell>
                              <a href={`tel:${registration.phone}`} className="text-primary hover:underline">
                                {registration.phone}
                              </a>
                            </TableCell>
                            <TableCell>
                              <a href={`mailto:${registration.email}`} className="text-primary hover:underline">
                                {registration.email}
                              </a>
                            </TableCell>
                            <TableCell>{registration.course}</TableCell>
                            <TableCell className="max-w-xs truncate" title={registration.message || ''}>
                              {registration.message || '-'}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(registration.status)}>
                                {registration.status === 'new' && 'חדש'}
                                {registration.status === 'contacted' && 'נוצר קשר'}
                                {registration.status === 'enrolled' && 'נרשם'}
                                {registration.status === 'declined' && 'דחה'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(registration.created_at).toLocaleDateString('he-IL')}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateRegistrationStatus(registration.id, 'contacted')}
                                  disabled={registration.status === 'contacted'}
                                >
                                  יצרתי קשר
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateRegistrationStatus(registration.id, 'enrolled')}
                                  disabled={registration.status === 'enrolled'}
                                >
                                  נרשם
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
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>דוחות וניתוחים</CardTitle>
                <CardDescription>
                  סטטיסטיקות על השימוש באתר
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  כאן יוצגו דוחות על ביקורים באתר, הרשמות לקורסים ועוד
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;