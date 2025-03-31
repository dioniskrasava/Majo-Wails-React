import React, { useEffect, useState } from 'react';
import './style.css';



const ButtEngwor = ({ name }) => {
    return (
        <button>{name}</button>
    )
}

const ButtGroup = ({ buttons }) => {
    return (
        <div className='button-grid'>
            {/*ИЗУЧИ ЭТО!!!*/}
            {buttons.map((buttonName, index) => (
                <ButtEngwor key={index} name={buttonName} />
            ))}
        </div>
    );
};


const EngWo = () => {

    const [buttonNames, setButtonNames] = useState([]);
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
            </div>
        </>
    );
};

export default EngWo;