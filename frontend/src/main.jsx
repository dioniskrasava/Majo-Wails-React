import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import AppFixAct from './components/fixact/AppFixAct'
import Sidebar from './components/sidebar/Sidebar';

const container = document.getElementById('root')

const root = createRoot(container)

root.render(
    <React.StrictMode>
        <div id="globalApp">
            <Sidebar />
            <div id="App"><AppFixAct/></div>
        </div>        
    </React.StrictMode>
)
