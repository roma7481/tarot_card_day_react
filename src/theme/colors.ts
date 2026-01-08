// Semantic Theme Definitions

export interface ThemeType {
    colors: {
        // Semantic Names
        background: readonly [string, string, ...string[]];
        surface: string;
        text: string;
        textSub: string;
        primary: string;
        border: string;
        icon: string;

        // Legacy / Specifics 
        gold: string;
        silver: string;

        // Status
        success: string;
        error: string;
    };
}

export const darkTheme: ThemeType = {
    colors: {
        background: ['#0f172a', '#312e81', '#4c1d95'] as const, // Dusk Gradient
        surface: '#1e1e38',
        text: '#f1f5f9',
        textSub: '#94a3b8',
        primary: '#A78BFA',
        border: 'rgba(255, 255, 255, 0.1)',
        icon: '#A78BFA',

        gold: '#C5A059',
        silver: '#94a3b8',

        success: '#34D399',
        error: '#F87171',
    }
};

export const lightTheme: ThemeType = {
    colors: {
        background: ['#e0f2fe', '#ede9fe', '#ffe4e6'] as const, // Dawn Gradient
        surface: '#ffffff',
        text: '#334155',
        textSub: '#64748b',
        primary: '#8b5cf6',
        border: 'rgba(51, 65, 85, 0.1)',
        icon: '#8b5cf6',

        gold: '#d97706',
        silver: '#64748b',

        success: '#059669',
        error: '#dc2626',
    }
};

export const etherealTheme: ThemeType = {
    colors: {
        background: ['#0f1c15', '#1f3a2d', '#2d4a3e'] as const, // Forest Gradient (Dark Mode)
        surface: '#1f3a2d', // Garden Dark
        text: '#fdfbf7', // Cream Soft
        textSub: '#dbece2', // Moss Soft
        primary: '#84A98C', // Sage Green (from Journal Entry)
        border: 'rgba(219, 236, 226, 0.15)',
        icon: '#84A98C', // Sage Green for consistent iconography

        gold: '#A67C52', // Accent Bronze
        silver: '#52796F', // Primary Dark (Forest)

        success: '#059669',
        error: '#dc2626',
    }
};

export interface ThemeMeta {
    id: string;
    name: string;
    theme: ThemeType;
}

export const themes: Record<string, ThemeMeta> = {
    'dark': { id: 'dark', name: 'Dusk (Dark)', theme: darkTheme },
    'light': { id: 'light', name: 'Dawn (Light)', theme: lightTheme },
    'ethereal': { id: 'ethereal', name: 'Ethereal Garden', theme: etherealTheme },
};

export const defaultThemeId = 'dark';

export const colors = {
    // Compatibility
    dawnDark: '#2e1065',
    dawnText: '#4c1d95',
    gold: '#C5A059',
    goldLight: '#E5C585',
    silver: '#94a3b8',
    skySoft: '#e0f2fe',
    lavenderSoft: '#ede9fe',
    roseSoft: '#ffe4e6',
    backgroundDark: '#0f172a',
    surfaceDark: '#1e1e38',
    textLight: '#f1f5f9',
    textMuted: '#94a3b8',
    primaryButton: '#A78BFA',
};

export const gradients = {
    dusk: darkTheme.colors.background, // Dark mode gradient
    dawn: lightTheme.colors.background, // Light mode gradient
    gold: ['rgba(197, 160, 89, 0.4)', 'rgba(50, 40, 120, 0.3)', 'rgba(224, 242, 254, 0.4)'] as const,
};
