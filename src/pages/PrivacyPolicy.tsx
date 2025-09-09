import React from 'react';
import Navbar from '../components/auth/Navbar';
import Footer from '../components/auth/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-br from-white to-[#b4b1d5]">
      <Navbar />
      <div
        style={{
          // padding: "px",
          fontFamily: 'Georgia, serif',
          // lineHeight: "100px",
        }}
        className="w-full md:w-[90%] lg:w-[80%] mt-10 mx-auto px-2 md:px-10 lg:px-32 py-12"
      >
        <h1 className="font-extrabold text-3xl mb-2">MatchPoint AI Privacy Policy</h1>
        <h2 className="font-bold text-2xl mb-2">1. Introduction</h2>

        <p className="mb-2">
          Welcome to MatchPoint AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). This Privacy
          Policy describes how we collect, use, process, and protect your personal information when
          you use our generative AI marketing content platform (the &quot;Service&quot;).
        </p>

        <p className="mb-2">
          By using MatchPoint AI, you agree to the terms of this Privacy Policy.
        </p>
        <div className="">
          <h2 className="font-bold text-2xl mb-2">2. Information We Collect</h2>

          <h3 className="font-bold text-lg mb-2">2.1 Personal Information</h3>

          <p className="mb-2">We collect the following types of personal information:</p>

          <ul className="list-disc pl-11 mb-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Company/organization details</li>
            <li>Billing information</li>
            <li>Account credentials</li>
          </ul>
        </div>

        <h3 className="font-bold text-lg mb-2">2.2 Usage Data</h3>

        <p className="mb-2">We collect data related to your interaction with our platform:</p>

        <ul className="list-disc pl-11   mb-2">
          <li>IP address</li>
          <li>Device information</li>
          <li>Browser type</li>
          <li>Usage patterns</li>
          <li>Feature interactions</li>
          <li>Content generation logs</li>
        </ul>

        <h3 className="font-bold text-lg mb-2">2.3 AI-Generated Content Data</h3>

        <ul className="list-disc pl-11   mb-2">
          <li>Campaign information submitted</li>
          <li>Generated marketing content</li>
          <li>Content editing history</li>
          <li>Performance metrics of generated content</li>
        </ul>

        <h2 className="font-bold text-2xl mb-2">3. How We Use Your Information</h2>

        <p className="mb-2">We use collected information to:</p>

        <ul className="list-disc pl-11 mb-2">
          <li>Provide and maintain the Service</li>
          <li>Process payments and manage accounts</li>
          <li>Improve AI model and platform functionality</li>
          <li>Send administrative and marketing communications</li>
          <li>Detect and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="font-bold text-2xl mb-2">4. Data Processing for AI Training</h2>

        <ul className="list-disc pl-11 mb-2">
          <li className="">
            User-submitted data and generated content may be anonymized and used to improve our AI
            models.
          </li>
          <li className="">
            Sensitive or personally identifiable information is stripped from training data.
          </li>
        </ul>

        <h2 className="font-bold text-2xl mb-2">5. Data Sharing and Disclosure</h2>

        <p className="mb-2">We may share your information with:</p>

        <ul className="list-disc pl-11 mb-2">
          <li>Service providers and subprocessors</li>
          <li>Payment processors</li>
          <li>Cloud hosting providers</li>
          <li>Legal authorities (when required by law)</li>
        </ul>

        <p className="mb-2">
          We do <strong>NOT</strong> sell personal data to third parties.
        </p>

        <h2 className="font-bold text-2xl mb-2">6. Data Security</h2>

        <p className="mb-2">We implement:</p>

        <ul className="list-disc pl-11 mb-2">
          <li>Encryption (in-transit and at-rest)</li>
          <li>Multi-factor authentication</li>
          <li>Regular security audits</li>
          <li>Access controls</li>
          <li>Secure cloud infrastructure</li>
        </ul>

        <h2 className="font-bold text-2xl mb-2">7. User Rights</h2>

        <p className="mb-2">You have the right to:</p>

        <ul className="list-disc pl-11 mb-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request data deletion</li>
          <li>Export your data</li>
          <li>Withdraw consent</li>
          <li>Object to processing</li>
        </ul>

        <h2 className="font-bold text-2xl mb-2">8. Cookies and Tracking</h2>

        <p className="mb-2">We use cookies and similar technologies to:</p>

        <ul className="list-disc pl-11 mb-2">
          <li>Authenticate users</li>
          <li>Remember preferences</li>
          <li>Analyze platform usage</li>
          <li>Improve user experience</li>
        </ul>

        <h2 className="font-bold text-2xl mb-2">9. International Data Transfers</h2>

        <p className="mb-2">We comply with:</p>

        <ul className="list-disc pl-11 mb-2">
          <li>GDPR (European Union)</li>
          <li>CCPA (California)</li>
          <li>International data protection standards</li>
        </ul>

        <h2 className="font-bold text-2xl mb-2">10. Children&rsquo;s Privacy</h2>

        <p className="mb-2">
          Our Service is not intended for children under 13. We do not knowingly collect data from
          children.
        </p>

        <h2 className="font-bold text-2xl mb-2">11. Changes to Privacy Policy</h2>

        <p className="mb-2">
          We may update this policy periodically. We will notify you of significant changes via
          email or in-app notification.
        </p>

        <h2 className="font-bold text-2xl mb-2">12. Contact Information</h2>

        <p className="mb-2">For privacy-related inquiries:</p>

        <ul className="list-disc pl-11 mb-2">
          <li>
            Email: <a href="mailto:legal@matchpointai.com">legal@matchpointai.com</a>
          </li>
          <li>Mailing Address: 18459 Pines Boulevard, Ste. 507, Pembroke Pines, FL 33029</li>
        </ul>

        {/* <p className="mb-2"> */}
        <p className="mb-20  md:mb-4">
          <strong>Last Updated</strong>: December 6, 2024
        </p>

        {/* <h2 className="font-bold text-2xl mb-2">13. Governing Law</h2>

        <p className="mb-10">
          This policy is governed by the laws of [Your Jurisdiction].
        </p> */}
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
