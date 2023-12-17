var day18 = (() => {
    const RIGHT = 'R';
    const LEFT = 'L';
    const UP = 'U';
    const DOWN = 'D';

    let directionsArray = [RIGHT, DOWN, LEFT, UP];

    let findSuperLagoonVolume = (rawInputString) => {
        let distDirectionPairs = rawInputString.split(/\n/).filter(el => el).map(line => {
            let part = line.match(/#([a-f0-9]+)/)[1];
            let hex = part.slice(0, 5);
            let direction = directionsArray[part[5]];
            return [parseInt(hex, 16), direction];
        });

        let current = [0, 0];
        let edges = [];

        let perimeter = 0;
        distDirectionPairs.forEach(pair => {
            let [dist, dir] = pair;
            perimeter += dist;
            let increment = getPositionIncrementByDirection(dir).map(num => num * dist);
            current = addPositions(current, increment);
            edges.push(current);
        });

        // area of irregular polygon via triangles (shoelace algorithm)
        let area = 0;
        for (let i = 0; i < edges.length; i++) {
            area += edges[i][0] * edges[(i + 1) % edges.length][1] - edges[i][1] * edges[(i + 1) % edges.length][0];
        }

        // the lines themselves have area, but don't double-count from the area calculation
        return Math.abs(area) / 2 + perimeter / 2 + 1;
    };

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

    let addPositions = (posA, posB) => posA.map((num, i) => num + posB[i]);

    let updatePositionByDirection = (pos, dir) => {
        return addPositions(getPositionIncrementByDirection(dir), pos);
    };

    let getNextDugOutCoordinates = (currentPos, distance, direction) => {
        let result = [];
        for (let i = 0; i < distance; i++) {
            currentPos = updatePositionByDirection(currentPos, direction);
            result.push(currentPos);
        }

        return result;
    };

    let getPositionKey = (pos) => pos.join(',');

    // just gonna count via BFS for now
    let countInternals = (startingPos, coords) => {
        let coordMap = {};
        coords.forEach(coord => coordMap[getPositionKey(coord)] = true);

        let result = 0;
        let queue = [startingPos];
        while (queue.length) {
            let current = queue.pop();
            let key = getPositionKey(current);
            if (coordMap[key]) {
                continue;
            }
            coordMap[key] = true;
            result++;

            [RIGHT, UP, DOWN, LEFT].forEach(dir => {
                queue.push(updatePositionByDirection(current, dir));
            });
        }

        return result;
    };

    let findLagoonVolume = (rawInputString) => {
        let directionDistancePairs = rawInputString.split(/\n/).filter(el => el)
            .map(line => line.split(/\s+/).slice(0, 2).map((el, i) => i === 1 ? parseInt(el, 10) : el));

        let dugOutCoordinates = [];
        let current = [0, 0];
        directionDistancePairs.forEach(pair => {
            let [direction, distance] = pair;
            let nextCoords = getNextDugOutCoordinates(current, distance, direction);
            current = nextCoords[nextCoords.length - 1];
            dugOutCoordinates.push(...nextCoords);
        });
        assert(current[0] === 0 && current[1] === 0, 'hey?');

        // if [1,1] is not inside the lagoon, this will not terminate
        return countInternals([1,1], dugOutCoordinates) + dugOutCoordinates.length;
    };

    return [findLagoonVolume, findSuperLagoonVolume];
})();
