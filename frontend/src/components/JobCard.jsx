import { Link } from "react-router-dom";

// components/JobCard.jsx
const JobCard = ({ _id, title, description, location, salary }) => (
  <Link
    to={`/jobs/${_id}`}
    className="block p-4 border rounded shadow hover:shadow-lg transition"
  >
    <h2 className="text-xl font-semibold">{title}</h2>
    <p>{description}</p>
    <p className="text-sm text-gray-600">{location}</p>
    <p className="text-sm text-green-600 font-medium">{salary}</p>
  </Link>
);

export default JobCard;