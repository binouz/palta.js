/**
 * Copyright 2024 Aubin REBILLAT
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
