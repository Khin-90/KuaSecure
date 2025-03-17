import VulnerabilityScanner from "./VulnerabilityScanner";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [securityChecks, setSecurityChecks] = useState([
    { id: 1, text: "Enable Two-Factor Authentication (2FA)", completed: false },
    { id: 2, text: "Use a Strong & Unique Password", completed: false },
    { id: 3, text: "Keep Software & Firmware Updated", completed: false },
    { id: 4, text: "Monitor Account Activity Regularly", completed: false },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleCheck = (id) => {
    setSecurityChecks(securityChecks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="container">
      <h2>Welcome, {user?.email}</h2>
      <p>Your cybersecurity dashboard is coming soon!</p>

      {/* Security Checklist */}
      <h3 className="mt-4 font-bold">Security Checklist</h3>
      <ul>
        {securityChecks.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleCheck(item.id)}
            />
            {item.text}
          </li>
        ))}
      </ul>

      <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded mt-4">Logout</button>
    </div>
  );
}
