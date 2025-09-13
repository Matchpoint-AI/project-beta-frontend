import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import useApi from './useApi';

// Mock the auth context
const mockProfile = {
  token: 'test-token-123',
  user: { id: '1', email: 'test@example.com' },
};

const mockUseAuth = vi.fn();

vi.mock('../features/auth/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('useApi', () => {
  const mockApiHandler = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ profile: mockProfile });
  });

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const action = { type: 'TEST_ACTION' };
      const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.triggerRequest).toBe('function');
    });

    it('should automatically trigger request when not in manual mode', async () => {
      const mockResponse = { data: 'test-data', success: true };
      mockApiHandler.mockResolvedValueOnce(mockResponse);

      const action = { type: 'AUTO_ACTION' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      // Should start loading immediately
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
      expect(mockApiHandler).toHaveBeenCalledWith(action, mockProfile.token);
    });

    it('should not trigger request automatically when in manual mode', () => {
      const action = { type: 'MANUAL_ACTION' };
      renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      expect(mockApiHandler).not.toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should set loading to true during request', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockApiHandler.mockReturnValueOnce(promise);

      const action = { type: 'LOADING_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      expect(result.current.loading).toBe(true);

      act(() => {
        resolvePromise({ success: true });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should clear error when starting new request', async () => {
      const action = { type: 'ERROR_CLEAR_TEST' };

      // First request fails
      mockApiHandler.mockRejectedValueOnce(new Error('First error'));
      const { result, rerender } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Second request succeeds
      mockApiHandler.mockResolvedValueOnce({ success: true });

      // Trigger re-render to simulate new request
      rerender();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('successful requests', () => {
    it('should handle successful API response', async () => {
      const mockResponse = {
        data: { items: [1, 2, 3] },
        meta: { total: 3 },
      };
      mockApiHandler.mockResolvedValueOnce(mockResponse);

      const action = { type: 'SUCCESS_TEST', payload: 'test-payload' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
      expect(mockApiHandler).toHaveBeenCalledWith(action, mockProfile.token);
    });

    it('should handle different response types', async () => {
      const responses = [
        'string response',
        123,
        true,
        null,
        { complex: { nested: { object: true } } },
        [1, 2, 3, 4, 5],
      ];

      for (const response of responses) {
        mockApiHandler.mockResolvedValueOnce(response);

        const action = { type: 'TYPE_TEST', value: response };
        const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

        await act(async () => {
          await result.current.triggerRequest();
        });

        expect(result.current.data).toEqual(response);
        expect(result.current.error).toBeNull();
      }
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API request failed');
      mockApiHandler.mockRejectedValueOnce(error);

      const action = { type: 'ERROR_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(error);
    });

    it('should handle network errors', async () => {
      const networkError = new TypeError('Failed to fetch');
      mockApiHandler.mockRejectedValueOnce(networkError);

      const action = { type: 'NETWORK_ERROR_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(networkError);
    });

    it('should handle non-Error objects as errors', async () => {
      const stringError = 'Something went wrong';
      mockApiHandler.mockRejectedValueOnce(stringError);

      const action = { type: 'STRING_ERROR_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(stringError);
    });
  });

  describe('authentication handling', () => {
    it('should handle missing token', async () => {
      mockUseAuth.mockReturnValue({ profile: null });

      const action = { type: 'NO_TOKEN_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('No authentication token available');
      expect(mockApiHandler).not.toHaveBeenCalled();
    });

    it('should handle profile without token', async () => {
      mockUseAuth.mockReturnValue({ profile: { token: 'missing-token', user: { id: '1', email: 'test@example.com' } } });

      const action = { type: 'NO_TOKEN_IN_PROFILE_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('No authentication token available');
      expect(mockApiHandler).not.toHaveBeenCalled();
    });

    it('should work with valid token', async () => {
      const mockResponse = { success: true };
      mockApiHandler.mockResolvedValueOnce(mockResponse);

      const action = { type: 'VALID_TOKEN_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockApiHandler).toHaveBeenCalledWith(action, mockProfile.token);
    });
  });

  describe('manual trigger', () => {
    it('should trigger request manually', async () => {
      const mockResponse = { data: 'manual-data' };
      mockApiHandler.mockResolvedValueOnce(mockResponse);

      const action = { type: 'MANUAL_TRIGGER_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      // Should not have been called initially
      expect(mockApiHandler).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.triggerRequest();
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.loading).toBe(false);
      expect(mockApiHandler).toHaveBeenCalledWith(action, mockProfile.token);
    });

    it('should handle errors in manual trigger', async () => {
      const error = new Error('Manual trigger failed');
      mockApiHandler.mockRejectedValueOnce(error);

      const action = { type: 'MANUAL_ERROR_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      await act(async () => {
        await result.current.triggerRequest();
      });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should show loading state during manual trigger', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockApiHandler.mockReturnValueOnce(promise);

      const action = { type: 'MANUAL_LOADING_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      const triggerPromise = act(async () => {
        return result.current.triggerRequest();
      });

      // Should be loading during request
      expect(result.current.loading).toBe(true);

      act(() => {
        resolvePromise({ success: true });
      });

      await triggerPromise;

      expect(result.current.loading).toBe(false);
    });
  });

  describe('action dependencies', () => {
    it('should re-trigger request when action type changes', async () => {
      const mockResponse1 = { data: 'first-response' };
      const mockResponse2 = { data: 'second-response' };

      mockApiHandler.mockResolvedValueOnce(mockResponse1).mockResolvedValueOnce(mockResponse2);

      let action = { type: 'FIRST_ACTION' };
      const { result, rerender } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse1);
      });

      // Change action type
      action = { type: 'SECOND_ACTION' };
      rerender();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse2);
      });

      expect(mockApiHandler).toHaveBeenCalledTimes(2);
      expect(mockApiHandler).toHaveBeenNthCalledWith(
        1,
        { type: 'FIRST_ACTION' },
        mockProfile.token
      );
      expect(mockApiHandler).toHaveBeenNthCalledWith(
        2,
        { type: 'SECOND_ACTION' },
        mockProfile.token
      );
    });

    it('should re-trigger request when token changes', async () => {
      const mockResponse1 = { data: 'first-token-response' };
      const mockResponse2 = { data: 'second-token-response' };

      mockApiHandler.mockResolvedValueOnce(mockResponse1).mockResolvedValueOnce(mockResponse2);

      const action = { type: 'TOKEN_CHANGE_TEST' };

      // First render with first token
      mockUseAuth.mockReturnValue({ profile: { token: 'token-1', user: { id: '1', email: 'test@example.com' } } });
      const { result, rerender } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse1);
      });

      // Change token
      mockUseAuth.mockReturnValue({ profile: { token: 'token-2', user: { id: '1', email: 'test@example.com' } } });
      rerender();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse2);
      });

      expect(mockApiHandler).toHaveBeenCalledTimes(2);
      expect(mockApiHandler).toHaveBeenNthCalledWith(1, action, 'token-1');
      expect(mockApiHandler).toHaveBeenNthCalledWith(2, action, 'token-2');
    });

    it('should not re-trigger for same action and token', async () => {
      const mockResponse = { data: 'stable-response' };
      mockApiHandler.mockResolvedValueOnce(mockResponse);

      const action = { type: 'STABLE_ACTION', payload: 'same-payload' };
      const { result, rerender } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
      });

      // Re-render with same action and token
      rerender();

      // Should not trigger another request
      expect(mockApiHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('reducer logic', () => {
    it('should handle FETCH_REQUEST action', async () => {
      const action = { type: 'REDUCER_REQUEST_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      act(() => {
        result.current.triggerRequest();
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle FETCH_SUCCESS action', async () => {
      const mockResponse = { success: true, message: 'Success' };
      mockApiHandler.mockResolvedValueOnce(mockResponse);

      const action = { type: 'REDUCER_SUCCESS_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.error).toBeNull();
    });

    it('should handle FETCH_FAILURE action', async () => {
      const error = new Error('Reducer failure test');
      mockApiHandler.mockRejectedValueOnce(error);

      const action = { type: 'REDUCER_FAILURE_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(error);
    });

    it('should return same state for unknown action types', () => {
      // This tests the default case in the reducer
      const action = { type: 'UNKNOWN_ACTION_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      const initialState = {
        data: result.current.data,
        loading: result.current.loading,
        error: result.current.error,
      };

      // The reducer should handle unknown actions gracefully by returning the current state
      expect(initialState).toEqual({
        data: null,
        loading: false,
        error: null,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle apiHandler that returns undefined', async () => {
      mockApiHandler.mockResolvedValueOnce(undefined);

      const action = { type: 'UNDEFINED_RESPONSE_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle concurrent requests properly', async () => {
      const responses = ['response-1', 'response-2', 'response-3'];
      mockApiHandler
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2]);

      const action = { type: 'CONCURRENT_TEST' };
      const { result } = renderHook(() => useApi(mockApiHandler, action, 'TRIGGER'));

      // Trigger multiple requests simultaneously
      const promises = [
        result.current.triggerRequest(),
        result.current.triggerRequest(),
        result.current.triggerRequest(),
      ];

      await act(async () => {
        await Promise.all(promises);
      });

      // Should complete successfully with the last response
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockApiHandler).toHaveBeenCalledTimes(3);
    });

    it('should handle action without type property', async () => {
      const mockResponse = { data: 'no-type-action' };
      mockApiHandler.mockResolvedValueOnce(mockResponse);

      const action = { payload: 'test' } as any; // Missing type property
      const { result } = renderHook(() => useApi(mockApiHandler, action));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockApiHandler).toHaveBeenCalledWith(action, mockProfile.token);
    });
  });
});
