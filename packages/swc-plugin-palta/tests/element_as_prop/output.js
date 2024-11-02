import Palta from "palta";

const SubComponent = () => {
  const __$element$0 = Palta.createElement("div", [""]);
  let __$props = {};
  const __$update = ({ element }) => {
    __$props = {
      element,
    };
    __$element$0.updateChild(0, () => {
      return element;
    });
  };
  let __$root = __$element$0;

  return {
    childrenElement: null,
    initialize: ({ element }) => {
      __$props = {
        element,
      };
      __$element$0.updateChild(0, () => {
        return element;
      });
      __$element$0.initialize({});
    },
    update: __$update,
    getRoot: () => __$root,
  };
};

const Component = () => {
  const __$element$1 = Palta.createComponent(SubComponent, []);
  const __$element$0 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  let __$props = {};
  const __$update = ({ name }) => {
    __$props = {
      name,
    };
    __$element$0.updateChild(1, () => {
      return name;
    });
    __$element$1.updateProps({
      element: __$element$0,
    });
  };
  let __$root = __$element$1;

  return {
    childrenElement: null,
    initialize: ({ name }) => {
      __$props = {
        name,
      };
      __$element$0.updateChild(1, () => {
        return name;
      });
      __$element$0.initialize({});
      __$element$1.initialize({
        element: __$element$0,
      });
    },
    update: __$update,
    getRoot: () => __$root,
  };
};

export default Component;
