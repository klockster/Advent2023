var day11 = (() => {
    let isBetween = (index, boundaryA, boundaryB) => {
        let [start, end] = [boundaryA, boundaryB].sort(numericSortLowestToHighestComparator);
        return index > start && index < end;
    };

    let getShortestPathBetweenSuperExpandedPositions = (posA, posB, expandedRowIndexes, expandedColIndexes, expansionFactor) => {
        let encapsulatedRows = expandedRowIndexes.filter(i => isBetween(i, posA[0], posB[0]));
        let encapsulatedCols = expandedColIndexes.filter(i => isBetween(i, posA[1], posB[1]));

        return Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1]) +
            (encapsulatedRows.length ? encapsulatedRows.length * (expansionFactor - 1) : 0) +
            (encapsulatedCols.length ? encapsulatedCols.length * (expansionFactor - 1) : 0);
    };

    let getShortestPathBetweenSuperExpandedGalaxies = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el).map(row => row.split(''));

        // let expansionFactor = 2;
        // let expansionFactor = 10;
        let expansionFactor = 1000 * 1000;

        let isExpandable = (arr) => arr.filter(el => el === '.').length === arr.length;
        let expandableRowIndexes = [];
        grid.forEach((row, rowIndex) => {
            if (isExpandable(row)) {
                expandableRowIndexes.push(rowIndex);
            }
        });

        let expandableColIndexes = [];
        grid[0].forEach((_, colIndex) => {
            if (isExpandable(getColumnAtIndex(grid, colIndex))) {
                expandableColIndexes.push(colIndex);
            }
        });

        let galaxyPositions = [];
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === '#') {
                    galaxyPositions.push([rowIndex, colIndex]);
                }
            });
        });

        let shortestPaths = [];
        for (let i = 0; i < galaxyPositions.length - 1; i++) {
            for (let j = i + 1; j < galaxyPositions.length; j++) {
                shortestPaths.push(
                    getShortestPathBetweenSuperExpandedPositions(
                        galaxyPositions[i],
                        galaxyPositions[j],
                        expandableRowIndexes,
                        expandableColIndexes,
                        expansionFactor
                    )
                );
            }
        }

        return shortestPaths.reduce((a, e) => a + e, 0);
    };

    let getColumnAtIndex = (grid, colIndex) => {
        return grid.map(row => row[colIndex]);
    };

    let getDotsRow = (length) => Array(length).fill('.');

    let getExpandedGrid = (grid) => {
        grid = JSON.parse(JSON.stringify(grid));
        let isExpandable = (arr) => arr.filter(el => el === '.').length === arr.length;

        let expandableRowIndexes = [];
        grid.forEach((row, rowIndex) => {
            if (isExpandable(row)) {
                expandableRowIndexes.push(rowIndex);
            }
        });

        expandableRowIndexes.reverse().forEach(i => {
            grid.splice(i, 0, getDotsRow(grid[0].length));
        });

        let expandableColIndexes = [];
        grid[0].forEach((_, colIndex) => {
            if (isExpandable(getColumnAtIndex(grid, colIndex))) {
                expandableColIndexes.push(colIndex);
            }
        });

        expandableColIndexes.reverse().forEach(i => {
            grid.forEach(row => {
                row.splice(i, 0, '.');
            });
        });

        return grid;
    };

    let getShortestPathBetweenPositions = (posA, posB) => {
        return Math.abs(posA[0] - posB[0]) + Math.abs(posA[1] - posB[1]);
    };

    let getShortestPathsBetweenGalaxyPairs = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el).map(row => row.split(''));

        let expandedGrid = getExpandedGrid(grid);
        let galaxyPositions = [];
        expandedGrid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === '#') {
                    galaxyPositions.push([rowIndex, colIndex]);
                }
            });
        });

        let shortestPaths = [];
        for (let i = 0; i < galaxyPositions.length - 1; i++) {
            for (let j = i + 1; j < galaxyPositions.length; j++) {
                shortestPaths.push(getShortestPathBetweenPositions(galaxyPositions[i], galaxyPositions[j]));
            }
        }

        return shortestPaths.reduce((a, e) => a + e, 0);
    };

    return [getShortestPathsBetweenGalaxyPairs, getShortestPathBetweenSuperExpandedGalaxies];
})();
