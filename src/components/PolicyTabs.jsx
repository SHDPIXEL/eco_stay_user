import { useState } from "react";

const policies = {
  "Terms & Conditions": `
1. Booking and Payment
   - A deposit of 50% of the total booking amount is required to secure a booking.
   - Full payment is due 8 days before the tour commences.
   - Payment methods accepted: Credit Card, Debit Card, Bank Transfer.

2. Cancellations and Refunds
   - Cancellations of Safari Bookings depend on the respective Forest Policy.
   - Cancellations of Stay Bookings depend on the respective Hotel Property’s Policy.
   - No refunds for unused services or early departures.

3. Tour Itinerary
   - The itinerary is subject to change due to weather, political, or other factors.
   - The tour operator reserves the right to alter the itinerary without notice.

4. Safety and Risk
   - Participants acknowledge and accept the risks associated with wildlife tours.
   - The tour operator is not liable for injuries or losses incurred during the tour.

5. Health and Fitness
   - Participants must be in good physical health and disclose any medical conditions.
   - The tour operator reserves the right to refuse participation based on health concerns.

6. Travel Documents
   - Participants are responsible for obtaining necessary visas, permits, and travel documents.
   - The tour operator is not liable for travel document errors or omissions.

7. Insurance
   - Participants are strongly advised to purchase travel insurance.
   - The tour operator is not liable for losses or expenses incurred due to lack of insurance.

8. Liability
   - The tour operator is not liable for damages, losses, or expenses incurred during the tour.
   - Participants indemnify the tour operator from any liability arising from the tour.
  `,

  "Privacy Policy": `
Privacy Policy for Virya Wildlife Tours

Introduction
   At Virya Wildlife Tours, we respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and protect your personal data when you book a tour or interact with our website.

Personal Information We Collect
   - Contact information: Name, email, phone number, address.
   - Payment information: Credit card details, payment history.
   - Travel information: ID proofs, travel dates, itinerary.
   - Health and medical information: Health conditions & allergies.

How We Use Your Personal Information
   - To process and confirm your tour bookings.
   - To provide personalized travel recommendations and offers.
   - To communicate with you about your tour itinerary and travel plans.
   - To ensure your safety and well-being during the tour.
   - To comply with legal and regulatory requirements.

Data Protection and Security
   - We use secure servers and encryption to protect your personal data.
   - Access to your data is restricted to authorized personnel only.
   - We comply with relevant data protection laws and regulations.

Data Sharing and Disclosure
   - We do not share your personal data with third parties for marketing purposes.
   - We may share your data with service providers (e.g., hotels, transportation) to facilitate your tour.
   - We may disclose your data to authorities for safety, security, or legal reasons.

Your Rights
   - You have the right to access, correct, and delete your personal data.
   - You can opt out of marketing communications and withdraw your consent at any time.

Changes to This Privacy Policy
   - We may update this policy from time to time.
   - Changes will be posted on our website and effective immediately.

Contact Us
   If you have any questions or concerns about our privacy policy, please contact us at info@viryawildlifetours.com.
  `,

  "Cancellation & Refund Policy": `
Cancellation and Refund Policy

Introduction
   At Virya Wildlife Tours, we understand that unforeseen circumstances may arise, and you may need to cancel or change your tour plans. This policy outlines our refund terms to ensure a fair and transparent process.

Cancellation Policy
   - Cancellations are subject to respective cancellation policies.

Refund Policy
   - Refunds will be processed within 14 days of cancellation.
   - Refunds will be made in the original payment method.
   - Refunds will be subject to any bank or payment processing fees.

Exceptions
   - Cancellations due to natural disasters, political unrest, or global health crises may be eligible for a full refund.
   - Cancellations due to personal health reasons may be eligible for a partial refund or credit towards a future tour.

Changes to Your Tour
   - Changes to your tour itinerary or travel dates may incur a fee.
   - Changes are subject to availability.
   - All changes will incur a processing fee.

No Show Policy
   - Failure to arrive for your tour without prior notice will result in a 100% cancellation fee.

Travel Insurance
    -We strongly recommend purchasing travel insurance to cover unexpected cancellations or interruptions.

Travel Documents
    -Travelers are responsible for ensuring they have necessary travel documents (e.g., ID proofs).
    -We are not responsible for delays or cancellations due to incomplete or inaccurate travel documents.
  `,
};

const PolicyTabs = () => {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (policy) => {
    setModalContent(policy);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="policy-tabs-container">
      {/* Tab Options */}
      <div className="policy-options">
        {Object.keys(policies).map((policy) => (
          <button
            key={policy}
            className="policy-button"
            onClick={() => openModal(policy)}
          >
            {policy}
          </button>
        ))}
      </div>

      {/* Modal */}
      {modalContent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{modalContent}</h2>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="modal-body">
              <pre>{policies[modalContent]}</pre>
            </div>
          </div>
        </div>
      )}

      {/* CSS */}
      <style jsx>{`
        .policy-tabs-container {
          margin: 20px 0;
          font-family: Malayalam MN, Arial, sans-serif;
        }

        .policy-options {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .policy-button {
          padding: 5px 10px;
          background-color: #806A50; 
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          transition: background-color 0.3s ease;
        }

        .policy-button:hover {
          background-color: #fff;
          color: #806A50;
          border: 1px solid #806A50;
          transition: 0.3s ease-in-out;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9000;
        }

        .modal-content {
          background: #fff;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          border-radius: 8px;
          padding: 20px;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          overflow-y: auto;
        }

        .modal-title {
          font-size: 24px;
          color: #2e7d32;
          margin: 0 0 15px;
          text-align: center;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          color: #555;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .modal-close:hover {
          color: #2e7d32;
        }

        .modal-body {
          font-size: 16px;
          color: #333;
          line-height: 1.6;
        }

        .modal-body pre {
          white-space: pre-wrap;
          margin: 0;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default PolicyTabs;