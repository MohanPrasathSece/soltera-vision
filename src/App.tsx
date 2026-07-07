import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Education from "./pages/Education";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

// Define Auth context types
interface User {
  email: string;
  name?: string;
  phone?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  isSignupOpen: boolean;
  setSignupOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("soltera_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("soltera_user");
      }
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("soltera_user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setLoginOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("soltera_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Protected Route implementation
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
      if (!isAuthenticated && !localStorage.getItem("soltera_user")) {
        setLoginOpen(true);
      }
    }, [isAuthenticated]);

    if (!isAuthenticated && !localStorage.getItem("soltera_user")) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoginOpen,
        setLoginOpen,
        isSignupOpen,
        setSignupOpen,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/education"
            element={
              <ProtectedRoute>
                <Education />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" theme="dark" />
    </AuthContext.Provider>
  );
}
