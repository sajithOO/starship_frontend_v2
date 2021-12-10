import { Grid, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import "./stake.scss";

function Stake() {
    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">StarStake (🚀,🚀)</p>
                                <RebaseTimer />
                            </div>
                        </Grid>

                        <Grid item>
                            <div className="stake-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">Current APY</p>
                                            <p className="stake-card-metrics-value">Coming Soon!</p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">STARSHIP Price</p>
                                            <p className="stake-card-metrics-value">$10</p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            <div className="stake-card-wallet-notification">
                                <p className="stake-card-wallet-desc-text">STAKING COMING SOON!</p>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Stake;
