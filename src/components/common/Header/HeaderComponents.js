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
  height: 39.5vh;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  background: ${(props) => props.color};
`;

const NavContainer = styled.nav`
  display: grid;
  grid-template-columns: 15% auto 15%;
  width: 100%;
  top: 60px;
  left: 0;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 15% 60% 10% 15%;
    border-bottom: none;
    background: none;
    width: initial;
    left: initial;
    top: initial;
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
`;

const NavItem = styled(Link)`
  padding: 40px 30px 5px 30px;
  display: block;
  text-align: center;
  box-sizing: border-box;
`;

const Title = styled.h3`
  ${(props) =>
    props.isActive
      ? css`
          color: white;
          border-bottom: 2px white solid;
        `
      : css`
          color: #a988f1;
          border-bottom: none;
        `}
`;

const Options = styled(Dropdown)`
  grid-column: 3 / 4;
  place-self: center;
  padding: 8px 10px;
  color: black;
  background: white;
  border-radius: 5px;
`;

const StyledButton = styled(Button)`
  grid-column: 4 / 5;
  place-self: center;
  background: white;
  color: black;
`;

const Banner = styled.div`
  grid-row: 2 / 3;
  margin-top: 2vh;
  color: #8edd8d;
`;

const PageMenu = styled.div`
  grid-row: 3 / 4;
  margin-top: 2vh;
  color: white;
`;

const PageMenuContainer = styled.div`
  display: flex;
  border-bottom: none;
  background: none;
  width: initial;
  left: initial;
  top: initial;
`;

const PageMenuItem = styled.div`
  padding: 40px 30px 5px 30px;
  display: block;
  text-align: center;
  box-sizing: border-box;
`;

export {
  HeaderWrapper,
  NavContainer,
  NavLinks,
  NavBrand,
  NavItem,
  Title,
  Options,
  StyledButton,
  Banner,
  PageMenu,
  PageMenuContainer,
  PageMenuItem
};
