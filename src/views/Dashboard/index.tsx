import { useSelector } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { trim } from "../../helpers";
import { Link } from "@material-ui/core";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";

function Dashboard() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <br /><br /><br /><br /><br /><br />
                <Zoom in={true}>
                    <Grid container spacing={4}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">STARSHIP WL Price</p>
                                <p className="card-value">$10</p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Total Presale Allocation</p>
                                <p className="card-value">$1,500,000</p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Current Allocation</p>
                                <p className="card-value">//all chains total raised here</p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">WL Presale Starts at</p>
                                <p className="card-value">Dec 15, 2021 - 12pm UTC</p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Market Cap</p>
                                <p className="card-value">Coming Soon!</p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Current APY</p>
                                <p className="card-value">Coming Soon!</p>
                            </div>
                        </Grid>

                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <div className="dashboard-card-no-display-card">
                                <div className="landing-main-btns-wrap">
                                    <Link component={NavLink} to="/presale" id="link">
                                        <div className="landing-main-btn">
                                            <p>BUY $STARSHIP</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
