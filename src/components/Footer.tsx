import { Code2, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">תכנותא</h3>
                <p className="text-sm opacity-80">חוגי תכנות לילדים</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              מובילים בחינוך טכנולוגי לילדים מהמגזר החרדי, עם דגש על איכות ומקצועיות.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">קישורים מהירים</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="opacity-80 hover:opacity-100 transition-opacity">בית</a>
              </li>
              <li>
                <a href="#courses" className="opacity-80 hover:opacity-100 transition-opacity">קורסים</a>
              </li>
              <li>
                <a href="#about" className="opacity-80 hover:opacity-100 transition-opacity">אודות</a>
              </li>
              <li>
                <a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">צור קשר</a>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-4">הקורסים שלנו</h4>
            <ul className="space-y-2 text-sm">
              <li className="opacity-80">פיתוח משחקים בקוד (א'-ב')</li>
              <li className="opacity-80">פיתוח משחקים בסקראץ (ג'-ד')</li>
              <li className="opacity-80">פיתוח אפליקציות (ה'-ו')</li>
              <li className="opacity-80">פיתוח משחקים בפייתון (ז'-ח')</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">צור קשר</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="opacity-80">050-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="opacity-80">info@programta.co.il</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="opacity-80">רחוב הרב קוק 15, בני ברק</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
            <p>&copy; 2024 תכנותא. כל הזכויות שמורות.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:opacity-100 transition-opacity">תנאי שימוש</a>
              <a href="#" className="hover:opacity-100 transition-opacity">מדיניות פרטיות</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;