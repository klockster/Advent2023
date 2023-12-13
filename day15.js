var day15 = (() => {
    let getMultipliedHashmapBoxes = (rawInputString) => {
        let steps = rawInputString.split(/,/).filter(el => el);
        let boxes = {};

        steps.forEach(step => {
            let isDelete = !!step.match(/\-/);
            let [key, factor] = step.split(/[\-=]/);
            assert((!isDelete && factor) || (isDelete && !factor), 'just checking');

            let boxIndex = getHashString(key);
            let slots = boxes[boxIndex] || [];

            if (isDelete) {
                let deleteIndex = slots.findIndex(el => el[key] !== undefined);
                if (deleteIndex !== -1) {
                    slots.splice(deleteIndex, 1);
                }
                return;
            }

            // this means we're adding / overwriting
            let overwriteIndex = slots.findIndex(el => el[key] !== undefined);
            if (overwriteIndex !== -1) {
                slots[overwriteIndex] = {[key]: factor};
                return;
            }

            slots.push({[key]: factor});
            boxes[boxIndex] = slots;
        });

        let result = 0;
        for (let i = 0; i < 256; i++) {
            let slots = boxes[i] || [];
            result += slots.reduce((a, e, slotIndex) => {
                let focalLength = Object.values(e)[0];
                return a + ((i + 1) * (slotIndex + 1) * focalLength);
            }, 0);
        }

        return result;
    };

    let getHashString = (str) => {
        let result = 0;
        str.split('').forEach(char => {
            let code = char.charCodeAt(0);
            result += code;
            result = result * 17;
            result = result % 256;
        });
        return result;
    };

    let getSummedHashSteps = (rawInputString) => {
        let steps = rawInputString.split(/,/).filter(el => el);

        return steps.map(step => getHashString(step)).reduce((a, e) => a + e);

    };

    return [getSummedHashSteps, getMultipliedHashmapBoxes];
})();
