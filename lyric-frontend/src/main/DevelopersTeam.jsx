import React, { useState } from "react";
import "./DevelopersTeam.css";
import { FaEnvelope, FaLinkedin, FaPhone, FaGithub } from "react-icons/fa";

const developers = [
  {
    name: "Alex Johnson",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    phone: "+1 555-123-4567",
    email: "alex.johnson@email.com",
    linkedin: "https://linkedin.com/in/alexjohnson",
    github: "https://github.com/alexjohnson",
    contributions: [
      "Implemented the audio player feature.",
      "Optimized backend API performance.",
      "Wrote unit and integration tests."
    ]
  },
  {
    name: "Priya Singh",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    phone: "+91 98765-43210",
    email: "priya.singh@email.com",
    linkedin: "https://linkedin.com/in/priyasingh",
    github: "https://github.com/priyasingh",
    contributions: [
      "Designed the user dashboard UI.",
      "Improved mobile responsiveness.",
      "Enhanced security for user data."
    ]
  },
  {
    name: "Michael Lee",
    photo: "https://randomuser.me/api/portraits/men/65.jpg",
    phone: "+44 20 7946 0958",
    email: "michael.lee@email.com",
    linkedin: "https://linkedin.com/in/michaellee",
    github: "https://github.com/michaellee",
    contributions: [
      "Integrated third-party authentication.",
      "Created the playlist management system.",
      "Set up CI/CD pipelines."
    ]
  },
  {
    name: "Sara Kim",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    phone: "+82 10-2345-6789",
    email: "sara.kim@email.com",
    linkedin: "https://linkedin.com/in/sarakim",
    github: "https://github.com/sarakim",
    contributions: [
      "Built the trending songs module.",
      "Enhanced accessibility features.",
      "Led team code reviews."
    ]
  }
];



export default function DevelopersTeam() {
  const [shownContrib, setShownContrib] = useState([false, false, false, false]);

  function handleShowContribution(idx) {
    const newShown = [...shownContrib];
    newShown[idx] = !newShown[idx];
    setShownContrib(newShown);
  }

  return (
    <div className="dev-center-container">
      <div className="dev-heading">Our Developers Team</div>
      <div className="dev-cards-grid-wrapper">
        <div className="dev-cards-grid">
          {developers.map((dev, idx) => (
            <div className="dev-card" key={idx}>
              <img src={dev.photo} alt={dev.name} className="dev-photo" />
              <div className="dev-name">{dev.name}</div>
              <button className="contrib-btn" onClick={() => handleShowContribution(idx)}>
                Contributions
              </button>
              {shownContrib[idx] && (
                <div className="contrib-popup">
                  {dev.contributions.map((c, i) => (
                    <div key={i} style={{margin: '6px 0', fontSize: '0.98rem'}}>{c}</div>
                  ))}
                </div>
              )}
              <div className="dev-icons-row">
                <a href={`tel:${dev.phone}`} className="dev-icon-link" title="Call">
                  <FaPhone className="dev-icon" />
                </a>
                <a href={`mailto:${dev.email}`} className="dev-icon-link" title="Email">
                  <FaEnvelope className="dev-icon" />
                </a>
                <a href={dev.linkedin} className="dev-icon-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <FaLinkedin className="dev-icon" />
                </a>
                <a href={dev.github} className="dev-icon-link" target="_blank" rel="noopener noreferrer" title="GitHub">
                  <FaGithub className="dev-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
