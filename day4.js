var day4 = (() => {
    let sumTotalScratchOffs = (rawInputStr) => {
        let cards = rawInputStr.split(/\n/).filter(el => el);

        let sum = 0;
        let cardCopiesByIndex = cards.map(el => 1);

        cards.forEach((card, index) => {
            let thisCardCount = cardCopiesByIndex[index];
            sum += thisCardCount;

            let numsPart = card.split(/:\s+/)[1];
            assert(numsPart);

            let [winningNumbers, yourNumbers] = numsPart
                .split(/\s+\|\s+/)
                .map(numStr => numStr.split(/\s+/).map(num => parseInt(num, 10)));

            let winningNumbersCount = yourNumbers.filter(n => winningNumbers.indexOf(n) > -1).length;
            if (winningNumbersCount > 0) {
                for (let i = 0; i < winningNumbersCount; i++) {
                    cardCopiesByIndex[index + i + 1] += thisCardCount;
                }
            }
        });

        return cardCopiesByIndex.reduce((a, e) => a + e, 0);
    };

    let sumCardPoints = (rawInputStr) => {
        let cards = rawInputStr.split(/\n/).filter(el => el);

        let sum = 0;
        cards.forEach(card => {
            let numsPart = card.split(/:\s+/)[1];
            assert(numsPart);

            let [winningNumbers, yourNumbers] = numsPart
                .split(/\s+\|\s+/)
                .map(numStr => numStr.split(/\s+/).map(num => parseInt(num, 10)));

            let winningNumbersCount = yourNumbers.filter(n => winningNumbers.indexOf(n) > -1).length;
            if (winningNumbersCount > 0) {
                sum += Math.pow(2, winningNumbersCount - 1);
            }
        });

        return sum;
    };

    return [sumCardPoints, sumTotalScratchOffs];
})();
