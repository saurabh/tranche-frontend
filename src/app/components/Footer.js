import React from 'react';

export function Footer() {
  return (
    <div className="container content-container footer-container flex">
      <div className="footerWrapper flex">
        <div className="footerLinks flex">
          <a href="/privacy" target="_blank">Privacy</a> 
          <a href="/terms" target="_blank">Terms</a>
          <a href="https://discord.com/invite/Nv44PTdF3K" target="_blank" rel="noopener noreferrer">Support</a>
          <a href="https://docs.tranche.finance/tranchefinance/" target="_blank" rel="noopener noreferrer">Documentation</a>
          <a href="https://github.com/tranche-jibrel/" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="https://app.tranche.finance/lend" target="_blank" rel="noopener noreferrer">Old App</a>
        </div>
      </div>
    </div>
  );
}
