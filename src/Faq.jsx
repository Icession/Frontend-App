import { useState } from "react";
import "./FAQ.css";

const faqData = {
  General: [
    {
      question: "What is RideWatch?",
      answer:
        "RideWatch is a ride safety platform that helps passengers monitor and track their rides in real time. It provides safety features like live location sharing, trip history, and emergency contacts so you always feel secure on every journey.",
    },
    {
      question: "Is RideWatch accurate?",
      answer:
        "Yes! RideWatch uses GPS technology combined with real-time data processing to provide highly accurate tracking. Our system updates your location every few seconds to ensure precision throughout your trip.",
    },
    {
      question: "Is RideWatch free to use?",
      answer:
        "RideWatch offers a free tier with core safety features. Premium plans are available for advanced features like detailed trip analytics, multiple emergency contacts, and priority support.",
    },
    {
      question: "What devices does RideWatch support?",
      answer:
        "RideWatch is available on web browsers, iOS, and Android devices. You can access your account and safety features from any modern device with an internet connection.",
    },
  ],
  Features: [
    {
      question: "How does live location sharing work?",
      answer:
        "Once your ride starts, RideWatch automatically generates a shareable link that you can send to trusted contacts. They can follow your journey in real time without needing to create an account.",
    },
    {
      question: "Can I set emergency contacts?",
      answer:
        "Yes. In your Account settings, you can add up to 3 emergency contacts. In case of an emergency, RideWatch will automatically notify them with your last known location.",
    },
    {
      question: "Does RideWatch record my trip history?",
      answer:
        "All completed trips are saved to your account for up to 90 days. You can review routes, timestamps, and driver details from any past ride in the Trip History section.",
    },
    {
      question: "Is there an SOS feature?",
      answer:
        "Yes. The SOS button is always accessible during an active trip. Pressing it immediately alerts your emergency contacts and, depending on your settings, can notify local authorities.",
    },
  ],
  Account: [
    {
      question: "How do I create a RideWatch account?",
      answer:
        "You can register by clicking the 'Sign Up' button on the home page. Fill in your name, email address, and create a password. A verification email will be sent to activate your account.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Go to the login page and click 'Forgot Password'. Enter your registered email address and we'll send you a link to reset your password within a few minutes.",
    },
    {
      question: "Can I change my registered email address?",
      answer:
        "Yes. Go to Account Settings > Personal Information and click 'Edit'. You'll need to verify the new email address before the change takes effect.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can delete your account from Account Settings > Privacy > Delete Account. Please note this action is irreversible and all your trip data will be permanently removed.",
    },
  ],
  Support: [
    {
      question: "How do I contact RideWatch support?",
      answer:
        "You can reach our support team via the in-app chat, by emailing support@ridewatch.com, or by filling out the contact form on our website. We typically respond within 24 hours.",
    },
    {
      question: "What do I do if the app isn't working?",
      answer:
        "Try refreshing the page or restarting the app. If the issue persists, clear your browser cache or reinstall the mobile app. You can also check our status page at status.ridewatch.com for any ongoing outages.",
    },
    {
      question: "How do I report a safety incident?",
      answer:
        "After a trip ends, you'll be prompted to rate your experience. You can flag any safety concerns there. For urgent matters, use the SOS feature during the ride or contact local authorities directly.",
    },
    {
      question: "Is there a community forum or help center?",
      answer:
        "Yes! Visit our Help Center at help.ridewatch.com for guides, tutorials, and answers to common questions. You can also join our community forum to connect with other users.",
    },
  ],
};

const categories = ["General", "Features", "Account", "Support"];

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`faq-accordion-item ${open ? "open" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div className="faq-accordion-header">
        <span className="faq-question">{question}</span>
        <span className={`faq-chevron ${open ? "rotated" : ""}`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      <div className="faq-accordion-body">
        <p className="faq-answer">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("General");

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1 className="faq-title">Frequently Asked Questions</h1>

        <div className="faq-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`faq-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {faqData[activeCategory].map((item, index) => (
            <AccordionItem
              key={`${activeCategory}-${index}`}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}