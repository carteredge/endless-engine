![Endless Engine logo](https://carteredge.dev/endless-engine/media/endless-engine-0_5.png)

# The Endless Engine

## About

The Endless Engine is a data-driven, recursive, randomization engine which supports conditional randomization, linear, normal, and exponential distributions, and more!

### [Try it out!](https://carteredge.dev/endless-engine/sample)

### [The Endless Engine home page](https://carteredge.dev/endless-engine)

## Table of Contents

- [Why Vanilla Javascript?](#vanilla)
- [Using the Endless Engine](#using)
  - [The Basics](#basics)
- [In Your Own Code: The `Randomizer` Class](#yourcode)
  - [Initialization](#init)
  - [Calling the Randomizer](#randomizer)
- [Creating Your Own Endless Engine Data](#data)
  - [Basic Data](#basic-data)
  - [Template Strings](#templates)
  - [Conditional Randomization](#conditional)
    - [Randomization by Other Result](#by-fields)
    - [Randomization by Numeric Range](#by-range)
  - [Weighted Randomization](#weighted)
  - [Integer Randomization](#int)
    - [Linear Distribution](#linear)
    - [Normal Distribution](#normal)
    - [Exponential Distribution](#exp)
  - [The `format` Property](#format)

---

## <a name="vanilla">Why Vanilla JavaScript?</a>

When I started working on the project that would eventually become the Endless Engine, I knew I would want the data to be flexible enough that I could adapt it to various RPG systems and settings. Because of this, I thought it should be easy enough for even users with minimal technical skills to swap in their own data sets. Keeping the Endless Engine as vanilla JavaScript and not relying on external dependencies, hosting, or running a local server like Node.js meant that other users could download the [sample](https://github.com/carteredge/endless-engine/tree/main/sample), swap in their own data, and run it locally. This also means users can create their own randomizers for data from licensed information as long as they don't redistribute it.

---

## <a name="using">Using the Endless Engine</a>

### <a name="bascis">The Basics</a>

To get the Endless Engine running, you need a little knowledge of HTML and JS data structures, but no more. In fact, everything you need to get started is in the sample code. You can [try the sample out here](https://carteredge.dev/endless-engine/sample), or you can download [the sample code from the Endless Engine github](https://github.com/carteredge/endless-engine/tree/main/sample).

## <a name="yourcode">In Your Own Code: The `Randomizer` Class</a>

### <a name="init">Initialization</a>

To use the Endless Engine in your own Code, you need to first include the Endless Engine JS. The easiest way to add the Endless Engine to your own code is by adding the script tag:
```html
<script src="https://cdn.jsdelivr.net/gh/carteredge/endless-engine@main/endless-engine.js"></script>
```

(If you want to create an Endless Engine randomizer that runs entirely offline, download the [Endless Engine JavaScript](https://raw.githubusercontent.com/carteredge/endless-engine/main/endless-engine.js) to your project folder and add `<script src="endless-engine.js"></script>` to your HTML file.)

Once this is accomplished, you can call the `Randomizer` class from your code:

```javascript
    var myRandomizer = new Randomizer(myRandomizerData, myRandomizerFields);
```

The Randomizer accepts (but does not require at creation) the initial `data` and `fields`. The `data` should be provided as a Javascript object (described [below](#data), and the `fields` should be an array of strings, each of which is the name of a field you want randomized and added to the HTML document.




If you do not add `data` and `fields` at initialization, you can always set them at a later point (or change them), for example:

```javascript
    myRandomizer.data = myRandomizerData;
```

... or ...

```javascript
    myRandomizer.fields = ["myFirstField", "mySecondField"];
```

You can also provide the Randomizer `fields` when you call the `randomize` function (described in the next session). Additionally, if you don't provide `fields` for the Randomizer, it will default to randomizing each top-level key of your `data` object.


<a name="randomizer"><h3>Calling the Randomizer</h3></a>



Once you have provided your `data` and `fields` to the Randomizer, you can call the `randomize` function. The function accepts the fields you want to randomize as the first argument. Additionally, if you provide the `id` of an element in the second argument, it will replace the children of that element with the elements generated from the results of the randomization.




For instance, if you call:

```javascript
    myRandomizer.randomize(myRandomizerFields, "outputTargetID");
```

The output HTML elements are by default of the form:

```html
<li class="row">
    <strong>myFieldName</strong>
    <div>Randomizer result for myFieldName</div>
</li>
```

**NOTE:** No element is generated for any field that randomizes to an empty value, e.g. `""`.

If you provided `fields` to the Randomizer during initialization or at another point, you can pass any value with a truthiness of `false` to the Randomizer to use the existing fields, such as:

```javascript
    myRandomizer.randomize(0, "outputTargetID");
```

Of course, if you don't need to pass the `id` of the target element, you can instead simply call:

```javascript
    myRandomizer.randomize();
```

The returned value from the randomizer takes the form of an object with each field containing a `text` and a `value` attribute. Often, the `value` and `text` are the same, but not always. For instance, in the case of template strings, the `value` will be the initial template and the `text` will be the result after the templated fields have also been randomized. (For more on randomization templates, see [the section on Randomizer data](#data).

The returned object could look something like this:

```javascript
{
    myField: {
        text: "Some randomized value",
        value: "Some randomized value"
    },
    myTemplateField: {
        text: "A template that reference something else.",
        value: "A template that references {myOtherField}"
    },
    myOtherField: {
        text: "something else",
        value: "something else"
    },
}
```

## <a name="data">Creating Your Own Endless Engine Data</a>

### <a name="basic-data">Basic Data</a>

The randomizer uses a basic JavaScript object structure. For example, if you wanted to generate a random name for a fantasy RPG character, you could use:
```javascript
const myData = {
    name: ["Adelbert", "Beatrice", "Celestine", "Duncan"]
}

var results = new Randomizer(myData, ["name"]).randomize();</pre>
```

If an array of values is provided for a field, a random element of that array will be returned (and evaluated recursively in one of the many ways described below).

### <a name="templates">Template Strings</a>

Admittedly, this isn't very interesting, either as a randomization engine or as a name. Suppose, then, you wanted to randomize both the first name and the last name separately, and combine the results. In that case, you can have the `name` field return a template that references other fields:

```javascript
const myData = {
    name: "{firstName} {lastName}",
    firstName: ["Adelbert", "Beatrice", "Celestine", "Duncan"],
    lastName: ["Beetleglen", "Candleroot", "Duskdale", "Foxhollow"],
}
```

After evaluating the `name` field, the randomizer finds template calls for `firstName` and `lastName`, so it then randomizes those and inserts them into the `name` template.

### <a name="conditional">Conditional Randomization</a>

#### <a name="by-fields">Randomization by Other Result</a>

Suppose you had a random character profession, as provided below:

```javascript
const myData = {
    profession: ["hunter", "knight", "mage", "priest"],
}
```

Obviously, you would want to equip your characters appropriately for their profession. A hunter would hardly be able to sneak up on prey in plate armor, and a knight would probably be a poor choice to give a wizard's staff. Here, then, you would want to use conditional probabilities. Instead of returning a string as a result for our `"equipment"` field, you would instead return an object with the single key `"by__profession"`, which itself contains another object with keys for each of the possible professions. For example:

```javascript
const myData = {
    profession: ["hunter", "knight", "mage", "priest"],
    weapon: {
        by__profession: {
            hunter: ["bow", "crossbow", "dagger"],
            knight: ["sword", "flail", "axe"],
            mage: ["staff", "wand"],
            priest: ["staff", "wand"],
        }
    }
}
```

What's more, since the `mage` and `priest` both have the same options in this example, you could simplify them with a `default` field in place of both:

```javascript
const myData = {
    profession: ["hunter", "knight", "mage", "priest"],
    weapon: {
        by__profession: {
            hunter: ["bow", "crossbow", "dagger"],
            knight: ["sword", "flail", "axe"],
            default: ["staff", "wand"],
        }
    }
}
```

#### <a name="by-range">Randomization by Numeric Range</a>

Suppose next you wanted to add another profession, the thief, who can wield the same weapons as the hunter. Since you cannot have the key `default` twice, there is yet another way to handle grouping the field names. If you put two underscores between the names of fields, you can list as many as you want:

```javascript
const myData = {
    profession: ["hunter", "knight", "mage", "priest", "thief"],
    weapon: {
        by__profession: {
            hunter__thief: ["bow", "crossbow", "dagger"],
            knight: ["sword", "flail", "axe"],
            mage__priest: ["staff", "wand"],
        }
    }
}
```

You can also condition your response based on a numerical range with the object key that looks like `by__myField__range`. The number range, then, uses an object key such as `_1__3` to denote the range from 1 through 3. (The leading underscore is only there because JavaScript doesn't like starting any non-numerical key with a number and could be any single, non-numerical character, such as `r1__3`. If you would rather it start with a numerical character, you can put the key in quotes to make sure JavaScript knows it's a string, e.g. `"1__3"`.

Suppose, then, you wanted to scale the equipment based on the character's level, which is an [integer range](#linear) from 1 to 10. If, then, you wanted characters to have basic equipment from levels 1 through 5 and `magic` equipment from levels 6 through 10, then you would add a `by__level__range`, as follows:

```javascript
const myData = {
    profession: ["hunter", "knight", "mage", "priest", "thief"],
    weapon: {
        by__profession: {
            hunter__thief: {
                by__level__range: {
                    _1__5: ["bow", "crossbow", "dagger"],
                    _6__10: [
                        "bow of {magic}",
                        "crossbow of {magic}",
                        "dagger of {magic}"
                    ]
                }
            },
            knight: {
                by__level__range: {
                    _1__5: ["sword", "flail", "axe"],
                    _6__10: [
                        "sword of {magic}",
                        "flail of {magic}",
                        "axe of {magic}"
                    ]
                }
            },
            mage__priest: {
                by__level__range: {
                    _1__5: ["staff", "wand"],
                    _6__10: [
                        "staff of {magic}",
                        "wand of {magic}"
                    ]
                }
            }
        }
    },
    magic: ["the Storm-wood", "the Silver-moon", "Whisp-fire"]
}
```

In this example of the `weapon` data, we demonstrate several capabilities of the Endless Engine combined: Conditional randomization based on string value and numeric value as well as nested randomization templates. The many randomization methods of the Endless Engine are made specifically that they can be applied in any combination so that rich results with texture and depth can be created from your data.

### <a name="weighted">Weighted Randomization</a>

Suppose, next, you decide that magic is difficult to master, and so mages and priests are less common than hunters and knights. This can easily be accomplished with weighted probability values by splitting each result object into a `value` which contains the desired return value and the probability of that value, given as `p`:

```javascript
const myData = {
    profession: [
        {
            value: "hunter",
            p: 3
        },
        {
            value: "knight",
            p: 2
        },
        {
            value: "mage",
            p: 1
         },
         {
             value: "priest",
             p: 1
          },
          {
              value: "thief"
              p: 3
          }
    ],
}
```

Here, the hunter is three times as likely to be returned as the mage. The knight is two times as likely as the mage. Moreover, since the probabilities add to 10, the mage has a 30% chance of being returned here. The numbers can sum to anything you want, though — you can make them add to 100 so that they read as percentages, make them small enough that they all sum to 1, or just use whatever numbers you want so they sum to an arbitrary value of 42. The Endless Engine will scale the numbers so that the results are the same so long as the proportions of each number of the total are the same.

### <a name="int">Integer Randomization: Linear, Normal, and Exponential</a>

Above, we gave an example of conditioning a character's equipment based on the character's level. How, then, would you randomize the level? There are three ways you can randomize an integer with the Endless Engine:

#### <a name="linear">Linear Distribution</a>

Linear distribution gives an even chance of any number in from the provided `min` through the `max` provided in that order in an array with the key `range`, for instance:

```javascript
level: {
    range: [1, 10]
}
```

#### <a name="normal">Normal Distribution</a>

The normal distribution biases the result by making values closer to the middle of the range more likely than values at the extremes, producing a bell curve. For instance, if you used:

```javascript
level: {
    normal_range: [1, 10]
}
```

...you would see values of `5` and `6` much more often than values of `1` or `10`. Although this seems an odd choice for character level, it could be useful for deciding basic character statistics (like Strength, Dexterity, etc. in D&D and related games) that tend toward an average but could, with less likelihood, fall above or below that value.

> **Behind the Scenes:** The Endless Engine uses the [Box-Muller transform](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform) to approximate a normal distribution from JavaScript's linear `Math.random()` and only returns values in the given range (inclusive of the `max` and `min`). It gives a mean at the midpoint between the `max` and `min` values and a standard deviation of the difference between the `max` and `min` divided by 6, meaning that approximately 68% of the results will fall in the middle third of the range while only about 2% of the results will fall in each of the top 1/6th or the bottom 1/6th.

#### <a name="exp">Exponential Distribution</a>

The exponential distribution will give a ditribution where the probability (and thus the frequency of results) is one of exponential growth or decay. In fact, the exponential distribution is the only one where the order the numbers appear in the array matters, for the first number given will always be the more likely end of the result range. For instance, if you put: 

```javascript
level: {
    exp_range: [1, 10, 4]
}
```

There will be a much higher probability of `level` returning 1 than 10, wherease if you put:

```javascript
level: {
    exp_range: [10, 1, 4]
}
```

There will instead be a much higher probability of returning a 10 than a 1.

The third number provided here is a weighting variable, where higher values will create a more drastic exponential distribution with much more common results of the first number and rarer results of the second, while a lower weight will make the exponential distribution more even.

> **Behind the Scenes:** Given the input form `exp_range: [A, B, k]`, the Endless Engine uses a slight variation on the equation:  
> `(B - A) / ((1 - 2 ^ -k) (2 ^ (k - 1))) * (2 ^ (k * random - 1) - 0.5 + A`

### <a name="format">The `format` Property</a>

The format property is provided as a tool for expanded formatting options. Currently, the only formatting option the Endless Engine uses is allowing multiple elements to be returned for a given Randomizer field. For instance, if you wanted to not only return the name of a character, but also a short summary below it, you could use:

```javascript
const myData = {
    name: {
        format: ["{firstName} {lastName}", "{summary}"]
    },
    firstName: ["Adelbert", "Beatrice", "Celestine", "Duncan"],
    lastName: ["Beetleglen", "Candleroot", "Duskdale", "Foxhollow"],
    summary: [
        "Captain of the Watch",
        "Champion of the Downtrodden",
        "Keeper of Secrets",
        "Wanted for Many Crimes",
    ]
}
```

---

![Robot logo](https://carteredge.dev/media/io-32x32.png)

Made by [Carter Edge](https://carteredge.dev)

<small>Robot logo &copy; 2021 Carter Edge. All other content is under the
[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) unless otherwise noted.</small>
