// Site Banner Data (imported in Header component)
export const HeaderData = {
  home: {
    color: '#2c2cdf',
    title: 'Welcome to Jibrel',
    description: 'PLACEHOLDER SLOGAN'
  },
  borrow: {
    color: '#5411e2',
    title: 'Borrower Markets',
    description: 'APPLY FOR A COLLATERALIZED LOAN USING YOUR CRYPTOCURRENCY'
  },
  earn: {
    color: '#1ebb1b',
    title: 'Earning Markets',
    description: 'EARN INTEREST ON YOUR CRYPTOCURRENCY DEPOSITS'
  },
  trade: {
    color: '#1f1f1f',
    title: 'Trading Markets',
    description: 'BUY & SELL TOKENIZED DERIVATIVES ON ETHEREUM'
  }
};

// Borrow Assets (The types of stableCoins that can be borrowed against collateral)
export const assets = [
  { key: 'DAI', text: 'DAI', value: 0, collateral: 'ETH' }, // value = pairId
  { key: 'USDC', text: 'USDC', value: 1, collateral: 'JPT' },
];

export const serverUrl = 'http://13.127.123.245/api/v1/';

export const etherScanUrl = 'https://kovan.etherscan.io/address/';
export const NA = 'N/A';

export const pageType = {
  BORROW: 'borrow',
  EARN: 'earn',
  TRADE: 'trade'
};

export const apiUri = {
  loanList: 'loans'
};
// Filters
export const ETH = 'ETH';
export const JNT = 'JNT';

export const statuses =  {
  0: "Pending",
  1: "Active",
  2: "Under Collateralized",
  3: "At Risk",
  4: "Foreclosing",
  5: "Foreclosed",
  6: "Closing",
  7: "Closed",
  8: "Cancelled"
};

