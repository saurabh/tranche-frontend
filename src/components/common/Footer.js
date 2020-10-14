import React from 'react';

export function Footer() {
  return (
    <div style={{paddingBottom: '15px' }} className="container content-container">
      <div className="footerWrapper">
        <div className="footerLinks">
          <a href="/privacy" target="_blank">Privacy</a> 
          <a href="/terms" target="_blank">Terms</a>
          <a href="https://discord.gg/eSmYep" target="_blank">Support</a>
        </div>
      </div>
    </div>
  );
}
