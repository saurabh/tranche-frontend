import React, { useState } from "react";
import styled from 'styled-components';
import { downChevron, upChevron } from 'assets';

const TableHeadWrapper = styled.div`
    min-height: 28px;
    background: #FAF8FF;
    border-top: 1px solid #EFEFEF;
    border-bottom: 1px solid #EFEFEF;
    padding: 0 47px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1200px){
        display: none !important;
    }
`;
const TableHeadTitle = styled.div`

    & > div {
        position: relative;
        cursor: pointer;
        & > h2{
            font-family: 'Roboto', sans-serif;
            font-style: normal;
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: rgba(56, 56, 56, 0.3);
        }
    }
    ${({ defaultCursor }) => defaultCursor && `
        & > div {
            cursor: default;
        }
    `}
        
    
`;

const SortChevronWrapper = styled.div`
    position: absolute;
    right: -12px;
    margin-top: -1px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    height: 10px;
    justify-content: space-between;  
    & > img{
        cursor: pointer;
    }
`;


const TableHead = ({handleSorting}) => {

    const [order, setOrder] = useState("asc")

    const sortLoans = (val) => {
        handleSorting(val, order)
        setOrder(order === "asc" ? "desc" : "asc")
    }
    return (
        <TableHeadWrapper>
            <TableHeadTitle className="address-wrapper" defaultCursor={true}>
                <div className="address-title-content">
                    <h2>Address</h2>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="remaining-wrapper">
                <div className="remaining-title-content" onClick={() => sortLoans("remainingLoan")}>
                    <h2>Remaining</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} />
                        <img src={downChevron} />
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="ratio-wrapper">
                <div className="ratio-title-content" onClick={() => sortLoans("collateralRatio")}>
                    <h2>Ratio</h2>
                    <SortChevronWrapper>
                        <img src={upChevron} />
                        <img src={downChevron} />
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="interest-paid-wrapper">
                <div className="interest-paid-title-content" onClick={() => sortLoans("interestPaid")}>
                    <h2>Interest Paid</h2>
                    <SortChevronWrapper>
                        <img src={upChevron}/>
                        <img src={downChevron}/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="status-wrapper">
                <div className="status-title-content" onClick={() => sortLoans("status")}>
                    <h2>Status</h2>
                    <SortChevronWrapper>
                        <img src={upChevron}/>
                        <img src={downChevron}/>
                    </SortChevronWrapper>
                </div>
            </TableHeadTitle>
            <TableHeadTitle className="head-btns-wrapper">

            </TableHeadTitle>
        </TableHeadWrapper>  
    );
}

export default TableHead;