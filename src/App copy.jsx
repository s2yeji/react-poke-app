import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import PokeCard from './components/PokeCard';
import { useDebounce } from './hooks/useDebounce';

function App() {
  // 컴포넌트에서 가져온 데이터를 기억하기 위해서 state를 사용한다.
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // 1. api를 불러온다.
    // 2. response를 가져온다.
    // 3. response를 이용해서 state를 update한다.
    // 4. state가 update되면 component가 리렌더링된다.
    // 5. 변화된 state를 ui에서 보여준다.
    fetchPokeData(true);
  }, []);
  // [] 종속성 배열에 pokemons 같은 게 들어있으면 pokemons가 변할 때마다 useEffect가 호출된다.
  // [] 종속성 배열이 빈값이면 컴포넌트가 마운트된 후 한 번만 호출해준다.

  useEffect(() => {
    handleSearchInput(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchPokeData = async (isFirstFetch) => {
    try {
      const offsetValue = isFirstFetch ? 0 : offset + limit;
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url);
      // console.log(response.data.results);
      setPokemons([...pokemons, ...response.data.results]);
      setOffset(offsetValue);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchInput = async (searchTerm) => {
    if (searchTerm.length > 0) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
        );
        const pokemonData = {
          url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: searchTerm,
        };
        setPokemons([pokemonData]);
      } catch (error) {
        setPokemons([]);
        console.error(error);
      }
    } else {
      fetchPokeData(true);
    }
  };

  return (
    <article className="pt-6">
      <header className="flex flex-col gap-2 w-full px-4 z-50">
        <div className="relative z-50">
          <form className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs w-[20.5rem] h6 px-2 py-1 rounded-lg text-gray-300 text-center bg-[hsl(214,13%,47%)]"
            />
            <button
              type="submit"
              className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700  "
            >
              검색
            </button>
          </form>
        </div>
      </header>
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {pokemons.length > 0 ? (
            pokemons.map(({ url, name }, index) => (
              <PokeCard key={url} url={url} name={name} />
            ))
          ) : (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
      <div className="text-center">
        <button
          onClick={() => fetchPokeData(false)}
          className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
        >
          더보기
        </button>
      </div>
    </article>
  );
}

export default App;
