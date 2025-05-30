import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const resumeRef = useRef();
  
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: ''
    },
    education: [
      { institution: '', degree: '', field: '', startDate: '', endDate: '' }
    ],
    experience: [
      { company: '', position: '', description: '', startDate: '', endDate: '' }
    ],
    skills: ['']
  });

  // Load saved resume if exists
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`/api/resume/${user._id}`);
        if (response.data) {
          setResumeData(response.data.data);
        }
      } catch (error) {
        console.log('No resume found or error loading resume');
      }
    };
    
    if (user?._id) {
      fetchResume();
    }
  }, [user]);

  // Handlers for personal info
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  // Handlers for education
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducation = [...resumeData.education];
    newEducation[index][name] = value;
    setResumeData(prev => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field: '', startDate: '', endDate: '' }]
    }));
  };

  const removeEducation = (index) => {
    const newEducation = [...resumeData.education];
    newEducation.splice(index, 1);
    setResumeData(prev => ({ ...prev, education: newEducation }));
  };

  // Handlers for experience
  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperience = [...resumeData.experience];
    newExperience[index][name] = value;
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', description: '', startDate: '', endDate: '' }]
    }));
  };

  const removeExperience = (index) => {
    const newExperience = [...resumeData.experience];
    newExperience.splice(index, 1);
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };

  // Handlers for skills
  const handleSkillChange = (index, e) => {
    const { value } = e.target;
    const newSkills = [...resumeData.skills];
    newSkills[index] = value;
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  };

  const removeSkill = (index) => {
    const newSkills = [...resumeData.skills];
    newSkills.splice(index, 1);
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  };

  // Save resume to backend
  const saveResume = async () => {
    try {
      await axios.post('/api/resume/save', {
        applicantId: user._id,
        resumeData
      });
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error('Error saving resume');
      console.error(error);
    }
  };

  // Print/Download resume
  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    pageStyle: `
      @page { size: A4; margin: 1cm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
      }
    `,
    onAfterPrint: () => toast.success('Resume downloaded successfully!')
  });

  // Resume template
  const ResumeTemplate = React.forwardRef(({ data }, ref) => (
    <div ref={ref} className="p-6 max-w-3xl mx-auto bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{data.personalInfo.name}</h1>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.address}</p>
        </div>
      </div>
      
      {/* Education */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b-2 border-gray-200 pb-1 mb-3">Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{edu.institution}</h3>
              <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
            <p className="text-gray-700">{edu.degree} in {edu.field}</p>
          </div>
        ))}
      </section>
      
      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b-2 border-gray-200 pb-1 mb-3">Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{exp.company}</h3>
              <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
            </div>
            <p className="font-medium text-gray-700">{exp.position}</p>
            <p className="text-gray-600">{exp.description}</p>
          </div>
        ))}
      </section>
      
      {/* Skills */}
      <section>
        <h2 className="text-xl font-semibold border-b-2 border-gray-200 pb-1 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            skill && <span key={index} className="bg-gray-100 px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  ));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {/* Personal Info */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={resumeData.personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={resumeData.personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={resumeData.personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={resumeData.personalInfo.linkedin}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                <input
                  type="url"
                  name="portfolio"
                  value={resumeData.personalInfo.portfolio}
                  onChange={handlePersonalInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </section>
          
          {/* Education */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Education</h2>
              <button
                onClick={addEducation}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add Education
              </button>
            </div>
            
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                    <input
                      type="text"
                      name="field"
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="month"
                        name="startDate"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="month"
                        name="endDate"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, e)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                {resumeData.education.length > 1 && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove Education
                  </button>
                )}
              </div>
            ))}
          </section>
          
          {/* Experience */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Experience</h2>
              <button
                onClick={addExperience}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add Experience
              </button>
            </div>
            
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="month"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="month"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                {resumeData.experience.length > 1 && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove Experience
                  </button>
                )}
              </div>
            ))}
          </section>
          
          {/* Skills */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Skills</h2>
              <button
                onClick={addSkill}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Add Skill
              </button>
            </div>
            
            <div className="space-y-3">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Skill (e.g., JavaScript, Project Management)"
                  />
                  {resumeData.skills.length > 1 && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={saveResume}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Resume
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Download PDF
            </button>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="hidden lg:block">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resume Preview</h2>
            <div className="border rounded-lg p-4 bg-gray-50">
              <ResumeTemplate data={resumeData} ref={resumeRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;