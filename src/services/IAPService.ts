import { Platform, Alert } from 'react-native';
import {
    initConnection,
    endConnection,
    getAvailablePurchases,
    requestPurchase,
    purchaseUpdatedListener,
    purchaseErrorListener,
    finishTransaction,
    Product,
    Purchase,
    PurchaseError,
    fetchProducts
} from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adService } from './AdService';

const PRODUCT_ID_PREMIUM = 'card_day_premium';
const PRODUCT_ID_NO_ADS = 'card_day_no_ads'; // Keep for legacy or alternative

const ITEM_SKUS = Platform.select({
    android: [PRODUCT_ID_PREMIUM, PRODUCT_ID_NO_ADS],
    ios: [PRODUCT_ID_PREMIUM, PRODUCT_ID_NO_ADS],
}) as string[];

class IAPService {
    private isConnected: boolean = false;
    private products: Product[] = [];
    private purchaseUpdateSubscription: any = null;
    private purchaseErrorSubscription: any = null;
    private isPremium: boolean = false;
    private listenersSetup: boolean = false;

    constructor() { }

    async initialize() {
        if (this.isConnected) {
            console.log('[IAPService] Already connected.');
            return;
        }

        try {
            console.log('[IAPService] Initializing connection...');
            await initConnection();
            this.isConnected = true;
            console.log('[IAPService] Connected.');

            this.setupListeners();

            // Initial check and fetch
            await this.fetchProducts();
            await this.checkPremium();

        } catch (err) {
            console.warn('[IAPService] Initialization error:', err);
        }
    }

    private setupListeners() {
        if (this.listenersSetup) return;

        this.purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: Purchase) => {
                console.log('[IAPService] Purchase updated:', purchase);
                const receipt = (purchase as any).transactionReceipt;

                if (receipt) {
                    try {
                        await finishTransaction({ purchase, isConsumable: false });
                        await this.checkPremium();
                        // You might want to emit an event here or use a callback if UI needs legal update
                        Alert.alert("Success", "Purchase successful!");
                    } catch (ackErr) {
                        console.warn('[IAPService] parametersackErr', ackErr);
                    }
                } else {
                    // Android fallback
                    try {
                        await finishTransaction({ purchase, isConsumable: false });
                        await this.checkPremium();
                        Alert.alert("Success", "Purchase successful!");
                    } catch (e) { console.warn(e) }
                }
            }
        );

        this.purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
                console.warn('[IAPService] Purchase error:', error);
                const code = error.code || error.responseCode;

                if (
                    code === 'user-cancelled' ||
                    code === 'E_USER_CANCELLED' ||
                    code === 1 ||
                    error.message === 'User cancelled the operation'
                ) {
                    return; // User cancelled
                }

                Alert.alert("Purchase Failed", error.message);
            }
        );

        this.listenersSetup = true;
    }

    async fetchProducts() {
        try {
            if (!this.isConnected) await initConnection(); // Safety

            const prods = await fetchProducts({ skus: ITEM_SKUS });
            this.products = prods;
            console.log('[IAPService] Products fetched:', prods.length);
        } catch (err) {
            console.warn('[IAPService] Fetch products error:', err);
        }
    }

    getProducts(): Product[] {
        return this.products;
    }

    async requestPurchase(sku: string) {
        try {
            await requestPurchase({
                sku,
                andDangerouslyFinishTransactionAutomaticallyIOS: false,
            } as any);
        } catch (err) {
            console.warn('[IAPService] Request purchase error:', err);
            throw err;
        }
    }

    async restorePurchases() {
        try {
            if (!this.isConnected) await initConnection();

            const purchases = await getAvailablePurchases();
            console.log('[IAPService] Restored purchases:', purchases.length);

            if (purchases.length > 0) {
                await this.checkPremium();
                return true;
            }
            return false;
        } catch (err) {
            console.warn('[IAPService] Restore error:', err);
            throw err;
        }
    }

    async checkPremium(): Promise<boolean> {
        try {
            // 1. Check Dev Override
            if (__DEV__) {
                const devOverride = await AsyncStorage.getItem('DEV_PREMIUM_OVERRIDE');
                if (devOverride === 'true') {
                    console.log('[IAPService] DEV Override Active');
                    this.setPremiumStatus(true);
                    return true;
                }
            }

            // 2. Real Check
            if (!this.isConnected) {
                // Try to init if not connected, but be careful of loops? 
                // Actually initConnection is safe to call multiple times in RNIap?? 
                // No, we should rely on initialize() being called.
                // But for robustness:
                try { await initConnection(); this.isConnected = true; } catch (e) { }
            }

            const purchases = await getAvailablePurchases();
            let hasPremium = false;

            purchases.forEach(purchase => {
                if (purchase.productId === PRODUCT_ID_PREMIUM || purchase.productId === PRODUCT_ID_NO_ADS) {
                    hasPremium = true;
                }
            });

            this.setPremiumStatus(hasPremium);
            return hasPremium;

        } catch (e) {
            console.error('[IAPService] Error checking premium:', e);
            // Fallback to cache if error (or just keep current state)
            return this.isPremium;
        }
    }

    // Internal helper to update state and cache
    private async setPremiumStatus(status: boolean) {
        this.isPremium = status;
        adService.setPremium(status);
        await AsyncStorage.setItem('IS_PREMIUM_USER', status ? 'true' : 'false');
    }

    getPremiumStatus(): boolean {
        return this.isPremium;
    }

    dispose() {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
        endConnection();
        this.isConnected = false;
        this.listenersSetup = false;
    }
}

export const iapService = new IAPService();
