// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1.5rem;
  background-color: #f3f4f6; // gray-100
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  max-width: 1024px;
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const LeftSide = styled.div`
  background-color: #2563eb; // blue-600
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;

const RightSide = styled.div`
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #374151; // gray-700
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db; // gray-300
  border-radius: 0.5rem;
  outline: none;
  &:focus {
    border-color: #60a5fa; // blue-400
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  &:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #1d4ed8;
  }
`;

const ErrorText = styled.p`
  color: #ef4444; // red-500
  margin-bottom: 1rem;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "jobseeker",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Card>
          <LeftSide>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "1rem" }}>
              Join JobPortal 🚀
            </h2>
            <p>
              Find your dream job or hire top talent.
              <br />
              Let's get you started!
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Register"
              style={{ width: "12rem", height: "12rem", marginTop: "1.5rem" }}
            />
          </LeftSide>

          <RightSide>
            <Title>Create Account</Title>
            {error && <ErrorText>{error}</ErrorText>}

            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Select name="role" value={formData.role} onChange={handleChange}>
                <option value="jobseeker">Jobseeker</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </Select>
              <Button type="submit">Register</Button>
            </Form>

            <p style={{ textAlign: "center", marginTop: "1rem", color: "#4b5563" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#16a34a", fontWeight: "600" }}>
                Login
              </Link>
            </p>
          </RightSide>
        </Card>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default Register;
