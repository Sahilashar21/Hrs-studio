import React from 'react';

function GoogleReviews() {
  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '30px auto' }}>
      <iframe
        title="HRS Studio Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3141.0706046764017!2d72.82160967426027!3d19.394925241884835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7affb1a67c36f%3A0x58a74864e1c747bd!2sHrs%20studio!5e1!3m2!1sen!2sin!4v1748795645249!5m2!1sen!2sin"
        width="100%"
        height="450"
        style={{
          border: 0,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default GoogleReviews;
