import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoursesSection from "@/components/CoursesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CoursesSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
