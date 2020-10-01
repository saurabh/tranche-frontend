// Contract Addresses
export const networkId = 42;
export const JFactoryAddress = '0x50df4D94dFA062535F43872edFCaCa06C91EE785';
export const DaiAddress = '0xc707fd5a456eec2609463f7fea79756356f0a754';
// const JLoansEthDeployerAddress = '0xe995B45c65FFd82b1330ee5be95417436026122c';
// const JLoansTokenDeployerAddress = '0x170c5176204035C0A1f79475b13f811e5C39Fd8e';
// const JFeesCollectorAddress = '0x7dda219A696DE925fF017A00905C3DBF654D1D99';

// API Keys
export const blocknativeKey = '71c3eafc-6ae2-4fe9-863c-6c87ec604798';
export const infuraKey = 'b036e8717e624f5c826fdb9205e391d2';

// Links

// Borrow Assets (The types of stableCoins that can be borrowed against collateral)
export const assets = [
  { key: 'DAI', text: 'DAI', value: 0, collateral: 'ETH' }, // value = pairId
  { key: 'USDC', text: 'USDC', value: 1, collateral: 'JPT' }
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