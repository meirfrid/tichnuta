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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const courses = [];

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
  location: z.string().min(1, "יש לבחור מקום לימוד"),
  grade: z.string().min(1, "יש לבחור כיתה"),
  time: z.string().min(1, "יש לבחור שעת חוג"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = ({ selectedCourse, selectedCourseData, buttonText = "לפרטים והרשמה", courses = [] }: { selectedCourse?: string; selectedCourseData?: any; buttonText?: string; courses?: any[] }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: selectedCourse || "",
      location: "",
      grade: "",
      time: "",
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
          location: data.location,
          grade: data.grade,
          time: data.time,
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מקום לימוד</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מקום לימוד" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCourseData && selectedCourseData.locations && selectedCourseData.locations.length > 0 ? (
                        selectedCourseData.locations.map((location: string, index: number) => (
                          <SelectItem key={index} value={location}>
                            {location}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="לא הוגדר">לא הוגדרו מקומות</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>כיתה</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר כיתה" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="א">א</SelectItem>
                      <SelectItem value="ב">ב</SelectItem>
                      <SelectItem value="ג">ג</SelectItem>
                      <SelectItem value="ד">ד</SelectItem>
                      <SelectItem value="ה">ה</SelectItem>
                      <SelectItem value="ו">ו</SelectItem>
                      <SelectItem value="ז">ז</SelectItem>
                      <SelectItem value="ח">ח</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שעת חוג</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר שעת חוג" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCourseData && selectedCourseData.times && selectedCourseData.times.length > 0 ? (
                        selectedCourseData.times.map((time: string, index: number) => (
                          <SelectItem key={index} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="לא הוגדר">לא הוגדרו שעות</SelectItem>
                      )}
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
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map icon names to components
  const iconMap = {
    Code2,
    Gamepad2,
    Smartphone,
    Bot
  } as any;
  
  return (
    <section id="courses" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {siteContent.coursesTitle && (
            <h2 className="text-4xl font-bold text-foreground mb-4">{siteContent.coursesTitle}</h2>
          )}
          {siteContent.coursesSubtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {siteContent.coursesSubtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-muted-foreground">טוען קורסים...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-muted-foreground">אין קורסים זמינים כרגע</p>
            </div>
          ) : (
            courses.map((course) => {
              const IconComponent = iconMap[course.icon] || Code2;
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
                        {course.features.map((feature: string, index: number) => (
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
                        <p className="text-sm font-medium">{course.group_size}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">מחיר</p>
                        <p className="text-lg font-bold text-primary">{course.price_text}</p>
                      </div>
                    </div>

                    <ContactForm selectedCourse={course.title} selectedCourseData={course} courses={courses} />
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};

export default CoursesSection;