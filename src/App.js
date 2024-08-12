import React from 'react';
import './App.css';

function App() {
    const [displayTime, setDisplayTime] = React.useState(25 * 60);
    const [breakTime, setBreakTime] = React.useState(5 * 60);
    const [sessionTime, setSessionTime] = React.useState(25 * 60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio("./breakTime.mp3"));

    const playSound = () =>{
      breakAudio.currentTime = 0;
      breakAudio.play();

    }


    const formatTime = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return (
            (minutes < 10 ? '0' + minutes : minutes)
            + ":" +
            (seconds < 10 ? '0' + seconds : seconds)
        )
    }

    const changeTime = (amount, type) => {
      if(type == 'break'){
        if(breakTime <= 60 && amount < 0){
          return;
        }
        setBreakTime((prev) => prev + amount )
      }else{
        if(sessionTime <= 60 && amount < 0){
          return;
        }
        setSessionTime((prev) => prev + amount)
        if(!timerOn){
          setDisplayTime(sessionTime + amount)
        }
      }
    } 

    const controlTime = () => {
      let second = 1000;
      let date = new Date().getTime();
      let nextDate = new Date().getTime() + second;
      let onBreakVariable = onBreak;
      if(!timerOn){
        let interval = setInterval(() => {
          date = new Date().getTime();
          if(date > nextDate){
            setDisplayTime(prev => {
              if(prev <= 0 && !onBreakVariable){
                playSound();
                onBreakVariable=true;
                setOnBreak(true);
                return breakTime;
              }else if(prev <= 0 && onBreakVariable){
                playSound();
                onBreakVariable=false;
                setOnBreak(false);
                return sessionTime;
              }
              return prev - 1;
            })
            nextDate += second;
          }
        }, 30)
        localStorage.clear();
        localStorage.setItem('interval-id', interval)
      }

      if(timerOn){
        clearInterval(localStorage.getItem('interval-id'));
      }
      setTimerOn(!timerOn)
    };

    const resetTime = () => {
      setDisplayTime(25 * 60)
      setBreakTime(5 * 60)
      setSessionTime(25 * 60)
    }


    return (
        <div className="main-container">
            <div className="clock-container">
              <div className="length-container">
                <Length 
                    title={'Break Length'}
                    changeTime={changeTime}
                    type={'break'}
                    time={breakTime}
                    formatTime={formatTime}
                />
                <Length 
                    title={'Session Length'}
                    changeTime={changeTime}
                    type={'session'}
                    time={sessionTime}  
                    formatTime={formatTime}
                />
              </div>

                <div className="time-container">
                    <h3>{onBreak ? "Break" : "Session"}</h3>
                    <h1>{formatTime(displayTime)}</h1>
                    <div className="btn-container">
                    <button className="btn btn-danger" onClick={controlTime}>
                      {timerOn ? (<i class="bi bi-pause"></i>)
                      : (<i class="bi bi-play-fill"></i>)
                      }
                    </button>

                    <button className="btn btn-danger" onClick={resetTime}>
                      <i class="bi bi-arrow-repeat"></i>
                    </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

function Length({ title, changeTime, type, time, formatTime }) {
    return (
        <div className="breaklength">
            <h3>{title}</h3>
            <div className="time-sets-zero">
                <button className="btn btn-dark" onClick={() => changeTime(-60, type)}>
                  <i className="bi bi-arrow-left"></i>
                </button>
                <h3>{formatTime(time)}</h3>
                <button className="btn btn-dark" onClick={() => changeTime(+60, type)}>
                  <i className="bi bi-arrow-right"></i>
                </button>
            </div>
        </div>
    )
}

export default App;
