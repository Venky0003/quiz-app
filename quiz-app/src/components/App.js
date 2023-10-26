import React from 'react';
import Quiz from './Quiz';
import Takequiz from './TakeQuiz';
// import Header from './Header';
// import Footer from './Footer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: false,
      takeQuiz: false,
    };
  }

  handleStart = () => {
    this.setState({ start: true });
  };

  handleTakeQuiz = () => {
    this.setState({ takeQuiz: true });
  };

  render() {
    return (
      <>
        {/* <div className="main-container"> */}
        <div className="container">
          {!this.state.takeQuiz ? (
            <Takequiz handleTakeQuiz={this.handleTakeQuiz} />
          ) : (
            <Quiz />
          )}
        </div>
        {/* </div> */}
      </>
    );
  }
}

export default App;
