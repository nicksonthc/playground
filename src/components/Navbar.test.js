import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Pathfinding', path: '/pathfinding' },
  { label: 'Game Theory', path: '/game-theory' },
  { label: 'Project Calculator', path: '/project-calculator' },
  { label: 'Income Tax', path: '/income-tax' },
  { label: 'AlgoCraft', path: '/algo-ds' },
];

const renderNavbar = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('renders the site title and all navigation links with correct destinations', () => {
    renderNavbar();

    expect(screen.getByRole('heading', { name: /nickspace/i })).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(navLinks.length);

    navLinks.forEach(({ label, path }) => {
      const link = screen.getByRole('link', { name: label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining(path));
      expect(link).toHaveClass('nav-link');
    });
  });

  it('marks the Home link as active when on the root path', () => {
    renderNavbar('/');

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveClass('active');

    navLinks
      .filter(({ label }) => label !== 'Home')
      .forEach(({ label }) => {
        expect(screen.getByRole('link', { name: label })).not.toHaveClass('active');
      });
  });

  it('marks only the matching link as active for secondary routes', () => {
    renderNavbar('/pathfinding');

    const pathfindingLink = screen.getByRole('link', { name: 'Pathfinding' });
    expect(pathfindingLink).toHaveClass('active');

    navLinks
      .filter(({ label }) => label !== 'Pathfinding')
      .forEach(({ label }) => {
        expect(screen.getByRole('link', { name: label })).not.toHaveClass('active');
      });
  });

  it('does not mark any link as active for unmatched paths', () => {
    renderNavbar('/non-existent');

    navLinks.forEach(({ label }) => {
      expect(screen.getByRole('link', { name: label })).not.toHaveClass('active');
    });
  });

  it('requires exact path matches before applying the active class', () => {
    renderNavbar('/pathfinding/');

    const pathfindingLink = screen.getByRole('link', { name: 'Pathfinding' });
    expect(pathfindingLink).not.toHaveClass('active');
  });
});