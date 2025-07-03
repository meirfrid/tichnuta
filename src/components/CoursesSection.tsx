import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, Gamepad2, Smartphone, Bot, Clock, Users, Star } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const courses = [
  {
    id: 1,
    title: "פיתוח משחקים בקוד",
    subtitle: "כיתות א'-ב'",
    icon: Code2,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    description: "היכרות ראשונית עם עולם התכנות דרך יצירת משחקים פשוטים וכיפיים",
    features: [
      "יסודות תכנות בסביבה ידידותית",
      "יצירת משחקים אינטראקטיביים",
      "פיתוח חשיבה לוגית",
      "עבודה עם אנימציות פשוטות"
    ],
    duration: "שעה וחצי שבועית",
    groupSize: "עד 8 ילדים",
    level: "מתחילים",
    price: "₪280 לחודש"
  },
  {
    id: 2,
    title: "פיתוח משחקים בסקראץ",
    subtitle: "כיתות ג'-ד'",
    icon: Gamepad2,
    color: "bg-gradient-to-br from-orange-500 to-red-500",
    description: "למידת תכנות באמצעות סקראץ - פלטפורמה חזותית ומהנה ליצירת משחקים",
    features: [
      "תכנות חזותי עם בלוקים",
      "יצירת משחקים מתקדמים יותר",
      "עבודה עם דמויות ורקעים",
      "הבנת מושגי תכנות בסיסיים"
    ],
    duration: "שעה וחצי שבועית",
    groupSize: "עד 8 ילדים",
    level: "בסיסי",
    price: "₪300 לחודש"
  },
  {
    id: 3,
    title: "פיתוח אפליקציות",
    subtitle: "כיתות ה'-ו'",
    icon: Smartphone,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    description: "בניית אפליקציות אמיתיות לטלפון החכם באמצעות App Inventor",
    features: [
      "פיתוח אפליקציות לאנדרואיד",
      "עיצוב ממשק משתמש",
      "עבודה עם חיישנים",
      "פרסום אפליקציות"
    ],
    duration: "שעתיים שבועית",
    groupSize: "עד 6 ילדים",
    level: "בינוני",
    price: "₪350 לחודש"
  },
  {
    id: 4,
    title: "פיתוח משחקים בפייתון",
    subtitle: "כיתות ז'-ח'",
    icon: Bot,
    color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    description: "למידת שפת תכנות מקצועית ופיתוח משחקים מתקדמים",
    features: [
      "שפת פייתון מקצועית",
      "פיתוח משחקים מתקדמים",
      "אלגוריתמים ומבני נתונים",
      "הכנה לעתיד טכנולוגי"
    ],
    duration: "שעתיים שבועית",
    groupSize: "עד 6 ילדים",
    level: "מתקדם",
    price: "₪400 לחודש"
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "מתחילים":
      return "bg-green-100 text-green-800";
    case "בסיסי":
      return "bg-blue-100 text-blue-800";
    case "בינוני":
      return "bg-orange-100 text-orange-800";
    case "מתקדם":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CoursesSection = () => {
  const { siteContent } = useSiteContent();
  
  return (
    <section id="courses" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{siteContent.coursesTitle}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {siteContent.coursesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => {
            const IconComponent = course.icon;
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-card transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${course.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                        <p className="text-muted-foreground font-medium">{course.subtitle}</p>
                      </div>
                    </div>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{course.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">מה נלמד:</h4>
                    <ul className="space-y-2">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">משך שיעור</p>
                      <p className="text-sm font-medium">{course.duration}</p>
                    </div>
                    <div className="text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">גודל קבוצה</p>
                      <p className="text-sm font-medium">{course.groupSize}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">מחיר</p>
                      <p className="text-lg font-bold text-primary">{course.price}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                    לפרטים והרשמה
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-card border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground">מעוניין בפרטים נוספים?</h3>
            <p className="text-muted-foreground mb-6">
              נשמח לספר לך עוד על הקורסים ולעזור לך לבחור את הקורס המתאים ביותר
            </p>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              צור קשר לייעוץ חינם
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;