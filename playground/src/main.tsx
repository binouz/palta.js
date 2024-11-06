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

import Palta, { $state } from "palta";

import Header from "./components/Header";
import Search from "./components/Search";
import Posts from "./components/Posts";

import "./index.css";

// @Palta.component
const App = () => {
  const [search, setSearch] = $state("");

  return (
    <div className="w-screen h-screen overflow-auto flex justify-center">
      <div className="w-full max-w-5xl">
        <Header />
        <div className="w-full p-2 grow">
          <Search onSearch={setSearch} />
          <Posts search={search}/>
        </div>
      </div>
    </div>
  );
};

Palta.render("#app", App);
