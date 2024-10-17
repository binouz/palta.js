import Palta from "palta";

// @Palta.component
const Component = () => {
  const element$1 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  const element$0 = Palta.createElement("div", [element$1]);
  let root = element$0;

  return {
    elements: [element$0, element$1],
    update: ({ name }) => {
      element$1.updateChild(1, () => {
        return name;
      });
    },
    getRoot: () => root,
  };
};

export default Component;
