// src/pages/ResumeBuilder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media(min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.bg || '#3b82f6'};
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.hover || '#2563eb'};
  }
`;

const SkillContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const PreviewCard = styled.div`
  position: sticky;
  top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
`;

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
    education: [{ institution: '', degree: '', field: '', startDate: '', endDate: '' }],
    experience: [{ company: '', position: '', description: '', startDate: '', endDate: '' }],
    skills: ['']
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`/api/resume/${user._id}`);
        if (response.data) setResumeData(response.data.data);
      } catch (error) {
        console.log('No resume found or error loading resume');
      }
    };
    if (user?._id) fetchResume();
  }, [user]);

  const handlePersonalInfoChange = e => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducation = [...resumeData.education];
    newEducation[index][name] = value;
    setResumeData(prev => ({ ...prev, education: newEducation }));
  };
  const addEducation = () => setResumeData(prev => ({ ...prev, education: [...prev.education, { institution: '', degree: '', field: '', startDate: '', endDate: '' }] }));
  const removeEducation = index => setResumeData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperience = [...resumeData.experience];
    newExperience[index][name] = value;
    setResumeData(prev => ({ ...prev, experience: newExperience }));
  };
  const addExperience = () => setResumeData(prev => ({ ...prev, experience: [...prev.experience, { company: '', position: '', description: '', startDate: '', endDate: '' }] }));
  const removeExperience = index => setResumeData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));

  const handleSkillChange = (index, e) => {
    const newSkills = [...resumeData.skills];
    newSkills[index] = e.target.value;
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  };
  const addSkill = () => setResumeData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  const removeSkill = index => setResumeData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));

  const saveResume = async () => {
    try {
      await axios.post('/api/resume/save', { applicantId: user._id, resumeData });
      toast.success('Resume saved successfully!');
    } catch (error) {
      toast.error('Error saving resume');
      console.error(error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    pageStyle: `@page { size: A4; margin: 1cm; } @media print { body { -webkit-print-color-adjust: exact; } }`,
    onAfterPrint: () => toast.success('Resume downloaded successfully!')
  });

  const ResumeTemplate = React.forwardRef(({ data }, ref) => (
    <div ref={ref} style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto', background: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{data.personalInfo.name}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>{data.personalInfo.email}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.address}</p>
        </div>
      </div>
      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '2px solid #e5e7eb', marginBottom: '0.75rem', paddingBottom: '0.25rem' }}>Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: 500 }}>{edu.institution}</h3>
              <p style={{ color: '#6b7280' }}>{edu.startDate} - {edu.endDate}</p>
            </div>
            <p style={{ color: '#374151' }}>{edu.degree} in {edu.field}</p>
          </div>
        ))}
      </section>
      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '2px solid #e5e7eb', marginBottom: '0.75rem', paddingBottom: '0.25rem' }}>Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: 500 }}>{exp.company}</h3>
              <p style={{ color: '#6b7280' }}>{exp.startDate} - {exp.endDate}</p>
            </div>
            <p style={{ fontWeight: 500, color: '#374151' }}>{exp.position}</p>
            <p style={{ color: '#6b7280' }}>{exp.description}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', borderBottom: '2px solid #e5e7eb', marginBottom: '0.75rem', paddingBottom: '0.25rem' }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {data.skills.map((skill, index) => skill && <span key={index} style={{ background: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{skill}</span>)}
        </div>
      </section>
    </div>
  ));

  return (
    <Container>
      <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem' }}>Resume Builder</h1>
      <Grid>
        <Card>
          {/* Personal Info */}
          <SectionHeader>
            <Title>Personal Information</Title>
          </SectionHeader>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {Object.keys(resumeData.personalInfo).map(key => (
              <Input
                key={key}
                type={key === 'email' ? 'email' : 'text'}
                name={key}
                value={resumeData.personalInfo[key]}
                onChange={handlePersonalInfoChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </div>

          {/* Education */}
          <SectionHeader>
            <Title>Education</Title>
            <Button onClick={addEducation}>Add Education</Button>
          </SectionHeader>
          {resumeData.education.map((edu, index) => (
            <Card key={index}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input type="text" name="institution" value={edu.institution} onChange={e => handleEducationChange(index, e)} placeholder="Institution"/>
                <Input type="text" name="degree" value={edu.degree} onChange={e => handleEducationChange(index, e)} placeholder="Degree"/>
                <Input type="text" name="field" value={edu.field} onChange={e => handleEducationChange(index, e)} placeholder="Field"/>
                <Input type="month" name="startDate" value={edu.startDate} onChange={e => handleEducationChange(index, e)} />
                <Input type="month" name="endDate" value={edu.endDate} onChange={e => handleEducationChange(index, e)} />
              </div>
              {resumeData.education.length > 1 && <Button bg="#ef4444" hover="#dc2626" onClick={() => removeEducation(index)}>Remove</Button>}
            </Card>
          ))}

          {/* Experience */}
          <SectionHeader>
            <Title>Experience</Title>
            <Button onClick={addExperience}>Add Experience</Button>
          </SectionHeader>
          {resumeData.experience.map((exp, index) => (
            <Card key={index}>
              <Input type="text" name="company" value={exp.company} onChange={e => handleExperienceChange(index, e)} placeholder="Company"/>
              <Input type="text" name="position" value={exp.position} onChange={e => handleExperienceChange(index, e)} placeholder="Position"/>
              <Textarea name="description" value={exp.description} onChange={e => handleExperienceChange(index, e)} rows="3" placeholder="Description"/>
              <Input type="month" name="startDate" value={exp.startDate} onChange={e => handleExperienceChange(index, e)} />
              <Input type="month" name="endDate" value={exp.endDate} onChange={e => handleExperienceChange(index, e)} />
              {resumeData.experience.length > 1 && <Button bg="#ef4444" hover="#dc2626" onClick={() => removeExperience(index)}>Remove</Button>}
            </Card>
          ))}

          {/* Skills */}
          <SectionHeader>
            <Title>Skills</Title>
            <Button onClick={addSkill}>Add Skill</Button>
          </SectionHeader>
          {resumeData.skills.map((skill, index) => (
            <SkillContainer key={index}>
              <Input type="text" value={skill} onChange={e => handleSkillChange(index, e)} placeholder="Skill"/>
              {resumeData.skills.length > 1 && <Button bg="#ef4444" hover="#dc2626" onClick={() => removeSkill(index)}>×</Button>}
            </SkillContainer>
          ))}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <Button bg="#16a34a" hover="#15803d" onClick={saveResume}>Save Resume</Button>
            <Button onClick={handlePrint}>Download PDF</Button>
          </div>
        </Card>

        {/* Preview */}
        <PreviewCard>
          <Title>Resume Preview</Title>
          <ResumeTemplate data={resumeData} ref={resumeRef} />
        </PreviewCard>
      </Grid>
    </Container>
  );
};

export default ResumeBuilder;
