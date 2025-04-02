import React, { useEffect, useState } from "react";
import "./style.css";
import Test from "./Test";

// КНОПКА
const ButtEngwor = ({ name, onClick, isCorrect, isClicked }) => {
  // Определяем цвет кнопки:
  let buttonColor = "";
  if (isClicked) {
    buttonColor = isCorrect ? "green" : "red";
  }
  return (
    <button 
    onClick={onClick} style={{ background: buttonColor }}>
      {name}
    </button>
  );
};

// ГРУППА КНОПОК
const ButtGroup = ({ buttons, checkRespons, corrAnswer, clickedIndex }) => {
  /*const say = (buttonIndex) => {
        window.go.main.App.SayHello(buttonIndex);
    }*/

  return (
    <div className="button-grid">
      {/*ИЗУЧИ ЭТО!!!*/}
      {buttons.map((buttonName, index) => (
        <ButtEngwor
          key={index}
          name={buttonName}
          onClick={() => checkRespons(index)}
          isCorrect={index === corrAnswer}
          isClicked={clickedIndex === index}
        />
      ))}
    </div>
  );
};

// ПРИЛОЖЕНИЕ
const EngWo = () => {
  const [buttonNames, setButtonNames] = useState([]); // массив для названий кнопок
  const [loading, setLoading] = useState(true);
  const [labelName, setLabelName] = useState("word"); // состояние метки слова

  const [corrAnswer, setCorrAnswer] = useState(); // правильный ответ по индексу
  const [clickedIndex, setClickedIndex] = useState(null); // Пока ни одна кнопка не нажата

  // Получаем данные из Go при монтировании компонента
  useEffect(() => {
    async function fetchButtonNames() {
      try {
        const names = await window.go.main.App.GetButtonNames();
        setButtonNames(names);
      } catch (error) {
        console.error("Failed to fetch button names:", error);
        // Fallback на дефолтные значения
        setButtonNames([
          "Default 1",
          "Default 2",
          "Default 3",
          "Default 4",
          "Default 5",
          "Default 6",
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchButtonNames();
  }, []);

  if (loading) {
    return <div>Loading buttons...</div>;
  }

  const handleClickTestRandom = async () => {
    try {
      const wordEnglish = await window.go.main.App.GetRandomRow();
      setLabelName(wordEnglish);
    } catch (error) {
      console.error("Failed to get random word:", error);
      setLabelName("Error loading word");
    }
  };

  const handlePlay = async () => {
    try {
      const answers = await window.go.main.App.GetAnswers();
      //console.log(answers)
      setLabelName(answers[0]);
      // получаем кнопки для ответов
      const answersForButtons = answers.slice(2, 8);
      //console.log("Buttons : ", answersForButtons)
      setButtonNames(answersForButtons);
      setCorrAnswer(Number(answers[8])); // преобразуем строку
      //console.log("Correct answer - ", answers[8])
    } catch (error) {
      console.error("Failed to get random word:", error);
    }
  };

  const checkingResponse = (index) => {
    console.log(index);
    setClickedIndex(index); // Запоминаем, какая кнопка нажата
    if (index === corrAnswer) {
      console.log("УГАДАЛ");
    } else {
      console.log("НЕ УГАДАЛ!");
    }
  };

  return (
    <>
      <div>
        <p className="name-app">ENGLISH WORD APP</p>
        <p className="word">{labelName}</p>
        <ButtGroup
          buttons={buttonNames}
          checkRespons={checkingResponse}
          corrAnswer={corrAnswer}
          clickedIndex={clickedIndex}
        />
        <button
          className="auxiliaryButton"
          onClick={() => {
            window.go.main.App.WriteAndRead();
          }}
        >
          IMPORT
        </button>
        <button className="auxiliaryButton" onClick={handleClickTestRandom}>
          Test random
        </button>
        <button className="auxiliaryButton" onClick={handlePlay}>
          Следующее слово
        </button>
        <Test />
      </div>
    </>
  );
};

export default EngWo;
