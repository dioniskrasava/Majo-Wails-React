import React from "react";
import "./styleSettApp.css"

const SettApp = () => {
return (
    <div>
        <div>
            HELLO SETTAPP (SETTINGS APPLICATION)
            <div>
                <button className="buttonSettApp" onClick={AddWidth}>W+</button>
                <button className="buttonSettApp" onClick={IncWidth}>H+</button>
            </div>       
        </div>
    </div>
)
};

const AddWidth = () => {
    window.go.main.App.SetSettings("WIDTH+",25)   
}

const IncWidth = () => {
    window.go.main.App.SetSettings("WIDTH+",-25)
}


export default SettApp