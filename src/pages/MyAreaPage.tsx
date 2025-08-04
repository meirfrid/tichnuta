
import MyArea from "@/components/MyArea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MyAreaPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MyArea />
      </main>
      <Footer />
    </div>
  );
};

export default MyAreaPage;
