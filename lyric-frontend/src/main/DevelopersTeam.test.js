import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DevelopersTeam from "./DevelopersTeam";
import '@testing-library/jest-dom';

describe("DevelopersTeam component", () => {
  it("renders the heading", () => {
    render(<DevelopersTeam />);
    expect(screen.getByText(/Our Developers Team/i)).toBeInTheDocument();
  });

  it("renders all developer names", () => {
    render(<DevelopersTeam />);
    expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getByText("Priya Singh")).toBeInTheDocument();
    expect(screen.getByText("Michael Lee")).toBeInTheDocument();
    expect(screen.getByText("Sara Kim")).toBeInTheDocument();
  });

  it("renders contact icons for each developer", () => {
    render(<DevelopersTeam />);
    // There are 4 developers, each with 4 icons
    expect(screen.getAllByTitle("Call").length).toBe(4);
    expect(screen.getAllByTitle("Email").length).toBe(4);
    expect(screen.getAllByTitle("LinkedIn").length).toBe(4);
    expect(screen.getAllByTitle("GitHub").length).toBe(4);
  });

  it("shows and hides contributions on button click", () => {
    render(<DevelopersTeam />);
    const buttons = screen.getAllByText("Contributions");
    // Click the first developer's contribution button
    fireEvent.click(buttons[0]);
    expect(screen.getByText("Implemented the audio player feature.")).toBeInTheDocument();
    // Click again to hide
    fireEvent.click(buttons[0]);
    expect(screen.queryByText("Implemented the audio player feature.")).not.toBeInTheDocument();
  });

  it("renders developer photos with correct alt text", () => {
    render(<DevelopersTeam />);
    expect(screen.getByAltText("Alex Johnson")).toBeInTheDocument();
    expect(screen.getByAltText("Priya Singh")).toBeInTheDocument();
    expect(screen.getByAltText("Michael Lee")).toBeInTheDocument();
    expect(screen.getByAltText("Sara Kim")).toBeInTheDocument();
  });
});
