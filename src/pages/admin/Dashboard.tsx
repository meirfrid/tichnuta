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
import ContactsList from '@/components/ContactsList';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

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
      setLoading(true);
      console.log('Attempting to update registration:', id, 'to status:', newStatus);
      
      const { data, error } = await supabase
        .from('registrations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "שגיאה בעדכון סטטוס",
          description: error.message || "לא ניתן לעדכן את הסטטוס",
          variant: "destructive"
        });
      } else {
        console.log('Update successful, updated record:', data);
        
        // Update local state immediately for better UX
        setRegistrations(prev => 
          prev.map(reg => 
            reg.id === id 
              ? { ...reg, status: newStatus, updated_at: new Date().toISOString() }
              : reg
          )
        );
        
        toast({
          title: "סטטוס עודכן בהצלחה",
          description: `הסטטוס עודכן ל${newStatus === 'contacted' ? 'נוצר קשר' : 
                                       newStatus === 'enrolled' ? 'נרשם' : 
                                       newStatus === 'declined' ? 'דחה' : newStatus}`,
        });
        
        // Also refresh from server to ensure consistency
        console.log('Refreshing registrations from server...');
        await fetchRegistrations();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "שגיאה בעדכון סטטוס",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">
              <Settings className="h-4 w-4 ml-2" />
              תוכן האתר
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 ml-2" />
              קורסים
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <MessageSquare className="h-4 w-4 ml-2" />
              יצירות קשר
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

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <ContactsList />
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>ניהול תלמידים</CardTitle>
                    <CardDescription>
                      רשימת התלמידים וההרשמות ({registrations.filter(reg => {
                        const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
                        const matchesCourse = courseFilter === 'all' || reg.course === courseFilter;
                        return matchesStatus && matchesCourse;
                      }).length} מתוך {registrations.length} פניות)
                    </CardDescription>
                  </div>
                  <Button onClick={fetchRegistrations} variant="outline" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                    רענן
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="status-filter">סינון לפי סטטוס:</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">הכל</SelectItem>
                        <SelectItem value="new">חדש</SelectItem>
                        <SelectItem value="contacted">נוצר קשר</SelectItem>
                        <SelectItem value="enrolled">נרשם</SelectItem>
                        <SelectItem value="declined">דחה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="course-filter">סינון לפי קורס:</Label>
                    <Select value={courseFilter} onValueChange={setCourseFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">כל הקורסים</SelectItem>
                        {Array.from(new Set(registrations.map(reg => reg.course))).map(course => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(statusFilter !== 'all' || courseFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setStatusFilter('all');
                        setCourseFilter('all');
                      }}
                    >
                      נקה סינון
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">טוען נתונים...</p>
                  </div>
                ) : registrations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    אין פניות בינתיים. ברגע שמישהו ישלח טופס יצירת קשר, הפרטים יופיעו כאן.
                  </p>
                ) : (
                  (() => {
                    const filteredRegistrations = registrations.filter(reg => {
                      const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
                      const matchesCourse = courseFilter === 'all' || reg.course === courseFilter;
                      return matchesStatus && matchesCourse;
                    });

                    return filteredRegistrations.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        אין תוצאות התואמות לסינון שנבחר
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
                            {filteredRegistrations.map((registration) => (
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
                                  <div className="flex gap-1 flex-wrap">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateRegistrationStatus(registration.id, 'contacted')}
                                      disabled={loading || registration.status === 'contacted'}
                                    >
                                      יצרתי קשר
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateRegistrationStatus(registration.id, 'enrolled')}
                                      disabled={loading || registration.status === 'enrolled'}
                                    >
                                      נרשם
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateRegistrationStatus(registration.id, 'declined')}
                                      disabled={loading || registration.status === 'declined'}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      דחה
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })()
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">סה"כ פניות</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{registrations.length}</div>
                    <p className="text-xs text-muted-foreground">
                      +{registrations.filter(r => 
                        new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length} בחודש האחרון
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">תלמידים נרשמו</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {registrations.filter(r => r.status === 'enrolled').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {((registrations.filter(r => r.status === 'enrolled').length / registrations.length) * 100).toFixed(1)}% שיעור המרה
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ממתינים לטיפול</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {registrations.filter(r => r.status === 'new').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      דורשים מענה
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">שיעור הצלחה</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {registrations.filter(r => r.status !== 'new').length > 0 ? 
                        ((registrations.filter(r => r.status === 'enrolled').length / 
                          registrations.filter(r => r.status !== 'new').length) * 100).toFixed(1) 
                        : '0'}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      מהפניות שטופלו
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>התפלגות סטטוסים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { status: 'new', label: 'חדש', color: 'bg-blue-500' },
                        { status: 'contacted', label: 'נוצר קשר', color: 'bg-yellow-500' },
                        { status: 'enrolled', label: 'נרשם', color: 'bg-green-500' },
                        { status: 'declined', label: 'דחה', color: 'bg-red-500' }
                      ].map(({ status, label, color }) => {
                        const count = registrations.filter(r => r.status === status).length;
                        const percentage = registrations.length > 0 ? (count / registrations.length) * 100 : 0;
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${color}`}></div>
                              <span className="text-sm">{label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${color}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-12 text-left">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>קורסים פופולריים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        registrations.reduce((acc, reg) => {
                          acc[reg.course] = (acc[reg.course] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => Number(b) - Number(a))
                        .slice(0, 5)
                        .map(([course, count], index) => {
                          const courseStats = registrations.reduce((acc, reg) => {
                            acc[reg.course] = (acc[reg.course] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          const maxCount = Math.max(...Object.values(courseStats).map(v => Number(v)));
                          const percentage = maxCount > 0 ? (Number(count) / maxCount) * 100 : 0;
                          return (
                            <div key={course} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium truncate flex-1 ml-2">{course}</span>
                                <span className="text-sm text-muted-foreground">{Number(count)} פניות</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Time-based Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>מגמות פניות לאורך זמן</CardTitle>
                  <CardDescription>פניות חדשות ב-30 הימים האחרונים</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      // Create data for last 30 days
                      const last30Days = Array.from({ length: 30 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (29 - i));
                        return date;
                      });

                      const dailyData = last30Days.map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        const count = registrations.filter(reg => 
                          reg.created_at.startsWith(dateStr)
                        ).length;
                        return {
                          date: date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' }),
                          count
                        };
                      });

                      const maxCount = Math.max(...dailyData.map(d => d.count), 1);

                      return (
                        <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-1">
                          {dailyData.map((day, index) => (
                            <div key={index} className="flex flex-col items-center space-y-1">
                              <div 
                                className="w-full bg-primary/20 rounded-sm min-h-[20px] flex items-end"
                                style={{ height: `${Math.max((day.count / maxCount) * 40, 4)}px` }}
                              >
                                <div 
                                  className="w-full bg-primary rounded-sm"
                                  style={{ height: `${Math.max((day.count / maxCount) * 40, day.count > 0 ? 4 : 0)}px` }}
                                  title={`${day.date}: ${day.count} פניות`}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground transform -rotate-45 origin-center">
                                {day.date}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>זמני תגובה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">פניות שטופלו באותו יום</span>
                        <Badge variant="outline">
                          {registrations.filter(r => {
                            if (r.status === 'new') return false;
                            const created = new Date(r.created_at);
                            const updated = new Date(r.updated_at);
                            return updated.toDateString() === created.toDateString();
                          }).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">פניות ממתינות מעל יום</span>
                        <Badge variant={
                          registrations.filter(r => {
                            if (r.status !== 'new') return false;
                            const created = new Date(r.created_at);
                            const now = new Date();
                            return (now.getTime() - created.getTime()) > 24 * 60 * 60 * 1000;
                          }).length > 0 ? "destructive" : "outline"
                        }>
                          {registrations.filter(r => {
                            if (r.status !== 'new') return false;
                            const created = new Date(r.created_at);
                            const now = new Date();
                            return (now.getTime() - created.getTime()) > 24 * 60 * 60 * 1000;
                          }).length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>פילוח לפי תקופה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">השבוע</span>
                        <Badge variant="outline">
                          {registrations.filter(r => 
                            new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          ).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">החודש</span>
                        <Badge variant="outline">
                          {registrations.filter(r => 
                            new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          ).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">3 חודשים אחרונים</span>
                        <Badge variant="outline">
                          {registrations.filter(r => 
                            new Date(r.created_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                          ).length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;