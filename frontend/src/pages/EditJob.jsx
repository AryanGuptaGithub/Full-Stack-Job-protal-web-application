import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        category: '' // Assuming you have a category field
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
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
            await axios.put(`http://localhost:5000/api/jobs/${id}`, jobData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            toast.success('Job updated successfully!');
            navigate(`/jobs/${id}`); // Redirect back to the job details page
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
                <div className="container mx-auto mt-10 text-center">
                    <p>Loading job details for editing...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto mt-10 text-center text-red-500">
                    <p>{error}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Edit Job</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Job Title:</label>
                        <input type="text" id="title" name="title" value={jobData.title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div>
                        <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">Company Name:</label>
                        <input type="text" id="company" name="company" value={jobData.company} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location:</label>
                        <input type="text" id="location" name="location" value={jobData.location} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div>
                        <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2">Salary:</label>
                        <input type="number" id="salary" name="salary" value={jobData.salary} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea id="description" name="description" value={jobData.description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                        <input type="text" id="category" name="category" value={jobData.category} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Save Changes
                    </button>
                    <button type="button" onClick={() => navigate(`/jobs/${id}`)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">
                        Cancel
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditJob;