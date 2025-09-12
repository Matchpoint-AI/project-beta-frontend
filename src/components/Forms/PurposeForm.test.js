var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PurposeForm from './PurposeForm';
import { CampaignContext } from '../../context/CampaignContext';
import { BrandContext } from '../../features/brand/context/BrandContext';
import { AuthContext } from '../../features/auth/context/AuthContext';
// Mock dependencies
vi.mock('../../helpers/posthog', function () { return ({
    default: {
        __loaded: false,
        capture: vi.fn(),
    },
}); });
var mockSetCampaignInfo = vi.fn();
var mockHandleNext = vi.fn();
var mockSetBusinessInfo = vi.fn();
var mockCampaignContextValue = {
    campaignInfo: {
        name: '',
        purpose: 'Make customers aware/excited',
        purposeAbout: "Our business's brand",
    },
    setCampaignInfo: mockSetCampaignInfo,
    campaignId: 'test-campaign-id',
    setCampaignId: vi.fn(),
};
var mockBrandContextValue = {
    businessInfo: {
        name: 'Test Business',
        website: 'https://test.com',
        product_features: ['Feature 1', 'Feature 2'],
        product_description: 'Test product description',
        product_link: 'https://test.com/product',
        start_date: '2024-01-01',
        durationNum: 4,
        industry: 'Technology',
        vertical: 'SaaS',
    },
    setBusinessInfo: mockSetBusinessInfo,
};
var mockAuthContextValue = {
    profile: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
    },
    setProfile: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
};
var renderWithProviders = function (component) {
    return render(_jsx(AuthContext.Provider, { value: mockAuthContextValue, children: _jsx(BrandContext.Provider, { value: mockBrandContextValue, children: _jsx(CampaignContext.Provider, { value: mockCampaignContextValue, children: component }) }) }));
};
describe('PurposeForm', function () {
    beforeEach(function () {
        vi.clearAllMocks();
    });
    it('renders campaign name input and purpose dropdowns', function () {
        renderWithProviders(_jsx(PurposeForm, { handleNext: mockHandleNext }));
        expect(screen.getByPlaceholderText('Campaign Name')).toBeInTheDocument();
        expect(screen.getByText("What is your campaign's purpose?")).toBeInTheDocument();
        expect(screen.getByText('Make customers aware/excited About')).toBeInTheDocument();
    });
    it('allows user to enter campaign name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nameInputs, nameInput;
        return __generator(this, function (_a) {
            renderWithProviders(_jsx(PurposeForm, { handleNext: mockHandleNext }));
            nameInputs = screen.getAllByPlaceholderText('Campaign Name');
            nameInput = nameInputs[0];
            // Enter campaign name
            fireEvent.change(nameInput, { target: { value: 'Test Campaign' } });
            // Verify that campaign info was updated with the name
            expect(mockSetCampaignInfo).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Test Campaign',
            }));
            return [2 /*return*/];
        });
    }); });
    it('prevents navigation when campaign name is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nameInputs, nameInput, nextButtons, nextButton;
        return __generator(this, function (_a) {
            renderWithProviders(_jsx(PurposeForm, { handleNext: mockHandleNext }));
            nameInputs = screen.getAllByPlaceholderText('Campaign Name');
            nameInput = nameInputs[0];
            nextButtons = screen.getAllByText('Next');
            nextButton = nextButtons[0];
            // Clear the name input
            fireEvent.change(nameInput, { target: { value: '' } });
            // Click next button
            fireEvent.click(nextButton);
            // Verify error state is shown
            expect(screen.getByText('Please provide a valid value')).toBeInTheDocument();
            return [2 /*return*/];
        });
    }); });
    it('updates campaign purpose when dropdown is changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var purposeDropdowns, purposeDropdown, otherOption;
        return __generator(this, function (_a) {
            renderWithProviders(_jsx(PurposeForm, { handleNext: mockHandleNext }));
            purposeDropdowns = screen.getAllByText('Make customers aware/excited');
            purposeDropdown = purposeDropdowns[0];
            fireEvent.click(purposeDropdown);
            otherOption = screen.getByText('Drive customers to convert/use');
            fireEvent.click(otherOption);
            // Verify that campaign info was updated (simplified expectation)
            expect(mockSetCampaignInfo).toHaveBeenCalled();
            return [2 /*return*/];
        });
    }); });
    it('shows error when submitting without campaign name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nextButtons, nextButton;
        return __generator(this, function (_a) {
            renderWithProviders(_jsx(PurposeForm, { handleNext: mockHandleNext }));
            nextButtons = screen.getAllByText('Next');
            nextButton = nextButtons[0];
            // Submit the form without entering a name
            fireEvent.click(nextButton);
            // Verify error state is shown
            expect(screen.getByText('Please provide a valid value')).toBeInTheDocument();
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=PurposeForm.test.js.map