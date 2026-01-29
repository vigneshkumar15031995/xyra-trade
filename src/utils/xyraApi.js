import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey, PrivateKey } from "@aptos-labs/ts-sdk";
import axios from 'axios';
import BigNumber from 'bignumber.js';

const API_KEY = process.env.NEXT_PUBLIC_XYRA_API_KEY;
const USER_ADDRESS = process.env.NEXT_PUBLIC_XYRA_USER_ADDRESS;

const PRIVATE_KEY_RAW = process.env.NEXT_PUBLIC_XYRA_APTOS_PRIVATE_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_XYRA_API_BASE_URL; // Mainnet

// Market Constants for Mainnet
// IDs from installation-setup.md
export const MARKETS = {
    BTC: {
        id: 15,
        baseDecimals: 8,
        lotSizeMultiplier: 1000,
        pricePrecision: 0
    },
    ETH: {
        id: 16,
        baseDecimals: 8,
        lotSizeMultiplier: 10000,
        pricePrecision: 1
    },
    APT: {
        id: 14,
        baseDecimals: 8,
        lotSizeMultiplier: 100000,
        pricePrecision: 3
    },
    SOL: {
        id: 31,
        baseDecimals: 8,
        lotSizeMultiplier: 100000,
        pricePrecision: 2
    }
};

const config = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(config);

const getAccount = () => {
    if (!PRIVATE_KEY_RAW) throw new Error("Private key not found in environment variables");

    // Format private key (handles 0x prefix removal if needed)
    const formattedPrivateKey = PrivateKey.formatPrivateKey(
        PRIVATE_KEY_RAW,
        'ed25519'
    );

    const privateKey = new Ed25519PrivateKey(formattedPrivateKey);
    return Account.fromPrivateKey({ privateKey });
};

/**
 * Fetches the wallet account balance
 */
export const getWalletBalance = async () => {
    try {
        const url = `${BASE_URL}/getWalletAccountBalance`;
        const params = {
            userAddress: USER_ADDRESS
        };

        const response = await axios.get(url, {
            params,
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.data || !response.data.success) {
            console.error("Fetch Balance Error:", response.data);
            throw new Error(response.data?.message || 'Failed to fetch balance');
        }

        return response.data.data;
    } catch (error) {
        console.error("Get Wallet Balance failed:", error);
        throw error;
    }
}


/**
 * Fetches the specific profile (trading) balance
 */
/**
 * Fetches the specific profile (trading) balance
 * @param {string} address - The profile address to fetch balance for
 */
export const getProfileBalance = async (address) => {
    try {
        if (!address) throw new Error("Profile address is required");

        const url = `${BASE_URL}/getProfileBalanceSnapshot`;
        const params = {
            userAddress: address
        };

        const response = await axios.get(url, {
            params,
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.data || !response.data.success) {
            console.error("Fetch Profile Balance Error:", response.data);
            throw new Error(response.data?.message || 'Failed to fetch profile balance');
        }

        return response.data.data;
    } catch (error) {
        console.error("Get Profile Balance failed:", error);
        throw error;
    }
};

/**
 * Fetches the Profile Address for the current User Address
 */
export const getProfileAddress = async () => {
    try {
        const url = `${BASE_URL}/getProfileAddress`;
        const params = {
            userAddress: USER_ADDRESS
        };

        const response = await axios.get(url, {
            params,
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.data || !response.data.success) {
            console.error("Fetch Profile Address Error:", response.data);
            throw new Error(response.data?.message || 'Failed to fetch profile address');
        }

        return response.data.data;
    } catch (error) {
        console.error("Get Profile Address failed:", error);
        throw error;
    }
};



/**
 * Helper to get symbol from market ID
 */
export const getMarketSymbol = (marketId) => {
    const market = Object.values(MARKETS).find(m => m.id === Number(marketId));
    return market ? Object.keys(MARKETS).find(key => MARKETS[key].id === Number(marketId)) : 'Unknown';
};

/**
 * Fetches open positions
 */
export const getPositions = async (address) => {
    try {
        const url = `${BASE_URL}/getPositions`;
        const params = { userAddress: address };
        const response = await axios.get(url, { params, headers: { 'x-api-key': API_KEY } });
        return response.data.data || [];
    } catch (error) {
        console.error("Get Positions failed:", error);
        return [];
    }
};

/**
 * Fetches open orders
 */
export const getOpenOrders = async (address) => {
    try {
        const url = `${BASE_URL}/getOpenOrdersFromContract`;
        const params = { userAddress: address };
        const response = await axios.get(url, { params, headers: { 'x-api-key': API_KEY } });
        return response.data.data || [];
    } catch (error) {
        console.error("Get Open Orders failed:", error);
        return [];
    }
};

/**
 * Fetches order history
 */
export const getOrderHistory = async (address) => {
    try {
        const url = `${BASE_URL}/getOrderHistory`;
        const params = { userAddress: address };
        const response = await axios.get(url, { params, headers: { 'x-api-key': API_KEY } });
        return response.data.data || [];
    } catch (error) {
        console.error("Get Order History failed:", error);
        return [];
    }
};

/**
 * Fetches trade history
 */
export const getTradeHistory = async (address) => {
    try {
        const url = `${BASE_URL}/getTradeHistory`;
        const params = { userAddress: address };
        const response = await axios.get(url, { params, headers: { 'x-api-key': API_KEY } });
        return response.data.data || [];
    } catch (error) {
        console.error("Get Trade History failed:", error);
        return [];
    }
};

/**
 * Fetches fills (often used for funding/fills history)
 */
export const getFills = async (address) => {
    try {
        // Need to provide a time range. For now, default to last 30 days.
        const to = new Date().toISOString();
        const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const url = `${BASE_URL}/getFills`;
        // Market ID is required? Docs say yes. We might need to fetch for all markets.
        // For simplicity, let's fetch for BTC (ID: 15) for now or Loop if needed.
        // Using BTC Market ID 15 as default or primary check.
        const params = {
            marketId: MARKETS.BTC.id,
            address: address,
            from,
            to
        };
        const response = await axios.get(url, { params, headers: { 'x-api-key': API_KEY } });
        return response.data.data || [];
    } catch (error) {
        console.error("Get Fills failed:", error);
        return [];
    }
};

/**
 * Fetches market information
 */
export const getMarketInfo = async (marketId) => {
    try {
        const url = `${BASE_URL}/getMarketInfo`;
        const params = { marketId };
        const response = await axios.get(url, { params, headers: { 'x-api-key': API_KEY } });

        if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
            return response.data.data[0];
        }
        return null;
    } catch (error) {
        console.error("Get Market Info failed:", error);
        return null;
    }
};

/**
 * Places an order (Limit or Market)
 */
export const placeOrder = async ({
    marketSymbol = 'BTC',
    side, // 'buy' (Long) or 'sell' (Short)
    type, // 'market' or 'limit'
    size,
    price,
    leverage,
    takeProfit = 0,
    stopLoss = 0,
    isClose = false // Default to Open Position
}) => {
    try {
        console.log(`Placing ${type} order for ${marketSymbol}: ${side} ${size} @ ${price || 'Market'} (x${leverage})`);

        const market = MARKETS[marketSymbol];
        if (!market) throw new Error(`Market ${marketSymbol} configuration not found`);

        // --- Fetch Dynamic Market Info ---
        const marketInfo = await getMarketInfo(market.id);
        if (!marketInfo) console.warn(`Failed to fetch dynamic info for market ID ${market.id}, using specific defaults`);

        // Use dynamic values or fallbacks
        // Default lot size to 10000 if fetch fails, but prefer dynamic "lot_size"
        const dynamicLotSize = marketInfo && marketInfo.lot_size ? new BigNumber(marketInfo.lot_size) : new BigNumber(market.lotSizeMultiplier);

        const baseDecimals = (marketInfo && marketInfo.base_decimals !== undefined) ? marketInfo.base_decimals : market.baseDecimals;

        console.log(`[Dynamic Market Info] ID: ${market.id} | Lot Size: ${dynamicLotSize.toString()} | Base Decimals: ${baseDecimals}`);

        // 1. Calculate Converted Size
        const sizeBn = new BigNumber(size);
        const sizeScalingFactor = new BigNumber(10).pow(baseDecimals);

        // Debug Log for Math Trace
        const rawScaled = sizeBn.multipliedBy(sizeScalingFactor);
        const rawDivided = rawScaled.dividedBy(dynamicLotSize);
        console.log(`[Size Calc] Input: ${size} BTC | Scaled (10^${baseDecimals}): ${rawScaled.toString()} | Div by ${dynamicLotSize.toString()}: ${rawDivided.toString()}`);

        const convertedSize = rawDivided
            .integerValue(BigNumber.ROUND_FLOOR)
            .absoluteValue()
            .toString();

        console.log(`[Size Calc] Final Integer (Payload): ${convertedSize}`);

        // 2. Calculate Converted Price (if limit)
        let convertedPrice = undefined;
        if (type === 'limit' && price) {
            const priceBn = new BigNumber(price);

            // Use dynamic quote precision if available
            const precision = (marketInfo && marketInfo.quote_precision !== undefined) ? marketInfo.quote_precision : market.pricePrecision;
            const priceMultiplier = new BigNumber(10).pow(precision);

            convertedPrice = priceBn
                .multipliedBy(priceMultiplier)
                .integerValue(BigNumber.ROUND_FLOOR)
                .toString();
        }

        // 3. Prepare API Parameters
        const isLong = side === 'buy';
        // tradeSide: true = Long, false = Short

        const params = {
            marketId: market.id,
            tradeSide: isLong,
            direction: isClose, // true = Close Position, false = Open Position
            size: convertedSize,
            leverage: leverage,
            takeProfit: takeProfit || 0,
            stopLoss: stopLoss || 0,
            userAddress: USER_ADDRESS
        };

        console.log("Params:", params);

        if (type === 'limit') {
            if (!convertedPrice) throw new Error("Price is required for limit orders");
            params.price = convertedPrice;
        }

        const endpoint = type === 'limit' ? 'placeLimitOrder' : 'placeMarketOrder';
        const url = `${BASE_URL}/${endpoint}`;

        console.log(`Calling API: ${url}`, params);

        // 4. Call API to get transaction payload
        // Using GET as per documentation examples for placeLimitOrder/placeMarketOrder
        const response = await axios.get(url, {
            params,
            headers: {
                'x-api-key': API_KEY
            }
        });

        if (!response.data || !response.data.success) {
            console.error("API Error:", response.data);
            throw new Error(response.data?.message || 'Failed to build order payload');
        }

        const payloadData = response.data.data;
        console.log("Payload received, building transaction...");

        // 5. Sign and Submit Transaction
        const account = getAccount();

        const transactionPayload = await aptos.transaction.build.simple({
            sender: account.accountAddress,
            data: payloadData
        });

        const committedTxn = await aptos.transaction.signAndSubmitTransaction({
            transaction: transactionPayload,
            signer: account,
        });

        console.log(`Transaction submitted: ${committedTxn.hash}`);

        // 6. Wait for confirmation
        const txResponse = await aptos.waitForTransaction({
            transactionHash: committedTxn.hash,
        });

        if (!txResponse.success) {
            throw new Error(`Transaction failed on-chain: ${txResponse.vm_status}`);
        }

        return {
            success: true,
            hash: committedTxn.hash,
            data: txResponse
        };

    } catch (error) {
        console.error("Order placement failed:", error);
        throw error;
    }
};
