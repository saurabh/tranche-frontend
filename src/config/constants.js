import DAIicon from 'assets/images/svg/dai.svg';
import USDCicon from 'assets/images/svg/usdc.svg';
import ETHicon from 'assets/images/svg/EthForm.svg';
import JNTicon from 'assets/images/svg/jnt.svg';
import { JLoanEthSetup, JLoanTokenSetup, DAISetup, JPTSetup, USDCSetup } from 'utils/contractConstructor';
export const JLoanTokenDeployerAddress = process.env.REACT_APP_JLoanTokenDeployerAddress;

// Site Banner Data (imported in Header component)
export const PagesData = {
  home: {
    color: '#2c2cdf',
    title: 'Welcome to Jibrel',
    description: 'PLACEHOLDER SLOGAN'
  },
  borrow: {
    pageType: 'borrow',
    color: '#5411e2',
    secondaryColor: '#CEB7FF',
    btnColor: '#EEE5FF',
    cardColor: '#DFD2FB',
    title: 'Borrower Markets',
    description: 'APPLY FOR A COLLATERALIZED LOAN USING YOUR CRYPTOCURRENCY'
  },
  earn: {
    pageType: 'earn',
    color: '#1ebb1b',
    secondaryColor: '#D7FFB7',
    btnColor: '#D7FCD6',
    cardColor: '#D7FFB7',
    title: 'Earning Markets',
    description: 'EARN INTEREST ON YOUR CRYPTOCURRENCY DEPOSITS'
  },
  trade: {
    pageType: 'trade',
    color: '#1f1f1f',
    secondaryColor: '#ffffff',
    btnColor: '#1f1f1f',
    cardColor: 'rgba(0,0,0,0.4)',
    title: 'Trading Markets',
    description: 'BUY & SELL TOKENIZED DERIVATIVES ON ETHEREUM'
  }
};

// pairData[0] is the default option in the loan creation process (value = pairId)
export const pairData = [
  {
    key: 'DAI',
    text: 'DAI',
    value: 0,
    collateral: 'ETH',
    img: DAIicon,
    colIcon: ETHicon,
    lendTokenSetup: DAISetup,
    loanContractSetup: JLoanEthSetup
  },
  {
    key: 'USDC',
    text: 'USDC',
    value: 1,
    collateral: 'JNT',
    img: USDCicon,
    colIcon: JNTicon,
    collateralTokenSetup: JPTSetup,
    lendTokenSetup: USDCSetup,
    loanContractSetup: JLoanTokenSetup
  }
];

export const apiUri = {
  loanList: 'loans'
};

// Filters
export const ETH = 'ETH';
export const DAI = 'DAI';
export const JNT = 'JNT';
export const USDC = 'USDC';

export const statuses = {
  Pending: {
    key: 'Pending',
    status: 0,
    color: '#936CE6',
    background: 'rgba(147, 108, 230, 0.24)'
  },
  Active: {
    key: 'Active',
    status: 1,
    color: '#2ECC71',
    background: 'rgba(46, 204, 113, 0.24)'
  },
  Under_Collateralized: {
    key: 'Under Collateralized',
    status: 2,
    color: '#F2C94C',
    background: 'rgba(242, 201, 76, 0.24)'
  },
  At_Risk: {
    key: 'At Risk',
    status: 3,
    color: '#E67E22',
    background: 'rgba(230, 126, 34, 0.24)'
  },
  Foreclosing: {
    key: 'Foreclosing',
    status: 4,
    color: '#FF5D47',
    background: 'rgba(255, 93, 71, 0.24)'
  },
  Foreclosed: {
    key: 'Foreclosed',
    status: 5,
    color: '#C0392B',
    background: 'rgba(192, 57, 43, 0.24)'
  },
  Early_closing: {
    key: 'Early closing',
    status: 6,
    color: '#41A1FF',
    background: 'rgba(65, 161, 255, 0.24)'
  },
  Closing: {
    key: 'Closing',
    status: 7,
    color: '#0A66E1',
    background: 'rgba(10, 102, 225, 0.24)'
  },
  Closed: {
    key: 'Closed',
    status: 8,
    color: '#234566',
    background: 'rgba(35, 69, 102, 0.24)'
  },
  Cancelled: {
    key: 'Cancelled',
    status: 9,
    color: '#E70D52',
    background: 'rgba(231, 13, 82, 0.24)'
  }
};

