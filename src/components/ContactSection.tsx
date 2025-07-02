import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">שם פרטי</label>
                  <Input placeholder="הכנס את השם הפרטי" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">שם משפחה</label>
                  <Input placeholder="הכנס את שם המשפחה" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">טלפון</label>
                <Input placeholder="הכנס מספר טלפון" type="tel" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">כתובת אימייל</label>
                <Input placeholder="הכנס כתובת אימייל" type="email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">קורס מעניין</label>
                <Input placeholder="איזה קורס מעניין אותך?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">הודעה</label>
                <Textarea 
                  placeholder="כתב לנו מה אתה רוצה לדעת..." 
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                שלח הודעה
              </Button>
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
                  <p className="text-muted-foreground mb-1">050-123-4567</p>
                  <p className="text-sm text-muted-foreground">ראש להקשיב במשך שעות העבודה</p>
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
                  <p className="text-muted-foreground mb-1">info@programta.co.il</p>
                  <p className="text-sm text-muted-foreground">נחזור אליך תוך 24 שעות</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">מיקום</h3>
                  <p className="text-muted-foreground mb-1">רחוב הרב קוק 15, בני ברק</p>
                  <p className="text-sm text-muted-foreground">קומה שנייה, חדר 203</p>
                </div>
              </div>
            </Card>

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

            {/* Quick Contact */}
            <Card className="p-6 bg-gradient-card border-2 border-primary/20">
              <h3 className="text-lg font-semibold mb-3">יעוץ מהיר</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                רוצה לדבר איתנו עכשיו? השאר פרטים ונחזור אליך תוך 30 דקות
              </p>
              <div className="flex gap-2">
                <Input placeholder="מספר טלפון" className="flex-1" />
                <Button className="bg-gradient-primary hover:opacity-90">צור קשר</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;