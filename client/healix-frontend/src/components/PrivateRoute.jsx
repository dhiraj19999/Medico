
import useUserStore from "../store/useUserStore";
import { Navigate } from "react-router-dom";

const  PrivateRoute =  ({ children }) => {

const { status } = getStatus()

if (status === "unauthenticated") {
  return <Navigate to="/login" />;
}

return children;

};
export default PrivateRoute;


const getStatus=async () => {
  const user = await useUserStore((state) => state.user);

  if (!user) return { status: "unauthenticated" };

  return { status: "authenticated" };
};