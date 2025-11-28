/**
 * Router principal da aplicação
 * Configuração de rotas conforme estrutura do Figma
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "../components/ui/sonner";
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Pages
import { LoginPage } from "../pages/Login/LoginPage";
import { RegisterPage } from "../pages/Register/RegisterPage";
import { HomePage } from "../pages/Home/HomePage";
import { ItemDetailsPage } from "../pages/ItemDetails/ItemDetailsPage";
import { ProfilePage } from "../pages/Profile/ProfilePage";
import { ChatPage } from "../pages/Chat/ChatPage";
import { MySalesPage } from "../pages/MySales/MySalesPage";
import { AddItemPage } from "../components/AddItemPage";
import { SupportPage } from "../pages/Support/SupportPage";
import { AccountDataPage } from "../pages/AccountData/AccountDataPage";

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - New Structure */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute>
                <ItemDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-sales"
            element={
              <ProtectedRoute>
                <MySalesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-data"
            element={
              <ProtectedRoute>
                <AccountDataPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy Routes (mantidas para compatibilidade) */}
          <Route
            path="/add-item"
            element={
              <ProtectedRoute>
                <AddItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-sales"
            element={
              <ProtectedRoute>
                <MySalesPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

