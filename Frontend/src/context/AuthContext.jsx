import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Fetch user error:", error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
  try {

    const res = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(res.data.user);

    return {
      success: true,
      token: res.data.token,
    };

  } catch (error) {

    return {
      success: false,
      error: error.response.data.message,
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
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
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
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
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