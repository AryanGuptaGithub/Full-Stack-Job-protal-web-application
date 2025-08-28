// src/pages/MyApplications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937; // gray-800
`;

const ErrorText = styled.p`
  color: #ef4444; // red-500
  margin-bottom: 1rem;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.li`
  border: 1px solid #d1d5db; // gray-300
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb; // gray-50
`;

const ResumeLink = styled.a`
  color: #3b82f6; // blue-500
  text-decoration: underline;
  display: block;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  color: #fff;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: background-color 0.2s;

  ${(props) =>
    props.variant === "edit"
      ? `
    background-color: #f59e0b; // yellow-500
    &:hover { background-color: #d97706; } // yellow-600
  `
      : `
    background-color: #dc2626; // red-600
    &:hover { background-color: #b91c1c; } // red-700
  `}
`;

const ButtonGroup = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 0.75rem;
`;

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(
        "http://localhost:5000/api/applications/mine",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    }
  };

  const handleDelete = async (applicationId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Application deleted");
      fetchApplications();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete application");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Title>My Applications</Title>
        {error && <ErrorText>{error}</ErrorText>}

        {applications.length === 0 ? (
          <p>You haven't applied to any jobs yet.</p>
        ) : (
          <List>
            {applications.map((app) => (
              <ListItem key={app._id}>
                <p>
                  <strong>Job:</strong> {app.title} at {app.company}
                </p>
                <p>
                  <strong>Location:</strong> {app.location}
                </p>
                <p>
                  <strong>Message:</strong> {app.message}
                </p>

                {app.extractedSkills && app.extractedSkills.length > 0 && (
                  <p>
                    <strong>Extracted Skills:</strong>{" "}
                    {app.extractedSkills.join(", ")}
                  </p>
                )}

                <p>
                  <strong>Applied At:</strong>{" "}
                  {new Date(app.appliedAt).toLocaleString()}
                </p>

                <ResumeLink
                  href={`http://localhost:5000/${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Resume
                </ResumeLink>

                <ButtonGroup>
                  <Link to={`/applications/edit/${app._id}`}>
                    <Button variant="edit">Edit</Button>
                  </Link>
                  <Button onClick={() => handleDelete(app._id)}>Delete</Button>
                </ButtonGroup>
              </ListItem>
            ))}
          </List>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MyApplications;
