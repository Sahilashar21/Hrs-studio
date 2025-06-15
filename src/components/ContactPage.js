import React from 'react';
import './AboutContact.css';

function ContactPage() {
  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <div className="contact-info">
        <h4>📞 Contact Us</h4>
        <p>📍 HRS Studio, Shop no 9, Harsiddhi APT, Gokul Aangan Vasai West</p>
        <p>📞 +91 9321066921 / 22</p>
        <p>⏱️ Monday to Saturday: 5:30 PM to 10 PM</p>
        <p>⏱️ Sunday: 10:30 AM to 1:30 PM & 5:30 PM to 10 PM</p>
        <h3 className="notice-text">
  Studio is closed on every 2nd and 4th Monday
</h3>

      </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3141.0706046764017!2d72.82160967426027!3d19.394925241884835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7affb1a67c36f%3A0x58a74864e1c747bd!2sHrs%20studio!5e1!3m2!1sen!2sin!4v1748795645249!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="HRS Studio Location"
        ></iframe>
    </div>
  );
}

export default ContactPage;
