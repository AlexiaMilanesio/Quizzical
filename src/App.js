import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import Questions from './components/Questions';

export default function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  function startQuiz() {
    setShowQuiz(true);
  }

  return (
    <div className="general-container">
      {!showQuiz 
        ? <StartScreen startQuiz={startQuiz} /> 
        : <Questions />
      }
    </div>
  );
}