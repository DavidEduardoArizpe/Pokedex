import React, { useState, useEffect } from 'react';
import './index.css';

const App: React.FC = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null);
  const [selectedName, setSelectedName] = useState<string>('');
  const[filteredPokemons, setFilteredPokemons] = useState<Array<object>>([])
  
  const fetchPokemons = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1017`);
      const data = await response.json();
      setPokemons(data.results);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(selectedName.toLowerCase())
      )
    );
  }, [pokemons, selectedName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedName(e.target.value.toLowerCase());
  };

  const handlePokemonClick = async (pokemon: any) => {
    try {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  };

  const extractPokemonId = (url: string | undefined): string => {
    if (url) {
      const urlParts = url.split('/');
      const id = urlParts[urlParts.length - 2];
      return id;
    }
    return '';
  };

  return (
    <>
      <header>
        <h1>Pokémon Info</h1>
        <input type="text" placeholder="Search" value={selectedName} onChange={handleNameChange} />
      </header>

      <br /><br /><br />

      <main className="pokemon-list">
      {filteredPokemons.map((pokemon: any) => (
  <div key={pokemon.name} onClick={() => handlePokemonClick(pokemon)}>
    <h3>{pokemon.name}</h3>
    <img
      loading="lazy"
      alt={pokemon.name}
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractPokemonId(pokemon.url)}.png`}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.style.display = 'none'; 
      }}
    />
  </div>
))}
 </main>


 {selectedPokemon && (
  <div className="modal">
    <span className="close" onClick={() => setSelectedPokemon(null)}>
      &times;
    </span>
    <h2>{selectedPokemon.name}</h2>
    <img
      loading="lazy"
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractPokemonId(selectedPokemon.url)}.png`}
      alt={selectedPokemon.name}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = './assets/logo.svg'; 
      }}
    />
    <strong>
      {selectedPokemon.types && (
        <p>Types: {selectedPokemon.types.map((type: any) => type.type.name).join(', ')}</p>
      )}
      {selectedPokemon.height && <p>Height: {selectedPokemon.height / 10} m</p>}
      {selectedPokemon.weight && <p>Weight: {selectedPokemon.weight / 10}kg</p>}
    </strong>
  </div>
)}

    </>
  );
};

export default App;
