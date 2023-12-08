
let assert = (assertion, message) => {
    if (!assertion) {
        throw `Assertion failed: ${message}`;
    }
};

let today = 9;
let chosenDay = today;

let loadDay = (() => {
    let loaded = {};

    return (num, isLoadedCallback) => {
        if (loaded[num]) {
            isLoadedCallback();
            return;
        }

        assert(num === parseInt(num, 10));
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `./day${num}.js`;
        script.addEventListener('load', isLoadedCallback);
        document.body.appendChild(script);
        loaded[num] = true;
    };
})();

// setup looking at any given day:
(() => {
    let select = document.querySelector(".current-day")

    for (let i = 1; i <= today; i++) {
        let option = document.createElement('option');
        option.innerText = i;
        option.value = i;
        if (i === chosenDay) {
            option.selected = true;
        }
        select.appendChild(option);
    }
})();

let chooseDay = (dayNum) => {
    chosenDay = dayNum;

    let afterDayLoad = () => {
        let parts = window[`day${chosenDay}`] || [];

        let buttons = Array.prototype.slice.call(document.querySelectorAll('.run-today'));
        for (let i = 0; i < 2; i++) {
            let button = buttons[i];
            if (!parts[i]) {
                button.disabled = true;
                continue;
            }

            button.disabled = false;
        }
    };

    loadDay(chosenDay, afterDayLoad);
};

chooseDay(chosenDay);

document.querySelector(".current-day").addEventListener('change', e => {
    chooseDay(parseInt(e.target.value, 10));
});

document.querySelectorAll('button.run-today').forEach(el => el.addEventListener('click', e => {
    let button = e.target;
    let input = document.querySelector('.problem-input').value;

    let partFunctions = window[`day${chosenDay}`];
    let part = parseInt(e.target.dataset.part, 10);

    let partFunction = partFunctions[part - 1];
    if (partFunction instanceof Function) {
        let answer = partFunction(input);
        console.log(answer);
        document.querySelector('.answer').innerText = answer;
    } else {
        console.log(`Part ${part} for day ${chosenDay} is not yet defined`);
    }
}));

// shared utility functions:

let numericSortLowestToHighest = (arr) => {
    return arr.sort(numericSortLowestToHighestComparator);
};

let numericSortLowestToHighestComparator = (a, b) => a > b ? 1 : (b > a) ? -1 : 0;

let last = (arr) => arr[arr.length - 1];

let arrayChunk = (arr, chunkSize = 1) => {
    assert(chunkSize > 0, 'expected `chunkSize` to be at least 1');
    let result = [];
    let row = [];
    for (let i = 0; i < arr.length; i++) {
        if (i % chunkSize === 0) {
            if (row.length) {
                result.push(row);
            }
            row = [];
        }

        row.push(arr[i]);
    }

    if (row.length) {
        result.push(row);
    }

    return result;
};

let rangeToArray = (start, end, step = 1) => {
    assert(step !== 0, '`step` cannot be 0');
    assert((start < end && step > 0) || (start > end && step < 0) || start === end, '`step` must lead from `start` to `end`');

    let [sortedStart, sortedEnd] = [start,end].sort(numericSortLowestToHighestComparator);
    let result = [];
    for (let i = sortedStart; i <= sortedEnd; i += Math.abs(step)) {
        result.push(i);
    }

    return step > 0 ? result : result.reverse();
};

let objectFlip = (obj) => {
    let result = {};
    Object.entries(obj).forEach(([key, val]) => {
        result[val] = key;
    });
    return result;
};

let stringToLetterSet = (str) => {
    let result = {};
    for (let i = 0; i < str.length; i++) {
        result[str[i]] = true;
    }

    return result;
}

