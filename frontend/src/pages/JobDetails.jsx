// ✅ FILE: src/pages/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaLaptopCode } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Info = styled.p`
  font-size: 1.125rem;
  color: #374151;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const Description = styled.div`
  margin: 1.5rem 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: none;
  margin-right: 0.5rem;

  svg {
    margin-right: 0.5rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled(Button)`
  background-color: #3b82f6;
  color: white;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
`;

const EditButton = styled(Button)`
  background-color: #f59e0b;
  color: white;

  &:hover {
    background-color: #b45309;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ef4444;
  color: white;

  &:hover {
    background-color: #b91c1c;
  }
`;

const ViewButton = styled(Button)`
  background-color: #10b981;
  color: white;

  &:hover {
    background-color: #047857;
  }
`;

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BackendURL = import.meta.env.VITE_API_URL;

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchJob = async () => {
      try {
        const response = await axios.get(`${BackendURL}/api/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError("Job not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!storedUser) {
      toast.warn("Please log in to apply.");
      navigate("/login");
      return;
    }

    if (storedUser.role === "recruiter") {
      toast.error("Recruiters cannot apply to jobs.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("message", "Looking forward to this role!");
      const dummyFile = new File(["Dummy Resume"], "resume.pdf", {
        type: "application/pdf",
      });
      formData.append("resume", dummyFile);
      formData.append("applicant", storedUser._id);

      const response = await axios.post(
        `${BackendURL}/api/applications/${job._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        response.data.message || "Application submitted successfully!"
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to apply.");
    }
  };

  const handleEditJob = () => navigate(`/edit-job/${job._id}`);

  const handleDeleteJob = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${BackendURL}/api/jobs/${job._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        toast.success("Job deleted successfully!");
        navigate("/recruiter/dashboard");
      } catch (err) {
        console.error("Error deleting job:", err);
        toast.error(err.response?.data?.message || "Failed to delete job.");
      }
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading job details...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        {error}
      </p>
    );

  const isRecruiterOwner =
    storedUser?.role === "recruiter" && storedUser._id === job.postedBy;

  return (
    <>
      <Navbar />
      <Container>
        <Title>{job.title}</Title>
        <Info>
          <FaLaptopCode size={40} /> <strong> Company: </strong> &nbsp;{" "}
          {job.company}
        </Info>
        <Info>
          <IoLocationOutline size={40} /> <strong> Location: </strong> &nbsp;{" "}
          {job.location}
        </Info>
        <Info>
          <RiMoneyRupeeCircleFill size={40} /> <strong> Salary: </strong> &nbsp;{" "}
          {job.salary ? `₹${job.salary}` : "Not specified"}
        </Info>

        <Description>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Description
          </h2>
          <p>{job.description}</p>
        </Description>

        <ApplyButton
          onClick={handleApply}
          disabled={storedUser?.role === "recruiter"}
        >
          <DocumentPlusIcon className="h-5 w-5" /> Apply Now
        </ApplyButton>

        {isRecruiterOwner && (
          <div style={{ marginTop: "1rem", display: "flex" }}>
            <Link to={`/applications/${job._id}`}>
              <ViewButton>
                <EyeIcon className="h-5 w-5" /> View Applications
              </ViewButton>
            </Link>
            <EditButton onClick={handleEditJob}>
              <PencilSquareIcon className="h-5 w-5" /> Edit Job
            </EditButton>
            <DeleteButton onClick={handleDeleteJob}>
              <TrashIcon className="h-5 w-5" /> Delete Job
            </DeleteButton>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default JobDetails;
