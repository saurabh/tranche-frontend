import { Key, Agree, DaiLogo as DAIicon, ETH as ETHicon, SLICE as SLICEicon } from 'assets';
// import { Key, Agree, DaiLogo as DAIicon, USDC as USDCicon, ETH as ETHicon, SLICE as SLICEicon } from 'assets';
// import { networks as StakingNetworks } from 'build/contracts/StakingMilestones.json';
import { DAISetup } from 'utils/contractConstructor';

// exporting .env variables
export const serverUrl = process.env.REACT_APP_SERVER_URL;
export const etherScanUrl = process.env.REACT_APP_ETHERSCAN_URL;
export const blocknativeKey = process.env.REACT_APP_BLOCKNATIVE_KEY;
export const infuraKey = process.env.REACT_APP_INFURA_KEY;
export const alchemyHttpUrl = process.env.REACT_APP_ALCHEMY_HTTP_URL;
export const alchemyWebSocketsUrl = process.env.REACT_APP_ALCHEMY_WEBSOCKETS_URL;
export const infuraWebSocketsUrl = process.env.REACT_APP_INFURA_WEBSOCKETS_URL;
export const networkId = parseInt(process.env.REACT_APP_NETWORK_ID);
export const PriceOracleAddress = process.env.REACT_APP_PRICE_ORACLE;
export const LoanContractAddress = process.env.REACT_APP_LOAN_ADDRESS;
export const ProtocolAddress = process.env.REACT_APP_PROTOCOL_ADDRESS;
export const StakingAddress = process.env.REACT_APP_STAKING_ADDRESS.split(',');
export const ETHDAITrancheAAddress = process.env.REACT_APP_TRANCHE_A_ADDRESS;
export const ETHDAITrancheBAddress = process.env.REACT_APP_TRANCHE_B_ADDRESS;
export const DAIAddress = process.env.REACT_APP_DAI_ADDRESS.toLowerCase();
export const SLICEAddress = process.env.REACT_APP_SLICE_ADDRESS.toLowerCase();
export const USDCAddress = process.env.REACT_APP_USDC_ADDRESS.toLowerCase();
export const LP1TokenAddress = process.env.REACT_APP_SLICE_LP1_ADDRESS.toLowerCase();
export const LP2TokenAddress = process.env.REACT_APP_SLICE_LP2_ADDRESS.toLowerCase();

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
    description: 'APPLY FOR A COLLATERALIZED LOAN USING YOUR CRYPTOCURRENCY',
    userTag: {
      color: '#5411e2',
      img: Key
    }
  },
  lend: {
    pageType: 'lend',
    color: '#1ebb1b',
    secondaryColor: '#D7FFB7',
    btnColor: '#D7FCD6',
    cardColor: '#D7FFB7',
    title: 'Lending Markets',
    description: 'LEND STABLE COINS TO RECEIVE CRYPTOCURRENCY RETURNS',
    userTag: {
      color: '#1ebb1b',
      img: Agree
    }
  },
  earn: {
    pageType: 'earn',
    color: 'rgba(0, 0, 0, 0.8)',
    secondaryColor: '#ffffff',
    btnColor: '#1f1f1f',
    cardColor: 'rgba(0, 0, 0, 0.8)',
    title: 'Earning Markets',
    description: 'DEPOSIT STABLE COINS FOR DIFFERENT RETURNS'
  },
  stake: {
    pageType: 'stake',
    color: '#0071F5',
    secondaryColor: '#ffffff',
    btnColor: '#BCD9FB',
    cardColor: '#6EAEFA',
    title: 'Staking Pools',
    description: 'stake cryptocurrency for slice rewards'
  },
  privacy: {
    pageType: 'privacy',
    color: '#006173',
    secondaryColor: '#7EABC8',
    btnColor: '#EEE5FF',
    cardColor: '#DFD2FB',
    title: 'Privacy Policy',
    description: ''
  },
  terms: {
    pageType: 'terms-and-conditions',
    color: '#006173',
    secondaryColor: '#7EABC8',
    btnColor: '#EEE5FF',
    cardColor: '#DFD2FB',
    title: 'Terms and Conditions',
    description: ''
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
    lendTokenSetup: DAISetup
  },
  {
    key: 'SLICE',
    text: 'SLICE',
    value: 1,
    collateral: 'SLICE',
    img: SLICEicon,
    colIcon: SLICEicon,
    // collateralTokenSetup: SLICESetup,
    // lendTokenSetup: SLICESetup
  }
    // {
  //   key: 'USDC',
  //   text: 'USDC',
  //   value: 1,
  //   collateral: 'SLICE',
  //   img: USDCicon,
  //   colIcon: SLICEicon,
  //   collateralTokenSetup: SLICESetup,
  //   lendTokenSetup: USDCSetup
  // }
];

export const gweiVariants = ['Gwei', 'nSLICE', 'nDAI', 'nUSDC'];

export const trancheData = [
  { address: ETHDAITrancheAAddress.toLowerCase() },
  { address: ETHDAITrancheBAddress.toLowerCase() }
];

export const apiUri = {
  priceFeed: 'pairs',
  loanList: 'loans',
  tranchesList: 'earn',
  stakingList: 'staking',
  transaction: 'loans/transaction',
  summaryRatio: 'summary/ratio',
  summaryCollateral: 'summary/collateral',
  summaryLoan: 'summary/loan',
  stakingSummaryDetail: 'staking/detail/',
  stakingSummary: 'staking/summary/'
};

// Filters
export const ETH = 'ETH';
export const DAI = 'DAI';
export const SLICE = 'SLICE';
export const USDC = 'USDC';

export const blocksPerYear = 2372500;
export const factoryFees = 5;

export const generalParams = {
  limitCollRatioForWithdraw: 160
};

export const actionTypes = {
  Cancel: {
    name: 'Cancel',
    confirmationText: 'Are you sure you want to cancel the loan request?'
  },
  Close: {
    name: 'Close',
    confirmationText: 'Are you sure you want to close the loan?'
  },
  Approve: {
    name: 'Approve',
    confirmationText: 'Are you sure you want to accept this loan?'
  },
  WithdrawInterest: {
    name: 'WithdrawInterest',
    confirmationText: 'Are you sure you want to withdraw interest?'
  },
  Foreclose: {
    name: 'Foreclose',
    confirmationText: 'Are you sure you want to foreclose this loan?'
  }
};

export const events = {
  COLLATERAL_RECEIVED: 'collateralreceived',
  LOAN_CREATED: 'loancreated',
  NEW_LOAN_STATUS: 'loanstatuschanged',
  APPROVE_LOAN: 'lenderaccepted',
  LOAN_CLOSING_BORROWER: 'loanclosingbyborrower',
  FORECLOSING: 'loanforeclosing',
  FORECLOSED: 'loanforeclosed',
  LOAN_CANCEL: 'loancancelled',
  INTEREST_WITHDRAWN: 'interestswithdrawed',
  REMOVE_COLLATERAL: 'withdrawcollateral',
  APPROVE_LOAN_FEES: 'approve_loan_fees',
  INITIATE_FORECLOSE_FEES: 'initiate_foreclose_fees',
  FORECLOSED_FEES: 'foreclosed_fees',
  EARLY_CLOSING_FEES: 'early_closing_fees',
  LOAN_CANCEL_FEES: 'loan_cancel_fees',
  INITIATE_FORECLOSE_REWARD: 'initiate_foreclose_reward',
  FORECLOSED_REWARD: 'foreclosed_reward',
  TRANCHE_ADDED: 'soldtoprotocol'
};

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
