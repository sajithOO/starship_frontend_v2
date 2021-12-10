import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { TimeTokenContract, MemoTokenContract, MimTokenContract, wMemoTokenContract, BusdTokenContract } from "../../abi";
import { setAll } from "../../helpers";
import { BSC_TEST_NETWORK } from "../../constants";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond } from "../../helpers/bond/bond";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";
import { IToken } from "../../helpers/tokens";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        //Ours
        busd: string;
        //Not Ours
        //TODO must remove
        memo: string;
        time: string;
        wmemo: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    //Ours
    const busdContract = new ethers.Contract(addresses.BUSD_ADDRESS, BusdTokenContract, provider);
    const busdBalance = await busdContract.balanceOf(address);

    //Not Ours
    //TODO must remove
    const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
    const memoBalance = await memoContract.balanceOf(address);
    const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
    const timeBalance = await timeContract.balanceOf(address);
    const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
    const wmemoBalance = await wmemoContract.balanceOf(address);

    return {
        balances: {
            //Ours
            busd: ethers.utils.formatUnits(busdBalance, "gwei"),

            //Not Ours
            //TODO must remove
            memo: ethers.utils.formatUnits(memoBalance, "gwei"),
            time: ethers.utils.formatUnits(timeBalance, "gwei"),
            wmemo: ethers.utils.formatEther(wmemoBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        busd: string;
        time: string;
        memo: string;
        wmemo: string;
    };
    staking: {
        busd: number;
        time: number;
        memo: number;
    };
    wraping: {
        memo: number;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    //Ours
    let busdBalance = 0;
    let busdAllowance = 0;

    //Not Ours
    //TODO must remove or refractor next 6 lines
    let timeBalance = 0;
    let memoBalance = 0;

    let wmemoBalance = 0;
    let memoWmemoAllowance = 0;

    let stakeAllowance = 0;
    let unstakeAllowance = 0;

    const addresses = getAddresses(networkID);

    //Ours
    if (addresses.BUSD_ADDRESS) {
        const busdContract = new ethers.Contract(addresses.BUSD_ADDRESS, BusdTokenContract, provider);
        busdBalance = await busdContract.balanceOf(address);
        busdAllowance = await busdContract.allowance(address, addresses.WL_PRESALE_ADDRESS);
    }

    //Not Ours
    //TODO must remove or refractor next 19 lines
    if (addresses.TIME_ADDRESS) {
        const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
        timeBalance = await timeContract.balanceOf(address);
        stakeAllowance = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    }

    if (addresses.MEMO_ADDRESS) {
        const memoContract = new ethers.Contract(addresses.MEMO_ADDRESS, MemoTokenContract, provider);
        memoBalance = await memoContract.balanceOf(address);
        unstakeAllowance = await memoContract.allowance(address, addresses.STAKING_ADDRESS);

        if (addresses.WMEMO_ADDRESS) {
            memoWmemoAllowance = await memoContract.allowance(address, addresses.WMEMO_ADDRESS);
        }
    }

    if (addresses.WMEMO_ADDRESS) {
        const wmemoContract = new ethers.Contract(addresses.WMEMO_ADDRESS, wMemoTokenContract, provider);
        wmemoBalance = await wmemoContract.balanceOf(address);
    }

    return {
        balances: {
            busd: ethers.utils.formatUnits(busdBalance, "gwei"),
            memo: ethers.utils.formatUnits(memoBalance, "gwei"),
            time: ethers.utils.formatUnits(timeBalance, "gwei"),
            wmemo: ethers.utils.formatEther(wmemoBalance),
        },
        staking: {
            busd: Number(busdAllowance),
            time: Number(stakeAllowance),
            memo: Number(unstakeAllowance),
        },
        wraping: {
            memo: Number(memoWmemoAllowance),
        },
    };
});

interface ICalcUserBondDetails {
    address: string;
    bond: Bond;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserBondDetails {
    allowance: number;
    balance: number;
    avaxBalance: number;
    interestDue: number;
    bondMaturationBlock: number;
    pendingPayout: number; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk("account/calculateUserBondDetails", async ({ address, bond, networkID, provider }: ICalcUserBondDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                bond: "",
                displayName: "",
                bondIconSvg: "",
                isLP: false,
                allowance: 0,
                balance: 0,
                interestDue: 0,
                bondMaturationBlock: 0,
                pendingPayout: "",
                avaxBalance: 0,
            });
        });
    }

    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = Number(bondDetails.vesting) + Number(bondDetails.lastTime);
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
        balance = "0";

    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    const avaxBalance = await provider.getSigner().getBalance();
    const avaxVal = ethers.utils.formatEther(avaxBalance);

    const pendingPayoutVal = ethers.utils.formatUnits(pendingPayout, "gwei");

    return {
        bond: bond.name,
        displayName: bond.displayName,
        bondIconSvg: bond.bondIconSvg,
        isLP: bond.isLP,
        allowance: Number(allowance),
        balance: Number(balanceVal),
        avaxBalance: Number(avaxVal),
        interestDue,
        bondMaturationBlock,
        pendingPayout: Number(pendingPayoutVal),
    };
});

interface ICalcUserTokenDetails {
    address: string;
    token: IToken;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    networkID: Networks;
}

export interface IUserTokenDetails {
    allowance: number;
    balance: number;
    isAvax?: boolean;
}

//TODO Needs refractor
export const calculateUserTokenDetails = createAsyncThunk("account/calculateUserTokenDetails", async ({ address, token, networkID, provider }: ICalcUserTokenDetails) => {
    if (!address) {
        return new Promise<any>(resevle => {
            resevle({
                token: "",
                address: "",
                img: "",
                allowance: 0,
                balance: 0,
            });
        });
    }

    //Todo must refractor there
    if (token.isAvax) {
        const avaxBalance = await provider.getSigner().getBalance();
        const avaxVal = ethers.utils.formatEther(avaxBalance);

        return {
            token: token.name,
            tokenIcon: token.img,
            balance: Number(avaxVal),
            isAvax: true,
        };
    }

    const addresses = getAddresses(networkID);

    //Todo must refractor there
    const tokenContract = new ethers.Contract(token.address, MimTokenContract, provider);

    let allowance,
        balance = "0";

    //Todo must refractor there
    allowance = await tokenContract.allowance(address, addresses.ZAPIN_ADDRESS);
    balance = await tokenContract.balanceOf(address);

    const balanceVal = Number(balance) / Math.pow(10, token.decimals);

    return {
        token: token.name,
        address: token.address,
        img: token.img,
        allowance: Number(allowance),
        balance: Number(balanceVal),
    };
});

export interface IAccountSlice {
    bonds: { [key: string]: IUserBondDetails };
    balances: {
        //Ours
        busd: string;
        usdc: string;
        dai: string;
        //Not Ours
        //Todo must refractor there
        memo: string;
        time: string;
        wmemo: string;
    };
    loading: boolean;
    staking: {
        //Ours
        busd: number;
        usdc: number;
        dai: number;
        mim: number;

        //Not Ours
        //Todo must refractor there
        time: number;
        memo: number;
    };
    wraping: {
        memo: number;
    };
    whitelisted: boolean;
    tokens: { [key: string]: IUserTokenDetails };
}

//Todo must refractor balances staking and wraping
const initialState: IAccountSlice = {
    loading: true,
    bonds: {},
    balances: { busd: "", memo: "", time: "", wmemo: "", usdc: "", dai: "" },
    staking: { busd: 0, time: 0, memo: 0, usdc: 0, dai: 0, mim: 0 },
    wraping: { memo: 0 },
    tokens: {},
    whitelisted: false,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
        updateBUSDAllowance(state, action) {
            state.staking.busd = action.payload;
        },
        updateDAIAllowance(state, action) {
            state.staking.dai = action.payload;
        },
        updateMIMAllowance(state, action) {
            state.staking.mim = action.payload;
        },
        updateUSDCAllowance(state, action) {
            state.staking.usdc = action.payload;
        },
        setWhitelistStatus(state, action) {
            state.whitelisted = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserBondDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const bond = action.payload.bond;
                state.bonds[bond] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(calculateUserTokenDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(calculateUserTokenDetails.fulfilled, (state, action) => {
                if (!action.payload) return;
                const token = action.payload.token;
                state.tokens[token] = action.payload;
                state.loading = false;
            })
            .addCase(calculateUserTokenDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess, updateBUSDAllowance, updateDAIAllowance, updateMIMAllowance, updateUSDCAllowance, setWhitelistStatus } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
