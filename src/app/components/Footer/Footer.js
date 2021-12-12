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
import i18n from '../locale/i18n';

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
    setCurrentLanguage(currentLng === 'en' ? "English" : currentLng === 'zh' ? "中文" : currentLng === 'kr' ? "한국어" : "English")
  }, [currentLng])
  const newPath = (lng) =>{
    // return `${ "/" + lng + "/" + currentPath }`;
    return `/${ lng }/${ currentPath }`;
  }
  return (
    <FooterContainer className="footer-container flex" color={ModeThemes[theme].footerBackground}>
      <div className="content-container container">
        <div className="footerWrapper">
          <FooterLeft>
            <LanguageContainer>
              <h2>{i18n.t('footer.language')}</h2>
              <LanguageContent menu={languageMenu} ref={innerRef} color={ModeThemes[theme].languageToggleBackground} textColor={ModeThemes[theme].languageToggleText}>
                <div>
                  <a href={newPath("en")}>English</a>
                  <a href={newPath("zh")}>中文</a>
                  <a href={newPath("kr")}>한국어</a>
                </div>
                <div onClick={() => setLanguageMenu(!languageMenu)}>
                  <h2>{currentLanguage}</h2>
                  <img src={ theme === "dark" ? ChevronTableLanguageWhite : ChevronTableLanguage} alt="cheveron" />
                </div>
              </LanguageContent>
            </LanguageContainer>
            <CheckboxWrapper themeToggle>
              <h2>{i18n.t('footer.theme')}</h2>
              <CheckboxContent themeToggle>
                <input
                  type='checkbox'
                  name='ThemeToggle'
                  id='ThemeToggle'
                  checked={theme === "dark"}
                  readOnly
                />
                <label htmlFor='ThemeToggle' onClick={() => changeTheme()}></label>
              </CheckboxContent>
              <h2>{i18n.t(`footer.${theme}`)}</h2>
            </CheckboxWrapper>
          </FooterLeft>
          <FooterLinks className="footerLinks" color={ModeThemes[theme].footerLinks}>
            <a href="/privacy" target="_blank">{i18n.t('footer.privacy')}</a> 
            <a href="/terms" target="_blank">{i18n.t('footer.terms')}</a>
            <a href="https://discord.com/invite/Nv44PTdF3K" target="_blank" rel="noopener noreferrer">{i18n.t('footer.support')}</a>
            <a href="https://docs.tranche.finance/tranchefinance/" target="_blank" rel="noopener noreferrer">{i18n.t('footer.docs')}</a>
            <a href="https://github.com/tranche-jibrel" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="https://app.tranche.finance/lend" target="_blank" rel="noopener noreferrer">{i18n.t('footer.oldApp')}</a>
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