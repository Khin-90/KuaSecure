import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminRoute from "./components/AdminRoute";
import SecurityAlerts from "./components/SecurityAlerts";
import VulnerabilityScanner from "./components/VulnerabilityScanner";
import "./index.css";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User auth state changed:", user);
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"}>
      <Router>
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">KuaSecure</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup setAuth={setIsAuthenticated} />} />
            <Route path="/security-alerts" element={<SecurityAlerts />} />
            <Route path="/vulnerability-scanner" element={<VulnerabilityScanner />} />
            
            {/* Protect the Admin Dashboard */}
            <Route path="/admin" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />

            {/* Redirect all other paths to /login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}