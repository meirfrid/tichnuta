import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Shield, Clock, Gamepad2, Brain } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">היתרונות שלנו</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">הפרדה מלאה</h3>
              <p className="text-muted-foreground text-sm">
                הלימודים מתקיימים בהפרדה מלאה - בנים ובנות בקבוצות נפרדות
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">מדריכים מהקהילה</h3>
              <p className="text-muted-foreground text-sm">
                כל המדריכים שלנו מגיעים מהקהילה החרדית ומבינים את הצרכים שלכם
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">קבוצות קטנות</h3>
              <p className="text-muted-foreground text-sm">
                למידה בקבוצות קטנות עם יחס אישי לכל תלמיד
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">גמישות בזמנים</h3>
              <p className="text-muted-foreground text-sm">
                מגוון שעות ומיקומים לבחירה שמתאימים ללוח הזמנים שלכם
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">למידה דרך משחק</h3>
                  <p className="text-muted-foreground">
                    כל שיעור הוא חוויה מהנה - הילדים לומדים תכנות תוך כדי יצירת משחקים ופרויקטים מרתקים
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">פיתוח חשיבה לוגית</h3>
                  <p className="text-muted-foreground">
                    התכנות מפתח יכולות חשיבה, פתרון בעיות ויצירתיות שמלוות את הילד לכל החיים
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
