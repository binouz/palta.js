import Palta, { $effect, $state } from "palta";

// @Palta.component
const ValueInfo = ({ value }: { value: number }) => {
  $effect(() => {
    console.log("Value has changed");
  }, [value]);

  return (
    <p>
      {value > 0 ? "Positive" : value < 0 ? "Negative" : "Zero"}
    </p>
  )
}

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
      <ValueInfo value={count} />
    </div>
  );
};

Palta.render("#app", App);
