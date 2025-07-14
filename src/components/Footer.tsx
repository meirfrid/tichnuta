import { Code2, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/lovable-uploads/8f339034-9056-476e-ba22-5f0e6a87831d.png"
                alt="תכנותא - חוגי תכנות לילדים"
                className="h-10 w-auto filter brightness-0 invert"
              />
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
                <span className="opacity-80">053-2712650</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="opacity-80">meirfrid650@gmail.com</span>
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