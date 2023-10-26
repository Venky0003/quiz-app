import React from 'react';

function Result(props) {
  const he = require('he');
  return (
    <>
      <div>
        <h2 className='text-center'>Result Of Quiz</h2>
        <div className="flex-1">
          <div className="flex-50 top-border">
            <h2 className="fs-20 text-center padding bottom-border height-60 right-border left-border">
              Questions
            </h2>
            {props.questions.map((q, i) => {
              const decodedQuestion = he.decode(q.question);
              return (
                <h3
                  className="padding text-center bottom-border height-60 right-border left-border"
                  key={i}
                >
                  {decodedQuestion}
                </h3>
              );
            })}
          </div>
          <div className="flex-20 top-border">
            <h2 className=" fs-20 text-center bottom-border padding height-60  right-border">
              Correct Answer
            </h2>
            {props.correctAnswers.map((a, i) => {
              return (
                <p className="padding text-center bottom-border height-60 right-border">
                  {a}
                </p>
              );
            })}
          </div>
          <div className="flex-20 top-border">
            <h2 className="fs-20 text-center padding bottom-border height-60  right-border">
              Your Answer
            </h2>
            {props.userAnswers.map((answer, i) => {
              return (
                <p className="padding text-center bottom-border height-60 right-border">
                  {answer}
                </p>
              );
            })}
          </div>
          <div className="flex-10 top-border">
            <h2 className='fs-20 text-center padding bottom-border height-60 right-border'>Right or Wrong</h2>
            {props.userAnswers.map((userAnswer, i) => {
               return (
              <div className='padding  text-center height-60 bottom-border right-border' key={i}>
                {userAnswer === props.correctAnswers[i] ? (
                  <img src="/images/right.svg" alt="correct" />
                ) : (
                  <img  src="/images/wrong.svg" alt="wrong" />
                )}
              </div>
               );
            })}
          </div>
        </div>
        <div className="flex-1 m-top-0">
          <h2 className="flex-70 height-60 bottom-border right-border left-border text-center padding">
            Total Score
          </h2>
          <p className="flex-30 bottom-border right-border text-center padding fs-22">
            {props.quizscore}
          </p>
        </div>
     <button className='btn-4 no-border  fs-20' onClick={props.clearResults}>Delete</button>
      </div>
    </>
  );
}

export default Result;
