import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (isMounted) setUser(response.data);
    } catch (error) {
      if (isMounted) setUser(null);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchUser();

  return () => {
    isMounted = false;
  };
}, []);

  const login = async (email, password) => {
  try {
    await api.post("/auth/login", { email, password });

    // small delay before calling /me
    await new Promise((r) => setTimeout(r, 100));

    const res = await api.get("/auth/me");

    setUser(res.data);

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
};

  const register = async (name, email, password, role) => {
    try {
      const response = await api.post("/auth/register", { name, email, password, role });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Registration error:", error);
      const errMsg = error.response?.data?.message || "Registration failed. Try again.";
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
  setUser(null);
};

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      const errMsg = error.response?.data?.message || "Could not update profile.";
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};