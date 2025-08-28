// ✅ FILE: src/pages/Jobs.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { getJobs } from "../services/api";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  color: #1f2937;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease-in-out;

  svg {
    margin-right: 0.5rem;
  }
`;

const FilterButton = styled(Button)`
  background-color: #eff6ff;
  color: #3b82f6;

  &:hover {
    background-color: #dbeafe;
  }
`;

const ClearButton = styled(Button)`
  background-color: #e5e7eb;
  color: #374151;

  &:hover {
    background-color: #d1d5db;
  }
`;

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;

  @media(min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.375rem;
`;

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media(min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media(min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    return (
      (!category || job.category?.toLowerCase().includes(category.toLowerCase())) &&
      (!location || job.location?.toLowerCase().includes(location.toLowerCase())) &&
      (!minSalary || job.salary >= Number(minSalary)) &&
      (!maxSalary || job.salary <= Number(maxSalary))
    );
  });

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const clearFilters = () => {
    setCategory(""); setLocation(""); setMinSalary(""); setMaxSalary(""); setIsFilterOpen(false);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <Title>Available Jobs</Title>
          <FilterButton onClick={toggleFilter}>
            <FunnelIcon className="h-5 w-5" /> Filter
          </FilterButton>
        </Header>

        {isFilterOpen && (
          <FilterContainer>
            <Input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input type="number" placeholder="Min Salary" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
            <Input type="number" placeholder="Max Salary" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
            <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end' }}>
              <ClearButton onClick={clearFilters}><XMarkIcon className="h-5 w-5" /> Clear Filters</ClearButton>
            </div>
          </FilterContainer>
        )}

        <JobGrid>
          {loading ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>Loading jobs...</p>
          ) : error ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job._id} {...job} />)
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No jobs match your criteria.</p>
          )}
        </JobGrid>
      </Container>
      <Footer />
    </>
  );
};

export default Jobs;
