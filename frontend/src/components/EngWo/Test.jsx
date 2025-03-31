import React, { useEffect, useState } from 'react';

function Test() {
    useEffect(() => {
        console.log('Этот эффект выполнится только один раз при монтировании');
      }, []); // Пустой массив зависимостей
  
    return <div>Пример компонента</div>;
}

export default Test;
  
  