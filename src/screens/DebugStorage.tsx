import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export default function DebugStorage() {
    const [logs, setLogs] = React.useState<string[]>([]);

    const addLog = (msg: string) => setLogs(p => [...p, msg]);

    const checkPrefs = async () => {
        addLog('Checking Shared Prefs...');
        try {
            // Android internal storage layout often: /data/user/0/com.package/files/...
            // FileSystem.documentDirectory is .../files/
            // So shared_prefs is ../shared_prefs/

            // 1. Get Parent Dir
            // documentDirectory ends with '/', so exclude it to split
            const docDir = FileSystem.documentDirectory;
            if (!docDir) {
                addLog('No documentDirectory');
                return;
            }

            // Move up from 'files/' to package root
            const rootDir = docDir.replace('files/', '');
            addLog(`Root: ${rootDir}`);

            const prefsDir = rootDir + 'shared_prefs/';
            addLog(`Prefs Dir: ${prefsDir}`);

            const info = await FileSystem.getInfoAsync(prefsDir);
            if (!info.exists) {
                addLog('Prefs dir does not exist (or no permission?)');
                return;
            }

            const files = await FileSystem.readDirectoryAsync(prefsDir);
            addLog(`Files: ${JSON.stringify(files)}`);

            for (const file of files) {
                if (file.includes('preferences') || file.includes('xml')) {
                    addLog(`Reading ${file}...`);
                    const content = await FileSystem.readAsStringAsync(prefsDir + file);
                    addLog(`--- START ${file} ---`);
                    addLog(content.substring(0, 500)); // First 500 chars
                    addLog(`--- END ${file} ---`);
                }
            }

        } catch (e) {
            addLog(`Error: ${e.message}`);
        }
    };

    return (
        <ScrollView style={{ padding: 20, marginTop: 50 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Debug Storage</Text>
            <Button title="Check Prefs" onPress={checkPrefs} />
            {logs.map((l, i) => <Text key={i} style={{ fontFamily: 'monospace', fontSize: 10, marginVertical: 2 }}>{l}</Text>)}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}
