// @Palta.component
const Component = ({ open }) => {
  return <div>{open ? <span>opened</span> : <span>closed</span>}</div>;
};

export default Component;
