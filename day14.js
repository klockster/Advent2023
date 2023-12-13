var day14 = (() => {
    let gridToKey = (grid) => grid.map(row => row.join(',')).join('|');

    let getLoadAfterBillionCycles = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split(''));

        let numCycles = 1000 * 1000 * 1000;
        let cycle = [NORTH, WEST, SOUTH, EAST];

        let gridsFromKeys = {};

        for (let i = 0; i < numCycles; i++) {
            cycle.forEach(direction => {
                grid = tiltGridInDirection(grid, direction);
            });

            // assumption: this has to get into a known cycle, which then can be used to fast-forward to the end
            let key = gridToKey(grid);
            if (gridsFromKeys[key] !== undefined) {
                let cycleLength = i - gridsFromKeys[key];
                let distFromEnd = (numCycles - i) % cycleLength;
                i = numCycles - distFromEnd;
                gridsFromKeys = {};
                continue;
            }
            gridsFromKeys[key] = i;
        }


        return grid.map((row, rowIndex) => {
            return row.reduce((a, e) => {
                return e === 'O' ? a + grid.length - rowIndex : a;
            }, 0);
        }).reduce((a, e) => a + e, 0);
    };

    let getColumnAtIndex = (grid, colIndex) => grid.map(row => row[colIndex]);

    let interleaveArrays = (arrA, arrB) => {
        let result = [];
        assert(arrA.length === arrB.length + 1, 'must interleave arrays with exactly 1 element difference');
        for (let i = 0; i < arrA.length; i++) {
            result.push(arrA[i]);
            if (i < arrB.length) {
                result.push(arrB[i]);
            }
        }

        return result;
    };

    let rotateRowsToColumns = (grid) => {
        let result = [];
        for (let i = 0; i < grid[0].length; i++) {
            result.push(getColumnAtIndex(grid, i));
        }

        return result;
    };

    let getColumns = (grid) => {
        let result = [];
        for (let i = 0; i < grid[0].length; i++) {
            result.push(getColumnAtIndex(grid, i));
        }
        return result;
    };

    const NORTH = 'north';
    const SOUTH = 'south';
    const EAST = 'east';
    const WEST = 'west';
    let tiltGridInDirection = (grid, direction = NORTH) => {

        let areArraysColunmns = direction === NORTH || direction === SOUTH;
        let arrays = areArraysColunmns ? getColumns(grid) : grid;
        let result = [];
        let tiltTowardBeginning = direction === NORTH || direction === WEST;

        for (let i = 0; i < arrays.length; i++) {
            let arrayString = arrays[i].join('');
            let tiltedSegments = arrayString.split(/#+/)
                .map(el => {
                    return el.split('').sort((a, b) => {
                        if (a === 'O' && b === '.') {
                            return tiltTowardBeginning ? -1 : 1;
                        }
                        if (b === 'O' && a === '.') {
                            return tiltTowardBeginning ? 1 : -1;
                        }
                        return 0;
                    }).join('');
                });

            let immoveableRockSegments = arrayString.match(/(#+)/g) || [];
            result.push(interleaveArrays(tiltedSegments, immoveableRockSegments).join('').split(''));
        }

        return areArraysColunmns ? rotateRowsToColumns(result) : result;
    };

    let tiltGridNorth = (grid) => {
        return tiltGridInDirection(grid, NORTH);
    };

    let findNorthRoundRockWeights = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split(''));

        let tiltedGrid = tiltGridNorth(grid);
        return tiltedGrid.map((row, rowIndex) => {
            return row.reduce((a, e) => {
                return e === 'O' ? a + tiltedGrid.length - rowIndex : a;
            }, 0);
        }).reduce((a, e) => a + e, 0);
    };

    return [findNorthRoundRockWeights, getLoadAfterBillionCycles];
})();
