import { JFactorySetup } from 'utils/contractConstructor';
import { web3 } from 'utils/getWeb3';
import { pairData } from 'config/constants';
const JFactory = JFactorySetup(web3);
const searchArr = (collateral) => pairData.find((i) => i.collateral === collateral);

export const toWei = web3.utils.toWei;
export const fromWei = web3.utils.fromWei;

export const calcMinCollateralAmount = async (pairId, askAmount) => {
  try {
    const result = await JFactory.methods
      .calcMinCollateralWithFeesAmount(pairId, web3.utils.toWei(askAmount))
      .call();
    return web3.utils.fromWei(result);
  } catch (error) {
    console.error(error);
  }
};

export const getPairDetails = async (pairId) => {
  try {
    const result = await JFactory.methods.pairs(pairId).call();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const calcAdjustCollateralRatio = async (
  collateralTypeName,
  contractAddress,
  amount,
  actionType
) => {
  try {
    const { loanContractSetup } = searchArr(collateralTypeName);
    const JLoan = loanContractSetup(web3, contractAddress);
    const result = await JLoan.methods
      .calcRatioAdjustingCollateral(toWei(amount), actionType)
      .call();
    return result;
  } catch (error) {
    console.error(error);
  }
};
