import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  BookOpen, 
  Users, 
  MessageSquare, 
  BarChart3, 
  LogOut,
  Save,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Site content state
  const [siteContent, setSiteContent] = useState({
    heroTitle: "חוגי תכנות לילדים מהמגזר החרדי",
    heroSubtitle: "למדו תכנות בצורה מהנה ומותאמת לערכים שלכם",
    aboutText: "אנחנו מספקים חינוך טכנולוגי איכותי המותאם לקהילה החרדית",
    contactPhone: "050-123-4567",
    contactEmail: "info@programta.co.il",
    contactAddress: "רחוב הרב קוק 15, בני ברק"
  });

  const [courses, setCourses] = useState([
    { id: 1, name: "פיתוח משחקים בקוד", age: "א'-ב'", price: 150 },
    { id: 2, name: "פיתוח משחקים בסקראץ", age: "ג'-ד'", price: 120 },
    { id: 3, name: "פיתוח אפליקציות", age: "ה'-ו'", price: 180 },
    { id: 4, name: "פיתוח משחקים בפייתון", age: "ז'-ח'", price: 200 }
  ]);

  const handleSaveContent = () => {
    // TODO: Save to Supabase
    toast({
      title: "התוכן נשמר בהצלחה",
      description: "השינויים יוצגו באתר",
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
                <CardTitle>עריכת תוכן האתר</CardTitle>
                <CardDescription>
                  ערוך את הטקסטים והתוכן שמוצגים באתר
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="heroTitle">כותרת ראשית</Label>
                      <Input
                        id="heroTitle"
                        value={siteContent.heroTitle}
                        onChange={(e) => setSiteContent(prev => ({
                          ...prev,
                          heroTitle: e.target.value
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="heroSubtitle">תת כותרת</Label>
                      <Textarea
                        id="heroSubtitle"
                        value={siteContent.heroSubtitle}
                        onChange={(e) => setSiteContent(prev => ({
                          ...prev,
                          heroSubtitle: e.target.value
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="aboutText">טקסט אודות</Label>
                      <Textarea
                        id="aboutText"
                        value={siteContent.aboutText}
                        onChange={(e) => setSiteContent(prev => ({
                          ...prev,
                          aboutText: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contactPhone">טלפון</Label>
                      <Input
                        id="contactPhone"
                        value={siteContent.contactPhone}
                        onChange={(e) => setSiteContent(prev => ({
                          ...prev,
                          contactPhone: e.target.value
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">אימייל</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={siteContent.contactEmail}
                        onChange={(e) => setSiteContent(prev => ({
                          ...prev,
                          contactEmail: e.target.value
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactAddress">כתובת</Label>
                      <Input
                        id="contactAddress"
                        value={siteContent.contactAddress}
                        onChange={(e) => setSiteContent(prev => ({
                          ...prev,
                          contactAddress: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveContent} className="w-full">
                  <Save className="h-4 w-4 ml-2" />
                  שמור שינויים
                </Button>
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
                <CardTitle>ניהול תלמידים</CardTitle>
                <CardDescription>
                  רשימת התלמידים וההרשמות
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  אזור זה יוכל להציג רשימת תלמידים רשומים כאשר יהיו הרשמות דרך האתר
                </p>
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