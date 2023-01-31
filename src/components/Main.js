import { useEffect } from "react";
import { useState } from "react";
import Confetti from "react-confetti";
import Guide from "./Guide";
import Die from "./Die";

export default function Main() {
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [gameWon, setGameWon] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  const [startCount, setStartCount] = useState(false);
  const [count, setCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (startCount) {
      const newIntervalId = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);

      return () => clearInterval(newIntervalId);
    }
  }, [startCount]);

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

  function changeHeld(dieId) {
    setDiceArray((prevArray) => {
      return prevArray.map((dieObj) => {
        return dieObj.id === dieId
          ? { ...dieObj, isHeld: !dieObj.isHeld }
          : dieObj;
      });
    });
  }

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

  useEffect(() => {
    const allHeld = diceArray.every((die) => die.isHeld);
    const firstValue = diceArray[0].value;
    const allSameValue = diceArray.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setGameWon(true);
      setTotalTime(count);
    }
  }, [diceArray]);

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
          <br />
          <br />
          Time : {gameWon ? totalTime : count} (sec)
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
            e.stopPropagation();
            diceArray.every((die) => {
              return die.isHeld;
            })
              ? resetDice()
              : rollDice();
          }}
        >
          {gameWon ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}
