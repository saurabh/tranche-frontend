import React, { Component } from "react";
import TableMoreRow from "./TableMoreRow";
import UserImg from "../../../assets/images/svg/userImg.svg";
import Adjust from "../../../assets/images/svg/adjust.svg";
import Star from "../../../assets/images/svg/Star.svg";
import ETHGOLD from "../../../assets/images/svg/ethGold.svg";
import ETH from "../../../assets/images/svg/eth.svg";
import styled from "styled-components";
import { etherScanUrl, NA } from "../../../config/constants";
import addrShortener from 'utils/addrShortener';
import LinkArrow from "../../../assets/images/svg/linkArrow.svg";

const TableContentCardWrapper = styled.div`
  min-height: 66px;
`;
const TableContentCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 66px;
  padding: 0 39px 0 47px;
  border-bottom: 1px solid #efefef;
  cursor: pointer;
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-end;
    border-bottom: 3px solid #efefef;
    padding: 0 12px;
  }
`;

class TableCard extends Component {
  state = {
    moreCardToggle: false,
    tooltipToggleRemaining: false
  };

  cardToggle = () => {
    this.setState({ moreCardToggle: !this.state.moreCardToggle });
  };

  remainingToggle=(hover)=>{
    this.setState({tooltipToggleRemaining: hover})
  }

  render() {
    const { moreCardToggle, tooltipToggleRemaining } = this.state;
    const { loan } = this.props;
    return (
      <TableContentCardWrapper>
        <TableContentCard
          onClick={this.cardToggle}
          className={moreCardToggle ? "table-card-toggle" : ""}
        >
          <div className="table-first-col table-col">
            <div className="table-first-col-wrapper">
              <div className="first-col-img">
                <img src={UserImg} alt="User" />
              </div>
              <div className="first-col-content">
                {/*<div className="first-col-title">
                                <h2>Pragmatic owl</h2>
                            </div>*/}
                <div className="first-col-subtitle">
                  <h2>{addrShortener(loan.contractAddress)}</h2>
                  <a href={etherScanUrl + loan.contractAddress + "/#internaltx"} target="_blank">
                    <img src={LinkArrow} alt=""/>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="table-third-col table-col">
            <div className="third-col-content second-4-col-content">
              <h2 onMouseEnter={() => this.remainingToggle(true)} onMouseLeave={() => this.remainingToggle(false)}>
                {addrShortener(loan.remainingLoan)} <span>{loan.remainingLoan!=NA ?loan.cryptoFromLender:''}</span>
              </h2>
              <h2 className={"table-tool-tip " + (tooltipToggleRemaining ? "table-tool-tip-toggle" : "")}>{loan.remainingLoan} <span>{loan.remainingLoan!=NA ?loan.cryptoFromLender:''}</span></h2>
            </div>
          </div>
          <div className="table-fourth-col table-col">
            <div className="fourth-col-content second-4-col-content">
              <h2>
                {loan.collateralRatio}
                <span>%</span>
              </h2>
            </div>
          </div>
          <div className="table-fifth-col table-col">
            <div className="fifth-col-content second-4-col-content">
              <h2>
                {loan.interestPaid && addrShortener(loan.interestPaid)} <span>{loan.interestPaid!=NA ?loan.collateralType:''}</span>
              </h2>
            </div>
          </div>
          <div className="table-second-col table-col">
            <div className="second-col-content second-4-col-content">
              <h2>
                active
              </h2>
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="table-sixth-col table-col"
          >
            <div className="adjust-btn-wrapper">
              <button>
                <img src={Adjust} alt="" />
              </button>
            </div>
            <div className="star-btn-wrapper">
              <button>
                <img src={Star} alt="" />
              </button>
            </div>
          </div>
        </TableContentCard>
        {/* <div
          className={
            "table-card-more " +
            (moreCardToggle ? "table-more-card-toggle" : "")
          }
        >
          <div className="table-card-more-content">
            <TableMoreRow ethImg={ETHGOLD} arrow="upArrow" />
            <TableMoreRow ethImg={ETH} arrow="downArrow" />

            <div className="more-transactions">
              <h2>
                this loan has 11 more transactions in its history.
                <a href="/">show more transactions</a>
              </h2>
            </div>
          </div>
        </div> */}
      </TableContentCardWrapper>
    );
  }
}
export default TableCard;
