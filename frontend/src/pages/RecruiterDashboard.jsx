// src/pages/RecruiterDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BriefcaseIcon,
  UserIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 2.5rem 0;
  background: linear-gradient(to bottom right, #f3f4f6, #dbeafe); // gray-100 to blue-50
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const CardWrapper = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937; // gray-800
  margin-bottom: 1.5rem;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937; // gray-800
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DashboardLink = styled(Link)`
  background-color: ${(props) =>
    props.bgcolor ? props.bgcolor : "#f3f4f6"}; // default gray-50
  color: ${(props) => (props.color ? props.color : "#1e3a8a")}; // default blue-700
  padding: 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: ${(props) => (props.hover ? props.hover : "#e0f2fe")};
  }
`;

const JobList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const JobItem = styled.li`
  background-color: #f9fafb; // gray-50
  border: 1px solid #e5e7eb; // gray-200
  padding: 1rem;
  border-radius: 0.5rem;
  transition: box-shadow 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const JobTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e40af; // blue-700
  margin-bottom: 0.25rem;
`;

const JobInfo = styled.p`
  color: #374151; // gray-700
  margin-bottom: 0.25rem;
  strong {
    font-weight: 600;
  }
`;

const ViewApplicationsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #3b82f6; // blue-500
  margin-top: 0.5rem;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #1e40af; // blue-700
  }
  svg {
    margin-right: 0.25rem;
  }
`;

const RecruiterDashboard = () => {
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`${BackendURL}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postedJobs = res.data.filter(
          (job) => job.postedBy === storedUser._id
        );
        setJobs(postedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Container>
          <CardWrapper>
            <Title>
              👋 Welcome,{" "}
              <span style={{ color: "#2563eb" }}>{user?.username || "Recruiter"}</span>!
            </Title>

            <Grid>
              <DashboardLink
                to="/jobs"
                bgcolor="#eff6ff"
                color="#1d4ed8"
                hover="#dbeafe"
              >
                <BriefcaseIcon className="h-10 w-10 mb-2" />
                <h2>📢 All Jobs</h2>
                <p>Browse your posted jobs or others in the system.</p>
              </DashboardLink>

              <DashboardLink
                to="/edit-profile"
                bgcolor="#fef3c7"
                color="#b45309"
                hover="#fef9c3"
              >
                <UserIcon className="h-10 w-10 mb-2" />
                <h2>👤 Edit Profile</h2>
                <p>Update your information and company profile.</p>
              </DashboardLink>

              <DashboardLink
                to="/create-job"
                bgcolor="#dcfce7"
                color="#15803d"
                hover="#bbf7d0"
              >
                <PlusCircleIcon className="h-10 w-10 mb-2" />
                <h2>➕ Post New Job</h2>
                <p>Open up a new opportunity for job seekers.</p>
              </DashboardLink>
            </Grid>
          </CardWrapper>

          <CardWrapper>
            <SubTitle>📂 Your Posted Jobs</SubTitle>
            {jobs.length === 0 ? (
              <p style={{ color: "#4b5563" }}>You haven't posted any jobs yet.</p>
            ) : (
              <JobList>
                {jobs.map((job) => (
                  <JobItem key={job._id}>
                    <JobTitle>{job.title}</JobTitle>
                    <JobInfo>
                      <strong>Company:</strong> {job.company}
                    </JobInfo>
                    <JobInfo>
                      <strong>Location:</strong> {job.location}
                    </JobInfo>
                    <ViewApplicationsLink to={`/applications/${job._id}`}>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.176 8-5.042 8-3.866 0-7.657-3.943-8.93-8z"
                        />
                      </svg>
                      View Applications
                    </ViewApplicationsLink>
                  </JobItem>
                ))}
              </JobList>
            )}
          </CardWrapper>
        </Container>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default RecruiterDashboard;
