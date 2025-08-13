import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CityCard from '../CityCard';

const mockCity = {
  _id: '1',
  name: 'Vadodara',
  image: '/uploads/vadodara.jpg',
  studentCount: 150,
  registrationLink: '',
  isActive: true,
};

describe('CityCard', () => {
  const mockOnRegisterClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders city information correctly', () => {
    render(<CityCard city={mockCity} onRegisterClick={mockOnRegisterClick} />);

    expect(screen.getByText('Vadodara')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Students Joined')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Registration Open')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register now/i })).toBeInTheDocument();
  });

  it('displays city image with correct alt text', () => {
    render(<CityCard city={mockCity} onRegisterClick={mockOnRegisterClick} />);

    const image = screen.getByAltText('Vadodara');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/uploads/vadodara.jpg');
  });

  it('calls onRegisterClick when register button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<CityCard city={mockCity} onRegisterClick={mockOnRegisterClick} />);

    const registerButton = screen.getByRole('button', { name: /register now/i });
    await user.click(registerButton);

    expect(mockOnRegisterClick).toHaveBeenCalledWith(mockCity);
  });

  it('handles image load error gracefully', () => {
    render(<CityCard city={mockCity} onRegisterClick={mockOnRegisterClick} />);

    const image = screen.getByAltText('Vadodara');
    
    // Simulate image load error
    fireEvent.error(image);

    // Image should have fallback src
    expect(image).toHaveAttribute('src', '/api/placeholder/400/300');
  });

  it('applies hover effects with correct CSS classes', () => {
    render(<CityCard city={mockCity} onRegisterClick={mockOnRegisterClick} />);

    const card = screen.getByText('Vadodara').closest('.group');
    expect(card).toHaveClass('hover:shadow-xl', 'transition-all', 'duration-300');

    const image = screen.getByAltText('Vadodara');
    expect(image).toHaveClass('group-hover:scale-105', 'transition-transform', 'duration-300');
  });

  it('renders with different student counts', () => {
    const cityWithZeroStudents = { ...mockCity, studentCount: 0 };
    
    render(<CityCard city={cityWithZeroStudents} onRegisterClick={mockOnRegisterClick} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Students Joined')).toBeInTheDocument();
  });

  it('renders with large student counts', () => {
    const cityWithManyStudents = { ...mockCity, studentCount: 1500 };
    
    render(<CityCard city={cityWithManyStudents} onRegisterClick={mockOnRegisterClick} />);

    expect(screen.getByText('1500')).toBeInTheDocument();
  });
});