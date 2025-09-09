import React, { useState } from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BrandKnowledgeForm from '../components/Forms/BrandKnowledgeForm';

const steps = ['Extract Knowledge', 'Review & Edit', 'Save & Apply'];

/**
 * Page component for managing brand knowledge.
 * This page allows users to create, edit, and extract brand knowledge
 * from their existing campaigns.
 */
export const BrandKnowledgePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Navigate to dashboard or campaigns page after completion
      navigate('/dashboard');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1); // Go back to previous page
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleSave = (data: any) => {
    // Additional logic for handling saved data
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Brand Knowledge Management
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <BrandKnowledgeForm handleNext={handleNext} handleBack={handleBack} onSave={handleSave} />
      </Box>
    </Container>
  );
};

export default BrandKnowledgePage;
