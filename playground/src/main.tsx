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
