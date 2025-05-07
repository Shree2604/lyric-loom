import React, { useState } from "react";
import "./About.css"; // Import CSS file

export default function About() {
  const [expandedRow, setExpandedRow] = useState(null);

  const data = [
    {
      id: 1,
      question: "What is Lyric_Loom?",
      answer: "Lyric_Loom is a platform for music streaming.",
    },
    {
      id: 2,
      question: "What is the tech stack used for developing Lyric_Loom?",
      answer: "It is a MERN STACK project.",
    },
    {
      id: 3,
      question: "What features are there for Users?",
      answer:
        "Users can search for new songs, play songs, create, update, and delete playlists. They have the facility to listen to trending songs.",
    },
    {
      id: 4,
      question: "What features are available for Admins?",
      answer:
        "Admins can manage users, artists. They can also monitor content and delete user-created playlists.",
    },
    {
      id: 5,
      question: "How can I create a playlist?",
      answer:
        "You can create a playlist by logging into your account, navigating to the 'Playlists' section, and selecting 'Create Playlist'.",
    },
    {
      id: 6,
      question: "Can I upload my own music?",
      answer:
        "At this time, music upload functionality is limited to registered artists.",
    },
    {
      id: 7,
      question: "Is Lyric_Loom free to use?",
      answer:
        "Yes, Lyric_Loom offers a free version with access to most features. However, there may be premium features in the future.",
    },
    {
      id: 8,
      question: "What types of music are available on Lyric_Loom?",
      answer:
        "Lyric_Loom offers a wide range of music.",
    },
    {
      id: 9,
      question: "Thank you for exploring Lyric_Loom!",
      answer:
        "We are constantly striving to enhance your experience and bring you the best in music streaming.",
    },
  ];

  const handleRowClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  return (
    <div className="screen-container">
      <h1 align="center">FAQs about Lyric_Loom</h1>
      <br></br>
      <br></br>
      <div className="about-container">
        <table className="about-table">
          <tbody>
            {data.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  onClick={() => handleRowClick(row.id)}
                  className={expandedRow === row.id ? "expanded" : ""}
                >
                  <td>{row.id}</td>
                  <td>{row.question}</td>
                </tr>
                {expandedRow === row.id && (
                  <tr>
                    <td colSpan="2">{row.answer}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
