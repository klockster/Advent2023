var day8 = (() => {
    let stepsToFinish = (current, instructions, networkObject) => {
        let result = 0;
        let isFinished = (el) => el[el.length - 1] === 'Z';

        while (!isFinished(current)) {
            let nextStep = instructions[result % instructions.length];
            assert(nextStep === 'R' || nextStep === 'L');
            let nextStepKey = nextStep === 'R' ? 'right' : 'left';

            result++;
            current = networkObject[current][nextStepKey];
        }

        return result;
    };

    let gcd = (a, b) => {
        if (b === 0) {
            return a;
        }

        let remainder = a % b;
        return gcd(b, remainder);
    };

    let leastCommonMultiple = (...numbers) => {
        return numbers.reduce((a, e) => {
            return (a * e) / gcd(a, e);
        }, 1);
    };

    let countSimultaneousStepsToEnds = (rawInputString) => {
        let [instructions, rawNetworkString] = rawInputString.split(/\n\n/);

        let networkObject = buildNetworkObject(rawNetworkString);

        let currentPool = Object.keys(networkObject).filter(el => el[el.length - 1] === 'A');
        assert(currentPool.length);

        // brute-forcing didn't work, so let's assume that we can do this with the least common multiple
        // of the steps that each individual node would take to land on a Z-node.
        // this assumption seems to work, but I'm not convinced it's a given, since a node could have multiple
        // Z-nodes in it's path, presumably, before it cycles somewhere (and that cycling could be weird too)
        // oh well.
        return leastCommonMultiple(...currentPool.map(el => stepsToFinish(el, instructions, networkObject)));
    };

    let buildNetworkObject = (rawNetworkString) => {
        let lines = rawNetworkString.split(/\n/).filter(el => el);
        let result = {};

        lines.forEach(line => {
            let [name, pathsString] = line.split(/\s+=\s+/);
            let [left, right] = pathsString.slice(1, -1).split(/,\s+/);

            result[name] = { left, right };
        });

        return result;
    };

    let countTotalStepsToEnd = (rawInputString) => {
        let [instructions, rawNetworkString] = rawInputString.split(/\n\n/);

        let networkObject = buildNetworkObject(rawNetworkString);

        let result = 0;
        let current = 'AAA';
        while (current !== 'ZZZ') {
            let nextStep = instructions[result % instructions.length];
            assert(nextStep === 'R' || nextStep === 'L');
            let nextStepKey = nextStep === 'R' ? 'right' : 'left';

            result++;
            current = networkObject[current][nextStepKey];
        }

        return result;
    };

    return [countTotalStepsToEnd, countSimultaneousStepsToEnds];
})();
