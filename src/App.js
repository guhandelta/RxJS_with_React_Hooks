import React, { useEffect, useState } from 'react'
import { from } from 'rxjs'
import { map, filter, delay, mergeMap } from 'rxjs/operators'

let numbersObservable = from([1,2,3,4,5]);
let squaredNumbers = numbersObservable.pipe(
  filter(val => val > 2),
  // delay(1000) - kindof works, but only shows the last number, this is due to the fact that the delay-
  //- is applied to all the numbers instantly, which is not something that is required
  // This can be accomplished by mergeMapping the value into a new observable, that will be delayed
  mergeMap(val => from([val]).pipe(delay(500*val))),
  map(val => val * val)
);

function App(){

  const[ currentNumber, setCurrentNumber ] = useState(0);
  useEffect(()=>{
    let subscription = squaredNumbers.subscribe(res =>
      setCurrentNumber(res)
    );

    return () => subscription.unsubscribe();
  }, []);
  return (
    <div className="App">
      <h1>React with RxJS</h1>
      <h6>The current number is: {currentNumber}</h6>
    </div>
  )
}

export default App;