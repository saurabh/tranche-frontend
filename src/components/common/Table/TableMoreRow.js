import React from "react";
import { LinkArrow } from 'assets';
import {etherScanUrl } from 'config/constants';
import { statuses } from 'config/constants';
import { addrShortener } from 'utils';

const TableMoreRow = ({ethImg, arrow, ratio, hash, collateralTypeName, interest, status, createdAt}) => {
    
    const searchObj = (val) =>{
        return Object.fromEntries(
          Object.entries(statuses).filter(([key, value]) => value.status === val)
        );
    }
    return (
        <div className="table-more-row">
            <div className="table-more-row-first table-more-row-content">
                {/*<div className="table-more-row-first-img">
                    <img src={ethImg} alt=""/>
                    <span className={arrow}></span>
                </div>*/}
                <div className="table-more-row-first-content">
                   {/* <h2>apr 15, 2020 - 1:53 pm</h2>*/}
                    <h2>{createdAt}</h2>
                    <a
                        href={etherScanUrl + hash + '/#internaltx'}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                    <img src={LinkArrow} alt='' />
                    </a>
                </div>
            </div>
            <div className="table-more-row-second table-more-second-4 table-more-row-content">
                {/*<h2>12.85 <span>DAI</span></h2>*/}
            </div>
            <div className="table-more-row-third table-more-second-4 table-more-row-content">
                <div className="table-more-row-third-content">
                    <h2>{ratio}%</h2>
                </div>
            </div>
            <div className="table-more-row-fourth table-more-second-4 table-more-row-content">
                <div className="table-more-row-fourth-content">
                    <h2>{interest} <span>{collateralTypeName}</span></h2>
                </div>
            </div>
            <div className="table-more-row-fifth table-more-second-4 table-more-row-content">
                {/*<div className="table-more-row-fifth-content">
                    <span
                        style={{
                            color: Object.values(searchObj(parseInt(status)))[0].color
                        }}
                    >•</span>
                    <h2>Loan Status</h2>
                </div>*/}
            </div>
            <div className="table-more-row-sixth table-more-second-4 table-more-row-content">
                
            </div>
        </div>            
    );
}

export default TableMoreRow;