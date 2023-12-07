var day6 = (() => {
    let getWaysToWinSingle = (rawInputString) => {
        let [time, dist] = rawInputString.split(/\n/).slice(0, 2)
            .map(n => parseInt(n.split(/:\s+/)[1].split(/\s+/).join(''), 10));

        let result = 0;
        for (let i = 1; i < time; i++) {
            let distanceTravelled = (time - i) * i;
            if (distanceTravelled > dist) {
                result++;
            }
        }

        return result;
    };

    let multiplyWaysToWin = (rawInputString) => {
        let [times, distances] = rawInputString.split(/\n/).slice(0, 2)
            .map(n => n.split(/:\s+/)[1].split(/\s+/).map(num => parseInt(num, 10)));

        let waysToWin = times.map((t, index) => {
            let result = 0;
            let distanceToBeat = distances[index];
            for (let i = 1; i < t; i++) {
                let distanceTravelled = (t - i) * i;
                if (distanceTravelled > distanceToBeat) {
                    result++;
                }
            }

            return result;
        });

        return waysToWin.reduce((a, e) => a * e, 1);
    };

    return [multiplyWaysToWin, getWaysToWinSingle];
})();
