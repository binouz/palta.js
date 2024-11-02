import { $state } from "palta";

// @Palta.component
export default function Search({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const [search, setSearch] = $state("");

  const onSubmit = () => {
    onSearch(search);
  };

  return (
    <div className="flex gap-2 justify-center p-2 h-14">
      <input
        type="text"
        className="w-full h-full bg-transparent text-gray-800 text-xl border p-2 rounded flex-grow"
        value={search}
        onInput={(e) => setSearch(e.target.value)}
      />
      <button
        className="bg-slate-700 text-white p-2 rounded"
        onClick={onSubmit}
      >
        Search
      </button>
    </div>
  );
}
