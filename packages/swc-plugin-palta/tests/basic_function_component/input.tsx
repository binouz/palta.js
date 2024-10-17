import Palta from "palta";

// @Palta.component
function Component({ name }: { name: string }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
}

export default Component;