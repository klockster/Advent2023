var day13 = (() => {
    let findReflectionsWithSmudges = (rawInputString) => {
        let grids = rawInputString.split(/\n\n/).filter(el => el)
            .map(grid => grid.split(/\n/).filter(el => el).map(row => row.split('')));

        let points = grids.map(grid => {
            let horizontal = getHorizontalReflectionRowIndexesWithSmudges(grid);
            if (horizontal.length) {
                return 100 * Math.round(horizontal[0]);
            }

            let vertical = getHorizontalReflectionRowIndexesWithSmudges(rotateGrid(grid));
            assert(vertical.length);
            return Math.round(vertical[0]);
        });

        return points.reduce((a, e) => a + e, 0);
    };

    let getRowsDiff = (rowA, rowB) => {
        let result = 0;
        for (let i = 0; i < rowA.length; i++) {
            if (rowA[i] !== rowB[i]) {
                result++;
            }
        }

        return result;
    };

    let getHorizontalReflectionRowIndexesWithSmudges = (grid) => {
        let indexes = [];

        for (let i = 0; i < grid.length - 1; i++) {
            let accumulatedDifferences = 0;
            for (let j = 0; j <= i; j++) {
                if (grid[i - j] === undefined || grid[i + j + 1] === undefined) {
                    break;
                }

                accumulatedDifferences += getRowsDiff(grid[i - j], grid[i + j + 1]);
                if (accumulatedDifferences > 1) {
                    break;
                }
            }

            if (accumulatedDifferences === 1) {
                indexes.push(i + 0.5);
            }
        }

        return indexes;
    };

    let areRowsEqual = (rowA, rowB) => {
        if (rowA.length !== rowB.length) {
            return false;
        }
        for (let i = 0; i < rowA.length; i++) {
            if (rowA[i] !== rowB[i]) {
                return false;
            }
        }

        return true;
    };

    let getHorizontalReflectionRowIndexes = (grid) => {
        let indexes = [];

        for (let i = 0; i < grid.length - 1; i++) {
            let isMirrorLine = true;
            for (let j = 0; j <= i; j++) {
                if (grid[i - j] === undefined || grid[i + j + 1] === undefined) {
                    break;
                }
                if (!areRowsEqual(grid[i - j], grid[i + j + 1])) {
                    isMirrorLine = false;
                    break;
                }
            }

            if (isMirrorLine) {
                indexes.push(i + 0.5);
            }
        }

        return indexes;
    };

    let getColumnAtIndex = (grid, colIndex) => grid.map(row => row[colIndex]);

    let rotateGrid = (grid) => {
        let result = [];
        for (let i = 0; i < grid[0].length; i++) {
            result.push(getColumnAtIndex(grid, i));
        }

        return result;
    };

    let findReflectionLines = (rawInputString) => {
        let grids = rawInputString.split(/\n\n/).filter(el => el)
            .map(grid => grid.split(/\n/).filter(el => el).map(row => row.split('')));


        let points = grids.map(grid => {
            let horizontal = getHorizontalReflectionRowIndexes(grid);
            if (horizontal.length) {
                return 100 * Math.round(horizontal[0]);
            }

            let vertical = getHorizontalReflectionRowIndexes(rotateGrid(grid));
            assert(vertical.length);
            return Math.round(vertical[0]);
        });

        return points.reduce((a, e) => a + e, 0);
    };

    return [findReflectionLines, findReflectionsWithSmudges];
})();
