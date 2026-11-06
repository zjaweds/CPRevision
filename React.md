# React

These revision notes cover the React concepts taught in Rohit Negi's Coder Army videos. Work through the ideas in order and build small components as you go.

## Components and JSX

React UIs are composed from components. A component is typically a JavaScript function that returns JSX, a syntax extension for describing UI:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

Component names start with a capital letter. JSX expressions go inside braces, and a component can be composed from other components to keep each part focused.

## Props and State

Props are inputs passed from a parent component to a child. They are read-only from the child's perspective. State is data a component owns that can change over time and cause the UI to render again.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
}
```

When the next state depends on the previous state, use the functional updater form. Do not mutate state objects or arrays in place; create and set a new value instead.

## Events, Lists, and Forms

Pass event handlers as functions, for example `onClick={handleClick}`. Avoid calling the handler while rendering (`onClick={handleClick()}`) unless the result is intentionally the handler.

Use `map` to render a collection and give each sibling a stable `key`:

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}
```

Controlled form inputs receive their current value from React state and update that state in an event handler. This keeps the displayed value and application state in sync.

## Effects and Data Flow

`useEffect` synchronizes a component with an external system, such as a browser API or network connection. Its dependency list describes the reactive values the effect uses. Return a cleanup function when subscriptions, timers, or other resources need to be released.

```jsx
import { useEffect, useState } from "react";

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return <p>Width: {width}px</p>;
}
```

Keep state close to the components that need it. If sibling components need the same state, move it to their nearest common parent and pass values and callbacks down as props (lifting state up).

## Reusable Logic and Shared State

Custom hooks are functions whose names start with `use`; they can reuse stateful logic between components. They may call other hooks, but hooks must be called at the top level of a component or custom hook, not conditionally or inside loops.

Context lets a component make a value available to descendants without passing it through every intermediate component. Use it for genuinely shared values; ordinary props are often simpler for local data flow.

## Rendering and Component Design

A state or prop change can cause React to render a component again. Keep rendering pure: given the same props and state, return the same UI and avoid side effects during render.

Break the interface into components with clear responsibilities. Use composition to share layout and behavior. Reach for memoization tools only after identifying work that is actually expensive or causing unnecessary renders.

## Practice Checklist

- Split a page into components and pass data with props.
- Build a counter and a controlled text input with `useState`.
- Render a list with stable keys.
- Lift state up to coordinate two sibling components.
- Add and clean up an event listener in an effect.
- Extract reusable stateful behavior into a custom hook.

## Playlist

Study along with [Rohit Negi's React videos on Coder Army](https://www.youtube.com/@CoderArmy/search?query=React). See the [Coder Army playlists](https://www.youtube.com/@CoderArmy/playlists) for the full, current collection.
