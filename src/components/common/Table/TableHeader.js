import React from "react";
import Create from "../../../assets/images/svg/create.svg";
import styled from 'styled-components';

const TableContainerHeader = styled.div`
    min-height: 71px;
    padding: 0 31px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const TableTitle = styled.div`
    & > h2{
        font-family: "Roboto", sans-serif;
        font-style: normal;
        text-transform: uppercase;
        font-weight: 400;
        font-size: 18px;
        color: #292929;   
    }
`;
const TableSubTitle = styled.div`
    & > h2{
        font-family: "Roboto", sans-serif;
        font-style: normal;
        text-transform: uppercase;
        font-weight: 400;
        font-size: 10px;
        color: #292929;
    }
`;
const CreateLoadBtn = styled.div`
    & > button{
        background-color: transparent;
        border: none;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        text-transform: uppercase;
        cursor: pointer;
        color: #39295A;
        &:focus{
            outline: none;
        }
        & > img{
            margin-bottom: -1px;
            pointer-events: none;
        }
    }
`;
const TableHeader = ({HandleNewLoan}) => {
    return (
        <TableContainerHeader>
            <div className="table-header-titles">
                <TableTitle>
                    <h2>Open Loans</h2>
                </TableTitle>
                <TableSubTitle>
                    <h2>All Markets</h2>
                </TableSubTitle>
            </div>

            <div className="create-loan-wrapper">
                <CreateLoadBtn>
                    <button onClick={HandleNewLoan}><img src={Create} alt="Create"/> <span>New loan</span></button>
                </CreateLoadBtn>
            </div>
        </TableContainerHeader>
    );
}

export default TableHeader;