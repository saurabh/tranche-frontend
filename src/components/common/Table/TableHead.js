import React from "react";
import styled from 'styled-components';

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
    & > h2{
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: rgba(56, 56, 56, 0.3);
    }
`;

const TableHead = () => {
    return (
        <TableHeadWrapper>
            <TableHeadTitle className="address-wrapper">
                <h2>Address</h2>
            </TableHeadTitle>
            <TableHeadTitle className="remaining-wrapper">
                <h2>Remaining</h2>
            </TableHeadTitle>
            <TableHeadTitle className="ratio-wrapper">
                <h2>Ratio</h2>
            </TableHeadTitle>
            <TableHeadTitle className="interest-paid-wrapper">
                <h2>Interest Paid</h2>
            </TableHeadTitle>
            <TableHeadTitle className="status-wrapper">
                <h2>Status</h2>
            </TableHeadTitle>
            <TableHeadTitle className="head-btns-wrapper">

            </TableHeadTitle>
        </TableHeadWrapper>  
    );
}

export default TableHead;