var day17 = (() => {
    // note that both solutions take a handfull of seconds to complete with the real input

    const WEST = 'west';
    const EAST = 'east';
    const NORTH = 'north';
    const SOUTH = 'south';

    let getUltraCrucibleKey = (state) => {
        return `${state.pos.join(',')}|${state.dir},${state.dirSteps}`;
    };

    let isFinishedUltra = (state, grid) => {
        if (state.dirSteps < 4) {
            return false;
        }

        let [r, c] = state.pos;
        return r === grid.length - 1 && c === grid[0].length - 1;
    };

    let getNextDirectionsUltra = (state, grid) => {
        if (state.dirSteps < 4) {
            let nextPosition = updatePositionByDirection(state.pos, state.dir);
            if (positionIsOffGrid(nextPosition, grid)) {
                return [];
            }
            return [state.dir];
        }

        let candidates = { west: true, east: true, north: true, south: true };
        delete(candidates[getOppositeDirection(state.dir)]);

        if (state.dirSteps === 10) {
            delete(candidates[state.dir]);
        }

        return Object.keys(candidates).filter(dir => {
            let updatedPosition = updatePositionByDirection(state.pos, dir);
            return !positionIsOffGrid(updatedPosition, grid);
        });
    };

    let findMinimumHeatLossUltraCrucible = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split('').map(n => parseInt(n, 10)));

        let queue = [
            {
                pos: [0, 1],
                dir: EAST,
                dirSteps: 1,
                currentHeatLoss: grid[0][1],
            },
            {
                pos: [1, 0],
                dir: SOUTH,
                dirSteps: 1,
                currentHeatLoss: grid[1][0],
            },
        ];

        let keysToHeats = {};

        let lowest = Number.MAX_SAFE_INTEGER;
        while (true) {
            let nextQueue = [];
            while (queue.length) {
                let current = queue.pop();
                if (current.currentHeatLoss > lowest) {
                    continue;
                }

                let key = getUltraCrucibleKey(current);
                if (keysToHeats[key] && keysToHeats[key] <= current.currentHeatLoss) {
                    continue;
                }
                keysToHeats[key] = current.currentHeatLoss;

                if (isFinishedUltra(current, grid)) {
                    if (current.currentHeatLoss < lowest) {
                        lowest = current.currentHeatLoss;
                    }
                    continue;
                }

                let nextDirections = getNextDirectionsUltra(current, grid);
                nextDirections.forEach(dir => {
                    let nextPosition = updatePositionByDirection(current.pos, dir);
                    let next = {
                        pos: nextPosition,
                        currentHeatLoss: current.currentHeatLoss + grid[nextPosition[0]][nextPosition[1]],
                        dir: dir,
                        dirSteps: dir === current.dir ? current.dirSteps + 1 : 1,
                    };

                    nextQueue.push(next);
                });
            }

            if (nextQueue.length === 0) {
                break;
            }

            queue = nextQueue;
        }

        return lowest;
    };

    let getOppositeDirection = (direction) => {
        switch (direction) {
            case EAST:
                return WEST;
            case WEST:
                return EAST;
            case NORTH:
                return SOUTH;
            case SOUTH:
                return NORTH;
            default:
                assert(false, `Unrecognized direction ${direction}`);
        }
    };

    let getPositionIncrementByDirection = (direction) => {
        switch (direction) {
            case EAST:
                return [0, 1];
            case WEST:
                return [0, -1];
            case NORTH:
                return [-1, 0];
            case SOUTH:
                return [1, 0];
            default:
                assert(false, `Unrecognized direction ${direction}`);
        }
    };

    let positionIsOffGrid = (position, grid) => {
        let [rowIndex, colIndex] = position;
        return rowIndex >= grid.length || rowIndex < 0 || colIndex < 0 || colIndex >= grid[0].length;
    };

    let addPositions = (posA, posB) => posA.map((num, i) => num + posB[i]);

    let updatePositionByDirection = (pos, dir) => {
        return addPositions(getPositionIncrementByDirection(dir), pos);
    };

    let isFinished = (grid, currentPosition) => {
        let [r, c] = currentPosition;
        return r === grid.length - 1 && c === grid[0].length - 1;
    };

    let getPossibleDirections = (lastThree, grid, currentPosition) => {
        if (isFinished(grid, currentPosition)) {
            return [];
        }

        let candidates = { west: true, east: true, north: true, south: true };
        if (lastThree[0] !== undefined) {
            delete(candidates[getOppositeDirection(lastThree[0])]);
        }

        if (lastThree.length === 3 && [...new Set(lastThree)].length === 1) {
            delete(candidates[lastThree[0]]);
        }

        return Object.keys(candidates).filter(dir => {
            let updatedPosition = updatePositionByDirection(currentPosition, dir);
            return !positionIsOffGrid(updatedPosition, grid);
        });
    };

    let getGridKeyFromState = (state) => {
        return `${state.pos.join(',')}|${state.lastThree.join(',')}`;
    };

    let traverseGrid = (grid) => {
        let keysToHeats = {};

        let startState = {
            pos: [0, 0],
            lastThree: [],
            currentHeatLoss: 0,
        };

        let queue = [startState];

        let lowest = Number.MAX_SAFE_INTEGER;
        while (true) {
            let nextQueue = [];
            while (queue.length) {
                let current = queue.pop();
                let key = getGridKeyFromState(current);
                if (keysToHeats[key] && keysToHeats[key] <= current.currentHeatLoss) {
                    continue;
                }

                keysToHeats[key] = current.currentHeatLoss;

                if (isFinished(grid, current.pos)) {
                    if (current.currentHeatLoss < lowest) {
                        lowest = current.currentHeatLoss;
                    }
                    continue;
                }

                let nextDirections = getPossibleDirections(current.lastThree, grid, current.pos);
                nextDirections.forEach(dir => {
                    let nextPosition = updatePositionByDirection(current.pos, dir);
                    let next = {
                        pos: nextPosition,
                        currentHeatLoss: current.currentHeatLoss + grid[nextPosition[0]][nextPosition[1]],
                        lastThree: dir === current.lastThree[0] ? [...current.lastThree, dir] : [dir],
                    };

                    nextQueue.push(next);
                });
            }

            if (nextQueue.length === 0) {
                break;
            }

            queue = nextQueue;
        }

        return lowest;
    };

    let findMinimumHeatLoss = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split('').map(n => parseInt(n, 10)));

        return traverseGrid(grid);
    };

    return [findMinimumHeatLoss, findMinimumHeatLossUltraCrucible];
})();
