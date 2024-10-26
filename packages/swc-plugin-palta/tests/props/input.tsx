// @Palta.component
const Component = ({ name }: { name: string }) => {
  return (
    <div>
      <h1 className="main">Hello, {name}!</h1>
    </div>
  );
}

export default Component;