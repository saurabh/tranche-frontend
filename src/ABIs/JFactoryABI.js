export const JFactoryABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_ethDepl",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenDepl",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "loanId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newLoan",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "collateralTokenAddress",
				"type": "address"
			}
		],
		"name": "NewEthLoanCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_pairName",
				"type": "string"
			}
		],
		"name": "NewPair",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "pairId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "pairName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "baseAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "quoteAddress",
				"type": "address"
			}
		],
		"name": "NewPairAddresses",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "pairId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "pairName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "baseDecimals",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "quoteDecimals",
				"type": "uint8"
			}
		],
		"name": "NewPairDecimals",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "pairId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "string",
				"name": "pairName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pairValue",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "pairDecimals",
				"type": "uint8"
			}
		],
		"name": "NewPrice",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ZERO_ADDRESS",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_collAmount",
				"type": "uint256"
			}
		],
		"name": "calcMaxStableCoinAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_collAmount",
				"type": "uint256"
			}
		],
		"name": "calcMaxStableCoinWithFeesAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_askAmount",
				"type": "uint256"
			}
		],
		"name": "calcMinCollateralAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_askAmount",
				"type": "uint256"
			}
		],
		"name": "calcMinCollateralWithFeesAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_collAmount",
				"type": "uint256"
			}
		],
		"name": "calculateCollFeesOnDeploy",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_borrowedAskAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_rpbRate",
				"type": "uint256"
			}
		],
		"name": "createNewEthLoan",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_borrowedAskAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_rpbRate",
				"type": "uint256"
			}
		],
		"name": "createNewTokenLoan",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ethDeplContract",
		"outputs": [
			{
				"internalType": "contract IJLoanEthDeployer",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factoryDeployBlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "generalFees",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "factoryFees",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "userRewardShare",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "vaultShare",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "undercollateralizedForeclosingMultiple",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "atRiskForeclosedMultiple",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "cancellationFees",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "generalParams",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "minRpbRate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "earlySettlementWindow",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "foreclosureWindow",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "requiredCollateralRatio",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "foreclosingRatio",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "instantForeclosureRatio",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "earlySettlementFee",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "factoryAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "ethDeployerAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenDeployerAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_idx",
				"type": "uint256"
			}
		],
		"name": "getDeployedLoan",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getEnvironmentDeployers",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGeneralFees",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "factoryFees",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "userRewardShare",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "vaultShare",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "undercollateralizedForeclosingMultiple",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "atRiskForeclosedMultiple",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "cancellationFees",
						"type": "uint256"
					}
				],
				"internalType": "struct IJLoanCommons.feesParams",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGeneralParams",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "minRpbRate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "earlySettlementWindow",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "foreclosureWindow",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "requiredCollateralRatio",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "foreclosingRatio",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "instantForeclosureRatio",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "earlySettlementFee",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "factoryAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "ethDeployerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "tokenDeployerAddress",
						"type": "address"
					}
				],
				"internalType": "struct IJLoanCommons.params",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			}
		],
		"name": "getPairBaseDecimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			}
		],
		"name": "getPairDecimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			}
		],
		"name": "getPairName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			}
		],
		"name": "getPairQuoteDecimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			}
		],
		"name": "getPairValue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastDepositBlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "loanID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pairCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "pairs",
		"outputs": [
			{
				"internalType": "string",
				"name": "pairName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "pairValue",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "pairDecimals",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "baseAddress",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "baseDecimals",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "quoteAddress",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "quoteDecimals",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "numerator",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "denominator",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "precision",
				"type": "uint256"
			}
		],
		"name": "roundDn",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "numerator",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "denominator",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "precision",
				"type": "uint256"
			}
		],
		"name": "roundUp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setAtRiskForeclosedMultiple",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_baseAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_quoteAddress",
				"type": "address"
			}
		],
		"name": "setBaseQuoteAddresses",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_baseDecimals",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_quoteDecimals",
				"type": "uint8"
			}
		],
		"name": "setBaseQuoteDecimals",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setCancellationFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setEarlySettlementFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setEarlySettlementWindow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_ethDepl",
				"type": "address"
			}
		],
		"name": "setEthDeployerAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setFactoryFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setForeclosureRatio",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setForeclosureWindow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setInstantForeclosureRatio",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setMinRpbRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_pairName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_pairDecimals",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "_baseAddress",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "_baseDecimals",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "_quoteAddress",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "_quoteDecimals",
				"type": "uint8"
			}
		],
		"name": "setNewPair",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pairId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_pairDecimals",
				"type": "uint8"
			}
		],
		"name": "setPairValue",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setRequiredCollateralRatio",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenDepl",
				"type": "address"
			}
		],
		"name": "setTokenDeployerAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setUndercollateralizedForeclosingMultiple",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setUserRewardShare",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "setVaultShares",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenDeplContract",
		"outputs": [
			{
				"internalType": "contract IJLoanTokenDeployer",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
