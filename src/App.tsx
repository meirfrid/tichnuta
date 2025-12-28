import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminChat from "./pages/admin/Chat";
import CourseLessons from "./pages/admin/CourseLessons";
import CoursePermissions from "./pages/admin/CoursePermissions";
import StudentDashboard from "./pages/student/Dashboard";
import CoursePage from "./pages/student/CoursePage";
import LessonPage from "./pages/student/LessonPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/chat" element={<AdminChat />} />
            <Route path="/admin/courses/:courseId/lessons" element={<CourseLessons />} />
            <Route path="/admin/courses/:courseId/permissions" element={<CoursePermissions />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
            <Route path="/learn/:courseSlug" element={<CoursePage />} />
            <Route path="/learn/:courseSlug/:lessonId" element={<LessonPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
