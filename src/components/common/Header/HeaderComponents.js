import React from 'react';
import styled, { css } from 'styled-components';
import { Button, Dropdown } from 'semantic-ui-react';
import { Link as ReactRouterDomLink } from 'react-router-dom';

const Link = ({ isActive, children, ...props }) => {
  return <ReactRouterDomLink {...props}>{children}</ReactRouterDomLink>;
};

const HeaderWrapper = styled.header`
  display: grid;
  grid-template-rows: 40% 50% 10%;
  height: 39.5%;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  background: ${(props) => props.color};
`;

const NavContainer = styled.nav`
  display: none;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 15% 60% 10% 15%;
  }
`;

const NavBrand = styled(Link)`
  grid-column: 1 / 2;
  padding: 35px 0;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: center;
  align-content: flex-end;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavItem = styled(Link)`
  padding: 40px 30px 5px 30px;
  display: block;
  text-align: center;
  box-sizing: border-box;
  > h3 {
    ${(props) =>
      props.isActive
        ? css`
            color: white;
            border-bottom: 2px white solid;
          `
        : css`
            color: ${(props) => props.color};
            border-bottom: none;
          `}
  }
`;

const Options = styled(Dropdown)`
  place-self: center;
  padding: 8px 10px;
  color: black;
  background: white;
  border-radius: 5px;
`;

const StyledButton = styled(Button)`
  place-self: center;
  background: white;
  color: white;
`;

const Banner = styled.div`
  margin-top: 2vh;
  color: ${(props) => props.color};
`;

const PageMenu = styled.div`
  grid-row: 3 / 4;
  margin-top: 2vh;
  color: white;
`;

const PageMenuContainer = styled.div`
  display: flex;
`;

const PageMenuItem = styled.div`
  padding: 40px 30px 5px 30px;
  display: block;
  text-align: center;
  > h3 {
    ${(props) =>
      props.isActive
        ? css`
            color: white;
            border-bottom: 2px white solid;
          `
        : css`
            color: ${(props) => props.color};
            border-bottom: none;
          `}
  }
`;

const MobileMenuContainer = styled.nav`
  display: grid;
  grid-template-columns: 15% auto 15%;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuIcon = styled.div`
  grid-column: 3 / 4;
  margin: auto 0 auto auto;
  width: 35px;
  min-width: 35px;
  padding: 5px;
  > div {
    height: 3px;
    background: white;
    margin: 5px 0;
    width: 100%;
  }
`;

export {
  HeaderWrapper,
  NavContainer,
  NavLinks,
  NavBrand,
  NavItem,
  Options,
  StyledButton,
  Banner,
  PageMenu,
  PageMenuContainer,
  PageMenuItem,
  MobileMenuContainer,
  MobileMenuIcon
};
