
import React from 'react';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';

interface DailyTarotWidgetProps {
    cardName?: string;
    imageUri?: string;
    date?: string;
    theme?: 'light' | 'dark';
    transparency?: number; // 0 (opaque) to 1 (transparent) - actually, usually 0 to 100 in UI, let's stick to 0-1 here effectively.
    // UI Slider 0-100 -> Backend 0-1.
    // However, if we follow common opacity, 0 is transparent, 1 is opaque.
    // "Transparency" usually means 0% = Opaque, 100% = Transparent.
    // Let's assume input is 0-100 where 100 is fully transparent.
    showDate?: boolean;
}

export const DailyTarotWidget = ({
    cardName,
    imageUri,
    date,
    theme = 'dark',
    transparency = 0, // 0% transparency (fully opaque)
    showDate = true
}: DailyTarotWidgetProps) => {

    // Calculate Alpha
    // transparency 0 -> alpha FF (255)
    // transparency 100 -> alpha 00 (0)
    // alpha = 255 * (1 - transparency/100)

    const alphaVal = Math.round(255 * (1 - (transparency / 100)));
    const alphaHex = alphaVal.toString(16).padStart(2, '0').toUpperCase();

    const isDark = theme === 'dark';

    // Background Colors
    // Dark: #0F172A (Slate 900)
    // Light: #FFFFFF
    const bgBase = isDark ? '#0F172A' : '#FFFFFF';
    const bgColor = `${bgBase}${alphaHex}`;

    // Text Colors
    const titleColor = isDark ? '#F1F5F9' : '#1E293B'; // Slate 100 : Slate 800
    const subtitleColor = isDark ? '#94A3B8' : '#64748B'; // Slate 400 : Slate 500

    // Placeholder Background
    const placeholderBg = isDark ? '#1E293B' : '#E2E8F0'; // Slate 800 : Slate 200
    const placeholderText = isDark ? '#94A3B8' : '#94A3B8'; // Slate 400

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: bgColor as any,
                borderRadius: 16,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
            }}
            clickAction="OPEN_APP"
        >
            {imageUri ? (
                <ImageWidget
                    // @ts-ignore
                    image={imageUri}
                    imageWidth={80}
                    imageHeight={120}
                    radius={8}
                    style={{ marginRight: 16 }}
                />
            ) : (
                <FlexWidget
                    style={{
                        width: 80,
                        height: 120,
                        backgroundColor: placeholderBg,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                    }}
                >
                    <TextWidget
                        text="?"
                        style={{
                            fontSize: 32,
                            color: placeholderText,
                            fontWeight: 'bold',
                        }}
                    />
                </FlexWidget>
            )}

            <FlexWidget style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                {showDate && (
                    <TextWidget
                        text={date || "Daily Tarot"}
                        style={{
                            fontSize: 12,
                            color: subtitleColor,
                            marginBottom: 4,
                            fontFamily: 'sans-serif-medium'
                        }}
                    />
                )}
                <TextWidget
                    text={cardName || "Tap to Reveal Your Card"}
                    style={{
                        fontSize: 14,
                        color: titleColor,
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif-condensed'
                    }}
                    maxLines={2}
                />
            </FlexWidget>
        </FlexWidget>
    );
};
