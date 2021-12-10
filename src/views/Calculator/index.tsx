import React, { useEffect, useState } from "react";
import "./calculator.scss";
import { useSelector } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider } from "@material-ui/core";
import { IReduxState } from "../../store/slices/state.interface";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";

function Calculator() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const marketPrice = useSelector<IReduxState, number>(state => {
        return 10;
    });
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return Math.floor(Math.random() * (5000000000 - 50000 + 1)) + 50000;
    });
    const memoBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.memo;
    });

    const trimmedStakingAPY = trim(stakingAPY * 100, 1);
    const trimmedMemoBalance = trim(Number(memoBalance), 6);
    const trimeMarketPrice = trim(10, 2);
    const futMarketPrice = trim(16, 2);

    const [memoAmount, setMemoAmount] = useState(trimmedMemoBalance);
    const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
    const [priceAtPurchase, setPriceAtPurchase] = useState(trimeMarketPrice);
    const [futureMarketPrice, setFutureMarketPrice] = useState(futMarketPrice);
    const [days, setDays] = useState(30);

    const [rewardsEstimation, setRewardsEstimation] = useState("0");
    const [potentialReturn, setPotentialReturn] = useState("0");

    const calcInitialInvestment = () => {
        const memo = Number(memoAmount) || 0;
        const price = parseFloat(priceAtPurchase) || 0;
        const amount = memo * price;
        return trim(amount, 2);
    };

    const calcCurrentWealth = () => {
        const memo = Number(memoAmount) || 0;
        const price = parseFloat(trimeMarketPrice);
        const amount = memo * price;
        return trim(amount, 2);
    };

    const [initialInvestment, setInitialInvestment] = useState(calcInitialInvestment());

    useEffect(() => {
        const newInitialInvestment = calcInitialInvestment();
        setInitialInvestment(newInitialInvestment);
    }, [memoAmount, priceAtPurchase]);

    const calcNewBalance = () => {
        let value = parseFloat(rewardYield) / 100;
        value = Math.pow(value - 1, 1 / (365 * 3)) - 1 || 0;
        let balance = Number(memoAmount);
        for (let i = 0; i < days * 3; i++) {
            balance += balance * value;
        }
        return balance;
    };

    useEffect(() => {
        const newBalance = calcNewBalance();
        setRewardsEstimation(trim(newBalance, 6));
        const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice) || 0);
        setPotentialReturn(trim(newPotentialReturn, 2));
    }, [days, rewardYield, futureMarketPrice, memoAmount]);

    return (
        <div className="calculator-view">
            <Zoom in={true}>
                <div className="calculator-card">
                    <Grid className="calculator-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="calculator-card-header">
                                <p className="calculator-card-header-title">Calculator</p>
                                <p className="calculator-card-header-subtitle">Estimate your returns</p>
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="calculator-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="calculator-card-apy">
                                            <p className="calculator-card-metrics-title">STARSHIP Price</p>
                                            <p className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trimeMarketPrice}`}</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div className="calculator-card-tvl">
                                            <p className="calculator-card-metrics-title">Current APY</p>
                                            <p className="calculator-card-metrics-value">Coming Soon!</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="calculator-card-area">
                            <div>
                                <div className="calculator-card-action-area">
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">STARSHIP Amount</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    onChange={e => setMemoAmount(e.target.value)}
                                                    labelWidth={0}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">APY (%)</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    onChange={e => setRewardYield(e.target.value)}
                                                    labelWidth={0}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">STARSHIP price at purchase ($)</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={priceAtPurchase}
                                                    onChange={e => setPriceAtPurchase(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setPriceAtPurchase("10")} className="stake-card-action-input-btn">
                                                                <p>WL Presale</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <div className="calculator-card-action-area-inp-wrap">
                                                <p className="calculator-card-action-area-inp-wrap-title">Future STARSHIP market price ($)</p>
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="Amount"
                                                    className="calculator-card-action-input"
                                                    value={futureMarketPrice}
                                                    onChange={e => setFutureMarketPrice(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={() => setFutureMarketPrice("16")} className="stake-card-action-input-btn">
                                                                <p>Public Presale Price</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="calculator-days-slider-wrap">
                                    <p className="calculator-days-slider-wrap-title">{`${days} day${days > 1 ? "s" : ""}`}</p>
                                    <Slider className="calculator-days-slider" min={1} max={365} value={days} onChange={(e, newValue: any) => setDays(newValue)} />
                                </div>
                                <div className="calculator-user-data">
                                    <div className="data-row">
                                        <p className="data-row-name">Your Initial Investment</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${initialInvestment}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Current Wealth</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${calcCurrentWealth()}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">STARSHIP Rewards Estimation</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{rewardsEstimation} STARSHIP</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Potential Return</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${potentialReturn}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Potential Number of Lambos</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{Math.floor(Number(potentialReturn) / 220000)}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Potential Number of Houses in Beverly Hills</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{Math.floor(Number(potentialReturn) / 3500000)}</>}</p>
                                    </div>
                                    <div className="data-row">
                                        <p className="data-row-name">Potential Number of Trips to Mars in SpaceX Starship</p>
                                        <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{Math.floor(Number(potentialReturn) / 2000000)}</>}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Calculator;
