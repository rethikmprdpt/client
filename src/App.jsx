import Header from "./components/Header";
import Footer from "./components/Footer";
import AssetDashBoard from "./views/AssetDashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <AssetDashBoard />
      </main>
      <Footer />
    </div>
  );
}
