import { Grid, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import "./bridge.scss";

function Bridge() {
    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">StarBridge - Cross chain Bridge</p>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            <div className="stake-card-wallet-notification">
                                <p className="stake-card-wallet-desc-text">STARBRIDGE COMING SOON!</p>
                            </div>
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Bridge;
