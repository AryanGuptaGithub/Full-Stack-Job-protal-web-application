import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BriefcaseIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tokenData = localStorage.getItem("user");
    if (tokenData) {
      setUser(JSON.parse(tokenData));
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <BriefcaseIcon className="h-6 w-6 mr-2 text-indigo-400" />
          JobPortal
        </Link>

        {/* Desktop Navigation (using flex for layout) */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/jobs"
            className="hover:text-indigo-300 transition duration-200 ease-in-out flex items-center"
          >
            <BriefcaseIcon className="h-5 w-5 mr-1" />
            Jobs
          </Link>
          {user?.role === "jobseeker" && (
            <>
              <Link
                to="/my-applications"
                className="hover:text-indigo-300 transition duration-200 ease-in-out flex items-center"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
                My Applications
              </Link>
              <Link
                to="/dashboard"
                className="hover:text-indigo-300 transition duration-200 ease-in-out flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-1" />
                Dashboard
              </Link>
              <Link
                to="/edit-profile"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition duration-200 ease-in-out flex items-center"
              >
                <CogIcon className="h-5 w-5 mr-1" />
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200 ease-in-out flex items-center"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </>
          )}
          {user?.role === "recruiter" && (
            <Link
              to="/recruiter-dashboard"
              className="hover:text-indigo-300 transition duration-200 ease-in-out flex items-center"
            >
              <UserIcon className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
          )}
          <Link
            to="/login"
            className="hover:text-indigo-300 transition duration-200 ease-in-out flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (using block for stacking, flex for icon alignment) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-700 py-2">
          <Link
            to="/jobs"
            className="block py-2 px-4 hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
          >
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            Jobs
          </Link>
          {user?.role === "jobseeker" && (
            <>
              <Link
                to="/my-applications"
                className="block py-2 px-4 hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                My Applications
              </Link>
              <Link
                to="/dashboard"
                className="block py-2 px-4 hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/edit-profile"
                className="block py-2 px-4 hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
              >
                <CogIcon className="h-5 w-5 mr-2" />
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
                className="block py-2 px-4 hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </>
          )}
          {user?.role === "recruiter" && (
            <Link
              to="/recruiter-dashboard"
              className="block py-2 px-4 hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
          )}
          <Link
            to="/login"
            className="block py-2 px-4 hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
