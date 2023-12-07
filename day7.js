var day7 = (() => {
    const FIVE_OF_A_KIND = 6;
    const FOUR_OF_A_KIND = 5;
    const FULL_HOUSE = 4;
    const THREE_OF_A_KIND = 3;
    const TWO_PAIR = 2;
    const PAIR = 1;
    const HIGH_CARD = 0;

    let getHandTypeRankWithJokers = (hand) => {
        let totals = {};
        hand.split('').forEach(card => {
            if (totals[card] === undefined) {
                totals[card] = 0;
            }
            totals[card]++;
        });

        if (totals['J'] === undefined) {
            return getHandTypeRank(hand);
        }

        let totalsMinusJokers = { ...totals };
        delete(totalsMinusJokers['J']);

        let numDifferentCardsMinusJokers = Object.keys(totalsMinusJokers).length;
        if (numDifferentCardsMinusJokers <= 1) {
            return FIVE_OF_A_KIND;
        }

        if (numDifferentCardsMinusJokers === 2) {
            // either four of a kind or full house.
            // The only full house scenario is if there's exactly 2 of each and one J, right?
            // all others would be 4-of-a-kind?
            if (Object.values(totalsMinusJokers).filter(el => el === 2).length === 2) {
                return FULL_HOUSE;
            }

            return FOUR_OF_A_KIND;
        }

        if (numDifferentCardsMinusJokers === 4) {
            return PAIR;
        }

        // so this means there are 3 different cards (minus jokers)
        return THREE_OF_A_KIND;
    };

    assert(getHandTypeRankWithJokers('AAJJJ') === FIVE_OF_A_KIND);
    assert(getHandTypeRankWithJokers('JJJJJ') === FIVE_OF_A_KIND);
    assert(getHandTypeRankWithJokers('AAAAJ') === FIVE_OF_A_KIND);
    assert(getHandTypeRankWithJokers('AKAAJ') === FOUR_OF_A_KIND);
    assert(getHandTypeRankWithJokers('AKKAJ') === FULL_HOUSE);
    assert(getHandTypeRankWithJokers('AKJJJ') === FOUR_OF_A_KIND);
    assert(getHandTypeRankWithJokers('AKQJJ') === THREE_OF_A_KIND);
    assert(getHandTypeRankWithJokers('AKQTJ') === PAIR);
    assert(getHandTypeRankWithJokers('AKQQJ') === THREE_OF_A_KIND);

    // return >0 if handA is higher, <0 if handB is higher
    let compareHighCardWithJokers = (handA, handB) => {
        let order = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 1, 'T': 10, 9: 9, 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2,
        };

        for (let i = 0; i < handA.length; i++) {
            let cardA = handA[i];
            let cardB = handB[i];

            let possibleResult = order[cardA] - order[cardB];
            if (possibleResult !== 0) {
                return possibleResult;
            }
        }

        assert(false, 'No hands should be exactly alike??');
    };


    let sumTotalRankedWinningsWithJokers = (rawInputString) => {
        let handsAndBids = rawInputString.split(/\n/).filter(el => el).map(n => {
            let result = n.split(/\s+/).filter(el => el);
            result[1] = parseInt(result[1], 10);
            return result;
        });

        handsAndBids.sort((a, b) => {
            let result = getHandTypeRankWithJokers(a[0]) - getHandTypeRankWithJokers(b[0]);
            if (result !== 0) {
                return result;
            }

            return compareHighCardWithJokers(a[0], b[0]);
        });

        return handsAndBids.reduce((a, e, i) => e[1] * (i + 1) + a, 0);
    };

    let getHandTypeRank = (hand) => {
        let totals = {};
        hand.split('').forEach(card => {
            if (totals[card] === undefined) {
                totals[card] = 0;
            }
            totals[card]++;
        });

        let numDifferentCards = Object.keys(totals).length;
        if (numDifferentCards === 1) {
            return FIVE_OF_A_KIND;
        }

        let highestTotal = Object.values(totals).sort(numericSortLowestToHighestComparator).pop();
        if (numDifferentCards === 2) {
            if (highestTotal === 4) {
                return FOUR_OF_A_KIND;
            }

            return FULL_HOUSE;
        }

        if (numDifferentCards === 3) {
            if (highestTotal === 3) {
                return THREE_OF_A_KIND;
            }

            return TWO_PAIR;
        }

        return highestTotal === 2 ? PAIR : HIGH_CARD;
    };

    // return >0 if handA is higher, <0 if handB is higher
    let compareHighCard = (handA, handB) => {
        let order = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10, 9: 9, 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2,
        };

        for (let i = 0; i < handA.length; i++) {
            let cardA = handA[i];
            let cardB = handB[i];

            let possibleResult = order[cardA] - order[cardB];
            if (possibleResult !== 0) {
                return possibleResult;
            }
        }

        assert(false, 'No hands should be exactly alike??');
    };

    assert(compareHighCard('TAAAA', 'ATTTT') < 0);

    assert(getHandTypeRank('AAAAA') === FIVE_OF_A_KIND);
    assert(getHandTypeRank('AQAAA') === FOUR_OF_A_KIND);
    assert(getHandTypeRank('AQAQA') === FULL_HOUSE);
    assert(getHandTypeRank('ATAQA') === THREE_OF_A_KIND);
    assert(getHandTypeRank('AAQQK') === TWO_PAIR);
    assert(getHandTypeRank('AAQTK') === PAIR);
    assert(getHandTypeRank('A2345') === HIGH_CARD);

    let sumTotalRankedWinnings = (rawInputString) => {
        let handsAndBids = rawInputString.split(/\n/).filter(el => el).map(n => {
            let result = n.split(/\s+/).filter(el => el);
            result[1] = parseInt(result[1], 10);
            return result;
        });

        handsAndBids.sort((a, b) => {
            let result = getHandTypeRank(a[0]) - getHandTypeRank(b[0]);
            if (result !== 0) {
                return result;
            }

            return compareHighCard(a[0], b[0]);
        });

        return handsAndBids.reduce((a, e, i) => e[1] * (i + 1) + a, 0);
    };

    return [sumTotalRankedWinnings, sumTotalRankedWinningsWithJokers];
})();
