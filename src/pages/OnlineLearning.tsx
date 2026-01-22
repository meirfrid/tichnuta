import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Clock, Home, Video, MessageSquare, RefreshCcw, CheckCircle, ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
const OnlineLearning = () => {
  const navigate = useNavigate();
  const advantages = [{
    icon: Video,
    title: "שיעורים חיים בזום",
    description: "למידה אינטראקטיבית בזמן אמת עם מדריך מקצועי - בדיוק כמו כיתה רגילה"
  }, {
    icon: Home,
    title: "למידה מכל מקום",
    description: "ללמוד מהבית, מהסבתא או מכל מקום עם חיבור אינטרנט"
  }, {
    icon: Users,
    title: "עבודת צוות",
    description: "הילדים לומדים לעבוד יחד על פרויקטים משותפים ולפתור בעיות בשיתוף פעולה"
  }, {
    icon: RefreshCcw,
    title: "צפייה חוזרת בהקלטות",
    description: "כל השיעורים מוקלטים וזמינים באזור האישי לחזרה על החומר בכל עת"
  }, {
    icon: MessageSquare,
    title: "תמיכה רציפה",
    description: "פורום ייעודי לכל קורס עם מענה מהיר לשאלות מהמדריכים שלנו"
  }, {
    icon: Clock,
    title: "חיסכון בזמן",
    description: "ללא נסיעות והמתנות - יותר זמן ללמידה ופחות זמן על הדרך"
  }];
  const methodSteps = ["נרשמים לקורס ומקבלים גישה לפלטפורמה", "מצטרפים לשיעור חי בזום בשעה קבועה עם המדריך והקבוצה", "לומדים ומתרגלים יחד עם חברי הקבוצה בזמן אמת", "צופים בהקלטות ומתרגלים עצמאית באזור האישי", "שואלים שאלות בפורום ומקבלים מענה מהמדריך"];
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <Monitor className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">קורסים אונליין</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              שיעורים חיים בזום עם מדריך מקצועי - למידה אינטראקטיבית מכל מקום
            </p>
          </div>
        </section>

        {/* Method Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">איך זה עובד?</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {methodSteps.map((step, index) => <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-lg">{step}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">היתרונות של למידה אונליין</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {advantages.map((advantage, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <advantage.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                    <p className="text-muted-foreground">{advantage.description}</p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Who is it for Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">למי זה מתאים?</h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid gap-4">
                {["ילדים שרוצים חוויית למידה אינטראקטיבית מהבית", "משפחות שמעדיפות חיסכון בזמן נסיעות", "מי שאוהב לחזור על החומר עם צפייה בהקלטות", "ילדים שנהנים מסביבה מוכרת ונוחה", "כל מי שרוצה ללמוד תכנות בקבוצה - מכל מקום בארץ"].map((item, index) => <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-6">מוכנים להתחיל?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              בחרו את הקורס שמתאים לכם והתחילו ללמוד כבר היום
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => navigate("/courses")}>
              <ArrowLeft className="ml-2 h-5 w-5" />
              לצפייה בקורסים
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default OnlineLearning;