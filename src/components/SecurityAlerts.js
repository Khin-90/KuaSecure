import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function SecurityAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "security_alerts"), (snapshot) => {
      const alertList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlerts(alertList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-6 p-4 border rounded bg-yellow-100">
      <h3 className="font-bold text-red-600">⚠️ Security Alerts</h3>
      {alerts.length === 0 ? (
        <p>No current security alerts.</p>
      ) : (
        <ul className="mt-2">
          {alerts.map((alert) => (
            <li key={alert.id} className="text-red-600">
              🚨 {alert.message} <span className="text-gray-500">({alert.level})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
