import { AVAX_TEST_NETWORK, BSC_TEST_NETWORK, FANTOM_TEST_NETWORK, POLYGON_TEST_NETWORK } from "../../../constants/blockchain";
import { Networks } from "../../../constants";

export const getMainnetURI = (): string => {
    return "https://data-seed-prebsc-1-s1.binance.org:8545";
};

export const getNetworkURI = (chainId: any): any => {
    switch (chainId) {
        case BSC_TEST_NETWORK: {
            return "https://data-seed-prebsc-1-s1.binance.org:8545";
            break;
        }
        case POLYGON_TEST_NETWORK: {
            return "https://polygon-mumbai.g.alchemy.com/v2/Z2wiI7X2T2AsTq_TLd01jgx6ptWTklV_";
            break;
        }
        case FANTOM_TEST_NETWORK: {
            return "https://rpc.ftm.tools/";
        }
    }
};
