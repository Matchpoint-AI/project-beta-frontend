import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAndCreatePDF } from './exportUtils';

// Mock dependencies
vi.mock('./getServiceURL');
vi.mock('jszip');
vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => ({
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    addPage: vi.fn(),
    output: vi.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
  })),
}));
vi.mock('docx', () => ({
  Document: vi.fn(),
  Packer: {
    toBuffer: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
  },
  Paragraph: vi.fn(),
}));
vi.mock('emoji-regex', () => ({
  default: vi.fn(() => /😀|🎉|🎊|✨|🌟|🎈/g),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('exportUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getServiceURL as any).mockReturnValue('https://api.test.com');
  });

  describe('fetchAndCreatePDF', () => {
    it('should handle fetch error gracefully', async () => {
      // Arrange
      const id = 'campaign-123';
      const endpointUrl = 'https://api.example.com';
      const token = 'bearer-token';

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Act
      const result = await fetchAndCreatePDF(id, endpointUrl, token);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle non-ok response', async () => {
      // Arrange
      const id = 'campaign-123';
      const endpointUrl = 'https://api.example.com';
      const token = 'bearer-token';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Act
      const result = await fetchAndCreatePDF(id, endpointUrl, token);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should make correct API call', async () => {
      // Arrange
      const id = 'campaign-123';
      const endpointUrl = 'https://api.example.com';
      const token = 'bearer-token';

      mockFetch.mockRejectedValueOnce(new Error('Test error'));

      // Act
      await fetchAndCreatePDF(id, endpointUrl, token);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(`${endpointUrl}/api/v1/getPdfData?campaign_id=${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it('should handle null data response', async () => {
      // Arrange
      const id = 'campaign-123';
      const endpointUrl = 'https://api.example.com';
      const token = 'bearer-token';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null),
      });

      // Act
      const result = await fetchAndCreatePDF(id, endpointUrl, token);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
