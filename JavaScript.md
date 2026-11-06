# JavaScript

This guide is a self-contained introduction to the JavaScript language and its use in browsers. Each example can be run in a browser console or in a recent Node.js release. Read the explanations, then change the examples and predict what will happen before running them.

## 1. Values, Types, and Variables

JavaScript values have types. The primitive types are `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`. Objects are non-primitive values; arrays, functions, dates, and many other structures are objects.

```js
const title = "JavaScript";       // string
const chapters = 8;               // number
const isPublished = true;         // boolean
let currentChapter;                // undefined
const tags = ["web", "language"]; // array (an object)
const guide = { title, chapters }; // object
```

Use `const` when a variable will not be reassigned, and `let` when it will. Both are block-scoped. Avoid `var` in new code: it is function-scoped, can be redeclared, and its hoisting rules can make programs harder to reason about. A `const` binding cannot be reassigned, but the object it points to can still be changed:

```js
const settings = { theme: "dark" };
settings.theme = "light"; // allowed
// settings = {};         // TypeError: cannot reassign a const binding
```

`typeof` is useful, but has a historical quirk: `typeof null` returns `"object"`. Check for `null` with `value === null`. `undefined` commonly means that a value was not provided or assigned. Prefer explicit checks when a missing value has meaning.

### Equality and type conversion

`===` and `!==` compare without converting the operands, so they are the safest default. `==` and `!=` apply coercion and can produce surprising results. JavaScript also converts values in some arithmetic and conditional contexts:

```js
"5" + 1;    // "51": + concatenates when a string is involved
"5" - 1;    // 4: subtraction converts the string to a number
Boolean(""); // false
Boolean("0"); // true: every non-empty string is truthy
```

Falsy values include `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Most other values—including empty arrays and empty objects—are truthy. Use `Number(value)`, `String(value)`, or `Boolean(value)` when an intentional conversion makes the code clearer.

## 2. Operators and Control Flow

Arithmetic operators include `+`, `-`, `*`, `/`, `%` (remainder), and `**` (exponentiation). Comparison operators include `<`, `<=`, `>`, and `>=`. Logical AND (`&&`), OR (`||`), and nullish coalescing (`??`) can select values as well as combine booleans.

`||` uses the fallback when the left side is any falsy value; `??` uses it only when the left side is `null` or `undefined`:

```js
const retries = 0;
const retryCount = retries ?? 3; // 0
const retryLabel = retries || 3; // 3
```

Use `if`/`else` for branching. Use `switch` when comparing one value with several cases, and include `break` (or return from a function) to prevent accidental fall-through.

```js
function describeScore(score) {
  if (score >= 90) return "excellent";
  if (score >= 60) return "pass";
  return "keep practicing";
}
```

Use `for` when the iteration count or index matters, `for...of` to visit iterable values such as array items, and `while` when the loop should continue until a condition changes. Make sure every loop makes progress toward stopping.

```js
const topics = ["values", "functions", "objects"];
for (const topic of topics) {
  console.log(topic);
}
```

## 3. Functions

Functions package reusable behavior. A function can receive parameters and return a value. If it reaches the end without `return`, its result is `undefined`.

```js
function add(a, b) {
  return a + b;
}

const multiply = function (a, b) {
  return a * b;
};

const double = (value) => value * 2;
```

Function declarations are available throughout their containing scope due to hoisting. Function expressions and arrow functions are values assigned to variables. Arrow functions with one expression return that expression implicitly; use braces and `return` for multiple statements.

Parameters can have defaults, and rest parameters collect remaining arguments into an array:

```js
function greet(name = "there") {
  return `Hello, ${name}!`;
}

function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}
```

### Scope and closures

Scope determines where a variable can be accessed. JavaScript uses lexical scope: nested code can access bindings in the surrounding scopes where it was written. `let` and `const` bindings exist within their enclosing block.

A closure is a function together with access to the lexical bindings around it. The inner function can keep using those bindings after the outer function has returned:

```js
function makeCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}

const next = makeCounter();
next(); // 1
next(); // 2
```

Closures are useful for private state and for creating functions that remember configuration. Each call to `makeCounter` creates a separate `count`.

### `this`

For a regular function, `this` is generally determined by how the function is called. In `object.method()`, `this` refers to `object`; extracting the method into a variable loses that call-site receiver unless it is bound. Arrow functions do not create their own `this`; they use the value from the surrounding scope. Use arrow functions for callbacks when that behavior is wanted, and regular methods when the method should receive its object as `this`.

## 4. Arrays and Objects

Arrays are ordered collections indexed from zero. Objects store key/value properties. Both are reference values: assigning an array or object to another variable copies the reference, not the underlying structure.

```js
const original = { nested: { value: 1 } };
const alias = original;
alias.nested.value = 2;
console.log(original.nested.value); // 2
```

### Useful array operations

- `map` transforms every item and returns a new array of results.
- `filter` returns the items that pass a test.
- `find` returns the first matching item, or `undefined`.
- `some` checks whether at least one item passes a test.
- `every` checks whether all items pass a test.
- `reduce` combines items into one accumulated result.
- `forEach` runs a callback for each item and returns `undefined`.

```js
const scores = [8, 12, 15];
const passing = scores.filter((score) => score >= 10);
const doubled = scores.map((score) => score * 2);
const total = scores.reduce((sum, score) => sum + score, 0);
```

These methods do not mutate the source array. Methods such as `push`, `pop`, `splice`, `sort`, and `reverse` do mutate it. `sort` converts values to strings by default; provide a comparator for numbers:

```js
const values = [20, 3, 100];
values.sort((a, b) => a - b); // [3, 20, 100]
```

### Properties, destructuring, and copying

Use dot notation for known property names and bracket notation for dynamic keys:

```js
const book = { title: "Patterns", pages: 120 };
book.title;
book["pages"];

const key = "title";
book[key];
```

Destructuring extracts values into local bindings. Spread syntax copies enumerable properties or iterable items:

```js
const { title, pages = 0 } = book;
const [first, ...remaining] = ["a", "b", "c"];

const updatedBook = { ...book, pages: 140 };
const moreScores = [...scores, 19];
```

Object and array spread make shallow copies. Nested objects remain shared unless copied separately. For many state updates, create a new outer array/object and copy only the nested values that need changing.

Optional chaining (`?.`) safely reads through a possibly nullish value, while `??` supplies a nullish fallback:

```js
const city = user.address?.city ?? "Unknown";
```

## 5. Prototypes and Classes

Objects can inherit properties from another object through a prototype chain. When a property is not found directly on an object, JavaScript searches its prototype, then that prototype's prototype, until it finds the property or reaches `null`.

The `class` syntax offers a familiar way to create objects with shared methods. It is built on JavaScript's prototype system:

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name} barks`;
  }
}

new Dog("Milo").speak(); // "Milo barks"
```

Use a class when multiple instances share behavior and the model benefits from that structure. For simple data transformations, ordinary objects and functions are often easier to understand.

## 6. Errors and Debugging

An exception interrupts normal execution until it is caught. Throw an `Error` when a function cannot complete its job, and catch it at a level that can recover or explain the failure:

```js
function parseCount(text) {
  const count = Number(text);
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("Count must be a non-negative integer");
  }
  return count;
}

try {
  console.log(parseCount("12"));
} catch (error) {
  console.error(error.message);
}
```

Use `console.log`, `console.error`, breakpoints, and stack traces to inspect assumptions. Validate untrusted input at the boundary where it enters the program rather than relying on later operations to fail mysteriously.

## 7. Asynchronous JavaScript

JavaScript commonly handles work that finishes later, such as timers, user events, or network requests. A callback is a function passed to another operation to run later. Promises provide a standard representation of a future result: a promise is pending, then becomes fulfilled with a value or rejected with a reason.

```js
fetch("/api/lessons")
  .then((response) => {
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  })
  .then((lessons) => console.log(lessons))
  .catch((error) => console.error("Could not load lessons:", error));
```

`async` functions always return a promise. Inside one, `await` waits for a promise's result and throws if that promise rejects. Use `try`/`catch` to handle expected failures:

```js
async function loadLessons(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not load lessons:", error);
    throw error;
  }
}
```

Awaiting independent operations one after another is slower than starting them together. Use `Promise.all` when all results are required, or `Promise.allSettled` when each result should be inspected regardless of failure:

```js
const [profile, lessons] = await Promise.all([
  loadLessons("/api/profile"),
  loadLessons("/api/lessons"),
]);
```

Synchronous JavaScript runs on the call stack. The event loop coordinates callbacks and promise reactions when the current stack is clear. Promise callbacks (microtasks) are processed before timer callbacks (tasks) that are ready in the same turn. Long-running synchronous work still blocks browser interactions, so split up expensive work or move suitable computations to a worker.

## 8. Browser APIs and the DOM

The Document Object Model (DOM) is the browser's object representation of a page. Select elements with methods such as `querySelector`, then update their text, attributes, or classes. Listen for events instead of putting JavaScript handlers directly in HTML:

```js
const button = document.querySelector("#add-button");
const output = document.querySelector("#output");
let count = 0;

button.addEventListener("click", () => {
  count += 1;
  output.textContent = `Clicked ${count} times`;
});
```

Use `textContent` for plain text. When reading form values, validate and convert them to the expected type. Avoid inserting untrusted strings with `innerHTML`, because it interprets the string as markup.

`localStorage` stores string values in the browser across sessions. Convert structured data to and from JSON, and handle invalid or unavailable storage where appropriate:

```js
localStorage.setItem("settings", JSON.stringify({ theme: "dark" }));
const settings = JSON.parse(localStorage.getItem("settings") ?? "{}");
```

## 9. Modules

ES modules split code into files with explicit imports and exports. A module's top-level variables are scoped to that module rather than added to the global scope.

```js
// math.js
export function square(value) {
  return value * value;
}

// app.js
import { square } from "./math.js";
console.log(square(4));
```

Use named exports when a module provides several related values. A default export can represent a module's primary value. Keep modules focused and avoid circular imports, where modules depend on each other in a cycle.

## 10. Practice

1. Write a function that converts Celsius to Fahrenheit and rejects non-numeric input.
2. Given an array of products, use `filter` to keep in-stock items and `map` to return their names.
3. Use `reduce` to count how many times each word occurs in an array.
4. Build a closure that creates independent counters with a configurable starting value.
5. Sort an array of numbers in ascending order without changing the original array.
6. Write an `async` function that checks `response.ok`, parses JSON, and reports a useful error.
7. Add a click listener that increments a count displayed in the DOM.

### Quick review

- `const` prevents rebinding; it does not make referenced objects immutable.
- Use strict equality and explicit conversions to avoid accidental coercion.
- Array methods such as `map` and `filter` create arrays; mutation methods change the existing array.
- A closure retains access to its lexical environment.
- Regular-function `this` depends on the call; arrow-function `this` is inherited.
- Handle both rejected promises and unsuccessful HTTP responses.
