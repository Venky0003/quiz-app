function Takequiz(props) {
  return (
    <>
      <div className="text-center fs-25">
        <button className="fs-25 fw-600 no-border btn" onClick={props.handleTakeQuiz}>Take A Quiz</button>
      </div>
    </>
  );
}

export default Takequiz;
