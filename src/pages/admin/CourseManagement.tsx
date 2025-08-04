
import AdminCourseManagement from "@/components/AdminCourseManagement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CourseManagement = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AdminCourseManagement />
      </main>
      <Footer />
    </div>
  );
};

export default CourseManagement;
