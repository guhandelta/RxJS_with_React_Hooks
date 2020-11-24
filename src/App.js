import React, { useEffect, useState } from 'react'
import { from, BehaviorSubject } from 'rxjs'
// BehaviorSubject => Requires an initial value and emits the current value to new subscribers
// A BehaviorSubject holds one value. When it is subscribed it emits the value immediately. A Subject doesn't-
//-  hold a value.
import { distinctUntilChanged, filter, debounceTime, mergeMap } from 'rxjs/operators'
import './App.css'

const getPokemonByName = async name =>{
  const { results } = await fetch("https://pokeapi.co/api/v2/ability/?limit=1000").then(res => res.json());
  console.log(results.filter(pokemon => pokemon.name.includes(name)));
  return results.filter(pokemon => pokemon.name.includes(name));
}

// BehaviorSubject will be/act the preset pipeline for the value processing
let searchSubject = new BehaviorSubject("");
let searchResultObservable = searchSubject.pipe(
  filter(val => val.length > 1), //Make sure that the search results don't thrown any names shorter results
  debounceTime(750), // wait for the user to complete the typing
  distinctUntilChanged(), // Preventing a new search, when the user clears the entry and types the same
  // mapping the value to the new observable created from the getPokemonByName() Promise
  mergeMap(val => from(getPokemonByName(val)))
)

// Custom hook
const useObservable = (observable, setter) => {
  useEffect(()=>{
    let subscription = observable.subscribe(res =>
      setter(res)
      );
      
      return () => subscription.unsubscribe();
    }, []);
  }
  
function App(){
  const[ search, setSearch ] = useState('');
  const[ results, setResults ] = useState([]);
  
  useObservable(searchResultObservable, setResults);

  const handleSearchChange = e =>{
    const searchName = e.target.value;
    setSearch(searchName);
    searchSubject.next(searchName);
  }

  return (
    <div className="App">
      &emsp;&emsp;&emsp;<h1>React with RxJS</h1>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <input 
        type="text" 
        placeholder="Search" 
        value={search} 
        onChange={handleSearchChange} 
      /> <br/><br/><br/>
      {results.map(pokemon => (
        <div key={pokemon.name}>{pokemon.name}</div>
      ))}
    </div>
  )
}

export default App;