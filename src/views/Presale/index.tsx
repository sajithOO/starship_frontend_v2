import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { trim } from "../../helpers";
import { changeStake, changeApproval } from "../../store/slices/stake-thunk";
import "./presale.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { includes } from "lodash";
import "ethers";
import { AVAX_TEST_NETWORK, BSC_TEST_NETWORK, FANTOM_TEST_NETWORK, POLYGON_TEST_NETWORK } from "src/constants";
import { ethers } from "ethers";
//import aStrshipContractABI from "../../abi/tokens/aStarshipContract.json";
import { Network } from "@ethersproject/networks";
import { getAddresses } from "../../constants";
import { time } from "console";
import { updateBUSDAllowance, updateDAIAllowance, updateMIMAllowance, updateUSDCAllowance, setWhitelistStatus } from "../../store/slices/account-slice";
import { TimeTokenContract, MemoTokenContract, MimTokenContract, wMemoTokenContract, BusdTokenContract } from "../../abi";
import DAIContractAbi from "../../abi/tokens/DAIContract.json";
import WLContractAbi from "../../abi/WLCrowdsaleContract.json";
declare const chain: string;
function Presale() {
    const dispatch = useDispatch();
    const { provider, address, connect, providerChainID, checkWrongNetwork } = useWeb3Context();

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const currentIndex = useSelector<IReduxState, string>(state => {
        return state.app.currentIndex;
    });
    const fiveDayRate = useSelector<IReduxState, number>(state => {
        return state.app.fiveDayRate;
    });

    //Ours
    const busdBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.busd;
    });
    const busdAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.busd;
    });
    const daiBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.dai;
    });
    const daiAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.dai;
    });
    const mimAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.mim;
    });
    const usdcAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.usdc;
    });
    const whitelistStatus = useSelector<IReduxState, boolean>(state => {
        return state.account.whitelisted;
    });

    //Not Ours
    const timeBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.time;
    });
    const memoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.memo;
    });
    const stakeAllowance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.time;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const setMax = () => {
        setQuantity("1500");
    };

    const updateWhitelistStatus = () => {
        const addresses = getAddresses(BSC_TEST_NETWORK);

        const wlContract = new ethers.Contract(addresses.WL_PRESALE_ADDRESS, WLContractAbi, provider.getSigner());
        var callPromise = wlContract.isWhitelisted(provider.getSigner().getAddress());
        let allowance;
        callPromise.then(function (result) {
            //console.log("BUSD ALLOWANCE " + result);
            console.log("RESP : " + result);
            dispatch(setWhitelistStatus(result));
        });
    };

    const updateAllowanceBSCTest = () => {
        const addresses = getAddresses(BSC_TEST_NETWORK);

        const busdContract = new ethers.Contract(addresses.BUSD_ADDRESS, BusdTokenContract, provider.getSigner());
        var callPromise = busdContract.allowance(provider.getSigner().getAddress(), addresses.WL_PRESALE_ADDRESS);
        let allowance;
        callPromise.then(function (result) {
            //console.log("BUSD ALLOWANCE " + result);
            dispatch(updateBUSDAllowance(parseInt(ethers.utils.formatEther(result))));
        });
    };
    const updateAllowanceDAITest = () => {
        const addresses = getAddresses(BSC_TEST_NETWORK);

        const daiContract = new ethers.Contract(addresses.DAI_ADDRESS, DAIContractAbi, provider.getSigner());
        var callPromise = daiContract.allowance(provider.getSigner().getAddress(), addresses.WL_PRESALE_ADDRESS);
        let allowance;
        callPromise.then(function (result) {
            dispatch(updateDAIAllowance(parseInt(ethers.utils.formatEther(result))));
        });
    };
    const updateAllowanceMIMTest = () => {
        const addresses = getAddresses(BSC_TEST_NETWORK);

        const daiContract = new ethers.Contract(addresses.MIM_ADDRESS, DAIContractAbi, provider.getSigner());
        var callPromise = daiContract.allowance(provider.getSigner().getAddress(), addresses.WL_PRESALE_ADDRESS);
        let allowance;
        callPromise.then(function (result) {
            dispatch(updateMIMAllowance(parseInt(ethers.utils.formatEther(result))));
        });
    };
    const updateAllowanceUSDCTest = () => {
        const addresses = getAddresses(BSC_TEST_NETWORK);

        const usdcContract = new ethers.Contract(addresses.USDC_ADDRESS, DAIContractAbi, provider.getSigner());
        var callPromise = usdcContract.allowance(provider.getSigner().getAddress(), addresses.WL_PRESALE_ADDRESS);
        let allowance;
        callPromise.then(function (result) {
            dispatch(updateUSDCAllowance(parseInt(ethers.utils.formatEther(result))));
        });
    };
    useEffect(() => {
        if (providerChainID == BSC_TEST_NETWORK) {
            updateAllowanceBSCTest();
        }
        if (providerChainID == FANTOM_TEST_NETWORK) {
            updateAllowanceDAITest();
        }
        if (providerChainID == AVAX_TEST_NETWORK) {
            updateAllowanceMIMTest();
        }
        if (providerChainID == POLYGON_TEST_NETWORK) {
            updateAllowanceUSDCTest();
        }
        updateWhitelistStatus();
    });

    // Seek approval code, must be all chains, only BSC for now
    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, token, provider, networkID: providerChainID }));
        if (providerChainID == BSC_TEST_NETWORK) {
            updateAllowanceBSCTest();
        }
        if (providerChainID == FANTOM_TEST_NETWORK) {
            updateAllowanceDAITest();
        }
        if (providerChainID == AVAX_TEST_NETWORK) {
            updateAllowanceMIMTest();
        }
        if (providerChainID == POLYGON_TEST_NETWORK) {
            updateAllowanceUSDCTest();
        }
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: action === "stake" ? messages.before_wl_buy : messages.before_unstake }));
        } else {
            await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: providerChainID }));
            setQuantity("");
        }
    };

    const hasAllowance = useCallback(
        token => {
            if (token === "BUSD") {
                if (providerChainID == BSC_TEST_NETWORK) {
                    return busdAllowance > 0;
                }
                if (providerChainID == FANTOM_TEST_NETWORK) {
                    return daiAllowance > 0;
                }
                if (providerChainID == AVAX_TEST_NETWORK) {
                    return mimAllowance > 0;
                }
                if (providerChainID == POLYGON_TEST_NETWORK) {
                    return usdcAllowance > 0;
                }
            }
        },
        [busdAllowance, daiAllowance, mimAllowance, usdcAllowance],
    );

    const checkIsWhitelisted = useCallback(() => {
        return whitelistStatus;
    }, [whitelistStatus]);

    /*const checkBUSDContract = () => {
        const addresses = getAddresses(BSC_TEST_NETWORK);
        async () => {
            await window.ethereum.enable();
        };
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);

        const busdContract = new ethers.Contract(addresses.BUSD_ADDRESS, BUSDContractABI, newProvider.getSigner());
        var callPromise = busdContract.allowance(newProvider.getSigner().getAddress(), addresses.WL_PRESALE_ADDRESS);
        let allowance;
        callPromise.then(function (result) {
            //console.log("BUSD ALLOWANCE " + result);
            allowance = result;
        });

        return allowance;
    };*/

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    const CoinGecko = require("coingecko-api");
    const CoinGeckoClient = new CoinGecko();
    async function func() {
        let data = await CoinGeckoClient.simple.price({
            ids: ["bitcoin"],
            vs_currencies: ["usd"],
        });
        console.log(data);
    }
    func();

    let chain_arr = [43114, 43113, 56, 97, 250, 4002, 137, 80001];

    if (address) {
        if (chain_arr.includes(providerChainID)) {
            if (providerChainID === 43114) {
                let chain: string = "avalanche";
                const options1 = ["MIM"];
                let defaultOption = options1[0];
            } else if (providerChainID === 43113) {
                let chain: string = "avalanche_test";
                const options1 = ["MIM"];
                let defaultOption = options1[0];
            } else if (providerChainID === 56) {
                let chain: string = "bsc";
                const options1 = ["BUSD"];
                let defaultOption = options1[0];
            } else if (providerChainID === 97) {
                let chai: string = "bsc_test";
                const options1 = ["BUSD"];
                let defaultOption = options1[0];
            } else if (providerChainID === 250) {
                let chain: string = "fantom";
                const options1 = ["DAI"];
                let defaultOption = options1[0];
            } else if (providerChainID === 4002) {
                let chain: string = "fantom_test";
                const options1 = ["DAI"];
                let defaultOption = options1[0];
            } else if (providerChainID === 137) {
                let chain: string = "polygon";
                const options1 = ["USDC"];
                let defaultOption = options1[0];
            } else if (providerChainID === 80001) {
                let chain: string = "polygon_tests";
                const options1 = ["USDC"];
                let defaultOption = options1[0];
            }
        } else {
            let chain: string = "null";
        }
    }

    let buttonText = "Connect Wallet";

    if (providerChainID === 43114) {
        buttonText = "Avalanche";
    } else if (providerChainID === 43113) {
        buttonText = "Avalanche Testnet";
    } else if (providerChainID === 56) {
        buttonText = "Binance Smart Chain";
    } else if (providerChainID === 97) {
        buttonText = "BSC Testnet";
    } else if (providerChainID === 250) {
        buttonText = "Fantom";
    } else if (providerChainID === 4002) {
        buttonText = "Fantom Testnet";
    } else if (providerChainID === 137) {
        buttonText = "Polygon";
    } else if (providerChainID === 80001) {
        buttonText = "Polygon Testnet";
    }

    const currentChainId = [providerChainID];
    const trimmedMemoBalance = trim(Number(memoBalance), 6);
    console.log(currentChainId);
    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">Whitelisted Presale</p>
                                <p className="stake-card-header-title centertext">{checkIsWhitelisted() ? <p>🎉 You are Whitelisted 🎉 </p> : <p>You are not Whitelisted</p>}</p>
                            </div>
                        </Grid>

                        <Grid item>
                            <div className="stake-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">Whitelisted Presale Price</p>
                                            <p className="stake-card-metrics-value">$10</p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">Public Presale Price</p>
                                            <p className="stake-card-metrics-value">$16</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            {!address && (
                                <div className="stake-card-wallet-notification">
                                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="stake-card-wallet-desc-text">Connect your wallet to buy STARSHIP tokens!</p>
                                </div>
                            )}
                            {address && !chain_arr.includes(providerChainID) && (
                                <div className="stake-card-wallet-notification">
                                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                        <p>Switch Network</p>
                                    </div>
                                    <p className="stake-card-wallet-desc-text">This network is not yet supported!</p>
                                </div>
                            )}
                            {address && chain_arr.includes(providerChainID) && (
                                <>
                                <div>
                                    <div className="stake-card-action-area">
                                        <div className="stake-card-action-row">
                                            {currentChainId.includes(43114) && (
                                                <>
                                                    <Dropdown options={["MIM"]} className="stake-card-action-dropdown" value={"MIM"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                            {currentChainId.includes(AVAX_TEST_NETWORK) && (
                                                <>
                                                    <Dropdown options={["MIM"]} className="stake-card-action-dropdown" value={"MIM"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                            {currentChainId.includes(56) && (
                                                <>
                                                    <Dropdown options={["BUSD"]} className="stake-card-action-dropdown" value={"BUSD"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                            {currentChainId.includes(BSC_TEST_NETWORK) && (
                                                <>
                                                    <Dropdown options={["BUSD"]} className="stake-card-action-dropdown" value={"BUSD"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                            {currentChainId.includes(250) && (
                                                <>
                                                    <Dropdown options={["USDC"]} className="stake-card-action-dropdown" value={"USDC"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                            {currentChainId.includes(FANTOM_TEST_NETWORK) && (
                                                <>
                                                    <Dropdown options={["DAI"]} className="stake-card-action-dropdown" value={"DAI"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                            {currentChainId.includes(137) && (
                                                <>
                                                    <Dropdown options={["DAI"]} className="stake-card-action-dropdown" value={"DAI"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                            {currentChainId.includes(POLYGON_TEST_NETWORK) && (
                                                <>
                                                    <Dropdown options={["USDC"]} className="stake-card-action-dropdown" value={"USDC"} />
                                                    <OutlinedInput
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="stake-card-action-input"
                                                        value={quantity}
                                                        onChange={e => setQuantity(e.target.value)}
                                                        labelWidth={0}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div className="stake-card-action-row">
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount of STARSHIP"
                                                className="stake-card-action-input"
                                                value={parseInt(quantity.valueOf()) / 10}
                                                onChange={e => setQuantity(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="stake-card-action-input-btn">
                                                            <p>Max</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />

                                            {view === 0 && (
                                                <div className="stake-card-tab-panel">
                                                    {address && hasAllowance("BUSD") ? (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "staking")) return;
                                                                onChangeStake("stake");
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "staking", "Buy aSTARSHIP")}</p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "approve_purchase")) return;
                                                                onSeekApproval("BUSD");
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "approve_purchase", "Approve")}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="stake-card-action-help-text">
                                            {address && !hasAllowance("BUSD") && (
                                                <p>
                                                    Note: The "Approve" transaction is only needed when purchasing for the first time; subsequent purchasing only requires you to
                                                    perform the transaction.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <br /><br /><br /><br /><br />

                                <div className="dashboard-view">
                                    <div className="dashboard-infos-wrap">
                                        <Zoom in={true}>
                                            <Grid container spacing={4}>
                                                <br />

                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <div className="dashboard-card">
                                                        <p className="card-title">Total Presale Allocation in {buttonText}</p>
                                                        <p className="card-value">$375,000</p>
                                                    </div>
                                                </Grid>

                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <div className="dashboard-card">
                                                        <p className="card-title">Current Allocation in {buttonText}</p>
                                                        <p className="card-value">//current amt raised in current chain here</p>
                                                    </div>
                                                </Grid>

                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <div className="dashboard-card">
                                                        <p className="card-title">Remaining Allocation in {buttonText}</p>
                                                        <p className="card-value">//remaining amt to raise in current chain here</p>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Zoom>
                                    </div>
                                </div>
                                </>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Presale;
