import React from 'react';
import {
  TableMoreRowWrapper,
  TableMoreRowContent,
  TableMoreRowContentLeft,
  TableMoreRowContentRight,
  TableMoreLeftSection
} from '../../Stake/Table/styles/TableComponents';
import {
  BtnArrow
} from 'assets';
const TableMoreRow = () => {

  return (
    <TableMoreRowWrapper className='table-more-row'>
      <TableMoreRowContent>
        <TableMoreRowContentLeft>
          <TableMoreLeftSection>
            <h2>deposit</h2>
            <h2>balance: 103,123 DAI</h2>
            <form>
              <div>
                <input type="number" />
                <button>max</button>
              </div>
              <button type="submit"><img src={BtnArrow} alt="arrow" />deposit</button>
            </form>
          </TableMoreLeftSection>
          <TableMoreLeftSection withdraw>
            <h2>withdraw</h2>
            <h2>balance: 3,528 TACDAI</h2>
            <form>
              <div>
                <input type="number" />
                <button>max</button>
              </div>
              <button type="submit"><img src={BtnArrow} alt="arrow" />withdraw</button>
            </form>
          </TableMoreLeftSection>
        </TableMoreRowContentLeft>
        <TableMoreRowContentRight>

        </TableMoreRowContentRight>
      </TableMoreRowContent>
    </TableMoreRowWrapper>
  );
};

export default TableMoreRow;