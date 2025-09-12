import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CampaignBriefForm from './CampaignBriefForm';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { CampaignContext } from '../../context/CampaignContext';
// Mock the useAuth hook
vi.mock('../../features/auth/context/AuthContext', function () { return ({
    useAuth: function () { return ({
        profile: { id: 'test-user-id' },
    }); },
}); });
// Mock the useNavigate hook
vi.mock('react-router-dom', function () { return ({
    useNavigate: function () { return vi.fn(); },
}); });
vi.mock('../shared/FormsContainer', function () { return ({
    default: function (_a) {
        var children = _a.children, className = _a.className;
        return (_jsx("div", { className: className, "data-testid": "forms-container", children: children }));
    },
}); });
vi.mock('../../shared/components/buttons/BackButton', function () { return ({
    default: function (_a) {
        var onClick = _a.onClick;
        return (_jsx("button", { onClick: onClick, "data-testid": "back-button", children: "Back" }));
    },
}); });
vi.mock('../../shared/components/buttons/ApproveButton', function () { return ({
    default: function (_a) {
        var onClick = _a.onClick;
        return (_jsx("button", { onClick: onClick, "data-testid": "approve-button", children: "Approve" }));
    },
}); });
vi.mock('../campaign/CampaignSetupCompleteDialog', function () { return ({
    default: function (_a) {
        var open = _a.open, onClose = _a.onClose, _setCurrentStep = _a.setCurrentStep;
        return open ? (_jsx("div", { "data-testid": "campaign-setup-complete-dialog", onClick: onClose, children: "Campaign Setup Complete" })) : null;
    },
}); });
vi.mock('../campaign/CustomDialog', function () { return ({
    default: function (_a) {
        var isOpen = _a.isOpen, onClose = _a.onClose;
        return isOpen ? (_jsx("div", { "data-testid": "custom-dialog", onClick: onClose, children: "Custom Dialog" })) : null;
    },
}); });
vi.mock('../CampaignBriefTimingBlock', function () { return ({
    default: function (_a) {
        var title = _a.title, children = _a.children;
        return (_jsxs("div", { "data-testid": "timing-block", children: [_jsx("h3", { children: title }), children] }));
    },
}); });
vi.mock('../campaign/CampaignDetailsBlock', function () { return ({
    default: function (_a) {
        var title = _a.title, text = _a.text;
        return (_jsxs("div", { "data-testid": "campaign-details-block", children: [_jsx("h4", { children: title }), _jsx("p", { children: text })] }));
    },
}); });
vi.mock('../campaign/CampaignDetails', function () { return ({
    default: function () { return _jsx("div", { "data-testid": "campaign-details" }); },
}); });
vi.mock('../CampaignSchedule', function () { return ({
    default: function () { return _jsx("div", { "data-testid": "campaign-schedule" }); },
}); });
// Mock dayjs
vi.mock('dayjs', function () { return ({
    default: function (_date) { return ({
        format: function (_format) { return '01/01/24'; },
        add: function () { return ({
            format: function (_format) { return '01/15/24'; },
        }); },
    }); },
}); });
// Mock the getServiceURL helper
vi.mock('../../helpers/getServiceURL', function () { return ({
    getServiceURL: function (service) { return "https://mock-".concat(service, "-service.com"); },
}); });
// Mock the analytics helper
vi.mock('../../helpers/analytics', function () { return ({
    trackCampaignBriefCreation: vi.fn(),
}); });
// Mock the handleNavigate helper
vi.mock('../../helpers/handleNavigate', function () { return ({
    default: vi.fn(),
}); });
describe('CampaignBriefForm', function () {
    var mockSetCurrentStep = vi.fn();
    var mockHandleBack = vi.fn();
    var mockHandleApprove = vi.fn();
    var mockSetTiming = vi.fn();
    var mockSetService = vi.fn();
    var mockBusinessInfo = {
        name: 'Test Business',
        website: 'https://test.com',
        product_features: ['Feature 1', 'Feature 2'],
        product_description: 'Test product description',
        product_link: 'https://test.com/product',
        start_date: '2024-01-01',
        durationNum: 4,
        logo: 'test-logo.png',
    };
    var mockCampaignInfo = {
        name: 'Test Campaign',
        created_at: '2024-01-01T00:00:00Z',
        duration: '4 weeks',
        durationNum: 4,
        startDate: '2024-01-01',
        product: 'Test Product',
        campaign_brief: false,
        campaign_type: 'awareness',
    };
    var renderWithProviders = function (component) {
        return render(_jsx(BrandContext.Provider, { value: { businessInfo: mockBusinessInfo, setBusinessInfo: vi.fn() }, children: _jsx(CampaignContext.Provider, { value: {
                    campaignInfo: mockCampaignInfo,
                    setCampaignInfo: vi.fn(),
                    campaignId: 'test-campaign-id',
                    setCampaignId: vi.fn(),
                }, children: component }) }));
    };
    beforeEach(function () {
        vi.clearAllMocks();
        // Mock fetch for the generateSummary call
        global.fetch = vi.fn().mockResolvedValue({
            json: function () {
                return Promise.resolve({
                    response: {
                        choices: [
                            {
                                message: {
                                    content: 'Test campaign summary',
                                },
                            },
                        ],
                    },
                });
            },
        });
    });
    it('renders campaign brief form correctly', function () {
        renderWithProviders(_jsx(CampaignBriefForm, { setCurrentStep: mockSetCurrentStep, handleBack: mockHandleBack, handleApprove: mockHandleApprove, setTiming: mockSetTiming, setService: mockSetService }));
        expect(screen.getByTestId('forms-container')).toBeInTheDocument();
        expect(screen.getByText('Test Business')).toBeInTheDocument();
        expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    });
    it('calls parent handleApprove when approve button is clicked', function () {
        renderWithProviders(_jsx(CampaignBriefForm, { setCurrentStep: mockSetCurrentStep, handleBack: mockHandleBack, handleApprove: mockHandleApprove, setTiming: mockSetTiming, setService: mockSetService }));
        var approveButton = screen.getByTestId('approve-button');
        fireEvent.click(approveButton);
        // Should call the parent handleApprove function
        expect(mockHandleApprove).toHaveBeenCalled();
    });
    it('calls handleBack when back button is clicked', function () {
        renderWithProviders(_jsx(CampaignBriefForm, { setCurrentStep: mockSetCurrentStep, handleBack: mockHandleBack, handleApprove: mockHandleApprove, setTiming: mockSetTiming, setService: mockSetService }));
        var backButton = screen.getByTestId('back-button');
        fireEvent.click(backButton);
        expect(mockHandleBack).toHaveBeenCalled();
    });
    it('shows campaign setup complete dialog after approval', function () {
        renderWithProviders(_jsx(CampaignBriefForm, { setCurrentStep: mockSetCurrentStep, handleBack: mockHandleBack, handleApprove: mockHandleApprove, setTiming: mockSetTiming, setService: mockSetService }));
        var approveButton = screen.getByTestId('approve-button');
        fireEvent.click(approveButton);
        // Should show the campaign setup complete dialog
        expect(screen.getByTestId('campaign-setup-complete-dialog')).toBeInTheDocument();
    });
    it('displays campaign details correctly', function () {
        renderWithProviders(_jsx(CampaignBriefForm, { setCurrentStep: mockSetCurrentStep, handleBack: mockHandleBack, handleApprove: mockHandleApprove, setTiming: mockSetTiming, setService: mockSetService }));
        // Should display the brand name
        expect(screen.getByText('Test Business')).toBeInTheDocument();
        // Should display the campaign name
        expect(screen.getByText('Test Campaign')).toBeInTheDocument();
        // Should display timing blocks
        expect(screen.getAllByTestId('timing-block')).toHaveLength(2);
        // Should display campaign details block for the product
        expect(screen.getByTestId('campaign-details-block')).toBeInTheDocument();
    });
});
//# sourceMappingURL=CampaignBriefForm.test.js.map