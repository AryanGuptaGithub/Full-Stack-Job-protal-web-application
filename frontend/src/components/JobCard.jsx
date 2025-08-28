// src/components/JobCard.jsx
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { BsArrowRightSquareFill } from "react-icons/bs";

const CardLink = styled(Link)`
  display: block;
  padding: 2.5rem 2.5rem ;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

const JobTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const JobDescription = styled.p`
  margin-bottom: 0.5rem;
`;

const JobLocation = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
`;

const JobSalary = styled.p`
  font-size: 1rem;
  color: #16a34a;
  font-weight: 500;
`;

const JobCard = ({ _id, title, description, location, salary }) => (
  <CardLink to={`/jobs/${_id}`}>
    <div className="flex items-center justify-between  ">
    <JobTitle>{title}</JobTitle> 
   <BsArrowRightSquareFill size={30} color="#16a34a" />
     </div>
    <JobDescription>{description}</JobDescription>
    <JobLocation>{location}</JobLocation>
    <JobSalary>₹{salary} /- per month</JobSalary>
  </CardLink>
);

export default JobCard;
