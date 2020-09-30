import React, { useState } from 'react';
import Logo from "assets/images/svg/Logo.svg";
import {
    NavbarWrapper,
    NavbarContainer,
    NavbarLinks
} from './HeaderComponents';
import { NavLink } from 'react-router-dom';

import ConnectWallet from './ConnectWallet';

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
        return(
            <NavbarWrapper>
                <NavbarContainer className="container navbar-container">
                    <div id="logo-wrapper">
                        <a href="/"><img src={Logo} alt="Logo"/></a>
                    </div>
                    <div id="navbar-icon" onClick={()=>setMenuOpen(!menuOpen)}><span></span><span></span><span></span></div>
                    <div className={"navbar-right " + (menuOpen ? "navbar-right-toggle" : "")}>
                        <NavbarLinks>
                            <NavLink to="/borrow" activeClassName="active-navbar-link">Borrow</NavLink>
                            <NavLink to="/earn" activeClassName="active-navbar-link">Earn</NavLink>
                            <NavLink to="/trade" activeClassName="active-navbar-link">Trade</NavLink>
                        </NavbarLinks>
                        <ConnectWallet />
                    </div>
                </NavbarContainer>
            </NavbarWrapper>
        )   
}