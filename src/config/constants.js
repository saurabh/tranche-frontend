// Contract Addresses

// const JLoansEthDeployerAddress = '0xE6d3E2A19c1a1B61E26982fdFa081a9Fbf68a010';
// const JLoansTokenDeployerAddress = '0x281Fc9c46b06440e3D4aF8Ef50Dfb4576fD64E4f';
// const JFeesCollectorAddress = '0x4d116D767222cc1424a17D5C41C769eAD95E1BF4';
export const JFactoryAddress = "0x78cf587217A3C4f0cFA30598AC34DDD4C20Bf69A";

//

// Links

// Borrow Assets (The types of stableCoins that can be borrowed against collateral)
export const assets = [
  { key: "DAI", text: "DAI", value: 0, collateral: "ETH" }, // value = pairId
  { key: "USDC", text: "USDC", value: 1, collateral: "JPT" },
];

export const serverUrl = "http://13.127.123.245/api/v1/";

export const apiUri = {
  loanList: "loans",
};
