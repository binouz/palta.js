import Palta, { $state } from "palta";

// @Palta.component
const App = () => {
  const [count, setCount] = $state(0);

  return (
    <div>
      <h1>Hello, world!</h1>
      <p>Count: {count}</p>
      <button
        onClick={() => {
          setCount((prev) => ++prev);
        }}
      >
        Increment
      </button>
      <button
        onClick={() => {
          setCount((prev) => --prev);
        }}
      >
        Decrement
      </button>
    </div>
  );
};

Palta.render("#app", App);
