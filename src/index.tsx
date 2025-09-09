import React from 'react';
import ReactDOM from 'react-dom/client';
// import "./index.css";
// import "./App.css";
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// import { initializeApp } from "firebase/app";
// import dotenv from 'dotenv';

// dotenv.config();

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export default app;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  //   <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  //   </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
