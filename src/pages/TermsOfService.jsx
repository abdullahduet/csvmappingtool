import React from 'react';
import SEOHead from '../components/common/SEOHead';

const TermsOfService = () => {
  return (
    <>
      <SEOHead 
        title="Terms of Service" 
        description="ReactRedux Pro terms of service outline the rules, guidelines, and legal agreements between users and our platform."
        keywords="terms of service, legal terms, user agreement, conditions"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="lead text-lg mb-6">
              Last updated: April 5, 2025
            </p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the ReactRedux Pro application and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application.
            </p>
            
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use the ReactRedux Pro application for personal, non-commercial, or commercial use, subject to the following restrictions:
            </p>
            <ul>
              <li>You must not modify or copy the materials except as required for normal application usage</li>
              <li>You must not use the materials for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>You must not attempt to decompile or reverse engineer any software contained in the application</li>
              <li>You must not remove any copyright or other proprietary notations from the materials</li>
            </ul>
            
            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the application, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during the registration process</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account or other security breaches</li>
            </ul>
            
            <h2>4. Intellectual Property</h2>
            <p>
              The ReactRedux Pro application and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            
            <h2>5. User Contributions</h2>
            <p>
              The application may contain message boards, forums, bulletin boards, and other interactive features that allow users to post, submit, publish, display, or transmit content or materials. By providing any user contribution, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in any media.
            </p>
            
            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the application immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the application will immediately cease.
            </p>
            
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall ReactRedux Pro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the application.
            </p>
            
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our application after those revisions become effective, you agree to be bound by the revised terms.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@reactreduxpro.com<br />
              <strong>Address:</strong> 123 Technology Lane, San Francisco, CA 94107
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;