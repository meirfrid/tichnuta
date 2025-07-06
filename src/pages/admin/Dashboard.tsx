import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
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
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { siteContent, saveSiteContent, resetToDefault } = useSiteContent();

  const [courses, setCourses] = useState([
    { id: 1, name: "פיתוח משחקים בקוד", age: "א'-ב'", price: 150 },
    { id: 2, name: "פיתוח משחקים בסקראץ", age: "ג'-ד'", price: 120 },
    { id: 3, name: "פיתוח אפליקציות", age: "ה'-ו'", price: 180 },
    { id: 4, name: "פיתוח משחקים בפייתון", age: "ז'-ח'", price: 200 }
  ]);

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

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
                <CardTitle>ניהול קורסים</CardTitle>
                <CardDescription>
                  ערוך את פרטי הקורסים והמחירים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>שם הקורס</Label>
                          <Input value={course.name} readOnly />
                        </div>
                        <div>
                          <Label>גילאים</Label>
                          <Input value={course.age} readOnly />
                        </div>
                        <div>
                          <Label>מחיר (₪)</Label>
                          <Input 
                            type="number" 
                            value={course.price}
                            onChange={(e) => {
                              const newPrice = parseInt(e.target.value);
                              setCourses(prev => prev.map(c => 
                                c.id === course.id ? { ...c, price: newPrice } : c
                              ));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={handleSaveContent} className="w-full mt-4">
                  <Save className="h-4 w-4 ml-2" />
                  שמור שינויים בקורסים
                </Button>
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