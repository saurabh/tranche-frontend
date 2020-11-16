import React, { Component } from 'react';
import { connect } from 'react-redux';
import SummaryCard from './SummaryCard';
import { 
  SummaryCardsWrapper
} from './styles/SummaryComponents';
class SummaryCards extends Component {
  state = {
    summaryCards: [
      {
        id: 0,
        title: 'Decentralized Loans',
        value: '$218,531',
        details: '1,241 Loan Positions'
      },
      {
        id: 1,
        title: 'Protocol Collateral',
        value: '$1,218,531',
        details: '6,000 ETH / 1,150,501 JNT'
      },
      {
        id: 2,
        title: 'Collateralization Ratio',
        value: '256.125%',
        details: 'Total Borrowed vs. Total Held'
      }
    ]
  };
  render() {
    const { summaryCards } = this.state;
    const { path } = this.props;
    return (
      <SummaryCardsWrapper className='container content-container'>
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.title}
            value={card.value}
            details={card.details}
            path={path}
          />
        ))}
      </SummaryCardsWrapper>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    path: state.path
  };
};

export default connect(mapStateToProps)(SummaryCards);
