// src/pages/CreateJob.jsx
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 668px;
  margin: 3rem auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const PageHeader = styled.div`
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
  background-color: ${(props) =>
    props.type === "error" ? "#fee2e2" : "#d1fae5"};
  border: 1px solid
    ${(props) => (props.type === "error" ? "#fca5a5" : "#34d399")};
  color: ${(props) => (props.type === "error" ? "#b91c1c" : "#065f46")};
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  position: relative;

  svg {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    height: 1.5rem;
    width: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .input-container {
    position: relative;

    svg {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      height: 1.25rem;
      width: 1.25rem;
    }

    input,
    textarea {
      width: 85%;
      padding: 1rem 2rem 1rem 3rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      outline: none;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);

      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
      }
    }

    textarea {
      resize: vertical;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #2563eb;
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.5);
  }
`;

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    category: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${BackendURL}/api/jobs/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Job posted successfully!");
        setFormData({
          title: "",
          company: "",
          location: "",
          salary: "",
          category: "",
          description: "",
        });
        setTimeout(() => navigate("/jobs"), 1500);
      } else {
        setError("Failed to post job: Server responded with an error.");
      }
    } catch (err) {
      console.error("Failed to post job", err);
      setError(
        err.response?.data?.message ||
          "Failed to post job. Make sure you're logged in as a recruiter."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "3rem 0" }}>
        <Container>
          <PageHeader>
            <BriefcaseIcon />
            <h2>Create a New Job</h2>
          </PageHeader>

          {error && (
            <Alert type="error">
              <strong>Error!</strong> {error} <ExclamationCircleIcon />
            </Alert>
          )}

          {successMessage && (
            <Alert type="success">
              <strong>Success!</strong> {successMessage} <CheckCircleIcon />
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FieldWrapper>
              <label htmlFor="title">Job Title</label>
              <div className="input-container">
                <BriefcaseIcon />
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="e.g., Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper>
              <label htmlFor="company">Company Name</label>
              <div className="input-container">
                <BuildingOfficeIcon />
                <input
                  type="text"
                  name="company"
                  id="company"
                  placeholder="e.g., Tech Innovations Inc."
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper>
              <label htmlFor="location">Location</label>
              <div className="input-container">
                <MapPinIcon />
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="e.g., Mumbai, India"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper>
              <label htmlFor="salary">Salary (₹)</label>
              <div className="input-container">
                <CurrencyDollarIcon />
                <input
                  type="number"
                  name="salary"
                  id="salary"
                  placeholder="e.g., 50000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper>
              <label htmlFor="category">Category</label>
              <div className="input-container">
                <TagIcon />
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="e.g., IT, HR, Finance"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </FieldWrapper>

            <FieldWrapper>
              <label htmlFor="description">Job Description</label>
              <div className="input-container">
                <DocumentTextIcon />
                <textarea
                  name="description"
                  id="description"
                  placeholder="Describe the job role and responsibilities"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>
            </FieldWrapper>

            <SubmitButton type="submit">Post Job</SubmitButton>
          </Form>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default CreateJob;
