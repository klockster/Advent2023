var day2 = (() => {
    let sumMinimumGameCubePowers = (rawInputString) => {
        let gameStrings = rawInputString.split(/\n/).filter(el => el);


        return gameStrings.map(str => {
            let minCubes = {};

            let matches = str.match(/Game (\d+):/);
            assert(matches !== null);
            let id = parseInt(matches[1], 10);
            assert(id > 0);

            let allRoundsString = str.split(/:\s+/)[1];

            let allRounds = allRoundsString.split(/;\s+/);

            allRounds.forEach(round => {
                let cubes = round.split(/,\s+/);
                cubes.forEach(cube => {
                    let cubeMatches = cube.match(/(\d+) (red|blue|green|)/);
                    assert(cubeMatches !== null);
                    let num = parseInt(cubeMatches[1], 10);
                    let color = cubeMatches[2];

                    if (
                        minCubes[color] === undefined ||
                        num > minCubes[color]
                    ) {
                        minCubes[color] = num;
                    }
                });
            });

            return (minCubes.red || 0) * (minCubes.green || 0) * (minCubes.blue || 0);
        }).reduce((a, e) => a + e, 0);
    };

    let sumGameIdsForPossibleGames = (rawInputString) => {
        let gameStrings = rawInputString.split(/\n/).filter(el => el);
        let maxCubes = {
            red: 12,
            green: 13,
            blue: 14,
        };

        return gameStrings.map(str => {
            let matches = str.match(/Game (\d+):/);
            assert(matches !== null);
            let id = parseInt(matches[1], 10);
            assert(id > 0);

            let allRoundsString = str.split(/:\s+/)[1];

            let allRounds = allRoundsString.split(/;\s+/);

            let isPossible = true;

            allRounds.forEach(round => {
                let cubes = round.split(/,\s+/);
                cubes.forEach(cube => {
                    let cubeMatches = cube.match(/(\d+) (red|blue|green|)/);
                    assert(cubeMatches !== null);
                    let num = cubeMatches[1];
                    let color = cubeMatches[2];

                    assert(maxCubes[color]);
                    if (num > maxCubes[color]) {
                        isPossible = false;
                    }
                });
            });

            return isPossible ? id : 0;
        }).reduce((a, e) => a + e, 0);

    };

    return [sumGameIdsForPossibleGames, sumMinimumGameCubePowers];
})();
