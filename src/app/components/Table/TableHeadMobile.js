
import React, { useState } from "react";
import { connect } from 'react-redux';
import { changeSorting } from 'redux/actions/loans';
import {
    TableColMobile,
    TableHeadWrapperMobile,
    TableHeadTitleMobile
} from './styles/TableComponents';


const TableHeadMobile = ({changeSorting, loans: {sort}, path}) => {

    const [order, setOrder] = useState("asc")
    const sortLoans = (val) => {
    let sortObj = {
        name: val,
        type: order
    };
    changeSorting(sortObj);
        setOrder(order === "asc" ? "desc" : "asc")
    }
    return (
        <TableHeadWrapperMobile path={path}>
            <TableColMobile address>
                <TableHeadTitleMobile defaultCursor={true} address>
                    <h2>Address</h2>
                </TableHeadTitleMobile>
            </TableColMobile>
            <TableColMobile>
                <TableHeadTitleMobile>
                    <h2 onClick={() => sortLoans("remainingLoan")}>Amount</h2>
                </TableHeadTitleMobile>
            </TableColMobile>
            <TableColMobile>
                <TableHeadTitleMobile>
                    <h2 onClick={() => sortLoans("remainingLoan")}>Ratio</h2>
                </TableHeadTitleMobile>
            </TableColMobile>
            <TableColMobile>
                <TableHeadTitleMobile>
                    <h2 onClick={() => sortLoans("interestPaid")}>Return</h2>
                </TableHeadTitleMobile>
            </TableColMobile>
            <TableColMobile btn>
                <TableHeadTitleMobile>

                </TableHeadTitleMobile>
            </TableColMobile>
        </TableHeadWrapperMobile>  
    );
}
const mapStateToProps = (state) => {
    return {
      loans: state.loans,
      path: state.path
    };
  };
  
export default connect(mapStateToProps, {
    changeSorting
})(TableHeadMobile);