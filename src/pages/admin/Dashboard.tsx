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
  Edit,
  MessageCircle,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import ContactsList from '@/components/ContactsList';
import { Progress } from '@/components/ui/progress';

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
    price_number: 0,
    locations: [''],
    times: [''],
    slug: ''
  });

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [editingRecommendation, setEditingRecommendation] = useState<any>(null);
  const [showNewRecommendationForm, setShowNewRecommendationForm] = useState(false);
  const [recommendationForm, setRecommendationForm] = useState({
    parent_name: '',
    child_name: '',
    recommendation_text: '',
    rating: 5,
    is_approved: true,
    is_featured: false,
    sort_order: 0
  });

  useEffect(() => {
    fetchRegistrations();
    fetchCourses();
    fetchRecommendations();
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

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('parent_recommendations')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        const errorMessage = error?.message || error?.details || "לא ניתן לטעון את רשימת ההמלצות";
        console.error('Full error details:', JSON.stringify(error, null, 2));
        
        // Check if table doesn't exist
        if (error.message?.includes('does not exist') || error.code === '42P01') {
          toast({
            title: "שגיאה בטעינת המלצות",
            description: "הטבלה לא קיימת. יש להריץ את המיגרציה במסד הנתונים.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "שגיאה בטעינת המלצות",
            description: errorMessage,
            variant: "destructive"
          });
        }
      } else {
        setRecommendations(data || []);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "שגיאה בטעינת המלצות",
        description: error?.message || "אירעה שגיאה",
        variant: "destructive"
      });
    }
  };

  const saveRecommendation = async () => {
    // Validate required fields
    if (!recommendationForm.parent_name.trim()) {
      toast({
        title: "שגיאה",
        description: "יש למלא את שם ההורה",
        variant: "destructive"
      });
      return;
    }

    if (!recommendationForm.recommendation_text.trim()) {
      toast({
        title: "שגיאה",
        description: "יש למלא את תוכן ההמלצה",
        variant: "destructive"
      });
      return;
    }

    try {
      const dataToSave = {
        parent_name: recommendationForm.parent_name.trim(),
        child_name: recommendationForm.child_name.trim() || null,
        recommendation_text: recommendationForm.recommendation_text.trim(),
        rating: recommendationForm.rating || null,
        is_approved: recommendationForm.is_approved,
        is_featured: recommendationForm.is_featured,
        sort_order: recommendationForm.sort_order || 0
      };

      if (editingRecommendation) {
        const { error } = await supabase
          .from('parent_recommendations')
          .update(dataToSave)
          .eq('id', editingRecommendation.id);

        if (error) {
          console.error('Error updating recommendation:', error);
          throw error;
        }
        
        toast({
          title: "המלצה עודכנה בהצלחה",
        });
      } else {
        const { error } = await supabase
          .from('parent_recommendations')
          .insert(dataToSave);

        if (error) {
          console.error('Error inserting recommendation:', error);
          throw error;
        }
        
        toast({
          title: "המלצה נוספה בהצלחה",
        });
      }

      setEditingRecommendation(null);
      setShowNewRecommendationForm(false);
      setRecommendationForm({
        parent_name: '',
        child_name: '',
        recommendation_text: '',
        rating: 5,
        is_approved: true,
        is_featured: false,
        sort_order: 0
      });
      fetchRecommendations();
    } catch (error: any) {
      console.error('Error saving recommendation:', error);
      const errorMessage = error?.message || error?.details || error?.hint || "אנא נסה שוב";
      console.error('Full error details:', JSON.stringify(error, null, 2));
      toast({
        title: "שגיאה בשמירת המלצה",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const editRecommendation = (recommendation: any) => {
    setEditingRecommendation(recommendation);
    setRecommendationForm({
      parent_name: recommendation.parent_name,
      child_name: recommendation.child_name || '',
      recommendation_text: recommendation.recommendation_text,
      rating: recommendation.rating || 5,
      is_approved: recommendation.is_approved,
      is_featured: recommendation.is_featured,
      sort_order: recommendation.sort_order || 0
    });
    setShowNewRecommendationForm(true);
  };

  const deleteRecommendation = async (recommendationId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את ההמלצה?')) return;

    try {
      const { error } = await supabase
        .from('parent_recommendations')
        .delete()
        .eq('id', recommendationId);

      if (error) throw error;
      
      toast({
        title: "המלצה נמחקה בהצלחה",
      });
      fetchRecommendations();
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      toast({
        title: "שגיאה במחיקת המלצה",
        variant: "destructive"
      });
    }
  };

  const saveCourse = async () => {
    try {
      // Generate slug from title if empty
      let finalSlug = courseForm.slug.trim();
      if (!finalSlug) {
        finalSlug = courseForm.title
          .toLowerCase()
          .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '') // Keep Hebrew, English, numbers, spaces, hyphens
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim();
      }

      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            ...courseForm,
            slug: finalSlug,
            features: courseForm.features.filter(f => f.trim() !== ''),
            locations: courseForm.locations.filter(l => l.trim() !== ''),
            times: courseForm.times.filter(t => t.trim() !== '')
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
            slug: finalSlug,
            features: courseForm.features.filter(f => f.trim() !== ''),
            locations: courseForm.locations.filter(l => l.trim() !== ''),
            times: courseForm.times.filter(t => t.trim() !== ''),
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
        price_number: 0,
        locations: [''],
        times: [''],
        slug: ''
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
      price_number: course.price_number,
      locations: course.locations?.length > 0 ? course.locations : [''],
      times: course.times?.length > 0 ? course.times : [''],
      slug: course.slug || ''
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

  const addLocation = () => {
    setCourseForm(prev => ({
      ...prev,
      locations: [...prev.locations, '']
    }));
  };

  const updateLocation = (index: number, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      locations: prev.locations.map((l, i) => i === index ? value : l)
    }));
  };

  const removeLocation = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const addTime = () => {
    setCourseForm(prev => ({
      ...prev,
      times: [...prev.times, '']
    }));
  };

  const updateTime = (index: number, value: string) => {
    setCourseForm(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? value : t)
    }));
  };

  const removeTime = (index: number) => {
    setCourseForm(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
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

  // --- Aggregated analytics for reports tab ---
  const totalRegistrations = registrations.length;
  const newRegistrations = registrations.filter(reg => reg.status === 'new' || !reg.status).length;
  const contactedRegistrations = registrations.filter(reg => reg.status === 'contacted').length;
  const enrolledRegistrations = registrations.filter(reg => reg.status === 'enrolled').length;
  const declinedRegistrations = registrations.filter(reg => reg.status === 'declined').length;

  const totalHandled = contactedRegistrations + enrolledRegistrations + declinedRegistrations;
  const handledPercentage = totalRegistrations
    ? Math.round((totalHandled / totalRegistrations) * 100)
    : 0;

  const enrolledPercentage = totalRegistrations
    ? Math.round((enrolledRegistrations / totalRegistrations) * 100)
    : 0;

  const registrationsByCourse = registrations.reduce((acc: Record<string, { total: number; enrolled: number }>, reg) => {
    const courseName = reg.course || 'ללא שם קורס';
    if (!acc[courseName]) {
      acc[courseName] = { total: 0, enrolled: 0 };
    }
    acc[courseName].total += 1;
    if (reg.status === 'enrolled') {
      acc[courseName].enrolled += 1;
    }
    return acc;
  }, {});

  const genderStats = registrations.reduce(
    (acc: { male: number; female: number; unknown: number }, reg) => {
      const gender = (reg.gender || '').trim();
      if (gender === 'בן') acc.male += 1;
      else if (gender === 'בת') acc.female += 1;
      else acc.unknown += 1;
      return acc;
    },
    { male: 0, female: 0, unknown: 0 }
  );

  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="content">
              <Settings className="h-4 w-4 ml-2" />
              תוכן האתר
            </TabsTrigger>
            <TabsTrigger value="courses">
              <BookOpen className="h-4 w-4 ml-2" />
              קורסים
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Star className="h-4 w-4 ml-2" />
              המלצות
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
          
          <div className="mb-4">
            <Button onClick={() => navigate('/admin/chat')} variant="outline">
              <MessageCircle className="h-4 w-4 ml-2" />
              צ׳אט תמיכה
            </Button>
          </div>

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
                          price_number: 0,
                          locations: [''],
                          times: [''],
                          slug: ''
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

                      <div>
                        <Label htmlFor="courseSlug">Slug (כתובת URL)</Label>
                        <Input
                          id="courseSlug"
                          value={courseForm.slug}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                          placeholder="python-game-dev"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          יתמלא אוטומטית מהכותרת, ניתן לערוך ידנית (רק אותיות אנגליות, מספרים ומקפים)
                        </p>
                      </div>

                      <div className="md:col-span-2"></div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>מקומות לימוד</Label>
                        <div className="space-y-2 mt-2">
                          {courseForm.locations.map((location, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={location}
                                onChange={(e) => updateLocation(index, e.target.value)}
                                placeholder="למשל: בית ספר תכנותא"
                                className="flex-1"
                              />
                              {courseForm.locations.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeLocation(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button type="button" variant="outline" onClick={addLocation} size="sm">
                            <Plus className="h-4 w-4 ml-2" />
                            הוסף מקום
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>ימים ושעות</Label>
                        <div className="space-y-2 mt-2">
                          {courseForm.times.map((time, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={time}
                                onChange={(e) => updateTime(index, e.target.value)}
                                placeholder="למשל: יום א׳ 16:00-17:30"
                                className="flex-1"
                              />
                              {courseForm.times.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeTime(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button type="button" variant="outline" onClick={addTime} size="sm">
                            <Plus className="h-4 w-4 ml-2" />
                            הוסף זמן
                          </Button>
                        </div>
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
                            <div className="flex flex-col gap-2 ml-4">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/courses/${course.id}/lessons`)}
                                >
                                  <BookOpen className="h-4 w-4 ml-1" />
                                  שיעורים
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/courses/${course.id}/permissions`)}
                                >
                                  <Users className="h-4 w-4 ml-1" />
                                  הרשאות
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/courses/${course.id}/periods`)}
                                >
                                  <Calendar className="h-4 w-4 ml-1" />
                                  תקופות
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/courses/${course.id}/variants`)}
                                >
                                  <Settings className="h-4 w-4 ml-1" />
                                  מחזורי לימוד
                                </Button>
                              </div>
                              <div className="flex gap-2">
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
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>ניהול המלצות הורים</CardTitle>
                    <CardDescription>
                      ערוך המלצות קיימות או הוסף המלצות חדשות ({recommendations.length} המלצות)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={fetchRecommendations} variant="outline">
                      <RefreshCw className="h-4 w-4 ml-2" />
                      רענן
                    </Button>
                    <Button onClick={() => {
                      setShowNewRecommendationForm(true);
                      setEditingRecommendation(null);
                      setRecommendationForm({
                        parent_name: '',
                        child_name: '',
                        recommendation_text: '',
                        rating: 5,
                        is_approved: true,
                        is_featured: false,
                        sort_order: 0
                      });
                    }}>
                      <Plus className="h-4 w-4 ml-2" />
                      הוסף המלצה חדשה
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showNewRecommendationForm ? (
                  <div className="space-y-6 p-6 border rounded-lg bg-muted/30 mb-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {editingRecommendation ? 'עריכת המלצה' : 'הוספת המלצה חדשה'}
                      </h3>
                      <Button variant="outline" onClick={() => {
                        setShowNewRecommendationForm(false);
                        setEditingRecommendation(null);
                      }}>
                        ביטול
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentName">שם ההורה *</Label>
                        <Input
                          id="parentName"
                          value={recommendationForm.parent_name}
                          onChange={(e) => setRecommendationForm(prev => ({ ...prev, parent_name: e.target.value }))}
                          placeholder="למשל: דוד כהן"
                        />
                      </div>

                      <div>
                        <Label htmlFor="childName">שם הילד (אופציונלי)</Label>
                        <Input
                          id="childName"
                          value={recommendationForm.child_name}
                          onChange={(e) => setRecommendationForm(prev => ({ ...prev, child_name: e.target.value }))}
                          placeholder="למשל: יוסף כהן"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="recommendationText">תוכן ההמלצה *</Label>
                        <Textarea
                          id="recommendationText"
                          value={recommendationForm.recommendation_text}
                          onChange={(e) => setRecommendationForm(prev => ({ ...prev, recommendation_text: e.target.value }))}
                          placeholder="כתוב כאן את תוכן ההמלצה..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="rating">דירוג (1-5)</Label>
                        <Select 
                          value={recommendationForm.rating?.toString() || '5'} 
                          onValueChange={(value) => setRecommendationForm(prev => ({ ...prev, rating: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 כוכב</SelectItem>
                            <SelectItem value="2">2 כוכבים</SelectItem>
                            <SelectItem value="3">3 כוכבים</SelectItem>
                            <SelectItem value="4">4 כוכבים</SelectItem>
                            <SelectItem value="5">5 כוכבים</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="sortOrder">סדר הצגה</Label>
                        <Input
                          id="sortOrder"
                          type="number"
                          value={recommendationForm.sort_order}
                          onChange={(e) => setRecommendationForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          המלצות עם מספר נמוך יותר יוצגו ראשונות
                        </p>
                      </div>

                      <div className="md:col-span-2 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Switch
                            id="isApproved"
                            checked={recommendationForm.is_approved}
                            onCheckedChange={(checked) => setRecommendationForm(prev => ({ ...prev, is_approved: checked }))}
                          />
                          <Label htmlFor="isApproved" className="cursor-pointer">
                            מאושר להצגה באתר
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            id="isFeatured"
                            checked={recommendationForm.is_featured}
                            onCheckedChange={(checked) => setRecommendationForm(prev => ({ ...prev, is_featured: checked }))}
                          />
                          <Label htmlFor="isFeatured" className="cursor-pointer">
                            המלצה מובילה
                          </Label>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <Button onClick={saveRecommendation} className="w-full">
                          <Save className="h-4 w-4 ml-2" />
                          {editingRecommendation ? 'עדכן המלצה' : 'שמור המלצה'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-4">
                  {recommendations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      עדיין אין המלצות. לחץ על "הוסף המלצה חדשה" כדי להתחיל.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recommendations.map((rec) => (
                        <Card key={rec.id} className={rec.is_featured ? 'border-primary/50' : ''}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{rec.parent_name}</h4>
                                  {rec.child_name && (
                                    <span className="text-sm text-muted-foreground">(הורה של {rec.child_name})</span>
                                  )}
                                  {rec.is_featured && (
                                    <Badge variant="default" className="bg-primary">מובילה</Badge>
                                  )}
                                  {rec.is_approved ? (
                                    <Badge variant="outline" className="text-green-600 border-green-600">מאושר</Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-orange-600 border-orange-600">ממתין לאישור</Badge>
                                  )}
                                  {rec.rating && (
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < rec.rating!
                                              ? 'fill-yellow-400 text-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <p className="text-muted-foreground mb-2">"{rec.recommendation_text}"</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>סדר: {rec.sort_order || 0}</span>
                                  <span>נוצר: {new Date(rec.created_at).toLocaleDateString('he-IL')}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editRecommendation(rec)}
                                >
                                  <Edit className="h-4 w-4 ml-2" />
                                  ערוך
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteRecommendation(rec.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 ml-2" />
                                  מחק
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
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
                              <TableHead>מגדר</TableHead>
                              <TableHead>טלפון</TableHead>
                              <TableHead>אימייל</TableHead>
                              <TableHead>קורס</TableHead>
                              <TableHead>תקופת לימוד</TableHead>
                              <TableHead>מקום</TableHead>
                              <TableHead>כיתה</TableHead>
                              <TableHead>יום ושעה</TableHead>
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
                                <TableCell>{registration.gender || '-'}</TableCell>
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
                                <TableCell>{registration.learning_period || '-'}</TableCell>
                                <TableCell>{registration.location || '-'}</TableCell>
                                <TableCell>{registration.grade || '-'}</TableCell>
                                <TableCell>{registration.time || '-'}</TableCell>
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>דוחות וניתוחים</CardTitle>
                    <CardDescription>
                      תמונת מצב על הרשמות, טיפול בפניות ותפוסה לפי קורסים
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchRegistrations} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                    רענן נתונים
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-primary/20">
                    <CardHeader className="pb-2">
                      <CardDescription>סה״כ פניות/הרשמות</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{totalRegistrations}</span>
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        כל הטפסים שנשלחו מהאתר
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>פניות בטיפול</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{totalHandled}</span>
                        <TrendingUp className="h-6 w-6 text-accent" />
                      </div>
                      <div className="mt-2 space-y-1">
                        <Progress value={handledPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {handledPercentage}% מהפניות סומנו כ&quot;נוצר קשר&quot;, &quot;נרשם&quot; או &quot;דחה&quot;
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>נרשמים לקורסים</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">{enrolledRegistrations}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <Progress value={enrolledPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {enrolledPercentage}% מכלל הפניות סומנו כ&quot;נרשם&quot;
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>התפלגות לפי מגדר</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>בנים</span>
                          <span className="font-medium">{genderStats.male}</span>
                        </div>
                        <Progress
                          value={
                            totalRegistrations
                              ? (genderStats.male / totalRegistrations) * 100
                              : 0
                          }
                          className="h-1.5"
                        />
                        <div className="flex justify-between mt-1">
                          <span>בנות</span>
                          <span className="font-medium">{genderStats.female}</span>
                        </div>
                        <Progress
                          value={
                            totalRegistrations
                              ? (genderStats.female / totalRegistrations) * 100
                              : 0
                          }
                          className="h-1.5"
                        />
                        {genderStats.unknown > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {genderStats.unknown} ללא מגדר מוגדר
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Per-course stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">הרשמות לפי קורס</CardTitle>
                      <CardDescription>
                        כמה פניות ונרשמים יש לכל קורס
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(registrationsByCourse).length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          עדיין אין מספיק נתונים להצגת דוח זה.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {(Object.entries(registrationsByCourse) as [string, { total: number; enrolled: number }][]).map(
                            ([courseName, stats]) => {
                              const enrollRate = stats.total
                                ? Math.round((stats.enrolled / stats.total) * 100)
                                : 0;
                              return (
                                <div key={courseName} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">{courseName}</span>
                                    <span className="text-muted-foreground">
                                      {stats.enrolled} נרשמים מתוך {stats.total} פניות
                                    </span>
                                  </div>
                                  <Progress value={enrollRate} className="h-1.5" />
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">הרשמות אחרונות</CardTitle>
                      <CardDescription>
                        חמש הפניות האחרונות שנקלטו במערכת
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentRegistrations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          עדיין אין פניות להצגה.
                        </p>
                      ) : (
                        <div className="space-y-2 text-sm">
                          {recentRegistrations.map((reg) => (
                            <div
                              key={reg.id}
                              className="flex items-center justify-between border rounded-md px-3 py-2"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {reg.name} · {reg.course}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(reg.created_at).toLocaleString('he-IL')}
                                </p>
                              </div>
                              <Badge className={`ml-2 ${getStatusColor(reg.status)}`}>
                                {reg.status === 'new' && 'חדש'}
                                {reg.status === 'contacted' && 'נוצר קשר'}
                                {reg.status === 'enrolled' && 'נרשם'}
                                {reg.status === 'declined' && 'דחה'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <p className="text-xs text-muted-foreground">
                  הנתונים מבוססים על טופסי ההרשמה שנשלחו דרך האתר. לעיבוד נוסף ניתן לייצא נתונים מטבלת
                  <code className="mx-1">registrations</code> ישירות מ־Supabase.
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