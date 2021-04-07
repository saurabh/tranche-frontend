import {
  Key,
  Agree,
  DaiLogo,
  ETH as ETHicon,
  SLICE as SLICEicon,
  TrancheClaim,
  DaiClaim,
  EthClaim,
  AAVE,
  CompoundLogo,
  DAITrancheTable,
} from 'assets';
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
// Tranche
export const TrancheBuyerCoinAddresses = process.env.REACT_APP_BUYER_COIN_ADDRESS.split(',');
export const ProtocolAddress = process.env.REACT_APP_PROTOCOL_ADDRESS;
export const JCompoundAddress = process.env.REACT_APP_COMPOUND_TRANCHE_ADDRESS;
// Staking
export const StakingAddresses = process.env.REACT_APP_STAKING_ADDRESS.split(',');
export const YieldAddresses = process.env.REACT_APP_STAKING_YIELD_ADDRESS.split(',');
export const epochDuration = process.env.REACT_APP_EPOCH_DURATION;
// Token Addresses
export const zeroAddress = '0x0000000000000000000000000000000000000000';
export const DAIAddress = process.env.REACT_APP_DAI_ADDRESS.toLowerCase();
export const SLICEAddress = process.env.REACT_APP_SLICE_ADDRESS.toLowerCase();
export const LP1TokenAddress = process.env.REACT_APP_SLICE_LP1_ADDRESS.toLowerCase();
export const LP2TokenAddress = process.env.REACT_APP_SLICE_LP2_ADDRESS.toLowerCase();

export const ApproveBigNumber = '100000000000000';

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
  tranche: {
    pageType: 'tranche',
    color: 'rgba(0, 0, 0, 0.8)',
    secondaryColor: '#ffffff',
    btnColor: '#4441CF',
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

export const trancheIcons = {
  ACDAI: { protocolIcon: CompoundLogo, assetIcon: DAITrancheTable },
  BCDAI: { protocolIcon: CompoundLogo, assetIcon: DAITrancheTable },
  ACUSDC: { protocolIcon: CompoundLogo, assetIcon: ETHicon },
  BCUSDC: { protocolIcon: CompoundLogo, assetIcon: ETHicon },
  AADAI: { protocolIcon: AAVE, assetIcon: DaiLogo },
  BADAI: { protocolIcon: AAVE, assetIcon: DaiLogo },
  AAETH: { protocolIcon: AAVE, assetIcon: ETHicon },
  BAETH: { protocolIcon: AAVE, assetIcon: ETHicon }
};

// pairData[0] is the default option in the loan creation process (value = pairId)
export const pairData = [
  {
    key: 'DAI',
    text: 'DAI',
    value: 0,
    collateral: 'ETH',
    img: DaiLogo,
    colIcon: ETHicon,
    lendTokenSetup: DAISetup
  },
  {
    key: 'SLICE',
    text: 'SLICE',
    value: 1,
    collateral: 'SLICE',
    img: SLICEicon,
    colIcon: SLICEicon
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

export const apiUri = {
  priceFeed: 'pairs',
  loanList: 'loans',
  transaction: 'loans/transaction',
  summaryLoan: 'summary/loan',
  summaryRatio: 'summary/ratio',
  summaryCollateral: 'summary/collateral',
  stakingList: 'staking',
  stakingSummaryDetail: 'staking/detail/',
  stakingSummary: 'staking/summary/',
  sliceSummary: 'slice/summary',
  tranchesList: 'earn',
  totalValueLocked: 'earn/summary/total',
  graphUri: 'earn/graph/apy?'
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

export const pairLogos = {
  SLICE: TrancheClaim,
  'SLICE/ETH LP': EthClaim,
  'SLICE/DAI LP': DaiClaim
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
    background: '#DDFFEB'
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
export const ModeThemes = {
  light: {
      body: "#F9F9FE",
      navlinkTab: "rgb(68, 65, 207)",
      HeaderTitle: "#393F56",
      HeaderSubtitle: "#9496B6",
      TableHead: "rgba(36, 39, 50, 0.6)",
      TableCard: "#FFFFFF",
      TableCardBorderColor: "#F0F0F7",
      footerBackground: "#F6F6FC",
      footerLinks: "#AAA8E9",
      languageToggleBackground: "rgba(68,65,207,0.1)",
      languageToggleText: "#4441CF",
      activeStatus: "#DDFFEB",
      activeStatusText: "#2ECC71",
      tableText: "#39295A",
      tableCardShadow: "0px 4px 4px rgb(189 189 189 / 7%)",
      dropDownBorder: "#F9F9FB",
      dropDownText: "#39295A",
      inputBackground: "rgb(255, 255, 255)",
      inputDisabledBackground: "rgba(207,207,229,0.2)",
      borderColor: "#EFEFEF",
      backgroundBorder: "#CCCCCD",
      titleSectionText: "rgba(124, 133, 155, 0.8)",
      valueSectionText: "#393F56",
      titleColor: "#393F56",
      textColor: "#7C859B"
  },
  dark: {
      body: "#100F36",
      navlinkTab: "#FFFFFF",
      HeaderTitle: "#FFFFFF",
      HeaderSubtitle: "#C2C4DA",
      TableHead: "rgba(255, 255, 255, 0.6)",
      TableCard: "rgba(255, 255, 255, 0.07)",
      TableCardBorderColor: "#363661",
      footerBackground: "#07052F",
      footerLinks: "rgba(255, 255, 255, 0.6)",
      languageToggleBackground: "rgba(134, 132, 255, 0.25)",
      languageToggleText: "#FFFFFF",
      activeStatus: "rgba(46, 204, 113, 0.9)",
      activeStatusText: "#FFFFFF",
      tableText: "#FFFFFF",
      tableCardShadow: "",
      dropDownBorder: "#363661",
      dropDownText: "#FFFFFF",
      inputBackground: "rgba(255, 255, 255, 0.5)",
      inputDisabledBackground: "transparent",
      borderColor: "rgba(204, 204, 205, 0.15)",
      backgroundBorder: "rgba(204, 204, 205, 0.15)",
      titleSectionText: "rgba(255, 255, 255, 0.8);",
      valueSectionText: "#FFFFFF",
      titleColor: "#FFFFFF",
      textColor: "#C2C4DA"
  }
}