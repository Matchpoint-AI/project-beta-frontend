import React, { useEffect, useState } from 'react';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Alert, Snackbar } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';
import VerifyEmail from '../components/VerifyEmail';

export default function AuthActions() {
  const [params] = useSearchParams();
  const [openToast, setOpenToast] = useState({
    open: false,
    error: false,
    message: '',
  });
  const mode = params.get('mode');
  const navigate = useNavigate();

  const closeTestWindow = () => {
    setOpenToast((old) => ({ ...old, open: false }));
  };

  useEffect(() => {
    if (!mode) navigate('/login');
  }, [mode, navigate]);

  return (
    <>
      <Navbar />
      {mode === 'resetPassword' && <ResetPassword setOpen={setOpenToast} />}
      {mode === 'verifyEmail' && <VerifyEmail setOpen={setOpenToast} />}
      <Snackbar open={openToast.open} onClose={closeTestWindow} autoHideDuration={6000}>
        <Alert
          onClose={closeTestWindow}
          severity={`${openToast.error ? 'error' : 'success'}`}
          sx={{
            backgroundColor: openToast.error ? '#F05252' : '#388e3c',
            color: 'white',
          }}
          icon={false}
        >
          {openToast.message}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
}
