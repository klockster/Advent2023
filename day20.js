var day20 = (() => {
    const BUTTON = 'button';
    const BROADCASTER = 'broadcaster';
    const FLIPFLOP = '%';
    const CONJUNCTION = '&';
    const OFF = false;
    const ON = true;
    const LOWPULSE = 'low';
    const HIGHPULSE = 'high'

    let gcd = (a, b) => {
        while (b !== 0) {
            let remainder = a % b;
            [a, b] = [b, remainder];
        }

        return a;
    }

    let leastCommonMultiple = (...numbers) => {
        return numbers.reduce((a, e) => {
            return (a * e) / gcd(a, e);
        }, 1);
    };

    let findRxPrevious = (modulesObject) => {
        let previousKey = Object.keys(modulesObject).find(key => {
            let obj = modulesObject[key];
            if (
                obj.type === CONJUNCTION &&
                obj.targets[0] === 'rx'
            ) {
                return true;
            }

            return false;
        });

        assert(previousKey);
        return modulesObject[previousKey];
    };

    // Ok, assume the reason this can't complete in time is that the node before rx is a CONJUNCTION type
    // the only way a CONJUNCTION type fires a low pulse is if all its inputs are high pulses at the same time
    // so we look up what those inputs are via `findRxPrevious`, then we see what the minimum cycles are to
    // make each of those a high pulse.  Then take the LCM of those inputs
    let findFewestButtonPressesToRxModule = (rawInputString) => {
        let lines = rawInputString.split(/\n/).filter(el => el);
        let modulesObject = processLinesToModulesObject(lines);

        let rxPrevious = findRxPrevious(modulesObject);

        let iterations = 0;
        let finished = false;

        let firstHighPulsesMap = {};


        while (!finished) {
            iterations++;
            let queue = [{type: LOWPULSE, dest: BROADCASTER, origin: BUTTON}];

            while (queue.length) {
                let currentPulse = queue.shift();

                if (
                    currentPulse.dest === rxPrevious.name &&
                    currentPulse.type === HIGHPULSE &&
                    firstHighPulsesMap[currentPulse.origin] === undefined
                ) {
                    firstHighPulsesMap[currentPulse.origin] = iterations;
                    if (Object.keys(firstHighPulsesMap).length === Object.keys(rxPrevious.inputmap).length) {
                        finished = true;
                        break;
                    }
                }

                let receiver = modulesObject[currentPulse.dest];
                if (!receiver) {
                    continue;
                }

                if (receiver.type === BROADCASTER) {
                    receiver.targets.forEach(targetName => {
                        queue.push({type: currentPulse.type, dest: targetName, origin: BROADCASTER });
                    });
                    continue;
                }

                let outgoingPulseType;
                if (receiver.type === CONJUNCTION) {
                    receiver.inputmap[currentPulse.origin] = currentPulse.type;
                    outgoingPulseType = !!Object.values(receiver.inputmap).find(el => el === LOWPULSE) ? HIGHPULSE : LOWPULSE;
                    receiver.targets.forEach(targetName => {
                        queue.push({ type: outgoingPulseType, dest: targetName, origin: receiver.name });
                    });
                    continue;
                }

                assert(receiver.type === FLIPFLOP, `${FLIPFLOP} is the only type left`);
                if (currentPulse.type === HIGHPULSE) {
                    continue;
                }

                outgoingPulseType = receiver.state === ON ? LOWPULSE : HIGHPULSE;
                receiver.state = !receiver.state;
                receiver.targets.forEach(targetName => {
                    queue.push({ type: outgoingPulseType, dest: targetName, origin: receiver.name });
                });
            }
        }

        return leastCommonMultiple(...Object.values(firstHighPulsesMap));
    };


    let processLinesToModulesObject = (lines) => {
        let result = {};
        lines.forEach(line => {
            let [rawType, rawTargets] = line.split(' -> ');
            let targets = rawTargets.split(/,\s+/).filter(el => el);

            let name = rawType === 'broadcaster' ? rawType : rawType.slice(1);
            let type = rawType === BROADCASTER ? BROADCASTER : rawType[0];

            let obj = {
                name, type, targets
            };
            if (type === FLIPFLOP) {
                obj.state = OFF;
            }
            if (type === CONJUNCTION) {
                obj.inputmap = {};
            }

            result[name] = obj;
        });

        Object.keys(result).forEach(name => {
            let obj = result[name];
            obj.targets.forEach(targetName => {
                let target = result[targetName];
                if (!target) return;
                if (target.type === CONJUNCTION) {
                    target.inputmap[name] = LOWPULSE;
                }
            });
        });

        return result;
    };

    let getPulsesSentAfterButtonPresses = (modulesObject, times = 1000) => {
        let pulsesSent = { low: 0, high: 0 };
        for (let i = 0; i < times; i++) {
            let queue = [{type: LOWPULSE, dest: BROADCASTER, origin: BUTTON}];

            while (queue.length) {
                let currentPulse = queue.shift();
                pulsesSent[currentPulse.type]++;

                let receiver = modulesObject[currentPulse.dest];
                if (!receiver) {
                    continue;
                }

                if (receiver.type === BROADCASTER) {
                    receiver.targets.forEach(targetName => {
                        queue.push({type: currentPulse.type, dest: targetName, origin: BROADCASTER });
                    });
                    continue;
                }

                let outgoingPulseType;
                if (receiver.type === CONJUNCTION) {
                    receiver.inputmap[currentPulse.origin] = currentPulse.type;
                    outgoingPulseType = !!Object.values(receiver.inputmap).find(el => el === LOWPULSE) ? HIGHPULSE : LOWPULSE;
                    receiver.targets.forEach(targetName => {
                        queue.push({ type: outgoingPulseType, dest: targetName, origin: receiver.name });
                    });
                    continue;
                }

                assert(receiver.type === FLIPFLOP, `${FLIPFLOP} is the only type left`);
                if (currentPulse.type === HIGHPULSE) {
                    continue;
                }

                outgoingPulseType = receiver.state === ON ? LOWPULSE : HIGHPULSE;
                receiver.state = !receiver.state;
                receiver.targets.forEach(targetName => {
                    queue.push({ type: outgoingPulseType, dest: targetName, origin: receiver.name });
                });
            }
        }

        return pulsesSent;
    };

    let findNumPulsesSent = (rawInputString) => {
        let lines = rawInputString.split(/\n/).filter(el => el);
        let pulsesSent = getPulsesSentAfterButtonPresses(processLinesToModulesObject(lines));
        return pulsesSent.low * pulsesSent.high;
    };


    return [findNumPulsesSent, findFewestButtonPressesToRxModule];
})();
