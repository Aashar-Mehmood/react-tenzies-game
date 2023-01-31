import { useEffect } from "react";
import { useState } from "react";
import Confetti from "react-confetti";
import Guide from "./Guide";
import Die from "./Die";

export default function Main() {
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const allHeld = diceArray.every((die) => die.isHeld);
    const firstValue = diceArray[0].value;
    const allSameValue = diceArray.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setGameWon(true);
    }
  }, [diceArray]);

  function allNewDice() {
    const newDiceArray = [];
    for (let i = 0; i < 10; i++) {
      newDiceArray.push({
        id: i + 1,
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
      });
      //   newDiceArray.push(Math.ceil(Math.random() * 6));
    }
    return newDiceArray;
  }

  function rollDice() {
    setDiceArray((prevArray) => {
      return prevArray.map((dieObj) => {
        return dieObj.isHeld
          ? dieObj
          : { ...dieObj, value: Math.ceil(Math.random() * 6) };
      });
    });
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
  function resetDice() {
    setGameWon(false);
    setDiceArray(allNewDice());
  }
  return (
    <main>
      {gameWon && <Confetti />}
      <div className="container">
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
          onClick={
            diceArray.every((die) => {
              return die.isHeld;
            })
              ? resetDice
              : rollDice
          }
        >
          {gameWon ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}
