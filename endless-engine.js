// TODO: Allow multiple of a field and `is_unique: true` or `can_repeat: false` to determine if the multiples must be unique
// TODO: `{[1, 2, 3]} syntax: If contents aren't string, try JSON.parse
// TODO: Dynamic key labels
// TODO: URLs for links



class Randomizer {
    static capitalizeFirst(text) {
        return text.substring(0,1).toUpperCase() + text.substring(1);
    }

    static randElem(list) {
        if (!Array.isArray(list))
            throw "ERROR: randElem must be called on an array."
        if (!list.length)
            return;
        return list.some(item=>item?.p) ? 
            Randomizer.weightedRandElem(list, list.map(e => e.p)) :
            list[Randomizer.randInt(list.length)];
    }

    // TODO: Test if {by__someIndex: [a, b, c]} works to allow for normal or exponential array indexing
    static randExp(vMin, vMax, k) {
        const vRange = vMax > vMin ? vMax - vMin + 1 : vMax - vMin - 1;
        k = k || 2;
        const roughResult = vRange / ((1 - 2 ** -k) * (2 ** (k - 1))) * (2 ** (k * Math.random() - 1) - 0.5) + vMin;
        return vMax > vMin ? Math.floor(roughResult) : Math.ceil(roughResult);
    }

    static randInt(n, m) {
        return isNaN(m) ? Math.floor(Math.random() * n) : Randomizer.randInt(m - n) + n;
    }

    static randNorm(nMin, nMax) {
        let n = nMin - 1;
        const weight = nMax - nMin / 6;
        const offset = (nMin + nMax) / 2;
        while (n < nMin || n > nMax) {
            // Box-Muller transform for normal distribution approximation.
            const u = 1 - Math.random();
            const v = 1 - Math.random();
            n = Math.round(weight * (Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )) + offset);
        }
        return n.toString();
    }

    static weightedRandElem(list, pList) {
        let idx = 0;
        let p = Math.random() * pList.reduce((p1, p2) => p1 + p2);
        while (p > 0) {
            if (p < pList[idx])
                return list[idx];
            p -= pList[idx]; idx++;
        }
    }
    
    constructor (data, fields) {
        this.data = data || {};
        this.fields = fields || [];
        this.dataOut = {};
        this.randomizerFields = {};
    }

    generateElements(targetID) {
        targetID = targetID === undefined ? "randomizer-target" : targetID;
        const randomizerTarget = document.getElementById(targetID);
        if (!randomizerTarget)
            throw `Could not find element with ID: ${targetID}`;
        while (randomizerTarget.firstChild)
            randomizerTarget.firstChild.remove();
        for (let key in this.randomizerFields)
            this.randomizerFields[key].generateElement(targetID);
    }

    randomize(fields, targetID) {
        fields = fields || this.fields  || Object.keys(this.data);
        targetID = targetID === undefined ? "randomizer-target" : targetID;
        if (!Array.isArray(fields) || !fields.length)
            throw "No fields provided to randomize.";
        for (let field of fields) {
            this.dataOut[field] = undefined;
            this.randomizerFields[field] = new RandomizerField(field, this.data, this.dataOut);
        }

        for (let key in this.randomizerFields)
            // try ...
            this.randomizerFields[key].randomize(this.dataOut);
            // ... catch ...
        if (targetID !== undefined)
            this.generateElements(targetID);
    }

}

class RandomizerField {
    static formatText(text, capitalize) {
        capitalize = capitalize === undefined ? true : capitalize;
        text = String(text) || "";
        text = text.trim();
        if(text && !isNaN(text))
            text = [...text].map((c,i) => 
                (text.length - 1 - i) % 3 || !(text.length - 1 - i) ? c : `${c},`).reduce((t,c)=>t+c);
        if (!/\W/.test(text)) {
            text = text.replace(/([a-z])([A-Z])/g, "$1 $2");
            if (capitalize)
                text = Randomizer.capitalizeFirst(text);
            else if(/^[a-z]/.test(text))
                text = text.toLowerCase();
        }
        return text;
    }

    constructor(field, data, dataOut) {
        this.data = data;
        this.dataOut = dataOut;
        this.field = field;
        
        this.dataSet = this.data?.[this.field];
        this.format = undefined;
        this.value = undefined;
    }

    get format() {
        if (!this._format) {
            this._format = this.value?.format
            || this.data?.[this.field]?.format
            || undefined;
        }
        return this._format;
    }

    set format(f) {
        this._format = f;
    }

    cleanData(item) {
        if (typeof item === "string")
            return {
                text: this.formatValue(item),
                value: item,
            }
        if (typeof item.value !== "string") {
            Object.assign(item, item.value);
        }
        return item;
    }
    
    formatValue() {
        if (typeof this.value === "string")
            this.text = RandomizerField.formatText(this.replaceFields(this.value));
        else if (!this.format)
            this.text = RandomizerField.formatText(this.replaceFields(this.text === undefined ? this.value : this.text));
        else {
            this.text = Array.isArray(this.format) ? 
                this.format.map(f => RandomizerField.formatText(this.replaceFields(f))) :
                RandomizerField.formatText(this.replaceFields(this.format));
        }
        return this.text;
    }

    generateElement(target) {
        // TODO: Add option to include empty elements.
        if (!this.text && !this.format)
            return;
        if (typeof target === "string")
            target = document.getElementById(target)
        this.formatValue();
        const listItem = document.createElement("li");
        listItem.className = "row";
        const keyField = document.createElement("strong");
        keyField.innerText = RandomizerField.formatText(this.field);
        listItem.append(keyField);
        const textField = document.createElement("div");
        listItem.append(textField);
        if (Array.isArray(this.text)) {
            this.text.forEach((t, idx) => {
                const textSpan = document.createElement(idx ? "small" : "span");
                textSpan.innerText = Randomizer.capitalizeFirst(t);
                textField.append(textSpan);
            });
        } else {
            textField.innerText = Randomizer.capitalizeFirst(this.text);
        }
        if (target?.nodeType === 1)
            target?.append(listItem);
        this.element = listItem;
        return listItem;
    }

    getByFieldRange(dataSet, byField) {
        dataSet = dataSet || this.dataSet;
        if (!this.dataOut[byField])
            this.dataOut[byField] = new RandomizerField(byField, this.data, this.dataOut).randomize();
        const subsetKey = Object.keys(dataSet["by__" + byField + "__range"]).find(key => {
            const rxMatch = /^.(\d+)(?:__(\d+)$|$)/.exec(key);
            const min = rxMatch[1]?.length ? Number(rxMatch[1]) : undefined;
            const max = rxMatch[2]?.length ? Number(rxMatch[2]) : undefined;
            return min <= this.dataOut[byField].value && (max === undefined || this.dataOut[byField].value <= max);
        });
        return this.randomizeValue(dataSet["by__" + byField + "__range"][subsetKey]);
    }
    
    getByFieldValue(dataSet, byField) {
        dataSet = dataSet || this.dataSet;
        if (!this.dataOut[byField])
            this.dataOut[byField] = new RandomizerField(byField, this.data, this.dataOut).randomize();
        let dataSubset;
        if (Object.keys(dataSet["by__" + byField]).includes(this.dataOut[byField].value))
            dataSubset = dataSet["by__" + byField][this.dataOut[byField].value];
        else {
            const rex = new RegExp("(?:__|^)" + this.dataOut[byField].value + "(?:__|$)");
            const byFieldKey = Object.keys(dataSet["by__" + byField]).filter(key => rex.test(key))[0];
            dataSubset = byFieldKey === undefined ?
                dataSet["by__" + byField].default : dataSet["by__" + byField][byFieldKey];
        }
        if (dataSubset === undefined)
            throw `Error in "by__" field: ${byField}`;
        return dataSubset && this.randomizeValue(dataSubset);
    }

    getWithTree(tree, data) {
        if (data === undefined)
            data = this.data;
        if (tree.length)
            return this.getWithTree(tree.slice(1), data[tree[0]]);
        return data;
    }
    
    randomize(dataOut, forceNew) {
        if (dataOut === undefined)
            dataOut = this.dataOut;
        if (forceNew || this.dataOut?.[this.field] === undefined) {
            const randomizedValue = this.randomizeValue(this.data, this.field);
            this.value = randomizedValue?.value === undefined ? randomizedValue : randomizedValue.value;
            if (typeof dataOut === "object" && this.field !== undefined)
                dataOut[this.field] = randomizedValue;
        } else if (this.value === undefined) {
            this.format = dataOut[this.field].format;
            this.value = dataOut[this.field].value;
        }
        if (dataOut !== undefined && this.field !== undefined)
            dataOut[this.field] = this.cleanData(dataOut[this.field]);
        this.value = this.cleanData(this.value);
        return dataOut ? dataOut[this.field] : this.value;
    }

    randomizeValue(dataIn, field) {
        const dataSet = field ? dataIn[field] : 
            dataIn === undefined ? this.dataSet : dataIn;

        if (!dataSet)
            return "";

        if (typeof dataSet === "string")
            return dataSet;

        // TODO: Improve this
        if (dataSet?.value) {
            const dataSetOut = JSON.parse(JSON.stringify(dataSet))
            dataSetOut.value = this.randomizeValue(dataSet.value);
            return dataSetOut;
        }
        
        if (Array.isArray(dataSet))
            return this.randomizeValue(Randomizer.randElem(dataSet));
        
        if (Array.isArray(dataSet.values))
            return this.randomizeValue(Randomizer.randElem(dataSet.values));
        
        if (dataSet.range)
            return Randomizer.randInt(...dataSet.range).toString();
        
        if (dataSet.normal_range)
            return Randomizer.randNorm(...dataSet.normal_range).toString();
        
        if (dataSet.exp_range)
            return Randomizer.randExp(...dataSet.exp_range).toString();
        
        if (Object.keys(dataSet).some(key => /^by__/.test(key))) {
            // TODO: handle multiple "by__" clauses, starting with which fields are user defined/locked.
            // TODO: handle reversing "by__" clauses (Bayesian probability calculation)
            const byField = Object.keys(dataSet).filter(key => /^by__/.test(key))[0].replace(/^by__/, "");
            if (/__range$/.test(byField))
                return this.getByFieldRange(dataSet, byField.replace(/__range$/, ""), dataIn);
            return this.getByFieldValue(dataSet, byField, dataIn);
        }
        if (dataSet === data && field === undefined)
            throw field === undefined ? "Data error. Could not randomize." : `Data error on field: "${field}". Could not randomize.`;
        return dataSet;
    }

    replaceFields(templateString) {
        let prevString;
        do {
            prevString = templateString;
            templateString = templateString.replace(/\{(\w+)\}/g, (m, g) => {
                if (g.includes("__")) {
                    const tree = g.split("__");
                    if (!this.dataOut[tree[0]])
                        this.dataOut[tree[0]] = new RandomizerField(tree[0], this.data, this.dataOut).randomize();
                    return RandomizerField.formatText(this.getWithTree(g.split("__"), this.dataOut), false);
                }
                if (!this.dataOut[g])
                    this.dataOut[g] = new RandomizerField(g, this.data, this.dataOut).randomize();
                return RandomizerField.formatText(this.dataOut[g].value, false);
            });
        } while (templateString != prevString);
        return templateString;
    }
}
