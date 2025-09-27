import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const { toast } = useToast();
  const { siteContent } = useSiteContent();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    course: "",
    message: ""
  });
  

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.phone || !formData.email) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const { error } = await supabase
        .from('registrations')
        .insert({
          name: fullName,
          phone: formData.phone,
          email: formData.email,
          course: formData.course || "יצירת קשר כללי",
          message: formData.message,
          status: "new"
        });

      if (error) throw error;

      toast({
        title: "הודעה נשלחה בהצלחה!",
        description: "נחזור אליך תוך 24 שעות",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        course: "",
        message: ""
      });
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת ההודעה. אנא נסה שוב.",
        variant: "destructive"
      });
    }
  };


  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">צור קשר</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            נשמח לענות על כל השאלות שלך ולעזור לך לבחור את הקורס המתאים
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">שלח לנו הודעה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">שם פרטי *</label>
                    <Input 
                      placeholder="הכנס את השם הפרטי" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">שם משפחה</label>
                    <Input 
                      placeholder="הכנס את שם המשפחה" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">טלפון *</label>
                  <Input 
                    placeholder="הכנס מספר טלפון" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">כתובת אימייל *</label>
                  <Input 
                    placeholder="הכנס כתובת אימייל" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">קורס מעניין</label>
                  <Input 
                    placeholder="איזה קורס מעניין אותך?" 
                    value={formData.course}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">הודעה</label>
                  <Textarea 
                    placeholder="כתב לנו מה אתה רוצה לדעת..." 
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  שלח הודעה
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">טלפון</h3>
                  <p className="text-muted-foreground mb-1">{siteContent.contactPhone}</p>
                  <p className="text-sm text-muted-foreground">זמין להתשיב במשך שעות העבודה</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">אימייל</h3>
                  <p className="text-muted-foreground mb-1">{siteContent.contactEmail}</p>
                  <p className="text-sm text-muted-foreground">נחזור אליך תוך 24 שעות</p>
                </div>
              </div>
            </Card>

            {siteContent.contactAddress && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">מיקום</h3>
                    <p className="text-muted-foreground mb-1">{siteContent.contactAddress}</p>
                    <p className="text-sm text-muted-foreground">קומה שנייה, חדר 203</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">שעות פעילות</h3>
                  <div className="space-y-1 text-muted-foreground">
                    <p>ראשון - חמישי: 16:00 - 20:00</p>
                    <p>מוצאי שבת: 21:00 - 23:00</p>
                    <p>שבת וחגים: סגור</p>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;