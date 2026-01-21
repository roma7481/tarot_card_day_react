const { withProjectBuildGradle, withAppBuildGradle } = require('@expo/config-plugins');

const withFirebaseFixed = (config) => {
    return withAppBuildGradle(withProjectBuildGradle(config, (config) => {
        if (!config.modResults.contents.includes('com.google.firebase:firebase-crashlytics-gradle')) {
            if (config.modResults.contents.includes('com.google.gms:google-services')) {
                config.modResults.contents = config.modResults.contents.replace(
                    /classpath\s+['"]com.google.gms:google-services:[^'"]+['"]/,
                    (match) => `${match}\n        classpath 'com.google.firebase:firebase-crashlytics-gradle:3.0.6'`
                );
            } else {
                config.modResults.contents = config.modResults.contents.replace(
                    /dependencies\s*{/,
                    `dependencies {
            classpath 'com.google.gms:google-services:4.4.1'
            classpath 'com.google.firebase:firebase-crashlytics-gradle:3.0.6'`
                );
            }
        }
        return config;
    }), (config) => {
        if (!config.modResults.contents.includes('com.google.firebase.crashlytics')) {
            config.modResults.contents += `
apply plugin: 'com.google.firebase.crashlytics'
`;
        }
        return config;
    });
};

module.exports = withFirebaseFixed;
