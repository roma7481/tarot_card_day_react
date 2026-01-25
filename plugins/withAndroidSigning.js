const { withAppBuildGradle, withGradleProperties, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const KEYSTORE_FILENAME_SRC = '@cbeeapps__tarot_card_day_OLD_1.jks';
const KEYSTORE_FILENAME_DEST = 'cbeeapps__tarot_card_day_OLD_1.jks';
const KEY_ALIAS = 'cbeeapps__tarot_card_day_OLD_1';
const KEY_PASSWORD = 'YOUR_PASSWORD_HERE'; // Placeholder, user might want to edit this or I use what I saw
const STORE_PASSWORD = 'YOUR_PASSWORD_HERE';

const withAndroidSigning = (config, options) => {
    // 1. Copy Keystore file to android/app directory
    config = withDangerousMod(config, [
        'android',
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const androidAppDir = path.join(config.modRequest.platformProjectRoot, 'app');

            const srcPath = path.join(projectRoot, KEYSTORE_FILENAME_SRC);
            const destPath = path.join(androidAppDir, KEYSTORE_FILENAME_DEST);

            if (fs.existsSync(srcPath)) {
                // Ensure android/app exists (it should during prebuild)
                if (!fs.existsSync(androidAppDir)) {
                    fs.mkdirSync(androidAppDir, { recursive: true });
                }
                fs.copyFileSync(srcPath, destPath);
                console.log(`[withAndroidSigning] Copied keystore from ${srcPath} to ${destPath}`);
            } else {
                console.warn(`[withAndroidSigning] Warning: Keystore file not found at ${srcPath}`);
            }
            return config;
        },
    ]);

    // 2. Add Gradle Properties
    config = withGradleProperties(config, (config) => {
        // Check if properties already exist to avoid duplicates if possible, or just overwrite/append
        const propertiesToAdd = [
            { key: 'MYAPP_UPLOAD_STORE_FILE', value: KEYSTORE_FILENAME_DEST },
            { key: 'MYAPP_UPLOAD_KEY_ALIAS', value: KEY_ALIAS },
            { key: 'MYAPP_UPLOAD_STORE_PASSWORD', value: options?.storePassword || '123456' },
            { key: 'MYAPP_UPLOAD_KEY_PASSWORD', value: options?.keyPassword || '123456' },
        ];

        propertiesToAdd.forEach(prop => {
            const existing = config.modResults.find(item => item.key === prop.key);
            if (existing) {
                existing.value = prop.value;
            } else {
                config.modResults.push({ type: 'property', key: prop.key, value: prop.value });
            }
        });

        return config;
    });

    // 3. Update android/app/build.gradle
    config = withAppBuildGradle(config, (config) => {
        let buildGradle = config.modResults.contents;

        // Add release signing config block if not present
        const releaseSigningBlock = `
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }`;

        if (!buildGradle.includes("storeFile file(MYAPP_UPLOAD_STORE_FILE)")) {
            // Insert inside signingConfigs
            // Look for 'signingConfigs {'
            // Note: Expo often puts 'signingConfigs {\n        debug { ... } \n    }'

            // Robust insertion: Find the end of "debug { ... }" block inside signingConfigs
            // Simple string replacement for now assuming standard Expo template structure

            const signingConfigsRegex = /signingConfigs\s*{[^}]*debug\s*{[^}]*}/s;
            const match = buildGradle.match(signingConfigsRegex);

            if (match) {
                const closingBraceIndex = match[0].lastIndexOf('}');
                // Insert release block before the closing brace of signingConfigs? 
                // No, the regex matches the debug block closing brace usually.
                // Let's replace 'signingConfigs {' with 'signingConfigs { \n' + releaseSigningBlock + '\n' 
                // BUT we want it separate.

                // Easier: Replace the debug block end with debug block end + release block
                // config.modResults.contents = buildGradle.replace(/(signingConfigs\s*{[\s\S]*?debug\s*{[\s\S]*?})/, '$1' + releaseSigningBlock);
                // This is a bit risky with regex.

                // Alternative: append to the end of debug block?

                // Let's try locating "signingConfigs {" and just prepending/appending inside.

                if (buildGradle.includes('signingConfigs {')) {
                    config.modResults.contents = buildGradle.replace(
                        'signingConfigs {',
                        'signingConfigs {' + releaseSigningBlock
                    );
                }
            }
        }

        // Update buildTypes.release to use the release signing config
        // Replace "signingConfig signingConfigs.debug" with "signingConfig signingConfigs.release" inside release block
        // OR if it's not set, ensure it is set.

        // Standard Expo template has 'signingConfig signingConfigs.debug' in release.
        if (config.modResults.contents.includes('signingConfig signingConfigs.debug')) {
            // Only replace the one inside release { ... }?
            // We can do a global replace if we want debug to also use release keys? No.
            // We have to be specific.

            // Find release block
            const releaseBlockRegex = /buildTypes\s*{[\s\S]*?release\s*{([\s\S]*?)}/s;
            const releaseMatch = config.modResults.contents.match(releaseBlockRegex);

            if (releaseMatch && releaseMatch[1].includes('signingConfig signingConfigs.debug')) {
                config.modResults.contents = config.modResults.contents.replace(
                    /buildTypes\s*{([\s\S]*?)release\s*{([\s\S]*?)signingConfig signingConfigs\.debug([\s\S]*?)}/s,
                    'buildTypes {$1release {$2signingConfig signingConfigs.release$3}'
                );
            }
        }

        return config;
    });

    return config;
};

module.exports = withAndroidSigning;
