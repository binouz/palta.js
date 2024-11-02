import Palta from "palta";

// @Palta.component
const SubComponent = ({ element }: { element: Palta.Node }) => {
  return <div>{element}</div>;
};

// @Palta.component
const Component = ({ name }: { name: string }) => {
  return <SubComponent element={<h1>Hello, {name}!</h1>} />;
};

export default Component;
