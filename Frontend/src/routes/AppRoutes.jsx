import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Meals from "../pages/Meals";
import UserProfile from "../pages/UserProfile";
import MySubscriptions from "../pages/MySubscriptions";
import ProviderDashboard from "../pages/ProviderDashboard";
import AddMeal from "../pages/AddMeal";
import EditMeal from "../pages/EditMeal";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import ManageUsers from "../pages/ManageUsers";
import ManageProviders from "../pages/ManageProviders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "meals", element: <Meals /> },
      { path: "profile", element: <UserProfile /> },
      { path: "subscriptions", element: <MySubscriptions /> },
      {
        path: "provider-dashboard",
        element: (
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-providers",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageProviders />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-meal",
        element: (
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <AddMeal />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-meal/:id",
        element: (
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <EditMeal />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;