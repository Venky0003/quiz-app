import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './components/App';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/index.css';
import Takequiz from './components/TakeQuiz';

ReactDom.render(
  <BrowserRouter>
    <Header />
    <div className="container">
      <Route path="/" exact>
        <App />
      </Route>

      <Route path="/takequiz">
        <Takequiz />
      </Route>
      <Route path="/quiz">
        <Quiz />
      </Route>
      <Route path="/result">
        <Result />
      </Route>
    </div>
    <Footer />
  </BrowserRouter>,
  document.getElementById('root')
);
