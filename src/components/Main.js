import { useEffect } from "react";
import { useState } from "react";
import Confetti from "react-confetti";
import Guide from "./Guide";
import Die from "./Die";

export default function Main() {
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [gameWon, setGameWon] = useState(false);

  const [bestRollCount, setBestRollCount] = useState(
    () => localStorage.getItem("bestRollCount") || 50
  );
  const [rollCount, setRollCount] = useState(0);

  const [bestTime, setBestTime] = useState(
    () => localStorage.getItem("bestTime") || 500
  );
  const [startCount, setStartCount] = useState(false);

  const [count, setCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // run this effect whenever startCount changes and is true
  useEffect(() => {
    if (startCount) {
      const intervalId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startCount]);

  // initialize the dice array
  function allNewDice() {
    const newDiceArray = [];
    for (let i = 0; i < 10; i++) {
      newDiceArray.push({
        id: i + 1,
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
      });
    }
    return newDiceArray;
  }

  // change held property when a dice is clicked
  function changeHeld(dieId) {
    setDiceArray((prevArray) => {
      return prevArray.map((dieObj) => {
        return dieObj.id === dieId
          ? { ...dieObj, isHeld: !dieObj.isHeld }
          : dieObj;
      });
    });
  }

  // set the dice array to a new array
  // keep the die which is held and change all others
  function rollDice() {
    setDiceArray((prevArray) => {
      return prevArray.map((dieObj) => {
        return dieObj.isHeld
          ? dieObj
          : { ...dieObj, value: Math.ceil(Math.random() * 6) };
      });
    });
    setRollCount((prevCount) => prevCount + 1);
  }

  // check for game win conditions whenever dice array changes
  useEffect(() => {
    const allHeld = diceArray.every((die) => die.isHeld);
    const firstValue = diceArray[0].value;
    const allSameValue = diceArray.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setGameWon(true);
      setTotalTime(count);
    }
  }, [diceArray]);

  // check if game is won to set the best counts and roll counts
  useEffect(() => {
    if (gameWon) {
      if (rollCount < Number(bestRollCount)) {
        setBestRollCount(rollCount);
        localStorage.setItem("bestRollCount", rollCount);
      }
      if (totalTime < Number(bestTime)) {
        setBestTime(totalTime);
        localStorage.setItem("bestTime", totalTime);
      }
    }
  }, [gameWon]);

  // reset the game
  function resetDice() {
    setCount(0);
    setStartCount(false);
    setRollCount(0);
    setGameWon(false);
    setDiceArray(allNewDice());
  }

  return (
    <main onClick={() => setStartCount(true)}>
      {gameWon && <Confetti />}
      <div className="container">
        <h2>
          Roll Counts : {rollCount}
          <span> ( Best : {bestRollCount} )</span>
        </h2>
        <h2>
          Time : {gameWon ? totalTime : count} sec
          <span> ( Best : {bestTime} )</span>
        </h2>
        <Guide />
        <div className="die_container">
          {diceArray.map((die) => {
            return (
              <Die
                {...die}
                key={die.id}
                handleClick={() => changeHeld(die.id)}
              />
            );
          })}
        </div>
        <button
          className="roll_dice"
          onClick={(e) => {
            // prevent running of onClick function defined for main
            e.stopPropagation();
            gameWon ? resetDice() : rollDice();
          }}
        >
          {gameWon ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}
