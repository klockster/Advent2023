var day19 = (() => {
    let findAllAcceptedRatings = (rawInputString) => {
        let [ruleStrings, partsStrings] = rawInputString.split(/\n\n/)
            .map(section => section.split(/\n/).filter(el => el));

        let rulesObject = parseRulesStringsToRulesObject(ruleStrings);
        let accepted = [];
        let queue = [{name: 'in', rules: []}];

        while (queue.length) {
            let current = queue.pop();
            let orderedRules = rulesObject[current.name];

            let prevRules = [];
            orderedRules.forEach(rule => {
                if (rule.op) {
                    prevRules.push({
                        prop: rule.prop,
                        op: rule.op === '>' ? '<' : '>',
                        val: rule.op === '>' ? rule.val + 1 : rule.val - 1,
                    });
                }

                if (rule.dest === 'R') {
                    return;
                }

                if (!rule.op) {
                    if (rule.dest === 'A') {
                        accepted.push({
                        // we don't slice prevRules here because we can't have added to it before
                            name: rule.dest, rules: [...current.rules, ...prevRules]
                        });
                        return;
                    }

                    // we don't slice prevRules here because we can't have added to it before
                    queue.push({name: rule.dest, rules: [...current.rules, ...prevRules]});
                    return;
                }

                let newRules = [...current.rules, ...prevRules.slice(0, -1), rule];
                if (rule.dest === 'A') {
                    accepted.push({ rules: newRules });
                    return;
                }
                queue.push({ name: rule.dest, rules: newRules });
            });
        }

        let count = 0;

        accepted.forEach(acc => {
            let letterPossibilities = {
                x: Array(4000).fill(null).map((el, i) => i + 1),
                m: Array(4000).fill(null).map((el, i) => i + 1),
                a: Array(4000).fill(null).map((el, i) => i + 1),
                s: Array(4000).fill(null).map((el, i) => i + 1),
            };

            acc.rules.forEach(rule => {
                let prop = rule.prop;
                assert(prop, 'should have this');
                let val = rule.val;

                letterPossibilities[prop] = letterPossibilities[prop].filter(num => {
                    return rule.op === '<' ? (num < val) :
                        (num > val);
                });
            });

            count += Object.values(letterPossibilities).reduce((a, e) => a * e.length, 1);
        });

        return count;
    };

    let parsePartsStringsToObjects = (partsStrings) => {
        return partsStrings.map(str => {
            // pop off the curly braces:
            str = str.slice(1, str.length - 1);
            let assignments = str.split(',');
            let object = {};
            assignments.forEach(a => {
                let [key, value] = a.split('=');
                object[key] = parseInt(value, 10);
            });

            return object;
        });
    };

    let parseRulesStringsToRulesObject = (ruleStrings) => {
        let result = {};
        ruleStrings.forEach(str => {
            let [key, ruleStr] = str.split('{');
            // pop other curly brace:
            ruleStr = ruleStr.slice(0, ruleStr.length - 1);

            let miniRules = ruleStr.split(',');
            let orderedRules = [];

            miniRules.forEach(rule => {
                let pieces = rule.split(/([<>]|:)/);
                assert(pieces.length === 1 || pieces.length === 5, 'Should either have nothing or all of it');
                if (pieces.length === 1) {
                    orderedRules.push({ dest: pieces[0] });
                    return;
                }

                orderedRules.push({
                    prop: pieces[0],
                    op: pieces[1],
                    val: parseInt(pieces[2], 10),
                    dest: pieces[4],
                });
            });

            result[key] = orderedRules;
        });

        return result;
    };

    let getPartDestination = (part, ruleName, rulesObject) => {
        let orderedRules = rulesObject[ruleName];
        for (let i = 0; i < orderedRules.length; i++) {
            let currentRule = orderedRules[i];
            if (!currentRule.prop) {
                return currentRule.dest;
            }

            let partVal = part[currentRule.prop];
            let passesRule = currentRule.op === '<' ? (partVal < currentRule.val) :
                (partVal > currentRule.val);

            if (passesRule) {
                return currentRule.dest;
            }
        }

        assert(false, 'All rules should have a default destination');
    };

    let findAcceptedXmasRatings = (rawInputString) => {
        let [ruleStrings, partsStrings] = rawInputString.split(/\n\n/)
            .map(section => section.split(/\n/).filter(el => el));

        let rulesObject = parseRulesStringsToRulesObject(ruleStrings);

        let parts = parsePartsStringsToObjects(partsStrings);
        let acceptedParts = [];
        parts.forEach(part => {
            let currentRuleName = 'in';
            while (true) {
                currentRuleName = getPartDestination(part, currentRuleName, rulesObject);

                if (currentRuleName === 'A') {
                    acceptedParts.push(part);
                    return;
                }
                if (currentRuleName === 'R') {
                    return;
                }
            }
        });

        return acceptedParts.map(p => Object.values(p).reduce((a, e) => a + e, 0)).reduce((a, e) => a + e, 0);
    };

    return [findAcceptedXmasRatings, findAllAcceptedRatings];
})();
