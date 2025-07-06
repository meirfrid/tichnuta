import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Gamepad2, Smartphone, Bot, Clock, Users, Star } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const contactFormSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  phone: z.string().min(10, "מספר טלפון לא תקין"),
  email: z.string().email("כתובת מייל לא תקינה"),
  course: z.string().min(1, "יש לבחור קורס"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = ({ selectedCourse, buttonText = "לפרטים והרשמה" }: { selectedCourse?: string; buttonText?: string }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: selectedCourse || "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log("Form submission started");
    console.log("Contact form data:", data);
    
    try {
      // Save to database
      const { error } = await supabase
        .from('registrations')
        .insert({
          name: data.name,
          phone: data.phone,
          email: data.email,
          course: data.course,
          message: data.message || null,
        });

      if (error) {
        console.error("Database error:", error);
        toast({
          title: "שגיאה בשמירה",
          description: "אנא נסה שוב או צור קשר ישירות",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "הודעה נשלחה בהצלחה!",
        description: "ניצור איתך קשר בהקדם האפשרי",
      });
      console.log("Toast displayed successfully");
      
      form.reset();
      console.log("Form reset completed");
      
      setOpen(false);
      console.log("Dialog closed");
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "שגיאה בשמירה",
        description: "אנא נסה שוב או צור קשר ישירות",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form submit event triggered");
    console.log("Form errors:", form.formState.errors);
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            יצירת קשר להרשמה
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם מלא</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס את שמך המלא" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מספר טלפון</FormLabel>
                  <FormControl>
                    <Input placeholder="050-1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>כתובת מייל</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>קורס מעניין</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קורס" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.title}>
                          {course.title} - {course.subtitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>הודעה נוספת (אופציונלי)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="שאלות או הערות נוספות..."
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
              שלח הודעה
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
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

                  <ContactForm selectedCourse={course.title} />
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
            <ContactForm buttonText="צור קשר לייעוץ חינם" />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;