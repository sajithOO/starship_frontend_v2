import React from "react";
import "./footer.scss";
import { Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import { IReduxState } from "../../../../store/slices/state.interface";
import { trim } from "../../../../helpers";
import { Skeleton } from "@material-ui/lab";

function Footer() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const stakingAPY = useSelector<IReduxState, number>(state => {
        return state.app.stakingAPY;
    });
    const treasuryBalance = useSelector<IReduxState, number>(state => {
        return state.app.treasuryBalance;
    });
    const circSupply = useSelector<IReduxState, number>(state => {
        return state.app.circSupply;
    });

    const trimmedStakingAPY = trim(stakingAPY * 100, 1);

    return (
        <div className="landing-footer">
            <Grid container spacing={1}>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                    <div className="landing-footer-item-wrap">
                        <p className="landing-footer-item-title">WL Presale Price</p>
                        <p className="landing-footer-item-value">$10</p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                    <div className="landing-footer-item-wrap">
                        <p className="landing-footer-item-title">Total Staked</p>
                        <p className="landing-footer-item-value">Coming Soon!</p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                    <div className="landing-footer-item-wrap">
                        <p className="landing-footer-item-title">Treasury Balance</p>
                        <p className="landing-footer-item-value">Coming Soon!</p>
                    </div>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                    <div className="landing-footer-item-wrap">
                        <p className="landing-footer-item-title">APY</p>
                        <p className="landing-footer-item-value">Coming Soon!</p>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Footer;
