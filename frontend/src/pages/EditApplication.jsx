// src/pages/EditApplication.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 768px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  }
`;

const FileInput = styled.input`
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.5);
  }
`;

const Loading = styled.p`
  text-align: center;
  margin-top: 2.5rem;
  color: #4b5563;
`;

const EditApplication = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          `http://localhost:5000/api/applications/${applicationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessage(res.data.message || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching application:", err);
        setLoading(false);
      }
    };
    fetchApplication();
  }, [applicationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("message", message);
    if (resume) formData.append("resume", resume);

    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Application updated successfully!");
      navigate("/my-applications");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update application");
    }
  };

  if (loading) return <Loading>Loading...</Loading>;

  return (
    <>
      <Navbar />
      <Container>
        <Title>Edit Your Application</Title>
        <Form onSubmit={handleSubmit}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            rows={5}
          />

          <FileInput
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <SubmitButton type="submit">Update Application</SubmitButton>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default EditApplication;
