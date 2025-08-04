
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AuthButton from "./AuthButton";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation - moved to left */}
          <nav className="hidden md:flex items-center gap-6 h-24">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">בית</a>
            <a href="#courses" className="text-foreground hover:text-primary transition-colors">קורסים</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">אודות</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">צור קשר</a>
            {user && (
              <>
                <a href="/my-area" className="text-foreground hover:text-primary transition-colors">האזור האישי</a>
                {isAdmin && (
                  <a href="/admin" className="text-foreground hover:text-primary transition-colors">ניהול</a>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button - moved to left */}
          <button
            className="md:hidden p-2 h-24 flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo - centered and much larger */}
          <div className="flex items-center justify-center h-24">
         <img
          src="/lovable-uploads/8f339034-9056-476e-ba22-5f0e6a87831d.png"
          alt="תכנותא - חוגי תכנות לילדים"
          className="h-24 w-auto object-contain"
          />
          </div>

          {/* Desktop Auth Button - moved to right */}
          <div className="hidden md:flex items-center h-24">
            <AuthButton />
          </div>

          {/* Empty div for mobile to maintain spacing */}
          <div className="md:hidden w-10 h-24"></div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#home" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                בית
              </a>
              <a 
                href="#courses" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                קורסים
              </a>
              <a 
                href="#about" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                אודות
              </a>
              <a 
                href="#contact" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                צור קשר
              </a>
              {user && (
                <>
                  <a 
                    href="/my-area" 
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    האזור האישי
                  </a>
                  {isAdmin && (
                    <a 
                      href="/admin" 
                      className="text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ניהול
                    </a>
                  )}
                </>
              )}
              <div className="pt-4 border-t border-border">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
