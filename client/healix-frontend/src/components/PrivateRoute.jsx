import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";
import { HashLoader } from "react-spinners";
export const PrivateRoute = ({ children }) => {
  const { user, loadingUser } = useUserStore();

  const override = { display: "block", margin: "0 auto" };

  if (loadingUser) {
    return <div className="py-10 flex justify-center">
      <HashLoader color="teal" size={30} cssOverride={override} />
    </div>;
  }

  if (!user) {
    toast.error("❌ Login Please!", {
      icon: "⚠️",
      style: { fontSize: "1rem", fontWeight: "bold" },
    });
    return <Navigate to="/" replace />;
  }

  return children;
};
