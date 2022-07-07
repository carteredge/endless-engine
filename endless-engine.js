// TODO: {[1, 2, 3]} syntax: If contents aren't variable name, try JSON.parse/randomizeValue
// TODO: Dynamic key labels
// TODO: URLs for links
// TODO: Selectable (dropdown) fields
// TODO: Clean up randomize()/processQuery() arguments/calls
// TODO: Element templates
// TODO: Re-roll field button

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

    static randExp(vMin, vMax, k) {
        const vRange = vMax > vMin ? vMax - vMin + 1 : vMax - vMin - 1;
        k = k || 2;
        const roughResult = vRange / ((1 - 2 ** -k) * (2 ** (k - 1))) * (2 ** (k * Math.random() - 1) - 0.5) + vMin;
        return vMax > vMin ? Math.floor(roughResult) : Math.ceil(roughResult);
    }

    static randomizeFromTagTree(dataSet, options)  {
        dataSet = dataSet;
        let keepGoing;
        const randomizedTreeData = [];
        do {
            const event = Randomizer.randomNode(randomizedTreeData, dataSet)
            event &&
                Object.keys(event).length &&
                randomizedTreeData.push(event);
            while (randomizedTreeData[randomizedTreeData.length - 1].next) {
                const outcomeEvent = Randomizer.randomNode(randomizedTreeData, randomizedTreeData[randomizedTreeData.length - 1].next);
                if (!outcomeEvent || !Object.keys(outcomeEvent).length)
                    break;
                randomizedTreeData.push(outcomeEvent);
            }
            keepGoing = options?.n ? 
                randomizedTreeData.length < options.n
                : options?.p ?
                    Math.random() <= options.p
                    : false;
        } while (keepGoing);
    
        return randomizedTreeData; // .map(n => this.randomize(n));
    }

    static randInt(n, m) {
        return isNaN(m) ? Math.floor(Math.random() * n) : Randomizer.randInt(m - n + 1) + n;
    }

    static randomNode(randomizedData, dataSet) {
        const tags = randomizedData.filter(n => n.tags)
            .reduce((total, node) => {
                Array.isArray(node.tags) ?
                total.push(...node.tags) :
                total.push(node.tags);
                return total;
            }, []);
        return {...Randomizer.randElem(
            dataSet.filter(node => {
                const meetsRequirements = node.requiredTags?.length ?
                    Array.isArray(node.requiredTags) ?
                        node.requiredTags.every(n => tags.includes(n)) :
                        tags.includes(node.requiredTags) :
                    true;
                const restricted = node.restrictedTags?.length ?
                    Array.isArray(node.restrictedTags) ?
                        node.restrictedTags.some(n => tags.includes(n)) :
                        tags.includes(restrictedTags) :
                    false;
                return meetsRequirements && !restricted;
            }
        ))};
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
    
    constructor (data, fields, options) {
        this.data = data || {};
        this.fields = fields || [];
        this.randomizedData = {};
        this.randomizerFields = {};
        this.rawValues = {};
        this.options = options || {
            showBlankElements: false,
            showLockButtons: true,
        };
    }

    generateQuery() {
        return Object.keys(this.randomizedData).map(key =>
            `${key}=${encodeURIComponent(JSON.stringify(this.randomizedData[key].value || this.randomizedData[key].text))}`).join("&")
    }

    generateElements(targetID) {
        targetID = targetID === undefined ? "randomizer-target" : targetID;
        const randomizerTarget = document.getElementById(targetID);
        if (!randomizerTarget)
            throw `Could not find element with ID: ${targetID}`;
        while (randomizerTarget.firstChild)
            randomizerTarget.firstChild.remove();
        for (let field of this.fields)
            this.randomizerFields[field].generateElement(targetID, this.options);
    }

    processQuery(fields, targetID) {
        this.randomizedData = {};
        fields = fields || this.fields || Object.keys(this.data);
        if (!Array.isArray(fields) || !fields.length)
            throw "No fields provided to process.";
        let queries = window.location.search.substring(1);
        if (queries) {
            queries = queries.split("&");
            for (let query of queries) {
                const valuePair = query.split("=");            
                this.randomizedData[valuePair[0]] = {value: JSON.parse(decodeURIComponent(valuePair[1]))};
            }
            for (let field of fields) {
                this.randomizerFields[field] = new RandomizerField(field, undefined, this.randomizedData);
                this.randomizerFields[field].value = this.randomizedData[field]?.value;
            }

            if (targetID !== undefined)
                this.generateElements(targetID);
        }
    }

    randomize(fields, targetID) {
        fields = fields || this.fields  || Object.keys(this.data);
        if (!Array.isArray(fields) || !fields.length)
            throw "No fields provided to randomize.";
        for (let field in this.randomizerFields)
            this.randomizerFields[field].reset();
        for (let field of fields)
            this.randomizerFields[field] = this.randomizerFields[field] || new RandomizerField(field, this);

        for (let key in this.randomizerFields)
            try {
                this.randomizerFields[key].randomize();
                this.rawValues[key] = this.randomizerFields[key].rawValue;
            } catch (err) {
                console.warn(`Could not randomize field: ${key}. An unexpected error has occurred. - ${err}`);
            }
        if (targetID !== undefined)
            this.generateElements(targetID);
        const out = {};
        for (let field of fields)
            out[field] = this.randomizedData[field]?.text || this.randomizedData[field]?.value || this.randomizedData[field];
        return out;
    }

}

class RandomizerField {
    constructor(field, parent, dataSet) {
        this.parent = parent;
        this.field = field;

        this.element = undefined;
        this.lockedBy = [];
        this.rawDataSet = dataSet || this.data;
        this.rawValue = undefined;
        this.subFields = [];
        this.text = undefined;
    }

    get data() {
        return this.parent?.data;
    }

    get isLocked() {
        return this._isLocked || this.lockedBy.some(field => field.isLocked); // prevent looped recursion?
    }

    set isLocked(v) {
        this._isLocked = v;
    }

    get options() {
        return this._options ?? this.parent?.options;
    }

    set options(v) {
        this._options = v;
    }

    get randomizerFields() {
        return this.parent.randomizerFields;
     }

    get randomizedData() {
        return this.parent?.randomizedData;
    }

    get rawValues() {
        return this.parent.rawValues;
    }

    get text() {
        if (this._text === undefined)
            this._text = this.getText();
        return this._text;
    }

    set text(t) {
        this._text = t;
    }

    get textPostFormatter() {
        return this.parent?.textPostFormatter;
    }

    get textPreFormatter() {
        return this.parent?.textPreFormatter;
    }

    formatText(text, capitalize) {
        if (typeof this.textPreFormatter === "function")
            text = this.textPreFormatter(text);
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
        if (typeof this.textPostFormatter === "function")
            text = this.textPostFormatter(text);
        return text;
    }

    generateElement(target, options) {
        if (!this.text && !options?.showBlankElements)
            return;
        if (typeof target === "string")
            target = document.getElementById(target)
        const listItem = document.createElement("li");
        listItem.className = "row";
        const keyField = document.createElement("strong");
        keyField.innerText = this.formatText(this.field, options.capitalize); // key
        listItem.append(keyField);
        const textField = document.createElement("div");
        listItem.append(textField); // text
        if (Array.isArray(this.text)) {
            if (!this.text.length && !options?.showBlankElements)
                return;
            this.text.forEach((t, idx) => {
                const textSpan = document.createElement(idx && !this.subFields?.length ? "small" : "span");
                textSpan.innerText = Randomizer.capitalizeFirst(t);
                textField.append(textSpan);
            });
        } else {
            textField.innerText = Randomizer.capitalizeFirst(this.text);
        }
        if (options === undefined || options.showLockButtons) {
            const lockButton = document.createElement("button");
            lockButton.className = `lock-button ${this.isLocked ? "locked" : ""}`;
            lockButton.setAttribute("aria-label", "Lock field.");
            lockButton.onclick = (event) => {
                this.isLocked = !event.currentTarget.classList.contains("locked");
                event.currentTarget.classList.toggle("locked");
            }
            const lockIcon = document.createElement("img");
            lockIcon.className = "lock-icon";
            // TODO: set svg to web src
            lockIcon.src = "../media/lock.svg";
            const unlockIcon = document.createElement("img");
            unlockIcon.className = "unlock-icon";
            // TODO: set svg to web src
            unlockIcon.src = "../media/unlock.svg";
            lockButton.append(lockIcon);
            lockButton.append(unlockIcon);
            listItem.append(lockButton);
        }
        if (target?.nodeType === 1)
            target?.append(listItem);
        this.element = listItem;
        return listItem;
    }

    getByFieldRange(dataSet, byField) {
        dataSet = dataSet || this.rawDataSet;
        if (!this.randomizerFields[byField])
            this.randomizerFields[byField] = new RandomizerField(byField, this.parent);
        if (!this.randomizedData[byField])
            this.randomizedData[byField] = this.randomizerFields[byField].randomize();
        const byValue = typeof this.randomizerFields[byField].rawValue === "string" ?
            this.randomizerFields[byField].rawValue :
                this.randomizerFields[byField].rawValue?.value;
        const rangeKeys = Object.keys(dataSet[`by__${byField}__range`]);
        const subsetKey = rangeKeys.find((key, idx) => {
            // TODO: Consider field names in range (e.g. 1__level: ..., level__10: ...)
            const rxMatch = /^\D{0,1}(\d+)(?:__(\d+)$|$)/.exec(key);
            const min = rxMatch[1]?.length ? Number(rxMatch[1]) : undefined;
            const max = rxMatch[2]?.length ? Number(rxMatch[2]) : undefined;
            return max === undefined && idx < rangeKeys.length - 1 ?
                min === byValue : min <= byValue && byValue <= max;
        });
        return this.randomizeValue(dataSet["by__" + byField + "__range"][subsetKey]);
    }
    
    getByFieldValue(dataSet, byField) {
        dataSet = dataSet || this.rawDataSet;
        if (!this.randomizerFields[byField])
            this.randomizerFields[byField] = new RandomizerField(byField, this.parent);
        if (!this.randomizedData[byField])
            this.randomizedData[byField] = this.randomizerFields[byField].randomize();
        let dataSubset;
        const byValue = typeof this.randomizerFields[byField].rawValue === "string" ?
            this.randomizerFields[byField].rawValue :
                this.randomizerFields[byField].rawValue?.value;
        if (Object.keys(dataSet["by__" + byField]).includes(byValue))
            dataSubset = dataSet["by__" + byField][byValue];
        else {
            const rex = new RegExp("(?:__|^)" + byValue + "(?:__|$)");
            const byFieldKey = Object.keys(dataSet["by__" + byField]).filter(key => rex.test(key))[0];
            dataSubset = byFieldKey === undefined ?
                dataSet["by__" + byField].default : dataSet["by__" + byField][byFieldKey];
        }
        if (dataSubset === undefined)
            throw `Error in "by__" field: ${byField}`;
        return dataSubset && this.randomizeValue(dataSubset);
    }

    getText(item, options) {
        item = item === undefined ? 
            this._text === undefined ? 
                this.rawValue : this._text
                    : item;
        options = options ?? item?.options ?? this.options;
        if (item === undefined)
            return;
        if (typeof item === "string")
            return this.formatText(this.replaceFields(item, options), options.capitalize);
        if (item?.text !== undefined)
            return this.getText(item.text, options);
        if (item?.value !== undefined)
            return this.getText(item.value, options);
        if (item?.format !== undefined)
            return this.getText(item.format, options);
        if (Array.isArray(item))
            return item.map(i => this.getText(i, options));
    }
    
    getWithTree(tree, data) {
        if (typeof tree === "string")
            tree = tree.split("__");
        if (data === undefined)
            data = this.data;
        if (tree.length)
            return this.getWithTree(tree.slice(1), data[tree[0]]);
        return data;
    }

    isUnique(useRawValue) {
        if (this.idx === undefined)
            return true;
        const value = this.useRawValue ? 
            this.rawValue?.value || this.rawValue :
            this.text;
        const otherFields = this.parent?.subFields?.filter(f => f.idx !== this.idx);
        return !otherFields?.length || !otherFields
            ?.map(f => useRawValue ? (f.rawValue?.value || f.rawValue) : f.text ).includes(value);
    }
    
    randomize(forceNew) {
        this.forceNew = forceNew;
        if (forceNew || this.randomizedData?.[this.field] === undefined) {
            this.text = undefined;
            this.rawValue = this.randomizeValue(this.rawDataSet, this.field);
        } else if (this.rawValue === undefined) {
            this.text = undefined;
            this.rawValue = this.randomizedData?.[this.field];
        }
        if (this.unique && this.dataSet &&
            (!Array.isArray(this.dataSet) || this.dataSet?.length) &&
            !this.isUnique(this.uniqueData)) {
            this.randomize(true);
        }

        if (typeof this.randomizedData === "object" && this.field !== undefined) {
            this.parent.rawValues[this.field] = this.rawValue;
            this.randomizedData[this.field] = this.text;
            return this.randomizedData[this.field];
        } else {
            return this.text;
        }
    }

    randomizeValue(dataIn, field) {
        const dataSet = field ? dataIn[field] : 
            dataIn === undefined ? this.dataSet : dataIn;
        this.options = field ? dataIn[field]?.options ?? this.options : this.options;
        if (!dataSet)
            return "";

        if (typeof dataSet === "string")
            return dataSet;

        if (dataSet.count && this.idx === undefined) {
            const count = this.replaceFields(this.randomizeValue(dataSet.count), this.options);
            if (!isNaN(count)) {
                this.subFields = [];
                let newDataSet = {};
                if (dataSet.unique || dataSet.uniqueData) {
                    if (this.field)
                        newDataSet[this.field] = JSON.parse(JSON.stringify(dataSet));
                    else
                        newDataSet = JSON.parse(JSON.stringify(dataSet));
                }
                let valueList = [...Array(Number(count))].map((x, idx) => {
                    let subField;
                    if (dataSet.unique || dataSet.uniqueData) {
                        subField = new RandomizerField(this.field, this, newDataSet);
                        subField.unique = true;
                        subField.uniqueData = dataSet.uniqueData;
                    } else {
                        subField = new RandomizerField(this.field, this);
                    }
                    subField.idx = idx;
                    this.subFields[idx] = subField;
                    return subField.randomize(true);
                });
                if (dataSet.sort || dataSet.sort_by) {
                    if (dataSet.sort_by) {
                        if (dataSet.sort === "desc")
                            this.subFields.sort((a, b) => {
                                const aSortBy = this.getWithTree(dataSet.sort_by, a.rawValue?.value || a.rawValue);
                                const bSortBy = this.getWithTree(dataSet.sort_by, b.rawValue?.value || b.rawValue);
                                return aSortBy < bSortBy ?
                                    1 : aSortBy > bSortBy ? -1 :
                                        a.text < b.text; // TODO: separate asc/desc for sort/sort_by
                            });
                        else
                            this.subFields.sort((a, b) => {
                                const aSortBy = this.getWithTree(dataSet.sort_by, a.rawValue?.value || a.rawValue);
                                const bSortBy = this.getWithTree(dataSet.sort_by, b.rawValue?.value || b.rawValue);
                                return aSortBy > bSortBy ?
                                    1 : aSortBy < bSortBy ? -1 :
                                        a.text > b.text; // TODO: separate asc/desc for sort/sort_by
                            });
                        valueList = this.subFields.map(f => f.text);
                    } else {
                        if (dataSet.sort === "desc")
                            valueList.sort((a, b) => a < b);
                        else
                            valueList.sort((a, b) => a > b);
                    }
                }
                if (dataSet.collapse) {
                    valueList = valueList.filter((v, idx) => idx === valueList.indexOf(v))
                        .map(v => {
                            const itemCount = valueList.filter(v2 => v2 === v)?.length;
                            return itemCount > 1 ? 
                                `${v}${dataSet.collapse_label || " x "}${valueList.filter(v2 => v2 === v)?.length}`
                                : v;
                        }); // store as a count in rawValue somewhere (or otherwise make accessible as data structure for user)?
                            // TODO: "sort_by": "count"?
                }
                return valueList;
            }
        }

        if (dataSet?.value) {
            const dataSetOut = JSON.parse(JSON.stringify(dataSet));
            dataSetOut.value = this.randomizeValue(dataSet.value);
            return dataSetOut;
        }
        
        if (Array.isArray(dataSet) && !this.subFields?.length) {
            if (dataSet.some(e => e?.p && isNaN(e.p))) {
                const probs = dataSet.map(e => Number(this.replaceFields(this.randomizeValue(e?.p), this.options)));
                return this.randomizeValue(Randomizer.weightedRandElem(dataSet, probs));
            }
            if (this.unique) {
                return this.randomizeValue(dataSet.splice(dataSet
                    .indexOf(Randomizer.randElem(dataSet)), 1)[0]);
            }
            return this.randomizeValue(Randomizer.randElem(dataSet));
        }
        
        // TODO: Allow fields in ranges - range: [1, "{level}"]
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

        if (dataSet.tree)
            return Randomizer.randomizeFromTagTree(
                dataSet.tree,
                {
                    n: dataSet.n ? this.randomizeValue(dataSet.n) : 0,
                    p: dataSet.p ? this.randomizeValue(dataSet.p) : 0
                }
            );

        if (dataSet === data && field === undefined)
            throw field === undefined ? "Data error. Could not randomize." : `Data error on field: "${field}". Could not randomize.`;
        return dataSet;
    }

    replaceFields(templateString, options) {
        let prevString;
        const forceNew = options?.forceNew ?? this.forceNew ?? false;
        templateString = templateString.toString();
        do {
            prevString = templateString;
            templateString = templateString.replace(/\{(\w+)\}/g, (m, g) => {
                if (g.includes("__")) {
                    const tree = g.split("__");
                    if (forceNew || !this.randomizerFields[tree[0]])
                        this.randomizerFields[tree[0]] = new RandomizerField(tree[0], this);
                    this.randomizerFields[tree[0]].lockedBy.push(this);
                    if (forceNew || !this.randomizedData[tree[0]]) {
                        this.randomizedData[tree[0]] = this.randomizerFields[tree[0]].randomize(forceNew);
                    }
                    return this.formatText(this.getWithTree(g, this.randomizedData), false); 
                }
                if (forceNew || !this.randomizerFields[g])
                    this.randomizerFields[g] = new RandomizerField(g, this);
                this.randomizerFields[g].lockedBy.push(this);
                if (forceNew || !this.randomizedData[g])
                    this.randomizedData[g] = this.randomizerFields[g].randomize(forceNew);
                return this.formatText(this.randomizedData[g], false);
            });
        } while (templateString != prevString);
        return templateString;
    }

    reset(overwriteLock) {
        const lock = overwriteLock === undefined ? this.isLocked : overwriteLock;
        if (!lock) {
            this.rawValue = undefined;
            this.text = undefined;
            if (this.field) {
                this.parent.rawValues[this.field] = undefined;
                this.randomizedData[this.field] = undefined;
            }
        }
    }
}
