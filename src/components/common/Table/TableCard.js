import React, { Component } from 'react';
import TableMoreRow from "./TableMoreRow";
import UserImg from "../../../assets/images/svg/userImg.svg";
import Adjust from "../../../assets/images/svg/adjust.svg";
import Star from "../../../assets/images/svg/Star.svg";
import ETHGOLD from "../../../assets/images/svg/ethGold.svg";
import ETH from "../../../assets/images/svg/eth.svg";
import styled from 'styled-components';

const TableContentCardWrapper = styled.div`
    min-height: 66px;
`;
const TableContentCard = styled.div`
    display: flex;
    align-items: center;
    min-height: 66px;
    padding: 0 12px 0 47px;
    border-bottom: 1px solid #EFEFEF;
    cursor: pointer;
    @media (max-width: 992px){
        flex-direction: column;
        align-items: flex-end;
        border-bottom: 3px solid #EFEFEF;
        padding: 0 12px;
    }
`;


class TableCard extends Component {
    state={
        moreCardToggle: false
    }
    cardToggle = () =>{
        this.setState({moreCardToggle: !this.state.moreCardToggle})
    }
    render() {
      const { moreCardToggle } = this.state;
      return (
        <TableContentCardWrapper>
            <TableContentCard onClick={this.cardToggle} className={(moreCardToggle ? "table-card-toggle" : "")}>
                <div className="table-first-col table-col">
                    <div className="table-first-col-wrapper">
                        <div className="first-col-img">
                            <img src={UserImg} alt="User"/>
                        </div>
                        <div className="first-col-content">
                            <div className="first-col-title">
                                <h2>Pragmatic owl</h2>
                            </div>
                            <div className="first-col-subtitle">
                                <h2>0xB51....468</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-second-col table-col">
                    <div className="second-col-content second-3-col-content">
                        <h2>277.3 <span>DAI</span></h2>
                    </div>
                </div>
                <div className="table-third-col table-col">
                    <div className="third-col-content second-3-col-content">
                        <h2>226<span>%</span></h2>
                    </div>
                </div>
                <div className="table-fourth-col table-col">
                    <div className="fourth-col-content second-3-col-content">
                        <h2>4.000 <span>ETH</span></h2>
                    </div>
                </div>
                <div onClick={(e)=>e.stopPropagation()} className="table-fifth-col table-col">
                    <div className="adjust-btn-wrapper">
                        <button><img src={Adjust} alt=""/></button>
                    </div>
                    <div className="star-btn-wrapper">
                        <button><img src={Star} alt=""/></button>
                    </div>
                </div>
            </TableContentCard>
            <div className={"table-card-more " + (moreCardToggle ? "table-more-card-toggle" : "")}>
                <div className="table-card-more-content">
                    
                    <TableMoreRow ethImg={ETHGOLD} arrow="upArrow"/>
                    <TableMoreRow ethImg={ETH} arrow="downArrow"/>
                    
                    <div className="more-transactions">
                        <h2>this loan has 11 more transactions in its history.<a href="/">show more transactions</a></h2>
                    </div>
                </div>
            </div>
        </TableContentCardWrapper>    
      );
    }
  }
  export default TableCard;