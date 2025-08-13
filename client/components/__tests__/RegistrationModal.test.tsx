import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationModal from '../RegistrationModal';
import { apiService } from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    submitRegistration: vi.fn(),
  },
}));

const mockCity = {
  _id: '1',
  name: 'Vadodara',
  image: '/uploads/vadodara.jpg',
  studentCount: 150,
  registrationLink: '',
  isActive: true,
};

describe('RegistrationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form when open', () => {
    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Register for Vadodara')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Vadodara')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    
    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const emailInput = screen.getByLabelText(/Email Address/);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    
    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const phoneInput = screen.getByLabelText(/Phone Number/);
    await user.type(phoneInput, '123');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid phone number (10-16 digits)')).toBeInTheDocument();
    });
  });

  it('sanitizes input to prevent XSS', async () => {
    const user = userEvent.setup();
    
    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const nameInput = screen.getByLabelText(/Full Name/);
    await user.type(nameInput, 'John<script>alert("xss")</script>Doe');

    expect(nameInput).toHaveValue('JohnDoe');
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      message: 'Registration successful!',
      registration: { _id: '1', name: 'John Doe', city: 'Vadodara', status: 'pending' },
    };

    (apiService.submitRegistration as any).mockResolvedValueOnce(mockResponse);

    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill form
    await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
    await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone Number/), '+91 9876543210');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiService.submitRegistration).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        city: 'Vadodara',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Registration Successful!')).toBeInTheDocument();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles submission errors with retry option', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Network error');

    (apiService.submitRegistration as any).mockRejectedValueOnce(mockError);

    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill form
    await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
    await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone Number/), '+91 9876543210');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Retry/ })).toBeInTheDocument();
    });
  });

  it('handles duplicate registration error', async () => {
    const user = userEvent.setup();
    const mockError = new Error('You have already registered for this city');

    (apiService.submitRegistration as any).mockRejectedValueOnce(mockError);

    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill form
    await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
    await user.type(screen.getByLabelText(/Email Address/), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone Number/), '+91 9876543210');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('You have already registered for this city')).toBeInTheDocument();
      // Should not show retry button for duplicate registration
      expect(screen.queryByRole('button', { name: /Retry/ })).not.toBeInTheDocument();
    });
  });

  it('closes modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <RegistrationModal
        isOpen={true}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    render(
      <RegistrationModal
        isOpen={false}
        city={mockCity}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByText('Register for Vadodara')).not.toBeInTheDocument();
  });
});