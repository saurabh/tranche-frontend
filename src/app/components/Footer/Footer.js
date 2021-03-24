import React,  { useEffect, useState } from 'react';
import { ChevronTableLanguage } from 'assets';
import { useOuterClick } from 'services/useOuterClick';
import i18n from '../locale/i18n';
import { LanguageContainer, LanguageContent } from './styles/FooterComponents';


export function Footer() {
  const [languageMenu, setLanguageMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  
  const innerRef = useOuterClick(e => {
    setLanguageMenu(false);
  });
  const pathWindow =  window.location.pathname;
  let parsedPathWindow = pathWindow.split('/');
  let currentPath = parsedPathWindow[parsedPathWindow.length - 1];
  let currentLng = parsedPathWindow[parsedPathWindow.length - 2];
  useEffect(() =>{
    setCurrentLanguage(currentLng === 'en' ? "English" : currentLng === 'zh' ? "Chinese" : currentLng === 'kr' ? "Korean" : "English")
  }, [])
  const newPath = (lng) =>{
    return `${"/" + lng + "/" + currentPath}`;
  }
  return (
    <div className="footer-container">
      <div className="content-container container">
        <div className="footerWrapper">
          <LanguageContainer>
            <h2>Language</h2>
            <LanguageContent menu={languageMenu} ref={innerRef}>
              <div>
                <a href={newPath("en")}>English</a>
                <a href={newPath("zh")}>Chinese</a>
                <a href={newPath("kr")}>Korean</a>
              </div>
              <div onClick={() => setLanguageMenu(!languageMenu)}>
                <h2>{currentLanguage}</h2>
                <img src={ChevronTableLanguage} alt="cheveron" />
              </div>
            </LanguageContent>
          </LanguageContainer>
          <div className="footerLinks">
            <a href="/privacy" target="_blank">Privacy</a> 
            <a href="/terms" target="_blank">Terms</a>
            <a href="https://discord.gg/DTZrm4j4Yc" target="_blank" rel="noopener noreferrer">Support</a>
            <a href="https://docs.tranche.finance" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a href="https://github.com/tranche-jibrel/loan-contracts" target="_blank" rel="noopener noreferrer">Github</a>
          </div>
        </div>
      </div>
    </div>
  );
}
