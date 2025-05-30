import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { getJobs } from "../services/api";
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setCategory("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
    setIsFilterOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Available Jobs</h1>
          <button
            onClick={toggleFilter}
            className="bg-blue-50 hover:bg-blue-100 text-blue-500 font-semibold py-2 px-4 rounded-full flex items-center transition duration-200 ease-in-out"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>

        {isFilterOpen && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white shadow-md rounded-lg p-4">
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Min Salary"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Max Salary"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="md:col-span-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-full flex items-center transition duration-200 ease-in-out"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p>Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job._id} {...job} />)
          ) : (
            <div className="col-span-full text-center py-8 text-gray-600">
              <p>No jobs match your criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Jobs;
