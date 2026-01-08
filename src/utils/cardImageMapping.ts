// Full mapping for 78 Tarot Cards (Rider-Waite)
// IDs: 1-22 (Major), 23-36 (Wands), 37-50 (Cups), 51-64 (Swords), 65-78 (Pentacles)

export const cardImages: Record<string, { default: any; fr: any }> = {
    // --- MAJOR ARCANA ---

    "1": { default: require('../assets/images/thefool.png'), fr: require('../assets/images/full_fr.png') },
    "2": { default: require('../assets/images/themagician.png'), fr: require('../assets/images/magician_fr.png') },
    "3": { default: require('../assets/images/thehighpriestess.png'), fr: require('../assets/images/papessa_fr.png') },
    "4": { default: require('../assets/images/theempress.png'), fr: require('../assets/images/empress_fr.png') },
    "5": { default: require('../assets/images/theemperor.png'), fr: require('../assets/images/emperor_fr.png') },
    "6": { default: require('../assets/images/theheirophant1.png'), fr: require('../assets/images/pope_fr.png') },
    "7": { default: require('../assets/images/thelovers.png'), fr: require('../assets/images/lovers_fr.png') },
    "8": { default: require('../assets/images/thechariot.png'), fr: require('../assets/images/cheriot_fr.png') },
    "9": { default: require('../assets/images/strength.png'), fr: require('../assets/images/force_fr.png') },
    "10": { default: require('../assets/images/thehermit.png'), fr: require('../assets/images/hermit_fr.png') },
    "11": { default: require('../assets/images/wheeloffortune.png'), fr: require('../assets/images/wheel_of_fortune_fr.png') },
    "12": { default: require('../assets/images/justice.png'), fr: require('../assets/images/justice_fr.png') },
    "13": { default: require('../assets/images/thehangedman.png'), fr: require('../assets/images/hanged_man_fr.png') },
    "14": { default: require('../assets/images/death.png'), fr: require('../assets/images/death_fr.png') },
    "15": { default: require('../assets/images/temperance.png'), fr: require('../assets/images/temperance_fr.png') },
    "16": { default: require('../assets/images/thedevil1.png'), fr: require('../assets/images/devil_fr.png') },
    "17": { default: require('../assets/images/thetower.png'), fr: require('../assets/images/tower_fr.png') },
    "18": { default: require('../assets/images/thestar.png'), fr: require('../assets/images/star_fr.png') },
    "19": { default: require('../assets/images/themoon.png'), fr: require('../assets/images/moon_fr.png') },
    "20": { default: require('../assets/images/thesun.png'), fr: require('../assets/images/sun_fr.png') },
    "21": { default: require('../assets/images/judgement.png'), fr: require('../assets/images/judgement_fr.png') },
    "22": { default: require('../assets/images/theworld.png'), fr: require('../assets/images/world_fr.png') },

    // --- WANDS ---
    "23": { default: require('../assets/images/aceofwands.png'), fr: require('../assets/images/ace_wands.png') },
    "24": { default: require('../assets/images/twoofwands.png'), fr: require('../assets/images/two_wands_fr.png') },
    "25": { default: require('../assets/images/threeofwands.png'), fr: require('../assets/images/three_wands_fr.png') },
    "26": { default: require('../assets/images/fourofwands.png'), fr: require('../assets/images/four_wands_fr.jpeg') }, // Note .jpeg
    "27": { default: require('../assets/images/fiveofwands.png'), fr: require('../assets/images/five_wands_fr.png') },
    "28": { default: require('../assets/images/sixofwands.png'), fr: require('../assets/images/six_wands_fr.png') },
    "29": { default: require('../assets/images/sevenofwands.png'), fr: require('../assets/images/seven_wands_fr.png') },
    "30": { default: require('../assets/images/eightofwands.png'), fr: require('../assets/images/eight_wands_fr.png') },
    "31": { default: require('../assets/images/nineofwands.png'), fr: require('../assets/images/nine_wands_fr.png') },
    "32": { default: require('../assets/images/tenofwands.png'), fr: require('../assets/images/ten_wands_fr.png') },
    "33": { default: require('../assets/images/pageofwands.png'), fr: require('../assets/images/page_wands.jpeg') }, // Note .jpeg
    "34": { default: require('../assets/images/knightofwands.png'), fr: require('../assets/images/knight_wands.png') },
    "35": { default: require('../assets/images/queenofwands.png'), fr: require('../assets/images/quin_wands.png') }, // Assumed Quin=Queen
    "36": { default: require('../assets/images/kingofwands.png'), fr: require('../assets/images/king_wands.png') },

    // --- CUPS ---
    "37": { default: require('../assets/images/aceofcups.png'), fr: require('../assets/images/ace_cups_fr.png') },
    "38": { default: require('../assets/images/twoofcups.png'), fr: require('../assets/images/two_cups_fr.png') },
    "39": { default: require('../assets/images/threeofcups.png'), fr: require('../assets/images/three_cups_fr.png') },
    "40": { default: require('../assets/images/fourofcups.png'), fr: require('../assets/images/four_cups_fr.png') },
    "41": { default: require('../assets/images/fiveofcups.png'), fr: require('../assets/images/five_cups_fr.png') },
    "42": { default: require('../assets/images/sixofcups1.png'), fr: require('../assets/images/six_cups_fr.jpeg') }, // Note: 1.png and .jpeg
    "43": { default: require('../assets/images/sevenofcups.png'), fr: require('../assets/images/seven_cups_fr.png') },
    "44": { default: require('../assets/images/eightofcups.png'), fr: require('../assets/images/eight_cups_fr.png') },
    "45": { default: require('../assets/images/nineofcups.png'), fr: require('../assets/images/nine_cups_fr.png') },
    "46": { default: require('../assets/images/tenofcups.png'), fr: require('../assets/images/ten_cups_fr.png') },
    "47": { default: require('../assets/images/pageofcups.png'), fr: require('../assets/images/page_cups.png') },
    "48": { default: require('../assets/images/knightofcups.png'), fr: require('../assets/images/knight_cups.png') },
    "49": { default: require('../assets/images/queenofcups.png'), fr: require('../assets/images/quin_cups.png') },
    "50": { default: require('../assets/images/kingofcups.png'), fr: require('../assets/images/king_cups.png') },

    // --- SWORDS ---
    "51": { default: require('../assets/images/aceofswords.png'), fr: require('../assets/images/ace_swards_fr.png') }, // Note 'swards'
    "52": { default: require('../assets/images/twoofswords.png'), fr: require('../assets/images/two_swards_fr.png') },
    "53": { default: require('../assets/images/threeofswords.png'), fr: require('../assets/images/three_swards_fr.png') },
    "54": { default: require('../assets/images/fourofswords.png'), fr: require('../assets/images/four_swards_fr.png') },
    "55": { default: require('../assets/images/fiveofswords.png'), fr: require('../assets/images/five_swards_fr.png') },
    "56": { default: require('../assets/images/sixofswords.png'), fr: require('../assets/images/six_swards_fr.png') },
    "57": { default: require('../assets/images/sevenofswords.png'), fr: require('../assets/images/seven_swards_fr.png') },
    "58": { default: require('../assets/images/eightofswords.png'), fr: require('../assets/images/eight_swards_fr.png') },
    "59": { default: require('../assets/images/nineofswords.png'), fr: require('../assets/images/nine_swards_fr.png') },
    "60": { default: require('../assets/images/tenofswords.png'), fr: require('../assets/images/ten_swards_fr.png') },
    "61": { default: require('../assets/images/pageofswords.png'), fr: require('../assets/images/page_swards_fr.png') },
    "62": { default: require('../assets/images/knightofswords.png'), fr: require('../assets/images/knight_swards_fr.png') },
    "63": { default: require('../assets/images/queenofswords.png'), fr: require('../assets/images/quin_swards_fr.png') },
    "64": { default: require('../assets/images/kingofswords.png'), fr: require('../assets/images/king_swards_fr.png') },

    // --- PENTACLES (COINS) ---
    "65": { default: require('../assets/images/aceofpentacles.png'), fr: require('../assets/images/ace_coins_fr.png') },
    "66": { default: require('../assets/images/twoofpentacles.png'), fr: require('../assets/images/two_coins_fr.png') },
    "67": { default: require('../assets/images/threeofpentacles.png'), fr: require('../assets/images/three_coins_fr.png') },
    "68": { default: require('../assets/images/fourofpentacles.png'), fr: require('../assets/images/four_coins_fr.png') },
    "69": { default: require('../assets/images/fiveofpentacles.png'), fr: require('../assets/images/five_coins_fr.png') },
    "70": { default: require('../assets/images/sixofpentacles.png'), fr: require('../assets/images/six_coins_fr.png') },
    "71": { default: require('../assets/images/sevenofpentacles.png'), fr: require('../assets/images/seven_coins_fr.png') },
    "72": { default: require('../assets/images/eightofpentacles.png'), fr: require('../assets/images/eight_coins_fr.png') },
    "73": { default: require('../assets/images/nineofpentacles.png'), fr: require('../assets/images/nine_coins_fr.png') },
    "74": { default: require('../assets/images/tenofpentacles.png'), fr: require('../assets/images/ten_coins_fr.png') },
    "75": { default: require('../assets/images/pageofpentacles.png'), fr: require('../assets/images/page_coins_fr.png') },
    "76": { default: require('../assets/images/knightofpentacles.png'), fr: require('../assets/images/knight_coins_fr.png') },
    "77": { default: require('../assets/images/queenofpentacles.png'), fr: require('../assets/images/quin_coins_fr.png') },
    "78": { default: require('../assets/images/kingofpentacles.png'), fr: require('../assets/images/king_coins_fr.png') },
};

export const getCardImage = (cardId: string, language: string) => {
    // If we're strictly dealing with IDs 1-78 as strings, we can normalize
    const id = String(cardId);

    const images = cardImages[id];
    if (!images) {
        console.warn(`Image not found for card ID: ${cardId}`);
        // Fallback
        return { uri: 'https://via.placeholder.com/300x500.png?text=Card+Not+Found' };
    }

    // Check if french is selected (exact 'fr' or 'fr-FR' etc)
    if (language === 'fr' || language.startsWith('fr-')) {
        return images.fr;
    }

    return images.default;
};
