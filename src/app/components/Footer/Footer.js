import React,  { useEffect, useState } from 'react';
import { ChevronTableLanguage, ChevronTableLanguageWhite } from 'assets';
import { useOuterClick } from 'services/useOuterClick';
import { changeTheme } from 'redux/actions/theme';
import { connect } from 'react-redux';
import { FooterContainer, LanguageContainer, LanguageContent, FooterLinks, FooterLeft } from './styles/FooterComponents';
import { CheckboxWrapper, CheckboxContent } from '../Stake/Table/styles/TableComponents';
import {
  ModeThemes
} from 'config/constants';

function Footer({ changeTheme, theme }) {
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
  }, [currentLng])
  const newPath = (lng) =>{
    return `${"/" + lng + "/" + currentPath}`;
  }
  return (
    <FooterContainer className="footer-container" color={ModeThemes[theme].footerBackground}>
      <div className="content-container container">
        <div className="footerWrapper">
          <FooterLeft>
            <LanguageContainer>
              <h2>Language</h2>
              <LanguageContent menu={languageMenu} ref={innerRef} color={ModeThemes[theme].languageToggleBackground} textColor={ModeThemes[theme].languageToggleText}>
                <div>
                  <a href={newPath("en")}>English</a>
                  <a href={newPath("zh")}>Chinese</a>
                  <a href={newPath("kr")}>Korean</a>
                </div>
                <div onClick={() => setLanguageMenu(!languageMenu)}>
                  <h2>{currentLanguage}</h2>
                  <img src={ theme === "dark" ? ChevronTableLanguageWhite : ChevronTableLanguage} alt="cheveron" />
                </div>
              </LanguageContent>
            </LanguageContainer>
            <CheckboxWrapper themeToggle>
              <h2>Theme</h2>
              <CheckboxContent themeToggle>
                <input
                  type='checkbox'
                  name='ThemeToggle'
                  id='ThemeToggle'
                  checked={theme === "dark"}
                />
                <label htmlFor='ThemeToggle' onClick={() => changeTheme()}></label>
              </CheckboxContent>
              <h2>{theme}</h2>
            </CheckboxWrapper>
          </FooterLeft>
          <FooterLinks className="footerLinks" color={ModeThemes[theme].footerLinks}>
            <a href="/privacy" target="_blank">Privacy</a> 
            <a href="/terms" target="_blank">Terms</a>
            <a href="https://discord.gg/DTZrm4j4Yc" target="_blank" rel="noopener noreferrer">Support</a>
            <a href="https://docs.tranche.finance/tranchefinance/" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a href="https://github.com/tranche-jibrel" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="https://app.tranche.finance/lend" target="_blank" rel="noopener noreferrer">Old App</a>
          </FooterLinks>
        </div>
      </div>
    </FooterContainer>
  );
}
const mapStateToProps = (state) => {
  return {
    theme: state.theme
  };
};

export default connect(mapStateToProps, { changeTheme })(Footer);