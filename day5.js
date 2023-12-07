var day5 = (() => {

    let getRangeSplitPoint = (seedRange, ranges) => {
        let lowest = seedRange[0];
        let highest = seedRange[0] + seedRange[1] - 1;

        for (let i = 0; i < ranges.length; i++) {
            let [destStart, sourceStart, rangeLength] = ranges[i];

            let inRange = lowest >= sourceStart &&
                lowest <= (sourceStart + rangeLength - 1) &&
                highest >= sourceStart &&
                highest <= (sourceStart + rangeLength - 1);

            // if this range flocks entirely together, then no split point
            if (inRange) {
                return null;
            }

            if (sourceStart > lowest && sourceStart <= highest) {
                // ok, if it splits at the start of the range, let's return.... what??
                return [[lowest, sourceStart - lowest], [sourceStart, highest - sourceStart + 1]];
            }

            let sourceEnd = sourceStart + rangeLength - 1;
            if (sourceEnd >= lowest && sourceEnd < highest) {
                return [[lowest, sourceEnd - lowest + 1], [sourceEnd + 1, highest - sourceEnd]];
            }
        }

        // it's also possible an entire range intersects nothing
        return null;
    };

    let findLowestSeedNumberWithRanges = (rawInputString) => {
        let chunks = rawInputString.split(/\n\n/).filter(el => el);
        let seedRanges = chunks.shift().split(/:\s+/)[1]
            .split(/\s+/).filter(el => el).map(n => parseInt(n, 10));

        let seedStartAndLenPairs = arrayChunk(seedRanges, 2);

        /*
        There are way too many seeds to go through all of them 1 by 1, so instead the goal is to find ranges of seeds
        that flock together entirely (ie: this range all maps using the same entire conversion range, or no range at all)

        so we check each seed range to see if it does entirely map together and, if not, we split it into two ranges
        at an intersection point (ie: a point which is the start/end of a conversion range that intersects)
        and then we test those 2 new ranges until all seed ranges flock together again

        Then we do the action conversion, and keep going
        */
        chunks.forEach(chunk => {
            let conversions = chunk.split(/\n/).filter(el => el).slice(1)
                .map(l => l.split(/\s+/).filter(el => el).map(n => parseInt(n, 10)));

            let queue = seedStartAndLenPairs.slice();
            seedStartAndLenPairs = [];
            let iterations = 0;
            while (queue.length) {
                let pair = queue.pop();
                let splitPoint = getRangeSplitPoint(pair, conversions);
                if (splitPoint !== null) {
                    assert(splitPoint[0][1] >= 1, 'first len violation');
                    assert(splitPoint[1][1] >= 1, 'second len violation');
                    queue.push(...splitPoint);
                    continue;
                }

                seedStartAndLenPairs.push(pair);
                iterations++;
                assert(iterations < 10000, 'too many iterations');
            }

            seedStartAndLenPairs = seedStartAndLenPairs.map(pair => {
                return [
                    findMappedLocation(pair[0], conversions),
                    pair[1],
                ];
            });
        });

        return numericSortLowestToHighest(seedStartAndLenPairs.map(el => el[0])).shift();
    };

    let findMappedLocation = (currentLocation, ranges) => {
        for (let i = 0; i < ranges.length; i++) {
            let [destStart, sourceStart, rangeLength] = ranges[i];

            let inRange = currentLocation >= sourceStart && currentLocation <= (sourceStart + rangeLength - 1);
            if (!inRange) {
                continue;
            }

            return currentLocation - sourceStart + destStart;
        }

        return currentLocation;
    };

    let findLowestSeedNumber = (rawInputString) => {
        let chunks = rawInputString.split(/\n\n/).filter(el => el);
        let seeds = chunks.shift().split(/:\s+/)[1]
            .split(/\s+/).filter(el => el).map(n => parseInt(n, 10));

        let current = seeds;
        chunks.forEach(chunk => {
            let conversions = chunk.split(/\n/).filter(el => el).slice(1)
                .map(l => l.split(/\s+/).filter(el => el).map(n => parseInt(n, 10)));

            // the goal is to map current using the conversions
            current = current.map(loc => {
                return findMappedLocation(loc, conversions);
            });
        });

        return numericSortLowestToHighest(current).shift();
    };

    return [findLowestSeedNumber, findLowestSeedNumberWithRanges];
})();
