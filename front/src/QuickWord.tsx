import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import useInput from "./hooks/useInput";
import more from './img/more.png'
import less from './img/less.png'
import App from './App'

type Props = {
    io: SocketIOClient.Socket;
};

interface User {
    id?: string
    nickname?: string
    points?: number
}


export default function QuickWord({ io }: Props): JSX.Element {
    const { value: score, bind } = useInput();
    const [position, setPosition] = useState<string>();
    const [currentUser, setCurrentUser] = useState<User>();
    const [users, setUsers] = useState<Array<User>>();
    const [round, setRound] = useState<Number>();
    const [finisher, setFinisher] = useState<User>()


    
    
    return (

        <div className="container">

                <p>hello</p>
        </div>
    );
}
