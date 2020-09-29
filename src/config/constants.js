// Contract Addresses
export const networkId = 42;
export const JFactoryAddress = '0x50df4D94dFA062535F43872edFCaCa06C91EE785';
export const KovanDaiAddress = '0xc707fd5a456eec2609463f7fea79756356f0a754';
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
