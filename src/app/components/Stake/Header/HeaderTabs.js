import React from 'react';
import { connect } from 'react-redux';
import { changeOwnAllFilter, ownAllToggle } from 'redux/actions/tableData';

import { NavLink } from 'react-router-dom';
import i18n from "../../locale/i18n";

import {
  HeaderTabsWrapper,
  HeaderTabsBtnsLinks
} from './styles/HeaderComponents';
export const baseUrl = i18n.language === 'en' ? '' : '/'+i18n.language;

const HeaderTabs = ({ path, changeOwnAllFilter, ownAllToggle, ethereum: { address }, data: { filterType, tradeType } }) => {
  // const [pair1Value, setPair1Value] = useState(0);
  
  
  return (
    <HeaderTabsWrapper path={path} desktop>
      <HeaderTabsBtnsLinks>
          <NavLink
            to={baseUrl + '/stake'}
            activeStyle={{
              color: 'rgba(68, 65, 207, 1)'
            }}
            exact
          >
            Staking
          </NavLink>
          <NavLink
            to={baseUrl + '/'}
            activeStyle={{
              color: 'rgba(68, 65, 207, 1)'
            }}
            exact
          >
            Dashboard
          </NavLink>
          <div>
            <button>
              Rates
            </button>
          </div>
          <NavLink
            to={baseUrl + '/'}
            activeStyle={{
              color: 'rgba(68, 65, 207, 1)'
            }}
            exact
          >
            How-to
          </NavLink>
      </HeaderTabsBtnsLinks>
    </HeaderTabsWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    ethereum: state.ethereum,
    data: state.data,
    path: state.path,
    trade: state.trade
  };
};

export default connect(mapStateToProps, { changeOwnAllFilter, ownAllToggle })(HeaderTabs);