import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import UserFooter from "./UserFooter";
import "../../styles/user-layout.css";

const UserLayout = () => {
  return (
    <div className="user-layout">
      <UserNavbar />

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>

      <UserFooter />
    </div>
  );
};

export default UserLayout;
