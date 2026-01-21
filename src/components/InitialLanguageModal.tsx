import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LANGUAGES } from '../i18n/languages';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';

interface InitialLanguageModalProps {
    visible: boolean;
    onSelect: (langCode: string) => void;
}

export const InitialLanguageModal: React.FC<InitialLanguageModalProps> = ({ visible, onSelect }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    // If visible, we want to ensure we catch attention.
    // Using a distinct style from settings to make it look like a setup step.

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {t('settings.selectLanguage')}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSub }]}>
                        Please choose your preferred language
                    </Text>

                    <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                        {LANGUAGES.map((lang, index) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.option,
                                    { borderBottomColor: theme.colors.border },
                                    index === LANGUAGES.length - 1 && { borderBottomWidth: 0 }
                                ]}
                                onPress={() => onSelect(lang.code)}
                            >
                                <Text style={[styles.langName, { color: theme.colors.text }]}>
                                    {lang.label}
                                </Text>
                                {/* We don't show checkmark here because nothing is selected yet presumably, 
                    or we could verify against device locale, but simpler is clean list */}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)', // Darker background for focus
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        // Shadow for elevation
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Manrope_700Bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Manrope_500Medium',
        textAlign: 'center',
        marginBottom: 24,
    },
    list: {
        maxHeight: 400,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        borderBottomWidth: 1,
    },
    langName: {
        fontSize: 17,
        fontFamily: 'Manrope_600SemiBold',
    }
});
