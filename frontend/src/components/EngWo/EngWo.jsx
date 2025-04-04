import React, { useEffect, useState, useRef } from "react";
import useSound from 'use-sound';
import "./style.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faAnglesLeft, faBars } from '@fortawesome/free-solid-svg-icons';

import ModalSettings from "./ModalSettings";


import clickSound from '../../assets/click.mp3'; // Импортируем звуковой файл

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
  const [idWord, setIdWord] = useState(); // id изучаемого слова
  const [clickedIndex, setClickedIndex] = useState(null); // какая кнопка нажата

  const [gaveAnswer, setGaveAnswer] = useState(false); // дал ли пользователь ответ?

  const [showModalSettings, setShowModalSettings] = useState(false); // модальное окно настроек

  const soundRef = useRef(null);

  // Инициализируем useSound
  const [playClick] = useSound(clickSound, { volume: 0.5 });

  // отображения нового слова (с вариантами ответов)
  const handleNextWord = async () => {
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

      setClickedIndex(null)

      // запоминаем индекс изучаемого слова из БД
      setIdWord(answers[1])
      setGaveAnswer(false) // фиксируем, что пользователь не давал ответа на данное слово
    } catch (error) {
      console.error("Failed to get random word:", error);
    }
  };

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
    handleNextWord();

  }, []);





  // ПРОВЕРКА КЛИКА
  const checkingResponse = (index) => {
    playClick(); // Воспроизводим звук
    setClickedIndex(index); // Запоминаем, какая кнопка нажата


    if (index === corrAnswer)  {
      if (gaveAnswer == false) {
        console.log("Я ТУТ!")
        const id = Number(idWord)
        window.go.main.App.IncrementGuessing(id); // увеличивае количество угадываний в бд на 1
        setGaveAnswer(true) // фиксируем, что пользователь уже дал ответ
      }
      console.log("УГАДАЛ");  
    } else {
      console.log("НЕ УГАДАЛ!");
      setGaveAnswer(true) // фиксируем, что пользователь уже дал ответ
    }
  };

  if (loading) {
    return <div>Loading buttons...</div>;
  }

  return (
    <>
      <div>
        <div>
          <p className="word">{labelName}</p>
          {/*кнопка настроек*/}
          <button className="settingsButton"
            onClick={() => { setShowModalSettings(true) }}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <ButtGroup
          buttons={buttonNames}
          checkRespons={checkingResponse}
          corrAnswer={corrAnswer}
          clickedIndex={clickedIndex}
        />
        <div className="auxiliaryButtons">

          <button className="auxiliaryButton">
          <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button className="auxiliaryButton" onClick={handleNextWord}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>

        </div>

        {showModalSettings && (<ModalSettings onClose={() => { setShowModalSettings(false) }} />)}
      </div>
    </>
  );
};

export default EngWo;
