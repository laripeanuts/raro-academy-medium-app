# 15 Javascript codes you will always need


![js logo](https://miro.medium.com/max/1400/1*OFnK_QNo05YMO-7Db-PQ3Q.png)
artigo do autor [Mercan Arguç](https://medium.com/@mertcanarguc/15-javascript-codes-you-will-always-need-e8569903dd1)

## Shuffle an Array

Shuffling an array is super easy with `sort` and `random` methods.

```js
const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
console.log(shuffleArray([1, 2, 3, 4]));
// Result: [ 1, 4, 3, 2 ]
```

## Check if Date is Valid

Use the following snippet to check if a given date is valid or not.

```js
const isDateValid = (...val) => !Number.isNaN(new Date(...val).valueOf());
isDateValid("December 17, 1995 03:24:00");
// Result: true
```

## Copy to Clipboard

Easily copy any text to clipboard using `navigator.clipboard.writeText.`

```js
const copyToClipboard = (text) => navigator.clipboard.writeText(text);
copyToClipboard("Hello World");
```

## Find the day of the year

Find which is the day by a given date.

```js
const dayOfYear = (date) =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
dayOfYear(new Date());
// Result: 272
```

## Capitalize a String

Javascript doesn’t have an inbuilt capitalize function, so we can use the following code for this purpose.

```js
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
capitalize("follow for more")
// Result: Follow for more
```

## Find the number of days between two days

Find the days between 2 given days using the following snippet.

```js
const dayDif = (date1, date2) => Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000)
dayDif(new Date("2020-10-21"), new Date("2021-10-22"))
// Result: 366
```

## Clear All Cookies

You can easily clear all cookies stored on a web page by accessing the cookie using `document.cookie` and clearing it.

```js
const clearCookies = document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`));
```

## Generate Random Hex

You can generate random hex colors with Math.random and padEnd properties.

```js
const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`;
console.log(randomHex());
// Result: #92b008
```

## Remove Duplicated from Array

You can easily remove duplicates with `Set` in JavaScript. It's a lifesaver.

```js
const removeDuplicates = (arr) => [...new Set(arr)];
console.log(removeDuplicates([1, 2, 3, 3, 4, 4, 5, 5, 6]));
// Result: [ 1, 2, 3, 4, 5, 6 ]
```

## Get Query Params from URL

You can easily retrieve query params from a URL either bypassing `window.location` or the raw URL `goole.com?search=easy&page=3`

```js
const getParameters = (URL) => {
  URL = JSON.parse('{"' + decodeURI(URL.split("?")[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +'"}');
  return JSON.stringify(URL);
};
getParameters(window.location)
// Result: { search : "easy", page : 3 }
```

## Log Time from Date

We can log time, in the format `hour::minutes::seconds` from a given date.

```js
const timeFromDate = date => date.toTimeString().slice(0, 8);
console.log(timeFromDate(new Date(2021, 0, 10, 17, 30, 0))); 
// Result: "17:30:00"
```

## Check if a number is even or odd

```js
const isEven = num => num % 2 === 0;
console.log(isEven(2)); 
// Result: True
```

## Find Average of Numbers

Find the average between multiple numbers using `reduce` method.

```js
const average = (...args) => args.reduce((a, b) => a + b) / args.length;
average(1, 2, 3, 4);
// Result: 2.5
```

## Check if the array is empty

A simple one-liner to check if an array is empty, will return `true` or `false`.

```js
const isNotEmpty = arr => Array.isArray(arr) && arr.length > 0;
isNotEmpty([1, 2, 3]);
// Result: true
```

## Get Selected Text
Get the text the user has selected using inbuilt `getSelection` property.

```js
const getSelectedText = () => window.getSelection().toString();
getSelectedText();
```

## Detect Dark Mode

Check if a user’s device is in dark mode with the following code.

```js
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
console.log(isDarkMode) // Result: True or False
```

Buy me a coffee https://www.buymeacoffee.com/argucmertcan 🧋