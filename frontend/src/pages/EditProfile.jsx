// src/pages/EditProfile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserIcon, EnvelopeIcon, DocumentIcon, LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";

// Styled Components
const PageWrapper = styled.div`
  background-color: #f3f4f6;
  min-height: 100vh;
  padding: 3rem 0;
`;

const Container = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-left: 0.5rem;
`;

const Alert = styled.div`
  position: relative;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  border: 1px solid ${({ type }) => (type === "error" ? "#f87171" : "#4ade80")};
  background-color: ${({ type }) => (type === "error" ? "#fee2e2" : "#d1fae5")};
  color: ${({ type }) => (type === "error" ? "#b91c1c" : "#065f46")};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldWrapper = styled.div`
  position: relative;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9ca3af;
  height: 1.25rem;
  width: 1.25rem;
`;

const Button = styled.button`
  width: 100%;
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
  }
`;

const EditProfile = () => {
    const [user, setUser] = useState({ username: "", email: "" });
    const [resume, setResume] = useState(null);
    const [existingResume, setExistingResume] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const res = await axios.get(`${BackendURL}/api/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userData = res.data;
            setUser({ username: userData.username, email: userData.email });
            setExistingResume(userData.resume || "");
            setLoading(false);
        } catch (err) {
            setError("Failed to load profile");
            setLoading(false);
        }
      };
      fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        try {
            const token = localStorage.getItem("jwt");
            const formData = new FormData();
            formData.append("username", user.username);
            formData.append("email", user.email);
            if (resume) formData.append("resume", resume);
            if (password) formData.append("password", password);

            const res = await axios.put(`${BackendURL}/api/profile/update`, formData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage("Profile updated successfully!");
            localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    if (loading) return <PageWrapper><p style={{textAlign:"center"}}>Loading profile information...</p></PageWrapper>;

    return (
        <>
            <Navbar />
            <PageWrapper>
                <Container>
                    <Header>
                        <UserIcon className="h-10 w-10 text-blue-500 mr-2" />
                        <Title>Edit Profile</Title>
                    </Header>

                    {error && <Alert type="error"><ExclamationCircleIcon style={{width:"1.25rem", position:"absolute", right:"0.5rem", top:"50%", transform:"translateY(-50%)"}} />{error}</Alert>}
                    {successMessage && <Alert type="success"><CheckCircleIcon style={{width:"1.25rem", position:"absolute", right:"0.5rem", top:"50%", transform:"translateY(-50%)"}} />{successMessage}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <FieldWrapper>
                            <Label>Username</Label>
                            <IconWrapper><UserIcon /></IconWrapper>
                            <Input type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} required />
                        </FieldWrapper>

                        <FieldWrapper>
                            <Label>Email</Label>
                            <IconWrapper><EnvelopeIcon /></IconWrapper>
                            <Input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                        </FieldWrapper>

                        <FieldWrapper>
                            <Label>New Resume</Label>
                            {existingResume && <p style={{fontSize:"0.875rem", color:"#6b7280", marginBottom:"0.25rem"}}>Current Resume: {existingResume.split("/").pop()}</p>}
                            <IconWrapper><DocumentIcon /></IconWrapper>
                            <Input type="file" onChange={(e) => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" />
                        </FieldWrapper>

                        <FieldWrapper>
                            <Label>New Password</Label>
                            <IconWrapper><LockClosedIcon /></IconWrapper>
                            <Input type="password" placeholder="Leave blank to keep same" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FieldWrapper>

                        <Button type="submit">Save Changes</Button>
                    </Form>
                </Container>
            </PageWrapper>
            <Footer />
        </>
    );
};

export default EditProfile;
