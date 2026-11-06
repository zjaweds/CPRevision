# JavaScript

These revision notes follow the JavaScript fundamentals taught in Rohit Negi's Coder Army videos. Read the sections in order, and try each example in the browser console or Node.js.

## Values, Types, and Variables

JavaScript has primitive values such as `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`. Objects, including arrays and functions, are reference values.

Use `const` by default, and use `let` when a binding must be reassigned. Both are block-scoped. `var` is function-scoped and can be redeclared, so it is usually best avoided in new code.

```js
const name = "Riya";
let score = 0;
score += 1;
```

Use `===` and `!==` for comparisons unless coercion is intentional. JavaScript may convert values in operations such as `"5" + 1` (`"51"`) and `"5" - 1` (`4`); understanding these conversions helps avoid surprising results.

## Control Flow and Functions

`if`/`else`, `switch`, and loops (`for`, `while`, `for...of`) control the flow of a program. Functions package reusable behavior:

```js
function multiply(a, b) {
  return a * b;
}

const double = (value) => value * 2;
```

Function declarations, function expressions, and arrow functions differ in how they are created and how `this` behaves. An arrow function uses `this` from its surrounding scope; it does not create its own `this`.

A closure occurs when a function retains access to variables from the scope where it was created, even after that outer function has returned.

```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}

const nextCount = makeCounter();
nextCount(); // 1
nextCount(); // 2
```

## Arrays and Objects

Arrays store ordered values; objects store properties addressed by keys. Both are mutable reference values. `const` prevents rebinding a variable, but does not freeze the object it refers to.

Common array methods include:

- `map` to transform each item into a new array.
- `filter` to keep items that pass a test.
- `find` to return the first matching item.
- `reduce` to combine items into one result.
- `forEach` to perform an operation for each item.

```js
const scores = [8, 12, 15];
const passing = scores.filter((score) => score >= 10);
const doubled = scores.map((score) => score * 2);
```

Spread syntax (`...`) and destructuring make it convenient to copy values and select properties. Remember that spreading an object or array makes a shallow copy: nested objects are still shared references.

## Scope, `this`, and Prototypes

Scope determines where a binding can be used. JavaScript uses lexical scope: a function can access bindings from the scopes surrounding where it was defined. `this` depends on how a regular function is called, while arrow functions inherit it from their surrounding scope.

Objects can delegate property lookup through a prototype chain. JavaScript classes provide syntax for creating objects with shared methods, while the underlying inheritance model is prototype-based.

## Asynchronous JavaScript

Callbacks, promises, and `async`/`await` are ways to handle work that completes later. A promise represents a future result; `await` pauses the current async function until that promise settles.

```js
async function loadUser(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}
```

JavaScript runs synchronous code on the call stack. The event loop coordinates queued callbacks and promise reactions so asynchronous work can continue without blocking the main thread while it is waiting.

## Browser JavaScript and Modules

In the browser, JavaScript can select and update DOM elements, listen for events, and respond to user input. Prefer event listeners and DOM APIs over embedding event handlers in HTML.

ES modules use `export` and `import` to split code into reusable files. A module's top-level bindings are scoped to that module rather than added to the global scope.

## Practice Checklist

- Explain the difference between `let`, `const`, and `var`.
- Predict the result of a comparison or expression involving different types.
- Write a closure and describe which variables it remembers.
- Choose between `map`, `filter`, `find`, and `reduce`.
- Explain how `this` differs in regular and arrow functions.
- Use `async`/`await` and handle a rejected request.

## Playlist

Study along with [Rohit Negi's JavaScript videos on Coder Army](https://www.youtube.com/@CoderArmy/search?query=JavaScript). See the [Coder Army playlists](https://www.youtube.com/@CoderArmy/playlists) for the full, current collection.
