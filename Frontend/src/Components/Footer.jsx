// src/Components/Footer.js
import React, { useState } from 'react';
import Modal from './Modal';

const Footer = () => {
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  const [isCookieModalOpen, setCookieModalOpen] = useState(false);

  // Privacy Policy Content
  const privacyPolicyContent = (
    <div>
      <div className="flex justify-center items-center mb-4">
        <img src="/path-to-logo.png" alt="Privacy Logo" className="h-12 mr-4" />
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
      </div>
      <p className="mb-2"><strong>Last Updated:</strong> March 24, 2025</p>
      <ol className="list-decimal pl-5 space-y-2">
        <li><strong>Information We Collect</strong><br />
          We collect information that you provide directly to us, including:
          <ul className="list-inside list-disc">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Payment information</li>
            <li>Profile information</li>
            <li>Communication preferences</li>
          </ul>
        </li>
        <li><strong>How We Use Your Information</strong><br />
          We use the information we collect to:
          <ul className="list-inside list-disc">
            <li>Provide and maintain our services</li>
            <li>Process your payments</li>
            <li>Send you important updates</li>
            <li>Improve our services</li>
            <li>Respond to your requests</li>
          </ul>
        </li>
        <li><strong>Information Sharing</strong><br />
          We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:
          <ul className="list-inside list-disc">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
          </ul>
        </li>
        <li><strong>Data Security</strong><br />
          We implement appropriate security measures to protect your personal information, including:
          <ul className="list-inside list-disc">
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
          </ul>
        </li>
        <li><strong>Your Rights</strong><br />
          You have the right to:
          <ul className="list-inside list-disc">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of communications</li>
          </ul>
        </li>
        <li><strong>Contact Us</strong><br />
          If you have any questions about this Privacy Policy, please contact us at:
          <p className="mt-2">Email: mikitesfaye09025@gmail.com</p>
          <p>Phone: +251934333999</p>
        </li>
      </ol>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-blue-600 to-teal-500 py-10 px-6">
      <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-6">
        <p className="text-white text-sm">
          &copy; {new Date().getFullYear()} Makalla Academy. All rights reserved.
        </p>

        {/* Footer Links */}
        <div className="flex gap-8">
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="text-white text-sm hover:underline"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setTermsModalOpen(true)}
            className="text-white text-sm hover:underline"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setCookieModalOpen(true)}
            className="text-white text-sm hover:underline"
          >
            Cookie Policy
          </button>
        </div>
      </div>

      {/* Conditionally Render Modals */}
      {isPrivacyModalOpen && (
        <Modal
          title="Privacy Policy"
          content={privacyPolicyContent}
          onClose={() => setPrivacyModalOpen(false)}
        />
      )}
      {isTermsModalOpen && (
        <Modal
          title="Terms of Service"
          content="Your Terms of Service content goes here."
          onClose={() => setTermsModalOpen(false)}
        />
      )}
      {isCookieModalOpen && (
        <Modal
          title="Cookie Policy"
          content="Your Cookie Policy content goes here."
          onClose={() => setCookieModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Footer;
