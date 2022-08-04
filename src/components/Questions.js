import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import he from 'he';

export default function Questions() {
    const [quiz, setQuiz] = useState([]);
    const [score, setScore] = useState(0);
    const [displayScore, setDisplayScore] = useState(false);
    const [resetQuiz, setResetQuiz] = useState(false);

    // API call
    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple")
            .then(res => res.json())
            .then(data => setQuiz(data.results.map(item => {
                return {
                    id: nanoid(),
                    question: he.decode(item.question),
                    answers: shuffle([
                        ...item.incorrect_answers,
                        item.correct_answer
                    ]),
                    correctAnswer: item.correct_answer,
                    scored: false
                }
        })));
    }, [resetQuiz]);

    // Shuffle answers: Fisher-Yates algorithm
    function shuffle(arr) {
        let answersArray = arr.map(ans =>{
            return {
                id: nanoid(),
                answer: he.decode(ans),
                isSelected: false
            }
        });
        for(let i = answersArray.length - 1; i > 0; i--) {
            let randomPosition = Math.floor(Math.random() * (i + 1));
            let temp = answersArray[i];
            // Swap answers
            answersArray[i] = answersArray[randomPosition];
            answersArray[randomPosition] = temp;
        }
        return answersArray;    
    }

    // Handle answer selection
    function selection(questionId, answerId) {
        setQuiz(prevQuiz => prevQuiz.map(item => {
            if(item.id === questionId) {
                return {
                    ...item,
                    answers: item.answers.map(ans => {
                        return ans.id === answerId ? {...ans, isSelected: !ans.isSelected} : {...ans, isSelected: false}
                    }),
                    scored: item.correctAnswer === item.answers.find(ans => (ans.id === answerId)).answer
                }
            } else {
                return item;
            }
        }));
    }

    // Count correct answers and show score
    function correction() {
        const count = quiz.filter(item => item.scored);
        setScore(count.length);
        setDisplayScore(true);
    }

    // Re-start quiz
    function reset() {
        setResetQuiz(prevState => !prevState);
        setDisplayScore(false);
        setScore(0);
        setQuiz([]);
    }

    return (
        <div className='quiz-container'>
            {quiz.map(item => {
                return (
                    <div className='question-container' key={item.id}>
                        <p className='question'>{item.question}</p>
                        <div className='answers-container'>
                            {item.answers.map(ans => {
                                return (
                                    <p
                                    key={ans.id} 
                                    onClick={() => selection(item.id, ans.id)}
                                    className='answer-box' 
                                    style={{
                                    backgroundColor: 
                                        !displayScore && ans.isSelected ? "#D6DBF5" 
                                        : displayScore && ans.answer === item.correctAnswer ?"#94D7A2"
                                        : displayScore && ans.isSelected && ans.answer !== item.correctAnswer ? "#F8BCBC"
                                        : "",
                                    border: 
                                        !displayScore && ans.isSelected ? "1.2px solid #D6DBF5" 
                                        : displayScore && ans.answer === item.correctAnswer ? "1.2px solid #94D7A2"
                                        : displayScore && ans.isSelected && ans.answer !== item.correctAnswer ? "1.2px solid #F8BCBC"
                                        : "",
                                    opacity: 
                                        displayScore && ans.isSelected && ans.answer !== item.correctAnswer ? "0.5"
                                        : displayScore && !ans.isSelected && ans.answer !== item.correctAnswer ? "0.5"
                                        : ""
                                    }} 
                                    >
                                    {ans.answer}
                                    </p>   
                                )
                            })} 
                        </div>
                        <hr className='line'/>
                    </div>
                )
            })} 

            {!displayScore && 
                <div className='results-btn-container'>
                    <button className='check-btn' onClick={correction}>Check answers</button>
                </div>
            }
            {displayScore && 
                <div className='results-btn-container'>
                    <p className='results'>You scored {score}/5 correct answers</p>
                    <button className='reset-btn' onClick={reset}>Reset Quiz</button>
                </div>
            }
        </div> 
    )
}