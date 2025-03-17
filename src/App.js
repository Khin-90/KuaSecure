import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { auth } from "./firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import "./index.css"; 

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set true if user is logged in
    });
    return () => unsubscribe();
  }, []);

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
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup setAuth={setIsAuthenticated} />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
