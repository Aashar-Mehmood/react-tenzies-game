import { useState } from "react";
import Die from "./Die";
export default function Main() {
  const [diceArray, setDiceArray] = useState(allNewDice());
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
    setDiceArray(allNewDice());
  }
  return (
    <main>
      <div className="container">
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
          {diceArray.every((die) => {
            return die.isHeld;
          })
            ? "Reset"
            : "Roll"}
        </button>
      </div>
    </main>
  );
}
