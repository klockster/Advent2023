var day9 = (() => {

    let getPreviousHistoricalNumber = (sequence) => {
        let isFinished = (seq) => seq.filter(el => el === 0).length === seq.length;

        let allSequences = [];
        let current = sequence;
        while (!isFinished(current)) {
            allSequences.push(current);

            let next = [];
            for (let i = 0; i < current.length - 1; i++) {
                next.push(current[i + 1] - current[i]);
            }

            current = next;
        }

        allSequences.push(current);
        allSequences = allSequences.reverse();
        allSequences.forEach((seq, i) => {
            if (i === allSequences.length - 1) {
                return;
            }

            let diff = allSequences[i + 1][0] - seq[0];
            allSequences[i + 1].unshift(diff);
        });

        return allSequences[allSequences.length - 1][0];
    };

    let sumBeginningHistoryNumbers = (rawInputString) => {
        let sequences = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split(/\s+/).filter(el => el).map(n => parseInt(n, 10)));

        return sequences.map(seq => getPreviousHistoricalNumber(seq)).reduce((a, e) => a + e, 0);
    };

    let getNextHistoricalNumber = (sequence) => {
        let isFinished = (seq) => seq.filter(el => el === 0).length === seq.length;

        let allSequences = [];
        let current = sequence;
        while (!isFinished(current)) {
            allSequences.push(current);

            let next = [];
            for (let i = 0; i < current.length - 1; i++) {
                next.push(current[i + 1] - current[i]);
            }

            current = next;
        }

        return allSequences.map(seq => seq[seq.length - 1]).reduce((a, e) => a + e, 0);
    };

    let sumAddedHistoryNumbers = (rawInputString) => {
        let sequences = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split(/\s+/).filter(el => el).map(n => parseInt(n, 10)));


        return sequences.map(seq => getNextHistoricalNumber(seq))
            .reduce((a, e) => a + e, 0);
    };

    return [sumAddedHistoryNumbers, sumBeginningHistoryNumbers];
})();
