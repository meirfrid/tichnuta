
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import AuthButton from "./AuthButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation - moved to left */}
          <nav className="hidden md:flex items-center gap-6 h-24">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">בית</a>
            <a href="#courses" className="text-foreground hover:text-primary transition-colors">קורסים</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">צור קשר</a>
          </nav>

          {/* Mobile Menu Button - moved to left */}
          <button
            className="md:hidden p-2 h-24 flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Custom Logo - centered and larger */}
          <div className="flex items-center justify-center h-24">
            <div className="flex items-center gap-3">
              {/* Code symbol decoration */}
              <div className="hidden md:flex items-center text-primary text-2xl font-mono">
                {"</>"}
              </div>

              {/* Main logo text */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-dark to-secondary bg-clip-text text-transparent leading-tight">
                  תכנותא
                </h1>
                <div className="text-xs md:text-sm text-muted-foreground font-medium tracking-wide">
                  חוגי תכנות לילדים
                </div>
              </div>

              {/* Decorative dots */}
              <div className="hidden md:flex flex-col gap-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
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
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">בית</a>
              <a href="#courses" className="text-foreground hover:text-primary transition-colors">קורסים</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">צור קשר</a>
              <AuthButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
