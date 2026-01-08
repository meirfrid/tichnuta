import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Award, Users } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">אודות תכנותא</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            אנחנו מאמינים שכל ילד יכול ללמוד לתכנת. המשימה שלנו היא להנגיש את עולם התכנות לילדים בצורה מהנה, יצירתית ומותאמת אישית.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">החזון שלנו</h3>
              <p className="text-muted-foreground text-sm">
                להכשיר את הדור הבא של יוצרי הטכנולוגיה ולתת לכל ילד את הכלים להגשים את החלומות שלו
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">הגישה שלנו</h3>
              <p className="text-muted-foreground text-sm">
                למידה דרך משחק ויצירה - כל שיעור הוא חוויה מהנה שמפתחת חשיבה לוגית ויצירתיות
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">הניסיון שלנו</h3>
              <p className="text-muted-foreground text-sm">
                צוות מדריכים מקצועי עם ניסיון רב בהוראת תכנות לילדים ונוער
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">הקהילה שלנו</h3>
              <p className="text-muted-foreground text-sm">
                מאות תלמידים מרוצים שכבר למדו איתנו ויצרו פרויקטים מדהימים
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">למה ללמוד תכנות בגיל צעיר?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  פיתוח חשיבה לוגית ויכולת פתרון בעיות
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  עידוד יצירתיות וחשיבה מחוץ לקופסה
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  הכנה לעתיד בעולם טכנולוגי
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  בניית ביטחון עצמי דרך יצירת פרויקטים אמיתיים
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  למידה בסביבה תומכת ומעודדת
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 text-center">
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-muted-foreground mb-6">תלמידים למדו איתנו</div>
              <div className="text-5xl font-bold text-primary mb-2">5+</div>
              <div className="text-lg text-muted-foreground mb-6">שנות ניסיון</div>
              <div className="text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-lg text-muted-foreground">שביעות רצון</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
