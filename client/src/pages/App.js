import { useEffect, useState } from "react";
import PokemonPage from "../components/pokemonComponent";
import Pagination from "../components/pagination";
import TypeBox from "../components/typeBoxes";
import { useNavigate } from "react-router-dom";
import { apiGetAllPokemon } from "../api/pokeAPI";
import withBasicAuth from "../components/withBasicAuth";
import { apiLogout } from "../api/pokeAPI";
import "../styles/app.css";

function App() {

  const [pokemon, setPokemon] = useState([]);
  const [filters, setFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(10);
  
  const navigate = useNavigate();

  const getPokemon = async () => {
    
    apiGetAllPokemon()
      .then(res => res.data)
      .then(data => {
        console.log(data);
        data = data.filter(poke => filters.every((filter) => poke.type.includes(filter)))
        return data;
      })
      .then(res => {
        setPokemon(res)
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getPokemon();
   }, [filters]);

  var lastRecord = currentPage * pokemonPerPage;
  var firstRecord = lastRecord - pokemonPerPage;
  var currentPokemon = pokemon.slice(firstRecord, lastRecord);
  var numOfPages = Math.ceil(pokemon.length / pokemonPerPage);

  return (
    <div className="app-container">
      <div className="button-container">
        <button
          className="logout-button"
          onClick={async () => {
            await apiLogout();
            navigate("/login");
          }}
        >
          Logout
        </button>
        <button
          className="admin-button"
          onClick={() => navigate("/adminlogin")}
        >
          Admin Panel
        </button>
      </div>
      <TypeBox currentFilters={filters} setFilters={setFilter} />
      <div className="page-container">
        <PokemonPage currentPokemon={currentPokemon} currentPage={currentPage} />
        <Pagination
          numPages={numOfPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default withBasicAuth(App);