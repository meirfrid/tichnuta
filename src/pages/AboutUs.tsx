import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Target, Heart, BookOpen, Lightbulb, Award, GraduationCap, Code, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import founderPhoto from "@/assets/founder-photo.jpeg";

const AboutUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.phone || !formData.email) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error } = await supabase
        .from('registrations')
        .insert({
          name: fullName,
          phone: formData.phone,
          email: formData.email,
          course: "יצירת קשר מדף מי אנחנו",
          message: formData.message,
          status: "new"
        });

      if (error) throw error;

      toast({
        title: "הודעה נשלחה בהצלחה!",
        description: "נחזור אליך תוך 24 שעות",
      });

      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: ""
      });
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת ההודעה. אנא נסה שוב.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              מי אנחנו
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium mb-4">
              תכנותא – חוגי תכנות מקצועיים לילדים
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              מפתחים את דור המתכנתים הצעיר – בצורה מקצועית, חווייתית וערכית
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/5">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      ברוכים הבאים לתכנותא
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    תכנותא הוא מיזם חינוכי-חברתי ייחודי, שמטרתו ללמד ילדים תכנות ברמה מקצועית גבוהה. 
                    אנחנו משלבים חוויית למידה מהנה עם פיתוח חשיבה לוגית, יצירתיות וכלים מעשיים 
                    שיכינו את הילדים לעולם העתיד. בתכנותא, כל ילד מקבל את הכלים והביטחון להפוך 
                    ליוצר ולא רק לצרכן של טכנולוגיה.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  מאיר פריד – מייסד תכנותא
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Founder Image */}
                <div className="md:col-span-1">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={founderPhoto} 
                      alt="מאיר פריד - מייסד תכנותא" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Founder Bio */}
                <div className="md:col-span-2">
                  <Card className="border-none shadow-lg h-full">
                    <CardContent className="p-8">
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        שמי מאיר פריד, מייסד תכנותא. אני בוגר ישיבת חברון, בעל תואר בפסיכולוגיה 
                        ותואר במדעי המחשב. במהלך השנים צברתי ניסיון רב בהדרכת ילדים ונוער בחוגי תכנות, 
                        ובמקביל אני עובד כמתכנת בתעשיית ההייטק.
                      </p>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        השילוב הייחודי של ידע טכנולוגי עמוק יחד עם הבנה חינוכית ורגשית של ילדים, 
                        מאפשר לי ליצור סביבת למידה מקצועית אך גם חמה ותומכת. אני מאמין שכל ילד 
                        יכול ללמוד תכנות, כשהוא מקבל את ההדרכה הנכונה ביחס אישי.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-5 w-5 text-primary" />
                          <span>בוגר ישיבת חברון</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <span>תואר בפסיכולוגיה</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Code className="h-5 w-5 text-primary" />
                          <span>תואר במדעי המחשב</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-5 w-5 text-primary" />
                          <span>מתכנת בתעשייה</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  החזון של תכנותא
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">חשיפה מוקדמת</h3>
                    <p className="text-muted-foreground">
                      לאפשר לילדים חרדים הזדמנות אמיתית להיחשף לעולם התכנות מגיל צעיר
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">למידה מקצועית</h3>
                    <p className="text-muted-foreground">
                      ללמד תכנות בצורה מקצועית, רצינית ועדכנית – אך גם חווייתית ומהנה
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">פיתוח אישי</h3>
                    <p className="text-muted-foreground">
                      לפתח חשיבה עצמאית, ביטחון עצמי ויכולת פתרון בעיות
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">גשר בין עולמות</h3>
                    <p className="text-muted-foreground">
                      ליצור גשר בין עולם הערכים החרדי לבין עולם ההייטק
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-2">
                  <CardContent className="p-6">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">בסיס לעתיד</h3>
                    <p className="text-muted-foreground">
                      להעניק לילדים בסיס חזק להמשך לימודים ולהשתלבות עתידית במקצועות טכנולוגיים
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Approach Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  הגישה החינוכית שלנו
                </h2>
              </div>
              
              <Card className="border-none shadow-lg">
                <CardContent className="p-8 md:p-12">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    בתכנותא אנחנו מאמינים שלמידה אמיתית מתרחשת כשהילד מרגיש בטוח, נהנה ומקבל יחס אישי. 
                    הגישה החינוכית שלנו בנויה על עקרונות ברורים:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex gap-4 items-start">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">יחס אישי</h3>
                        <p className="text-muted-foreground text-sm">
                          כל ילד מקבל תשומת לב מלאה ומענה לקצב הלמידה שלו
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">קבוצות קטנות</h3>
                        <p className="text-muted-foreground text-sm">
                          עד 10 ילדים בקבוצה לאינטראקציה אופטימלית
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">התאמה לגיל ולרמה</h3>
                        <p className="text-muted-foreground text-sm">
                          תוכנית לימודים מותאמת ליכולות ולגיל של כל קבוצה
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">הבנה אמיתית</h3>
                        <p className="text-muted-foreground text-sm">
                          דגש על הבנת העקרונות ולא רק על כתיבת קוד
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start md:col-span-2">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">חיזוק תחושת הצלחה</h3>
                        <p className="text-muted-foreground text-sm">
                          יצירת חוויות הצלחה והנאה מהלמידה שמעודדות להמשיך ולהתפתח
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section with Contact Form */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                מוכנים להתחיל?
              </h2>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                הצטרפו למאות הילדים שכבר מפתחים את הכישורים של העתיד
              </p>
            </div>
            
            <div className="max-w-xl mx-auto">
              <Card className="shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">שם פרטי *</label>
                        <Input
                          placeholder="הכנס את השם הפרטי"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">שם משפחה</label>
                        <Input
                          placeholder="הכנס את שם המשפחה"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">טלפון *</label>
                      <Input
                        placeholder="הכנס מספר טלפון"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">כתובת אימייל *</label>
                      <Input
                        placeholder="הכנס כתובת אימייל"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">הודעה</label>
                      <Textarea
                        placeholder="כתב לנו מה אתה רוצה לדעת..."
                        className="min-h-[100px]"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      שלח הודעה
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
