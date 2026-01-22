import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  HandHelping, 
  MessageCircle, 
  UserCheck, 
  Sparkles,
  Target,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FrontalLearning = () => {
  const navigate = useNavigate();

  const advantages = [
    {
      icon: Users,
      title: "מפגש פנים אל פנים",
      description: "חוויית למידה אותנטית עם נוכחות פיזית של המדריך והחברים לכיתה"
    },
    {
      icon: Sparkles,
      title: "חוויה חברתית עשירה",
      description: "יצירת חברויות אמיתיות, אינטראקציה טבעית והנאה משותפת מהלמידה"
    },
    {
      icon: HandHelping,
      title: "סביבת למידה ייעודית",
      description: "מרחב מותאם ללמידה ללא הסחות דעת מהבית, עם כל הציוד הנדרש"
    },
    {
      icon: MessageCircle,
      title: "תקשורת בלתי אמצעית",
      description: "שפת גוף, מבטים וחיוכים - תקשורת מלאה שמעשירה את חוויית הלמידה"
    },
    {
      icon: UserCheck,
      title: "שגרה ומחויבות",
      description: "מפגש קבוע במיקום מוכר יוצר הרגל למידה ותחושת מחויבות"
    },
    {
      icon: Target,
      title: "פעילויות קבוצתיות",
      description: "משחקים, תחרויות ופרויקטים משותפים שקשה לשחזר בסביבה וירטואלית"
    }
  ];

  const methodSteps = [
    "נרשמים לקורס ובוחרים מיקום ושעה נוחים",
    "מגיעים למפגש השבועי במיקום הנבחר",
    "לומדים בקבוצה קטנה עם מדריך מקצועי",
    "מתרגלים ובונים פרויקטים במהלך השיעור",
    "מקבלים משימות קצרות להמשך תרגול בבית"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <Users className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">קורסים פרונטליים</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-6">
              למידה פנים אל פנים עם מדריך מקצועי בקבוצות קטנות
            </p>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Button>
          </div>
        </section>

        {/* Method Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">איך זה עובד?</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {methodSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-lg">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">היתרונות של למידה פרונטלית</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {advantages.map((advantage, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <advantage.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                    <p className="text-muted-foreground">{advantage.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Who is it for Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">למי זה מתאים?</h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-4">
                {[
                  "ילדים שאוהבים ללמוד בקבוצה",
                  "מי שצריך הדרכה אישית וצמודה",
                  "ילדים שמתקשים להתרכז בלימוד עצמאי",
                  "מי שרוצה חוויה חברתית לצד הלמידה",
                  "ילדים שאוהבים שגרה ומפגשים קבועים"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-6">מוכנים להתחיל?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              בחרו את הקורס והמיקום שמתאימים לכם
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/courses")}
            >
              <ArrowLeft className="ml-2 h-5 w-5" />
              לצפייה בקורסים
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FrontalLearning;
