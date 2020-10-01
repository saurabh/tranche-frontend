import React, { useState } from 'react';
import { connect } from 'react-redux';
import Logo from "assets/images/svg/Logo.svg";
import {
    NavbarWrapper,
    NavbarContainer,
    NavbarLinks
} from './HeaderComponents';
import { ColorData } from 'config/constants';

import { NavLink } from 'react-router-dom';

import ConnectWallet from './ConnectWallet';

function Navbar({path}) {
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
                            <NavLink to="/borrow" activeStyle={{borderBottom: "2px solid", borderColor: ColorData[path].secondaryColor, opacity: '1'}}>Borrow</NavLink>
                            <NavLink to="/earn" activeStyle={{borderBottom: "2px solid", borderColor: ColorData[path].secondaryColor, opacity: '1'}}>Earn</NavLink>
                            <NavLink to="/trade" activeStyle={{borderBottom: "2px solid", borderColor: ColorData[path].secondaryColor, opacity: '1'}}>Trade</NavLink>
                        </NavbarLinks>
                        <ConnectWallet />
                    </div>
                </NavbarContainer>
            </NavbarWrapper>
        )   
}
const mapStateToProps = (state) => {
    return {
        path: state.changePath
    };
};
export default connect(mapStateToProps, null)(Navbar);