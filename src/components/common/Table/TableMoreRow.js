import React from "react";

const TableMoreRow = ({ethImg, arrow}) => {
    return (
        <div className="table-more-row">
            <div className="table-more-row-first table-more-row-content">
                <div className="table-more-row-first-img">
                    <img src={ethImg} alt=""/>
                    <span className={arrow}></span>
                </div>
                <div className="table-more-row-first-content">
                    <h2>apr 15, 2020 - 1:53 pm</h2>
                </div>
            </div>
            <div className="table-more-row-second table-more-second-3 table-more-row-content">
                <h2>12.85 <span>DAI</span></h2>
            </div>
            <div className="table-more-row-third table-more-second-3 table-more-row-content">
                <h2>259%</h2>
            </div>
            <div className="table-more-row-fourth table-more-second-3 table-more-row-content">
                <h2>0.310 <span>ETH</span></h2>
            </div>
            <div className="table-more-row-fifth table-more-second-3 table-more-row-content">
                
            </div>
        </div>            
    );
}

export default TableMoreRow;