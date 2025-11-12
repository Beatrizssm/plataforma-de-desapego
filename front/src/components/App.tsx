// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./ui/sonner";

import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
import { DashboardPage } from "./DashboardPage";
import { AddItemPage } from "./AddItemPage";
import { ItemsListPage } from "./ItemsListPage";
import { ItemDetailsPage } from "./ItemDetailsPage";
import { ChatPage } from "./ChatPage";
import { HistoryPage } from "./HistoryPage";
import { ProfilePage } from "./ProfilePage";
import { StatsPage } from "./StatsPage";
import { SupportPage } from "./SupportPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-item" element={<AddItemPage />} />
        <Route path="/items" element={<ItemsListPage />} />
        <Route path="/item/:id" element={<ItemDetailsPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
