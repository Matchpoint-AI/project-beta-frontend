import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import HITLReviewPanel from './HITLReviewPanel';
import QualityGatePanel from './QualityGatePanel';
import ContentComparisonModal from './ContentComparisonModal';

// Mock AuthContext
const mockProfile = { uid: 'test-user-123', email: 'test@example.com' };
vi.mock('../../../features/auth/context/AuthContext', () => ({
  useAuth: () => ({ profile: mockProfile }),
}));

// Mock ResizeObserver for Material-UI components
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Material-UI components to avoid conflicts
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Dialog: ({ open, children }: any) =>
      open ? <div data-testid="hitl-dialog">{children}</div> : null,
    DialogContent: ({ children }: any) => <div data-testid="hitl-dialog-content">{children}</div>,
    Card: ({ children }: any) => <div data-testid="hitl-card">{children}</div>,
    Accordion: ({ children }: any) => <div data-testid="hitl-accordion">{children}</div>,
  };
});

describe('HITL Review Components', () => {
  describe('Component Rendering', () => {
    it('HITLReviewPanel renders without crashing', () => {
      const mockItems = [
        {
          id: 'test-1',
          type: 'caption' as const,
          content: 'Test content',
          status: 'pending' as const,
        },
      ];

      const { container } = render(
        <HITLReviewPanel
          items={mockItems}
          onApprove={vi.fn()}
          onReject={vi.fn()}
          onEdit={vi.fn()}
          onRegenerate={vi.fn()}
          onClose={vi.fn()}
          isOpen={true}
        />
      );

      expect(container).toBeTruthy();
    });

    it('QualityGatePanel renders without crashing', () => {
      const { container } = render(
        <QualityGatePanel
          itemId="test-item"
          itemType="caption"
          content="Test content for quality assessment"
        />
      );

      expect(container).toBeTruthy();
    });

    it('ContentComparisonModal renders without crashing', () => {
      const mockVersions = [
        {
          id: 'v1',
          content: 'Test content version 1',
          timestamp: '2023-01-01T00:00:00Z',
          author: 'Test Author',
          type: 'original' as const,
        },
      ];

      const { container } = render(
        <ContentComparisonModal
          isOpen={false}
          onClose={vi.fn()}
          itemId="test-item"
          itemType="caption"
          versions={mockVersions}
          onSave={vi.fn()}
          onRevert={vi.fn()}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('Component Props', () => {
    it('HITLReviewPanel handles empty items array', () => {
      const { container } = render(
        <HITLReviewPanel
          items={[]}
          onApprove={vi.fn()}
          onReject={vi.fn()}
          onEdit={vi.fn()}
          onRegenerate={vi.fn()}
          onClose={vi.fn()}
          isOpen={true}
        />
      );

      expect(container).toBeTruthy();
    });

    it('QualityGatePanel handles different content types', () => {
      const { container } = render(
        <QualityGatePanel itemId="test-item-2" itemType="image" content="A test image prompt" />
      );

      expect(container).toBeTruthy();
    });

    it('ContentComparisonModal handles closed state', () => {
      const { container } = render(
        <ContentComparisonModal
          isOpen={false}
          onClose={vi.fn()}
          itemId="test-item"
          itemType="caption"
          versions={[]}
          onSave={vi.fn()}
          onRevert={vi.fn()}
        />
      );

      expect(container).toBeTruthy();
    });
  });
});
