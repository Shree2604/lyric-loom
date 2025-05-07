import React from 'react';
import { render, screen } from '@testing-library/react';
import SideBarMain from './SideBarMain';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('SideBarMain', () => {
  it('renders the logo image', () => {
    render(
  <MemoryRouter>
    <SideBarMain />
  </MemoryRouter>
);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders all sidebar buttons with correct titles', () => {
    render(
  <MemoryRouter>
    <SideBarMain />
  </MemoryRouter>
);
    const buttonTitles = [
      'Home',
      'Instructions',
      'Sign Up',
      'User Login',
      "FAQ's",
      'Artist Login',
      'Admin Login',
      'Developers',
    ];
    buttonTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders the sidebar container', () => {
    render(
      <MemoryRouter>
        <SideBarMain />
      </MemoryRouter>
    );
    // Prefer getByRole for navigation/aside, fallback to getByTestId if needed
    let container;
    try {
      container = screen.getByRole('navigation');
    } catch {
      container = screen.getByTestId('sidebar-container');
    }
    expect(container).toBeInTheDocument();
  });
});
