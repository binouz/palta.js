// @Palta.component
const Component = ({ open }: { open: boolean }) => {
  return (
    <div>
      {open ? (
        <span>opened</span>
      ) : (
        <span>closed</span>
      )}
    </div>
  );
}

export default Component;