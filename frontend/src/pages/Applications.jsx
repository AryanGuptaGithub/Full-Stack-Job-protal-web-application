// src/pages/Applications.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { DocumentArrowDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 2.5rem auto;
  padding: 1.5rem;
`;

const PageTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;

  span {
    color: #2563eb;
  }
`;

const Alert = styled.div`
  background-color: ${(props) =>
    props.type === "error" ? "#fee2e2" : "#fef3c7"};
  border: 1px solid ${(props) =>
    props.type === "error" ? "#fca5a5" : "#fcd34d"};
  color: ${(props) => (props.type === "error" ? "#b91c1c" : "#b45309")};
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const ApplicationCard = styled.li`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
`;

const Field = styled.div`
  margin-bottom: 0.75rem;

  strong {
    color: #374151;
    font-weight: 600;
  }

  span, p {
    color: ${(props) => props.gray ? "#4b5563" : "#2563eb"};
    font-weight: ${(props) => (props.gray ? "400" : "500")};
  }
`;

const SkillsContainer = styled.div`
  margin-bottom: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillBadge = styled.span`
  background-color: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a, button {
    display: inline-flex;
    align-items: center;
    font-size: 0.875rem;
    text-decoration: none;
    cursor: pointer;

    svg {
      height: 1.25rem;
      width: 1.25rem;
      margin-right: 0.25rem;
    }
  }

  a:hover, button:hover {
    text-decoration: underline;
  }

  a:first-child {
    color: #2563eb;
  }

  a:nth-child(2) {
    color: #ca8a04;
  }

  button {
    background: none;
    border: none;
    color: #dc2626;
    padding: 0;
  }
`;

const Applications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          `https://full-stack-job-protal-web-application.onrender.com/api/applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📦 Applications fetched:", res.data.applications);
        setApplications(res.data.applications);
        setJobTitle(res.data.jobTitle);
      } catch (err) {
        console.error("❌ Failed to fetch applications:", err);
        setError("Failed to fetch applications or you're not authorized.");
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`https://full-stack-job-protal-web-application.onrender.com/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(applications.filter((app) => app._id !== id));
      alert("Application deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting application:", err);
      alert("Failed to delete application.");
    }
  };

  if (error) return <Alert type="error"><p>{error}</p></Alert>;

  return (
    <Container>
      <PageTitle>
        Applications for: <span>{jobTitle}</span>
      </PageTitle>

      {applications.length === 0 ? (
        <Alert type="info">
          <strong>Info!</strong> <span>No applications received for this job yet.</span>
        </Alert>
      ) : (
        <ul>
          {applications.map((app) =>
            app?._id ? (
              <ApplicationCard key={app._id}>
                <Field>
                  <strong>Name:</strong>{" "}
                  <span>{app.applicant?.username || "N/A"}</span>
                </Field>
                <Field gray>
                  <strong>Email:</strong>{" "}
                  <span>{app.applicant?.email || "N/A"}</span>
                </Field>
                <Field gray>
                  <strong>Message:</strong>{" "}
                  <p>{app.message || "No message provided."}</p>
                </Field>

                {app.extractedSkills && app.extractedSkills.length > 0 && (
                  <SkillsContainer>
                    <strong>Extracted Skills:</strong>{" "}
                    {app.extractedSkills.map((skill, index) => (
                      <SkillBadge key={index}>{skill}</SkillBadge>
                    ))}
                  </SkillsContainer>
                )}

                <ActionGroup>
                  <a
                    href={`https://full-stack-job-protal-web-application.onrender.com/${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DocumentArrowDownIcon />
                    Download Resume
                  </a>
                  <Link to={`/applications/edit/${app._id}`}>
                    <PencilIcon />
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(app._id)}>
                    <TrashIcon />
                    Delete
                  </button>
                </ActionGroup>
              </ApplicationCard>
            ) : null
          )}
        </ul>
      )}
    </Container>
  );
};

export default Applications;
