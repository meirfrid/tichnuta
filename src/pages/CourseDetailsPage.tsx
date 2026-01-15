import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Code2,
  Gamepad2,
  Smartphone,
  Bot,
  Clock,
  Users,
  Star,
  MapPin,
  Calendar,
  Monitor,
  Building,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/CoursesSection";

// Technology descriptions for each course type
const technologyDescriptions: Record<string, { name: string; description: string }> = {
  scratch: {
    name: "Scratch",
    description: "שפת תכנות ויזואלית המאפשרת ליצור משחקים ואנימציות באמצעות גרירת בלוקים צבעוניים",
  },
  python: {
    name: "Python",
    description: "שפת תכנות מודרנית ונפוצה בעולם, מושלמת ללמידה ופיתוח מתקדם",
  },
  appinventor: {
    name: "App Inventor",
    description: "כלי ליצירת אפליקציות לאנדרואיד באמצעות ממשק ויזואלי ידידותי",
  },
};

// FAQ items for courses
const defaultFAQs = [
  {
    question: "האם נדרש ידע קודם בתכנות?",
    answer: "לא! הקורסים מותאמים למתחילים לחלוטין. המדריכים שלנו מלווים את הילדים צעד אחר צעד.",
  },
  {
    question: "מה קורה אם הילד מפספס שיעור?",
    answer: "כל השיעורים מוקלטים ונשלחים לתלמידים. ניתן לצפות בהקלטות בכל זמן ולהשלים חומר שהוחמץ.",
  },
  {
    question: "איך נראה שיעור טיפוסי?",
    answer: "השיעורים משלבים הסבר תיאורטי קצר עם הרבה תרגול מעשי. הילדים בונים פרויקטים אמיתיים ומקבלים משוב אישי.",
  },
];

interface CourseSchedule {
  id: string;
  course_id: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string | null;
}

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    if (courseId) {
      // גלילה לראש הדף בכל כניסה לעמוד פרטי קורס
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      fetchCourse();
      fetchSchedules();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) {
        console.error("Error fetching course:", error);
      } else {
        setCourse(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("course_schedules")
        .select("*")
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching schedules:", error);
      } else {
        setSchedules(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Group schedules by location type (online vs frontal)
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const isOnline = schedule.location.toLowerCase().includes("אונליין") || 
                     schedule.location.toLowerCase().includes("online") ||
                     schedule.location.toLowerCase().includes("zoom");
    const key = isOnline ? "online" : "frontal";
    if (!acc[key]) acc[key] = {};
    if (!acc[key][schedule.location]) acc[key][schedule.location] = [];
    acc[key][schedule.location].push(schedule);
    return acc;
  }, {} as Record<string, Record<string, CourseSchedule[]>>);

  const iconMap: Record<string, any> = {
    Code2,
    Gamepad2,
    Smartphone,
    Bot,
  };

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

  const isOnlineCourse = (course: any) => {
    return course?.locations?.some(
      (loc: string) =>
        loc.toLowerCase().includes("אונליין") ||
        loc.toLowerCase().includes("online") ||
        loc.toLowerCase().includes("zoom")
    );
  };

  const getTechnologyKey = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("scratch")) return "scratch";
    if (lowerTitle.includes("python") || lowerTitle.includes("פייתון")) return "python";
    if (lowerTitle.includes("app inventor") || lowerTitle.includes("אפליקציות")) return "appinventor";
    return "scratch";
  };

  const handleRegister = () => {
    // Open registration form dialog on this page (stay on course details)
    setIsRegistrationOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-xl text-muted-foreground">הקורס לא נמצא</p>
          <Button onClick={() => navigate("/")}>חזרה לדף הבית</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = iconMap[course.icon] || Code2;
  const isOnline = isOnlineCourse(course);
  const techKey = getTechnologyKey(course.title);
  const techInfo = technologyDescriptions[techKey];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה לכל הקורסים
        </Button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className={`p-3 rounded-xl ${course.color}`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      isOnline
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-green-500 text-green-600 bg-green-50"
                    }
                  >
                    {isOnline ? (
                      <>
                        <Monitor className="h-3 w-3 ml-1" />
                        חוג אונליין
                      </>
                    ) : (
                      <>
                        <Building className="h-3 w-3 ml-1" />
                        חוג פרונטלי
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                {course.title}
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                {course.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Technology Badge */}
            {techInfo && (
              <Card className="bg-muted/50 border-none">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${course.color}`}>
                      <Code2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        טכנולוגיה: {techInfo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {techInfo.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What You'll Learn */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                מה נלמד בקורס
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.features?.map((feature: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who Is This For */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  למי הקורס מתאים?
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    ילדים ובני נוער המעוניינים ללמוד תכנות
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    לא נדרש ידע קודם בתכנות או במחשבים
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    מתאים לילדים שאוהבים ליצור, לחשוב ולפתור בעיות
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Online Course Info */}
            {isOnline && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Monitor className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        שיעורים אונליין ב-Zoom
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        השיעורים מועברים אונליין בשידור חי דרך Zoom. כל שיעור מוקלט
                        וזמין לצפייה חוזרת, כך שתמיד אפשר להשלים חומר שהוחמץ.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                שאלות נפוצות
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {defaultFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-right hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <Card className="shadow-lg border-2 border-primary/20">
                <CardContent className="p-6 space-y-6">
                  {/* Price */}
                  <div className="text-center pb-4 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-1">מחיר חודשי</p>
                    <p className="text-4xl font-bold text-primary">
                      {course.price_text}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">משך שיעור</p>
                        <p className="font-medium text-foreground">{course.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">גודל קבוצה</p>
                        <p className="font-medium text-foreground">{course.group_size}</p>
                      </div>
                    </div>

                    {/* Schedules from course_schedules table */}
                    {Object.keys(groupedSchedules).length > 0 && (
                      <div className="space-y-4">
                        {groupedSchedules.online && Object.keys(groupedSchedules.online).length > 0 && (
                          <div className="flex items-start gap-3">
                            <Monitor className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground font-medium mb-2">חוגים אונליין</p>
                              {Object.entries(groupedSchedules.online).map(([location, locationSchedules]) => (
                                <div key={location} className="mb-2">
                                  <p className="font-medium text-foreground text-sm">{location}</p>
                                  <div className="space-y-1">
                                    {locationSchedules.map((schedule) => (
                                      <p key={schedule.id} className="text-sm text-muted-foreground">
                                        {schedule.day_of_week} {schedule.start_time}{schedule.end_time ? ` - ${schedule.end_time}` : ''}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {groupedSchedules.frontal && Object.keys(groupedSchedules.frontal).length > 0 && (
                          <div className="flex items-start gap-3">
                            <Building className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground font-medium mb-2">חוגים פרונטליים</p>
                              {Object.entries(groupedSchedules.frontal).map(([location, locationSchedules]) => (
                                <div key={location} className="mb-2">
                                  <p className="font-medium text-foreground text-sm">{location}</p>
                                  <div className="space-y-1">
                                    {locationSchedules.map((schedule) => (
                                      <p key={schedule.id} className="text-sm text-muted-foreground">
                                        {schedule.day_of_week} {schedule.start_time}{schedule.end_time ? ` - ${schedule.end_time}` : ''}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fallback to old times/locations if no schedules */}
                    {Object.keys(groupedSchedules).length === 0 && course.times && course.times.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">זמני שיעורים</p>
                          <div className="space-y-1">
                            {course.times.map((time: string, index: number) => (
                              <p key={index} className="font-medium text-foreground text-sm">
                                {time}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {Object.keys(groupedSchedules).length === 0 && course.locations && course.locations.length > 0 && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">מיקומים</p>
                          <div className="space-y-1">
                            {course.locations.map((location: string, index: number) => (
                              <p key={index} className="font-medium text-foreground text-sm">
                                {location}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                    onClick={handleRegister}
                  >
                    להרשמה לקורס
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    מילוי הטופס אינו מחייב. נציג ייצור איתכם קשר לפרטים נוספים.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Registration dialog for this specific course - rendered only when opened, without extra trigger button */}
      {course && isRegistrationOpen && (
        <ContactForm
          selectedCourse={course.title}
          courses={[course]}
          forceOpen={true}
          onClose={() => setIsRegistrationOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
