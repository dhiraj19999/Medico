import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/useUserStore.js";
import { HashLoader } from "react-spinners";


export const DocPrivate = ({ children }) => {
  const { user, loadingUser } = useUserStore();
  if (loadingUser) return <HashLoader color="teal" size={30} />;
  if (!user || user.role !== "doctor") return <Navigate to="/" replace />;
  return children;
};