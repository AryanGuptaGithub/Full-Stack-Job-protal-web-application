// src/pages/EditJob.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 768px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  color: ${({ color }) => color || '#fff'};
  background-color: ${({ bgColor }) => bgColor || '#10b981'};

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || '#059669'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(16,185,129,0.3);
  }
`;

const Loading = styled.p`
  text-align: center;
  margin-top: 2.5rem;
  color: #4b5563;
`;

const ErrorMsg = styled.div`
  text-align: center;
  margin-top: 2.5rem;
  color: #dc2626;
`;

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        category: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`${BackendURL}/api/jobs/${id}`);
                setJobData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch job details for editing.');
                setLoading(false);
                console.error(err);
                toast.error('Failed to fetch job details.');
            }
        };
        fetchJobDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BackendURL}/api/jobs/${id}`, jobData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            toast.success('Job updated successfully!');
            navigate(`/jobs/${id}`);
        } catch (err) {
            setError('Failed to update job.');
            console.error('Error updating job:', err);
            toast.error(err.response?.data?.message || 'Failed to update job.');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading>Loading job details for editing...</Loading>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <ErrorMsg>{error}</ErrorMsg>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container>
                <Title>Edit Job</Title>
                <Form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="title">Job Title:</Label>
                        <Input type="text" id="title" name="title" value={jobData.title} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="company">Company Name:</Label>
                        <Input type="text" id="company" name="company" value={jobData.company} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="location">Location:</Label>
                        <Input type="text" id="location" name="location" value={jobData.location} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="salary">Salary:</Label>
                        <Input type="number" id="salary" name="salary" value={jobData.salary} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="description">Description:</Label>
                        <Textarea id="description" name="description" value={jobData.description} onChange={handleChange} rows="4" required />
                    </div>
                    <div>
                        <Label htmlFor="category">Category:</Label>
                        <Input type="text" id="category" name="category" value={jobData.category} onChange={handleChange} />
                    </div>
                    <ButtonGroup>
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" bgColor="#d1d5db" color="#374151" hoverColor="#9ca3af" onClick={() => navigate(`/jobs/${id}`)}>Cancel</Button>
                    </ButtonGroup>
                </Form>
            </Container>
            <Footer />
        </>
    );
};

export default EditJob;
