import { jsx as _jsx } from 'react/jsx-runtime';
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
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //   <React.StrictMode>
  _jsx(BrowserRouter, { children: _jsx(App, {}) })
  //   </React.StrictMode>,
);
//# sourceMappingURL=index.js.map
