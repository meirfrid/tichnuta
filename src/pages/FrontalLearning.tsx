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
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FrontalLearning = () => {
  const navigate = useNavigate();

  const advantages = [
    {
      icon: Users,
      title: "קבוצות קטנות",
      description: "למידה בקבוצות של עד 8 ילדים לתשומת לב מקסימלית לכל תלמיד"
    },
    {
      icon: HandHelping,
      title: "הדרכה אישית",
      description: "מדריך מקצועי שעוזר בזמן אמת ומתאים את הקצב לכל ילד"
    },
    {
      icon: MessageCircle,
      title: "אינטראקציה חיה",
      description: "שאלות ותשובות בזמן אמת, ללא המתנה לתגובות"
    },
    {
      icon: UserCheck,
      title: "מעקב צמוד",
      description: "המדריך עוקב אחרי ההתקדמות ומוודא שכל ילד מבין"
    },
    {
      icon: Sparkles,
      title: "חוויה חברתית",
      description: "ללמוד עם חברים, לשתף רעיונות ולעבוד על פרויקטים משותפים"
    },
    {
      icon: Target,
      title: "מוטיבציה גבוהה",
      description: "המפגש הקבוע יוצר מחויבות וממריץ להתקדמות רציפה"
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
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              למידה פנים אל פנים עם מדריך מקצועי בקבוצות קטנות
            </p>
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
              onClick={() => navigate("/#courses")}
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
