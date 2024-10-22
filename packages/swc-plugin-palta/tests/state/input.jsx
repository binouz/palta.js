import { $state } from "palta";

// @Palta.component
const Component = () => {
  const [name, setName] = $state("World");

  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
}

export default Component;