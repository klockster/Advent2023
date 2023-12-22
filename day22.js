var day22 = (() => {
    let findChainReactionCounts = (rawInputString) => {
        let brickEndCoordPairs = rawInputString.split(/\n/).filter(el => el)
            .map(line => line.split('~').map(coordString => coordString.split(',').map(n => parseInt(n, 10))));

        brickEndCoordPairs.sort((a, b) => {
            let minZcoordA = Math.min(a[0][2], a[1][2]);
            let minZcoordB = Math.min(b[0][2], b[1][2]);

            return minZcoordA > minZcoordB ? 1 : (minZcoordB > minZcoordA) ? -1 : 0;
        });

        let allXvalues = arrayColumn(arrayColumn(brickEndCoordPairs, 0), 0)
            .concat(arrayColumn(arrayColumn(brickEndCoordPairs, 1), 0));
        let allYvalues = arrayColumn(arrayColumn(brickEndCoordPairs, 0), 1)
            .concat(arrayColumn(arrayColumn(brickEndCoordPairs, 1), 1));

        let minX = Math.min(...allXvalues);
        let maxX = Math.max(...allXvalues);
        let minY = Math.min(...allYvalues);
        let maxY = Math.max(...allYvalues);
        // this seems to be true, if it wasn't it'd just be a slight adjustment pain:
        assert(minX > -1 && minY > -1);

        let grid = makeGrid(maxY - minY + 1, maxX - minX + 1);

        brickEndCoordPairs.forEach((brickCoordPair, index) => {
            let heightStart = getMaxIntersectionHeight(brickCoordPair, grid) + 1;
            let heightEnd = heightStart + Math.abs(brickCoordPair[0][2] - brickCoordPair[1][2]);

            getGridIndexesForBrick(brickCoordPair).forEach(gridPos => {
                let [r, c] = gridPos;
                grid[r][c] = heightEnd;
            });

            brickEndCoordPairs[index][0][2] = heightStart;
            brickEndCoordPairs[index][1][2] = heightEnd;
        });

        let brickIndexesToSupportInfo = [];

        brickEndCoordPairs.forEach((brickCoordPair, index) => {
            // a brick can be disintegrated if every brick resting on it is resting on another brick too
            let targetHeight = brickCoordPair[1][2] + 1;
            let gridIndexes = getGridIndexesForBrick(brickCoordPair).map(el => el.join(','));

            let supportedBrickIndexes = [];
            brickEndCoordPairs.forEach((coords, i) => {
                if (coords[0][2] !== targetHeight) {
                    return;
                }

                if (getGridIndexesForBrick(coords).map(pos => pos.join(',')).filter(s => gridIndexes.includes(s)).length > 0) {
                    supportedBrickIndexes.push(i);
                }
            });

            brickIndexesToSupportInfo.push({ supportedBrickIndexes });
        });

        brickIndexesToSupportInfo.forEach((obj, index) => {
            brickIndexesToSupportInfo[index].supportedByBrickIndexes = Object.keys(brickIndexesToSupportInfo).filter(i => {
                return brickIndexesToSupportInfo[i].supportedBrickIndexes.includes(index);
            }).map(el => parseInt(el, 10));
        });

        let getChainReactionCount = (disintegrationIndex) => {
            // basically, we want to get all indexes which no longer have support because of disintegratedIndexes
            // and recursively do that....
            let disintegratedIndexes = [disintegrationIndex];
            for (let i = disintegrationIndex + 1; i < brickIndexesToSupportInfo.length; i++) {
                // we check that the original supportedByBrickIndexes had at least one brick in it
                // otherwise it was already on the ground and can't fall:
                let willFall = brickIndexesToSupportInfo[i].supportedByBrickIndexes.length > 0 &&
                    brickIndexesToSupportInfo[i].supportedByBrickIndexes.filter(index => {
                        return !disintegratedIndexes.includes(index);
                    }).length === 0;

                if (willFall) {
                    disintegratedIndexes.push(i);
                }
            }

            return disintegratedIndexes.length - 1;
        };

        let result = 0;
        Object.keys(brickIndexesToSupportInfo).reverse().forEach(index => {
            index = parseInt(index, 10);
            result += getChainReactionCount(index);
        });

        return result;
    };

    let arrayColumn = (arr, colIndex) => arr.map(el => el[colIndex]);

    let makeGrid = (numRows, numCols, defaultVal = 0) => {
        // the fill-null+map might be unnecessary, but i have some memory of shared references
        return Array(numRows).fill(null).map(el => Array(numCols).fill(defaultVal));
    };

    let getGridIndexesForBrick = (brickCoordPair) => {
        let result = [];
        let [xStart, xEnd] = [brickCoordPair[0][0], brickCoordPair[1][0]].sort(numericSortLowestToHighestComparator);
        let [yStart, yEnd] = [brickCoordPair[0][1], brickCoordPair[1][1]].sort(numericSortLowestToHighestComparator);

        let values = [];
        for (let rowIndex = yStart; rowIndex <= yEnd; rowIndex++) {
            for (let colIndex = xStart; colIndex <= xEnd; colIndex++) {
                result.push([rowIndex, colIndex]);
            }
        }

        return result;
    };

    let getMaxIntersectionHeight = (brickCoordPair, grid) => {
        let [xStart, xEnd] = [brickCoordPair[0][0], brickCoordPair[1][0]].sort(numericSortLowestToHighestComparator);
        let [yStart, yEnd] = [brickCoordPair[0][1], brickCoordPair[1][1]].sort(numericSortLowestToHighestComparator);

        let values = [];
        for (let rowIndex = yStart; rowIndex <= yEnd; rowIndex++) {
            for (let colIndex = xStart; colIndex <= xEnd; colIndex++) {
                values.push(grid[rowIndex][colIndex]);
            }
        }

        return Math.max(...values);
    };

    let findBricksForDisintegration = (rawInputString) => {
        let brickEndCoordPairs = rawInputString.split(/\n/).filter(el => el)
            .map(line => line.split('~').map(coordString => coordString.split(',').map(n => parseInt(n, 10))));

        brickEndCoordPairs.sort((a, b) => {
            let minZcoordA = Math.min(a[0][2], a[1][2]);
            let minZcoordB = Math.min(b[0][2], b[1][2]);

            return minZcoordA > minZcoordB ? 1 : (minZcoordB > minZcoordA) ? -1 : 0;
        });

        let allXvalues = arrayColumn(arrayColumn(brickEndCoordPairs, 0), 0)
            .concat(arrayColumn(arrayColumn(brickEndCoordPairs, 1), 0));
        let allYvalues = arrayColumn(arrayColumn(brickEndCoordPairs, 0), 1)
            .concat(arrayColumn(arrayColumn(brickEndCoordPairs, 1), 1));

        let minX = Math.min(...allXvalues);
        let maxX = Math.max(...allXvalues);
        let minY = Math.min(...allYvalues);
        let maxY = Math.max(...allYvalues);
        // this seems to be true, if it wasn't it'd just be a slight adjustment pain:
        assert(minX > -1 && minY > -1);

        let grid = makeGrid(maxY - minY + 1, maxX - minX + 1);

        brickEndCoordPairs.forEach((brickCoordPair, index) => {
            let heightStart = getMaxIntersectionHeight(brickCoordPair, grid) + 1;
            let heightEnd = heightStart + Math.abs(brickCoordPair[0][2] - brickCoordPair[1][2]);

            getGridIndexesForBrick(brickCoordPair).forEach(gridPos => {
                let [r, c] = gridPos;
                grid[r][c] = heightEnd;
            });

            brickEndCoordPairs[index][0][2] = heightStart;
            brickEndCoordPairs[index][1][2] = heightEnd;
        });

        let result = 0;
        brickEndCoordPairs.forEach((brickCoordPair, index) => {
            // a brick can be disintegrated if every brick resting on it is resting on another brick too
            let targetHeight = brickCoordPair[1][2] + 1;
            let possibleCandidates = brickEndCoordPairs.filter(el => el[0][2] === targetHeight);

            let gridIndexes = getGridIndexesForBrick(brickCoordPair).map(el => el.join(','));
            possibleCandidates = possibleCandidates.filter(el => {
                return getGridIndexesForBrick(el).map(pos => pos.join(',')).filter(s => gridIndexes.includes(s)).length > 0;
            });

            if (possibleCandidates.length === 0) {
                // if nothing is resting on this brick, it's safe to zap:
                result++;
                return;
            }

            // ok, each possible candidate has to then scan to see if it's resting on something else besides this brick...
            let allBricksAccountedFor = possibleCandidates.map(candidate => {
                let candidateIndexes = getGridIndexesForBrick(candidate).map(el => el.join(','));
                return !!brickEndCoordPairs.find((coords, i) => {
                    if (i === index) {
                        // we already know you're sitting on this one...
                        return false;
                    }

                    if (candidate[0][2] !== coords[1][2] + 1) {
                        // it has to be at a height that could be touching:
                        return false;
                    }

                    return getGridIndexesForBrick(coords)
                        .map(pos => pos.join(',')).filter(s => candidateIndexes.includes(s)).length > 0;
                });
            }).reduce((a, e) => a && e, true);

            if (allBricksAccountedFor) {
                result++;
            }
        });

        return result;
    };

    return [findBricksForDisintegration, findChainReactionCounts];
})();
