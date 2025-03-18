import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import SecurityAlerts from "./SecurityAlerts";
import VulnerabilityScanner from "./VulnerabilityScanner";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user role from Firestore
        const userDocs = await getDocs(collection(db, "users"));
        const userData = userDocs.docs.find((doc) => doc.id === currentUser.uid);
        if (userData?.data()?.role === "admin") {
          setIsAdmin(true);
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const changeUserRole = async (id, newRole) => {
    await updateDoc(doc(db, "users", id), { role: newRole });
    fetchUsers(); // Refresh user list
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Welcome, {user?.email}</h2>
      <SecurityAlerts />
      <VulnerabilityScanner />
      <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded mt-4">Logout</button>

      {isAdmin && (
        <div className="mt-6">
          <h3 className="font-bold">Admin Panel - User Management</h3>
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u.id, e.target.value)}
                      className="border p-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button onClick={() => deleteUser(u.id)} className="bg-red-500 text-white p-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}