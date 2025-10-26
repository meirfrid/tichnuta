import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, Gamepad2, Smartphone, Bot, Clock, Users, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

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

const registrationFormSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
  phone: z.string().trim().min(10, "מספר טלפון לא תקין").max(20, "מספר טלפון ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "כתובת מייל ארוכה מדי"),
  course: z.string().trim().min(1, "יש לבחור קורס").max(200, "שם קורס ארוך מדי"),
  grade: z.string().trim().min(1, "יש למלא כיתה").max(20, "כיתה ארוכה מדי"),
  message: z.string().trim().max(2000, "הודעה ארוכה מדי").optional(),
});

type RegistrationFormData = z.infer<typeof registrationFormSchema>;

const RegistrationForm = ({ 
  selectedCourse, 
  schoolName, 
  courses = [] 
}: { 
  selectedCourse?: string; 
  schoolName: string;
  courses?: any[] 
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: selectedCourse || "",
      grade: "",
      message: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          name: data.name,
          phone: data.phone,
          email: data.email,
          course: data.course,
          school_name: schoolName,
          grade: data.grade,
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
        title: "ההרשמה התקבלה בהצלחה!",
        description: "ניצור איתך קשר בהקדם האפשרי",
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "שגיאה בשמירה",
        description: "אנא נסה שוב או צור קשר ישירות",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
          הרשמה לקורס
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            טופס הרשמה - {schoolName}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectItem value="א'">א'</SelectItem>
                      <SelectItem value="ב'">ב'</SelectItem>
                      <SelectItem value="ג'">ג'</SelectItem>
                      <SelectItem value="ד'">ד'</SelectItem>
                      <SelectItem value="ה'">ה'</SelectItem>
                      <SelectItem value="ו'">ו'</SelectItem>
                      <SelectItem value="ז'">ז'</SelectItem>
                      <SelectItem value="ח'">ח'</SelectItem>
                    </SelectContent>
                  </Select>
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
              שלח הרשמה
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const SchoolCourses = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchoolAndCourses();
  }, [schoolId]);

  const fetchSchoolAndCourses = async () => {
    try {
      // Fetch school details
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', schoolId)
        .eq('active', true)
        .single();

      if (schoolError) throw schoolError;
      setSchool(schoolData);

      // Fetch courses for this school
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('school_id', schoolId)
        .eq('active', true)
        .order('sort_order');

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching school and courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    Code2,
    Gamepad2,
    Smartphone,
    Bot
  } as any;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">טוען...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-4">תלמוד התורה לא נמצא</p>
          <Button onClick={() => navigate('/')}>חזרה לדף הבית</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-12 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
            onClick={() => navigate('/')}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{school.name}</h1>
            {school.description && (
              <p className="text-xl opacity-90">{school.description}</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">הקורסים שלנו</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              בחרו את הקורס המתאים לכם והרשמו עכשיו
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.length === 0 ? (
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

                      <RegistrationForm 
                        selectedCourse={course.title} 
                        schoolName={school.name}
                        courses={courses} 
                      />
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SchoolCourses;
