import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = ({ user }) => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const getProfileLink = () => {
    if (user.role === "Tenant") {
      return "/tenant-dashboard";
    } else if (user.role === "Owner") {
      return "/owner-dashboard";
    }
    return "/"; // Default fallback
  };

  return (
    <nav className="sticky top-0 z-50 flex flex-row justify-between items-center bg-blue-200 border-b border-blue-300 px-6 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center space-x-2">
        <img src="/RE.png" alt="RentEase Logo" className="h-8 w-8" />
        <div className="text-lg font-semibold text-blue-900 tracking-tight">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            RentEase
          </Link>
          <Link to="/mapview" className="ml-2 text-sm font-normal text-blue-700 hover:text-blue-500 transition-colors">
            Map View
          </Link> 
          

        </div>
      </div>
      <div className="flex space-x-4 items-center">
        {user ? (
          <>
            <span className="text-blue-800 text-sm">
              Welcome, {user.username}
            </span>
            <Link
              to={getProfileLink()}
              className="text-blue-700 hover:text-blue-900 px-3 py-1 rounded transition-colors text-sm font-medium"
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-700 hover:text-blue-900 px-3 py-1 rounded transition-colors text-sm font-medium"
            >
              Login
            </Link>
      
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
