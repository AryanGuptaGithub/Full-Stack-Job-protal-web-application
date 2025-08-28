// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { UserGroupIcon, BriefcaseIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";

// Styled Components
const PageWrapper = styled.div`
  background: linear-gradient(to bottom right, #f9fafb, #fafafa);
  min-height: 100vh;
  padding: 2.5rem 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;

  svg {
    height: 2rem;
    width: 2rem;
    color: #8b5cf6;
    margin-right: 0.5rem;
  }
`;

const Alert = styled.div`
  position: relative;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media(min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.05);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  svg {
    height: 2rem;
    width: 2rem;
    margin-right: 0.75rem;
    color: ${(props) => props.iconColor || "#000"};
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ListItem = styled.li`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;

  span:first-child {
    color: #374151;
  }

  span:last-child {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: #ede9fe;
    color: #6b21a8;
  }
`;

const JobListItem = styled.li`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;

  p:first-child {
    font-weight: 600;
    color: #374151;
  }

  p:last-child {
    font-size: 0.875rem;
    color: #4b5563;
  }
`;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const usersRes = await axios.get("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${token}` }});
      const jobsRes = await axios.get("http://localhost:5000/api/admin/jobs", { headers: { Authorization: `Bearer ${token}` }});

      setUsers(usersRes.data.users);
      setJobs(jobsRes.data.jobs);
    } catch (err) {
      console.error("Error fetching admin data", err);
      setError("Failed to load admin data.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Container>
          <PageTitle>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354l-2.169 3.04a4 4 0 01-2.121 1.414l-3.04-2.169A4 4 0 014.354 12l3.04 2.169a4 4 0 011.414 2.121l-2.169 3.04A4 4 0 0112 19.646l2.169-3.04a4 4 0 012.121-1.414l3.04 2.169A4 4 0 0119.646 12l-3.04-2.169a4 4 0 01-1.414-2.121l2.169-3.04A4 4 0 0112 4.354z" />
            </svg>
            Admin Dashboard
          </PageTitle>

          {error && (
            <Alert role="alert">
              <strong>Error!</strong> <span>{error}</span>
              <ExclamationCircleIcon />
            </Alert>
          )}

          <Grid>
            <Card>
              <CardHeader iconColor="#a78bfa">
                <UserGroupIcon />
                <h2>Users ({users.length})</h2>
              </CardHeader>
              <List>
                {users.map((user) => (
                  <ListItem key={user._id}>
                    <span>{user.username}</span>
                    <span>{user.role}</span>
                  </ListItem>
                ))}
              </List>
            </Card>

            <Card>
              <CardHeader iconColor="#3b82f6">
                <BriefcaseIcon />
                <h2>Jobs Posted ({jobs.length})</h2>
              </CardHeader>
              <List>
                {jobs.map((job) => (
                  <JobListItem key={job._id}>
                    <p>{job.title}</p>
                    <p>Company: {job.company}</p>
                  </JobListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Container>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default AdminDashboard;
