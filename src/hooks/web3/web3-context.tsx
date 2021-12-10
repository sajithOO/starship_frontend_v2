import React, { useState, ReactElement, useContext, useMemo, useCallback } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { getMainnetURI, getNetworkURI } from "./helpers";
import { AVAX_TEST_NETWORK, BSC_TEST_NETWORK, FANTOM_TEST_NETWORK, POLYGON_TEST_NETWORK } from "../../constants";
import { Networks } from "../../constants";
import { messages } from "../../constants/messages";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";

import { useDispatch } from "react-redux";
import { swithNetwork } from "../../helpers/switch-network";
import "ethers";

type onChainProvider = {
    connect: () => Promise<Web3Provider>;
    disconnect: () => void;
    checkWrongNetwork: () => Promise<boolean>;
    provider: JsonRpcProvider;
    address: string;
    connected: Boolean;
    web3Modal: Web3Modal;
    chainID: number;
    web3?: any;
    providerChainID: number;
    hasCachedProvider: () => boolean;
};

export type Web3ContextData = {
    onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
    const web3Context = useContext(Web3Context);
    if (!web3Context) {
        throw new Error("useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.");
    }
    const { onChainProvider } = web3Context;
    return useMemo(() => {
        return { ...onChainProvider };
    }, [web3Context]);
};

export const useAddress = () => {
    const { address } = useWeb3Context();
    return address;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
    const dispatch = useDispatch();

    const [connected, setConnected] = useState(false);
    // Loading BSC network as default for a non connected wallet
    const [chainID, setChainID] = useState(BSC_TEST_NETWORK);
    const [providerChainID, setProviderChainID] = useState(BSC_TEST_NETWORK);
    const [address, setAddress] = useState("");

    const [uri, setUri] = useState(getMainnetURI());
    //const [uri, setUri] = useState(getNetworkURI(BSC_TEST_NETWORK)); -> To uncomment when using multiple chain
    const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));

    const [web3Modal] = useState<Web3Modal>(
        new Web3Modal({
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        rpc: {
                            //[Networks.BSC_TEST]: getMainnetURI(),
                            [Networks.BSC_TEST]: getNetworkURI(BSC_TEST_NETWORK),
                            //[Networks.FANTOM_TEST]: getNetworkURI(FANTOM_TEST_NETWORK),
                            //[Networks.POLYGON_TEST]: getNetworkURI(POLYGON_TEST_NETWORK),
                        },
                    },
                },
            },
        }),
    );

    const hasCachedProvider = (): boolean => {
        if (!web3Modal) return false;
        if (!web3Modal.cachedProvider) return false;
        return true;
    };

    const _initListeners = useCallback(
        (rawProvider: JsonRpcProvider) => {
            if (!rawProvider.on) {
                return;
            }

            rawProvider.on("accountsChanged", () => setTimeout(() => window.location.reload(), 1));

            rawProvider.on("chainChanged", async (chain: number) => {
                changeNetwork(chain);
            });

            rawProvider.on("network", (_newNetwork, oldNetwork) => {
                if (!oldNetwork) return;
                window.location.reload();
            });
        },
        [provider],
    );

    const changeNetwork = async (otherChainID: number) => {
        const network = Number(otherChainID);

        setProviderChainID(network);
        window.location.reload();
    };

    //TODO add a loop on the Networks enumeration !!!
    const connect = useCallback(async () => {
        const rawProvider = await web3Modal.connect();

        _initListeners(rawProvider);

        const connectedProvider = new Web3Provider(rawProvider, "any");

        const chainId = await connectedProvider.getNetwork().then(network => Number(network.chainId));
        try {
            const connectedAddress = await connectedProvider.getSigner().getAddress();

            setAddress(connectedAddress);
        } catch (err: any) {
            return metamaskErrorWrap(err, dispatch);
        }

        setProviderChainID(chainId);

        if (chainId === Networks.AVAX_TEST) {
            setProvider(connectedProvider);
            setConnected(true);
        } else if (chainId === Networks.BSC_TEST) {
            setProvider(connectedProvider);
            setConnected(true);
        } else if (chainId === Networks.FANTOM_TEST) {
            setProvider(connectedProvider);
            setConnected(true);
        } else if (chainId === Networks.POLYGON_TEST) {
            setProvider(connectedProvider);
            setConnected(true);
        }

        return connectedProvider;
    }, [provider, web3Modal, connected]);

    const checkWrongNetwork = async (): Promise<boolean> => {
        if (
            !(providerChainID === AVAX_TEST_NETWORK || providerChainID === BSC_TEST_NETWORK || providerChainID === POLYGON_TEST_NETWORK || providerChainID === FANTOM_TEST_NETWORK)
        ) {
            const shouldSwitch = window.confirm(messages.switch_to_avalanche);
            if (shouldSwitch) {
                await swithNetwork();
                window.location.reload();
            }
            return true;
        }

        return false;
    };

    const disconnect = useCallback(async () => {
        web3Modal.clearCachedProvider();
        setConnected(false);

        setTimeout(() => {
            window.location.reload();
        }, 1);
    }, [provider, web3Modal, connected]);

    const onChainProvider = useMemo(
        () => ({
            connect,
            disconnect,
            hasCachedProvider,
            provider,
            connected,
            address,
            chainID,
            web3Modal,
            providerChainID,
            checkWrongNetwork,
        }),
        [connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal, providerChainID],
    );
    //@ts-ignore
    return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};