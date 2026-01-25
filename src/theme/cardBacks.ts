
export interface CardBack {
    id: string;
    source: any;
}

export const availableCardBacks: CardBack[] = [
    { id: 'default', source: require('../../assets/card_back_splash.png') },
    { id: 'splash_2', source: require('../../assets/card_back_splash_2.png') },
    { id: 'splash_3', source: require('../../assets/card_back_splash_3.png') },
    { id: 'splash_4', source: require('../../assets/card_back_splash_4.png') },
];

export const defaultCardBackId = 'default';
