import Palta from "palta";

// @Palta.component
const SubComponent = ({ element }) => {
  return <div>{element}</div>;
};

// @Palta.component
const Component = ({ name }) => {
  return <SubComponent element={<h1>Hello, {name}!</h1>} />;
};

export default Component;
