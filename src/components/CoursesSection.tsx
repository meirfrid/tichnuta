import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Gamepad2, Smartphone, Bot, Clock, Users, Star } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

const courses = [];


const contactFormSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
  parent_name: z.string().min(2, "שם הורה חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
  phone: z.string().min(9, "מספר טלפון לא תקין").max(20, "מספר טלפון לא תקין").regex(/^[0-9+\-\s()]+$/, "מספר טלפון לא תקין"),
  email: z.string().email("כתובת מייל לא תקינה").max(255, "כתובת מייל ארוכה מדי"),
  course: z.string().min(1, "יש לבחור קורס").max(200, "שם קורס ארוך מדי"),
  location: z.string().min(1, "יש לבחור מקום לימוד").max(200, "שם מקום ארוך מדי"),
  grade: z.string().min(1, "יש לבחור כיתה").max(50, "כיתה לא תקינה"),
  time: z.string().min(1, "יש לבחור יום ושעה").max(100, "זמן לא תקין"),
  gender: z.string().min(1, "יש לבחור מגדר"),
  learning_period: z.string().max(200, "תקופת לימוד לא תקינה").optional(),
  message: z.string().max(2000, "הודעה ארוכה מדי").optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface CoursePeriod {
  id: string;
  course_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

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
}

interface PrefilledVariant {
  gender: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string | null;
  learning_period: string | null;
}

export const ContactForm = ({ selectedCourse, buttonText = "לפרטים והרשמה", courses = [], forceOpen = false, onClose, prefilledVariant }: { selectedCourse?: string; buttonText?: string; courses?: any[]; forceOpen?: boolean; onClose?: () => void; prefilledVariant?: PrefilledVariant }) => {
  const [open, setOpen] = useState(forceOpen);
  const [selectedCourseData, setSelectedCourseData] = useState<any>(null);
  const [variants, setVariants] = useState<CourseVariant[]>([]);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [periods, setPeriods] = useState<CoursePeriod[]>([]);
  
  // Filtered options based on selections
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [filteredTimes, setFilteredTimes] = useState<{ display: string; value: string; learning_period?: string | null }[]>([]);
  const [filteredPeriods, setFilteredPeriods] = useState<string[]>([]);
  
  // Track if we've applied prefilled data
  const [prefilledApplied, setPrefilledApplied] = useState(false);
  
  const { toast } = useToast();
  
  // Update open state when forceOpen changes
  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
      setPrefilledApplied(false); // Reset when dialog closes
    }
  };

  // Convert gender from English to Hebrew for form
  const getGenderValue = (gender: string) => {
    switch (gender) {
      case "boys": return "בן";
      case "girls": return "בת";
      case "mixed": return "בן"; // Default to בן for mixed
      default: return gender;
    }
  };

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      parent_name: "",
      phone: "",
      email: "",
      course: selectedCourse || "",
      location: "",
      grade: "",
      time: "",
      gender: "",
      learning_period: "",
      message: "",
    },
  });

  // Fetch variants, schedules and periods when course changes
  useEffect(() => {
    const fetchVariants = async () => {
      if (!selectedCourseData?.id) {
        setVariants([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('course_variants')
        .select('*')
        .eq('course_id', selectedCourseData.id)
        .eq('is_active', true)
        .order('sort_order');
      
      if (!error && data) {
        setVariants(data);
      }
    };

    const fetchSchedules = async () => {
      if (!selectedCourseData?.id) {
        setSchedules([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('course_schedules')
        .select('*')
        .eq('course_id', selectedCourseData.id);
      
      if (!error && data) {
        setSchedules(data);
      }
    };

    const fetchPeriods = async () => {
      if (!selectedCourseData?.id) {
        setPeriods([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('course_periods')
        .select('*')
        .eq('course_id', selectedCourseData.id)
        .eq('is_active', true)
        .order('start_date');
      
      if (!error && data) {
        setPeriods(data);
      }
    };
    
    fetchVariants();
    fetchSchedules();
    fetchPeriods();
  }, [selectedCourseData?.id]);

  // Check if course has variants configured
  const hasVariants = variants.length > 0;

  // Update selected course data when dialog opens or course is selected
  useEffect(() => {
    if (selectedCourse || form.getValues("course")) {
      const courseTitle = selectedCourse || form.getValues("course");
      const course = courses.find(c => c.title === courseTitle);
      setSelectedCourseData(course);
    }
  }, [selectedCourse, courses, open]);

  // Apply prefilled variant data after variants are loaded
  useEffect(() => {
    if (prefilledVariant && variants.length > 0 && !prefilledApplied && open) {
      // Set gender first (this triggers location filtering)
      const genderValue = getGenderValue(prefilledVariant.gender);
      form.setValue("gender", genderValue);
      
      // We need to wait for the location filter to update, then set location
      setTimeout(() => {
        form.setValue("location", prefilledVariant.location);
        
        // Wait for time filter to update, then set time
        setTimeout(() => {
          const timeValue = `יום ${prefilledVariant.day_of_week} ${prefilledVariant.start_time}${prefilledVariant.end_time ? ` - ${prefilledVariant.end_time}` : ''}`;
          form.setValue("time", timeValue);
          
          if (prefilledVariant.learning_period) {
            form.setValue("learning_period", prefilledVariant.learning_period);
          }
          
          setPrefilledApplied(true);
        }, 100);
      }, 100);
    }
  }, [prefilledVariant, variants, prefilledApplied, open, form]);

  // Filter locations based on selected gender (only when using variants)
  useEffect(() => {
    if (hasVariants) {
      const selectedGender = form.getValues("gender");
      if (selectedGender) {
        const matchingVariants = variants.filter(v => 
          v.gender === selectedGender || v.gender === 'מעורב'
        );
        const locations = [...new Set(matchingVariants.map(v => v.location))];
        setFilteredLocations(locations);
      } else {
        setFilteredLocations([]);
      }
    } else {
      // Fallback to old behavior - all locations from schedules or course
      const locations = schedules.length > 0 
        ? [...new Set(schedules.map(s => s.location))]
        : (selectedCourseData?.locations || []);
      setFilteredLocations(locations);
    }
  }, [hasVariants, variants, schedules, selectedCourseData, form.watch("gender")]);

  // Filter times based on selected gender and location (only when using variants)
  useEffect(() => {
    if (hasVariants) {
      const selectedGender = form.getValues("gender");
      const selectedLocation = form.getValues("location");
      if (selectedGender && selectedLocation) {
        const matchingVariants = variants.filter(v => 
          (v.gender === selectedGender || v.gender === 'מעורב') && 
          v.location === selectedLocation
        );
        const times = matchingVariants.map(v => ({
          display: `יום ${v.day_of_week} ${v.start_time}${v.end_time ? ` - ${v.end_time}` : ''}${v.learning_period ? ` (${v.learning_period})` : ''}`,
          value: `יום ${v.day_of_week} ${v.start_time}${v.end_time ? ` - ${v.end_time}` : ''}`,
          learning_period: v.learning_period
        }));
        setFilteredTimes(times);
        
        // Also set available periods from matching variants
        const variantPeriods = [...new Set(matchingVariants.filter(v => v.learning_period).map(v => v.learning_period!))];
        setFilteredPeriods(variantPeriods.length > 0 ? variantPeriods : periods.map(p => p.name));
      } else {
        setFilteredTimes([]);
        setFilteredPeriods([]);
      }
    } else {
      // Fallback to old behavior
      const selectedLocation = form.getValues("location");
      if (selectedLocation && schedules.length > 0) {
        const locationSchedules = schedules.filter(s => s.location === selectedLocation);
        const times = locationSchedules.map(s => ({
          display: `${s.day_of_week} ${s.start_time}${s.end_time ? ` - ${s.end_time}` : ''}`,
          value: `${s.day_of_week} ${s.start_time}${s.end_time ? ` - ${s.end_time}` : ''}`,
          learning_period: null
        }));
        setFilteredTimes(times);
      } else if (selectedLocation && selectedCourseData?.times?.length > 0) {
        const times = selectedCourseData.times.map((t: string) => ({ display: t, value: t, learning_period: null }));
        setFilteredTimes(times);
      } else {
        setFilteredTimes([]);
      }
      setFilteredPeriods(periods.map(p => p.name));
    }
  }, [hasVariants, variants, schedules, selectedCourseData, periods, form.watch("gender"), form.watch("location")]);

  // Watch for form changes and reset dependent fields
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'course') {
        const course = courses.find(c => c.title === value.course);
        setSelectedCourseData(course);
        // Reset all dependent fields when course changes
        form.setValue("gender", "");
        form.setValue("location", "");
        form.setValue("time", "");
        form.setValue("learning_period", "");
        setFilteredLocations([]);
        setFilteredTimes([]);
        setFilteredPeriods([]);
      }
      if (name === 'gender' && hasVariants) {
        // Reset location and time when gender changes (only in variants mode)
        form.setValue("location", "");
        form.setValue("time", "");
        form.setValue("learning_period", "");
      }
      if (name === 'location') {
        // Reset time and learning_period when location changes
        form.setValue("time", "");
        form.setValue("learning_period", "");
      }
      if (name === 'time' && hasVariants) {
        // Auto-select learning period from the selected time variant
        const selectedTime = value.time;
        const matchingTime = filteredTimes.find(t => t.value === selectedTime);
        if (matchingTime?.learning_period) {
          form.setValue("learning_period", matchingTime.learning_period);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [courses, form, hasVariants]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Save to database
      const { error } = await supabase
        .from('registrations')
        .insert({
          name: data.name,
          parent_name: data.parent_name,
          phone: data.phone,
          email: data.email,
          course: data.course,
          location: data.location,
          grade: data.grade,
          time: data.time,
          gender: data.gender,
          learning_period: data.learning_period || null,
          message: data.message || null,
        });

      if (error) {
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
      
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "שגיאה בשמירה",
        description: "אנא נסה שוב או צור קשר ישירות",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!forceOpen && (
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            יצירת קשר להרשמה
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            מלאו את הפרטים ונחזור אליכם בהקדם
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 p-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם מלא של התלמיד</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס את שם התלמיד המלא" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם הורה</FormLabel>
                  <FormControl>
                    <Input placeholder="הכנס את שם ההורה" {...field} />
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
                    <SelectContent className="z-[9999]">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מקום לימוד</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר מקום" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[9999]">
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map((location, index) => (
                            <SelectItem key={index} value={location}>
                              {location}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            {hasVariants && !form.getValues("gender") ? "בחר קודם מגדר" : "לא הוגדרו מקומות לימוד"}
                          </div>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר כיתה" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="א">כיתה א</SelectItem>
                        <SelectItem value="ב">כיתה ב</SelectItem>
                        <SelectItem value="ג">כיתה ג</SelectItem>
                        <SelectItem value="ד">כיתה ד</SelectItem>
                        <SelectItem value="ה">כיתה ה</SelectItem>
                        <SelectItem value="ו">כיתה ו</SelectItem>
                        <SelectItem value="ז">כיתה ז</SelectItem>
                        <SelectItem value="ח">כיתה ח</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>מגדר</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
                      dir="rtl"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="בן" id="male" />
                        <label htmlFor="male" className="cursor-pointer">בן</label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="בת" id="female" />
                        <label htmlFor="female" className="cursor-pointer">בת</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>יום ושעה</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!form.getValues("location")}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={form.getValues("location") ? "בחר יום ושעה" : "בחר קודם מקום לימוד"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[9999]">
                      {filteredTimes.length > 0 ? (
                        filteredTimes.map((time, index) => (
                          <SelectItem key={index} value={time.value}>
                            {time.display}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {form.getValues("location") ? "לא הוגדרו זמנים למקום זה" : "בחר קודם מקום לימוד"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="learning_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תקופת לימוד</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר תקופת לימוד" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[9999]">
                      {periods.length > 0 ? (
                        periods.map((period) => (
                          <SelectItem key={period.id} value={period.name}>
                            {period.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {selectedCourseData ? "לא הוגדרו תקופות לימוד לקורס זה" : "בחר קודם קורס"}
                        </div>
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
            
            <div className="space-y-3">
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                שלח הודעה
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                הרישום אינו מחייב. נציג יצור עימך קשר לאישור ההרשמה.
              </p>
            </div>
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [autoOpenCourseId, setAutoOpenCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Check if we should auto-open the registration form for a specific course
  useEffect(() => {
    const courseId = searchParams.get('course');
    if (courseId && courses.length > 0) {
      setAutoOpenCourseId(courseId);
    }
  }, [searchParams, courses]);

  const handleFormClose = () => {
    setAutoOpenCourseId(null);
    // Remove the course param from URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('course');
    setSearchParams(newParams, { replace: true });
  };

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

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      לפרטים והרשמה
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Hidden form that opens when coming from course details page */}
        {autoOpenCourseId && courses.length > 0 && (
          <ContactForm
            selectedCourse={courses.find(c => c.id === autoOpenCourseId)?.title}
            courses={courses}
            forceOpen={true}
            onClose={handleFormClose}
          />
        )}
      </div>
    </section>
  );
};

export default CoursesSection;