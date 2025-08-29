// ✅ FILE: src/pages/JobseekerDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BriefcaseIcon,
  DocumentMagnifyingGlassIcon,
  UserIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import styled from "styled-components";

// ---------- Styled Components ----------
const PageWrapper = styled.div`
  background: linear-gradient(to bottom right, #eef2ff, #f5f3ff);
  min-height: 100vh;
  padding: 2.5rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(Link)`
  background-color: ${(props) => props.bg || "#ffffff"};
  color: ${(props) => props.color || "#1f2937"};
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    background-color: ${(props) => props.hoverBg || "#f3f4f6"};
  }

  h2 {
    margin-top: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
  }

  p {
    text-align: center;
    font-size: 0.875rem;
    color: #4b5563;
  }

  svg {
    margin-bottom: 0.5rem;
    height: 2.5rem;
    width: 2.5rem;
  }
`;

const Section = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
    height: 1.5rem;
    width: 1.5rem;
    color: ${(props) => props.iconColor || "#fbbf24"};
  }
`;

const List = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: ${(props) =>
      props.recommendation ? "1fr 1fr" : "1fr"};
  }
`;

const ListItem = styled.li`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-weight: 600;
    color: #4f46e5;
    margin-bottom: 0.25rem;
  }

  p {
    margin-bottom: 0.25rem;
    color: #374151;
    font-size: 0.875rem;
  }

  a {
    display: inline-flex;
    align-items: center;
    color: #4f46e5;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    text-decoration: none;

    svg {
      margin-left: 0.25rem;
      height: 1.25rem;
      width: 1.25rem;
    }

    &:hover {
      color: #4338ca;
    }
  }
`;

// ---------- Component ----------
const JobseekerDashboard = () => {
  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const BackendURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const token = localStorage.getItem("jwt");

    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${BackendURL}api/applications/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications.slice(0, 3));
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${BackendURL}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appliedJobIds = new Set(applications.map((a) => a.job));
        const filtered = res.data.filter((job) => !appliedJobIds.has(job._id));
        setRecommendations(filtered.slice(0, 4));
      } catch (err) {
        console.error("Error fetching job recommendations", err);
      }
    };

    fetchApplications().then(fetchRecommendations);
  }, []);

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Container>
          <Section>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                marginBottom: "1.5rem",
                color: "#1f2937",
              }}
            >
              👋 Welcome,{" "}
              <span style={{ color: "#6366f1" }}>
                {user?.username || "Jobseeker"}
              </span>
              !
            </h1>
            <CardGrid>
              <Card to="/jobs" bg="#eef2ff" hoverBg="#dbeafe" color="#3b82f6">
                <BriefcaseIcon />
                <h2>🔍 Browse Jobs</h2>
                <p>Explore all available job listings.</p>
              </Card>
              <Card
                to="/my-applications"
                bg="#ecfdf5"
                hoverBg="#d1fae5"
                color="#22c55e"
              >
                <DocumentMagnifyingGlassIcon />
                <h2>📄 My Applications</h2>
                <p>Track your submitted applications.</p>
              </Card>
              <Card
                to="/edit-profile"
                bg="#fef3c7"
                hoverBg="#fef9c3"
                color="#eab308"
              >
                <UserIcon />
                <h2>👤 Edit Profile</h2>
                <p>Update your profile details.</p>
              </Card>
              <Card
                to="/account-security"
                bg="#fee2e2"
                hoverBg="#fecaca"
                color="#ef4444"
              >
                <ShieldCheckIcon />
                <h2>🔐 Account Security</h2>
                <p>Manage your account security.</p>
              </Card>
            </CardGrid>
          </Section>

          <Section>
            <SectionTitle>📌 Recent Applications</SectionTitle>
            {applications.length === 0 ? (
              <p style={{ color: "#6b7280" }}>
                You haven't applied to any jobs yet.
              </p>
            ) : (
              <List>
                {applications.map((app) => (
                  <ListItem key={app._id}>
                    <h3>{app.job?.title || "Job Title Unavailable"}</h3>
                    <p>
                      <strong>Company:</strong>{" "}
                      {app.job?.company || "Company Unavailable"}
                    </p>
                    <p>
                      <strong>Status:</strong> {app.status || "Pending"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    <Link to={`/applications/edit/${app._id}`}>
                      Edit Application
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                  </ListItem>
                ))}
              </List>
            )}
          </Section>

          <Section>
            <SectionTitle iconColor="#facc15">
              <SparklesIcon /> Recommended Jobs
            </SectionTitle>
            {recommendations.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No job recommendations yet.</p>
            ) : (
              <List recommendation>
                {recommendations.map((job) => (
                  <ListItem key={job._id}>
                    <h3>{job.title}</h3>
                    <p>
                      <strong>{job.company}</strong> - {job.location}
                    </p>
                    <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
                      {job.description}
                    </p>
                    <Link to={`/jobs/${job._id}`}>
                      View Details
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </ListItem>
                ))}
              </List>
            )}
          </Section>
        </Container>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default JobseekerDashboard;
