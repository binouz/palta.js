import { $effect } from "palta";

// @Palta.component
const Component = ({ name }: { name: string }) => {
  $effect(() => {
    console.log("Name has changed");
  }, [name]);

  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default Component;
