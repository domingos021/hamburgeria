// src/router/router.tsx

import { createBrowserRouter } from "react-router-dom";

import Layout from "../../layout/Layout";

import Login from "../pages/login";
import Register from "../pages/cadastro";
import Home from "../pages/home";
import OrderRequests from "../pages/pedidos";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/pedidos",
        element: <OrderRequests />,
      },
    ],
  },

  // Rotas públicas (sem layout)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);
