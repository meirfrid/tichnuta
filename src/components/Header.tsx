import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import AuthButton from "./AuthButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <div className="flex items-center h-full">
            <img
              src="/lovable-uploads/8f339034-9056-476e-ba22-5f0e6a87831d.png"
              alt="תכנותא - חוגי תכנות לילדים"
              className="h-28 w-auto "
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">בית</a>
            <a href="#courses" className="text-foreground hover:text-primary transition-colors">קורסים</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">אודות</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">צור קשר</a>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">בית</a>
              <a href="#courses" className="text-foreground hover:text-primary transition-colors">קורסים</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">אודות</a>
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