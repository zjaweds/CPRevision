# React

This guide is a self-contained introduction to building interfaces with React. It focuses on the component model and the built-in APIs commonly used in client-rendered applications. Examples use modern function components and JSX.

## 1. The React Mental Model

React describes a user interface as a function of data. A component receives inputs (props), reads its own state, and returns a description of what should appear. When props or state change, React renders again and updates the DOM where needed.

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

Rendering should be pure: for the same props and state, a component should return the same UI and should not change external state. Handle user actions in event handlers, and synchronize with external systems in effects.

## 2. JSX and Components

JSX is syntax for describing UI in JavaScript. It is transformed into JavaScript calls that create React elements; it is not an HTML string.

```jsx
const heading = <h1 className="page-title">Study notes</h1>;
```

In JSX, use `className` instead of `class`, camelCase DOM property names (such as `onClick`), and braces to insert JavaScript expressions. A component must return one enclosing element; use a fragment (`<>...</>`) when no extra DOM wrapper is needed.

Component names begin with a capital letter, and components are composed like JSX tags:

```jsx
function PageTitle({ children }) {
  return <h1 className="page-title">{children}</h1>;
}

function Page() {
  return (
    <main>
      <PageTitle>Data Structures</PageTitle>
      <p>Choose a topic to begin.</p>
    </main>
  );
}
```

Keep each component focused on a clear piece of UI or behavior. Components can be declared in separate modules and imported where needed. Avoid defining a component inside another component: doing so creates a new component identity on every render and can reset its state.

## 3. Props and Composition

Props are read-only inputs from a parent. They let a component render different content without duplicating its implementation. Use descriptive prop names and pass values with JSX attributes:

```jsx
function LessonCard({ title, duration, isComplete }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{duration} minutes</p>
      {isComplete && <span>Complete</span>}
    </article>
  );
}

<LessonCard title="Components" duration={18} isComplete={false} />
```

String attributes can use quotes; JavaScript values such as numbers, booleans, objects, and variables go in braces. The special `children` prop contains content nested between a component's opening and closing tags. Composition with `children` often gives flexible layouts without a large number of specialized props.

Do not modify props. If a child needs to request a change, the parent can pass a callback as a prop.

## 4. State and Rendering

State is data that belongs to a component and can change over time. `useState` returns the current state and a setter. Calling the setter schedules a render with the next value:

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

When the next value depends on the previous value, use the functional updater form (`setCount(current => ...)`). React may batch state updates; reading a state variable immediately after calling its setter still gives the value from the current render.

State is a snapshot for a particular render. Do not mutate arrays or objects stored in state. Make a new value and pass it to the setter:

```jsx
const [topics, setTopics] = useState(["Arrays"]);

function addTopic(topic) {
  setTopics((current) => [...current, topic]);
}
```

For an object update, copy the existing properties and replace the changed one:

```jsx
setProfile((current) => ({ ...current, city: "Toronto" }));
```

Keep state minimal. If a value can be calculated from existing props or state during rendering, calculate it instead of storing a duplicate that could become out of sync.

## 5. Conditional UI and Lists

Use ordinary JavaScript expressions to render different UI. A condition can select between elements, and `&&` is convenient when the false case should render nothing:

```jsx
{isLoading ? <p>Loading...</p> : <LessonList lessons={lessons} />}
{error && <p role="alert">{error}</p>}
```

Be careful with `condition && value`: if the left side is `0`, React renders the `0`. Convert it to a boolean or use a conditional expression when needed.

Use `map` to turn data into elements. Give each element a stable `key` so React can match it with the same item after insertions, removals, or reordering:

```jsx
function LessonList({ lessons }) {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.id}>{lesson.title}</li>
      ))}
    </ul>
  );
}
```

Keys must be unique among siblings and should come from stable data identifiers. Avoid array indexes when a list can change order or have items inserted or removed; avoid generating random keys during render.

## 6. Events and Forms

React event handlers are passed as functions. Passing `onClick={save}` registers the function; `onClick={save()}` calls it immediately during rendering.

```jsx
function SaveButton({ onSave }) {
  return <button onClick={() => onSave("draft")}>Save draft</button>;
}
```

A controlled input gets its value from state and updates that state in an event handler. This makes the rendered value and application data consistent:

```jsx
import { useState } from "react";

function SearchBox() {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Search for:", query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="query">Search topics</label>
      <input
        id="query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

Use labels connected to form controls, choose appropriate input types, and display validation messages in a way assistive technology can discover. For a checkbox, use `checked` and `event.target.checked` rather than `value`.

## 7. Sharing State Between Components

If two sibling components need the same changing value, store it in their nearest common parent and pass the value and callbacks down as props. This is called lifting state up:

```jsx
function LessonPage() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <LessonMenu selectedId={selectedId} onSelect={setSelectedId} />
      <LessonDetails lessonId={selectedId} />
    </>
  );
}
```

Choose one owner for each piece of state. Duplicating the same state across components creates synchronization problems. Keep state as close as possible to the components that use it, but high enough in the tree to be shared where necessary.

## 8. Effects and External Systems

An effect synchronizes a component with something outside React, such as a browser event subscription, a timer, or a network connection. Effects are not needed just to calculate a value from props or state, or to respond to a specific button click; perform those tasks during rendering or in the event handler instead.

```jsx
import { useEffect, useState } from "react";

function WindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return <p>Width: {width}px</p>;
}
```

The effect callback runs after React commits the UI. Its dependency array tells React which reactive values the effect reads: no array means it runs after every render; an empty array means it is set up on mount and cleaned up on unmount; a list means it re-synchronizes when a listed value changes. Include every reactive value used by the effect. Do not silence dependency problems to force a desired run schedule; restructure the code so the dependencies reflect what it uses.

If an effect creates a subscription, timer, or connection, return a cleanup function to release it. React runs cleanup before setting up the effect again and when the component unmounts. Development Strict Mode may run an extra setup-and-cleanup cycle to help reveal effects that are not safely repeatable.

For network requests, handle loading, success, and failure states. Also prevent an old response from overwriting newer results when inputs change quickly:

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function loadLessons() {
    setStatus("loading");
    try {
      const response = await fetch(`/api/topics?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setLessons(await response.json());
      setStatus("success");
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
        setStatus("error");
      }
    }
  }

  loadLessons();
  return () => controller.abort();
}, [query]);
```

In a real component, initialize `status`, `lessons`, and `error` as state, and clear a prior error when starting a new request.

## 9. Hooks and Reusable Logic

Hooks are functions such as `useState`, `useEffect`, and `useContext` that let function components use React features. Follow the Rules of Hooks:

1. Call hooks at the top level of a function component or custom hook—not inside conditions, loops, or nested functions.
2. Call hooks only from React function components or custom hooks.

React relies on hooks being called in the same order on every render.

A custom hook extracts reusable stateful logic. Its name must start with `use`:

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return width;
}
```

Custom hooks share logic, not the state instance itself: each component calling this hook has its own state unless the hook explicitly uses a shared mechanism such as context or an external store.

## 10. Context and Reducers

Context makes a value available to deeply nested descendants without forwarding it through every intermediate component. It can suit app-wide concerns such as the current theme or authenticated user. Keep context focused; changing a context value causes consumers of that context to render again.

```jsx
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <p>Current theme: {theme}</p>;
}
```

For state with several related transitions, `useReducer` keeps the update rules together. A reducer receives the current state and an action and returns the next state; it should be pure:

```jsx
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "reset":
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <button onClick={() => dispatch({ type: "increment" })}>
      Count: {state.count}
    </button>
  );
}
```

Use local state for local behavior, and lift state or use context when there is a real sharing need. Context is not automatically a replacement for every prop.

## 11. Refs and the DOM

A ref holds a value that persists between renders without causing a render when it changes. Use refs for imperative tasks, such as focusing an input or storing a timer ID. Do not use a ref for data that must appear in the UI; use state for that.

```jsx
import { useEffect, useRef } from "react";

function SearchForm() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} aria-label="Search" />;
}
```

React owns the DOM it renders. Prefer expressing UI changes through props and state. Direct DOM manipulation should be limited to cases where an imperative browser API is needed.

## 12. Component Design, Accessibility, and Performance

Design components around clear responsibilities and compose them to build larger interfaces. Prefer explicit props and simple data flow. Keep rendering free of side effects, and do not duplicate values that can be derived.

Accessible HTML provides useful behavior by default. Use semantic elements (`button`, `nav`, `main`, `label`), ensure interactive controls work with a keyboard, give images appropriate alternative text, and provide visible focus styles. Use ARIA attributes only when native HTML semantics are not enough.

React can render a component again when its state, props, or context changes. A rerender is normal and does not necessarily mean the DOM is rebuilt. Start by writing straightforward components; use `memo`, `useMemo`, or `useCallback` only when measurement shows a meaningful performance issue or a stable reference is required for a specific integration.

## 13. Common Mistakes

- Mutating state arrays or objects instead of creating new values.
- Calling a state setter and expecting the current render's state variable to change immediately.
- Using an array index or random value as a key for a changing list.
- Calling an event handler during render instead of passing a function.
- Putting derived data in state and allowing it to get out of sync.
- Using an effect for logic that belongs in rendering or an event handler.
- Omitting effect dependencies or failing to clean up subscriptions.
- Calling hooks conditionally or from ordinary non-React functions.
- Building components inside components, causing component identity to change.
- Treating `useMemo` and `useCallback` as requirements rather than optimizations.

## 14. Practice Project

Build a small topic tracker:

1. Create a list of topic objects with stable IDs, titles, and completion status.
2. Render the topics with a separate `TopicList` and `TopicItem` component.
3. Add a controlled input and form for creating a topic.
4. Toggle completion by creating a new array and a new updated topic object.
5. Add a filter for all, active, and completed topics. Derive the filtered list during rendering.
6. Lift state to a common parent if a summary and list both need the same data.
7. Add an effect only if the app synchronizes with an external system, such as browser storage; clean up subscriptions or timers.
8. Test keyboard operation, labels, empty states, and invalid form input.

### Quick review

- Components render UI from props and state; rendering should remain pure.
- Props are read-only inputs, and state updates schedule a later render.
- Use immutable updates and stable keys for collections.
- Lift shared state to a common owner and pass data or callbacks as props.
- Use effects to synchronize with external systems, with complete dependencies and cleanup.
- Hooks must be called consistently at the top level of React components or custom hooks.
