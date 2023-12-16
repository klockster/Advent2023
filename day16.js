var day16 = (() => {
    const RIGHT = 'right';
    const LEFT = 'left';
    const UP = 'up';
    const DOWN = 'down';

    // it's a bit slow, but it'll finish:
    let findHighestPossibleEnergizedTiles = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split(''));

        let possibleStartingBeams = [];
        for (let i = 0; i < grid.length; i++) {
            possibleStartingBeams.push({ pos: [i, 0], dir: RIGHT });
            possibleStartingBeams.push({ pos: [i, grid[0].length - 1], dir: LEFT });
        }

        for (let i = 0; i < grid[0].length; i++) {
            possibleStartingBeams.push({ pos: [0, i], dir: DOWN });
            possibleStartingBeams.push({ pos: [grid.length - 1, i], dir: UP });
        }

        return Math.max(...possibleStartingBeams.map(beam => countEnergizedTiles(grid, beam)));
    };

    let positionIsOffGrid = (position, grid) => {
        let [rowIndex, colIndex] = position;
        return rowIndex >= grid.length || rowIndex < 0 || colIndex < 0 || colIndex >= grid[0].length;
    };

    let addPositions = (posA, posB) => posA.map((num, i) => num + posB[i]);

    let getPositionIncrementByDirection = (direction) => {
        switch (direction) {
            case RIGHT:
                return [0, 1];
            case LEFT:
                return [0, -1];
            case UP:
                return [-1, 0];
            case DOWN:
                return [1, 0];
            default:
                assert(false, `Unrecognized direction ${direction}`);
        }
    };

    let updatePositionByDirection = (pos, dir) => {
        return addPositions(getPositionIncrementByDirection(dir), pos);
    };

    let getPositionKey = (pos) => pos.join(',');

    let canIgnoreCurrentTile = (tile, direction) => {
        return tile === '.' ||
            (tile === '-' && (direction === RIGHT || direction === LEFT)) ||
            (tile === '|' && (direction === UP || direction === DOWN));
    };

    let isTileSplitter = (tile) => tile === '-' || tile === '|';

    let getSplitterBeams = (currentPos, currentDir, grid) => {
        let tile = grid[currentPos[0]][currentPos[1]];
        assert(isTileSplitter(tile), `Tile ${tile} is not a splitter`);
        assert(!canIgnoreCurrentTile(tile, currentDir), `Tile ${tile} won't split in this direction ${currentDir}`);

        if (tile === '-') {
            return [
                { pos: updatePositionByDirection(currentPos, LEFT), dir: LEFT },
                { pos: updatePositionByDirection(currentPos, RIGHT), dir: RIGHT },
            ];
        }

        return [
            { pos: updatePositionByDirection(currentPos, UP), dir: UP },
            { pos: updatePositionByDirection(currentPos, DOWN), dir: DOWN },
        ];
    };

    let getDeflectionBeam = (currentPos, currentDir, grid) => {
        let tile = grid[currentPos[0]][currentPos[1]];
        assert(tile === '/' || tile === '\\', `Tile should be a mirror tile, got ${tile} instead`);

        if (
            tile === '/' && currentDir === RIGHT ||
            tile === '\\' && currentDir === LEFT
        ) {
            return { pos: updatePositionByDirection(currentPos, UP), dir: UP };
        }

        if (
            tile === '/' && currentDir === DOWN ||
            tile === '\\' && currentDir === UP
        ) {
            return { pos: updatePositionByDirection(currentPos, LEFT), dir: LEFT };
        }

        if (
            tile === '/' && currentDir === UP ||
            tile === '\\' && currentDir === DOWN
        ) {
            return { pos: updatePositionByDirection(currentPos, RIGHT), dir: RIGHT };
        }

        if (
            tile === '/' && currentDir === LEFT ||
            tile === '\\' && currentDir === RIGHT
        ) {
            return { pos: updatePositionByDirection(currentPos, DOWN), dir: DOWN };
        }

        assert(false, 'Should be outta cases here');
    };

    let countEnergizedTiles = (grid, firstBeam = {pos: [0,0], dir: RIGHT}) => {
        let energizedTiles = {};
        let beams = [
            firstBeam,
        ];

        while (beams.length) {
            currentBeam = beams.pop();
            let {pos: currentPos, dir: currentDir} = currentBeam;
            let positionKey = getPositionKey(currentPos);
            if (energizedTiles[positionKey] && energizedTiles[positionKey][currentDir]) {
                // a light beam could loop forever for all we know, so we gotta bail if we've seen this before
                continue;
            }
            energizedTiles[positionKey] = {[currentDir]: true, ...(energizedTiles[positionKey] || {})};

            let [currentRowIndex, currentColIndex] = currentPos;
            let currentTile = grid[currentRowIndex][currentColIndex];

            // if the current position is a special tile, we'll act on it
            if (canIgnoreCurrentTile(currentTile, currentDir)) {
                let updatedPos = updatePositionByDirection(currentPos, currentDir);
                if (!positionIsOffGrid(updatedPos, grid)) {
                    beams.push({ pos: updatedPos, dir: currentDir});
                }

                continue;
            }

            if (isTileSplitter(currentTile)) {
                getSplitterBeams(currentPos, currentDir, grid).filter(el => !positionIsOffGrid(el.pos, grid))
                    .forEach(beam => beams.push(beam));
                continue;
            }

            let newBeam = getDeflectionBeam(currentPos, currentDir, grid);
            if (!positionIsOffGrid(newBeam.pos, grid)) {
                beams.push(newBeam);
            }
        }

        return Object.keys(energizedTiles).length;
    };

    let findNumberOfEnergizedTiles = (rawInputString) => {
        let grid = rawInputString.split(/\n/).filter(el => el)
            .map(row => row.split(''));

        return countEnergizedTiles(grid);
    };

    return [findNumberOfEnergizedTiles, findHighestPossibleEnergizedTiles];
})();
