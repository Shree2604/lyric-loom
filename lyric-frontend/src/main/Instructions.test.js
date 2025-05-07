import React from "react";
import { render, screen } from "@testing-library/react";
import Instructions from "./Instructions";
import '@testing-library/jest-dom';

describe("Instructions component", () => {
  it("renders the instructions heading", () => {
    render(<Instructions />);
    expect(screen.getByText(/Instructions:/i)).toBeInTheDocument();
  });

  it("renders all instruction list items", () => {
    render(<Instructions />);
    const items = [
      "Adjust your browser dimensions for the best viewing experience.",
      "Currently, the website is designed only for desktop experience.",
      "We apologize for the inconvenience of the current lack of responsiveness, which will be addressed in future updates.",
      "Make sure you are logged in to access personalized playlists and favorite songs.",
      "Admins can manage artists and users via the dashboard after logging in.",
      "For artists, ensure your tracks are uploaded in high-quality formats for the best user experience.",
      "Users can explore and search for songs by artists, albums."
    ];
    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders the instructions container", () => {
    render(<Instructions />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
