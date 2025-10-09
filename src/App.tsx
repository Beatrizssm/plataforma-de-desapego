import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { DashboardPage } from "./components/DashboardPage";
import { AddItemPage } from "./components/AddItemPage";
import { ItemsListPage } from "./components/ItemsListPage";
import { ItemDetailsPage } from "./components/ItemDetailsPage";
import { HistoryPage } from "./components/HistoryPage";
import { ProfilePage } from "./components/ProfilePage";
import { StatsPage } from "./components/StatsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigation} />;
      case "login":
        return <LoginPage onNavigate={handleNavigation} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigation} />;
      case "dashboard":
      case "my-items":
        return <DashboardPage currentPage={currentPage} onNavigate={handleNavigation} />;
      case "add-item":
        return <AddItemPage currentPage={currentPage} onNavigate={handleNavigation} />;
      case "items":
        return <ItemsListPage onNavigate={handleNavigation} />;
      case "item-details":
        return <ItemDetailsPage onNavigate={handleNavigation} />;
      case "reservations":
      case "history":
        return <HistoryPage currentPage={currentPage} onNavigate={handleNavigation} />;
      case "profile":
        return <ProfilePage currentPage={currentPage} onNavigate={handleNavigation} />;
      case "stats":
        return <StatsPage currentPage={currentPage} onNavigate={handleNavigation} />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  const showNavbar = ["home", "items", "login", "register", "item-details"].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#F8F3E7]">
      {showNavbar && <Navbar onNavigate={handleNavigation} currentPage={currentPage} />}
      {renderPage()}
      <Toaster />
    </div>
  );
}
