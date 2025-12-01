import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Database, Eye, Lock, Users, Mail, ExternalLink } from 'lucide-react';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Privacy Policy | Frequency Zen';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for Frequency Zen - Learn how we collect, use, and protect your data when using our binaural beats and meditation app.');
    }
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        <header className="privacy-header">
          <div className="privacy-icon">
            <Shield size={48} />
          </div>
          <h1>Privacy Policy</h1>
          <p className="privacy-subtitle">
            Last updated: {currentDate}
          </p>
        </header>

        <div className="privacy-intro">
          <p>
            Frequency Zen ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you use our mobile 
            application and website (collectively, the "Service").
          </p>
          <p>
            By using Frequency Zen, you agree to the collection and use of information in accordance with this 
            policy. If you do not agree with our policies and practices, please do not use our Service.
          </p>
        </div>

        {/* Information We Collect */}
        <section className="privacy-section">
          <div className="section-header">
            <Database size={32} />
            <h2>Information We Collect</h2>
          </div>
          
          <div className="section-content">
            <h3>1. Information Stored Locally on Your Device</h3>
            <p>
              Frequency Zen stores certain information locally on your device to provide a personalized experience:
            </p>
            <ul>
              <li><strong>App Preferences:</strong> Your audio settings, volume levels, visual preferences, and UI preferences</li>
              <li><strong>Saved Content:</strong> Your custom playlists, audio mixes, and frequency sequences</li>
              <li><strong>Usage Data:</strong> Your playback history and favorite frequencies (stored locally only)</li>
            </ul>
            <p>
              This information is stored only on your device using browser local storage (for web) or device storage 
              (for mobile apps). We do not have access to this information, and it is never transmitted to our servers.
            </p>

            <h3>2. Automatically Collected Information</h3>
            <p>
              When you use Frequency Zen, we may automatically collect certain information:
            </p>
            <ul>
              <li><strong>Usage Analytics:</strong> We use Google Analytics to collect anonymous usage statistics, including:
                <ul>
                  <li>Pages visited and features used</li>
                  <li>Session duration and frequency of use</li>
                  <li>Device type, operating system, and browser information</li>
                  <li>General geographic location (country/region level, not precise location)</li>
                </ul>
              </li>
              <li><strong>Technical Information:</strong> Device identifiers, IP address (anonymized), and app version</li>
            </ul>
            <p>
              This information is collected anonymously and cannot be used to identify you personally.
            </p>

            <h3>3. Information We Do NOT Collect</h3>
            <p>
              Frequency Zen does not collect:
            </p>
            <ul>
              <li>Personal identification information (name, email, phone number)</li>
              <li>Payment or financial information</li>
              <li>Precise location data</li>
              <li>Contact lists or address book information</li>
              <li>Photos, videos, or other media files</li>
              <li>Biometric data</li>
            </ul>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="privacy-section">
          <div className="section-header">
            <Eye size={32} />
            <h2>How We Use Your Information</h2>
          </div>
          
          <div className="section-content">
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>Service Functionality:</strong> To provide, maintain, and improve our Service</li>
              <li><strong>Analytics:</strong> To understand how users interact with our app and identify areas for improvement</li>
              <li><strong>Personalization:</strong> To remember your preferences and provide a customized experience</li>
              <li><strong>Technical Support:</strong> To diagnose technical issues and ensure app stability</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="privacy-section">
          <div className="section-header">
            <ExternalLink size={32} />
            <h2>Third-Party Services</h2>
          </div>
          
          <div className="section-content">
            <p>
              Frequency Zen uses third-party services that may collect information used to identify you. 
              Links to privacy policies of third-party service providers used by our app:
            </p>
            
            <div className="third-party-list">
              <div className="third-party-item">
                <h3>Google Analytics</h3>
                <p>
                  We use Google Analytics to analyze app usage and improve our Service. Google Analytics collects 
                  anonymous usage data. You can learn more about how Google uses data at{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                    https://policies.google.com/privacy
                  </a>
                </p>
                <p>
                  You can opt-out of Google Analytics by installing the{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                    Google Analytics Opt-out Browser Add-on
                  </a>
                </p>
              </div>

              <div className="third-party-item">
                <h3>Google AdMob</h3>
                <p>
                  Our app displays advertisements through Google AdMob. AdMob may collect and use information 
                  about your device and app usage to show personalized ads. You can learn more about AdMob's 
                  privacy practices at{' '}
                  <a href="https://support.google.com/admob/answer/6128543" target="_blank" rel="noopener noreferrer">
                    https://support.google.com/admob/answer/6128543
                  </a>
                </p>
                <p>
                  You can manage your ad preferences in your device settings or through Google's Ad Settings at{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
                    https://adssettings.google.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Storage and Security */}
        <section className="privacy-section">
          <div className="section-header">
            <Lock size={32} />
            <h2>Data Storage and Security</h2>
          </div>
          
          <div className="section-content">
            <h3>Local Storage</h3>
            <p>
              All app preferences and saved content are stored locally on your device. This data remains on your 
              device and is not transmitted to our servers or third parties.
            </p>

            <h3>Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your information. However, 
              no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
              to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>

            <h3>Data Retention</h3>
            <p>
              We retain analytics data for as long as necessary to provide our Service and comply with legal obligations. 
              Local app data remains on your device until you uninstall the app or clear app data.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="privacy-section">
          <div className="section-header">
            <Users size={32} />
            <h2>Your Privacy Rights</h2>
          </div>
          
          <div className="section-content">
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> You can request information about what data we collect</li>
              <li><strong>Deletion:</strong> You can request deletion of your data (note: local app data can be cleared by uninstalling the app)</li>
              <li><strong>Opt-Out:</strong> You can opt-out of analytics and personalized advertising through your device settings</li>
              <li><strong>Data Portability:</strong> You can export your saved playlists and preferences (stored locally on your device)</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="privacy-section">
          <div className="section-header">
            <Shield size={32} />
            <h2>Children's Privacy</h2>
          </div>
          
          <div className="section-content">
            <p>
              Frequency Zen is not intended for children under the age of 13. We do not knowingly collect 
              personally identifiable information from children under 13. If you are a parent or guardian and 
              believe your child has provided us with personal information, please contact us immediately.
            </p>
            <p>
              If we become aware that we have collected personal information from children under 13 without 
              verification of parental consent, we will take steps to remove that information from our systems.
            </p>
          </div>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="privacy-section">
          <div className="section-header">
            <Shield size={32} />
            <h2>Changes to This Privacy Policy</h2>
          </div>
          
          <div className="section-content">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this 
              Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
        </section>

        {/* Contact Us */}
        <section className="privacy-section">
          <div className="section-header">
            <Mail size={32} />
            <h2>Contact Us</h2>
          </div>
          
          <div className="section-content">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="contact-info">
              <p>
                <strong>Frequency Zen</strong><br />
                Website: <a href="https://zoneout.space" target="_blank" rel="noopener noreferrer">https://zoneout.space</a>
              </p>
              <p>
                For privacy-related inquiries, please visit our website or use the contact methods available 
                through our app or website.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="privacy-note">
          <div className="note-box">
            <h3>Additional Information</h3>
            <p>
              <strong>California Privacy Rights:</strong> If you are a California resident, you may have 
              additional rights under the California Consumer Privacy Act (CCPA). Please contact us to learn 
              more about your rights.
            </p>
            <p>
              <strong>European Privacy Rights:</strong> If you are located in the European Economic Area (EEA), 
              you may have additional rights under the General Data Protection Regulation (GDPR). Please contact 
              us to exercise these rights.
            </p>
            <p>
              <strong>Medical Disclaimer:</strong> Frequency Zen is not a medical device and is not intended 
              to diagnose, treat, cure, or prevent any disease. Individual experiences may vary. Consult a 
              healthcare professional for medical advice.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

