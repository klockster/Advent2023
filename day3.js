var day3 = (() => {

    let getNumIndexRangesInRow = (row) => {
        let result = [];

        let currentNumStartIndex = null;
        row.forEach((cell, index) => {
            if (cell.match(/[0-9]/)) {
                if (currentNumStartIndex === null) {
                    currentNumStartIndex = index;
                }

                return;
            }

            if (currentNumStartIndex !== null) {
                result.push([currentNumStartIndex, index - 1]);
                currentNumStartIndex = null;
            }
        });

        if (currentNumStartIndex !== null) {
            result.push([currentNumStartIndex, row.length - 1]);
        }

        return result;
    };

    let getSurroundingIndexes = (grid, rowIndex, colStartIndex, colEndIndex) => {
        let result = [];

        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
            if (i === rowIndex) {
                result.push([i, colStartIndex - 1], [i, colEndIndex + 1]);
                continue;
            }

            for (let j = colStartIndex - 1; j <= colEndIndex + 1; j++) {
                result.push([i, j]);
            }
        }

        return result.filter(index => {
            let [r, c] = index;
            return r >= 0 && r < grid[0].length && c >= 0 && c < grid.length;
        });
    };

    let sumGearRatios = (rawInputStr) => {
        let grid = rawInputStr.split(/\n/).filter(el => el).map(el => el.split(''));


        let starAdjacentNumbersByPosition = {

        };

        grid.forEach((row, rowIndex) => {
            let numColIndexes = getNumIndexRangesInRow(row);
            numColIndexes.forEach(numIndex => {
                let [colStartIndex, colEndIndex] = numIndex;
                let surroundingIndexes = getSurroundingIndexes(grid, rowIndex, colStartIndex, colEndIndex);

                let partNumber = row.slice(colStartIndex, colEndIndex + 1).join('');

                surroundingIndexes.forEach(index => {
                    let [r, c] = index;
                    if (grid[r][c] === '*') {
                        let key = `${r},${c}`;
                        if (!starAdjacentNumbersByPosition[key]) {
                            starAdjacentNumbersByPosition[key] = [];
                        }

                        starAdjacentNumbersByPosition[key].push(partNumber);
                    }
                });
            });
        });

        let sum = 0;
        Object.values(starAdjacentNumbersByPosition).forEach(nums => {
            if (nums.length === 2) {
                sum += nums[0] * nums[1];
            }
        });

        return sum;
    };

    let sumPartNumbers = (rawInputStr) => {
        let grid = rawInputStr.split(/\n/).filter(el => el).map(el => el.split(''));

        let sum = 0;
        grid.forEach((row, rowIndex) => {
            let numColIndexes = getNumIndexRangesInRow(row);

            numColIndexes.forEach(numIndex => {
                let [colStartIndex, colEndIndex] = numIndex;
                let surroundingIndexes = getSurroundingIndexes(grid, rowIndex, colStartIndex, colEndIndex);

                let isPartNumber = !!surroundingIndexes.find(index => {
                    let [r, c] = index;
                    return !grid[r][c].match(/[0-9]/) && grid[r][c] !== '.';
                });

                if (isPartNumber) {
                    let partNumber = row.slice(colStartIndex, colEndIndex + 1).join('');
                    sum += parseInt(partNumber, 10);
                }
            });
        });

        return sum;
    };

    return [sumPartNumbers, sumGearRatios];
})();
