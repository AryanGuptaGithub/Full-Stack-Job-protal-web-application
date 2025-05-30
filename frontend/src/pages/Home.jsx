// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { RocketLaunchIcon, MagnifyingGlassIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-100 to-green-100 min-h-screen py-20 flex flex-col justify-center items-center">
        <div className="text-center">
          <RocketLaunchIcon className="mx-auto h-16 w-16 text-blue-600 mb-4 animate-bounce" />
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
            Launch Your Career with Job Portal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover thousands of job opportunities and find the perfect match for your skills and aspirations.
          </p>
          <div className="space-x-4">
            <Link
              to="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Find Jobs
            </Link>
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
            >
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Job Portal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-2">
                <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Extensive Job Listings</h3>
              <p className="text-gray-600">Access a wide range of job postings from various industries and locations.</p>
            </div>
            <div>
              <div className="bg-green-100 rounded-full p-4 inline-block mb-2">
                {/* <UserIcon className="h-8 w-8 text-green-600" /> */}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Personalized Experience</h3>
              <p className="text-gray-600">Tailor your job search and receive recommendations based on your profile.</p>
            </div>
            <div>
              <div className="bg-yellow-100 rounded-full p-4 inline-block mb-2">
                <BriefcaseIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Career Growth Resources</h3>
              <p className="text-gray-600">Find tools and articles to help you advance your career.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    
    </>
  );
};

export default Home;