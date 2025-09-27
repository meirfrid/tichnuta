
import { Code2, Mail, Phone, MapPin } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

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
                <div className="text-background text-lg font-mono">
                  {"</>"}
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-background leading-tight">
                    תכנותא
                  </h3>
                  <div className="text-xs text-background/80 font-medium">
                    חוגי תכנות לילדים
                  </div>
                </div>
              </div>
            </div>
            {siteContent.footerDescription && (
              <p className="text-sm opacity-80 leading-relaxed">
                {siteContent.footerDescription}
              </p>
            )}
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
                <a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">צור קשר</a>
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
