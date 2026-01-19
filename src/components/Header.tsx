
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AuthButton from "./AuthButton";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (section: string) => {
    // Close mobile menu if open
    setIsMenuOpen(false);

    // Always navigate with hash so browser handles scrolling reliably
    navigate(`/#${section}`);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Layout - original */}
        <div className="md:hidden">
          {/* Logo on top */}
          <div className="flex justify-center mb-4">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center justify-center"
            >
              <img
                src={logo}
                alt="תכנותא - חוגי תכנות מקצועיים לילדים"
                className="h-16 w-auto object-contain"
              />
            </button>
          </div>
          
          {/* Navigation bar */}
          <div className="flex justify-start items-center">
            <button
              className="p-2 flex items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation - original style */}
          {isMenuOpen && (
            <nav className="mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col gap-4">
                <button onClick={() => handleNavigation("home")} className="text-foreground hover:text-primary transition-colors text-right">בית</button>
                <button onClick={() => handleNavigation("about")} className="text-foreground hover:text-primary transition-colors text-right">אודות</button>
                <button onClick={() => handleNavigation("courses")} className="text-foreground hover:text-primary transition-colors text-right">קורסים</button>
                <button onClick={() => handleNavigation("recommendations")} className="text-foreground hover:text-primary transition-colors text-right">המלצות</button>
                <button onClick={() => handleNavigation("contact")} className="text-foreground hover:text-primary transition-colors text-right">צור קשר</button>
                <div className="mt-4 pt-4 border-t border-border">
                  <AuthButton />
                </div>
              </div>
            </nav>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center md:h-24">
          {/* Menu Button - left */}
          <div className="flex justify-start">
            <button
              className="p-2 flex items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo Image - centered */}
          <div className="flex justify-center">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center justify-center"
            >
              <img
                src={logo}
                alt="תכנותא - חוגי תכנות מקצועיים לילדים"
                className="h-20 w-auto object-contain"
              />
            </button>
          </div>

          {/* Auth Button - right */}
          <div className="flex justify-end items-center">
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Desktop Navigation Sheet */}
      <div className="hidden md:block">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="mt-8">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => handleNavigation("home")} 
                  className="text-foreground hover:text-primary transition-colors text-right text-lg py-2 px-4 rounded-md hover:bg-muted"
                >
                  בית
                </button>
                <button 
                  onClick={() => handleNavigation("about")} 
                  className="text-foreground hover:text-primary transition-colors text-right text-lg py-2 px-4 rounded-md hover:bg-muted"
                >
                  אודות
                </button>
                <button 
                  onClick={() => handleNavigation("courses")} 
                  className="text-foreground hover:text-primary transition-colors text-right text-lg py-2 px-4 rounded-md hover:bg-muted"
                >
                  קורסים
                </button>
                <button 
                  onClick={() => handleNavigation("recommendations")} 
                  className="text-foreground hover:text-primary transition-colors text-right text-lg py-2 px-4 rounded-md hover:bg-muted"
                >
                  המלצות
                </button>
                <button 
                  onClick={() => handleNavigation("contact")} 
                  className="text-foreground hover:text-primary transition-colors text-right text-lg py-2 px-4 rounded-md hover:bg-muted"
                >
                  צור קשר
                </button>
                <div className="mt-4 pt-4 border-t border-border">
                  <AuthButton />
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
