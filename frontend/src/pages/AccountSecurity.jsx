// src/pages/AccountSecurity.jsx
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import styled from "styled-components";

// Styled Components
const PageWrapper = styled.div`
  background-color: #f3f4f6;
  min-height: 100vh;
  padding: 3rem 0;
`;

const FormContainer = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  svg {
    height: 2.5rem;
    width: 2.5rem;
    color: #3b82f6;
    margin-right: 0.5rem;
  }
`;

const Alert = styled.div`
  position: relative;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid ${(props) => props.borderColor};
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};

  strong {
    font-weight: 700;
  }

  svg {
    position: absolute;
    top: 0.25rem;
    bottom: 0.25rem;
    right: 0.5rem;
    height: 1.5rem;
    width: 1.5rem;
    fill: currentColor;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    margin-top: 0.25rem;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.5);
  }
`;

const AccountSecurity = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const payload = {};
      if (email) payload.email = email;
      if (password) payload.password = password;

      const res = await axios.put(
        "https://full-stack-job-protal-web-application.onrender.com/api/users/update-security",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Account details updated successfully.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating security info:", err);
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <FormContainer>
          <Header>
            <KeyIcon />
            <h2>Account Security</h2>
          </Header>

          {error && (
            <Alert
              bgColor="#fee2e2"
              borderColor="#fca5a5"
              textColor="#b91c1c"
              role="alert"
            >
              <strong>Error!</strong> <span>{error}</span>
              <ExclamationCircleIcon />
            </Alert>
          )}

          {message && (
            <Alert
              bgColor="#d1fae5"
              borderColor="#6ee7b7"
              textColor="#047857"
              role="alert"
            >
              <strong>Success!</strong> <span>{message}</span>
              <CheckCircleIcon />
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="new-email">New Email</label>
              <input
                type="email"
                id="new-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter new email"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </FormGroup>

            <SubmitButton type="submit">Update Security Info</SubmitButton>
          </Form>
        </FormContainer>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default AccountSecurity;
