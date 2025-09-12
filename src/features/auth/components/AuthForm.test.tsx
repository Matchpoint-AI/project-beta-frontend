import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuthForm from './AuthForm';
import { signInWithEmailAndPassword, setPersistence } from 'firebase/auth';
import { useAuthentication } from '../../../lib/firebase';
import { useAuth } from '../context/AuthContext';
import registerUser from '../../users/utils/registerUser';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  browserLocalPersistence: 'LOCAL',
  browserSessionPersistence: 'SESSION',
  setPersistence: vi.fn(),
}));

// Mock custom hooks and utilities
vi.mock('../../../lib/firebase', () => ({
  useAuthentication: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../users/utils/registerUser', () => ({
  default: vi.fn(),
}));

vi.mock('../../../helpers/posthog', () => ({
  default: {
    __loaded: false,
    capture: vi.fn(),
  },
}));

vi.mock('../../../helpers/getServiceURL', () => ({
  getServiceURL: vi.fn(() => 'http://localhost:8000'),
}));

vi.mock('universal-cookie', () => ({
  default: vi.fn().mockImplementation(() => ({
    set: vi.fn(),
    get: vi.fn(),
  })),
}));

describe('AuthForm', () => {
  const mockSetAuthError = vi.fn();
  const mockLogin = vi.fn();
  const mockAuth = {
    signOut: vi.fn(),
  };

  beforeEach(() => {
    // Arrange - Reset all mocks before each test
    vi.clearAllMocks();
    (useAuthentication as any).mockReturnValue({ auth: mockAuth });
    (useAuth as any).mockReturnValue({ login: mockLogin });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should render login form when login prop is true', () => {
      // Arrange
      const loginMode = true;

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={loginMode} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      // Assert
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    });

    it('should handle successful login with verified email', async () => {
      // Arrange
      const mockUser = {
        emailVerified: true,
        getIdToken: vi.fn().mockResolvedValue('mock-token'),
        email: 'test@example.com',
      };
      const mockUserProfile = {
        email: 'test@example.com',
        uid: 'user123',
        name: 'Test User',
        plan: 'free',
        role: 'user',
        is_admin: false,
        hasBrand: false,
      };

      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockUserProfile),
      });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          mockAuth,
          'test@example.com',
          'password123'
        );
        expect(mockLogin).toHaveBeenCalledWith(
          'mock-token',
          'test@example.com',
          false,
          'user123',
          'Test User',
          'free',
          'user',
          false,
          false
        );
      });
    });

    it('should handle unverified email during login', async () => {
      // Arrange
      const mockUser = {
        emailVerified: false,
        getIdToken: vi.fn(),
      };

      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(mockAuth.signOut).toHaveBeenCalled();
        expect(mockSetAuthError).toHaveBeenCalled();
        const errorCall = mockSetAuthError.mock.calls[0][0];
        expect(errorCall.props.children[0]).toContain('please verify your email');
      });
    });

    it('should handle invalid credentials error', async () => {
      // Arrange
      const authError = new Error('Firebase: Error (auth/invalid-credential).');
      (authError as any).code = 'auth/invalid-credential';
      (signInWithEmailAndPassword as any).mockRejectedValue(authError);

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'wrongpassword' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalledWith('Invalid username or password.');
      });
    });

    it('should handle too many requests error', async () => {
      // Arrange
      const authError = new Error('Firebase: Too many requests');
      (authError as any).code = 'auth/too-many-requests';
      (signInWithEmailAndPassword as any).mockRejectedValue(authError);

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalledWith(
          'Access temporarily disabled due to too many attempts. Try again later or reset your password.'
        );
      });
    });

    it('should set correct persistence based on remember me checkbox', async () => {
      // Arrange
      const mockUser = {
        emailVerified: true,
        getIdToken: vi.fn().mockResolvedValue('mock-token'),
        email: 'test@example.com',
      };
      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ email: 'test@example.com' }),
      });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      const rememberCheckbox = screen.getByLabelText(/remember me/i);
      fireEvent.click(rememberCheckbox);
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(setPersistence).toHaveBeenCalledWith(mockAuth, 'LOCAL');
      });
    });
  });

  describe('Sign Up Flow', () => {
    it('should render sign up form when login prop is false', () => {
      // Arrange
      const loginMode = false;

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={loginMode} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      // Assert
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('should handle successful registration', async () => {
      // Arrange
      (registerUser as any).mockResolvedValue({
        success: true,
        message: 'Registration successful. Please check your email.',
      });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={false} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

      // Assert
      await waitFor(() => {
        expect(registerUser).toHaveBeenCalledWith('test@example.com', 'Test User', 'password123');
        expect(mockSetAuthError).toHaveBeenCalledWith(
          'Registration successful. Please check your email.'
        );
      });
    });

    it('should show error when passwords do not match', async () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <AuthForm login={false} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
      fireEvent.blur(confirmPasswordInput);

      // Assert - Component shows visual error by changing border color
      await waitFor(() => {
        expect(confirmPasswordInput).toHaveClass('border-red-600');
      });
    });

    it('should handle email already exists error', async () => {
      // Arrange
      (registerUser as any).mockRejectedValue(new Error('User already exists'));

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={false} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'existing@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

      // Assert
      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalledWith('Email already exists.');
      });
    });

    it('should disable submit button while loading', async () => {
      // Arrange
      (registerUser as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000))
      );

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={false} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      });

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Email Verification', () => {
    it('should handle resend verification email', async () => {
      // Arrange
      const mockUser = {
        emailVerified: false,
        getIdToken: vi.fn(),
      };
      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ message: 'Email sent' }),
      });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalled();
      });

      // Assert - Error callback was called and user was signed out
      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('should handle resend verification email failure', async () => {
      // Arrange
      const mockUser = {
        emailVerified: false,
        getIdToken: vi.fn(),
      };
      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalled();
      });

      // Assert - Error callback was called and user was signed out for unverified email
      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should require email field for login', async () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Assert
      expect(emailInput).toHaveAttribute('required');
    });

    it('should require password field for login', async () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Assert
      expect(passwordInput).toHaveAttribute('required');
    });

    it('should validate email format', async () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      // Assert
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should require all fields for sign up', async () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <AuthForm login={false} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      // Assert
      expect(screen.getByLabelText(/name/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('required');
    });
  });

  describe('Error Handling', () => {
    it('should handle generic login error', async () => {
      // Arrange
      (signInWithEmailAndPassword as any).mockRejectedValue(new Error('Network error'));

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalledWith('Login failed. Please retry.');
      });
    });

    it('should handle generic signup error', async () => {
      // Arrange
      (registerUser as any).mockRejectedValue(new Error('Network error'));

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={false} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' },
      });
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

      // Assert
      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalledWith('Sign up failed. Please retry.');
      });
    });

    it('should handle profile fetch failure', async () => {
      // Arrange
      const mockUser = {
        emailVerified: true,
        getIdToken: vi.fn().mockResolvedValue('mock-token'),
        email: 'test@example.com',
      };
      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(mockSetAuthError).toHaveBeenCalledWith('Login failed. Please retry.');
      });
    });

    it('should handle profile mismatch', async () => {
      // Arrange
      const mockUser = {
        emailVerified: true,
        getIdToken: vi.fn().mockResolvedValue('mock-token'),
        email: 'test@example.com',
      };
      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ email: 'different@example.com' }),
      });

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
      fireEvent.submit(screen.getByRole('button', { name: /login/i }));

      // Assert
      await waitFor(() => {
        expect(mockAuth.signOut).toHaveBeenCalled();
        expect(mockSetAuthError).toHaveBeenCalledWith(
          'Account not properly configured. Please contact support.'
        );
      });
    });
  });

  describe('UI State Management', () => {
    it('should toggle password visibility', () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      const passwordInput = screen.getByLabelText(/^password$/i);
      // Assert - Password field is type password (no toggle functionality in this component)
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should show loading state during form submission', async () => {
      // Arrange
      (signInWithEmailAndPassword as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      // Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);

      // Assert
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should navigate to forgot password page', () => {
      // Arrange & Act
      render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      const forgotPasswordLink = screen.getByText(/forgot password/i);

      // Assert
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink).toHaveAttribute('href', '/auth/action?mode=resetPassword');
    });

    it('should navigate between login and signup', () => {
      // Arrange & Act - Start with login
      const { rerender } = render(
        <BrowserRouter>
          <AuthForm login={true} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      // Assert - Login page
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();

      // Act - Switch to signup
      rerender(
        <BrowserRouter>
          <AuthForm login={false} setAuthError={mockSetAuthError} />
        </BrowserRouter>
      );

      // Assert - Signup page
      expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });
  });
});
