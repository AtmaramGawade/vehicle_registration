import React, { useState } from "react";
import "./Auth.css";

const Auth = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    if (isSignup) {
      localStorage.setItem(username, password);
      alert("Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      const storedPassword = localStorage.getItem(username);
      if (storedPassword === password) {
        alert("Login successful!");
        onLogin(username);
      } else {
        alert("Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      <p onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default Auth;
