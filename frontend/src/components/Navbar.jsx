// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {useAuth} from "../context/AuthContext";
import {
  BriefcaseIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import styled from "styled-components";

// Styled Components
const Nav = styled.nav`
  background-color: #1f2937;
  color: white;
  padding: 1rem;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;

  svg {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: 0.5rem;
    color: #818cf8;
  }
`;

const DesktopMenu = styled.div`
  display: none;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #c4b5fd;
  }

  svg {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.25rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  color: white;
  background-color: ${(props) => props.bg || "#4f46e5"};

  &:hover {
    background-color: ${(props) => props.hover || "#4338ca"};
  }

  svg {
    height: 1.25rem;
    width: 1.25rem;
    margin-right: 0.25rem;
  }
`;

const MobileMenuButton = styled.button`
  color: #d1d5db;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: white;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #374151;
  padding: 0.5rem 0;

  a,
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #4b5563;
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
      margin-right: 0.25rem;
    }
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {isAuthenticated, logout} = useAuth();

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
    <Nav>
      <Container>
        <Logo to="/">
          <BriefcaseIcon />
          JobPortal
        </Logo>

        <DesktopMenu>
          <NavLink to="/jobs">
            <BriefcaseIcon />
            Jobs
          </NavLink>
          {user?.role === "jobseeker" && (
            <>
              <NavLink to="/my-applications">
                <ClipboardDocumentListIcon />
                My Applications
              </NavLink>
              <NavLink to="/dashboard">
                <UserIcon />
                Dashboard
              </NavLink>
              <ActionButton bg="#4f46e5" hover="#4338ca" as={Link} to="/edit-profile">
                <CogIcon />
                Edit Profile
              </ActionButton>

              {!isAuthenticated && ( 
                 <ActionButton
                bg="#dc2626"
                hover="#b91c1c"
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
             
                }}
              >
                <ArrowRightOnRectangleIcon />
                Logout
              </ActionButton>
               )}
             

            </>
          )}
          {user?.role === "recruiter" && (
            <NavLink to="/recruiter-dashboard">
              <UserIcon />
              Dashboard
            </NavLink>
          )}
          {!isAuthenticated && (
             <Link to="/login">
              <ActionButton bg="#4f46e5" hover="#4338ca" >
            <ArrowRightOnRectangleIcon />
            Login
            </ActionButton>
          </Link>
          )}
           <ActionButton bg="#dc2626" hover="#b91c1c" 
                onClick={() => { localStorage.removeItem("user")
                  window.location.reload();
                }}> 
                <ArrowRightOnRectangleIcon />
                Logout
              </ActionButton>


           






        </DesktopMenu>




        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </MobileMenuButton>
      </Container>

      {isMobileMenuOpen && (
        <MobileMenu>
          <Link to="/jobs">
            <BriefcaseIcon />
            Jobs
          </Link>
          {user?.role === "jobseeker" && (
            <>
              <Link to="/my-applications">
                <ClipboardDocumentListIcon />
                My Applications
              </Link>
              <Link to="/dashboard">
                <UserIcon />
                Dashboard
              </Link>
              <Link to="/edit-profile">
                <CogIcon />
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
              >
                <ArrowRightOnRectangleIcon />
                Logout
              </button>
            </>
          )}
          {user?.role === "recruiter" && (
            <Link to="/recruiter-dashboard">
              <UserIcon />
              Dashboard
            </Link>
          )}
          {!isAuthenticated && (
             <Link to="/login">
            <ArrowRightOnRectangleIcon />
            Login
          </Link>
          )}
         
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
