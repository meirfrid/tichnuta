import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Award, Users, UserCheck, Shield } from "lucide-react";

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

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">הפרדה מלאה</h3>
                  <p className="text-muted-foreground">
                    .הלימודים מתקיימים בהפרדה מלאה - בנים ובנות בקבוצות נפרדות.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">מדריכים מהקהילה</h3>
                  <p className="text-muted-foreground">
                    כל המדריכים שלנו מגיעים מהקהילה החרדית.  
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
