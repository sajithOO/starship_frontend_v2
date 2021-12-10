import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../../hooks";
import { AVAX_TEST_NETWORK } from "../../../constants";
import { IReduxState } from "../../../store/slices/state.interface";
import { IPendingTxn } from "../../../store/slices/pending-txns-slice";
import "./connect-menu.scss";
import CircularProgress from "@material-ui/core/CircularProgress";

function ConnectMenu() {
    const { connect, disconnect, connected, web3, providerChainID, checkWrongNetwork } = useWeb3Context();
    const [isConnected, setConnected] = useState(connected);

    let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    let buttonText = "Connect Wallet";
    let clickFunc: any = connect;
    let buttonStyle = {};

    if (isConnected) {
        buttonText = "Disconnect";
        clickFunc = disconnect;
    }

    if (pendingTransactions && pendingTransactions.length > 0) {
        buttonText = `${pendingTransactions.length} Pending `;
        clickFunc = () => {};
    }

    if (isConnected) {
        if (providerChainID === 43114) {
            buttonText = "AVALANCHE";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else if (providerChainID === 43113) {
            buttonText = "AVALANCHE TEST";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else if (providerChainID === 56) {
            buttonText = "BSC";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else if (providerChainID === 97) {
            buttonText = "BSC TEST";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else if (providerChainID === 250) {
            buttonText = "FANTOM";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else if (providerChainID === 4002) {
            buttonText = "FANTOM TEST";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else if (providerChainID === 137) {
            buttonText = "POLYGON";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else if (providerChainID === 80001) {
            buttonText = "POLYGON TEST";
            buttonStyle = { backgroundColor: "#4169e1" };
        } else {
            buttonText = "UNSUPPORTED";
            buttonStyle = { backgroundColor: "rgb(255, 67, 67)" };
            clickFunc = () => {
                checkWrongNetwork();
            };
        }
    }

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <div className="connect-button" style={buttonStyle} onClick={clickFunc}>
            <p>{buttonText}</p>
            {pendingTransactions.length > 0 && (
                <div className="connect-button-progress">
                    <CircularProgress size={15} color="inherit" />
                </div>
            )}
        </div>
    );
}

export default ConnectMenu;
