import React, { useEffect, useState } from 'react';
import './style.css';
import Test from './Test'


// КНОПКА
const ButtEngwor = ({ name, say }) => {
    return (
        <button onClick={say}>{name}</button>
    )
}

// ГРУППА КНОПОК
const ButtGroup = ({ buttons }) => {

    const say = (buttonIndex) => {
        window.go.main.App.SayHello(buttonIndex);
    }

    return (
        <div className='button-grid'>
            {/*ИЗУЧИ ЭТО!!!*/}
            {buttons.map((buttonName, index) => (
                <ButtEngwor key={index} 
                    name={buttonName} 
                    say={() => say(index)} 
                />
            ))}
        </div>
    );
};

// ПРИЛОЖЕНИЕ
const EngWo = () => {

    const [buttonNames, setButtonNames] = useState([]); // массив для названий кнопок
    const [loading, setLoading] = useState(true);

    // Получаем данные из Go при монтировании компонента
    useEffect(() => {
        async function fetchButtonNames() {
            try {
                const names = await window.go.main.App.GetButtonNames();
                setButtonNames(names);
            } catch (error) {
                console.error("Failed to fetch button names:", error);
                // Fallback на дефолтные значения
                setButtonNames(["Default 1", "Default 2", "Default 3", "Default 4", "Default 5", "Default 6"]);
            } finally {
                setLoading(false);
            }
        }
        
        fetchButtonNames();
    }, []);

    if (loading) {
        return <div>Loading buttons...</div>;
    }


    return (
        <>
            <div>
                <p className='name-app'>ENGLISH WORD APP</p>
                <p className='word'>--words--</p>
                <ButtGroup buttons={buttonNames} />
                <Test/>
            </div>
        </>
    );
};

export default EngWo;