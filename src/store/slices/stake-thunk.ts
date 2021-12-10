import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, TimeTokenContract, MemoTokenContract, StakingContract, BusdTokenContract } from "../../abi";
import DAITokenAbi from "../../abi/tokens/DAIContract.json";
import WLCrowdsaleABI from "../../abi/WLCrowdsaleContract.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";
import { BigNumber } from "ethers";
import { AVAX_TEST_NETWORK, BSC_TEST_NETWORK, FANTOM_TEST_NETWORK, POLYGON_TEST_NETWORK } from "src/constants";
import Web3 from "web3";
interface IChangeApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("stake/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(BSC_TEST_NETWORK);

    const signer = provider.getSigner();

    let tokenAddress;
    let abi;
    if (networkID == BSC_TEST_NETWORK) {
        tokenAddress = addresses.BUSD_ADDRESS;
        abi = BusdTokenContract;
    } else if (networkID == FANTOM_TEST_NETWORK) {
        tokenAddress = addresses.DAI_ADDRESS;
        abi = DAITokenAbi;
    } else if (networkID == AVAX_TEST_NETWORK) {
        tokenAddress = addresses.MIM_ADDRESS;
        abi = DAITokenAbi;
    } else if (networkID == POLYGON_TEST_NETWORK) {
        tokenAddress = addresses.USDC_ADDRESS;
        abi = DAITokenAbi;
    }

    const contract = new ethers.Contract(tokenAddress, abi, signer);
    //const aStarshipContract = new ethers.Contract(addresses.ASTARSHIP_ADDRESS, aStarshipContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "BUSD") {
            approveTx = await contract.approve(addresses.WL_PRESALE_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }
        //Three next lines needs a refractor
        const text = "Approve " + (token === "time" ? "Staking" : "Unstaking");
        const pendingTxnType = token === "time" ? "approve_staking" : "approve_unstaking";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const busdAllowance = await contract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    //const starshipAllowance = await aStarshipContract.allowance(address, addresses.STAKING_ADDRESS);

    //const stakeAllowance = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    //const unstakeAllowance = await memoContract.allowance(address, addresses.STAKING_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            staking: {
                busd: Number(busdAllowance),
                //timeStake: Number(stakeAllowance),
                //memoUnstake: Number(unstakeAllowance),
            },
        }),
    );
});

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

//This function needs a refractor
export const changeStake = createAsyncThunk("stake/changeStake", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(BSC_TEST_NETWORK);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(addresses.WL_PRESALE_ADDRESS, WLCrowdsaleABI, signer);
    //const stakingHelper = new ethers.Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer);

    let buyTx;

    try {
        const gasPrice = await getGasPrice(provider);

        /*if (action === "stake") {
            stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"), address, { gasPrice });
        } else {
            stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true, { gasPrice });
        }*/
        //const valueInt = (parseInt(value) * 10 ** 18).toString();
        //const valueBN = BigNumber.from(value);
        //const valueBNwei = valueBN.mul(1000000000000000000);
        //ethers.utils.formatUnits(value, "ether")
        //const valueInt = (parseInt(value) * 10 ** 18).toString();
        //console.log("VALUE : " + Web3.utils.toWei(value, "ether"));
        const valueWei = value + "000000000000000000";
        buyTx = await contract.buyTokens(address, valueWei, { gasPrice });

        const pendingTxnType = action === "stake" ? "staking" : "unstaking";
        dispatch(fetchPendingTxns({ txnHash: buyTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await buyTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (buyTx) {
            dispatch(clearPendingTxn(buyTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
