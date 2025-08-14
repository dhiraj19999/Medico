import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../store/useUserStore";

export const PrivateRoute = ({ children }) => {
  const [status, setStatus] = useState("loading");
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      setStatus("unauthenticated");
     
    } else {
      setStatus("authenticated");
    }
  }, [user]);

  if (status === "loading") {
    return <div>Loading...</div>; // optional loader
  }

  if (status === "unauthenticated") {
     toast.error("❌ Login Please!", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    return <Navigate to="/" />; // SPA redirect
    // window.location.href = "/"; // use this only if you want full reload
  }

  return children;
};


