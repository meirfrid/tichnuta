
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthButton from "./AuthButton";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (section: string) => {
    setIsMenuOpen(false);
    navigate(`/#${section}`);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Menu Button - right side (RTL) - fixed width for centering */}
          <div className="w-24 flex justify-start">
            <button
              className="p-2 h-16 md:h-20 flex items-center hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo Image - centered */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center justify-center h-16 md:h-20"
          >
            <img
              src={logo}
              alt="תכנותא - חוגי תכנות מקצועיים לילדים"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </button>

          {/* Auth Button - left side (RTL) - fixed width for centering */}
          <div className="w-24 flex justify-end items-center h-16 md:h-20">
            <AuthButton />
          </div>
        </div>

        {/* Slide-down Navigation Menu */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 border-t border-border mt-2">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleNavigation("home")} 
                className="text-foreground hover:text-primary hover:bg-muted/50 transition-colors text-right py-3 px-4 rounded-lg text-lg font-medium"
              >
                בית
              </button>
              <button 
                onClick={() => handleNavigation("about")} 
                className="text-foreground hover:text-primary hover:bg-muted/50 transition-colors text-right py-3 px-4 rounded-lg text-lg font-medium"
              >
                אודות
              </button>
              <button 
                onClick={() => handleNavigation("courses")} 
                className="text-foreground hover:text-primary hover:bg-muted/50 transition-colors text-right py-3 px-4 rounded-lg text-lg font-medium"
              >
                קורסים
              </button>
              <button 
                onClick={() => handleNavigation("contact")} 
                className="text-foreground hover:text-primary hover:bg-muted/50 transition-colors text-right py-3 px-4 rounded-lg text-lg font-medium"
              >
                צור קשר
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
