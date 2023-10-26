import React from 'react';
import Result from './Result';

const he = require('he');

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      selectedCat: 'option1',
      difficulty: 'option',
      questions: [],
      progressValue: 1,
      currentQuestionIndex: 0,
      userAnswers: [],
      mcqs: [],
      formSubmitted: false,
      correctAnswers: [],
      quizscore: 0,
      start: false,
    };
  }

  componentDidMount() {
    this.handleCategory();

    if (localStorage.quizState) {
      this.setState(JSON.parse(localStorage.quizState));
    }
    this.eventId = window.addEventListener(
      'beforeunload',
      this.handleUpdateLocalStorage
    );
  }

  clearResults = () => {
    this.handleCategory();
    localStorage.removeItem('quizState');
    this.setState({
      category: [],
      selectedCat: 'option1',
      difficulty: 'option',
      questions: [],
      progressValue: 1,
      currentQuestionIndex: 0,
      userAnswers: [],
      mcqs: [],
      formSubmitted: false,
      correctAnswers: [],
      quizscore: 0,
      userProgress: { score: 0, answeredQuestions: [] },
      start: false,
    });
  };

  // clearing the eventId
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUpdateLocalStorage);
  }

  handleUpdateLocalStorage = () => {
    console.log('Updating localStorage');
    localStorage.setItem('quizState', JSON.stringify(this.state));
  };

  handleCategory = () => {
    let categoryUrl = 'https://opentdb.com/api_category.php';
    fetch(categoryUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ category: data.trivia_categories });
      })
      .catch((error) => {
        console.log('Error fetching', error);
      });
  };

  handleDifficulty = (event) => {
    this.setState({ difficulty: event.target.value }, () => {
      this.handleFetch();
    });
  };

  handleSelectChange = (e) => {
    this.setState({ selectedCat: e.target.value });
  };

  ShuffleMcqs = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  handleFetch = () => {
    const { selectedCat, difficulty } = this.state;

    if (!selectedCat || !difficulty) {
      console.log('Category and difficulty must be selected');
    }

    let url = `https://opentdb.com/api.php?amount=10&category=${selectedCat}&difficulty=${difficulty}`;

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const decodedQuestions = data.results;
        const mcqs = decodedQuestions.map((q) => {
          const decodedQuestion = he.decode(q.question);
          const answers = [
            ...q.incorrect_answers.map((answer) => he.decode(answer)),
            he.decode(q.correct_answer),
          ];
          this.ShuffleMcqs(answers);
          return {
            question: decodedQuestion,
            answers: answers,
          };
        });
        const correctAnswers = decodedQuestions.map((q) =>
          he.decode(q.correct_answer)
        );
        this.setState({ questions: decodedQuestions, mcqs, correctAnswers });
      })
      .catch((error) => {
        console.log('Error fetching', error);
      });
  };

  handleAnswerSelected = (qIndex, selectedAnswer) => {
    if (this.state.userProgress && this.state.userProgress.answeredQuestions) {
      if (!this.state.userProgress.answeredQuestions.includes(qIndex)) {
        this.setState((prevState) => ({
          userProgress: {
            ...prevState.userProgress,
            answeredQuestions: [
              ...prevState.userProgress.answeredQuestions,
              qIndex,
            ],
          },
        }));
      }
    }
    const userAnswers = [...this.state.userAnswers];
    if (userAnswers[qIndex] === selectedAnswer) {
      userAnswers[qIndex] = null; 
    } else {
      userAnswers[qIndex] = selectedAnswer; 
    }
    console.log(userAnswers);
    this.setState({ userAnswers });
  };

  handleNextClick = (e) => {
    const { userAnswers, currentQuestionIndex, questions } = this.state;
    if (e) {
      e.preventDefault();
    }
    if (userAnswers[currentQuestionIndex]) {
      if (currentQuestionIndex < questions.length - 1) {
        this.setState((prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          progressValue: prevState.progressValue + 1,
        }));
      } else {
        alert('You have completed all questions.');
      }
    } else {
      alert('Please answer the question');
    }
  };
  handlePrevClick = () => {
    const { currentQuestionIndex } = this.state;

    if (currentQuestionIndex > 0) {
      this.setState((prevState) => ({
        currentQuestionIndex: prevState.currentQuestionIndex - 1,
        progressValue: prevState.progressValue - 1,
      }));
    }
  };

  handleState = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  handleSubmit = () => {
    const { userAnswers, questions } = this.state;
    if (questions.length === userAnswers.length) {
      let score = 0;
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].correct_answer === userAnswers[i]) {
          score++;
        }
      }
      this.setState({ quizscore: score });
      this.setState({
        userProgress: { ...this.state.userProgress, score: score },
      });
      console.log(`Your score: ${score}`);
    } else {
      console.log('Please answer all question');
    }
    this.setState({ formSubmitted: true });
  };

  render() {
    const NumberOfQuestions = 10;
    const { questions, currentQuestionIndex, userAnswers, mcqs } = this.state;
    const currentQuestionData = questions[currentQuestionIndex];
    return (
      <>
        {!this.state.formSubmitted ? (
          <div>
            {!this.state.start && (
              <div className="text-center flex justify-center">
                <h2 className="flex-30">Select Category:</h2>
                <select
                  className="flex-30"
                  value={this.state.selectedCat}
                  onChange={this.handleSelectChange}
                >
                  <option value="option1">Select Category</option>
                  {this.state.category &&
                    this.state.category.map((cat, i) => {
                      return (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
            {!this.state.start && (
              <div className="text-center flex justify-center">
                <h2 className="flex-30">Select a difficulty level: </h2>
                <select
                  className="flex-30"
                  value={this.state.difficulty}
                  onChange={this.handleDifficulty}
                >
                  <option value="option">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            )}
            {this.state.start ? (
              <div>
                <div className="m-left-20">
                
                  <div>
                    <form>
                      <h5 as="label" htmlFor="i">
                        Question {this.state.progressValue}/10
                      </h5>
                      <progress value={this.state.progressValue + 1} max={10}>
                        Questions{this.state.progressValue + 1}/10
                      </progress>

                      {currentQuestionData ? (
                        <div>
                          <h2>{he.decode(currentQuestionData.question)}</h2>
                          <div>
                            {mcqs[currentQuestionIndex].answers.map(
                              (answer, index) => (
                                <div
                                  key={index}
                                  className={`options ${
                                    userAnswers[currentQuestionIndex] === answer
                                      ? 'selected-answer'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    this.handleAnswerSelected(
                                      currentQuestionIndex,
                                      answer
                                    );
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    value={answer}
                                    name={answer}
                                  />
                                  <div className="flex">
                                    <div>
                                      {userAnswers[currentQuestionIndex] ===
                                        answer && (
                                        <img
                                          className="img"
                                          src="/images/r.svg"
                                          alt="correct"
                                        />
                                      )}
                                    </div>
                                    <label>{answer}</label>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ) : null}
                      <div className="flex btn-box justify-between">
                        {userAnswers.length < NumberOfQuestions ? (
                          <div>
                            <button
                              className="fs-18 m-top-20   btn-2"
                              type="button"
                              onClick={this.handleNextClick}
                            >
                              Next Question
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              className="fs-18 m-top-20  btn-2 btn-3"
                              type="button"
                              onClick={this.handleSubmit}
                            >
                              Submit Quiz
                            </button>
                          </div>
                        )}

                        <div>
                          <button
                            className="fs-18 m-top-20 btn-2"
                            type="button"
                            onClick={this.handlePrevClick}
                          >
                            Previous Question
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center m-top-20">
                <button
                  className="fs-18 m-top-50 padding no-border btn-1"
                  onClick={() => {
                    if (
                      this.state.selectedCat !== 'option1' &&
                      this.state.difficulty !== 'option'
                    ) {
                      this.handleState('start', true);
                    } else {
                      alert('Please select both category and difficulty.');
                    }
                  }}
                >
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        ) : (
          <Result
            userAnswers={this.state.userAnswers}
            correctAnswers={this.state.correctAnswers}
            questions={this.state.questions}
            quizscore={this.state.quizscore}
            clearResults={this.clearResults}
          />
        )}
      </>
    );
  }
}

export default Quiz;
