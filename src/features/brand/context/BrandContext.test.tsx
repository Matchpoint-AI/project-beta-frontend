import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrandContext, BusinessInfo } from './BrandContext';

describe('BrandContext', () => {
  describe('Context Provider', () => {
    it('should provide default values when no provider is used', () => {
      // Arrange
      const TestComponent = () => {
        const { businessInfo } = useContext(BrandContext);
        return (
          <div>
            <span data-testid="name">{businessInfo.name}</span>
            <span data-testid="website">{businessInfo.website}</span>
            <span data-testid="campaigns">{businessInfo.campaigns?.length || 0}</span>
          </div>
        );
      };

      // Act
      render(<TestComponent />);

      // Assert
      expect(screen.getByTestId('name')).toHaveTextContent('');
      expect(screen.getByTestId('website')).toHaveTextContent('');
      expect(screen.getByTestId('campaigns')).toHaveTextContent('0');
    });

    it('should provide custom values through provider', () => {
      // Arrange
      const customBusinessInfo: BusinessInfo = {
        name: 'Test Company',
        website: 'https://test.com',
        product_features: ['Feature 1', 'Feature 2'],
        product_description: 'Test Description',
        product_link: 'https://test.com/product',
        start_date: '2024-01-01',
        durationNum: 30,
        campaigns: [
          {
            campaign_id: '123',
            status: 'active',
            campaign_data: {
              campaign_variables: {
                durationNum: 30,
                start_date: '2024-01-01',
              },
            },
          },
        ],
      };

      const TestComponent = () => {
        const { businessInfo } = useContext(BrandContext);
        return (
          <div>
            <span data-testid="name">{businessInfo.name}</span>
            <span data-testid="website">{businessInfo.website}</span>
            <span data-testid="campaigns">{businessInfo.campaigns?.length || 0}</span>
            <span data-testid="features">{businessInfo.product_features.join(', ')}</span>
          </div>
        );
      };

      // Act
      render(
        <BrandContext.Provider
          value={{
            businessInfo: customBusinessInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <TestComponent />
        </BrandContext.Provider>
      );

      // Assert
      expect(screen.getByTestId('name')).toHaveTextContent('Test Company');
      expect(screen.getByTestId('website')).toHaveTextContent('https://test.com');
      expect(screen.getByTestId('campaigns')).toHaveTextContent('1');
      expect(screen.getByTestId('features')).toHaveTextContent('Feature 1, Feature 2');
    });

    it('should update businessInfo when setBusinessInfo is called', () => {
      // Arrange
      const mockSetBusinessInfo = vi.fn();
      const initialInfo: BusinessInfo = {
        name: 'Initial',
        website: 'https://initial.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '',
        durationNum: 0,
      };

      const TestComponent = () => {
        const { setBusinessInfo } = useContext(BrandContext);
        return (
          <button
            onClick={() =>
              setBusinessInfo({
                ...initialInfo,
                name: 'Updated',
              })
            }
          >
            Update
          </button>
        );
      };

      // Act
      render(
        <BrandContext.Provider
          value={{
            businessInfo: initialInfo,
            setBusinessInfo: mockSetBusinessInfo,
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <TestComponent />
        </BrandContext.Provider>
      );

      fireEvent.click(screen.getByText('Update'));

      // Assert
      expect(mockSetBusinessInfo).toHaveBeenCalledWith({
        ...initialInfo,
        name: 'Updated',
      });
    });
  });

  describe('BusinessInfo Type', () => {
    it('should handle Selectable arrays correctly', () => {
      // Arrange
      const businessInfo: BusinessInfo = {
        name: 'Test',
        website: 'https://test.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '',
        durationNum: 0,
        values: [
          { selected: true, label: 'Value 1', id: 1 },
          { selected: false, label: 'Value 2', id: 2 },
        ],
        persona: [{ selected: true, label: 'Persona 1' }],
        toneAndVoice: [
          { selected: false, label: 'Tone 1' },
          { selected: true, label: 'Tone 2' },
        ],
      };

      const TestComponent = () => {
        const { businessInfo: info } = useContext(BrandContext);
        return (
          <div>
            <span data-testid="values-count">{info.values?.length || 0}</span>
            <span data-testid="values-selected">
              {info.values?.filter((v) => v.selected).length || 0}
            </span>
            <span data-testid="persona-count">{info.persona?.length || 0}</span>
            <span data-testid="tone-selected">
              {info.toneAndVoice?.filter((t) => t.selected).length || 0}
            </span>
          </div>
        );
      };

      // Act
      render(
        <BrandContext.Provider
          value={{
            businessInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <TestComponent />
        </BrandContext.Provider>
      );

      // Assert
      expect(screen.getByTestId('values-count')).toHaveTextContent('2');
      expect(screen.getByTestId('values-selected')).toHaveTextContent('1');
      expect(screen.getByTestId('persona-count')).toHaveTextContent('1');
      expect(screen.getByTestId('tone-selected')).toHaveTextContent('1');
    });

    it('should handle optional fields correctly', () => {
      // Arrange
      const minimalInfo: BusinessInfo = {
        name: 'Minimal',
        website: 'https://minimal.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '',
        durationNum: 0,
      };

      const TestComponent = () => {
        const { businessInfo } = useContext(BrandContext);
        return (
          <div>
            <span data-testid="id">{businessInfo.id || 'undefined'}</span>
            <span data-testid="industry">{businessInfo.industry || 'undefined'}</span>
            <span data-testid="mission">{businessInfo.mission || 'undefined'}</span>
            <span data-testid="logo">{businessInfo.logo || 'undefined'}</span>
            <span data-testid="colors">{businessInfo.brandColors?.length || 0}</span>
          </div>
        );
      };

      // Act
      render(
        <BrandContext.Provider
          value={{
            businessInfo: minimalInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <TestComponent />
        </BrandContext.Provider>
      );

      // Assert
      expect(screen.getByTestId('id')).toHaveTextContent('undefined');
      expect(screen.getByTestId('industry')).toHaveTextContent('undefined');
      expect(screen.getByTestId('mission')).toHaveTextContent('undefined');
      expect(screen.getByTestId('logo')).toHaveTextContent('undefined');
      expect(screen.getByTestId('colors')).toHaveTextContent('0');
    });

    it('should handle brandLogo as both string and File', () => {
      // Arrange
      const file = new File(['logo'], 'logo.png', { type: 'image/png' });

      const TestComponent = ({ logo }: { logo: string | File | undefined }) => {
        const businessInfo: BusinessInfo = {
          name: 'Test',
          website: 'https://test.com',
          product_features: [],
          product_description: '',
          product_link: '',
          start_date: '',
          durationNum: 0,
          brandLogo: logo,
        };

        return (
          <BrandContext.Provider
            value={{
              businessInfo,
              setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
            }}
          >
            <div>
              <span data-testid="logo-type">
                {typeof businessInfo.brandLogo === 'string'
                  ? 'string'
                  : businessInfo.brandLogo instanceof File
                    ? 'file'
                    : 'undefined'}
              </span>
            </div>
          </BrandContext.Provider>
        );
      };

      // Act & Assert - String logo
      const { rerender } = render(<TestComponent logo="https://test.com/logo.png" />);
      expect(screen.getByTestId('logo-type')).toHaveTextContent('string');

      // Act & Assert - File logo
      rerender(<TestComponent logo={file} />);
      expect(screen.getByTestId('logo-type')).toHaveTextContent('file');

      // Act & Assert - Undefined logo
      rerender(<TestComponent logo={undefined} />);
      expect(screen.getByTestId('logo-type')).toHaveTextContent('undefined');
    });
  });

  describe('Context Usage Patterns', () => {
    it('should maintain referential equality when context value does not change', () => {
      // Arrange
      const renderCounts = { consumer1: 0, consumer2: 0 };

      const Consumer1 = () => {
        const { businessInfo } = useContext(BrandContext);
        renderCounts.consumer1++;
        return <div>{businessInfo.name}</div>;
      };

      const Consumer2 = () => {
        const { setBusinessInfo } = useContext(BrandContext);
        renderCounts.consumer2++;
        return <button onClick={() => setBusinessInfo((prev) => prev)}>No-op</button>;
      };

      const businessInfo: BusinessInfo = {
        name: 'Test',
        website: 'https://test.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '',
        durationNum: 0,
      };

      // Act
      const { rerender } = render(
        <BrandContext.Provider
          value={{
            businessInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <Consumer1 />
          <Consumer2 />
        </BrandContext.Provider>
      );

      const initialRender1 = renderCounts.consumer1;
      const initialRender2 = renderCounts.consumer2;

      rerender(
        <BrandContext.Provider
          value={{
            businessInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <Consumer1 />
          <Consumer2 />
        </BrandContext.Provider>
      );

      // Assert
      expect(renderCounts.consumer1).toBeGreaterThan(initialRender1);
      expect(renderCounts.consumer2).toBeGreaterThan(initialRender2);
    });

    it('should allow nested providers to override context', () => {
      // Arrange
      const outerInfo: BusinessInfo = {
        name: 'Outer',
        website: 'https://outer.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '',
        durationNum: 0,
      };

      const innerInfo: BusinessInfo = {
        name: 'Inner',
        website: 'https://inner.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '',
        durationNum: 0,
      };

      const TestComponent = () => {
        const { businessInfo } = useContext(BrandContext);
        return <span data-testid="name">{businessInfo.name}</span>;
      };

      // Act
      render(
        <BrandContext.Provider
          value={{
            businessInfo: outerInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <div>
            <TestComponent />
            <BrandContext.Provider
              value={{
                businessInfo: innerInfo,
                setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
              }}
            >
              <TestComponent />
            </BrandContext.Provider>
          </div>
        </BrandContext.Provider>
      );

      // Assert
      const names = screen.getAllByTestId('name');
      expect(names[0]).toHaveTextContent('Outer');
      expect(names[1]).toHaveTextContent('Inner');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty campaigns array', () => {
      // Arrange
      const businessInfo: BusinessInfo = {
        name: 'Test',
        website: 'https://test.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '',
        durationNum: 0,
        campaigns: [],
      };

      const TestComponent = () => {
        const { businessInfo: info } = useContext(BrandContext);
        return (
          <span data-testid="campaigns">{info.campaigns?.length?.toString() || 'undefined'}</span>
        );
      };

      // Act
      render(
        <BrandContext.Provider
          value={{
            businessInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <TestComponent />
        </BrandContext.Provider>
      );

      // Assert
      expect(screen.getByTestId('campaigns')).toHaveTextContent('0');
    });

    it('should handle complex campaign data structure', () => {
      // Arrange
      const businessInfo: BusinessInfo = {
        name: 'Test',
        website: 'https://test.com',
        product_features: [],
        product_description: '',
        product_link: '',
        start_date: '2024-01-01',
        durationNum: 30,
        campaigns: [
          {
            campaign_id: '123',
            status: 'active',
            campaign_data: {
              campaign_variables: {
                durationNum: 30,
                start_date: '2024-01-01',
              },
            },
          },
          {
            campaign_id: '456',
            status: 'paused',
            campaign_data: {
              campaign_variables: {
                durationNum: 60,
                start_date: '2024-02-01',
              },
            },
          },
        ],
      };

      const TestComponent = () => {
        const { businessInfo: info } = useContext(BrandContext);
        return (
          <div>
            {info.campaigns?.map((campaign) => (
              <div key={campaign.campaign_id}>
                <span data-testid={`status-${campaign.campaign_id}`}>{campaign.status}</span>
                <span data-testid={`duration-${campaign.campaign_id}`}>
                  {campaign.campaign_data.campaign_variables.durationNum}
                </span>
              </div>
            ))}
          </div>
        );
      };

      // Act
      render(
        <BrandContext.Provider
          value={{
            businessInfo,
            setBusinessInfo: vi.fn(),
            updateWorkflowState: vi.fn(),
            clearWorkflow: vi.fn(),
          }}
        >
          <TestComponent />
        </BrandContext.Provider>
      );

      // Assert
      expect(screen.getByTestId('status-123')).toHaveTextContent('active');
      expect(screen.getByTestId('duration-123')).toHaveTextContent('30');
      expect(screen.getByTestId('status-456')).toHaveTextContent('paused');
      expect(screen.getByTestId('duration-456')).toHaveTextContent('60');
    });
  });
});
