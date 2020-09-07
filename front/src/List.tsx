import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Game from "./Game";


type Props = {
    io: SocketIOClient.Socket;
};


export default function List({ io }: Props): JSX.Element {

    const [chooseGame, setGame] = useState<string>('');

    if(chooseGame !== ''){
        return <Game io={io} game={chooseGame} />
    }
    return (
        <div>
            <div>
                <div>
                    <ul className="list-group col-md-4">
                        <li className="list-group-item" onClick={() => setGame("MagicNumber")}>MagicNumber</li>
                        <li className="list-group-item"  onClick={() => setGame("QuickWord")}>QuickWord</li>
                        <li className="list-group-item" onClick={() => setGame("WordAndFurious")}>WordAndFurious</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
