import React from 'react';
import SEOHead from '../components/common/SEOHead';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead 
        title="Privacy Policy" 
        description="ReactRedux Pro privacy policy outlining how we collect, use, and protect your information."
        keywords="privacy policy, data protection, privacy, terms"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="lead text-lg mb-6">
              Last updated: April 5, 2025
            </p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to ReactRedux Pro ("we," "our," or "us"). We are committed to protecting your privacy and providing you with a safe experience when using our application and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>
              We may collect information about you in various ways, including:
            </p>
            <ul>
              <li>
                <strong>Personal Information:</strong> When you register for an account, we collect your name, email address, and other contact information.
              </li>
              <li>
                <strong>Usage Data:</strong> We automatically collect information about how you interact with our application, including the pages you visit, features you use, and time spent on the application.
              </li>
              <li>
                <strong>Device Information:</strong> We collect information about the device you use to access our application, including device type, operating system, browser type, and IP address.
              </li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We may use the information we collect about you for various purposes, including:
            </p>
            <ul>
              <li>Providing, maintaining, and improving our application and services</li>
              <li>Processing and completing transactions</li>
              <li>Sending administrative information, such as updates, security alerts, and support messages</li>
              <li>Responding to your comments, questions, and requests</li>
              <li>Monitoring and analyzing trends, usage, and activities in connection with our application</li>
              <li>Personalizing your experience and delivering content relevant to your interests</li>
            </ul>
            
            <h2>4. Disclosure of Your Information</h2>
            <p>
              We may share your information in the following situations:
            </p>
            <ul>
              <li>With third-party service providers that perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2>6. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access and receive a copy of your personal information</li>
              <li>The right to rectify or update your personal information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to our processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>
            
            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@reactreduxpro.com<br />
              <strong>Address:</strong> 123 Technology Lane, San Francisco, CA 94107
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;