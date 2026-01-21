import { registerRootComponent } from 'expo';
import React from 'react';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './src/widgets/widget-task-handler';

// Register widget handler first. This must remain lightweight (no heavy dependencies in handler file)
registerWidgetTaskHandler(widgetTaskHandler);

// Lazy load App to prevent Reanimated v4 initialization during background widget tasks
// which crashes on Android Old Architecture
registerRootComponent(() => {
    const App = require('./App').default;
    return React.createElement(App);
});
