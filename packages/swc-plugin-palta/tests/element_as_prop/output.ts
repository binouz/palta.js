import Palta from "palta";

const SubComponent = (): Palta.ComponentDefinition<{
  element: Palta.Node;
}> => {
  const __$element$0 = Palta.createElement("div", [""]);
  let __$props: any = {};
  const __$update = ({ element }: { element: Palta.Node }) => {
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
    initialize: ({ element }: { element: Palta.Node }) => {
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

const Component = (): Palta.ComponentDefinition<{
  name: string;
}> => {
  const __$element$1 = Palta.createComponent(SubComponent, []);
  const __$element$0 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  let __$props: any = {};
  const __$update = ({ name }: { name: string }) => {
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
    initialize: ({ name }: { name: string }) => {
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
