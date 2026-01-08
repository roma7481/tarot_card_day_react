const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

const withAppLovin = (config, { androidSdkKey, iosSdkKey }) => {
    config = withAppLovinAndroid(config, androidSdkKey);
    config = withAppLovinIOS(config, iosSdkKey);
    return config;
};

const withAppLovinAndroid = (config, sdkKey) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;
        const mainApplication = androidManifest.manifest.application[0];

        // Check if meta-data already exists
        let metaData = mainApplication['meta-data'] || [];
        const hasKey = metaData.some(
            (item) => item.$['android:name'] === 'applovin.sdk.key'
        );

        if (!hasKey) {
            metaData.push({
                $: {
                    'android:name': 'applovin.sdk.key',
                    'android:value': sdkKey,
                },
            });
            mainApplication['meta-data'] = metaData;
        }

        return config;
    });
};

const withAppLovinIOS = (config, sdkKey) => {
    return withInfoPlist(config, async (config) => {
        config.modResults.AppLovinSdkKey = sdkKey;
        return config;
    });
};

module.exports = withAppLovin;
