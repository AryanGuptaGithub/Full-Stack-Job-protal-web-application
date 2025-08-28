// ✅ FILE: src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";

// ---------- Styled Components ----------
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6;
  padding: 3rem 1.5rem;
`;

const Card = styled.div`
  max-width: 900px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  background-color: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);

  @media(min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const LeftSide = styled.div`
  background-color: #16a34a;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }

  p {
    text-align: center;
    line-height: 1.5rem;
  }

  img {
    width: 12rem;
    height: 12rem;
    margin-top: 1.5rem;
  }
`;

const RightSide = styled.div`
  padding: 2rem;

  h2 {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #374151;
  }

  p.error {
    color: #ef4444;
    margin-bottom: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;

  &:focus {
    border-color: #34d399;
    box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.3);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #15803d;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #6b7280;

  a {
    color: #2563eb;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ---------- Component ----------
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://full-stack-job-protal-web-application.onrender.com/api/auth/login", formData, { withCredentials: true });

      localStorage.setItem("jwt", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/jobs");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Card>
          <LeftSide>
            <h2>Welcome Back! 👋</h2>
            <p>
              Sign in to access your personalized job search experience.
              <br />
              Let's find your next opportunity!
            </p>
            <img src="https://cdn-icons-png.flaticon.com/512/3390/3390472.png" alt="Login" />
          </LeftSide>

          <RightSide>
            <h2>Sign In</h2>
            {error && <p className="error">{error}</p>}

            <Form onSubmit={handleSubmit}>
              <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

              <Button type="submit">Login</Button>

              <FooterText>
                Don't have an account?{" "}
                <Link to="/register">Register</Link>
              </FooterText>
            </Form>
          </RightSide>
        </Card>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default Login;
