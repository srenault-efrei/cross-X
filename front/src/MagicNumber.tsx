import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import useInput from "./hooks/useInput";
import more from './img/more.png'
import less from './img/less.png'



type Props = {
    io: SocketIOClient.Socket;
};

interface User {
    id?: string
    nickname?: string
    points?: number
}


export default function MagicNumber({ io }: Props): JSX.Element {
    const { value: score, bind } = useInput();
    const [position, setPosition] = useState<string>();
    const [currentUser, setCurrentUser] = useState<User>();
    const [users, setUsers] = useState<Array<User>>();
    const [round, setRound] = useState<Number>();
    const [finisher, setFinisher] = useState<User>()


    const endGame = (users: Array<User>) => {
        for (const user of users) {
            if (user.points === 3) {
                setFinisher(user)
            }
        }
    }

    const sendScore = () => {
        io.emit("game::sendScore", JSON.stringify({ score }))

        io.on("magicNumber::resume", ({ position, currentUser, users, round }: { position: string, currentUser: User, users: Array<User>, round: Number }) => {
            setPosition(position)
            setCurrentUser(currentUser)
            console.log(users)
            console.log(round)
            setUsers(users)
            setRound(round)
            endGame(users)
        })
    }

    const display = () => {
        // setPosition('none')
        return <div className="alert alert-success" role="alert">
            Félicitation {currentUser?.nickname} vous avez trouvé le bon score
  </div>
    }

    if (currentUser?.points === 3) {
        return <div className="container" >
            <div className="alert alert-success" role="alert">
                Félicitation {currentUser?.nickname} vous avez gagné la partie
</div>
        </div>


    }


    if (finisher && finisher !== currentUser) {
        return <div className="container">
            <div className="alert alert-warning" role="alert">
                Nous somme désolé {finisher.nickname} à gagné la partie
</div>
        </div>
    }
    return (

        <div className="container">


            <form className="formWidth">
                <h2 className="title">MagicNumber / Manche {round} </h2><br></br>
                <label>Entrer le score à deviner : </label>
                <div className="form-group">
                    <input
                        className="form-control col-md-12 col-sm-2"
                        placeholder="299"
                        {...bind}
                    />
                </div>

                <div className= "position">
                    {position === "less" ? <img src={less} width="50" height="50" /> : position === 'more' ?
                        <img src={more} width="50" height="50" /> : position === 'equal' ? display() : <p></p>}


                </div>
                <button
                    className="btn btn-success"
                    type="button"
                    onClick={() => sendScore()}
                >
                    valider
            </button>
            </form>
        </div>
    );
}
