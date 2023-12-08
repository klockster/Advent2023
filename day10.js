var day10 = (() => {
    let getPositionKey = (pos) => {
        let [r, c] = pos;
        return `${r},${c}`;
    };

    let subtractPositions = (posA, posB) => [posA[0] - posB[0], posA[1] - posB[1]];

    let replaceStartInGrid = (grid, mainLoop) => {
        let result = JSON.parse(JSON.stringify(grid));
        let startPos = findStartPosition(grid);
        let [r, c] = startPos;

        let diffs = [mainLoop[mainLoop.length - 2], mainLoop[0]]
            .map(p => subtractPositions(p, startPos))
            .map(p => getPositionKey(p));

        if (diffs.indexOf('1,0')) {
            if (diffs.indexOf('0,1')) {
                grid[r][c] = 'F';
            } else {
                grid[r][c] = '7';
            }
        } else if (diffs.indexOf('-1,0')) {
            if (diffs.indexOf('0,1')) {
                grid[r][c] = 'L';
            } else {
                grid[r][c] = 'J';
            }
        } else {
            assert(false, 'Start should be a corner piece');
        }

        return result;
    };

    // this is part2:
    let countTilesInLoop = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el).map(row => row.split(''));

        let [startRowIndex, startColIndex] = findStartPosition(grid);

        let loops = [];
        [NORTH, EAST, WEST, SOUTH].forEach(travelDirection => {
            let nextPosition = getTraversalPosition(grid, [startRowIndex, startColIndex], travelDirection);

            if (!nextPosition) {
                return;
            }

            let loop = buildLoop(grid, nextPosition, travelDirection);
            if (loop) {
                loops.push(loop);
            }
        });

        let mainLoop = loops.sort((a, b) => a.length > b.length ? 1 : (b.length > a.length) ? -1 : 0)
            .pop();

        let mainLoopPositionsSet = {};
        mainLoop.map(p => getPositionKey(p)).forEach(key => mainLoopPositionsSet[key] = 1);

        let innerTileCount = 0;
        // assumption time:
        // if you approach a tile from the left, it is in the pipe loop if you've flipped
        // and flipping occurs if:
            // you hit a '|' symbol, OR
            // F pairs with 7
            // L pairs with J
        // for the pairs, if you hit an F or L you flip, and then you can't flip back until you hit a | or the pair piece
        replaceStartInGrid(grid, mainLoop).forEach((row, rowIndex) => {
            let isInside = false;
            let cornerFlip = null;
            row.forEach((cell, colIndex) => {
                if (mainLoopPositionsSet[getPositionKey([rowIndex, colIndex])]) {
                    // only things in the main loop can actually cause flipping
                    if (cell === '|') {
                        cornerFlip = null;
                        isInside = !isInside;
                        return;
                    }

                    if (cell === 'F' || cell === 'L') {
                        cornerFlip = cell;
                        isInside = !isInside;
                        return;
                    }

                    if ((cell === '7' && cornerFlip === 'F') || (cell === 'J' && cornerFlip === 'L')) {
                        isInside = !isInside;
                        cornerFlip = null;
                        return;
                    }

                    return;
                }

                // if you're not on a tile in the main loop, and you're inside, then increment
                if (isInside) {
                    innerTileCount++;
                }
            });
        });

        return innerTileCount;
    };

    let findStartPosition = (grid) => {
        for (let i = 0; i < grid.length; i++) {
            let row = grid[i];
            for (let j = 0; j < row.length; j++) {
                let cell = row[j];
                if (cell === 'S') {
                    return [i, j];
                }
            }
        }

        assert(false, 'Grid must contain a starting position');
    };

    /*
        L is a 90-degree bend connecting north and east.
        J is a 90-degree bend connecting north and west.
        7 is a 90-degree bend connecting south and west.
        F is a 90-degree bend connecting south and east.
    */
    const WEST = 'west';
    const EAST = 'east';
    const NORTH = 'north';
    const SOUTH = 'south';

    let getTraversalDirections = (piece) => {
        switch (piece) {
            case 'J':
                return [NORTH, WEST];
            case '7':
                return [SOUTH, WEST];
            case 'F':
                return [SOUTH, EAST];
            case 'L':
                return [NORTH, EAST];
            case '.':
                return [];
            case 'S':
                return [NORTH, EAST, SOUTH, WEST];
            case '|':
                return [NORTH, SOUTH];
            case '-':
                return [EAST, WEST];
            default:
                assert(false, `Unexpected piece ${piece}`);
        }
    }

    let canBeTraversedByDirection = (piece, travelDirection) => {
        return getTraversalDirections(piece).indexOf(getOppositeDirection(travelDirection)) > -1;
    };

    let getSurroundingTiles = (grid, rowIndex, colIndex) => {
        return [
            [rowIndex - 1, colIndex - 1], [rowIndex - 1, colIndex], [rowIndex - 1, colIndex + 1],
            [rowIndex, colIndex - 1], [rowIndex, colIndex + 1],
            [rowIndex + 1, colIndex - 1], [rowIndex + 1, colIndex], [rowIndex + 1, colIndex + 1],
        ].filter(pos => {
            let [r, c] = pos;
            return grid[r] && grid[r][c];
        });
    };

    let mapDirectionToIndexIncrement = (travelDirection) => {
        switch (travelDirection) {
            case NORTH:
                return [-1, 0];
            case SOUTH:
                return [1, 0];
            case EAST:
                return [0, 1];
            case WEST:
                return [0, -1];
            default:
                assert(false, `Unexpected direction "${travelDirection}"!`);
        }
    };

    let getTraversalPosition = (grid, currentPosition, travelDirection) => {
        let increment = mapDirectionToIndexIncrement(travelDirection);
        let [r, c] = [currentPosition[0] + increment[0], currentPosition[1] + increment[1]];

        return (grid[r] && grid[r][c] && canBeTraversedByDirection(grid[r][c], travelDirection)) ?
            [r, c] : null;
    };

    let getOppositeDirection = (direction) => {
        switch (direction) {
            case NORTH:
                return SOUTH;
            case SOUTH:
                return NORTH;
            case WEST:
                return EAST;
            case EAST:
                return WEST;
            default:
                assert(false, `Unexpected direction ${direction}`);
        }
    };

    let getNextDirection = (grid, currentPosition, currentTravelDirection) => {
        let [r, c] = currentPosition;
        if (!canBeTraversedByDirection(grid[r][c], currentTravelDirection)) {
            return null;
        }

        let result = getTraversalDirections(grid[r][c])
            .filter(dir => dir !== getOppositeDirection(currentTravelDirection));

        return result.length ? result.pop() : null;
    };

    let buildLoop = (grid, position, travelDirection) => {
        let loop = [position];

        let [r, c] = position;
        let maxIterations = grid.length * grid[0].length;
        let nextDirection = travelDirection;
        while (grid[r][c] !== 'S') {
            nextDirection = getNextDirection(grid, [r, c], nextDirection);
            if (!nextDirection) {
                return null;
            }

            let nextPosition = getTraversalPosition(grid, [r, c], nextDirection);
            if (!nextPosition) {
                return null;
            }

            loop.push(nextPosition);
            [r, c] = nextPosition;
            travelDirection = nextDirection;
        }

        return loop;
    };

    let getFurthestStepsAlongMainLoop = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el).map(row => row.split(''));

        let [startRowIndex, startColIndex] = findStartPosition(grid);

        let loops = [];
        [NORTH, EAST, WEST, SOUTH].forEach(travelDirection => {
            let nextPosition = getTraversalPosition(grid, [startRowIndex, startColIndex], travelDirection);

            if (!nextPosition) {
                return;
            }

            let loop = buildLoop(grid, nextPosition, travelDirection);
            if (loop) {
                loops.push(loop);
            }
        });

        let loopDist = loops.sort((a, b) => a.length > b.length ? 1 : (b.length > a.length) ? -1 : 0)
            .pop().length;

        return loopDist % 2 === 0 ? loopDist / 2 : (loopDist - 1) / 2;
    };

    return [getFurthestStepsAlongMainLoop, countTilesInLoop];
})();
