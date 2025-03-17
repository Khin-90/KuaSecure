// Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Correct import path

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      setAuth(true); // Update authentication state
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError(error.message); // Display error message
    }
  };

  return (
    <div className="container">
      <h2>Login to KuaSecure</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}