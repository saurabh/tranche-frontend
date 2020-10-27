import { JFactorySetup } from 'utils/contractConstructor';
import { web3 } from 'utils/getWeb3';
const JFactory = JFactorySetup(web3);

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

export const calcMaxBorrowedAmount = async (pairId, collAmount) => {
  try {
    const result = await JFactory.methods
      .calcMaxStableCoinWithFeesAmount(pairId, web3.utils.toWei(collAmount))
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
}