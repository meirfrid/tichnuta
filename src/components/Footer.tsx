
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";
import logo from "@/assets/smallWhiteLogo.png";

const Footer = () => {
  const { siteContent } = useSiteContent();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {/* Custom logo for footer */}
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="תכנותא - חוגי תכנות מקצועיים לילדים"
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">קישורים מהירים</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="opacity-80 hover:opacity-100 transition-opacity">בית</a>
              </li>
              <li>
                <Link to="/about-us" className="opacity-80 hover:opacity-100 transition-opacity">מי אנחנו</Link>
              </li>
              <li>
                <a href="#courses" className="opacity-80 hover:opacity-100 transition-opacity">קורסים</a>
              </li>
              <li>
                <a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">צור קשר</a>
              </li>
              <li>
                <Link to="/privacy-policy" className="opacity-80 hover:opacity-100 transition-opacity">מדיניות פרטיות</Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-4">הקורסים שלנו</h4>
            <ul className="space-y-2 text-sm">
              <li className="opacity-80">פיתוח משחקים בסקראץ (ג'-ד')</li>
              <li className="opacity-80">פיתוח אפליקציות (ה'-ו')</li>
              <li className="opacity-80">פיתוח משחקים בפייתון (ז'-ח')</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">צור קשר</h4>
            <div className="space-y-3 text-sm">
              {siteContent.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="opacity-80">{siteContent.contactPhone}</span>
                </div>
              )}
              {siteContent.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="opacity-80">{siteContent.contactEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
            <p>&copy; 2024 תכנותא. כל הזכויות שמורות.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
