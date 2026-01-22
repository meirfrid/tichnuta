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
    answer: "כל השיעורים מוקלטים ונשלחים לתלמידים. ניתן לצפות בהקלטות בכל זמן ולהשלים את החומר.",
  },
  {
    question: "איך נראה שיעור טיפוסי?",
    answer: "השיעורים משלבים הסבר תיאורטי קצר עם הרבה תרגול מעשי. הילדים בונים פרויקטים אמיתיים ומקבלים משוב אישי.",
  },
  {
    question: "האם ניתן לבטל את ההרשמה?",
    answer: "כן! ניתן לבטל את ההרשמה בכל עת ללא התחייבות. פשוט פנו אלינו ונטפל בבקשה במהירות.",
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

interface CourseVariant {
  id: string;
  course_id: string;
  name: string;
  gender: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string | null;
  min_grade: string | null;
  max_grade: string | null;
  learning_period: string | null;
  is_active: boolean;
  sort_order: number;
}

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [variants, setVariants] = useState<CourseVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<CourseVariant | null>(null);

  useEffect(() => {
    if (courseId) {
      // גלילה לראש הדף בכל כניסה לעמוד פרטי קורס
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (course?.id) {
      fetchSchedules(course.id);
      fetchVariants(course.id);
    }
  }, [course?.id]);

  const fetchCourse = async () => {
    try {
      // First try to find by slug
      let { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", courseId)
        .single();

      // If not found by slug, try by id (for backwards compatibility)
      if (error || !data) {
        const result = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();
        data = result.data;
        error = result.error;
      }

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

  const fetchSchedules = async (realCourseId: string) => {
    try {
      const { data, error } = await supabase
        .from("course_schedules")
        .select("*")
        .eq("course_id", realCourseId);

      if (error) {
        console.error("Error fetching schedules:", error);
      } else {
        setSchedules(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchVariants = async (realCourseId: string) => {
    try {
      const { data, error } = await supabase
        .from("course_variants")
        .select("*")
        .eq("course_id", realCourseId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching variants:", error);
      } else {
        setVariants(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "boys": return "בנים";
      case "girls": return "בנות";
      case "mixed": return "מעורב";
      default: return gender;
    }
  };

  const getGradeRange = (minGrade: string | null, maxGrade: string | null) => {
    if (!minGrade && !maxGrade) return null;
    if (minGrade && maxGrade) return `${minGrade} - ${maxGrade}`;
    if (minGrade) return `מ${minGrade}`;
    if (maxGrade) return `עד ${maxGrade}`;
    return null;
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


  const getCourseTypeInfo = (course: any) => {
    const type = course?.course_type || 'frontal';
    switch (type) {
      case 'online':
        return { isOnline: true, isFrontal: false, isBoth: false };
      case 'both':
        return { isOnline: true, isFrontal: true, isBoth: true };
      case 'frontal':
      default:
        return { isOnline: false, isFrontal: true, isBoth: false };
    }
  };

  const getTechnologyKey = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("scratch")) return "scratch";
    if (lowerTitle.includes("python") || lowerTitle.includes("פייתון")) return "python";
    if (lowerTitle.includes("app inventor") || lowerTitle.includes("אפליקציות")) return "appinventor";
    return "scratch";
  };

  const handleRegister = (variant?: CourseVariant) => {
    // Open registration form dialog on this page (stay on course details)
    setSelectedVariant(variant || null);
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
  const courseTypeInfo = getCourseTypeInfo(course);
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
        <div className="space-y-8 mb-12">
          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className={`p-3 rounded-xl ${course.color}`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-wrap gap-2">
                {courseTypeInfo.isBoth ? (
                  <>
                    <Badge
                      variant="outline"
                      className="border-blue-500 text-blue-600 bg-blue-50"
                    >
                      <Monitor className="h-3 w-3 ml-1" />
                      אונליין
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-600 bg-green-50"
                    >
                      <Building className="h-3 w-3 ml-1" />
                      פרונטלי
                    </Badge>
                  </>
                ) : courseTypeInfo.isOnline ? (
                  <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-600 bg-blue-50"
                  >
                    <Monitor className="h-3 w-3 ml-1" />
                    חוג אונליין
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-600 bg-green-50"
                  >
                    <Building className="h-3 w-3 ml-1" />
                    חוג פרונטלי
                  </Badge>
                )}
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              {course.title}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
              {course.subtitle}
            </p>

            {/* Course Quick Info */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
                <span className="font-bold text-lg">{course.price_text}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>{course.group_size}</span>
              </div>
            </div>
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
            {courseTypeInfo.isOnline && (
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
                        וזמין לצפייה חוזרת, כך שתמיד אפשר להשלים את החומר.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Variants Section */}
            {variants.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  מחזורי לימוד
                </h2>
                <div className="grid gap-4">
                  {variants.map((variant) => (
                    <Card key={variant.id} className="border border-border hover:border-primary/30 transition-colors">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {variant.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-muted">
                                <Users className="h-3 w-3 ml-1" />
                                {getGenderLabel(variant.gender)}
                              </Badge>
                              <Badge variant="outline" className="bg-muted">
                                <MapPin className="h-3 w-3 ml-1" />
                                {variant.location}
                              </Badge>
                              <Badge variant="outline" className="bg-muted">
                                <Clock className="h-3 w-3 ml-1" />
                                {variant.day_of_week} {variant.start_time}{variant.end_time ? ` - ${variant.end_time}` : ''}
                              </Badge>
                              {getGradeRange(variant.min_grade, variant.max_grade) && (
                                <Badge variant="outline" className="bg-muted">
                                  כיתות: {getGradeRange(variant.min_grade, variant.max_grade)}
                                </Badge>
                              )}
                              {variant.learning_period && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                  {variant.learning_period}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-primary hover:opacity-90 transition-opacity shrink-0"
                            onClick={() => handleRegister(variant)}
                          >
                            להרשמה
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
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
      </main>

      {/* Registration dialog for this specific course - rendered only when opened, without extra trigger button */}
      {course && isRegistrationOpen && (
        <ContactForm
          selectedCourse={course.title}
          courses={[course]}
          forceOpen={true}
          onClose={() => {
            setIsRegistrationOpen(false);
            setSelectedVariant(null);
          }}
          prefilledVariant={selectedVariant ? {
            gender: selectedVariant.gender,
            location: selectedVariant.location,
            day_of_week: selectedVariant.day_of_week,
            start_time: selectedVariant.start_time,
            end_time: selectedVariant.end_time,
            learning_period: selectedVariant.learning_period
          } : undefined}
        />
      )}

      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
