import React from 'react';

export default function StartScreen(props) {
    return (
        <div className='start-screen'>
            <h1 className='title'>Quizzical</h1>
            <p className='instructions'>
                Are you a movie freak?
                <br/> 
                Answer as many questions correctly as you can! 
            </p>
            <button className='start-btn' onClick={props.startQuiz}>Start quiz</button>
        </div> 
    )
}