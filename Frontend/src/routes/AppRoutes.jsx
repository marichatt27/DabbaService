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
      { path: "provider-dashboard", element: <ProviderDashboard /> },
      { path: "add-meal", element: <AddMeal /> },
      { path: "edit-meal/:id", element: <EditMeal /> },
    ],
  },
]);

export default router;