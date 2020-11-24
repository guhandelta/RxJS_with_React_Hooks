import React, { Component } from 'react'
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



export default class App extends Component {

  // The reason why this cannot be allowed before super() is because this is uninitialized if super()-
  //- is not called. However even if we are not using this we need a super() inside a constructor-
  //- because ES6 class constructors MUST call super if they are subclasses. Thus, you have to call-
  //- super() as long as you have a constructor. (But a subclass does not have to have a constructor).

  // We call super(props) inside the constructor if we have to use this.props,

  constructor(){
    super();
    this.state = { currentNumber: 0 };
  }

  componentDidMount(){
    this.subscription = squaredNumbers.subscribe(res =>
      this.setState({ currentNumber: res })  
    );
  }

  componentWillUnmount(){
    // Cleanup
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <div className="App">
        <h1>React with RxJS</h1>
        <h6>The current number is: {this.state.currentNumber}</h6>
      </div>
    )
  }
}
