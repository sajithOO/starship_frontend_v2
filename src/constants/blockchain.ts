export const TOKEN_DECIMALS = 18;

export enum Networks {
    // Warning : there are test net Id's for now, will have to change them to main net when deployed
    AVAX_TEST = 43113,
    BSC_TEST = 97,
    POLYGON_TEST = 80001,
    FANTOM_TEST = 4002,
}

export const AVAX_TEST_NETWORK = Networks.AVAX_TEST;
export const BSC_TEST_NETWORK = Networks.BSC_TEST;
export const POLYGON_TEST_NETWORK = Networks.POLYGON_TEST;
export const FANTOM_TEST_NETWORK = Networks.FANTOM_TEST;

export const DEFAULT_NETWORK = BSC_TEST_NETWORK;
