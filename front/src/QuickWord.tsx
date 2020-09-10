import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import useInput from "./hooks/useInput";


type Props = {
    io: SocketIOClient.Socket;
    howManyPlayers: number
};

interface User {
    id?: string
    nickname?: string
    points?: number
}


export default function QuickWord({ io, howManyPlayers }: Props): JSX.Element {
    const { value: word, bind } = useInput();
    const [message, setMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<User>();
    const [users, setUsers] = useState<Array<User>>();
    const [round, setRound] = useState<Number>(1);
    // const [winner, setWinner] = useState<User>()
    const [randomWord, setRandomWord] = useState<string>()
    const [finisher, setFinisher] = useState<User>()
    const [points, setPoints] = useState<number>(0)



    const endGame = (users: Array<User>) => {
        for (const user of users) {
            if (user.points === 15) {
                setFinisher(user)
            }
        }
    }

    useEffect(() => {

        io.on("Quickword::word", ({ myRandomWord, round, points }: { myRandomWord: string, round: number, points: number }) => {
            setRandomWord(myRandomWord)
            setRound(round)
        });
        io.emit("QuickWord::randomWord", {});
    }, [randomWord, round]);


    const sendWord = () => {
        console.log(word)

        io.on("QuickWord::resume", ({ message, currentUser, users, round, myRandomWord }: { message: string, currentUser: User, users: Array<User>, round: number, myRandomWord: string }) => {
            setMessage(message)
            setCurrentUser(currentUser)
            setUsers(users)
            if (currentUser.points) {
                setPoints(currentUser?.points)
            }
            setRound(round)
            setRandomWord(myRandomWord)
            endGame(users)

            console.log(currentUser?.points)
        })

        io.emit("QuickWord::sendWord", JSON.stringify({ word }))
    }

    const paste = (e: any) => {
        e.preventDefault();
        return false;
    }

    const display = (bool: boolean): JSX.Element => {
        // setPosition('none')
        if (bool) {
            return <div className="alert alert-success" role="alert">
                Félicitation {currentUser?.nickname} vous avez été le plus rapide
  </div>
        } else {
            return <div className="alert alert-warning" role="alert">
                {currentUser?.nickname} vous n'avez pas copié le bon mot
  </div>
        }

    }


    if (currentUser?.points === 15) {
        return <div className="container" >
            <div className="alert alert-success" role="alert">
                Félicitation {currentUser?.nickname} vous avez gagné la partie
</div>
        </div>
    }

    if (finisher && finisher !== currentUser) {
        return <div className="container">
            <div className="alert alert-warning" role="alert">
                Nous sommes désolé {currentUser?.nickname} vous avez perdu la partie
</div>
        </div>
    }


    return (


        <div className="container">


            <form className="formWidth">
                <h2 className="title">QuickWord / Manche {round} </h2><br></br>
                <h5 className="points"> {points} points</h5>
                <label>Entrer le mot <strong>{randomWord}</strong> le plus rapidement possible </label>
                <div className="form-group">
                    <input
                        onPaste={(e) => paste(e)}
                        className="form-control col-md-12 col-sm-2"
                        placeholder="souris"
                        {...bind}
                    />
                </div>

                <div className="position">
                    {message === "not found" ? display(false) : message === "faster" ? display(true) : <p></p>}


                </div>
                <button
                    className="btn btn-success"
                    type="button"
                    onClick={() => sendWord()}
                >
                    valider
            </button>
            </form>
        </div>
    );
}
