var day1 = (() => {
    let sumFirstLastDigitPairs = (rawListString) => {
        let strings = rawListString.split(/\n/).filter(el => el);
        let nums = strings.map(str => {
            let digits = str.split('').filter(letter => letter.search(/\d/) > -1);
            return parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
        });
        return nums.reduce((a, e) => a + e, 0);
    };

    let sumFirstLastDigitPairsWithSpellings = (rawListString) => {
        let strings = rawListString.split(/\n/).filter(el => el);
        let searchValuesMap = {
            0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
            one: 1,
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            six: 6,
            seven: 7,
            eight: 8,
            nine: 9,
        };
        let nums = strings.map(str => {
            let firstDigitKey = null;
            let indexMin = str.length;
            Object.keys(searchValuesMap).forEach(val => {
                let index = str.indexOf(val);
                if (index === -1) {
                    return;
                }

                if (index < indexMin) {
                    firstDigitKey = val;
                    indexMin = index;
                }
            });

            let secondDigitKey = null;
            let indexMax = -1;
            Object.keys(searchValuesMap).forEach(val => {
                let index = str.lastIndexOf(val);
                if (index === -1) {
                    return;
                }

                if (index > indexMax) {
                    secondDigitKey = val;
                    indexMax = index;
                }
            });

            return parseInt(`${searchValuesMap[firstDigitKey]}${searchValuesMap[secondDigitKey]}`, 10);
        });

        return nums.reduce((a, e) => a + e, 0);
    };

    return [sumFirstLastDigitPairs, sumFirstLastDigitPairsWithSpellings];
})();
