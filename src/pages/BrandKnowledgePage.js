import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BrandKnowledgeForm from '../components/Forms/BrandKnowledgeForm';
var steps = ['Extract Knowledge', 'Review & Edit', 'Save & Apply'];
/**
 * Page component for managing brand knowledge.
 * This page allows users to create, edit, and extract brand knowledge
 * from their existing campaigns.
 */
export var BrandKnowledgePage = function () {
  var navigate = useNavigate();
  var _a = useState(0),
    activeStep = _a[0],
    setActiveStep = _a[1];
  var handleNext = function () {
    if (activeStep === steps.length - 1) {
      // Navigate to dashboard or campaigns page after completion
      navigate('/dashboard');
    } else {
      setActiveStep(function (prevStep) {
        return prevStep + 1;
      });
    }
  };
  var handleBack = function () {
    if (activeStep === 0) {
      navigate(-1); // Go back to previous page
    } else {
      setActiveStep(function (prevStep) {
        return prevStep - 1;
      });
    }
  };
  var handleSave = function (data) {
    console.log('Brand knowledge saved:', data);
    // Additional logic for handling saved data
  };
  return _jsx(Container, {
    maxWidth: 'lg',
    children: _jsxs(Box, {
      sx: { mt: 4, mb: 4 },
      children: [
        _jsx(Typography, {
          variant: 'h3',
          component: 'h1',
          gutterBottom: true,
          align: 'center',
          children: 'Brand Knowledge Management',
        }),
        _jsx(Stepper, {
          activeStep: activeStep,
          sx: { mb: 4 },
          children: steps.map(function (label) {
            return _jsx(Step, { children: _jsx(StepLabel, { children: label }) }, label);
          }),
        }),
        _jsx(BrandKnowledgeForm, {
          handleNext: handleNext,
          handleBack: handleBack,
          onSave: handleSave,
        }),
      ],
    }),
  });
};
export default BrandKnowledgePage;
//# sourceMappingURL=BrandKnowledgePage.js.map
