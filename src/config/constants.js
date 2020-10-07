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

export const serverUrl = 'https://13.127.123.245/api/v1/';

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
export const DAI = 'DAI';
export const JNT = 'JNT';
export const USDC = 'USDC';

export const statuses =  {
  0: {
    status: "Pending",
    color: "#936CE6",
    background: "rgba(147, 108, 230, 0.24)"
  },
  1: {
    status: "Active",
    color: "#2ECC71",
    background: "rgba(46, 204, 113, 0.24)"
  },
  2: {
    status: "Under Collateralized",
    color: "#F2C94C",
    background: "rgba(242, 201, 76, 0.24)"
  },
  3: {
    status: "At Risk",
    color: "#E67E22",
    background: "rgba(230, 126, 34, 0.24)"
  },
  4: {
    status: "Foreclosing",
    color: "#FF5D47",
    background: "rgba(255, 93, 71, 0.24)"
  },
  5: {
    status: "Foreclosed",
    color: "#C0392B",
    background: "rgba(192, 57, 43, 0.24)"
  },
  6: {
    status: "Closing",
    color: "#0A66E1",
    background: "rgba(10, 102, 225, 0.24)"
  },
  7: {
    status: "Closed",
    color: "#234566",
    background: "rgba(35, 69, 102, 0.24)"
  },
  8: {
    status: "Cancelled",
    color: "#E70D52",
    background: "rgba(231, 13, 82, 0.24)"
  }
};
export const ColorData = {
  borrow: {
    color: '#5411e2',
    secondaryColor: "#CEB7FF",
    btnColor: "#EEE5FF",
    cardColor: "#DFD2FB"
  },
  earn: {
    color: '#1ebb1b',
    secondaryColor: "#D7FFB7",
    btnColor: "#D7FCD6",
    cardColor: "#D7FFB7"    
  },
  trade: {
    color: '#1f1f1f',
    secondaryColor: "#ffffff",
    btnColor: "#1f1f1f",
    cardColor: "rgba(0,0,0,0.4)"
  }
};