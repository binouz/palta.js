import Palta from "palta";

// @Palta.component
const App = () => {
  let { count } = Palta.state({ count: 0 });

  return (
    <div>
      <h1>Hello, world!</h1>
      <p>Count: {count}</p>
      <button onClick={() => count++}>Increment</button>
    </div>
  );
};

Palta.render("#app", App);
