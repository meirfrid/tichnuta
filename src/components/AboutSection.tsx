import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Heart, Trophy, Users } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: "חינוך ערכי",
      description: "לימוד תכנות בסביבה מותאמת לילדים חרדים עם דגש על ערכים יהודיים"
    },
    {
      icon: Trophy,
      title: "איכות מקצועית",
      description: "מורים מקצועיים ומנוסים עם תוכניות לימוד מתקדמות ומותאמות"
    },
    {
      icon: Users,
      title: "קבוצות קטנות",
      description: "למידה אישית וממוקדת בקבוצות קטנות למקסימום התקדמות"
    },
    {
      icon: CheckCircle,
      title: "הוכחת הצלחה",
      description: "תלמידים שלנו ממשיכים ללימודי הנדסה ומחשבים ברמה גבוהה"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">אודות תכנותא</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">
                תכנותא היא מובילה בחינוך טכנולוגי לילדים מהמגזר החרדי. אנחנו מאמינים שכל ילד 
                יכול ללמוד תכנות ולהצליח בעולם הטכנולוגיה, תוך שמירה על הערכים והמסורת שלנו.
              </p>
              <p>
                הקורסים שלנו מעוצבים במיוחד כדי להתאים לילדים חרדים, עם תכנים מותאמים 
                ופדגוגיה שמתחשבת בצרכים הייחודיים של הקהילה. אנחנו גאים במאות הילדים שעברו 
                דרכנו וממשיכים ללימודים גבוהים בתחום.
              </p>
              <p>
                המטרה שלנו היא לפתח את הדור הבא של מתכנתים ומפתחים מהמגזר החרדי, 
                ולתת להם את הכלים הנדרשים להצלחה בעולם הטכנולוגיה המודרני.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">תלמידים</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-sm text-muted-foreground">שנות ניסיון</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">שביעות רצון</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-2 border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="mt-16 bg-gradient-card border-2 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">המשימה שלנו</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              להכשיר את הדור הבא של מתכנתים ומפתחים מהמגזר החרדי, תוך שמירה על הזהות 
              והערכים היהודיים, ולאפשר להם להשתלב בהצלחה בעולם הטכנולוגיה המתפתח.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;