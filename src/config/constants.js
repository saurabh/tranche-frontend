// Contract Addresses
export const networkId = 42;
export const JFactoryAddress = "0x661e18a7c860AF1E4C06CF69C0913B2b97557B8A";
// const JLoansEthDeployerAddress = '0x3235ecc38526131d08d534549fe95eda19f92903';
// const JLoansTokenDeployerAddress = '0x21B13aF2F0892a1285DB54b3A2669D79990C9c40';
// const JFeesCollectorAddress = '0xa9ddC40652C4d069d812862B97444F2BA6bd9736';

// API Keys
export const blocknativeKey = '71c3eafc-6ae2-4fe9-863c-6c87ec604798';
export const infuraKey = 'b036e8717e624f5c826fdb9205e391d2';

// Links

// Borrow Assets (The types of stableCoins that can be borrowed against collateral)
export const assets = [
  { key: "DAI", text: "DAI", value: 0, collateral: "ETH" }, // value = pairId
  { key: "USDC", text: "USDC", value: 1, collateral: "JPT" },
];

export const serverUrl = "http://localhost:4000/api/v1/";

export const etherScanUrl = "https://kovan.etherscan.io/address/";
export const NA = "N/A";

export const pageType = {
  BORROW: "borrow",
  EARN: "earn",
  TRADE: "trade",
};

export const apiUri = {
  loanList: "loans",
};
