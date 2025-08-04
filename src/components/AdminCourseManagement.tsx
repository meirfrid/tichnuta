
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, BookOpen, Users, Eye, CheckCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const courseSchema = z.object({
  title: z.string().min(2, "כותרת חייבת להכיל לפחות 2 תווים"),
  subtitle: z.string().min(1, "תת כותרת נדרשת"),
  description: z.string().min(10, "תיאור חייב להכיל לפחות 10 תווים"),
  price_number: z.number().min(0, "מחיר לא יכול להיות שלילי"),
  price_text: z.string().min(1, "טקסט מחיר נדרש"),
  level: z.string().min(1, "רמה נדרשת"),
  duration: z.string().min(1, "משך זמן נדרש"),
  group_size: z.string().min(1, "גודל קבוצה נדרש"),
  icon: z.string().default("Code2"),
  color: z.string().default("bg-gradient-to-br from-blue-500 to-blue-600"),
  features: z.array(z.string()).default([]),
});

const lessonSchema = z.object({
  title: z.string().min(2, "כותרת חייבת להכיל לפחות 2 תווים"),
  description: z.string().optional(),
  video_url: z.string().url("כתובת וידאו לא תקינה").optional().or(z.literal("")),
  presentation_url: z.string().url("כתובת מצגת לא תקינה").optional().or(z.literal("")),
  duration_minutes: z.number().min(1, "משך זמן חייב להיות לפחות דקה"),
  order_index: z.number().min(0, "מיקום לא יכול להיות שלילי"),
});

type CourseFormData = z.infer<typeof courseSchema>;
type LessonFormData = z.infer<typeof lessonSchema>;

const AdminCourseManagement = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);

  const courseForm = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      price_number: 0,
      price_text: "",
      level: "",
      duration: "",
      group_size: "",
      icon: "Code2",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      features: [],
    },
  });

  const lessonForm = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      video_url: "",
      presentation_url: "",
      duration_minutes: 60,
      order_index: 0,
    },
  });

  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
      fetchRegistrations();
    }
  }, [isAdmin]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון קורסים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון שיעורים",
        variant: "destructive"
      });
    }
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון הרשמות",
        variant: "destructive"
      });
    }
  };

  const saveCourse = async (data: CourseFormData) => {
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(data)
          .eq('id', editingCourse.id);

        if (error) throw error;

        toast({
          title: "הצלחה",
          description: "הקורס עודכן בהצלחה",
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "הצלחה",
          description: "הקורס נוצר בהצלחה",
        });
      }

      setCourseDialogOpen(false);
      setEditingCourse(null);
      courseForm.reset();
      fetchCourses();
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לשמור את הקורס",
        variant: "destructive"
      });
    }
  };

  const saveLesson = async (data: LessonFormData) => {
    if (!selectedCourse) return;

    try {
      const lessonData = {
        ...data,
        course_id: selectedCourse.id,
        video_url: data.video_url || null,
        presentation_url: data.presentation_url || null,
      };

      if (editingLesson) {
        const { error } = await supabase
          .from('course_lessons')
          .update(lessonData)
          .eq('id', editingLesson.id);

        if (error) throw error;

        toast({
          title: "הצלחה",
          description: "השיעור עודכן בהצלחה",
        });
      } else {
        const { error } = await supabase
          .from('course_lessons')
          .insert([lessonData]);

        if (error) throw error;

        toast({
          title: "הצלחה",
          description: "השיעור נוצר בהצלחה",
        });
      }

      setLessonDialogOpen(false);
      setEditingLesson(null);
      lessonForm.reset();
      fetchLessons(selectedCourse.id);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לשמור את השיעור",
        variant: "destructive"
      });
    }
  };

  const approveRegistration = async (registrationId: string, course: string, userEmail: string) => {
    try {
      // Find the course by name
      const matchingCourse = courses.find(c => c.title === course);
      if (!matchingCourse) {
        throw new Error("Course not found");
      }

      // Get user by email using RPC function - we'll need to create this
      const { data: userData, error: userError } = await supabase.rpc('get_user_by_email', {
        user_email: userEmail
      });

      if (userError) {
        // If RPC doesn't exist, we'll handle it differently
        toast({
          title: "שגיאה",
          description: "לא ניתן למצוא את המשתמש. יש צורך ביצירת פונקציה בבסיס הנתונים.",
          variant: "destructive"
        });
        return;
      }

      if (!userData) {
        throw new Error("User not found");
      }

      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('user_purchases')
        .insert([{
          user_id: userData.id,
          course_id: matchingCourse.id,
          amount_paid: matchingCourse.price_number,
          status: 'approved'
        }]);

      if (purchaseError) throw purchaseError;

      // Update registration status
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ status: 'approved' })
        .eq('id', registrationId);

      if (updateError) throw updateError;

      toast({
        title: "הצלחה",
        description: "ההרשמה אושרה בהצלחה",
      });

      fetchRegistrations();
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לאשר את ההרשמה: " + error.message,
        variant: "destructive"
      });
    }
  };

  const switchToLessonsTab = () => {
    const lessonsTab = document.querySelector('[data-value="lessons"]') as HTMLButtonElement;
    if (lessonsTab) {
      lessonsTab.click();
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-8">
            <p className="text-muted-foreground">
              אין לך הרשאות לגשת לדף זה
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ניהול קורסים ותכנים</h1>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" data-value="courses">קורסים</TabsTrigger>
          <TabsTrigger value="lessons" data-value="lessons">תכני קורס</TabsTrigger>
          <TabsTrigger value="registrations" data-value="registrations">הרשמות</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">ניהול קורסים</h2>
            <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingCourse(null);
                  courseForm.reset();
                }}>
                  <Plus className="h-4 w-4 ml-2" />
                  הוסף קורס חדש
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCourse ? "עריכת קורס" : "הוספת קורס חדש"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...courseForm}>
                  <form onSubmit={courseForm.handleSubmit(saveCourse)} className="space-y-4">
                    <FormField
                      control={courseForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>כותרת הקורס</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={courseForm.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>תת כותרת</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={courseForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>תיאור הקורס</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={courseForm.control}
                        name="price_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>מחיר (מספר)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={courseForm.control}
                        name="price_text"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>מחיר (טקסט)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="₪299/חודש" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={courseForm.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>רמה</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="בחר רמה" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="מתחילים">מתחילים</SelectItem>
                                <SelectItem value="בסיסי">בסיסי</SelectItem>
                                <SelectItem value="בינוני">בינוני</SelectItem>
                                <SelectItem value="מתקדם">מתקדם</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={courseForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>משך שיעור</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="90 דק'" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={courseForm.control}
                        name="group_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>גודל קבוצה</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="עד 8" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {editingCourse ? "עדכן קורס" : "צור קורס"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3>{course.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">
                        {course.subtitle}
                      </p>
                    </div>
                    <Badge variant={course.active ? "default" : "secondary"}>
                      {course.active ? "פעיל" : "לא פעיל"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCourse(course);
                        courseForm.reset(course);
                        setCourseDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      ערוך
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCourse(course);
                        fetchLessons(course.id);
                        switchToLessonsTab();
                      }}
                    >
                      <BookOpen className="h-4 w-4 ml-1" />
                      נהל תכנים
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lessons">
          {!selectedCourse ? (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  בחר קורס כדי לנהל את התכנים שלו
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  תכני הקורס: {selectedCourse.title}
                </h2>
                <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingLesson(null);
                      lessonForm.reset({
                        ...lessonForm.getValues(),
                        order_index: lessons.length
                      });
                    }}>
                      <Plus className="h-4 w-4 ml-2" />
                      הוסף שיעור
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingLesson ? "עריכת שיעור" : "הוספת שיעור חדש"}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...lessonForm}>
                      <form onSubmit={lessonForm.handleSubmit(saveLesson)} className="space-y-4">
                        <FormField
                          control={lessonForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>כותרת השיעור</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={lessonForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>תיאור השיעור</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={lessonForm.control}
                          name="video_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>קישור לוידאו</FormLabel>
                              <FormControl>
                                <Input {...field} type="url" placeholder="https://..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={lessonForm.control}
                          name="presentation_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>קישור למצגת</FormLabel>
                              <FormControl>
                                <Input {...field} type="url" placeholder="https://..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={lessonForm.control}
                            name="duration_minutes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>משך זמן (דקות)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={lessonForm.control}
                            name="order_index"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>מיקום בסדר</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          {editingLesson ? "עדכן שיעור" : "צור שיעור"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <Card key={lesson.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-1">
                            {lesson.title}
                          </h3>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {lesson.description}
                            </p>
                          )}
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            {lesson.duration_minutes && (
                              <span>משך: {lesson.duration_minutes} דק'</span>
                            )}
                            <span>מיקום: {lesson.order_index + 1}</span>
                          </div>
                          
                          <div className="flex gap-2 mt-2">
                            {lesson.video_url && (
                              <Badge variant="outline">🎥 וידאו</Badge>
                            )}
                            {lesson.presentation_url && (
                              <Badge variant="outline">📊 מצגת</Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingLesson(lesson);
                            lessonForm.reset(lesson);
                            setLessonDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 ml-1" />
                          ערוך
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {lessons.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">
                        אין שיעורים בקורס זה עדיין
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="registrations">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">ניהול הרשמות</h2>
            <p className="text-muted-foreground">
              כאן תוכל לאשר או לדחות הרשמות של משתמשים לקורסים
            </p>
          </div>

          <div className="space-y-4">
            {registrations.map((reg) => (
              <Card key={reg.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-1">
                        {reg.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">אימייל:</span> {reg.email}
                        </div>
                        <div>
                          <span className="text-muted-foreground">טלפון:</span> {reg.phone}
                        </div>
                        <div>
                          <span className="text-muted-foreground">קורס:</span> {reg.course}
                        </div>
                        <div>
                          <span className="text-muted-foreground">תאריך:</span>{" "}
                          {new Date(reg.created_at).toLocaleDateString('he-IL')}
                        </div>
                      </div>
                      
                      {reg.message && (
                        <div className="mt-2">
                          <span className="text-muted-foreground text-sm">הודעה:</span>
                          <p className="text-sm bg-muted p-2 rounded mt-1">
                            {reg.message}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <Badge 
                        variant={
                          reg.status === 'approved' ? 'default' : 
                          reg.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {reg.status === 'approved' ? 'אושר' : 
                         reg.status === 'rejected' ? 'נדחה' : 
                         'ממתין'}
                      </Badge>
                      
                      {reg.status === 'new' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approveRegistration(reg.id, reg.course, reg.email)}
                          >
                            <CheckCircle className="h-4 w-4 ml-1" />
                            אשר
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              const { error } = await supabase
                                .from('registrations')
                                .update({ status: 'rejected' })
                                .eq('id', reg.id);
                              
                              if (!error) {
                                fetchRegistrations();
                                toast({
                                  title: "הצלחה",
                                  description: "ההרשמה נדחתה",
                                });
                              }
                            }}
                          >
                            <X className="h-4 w-4 ml-1" />
                            דחה
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {registrations.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    אין הרשמות עדיין
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCourseManagement;
