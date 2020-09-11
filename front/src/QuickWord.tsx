import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import useInput from "./hooks/useInput";


type Props = {
    io: SocketIOClient.Socket;
};

interface User {
    id?: string
    nickname?: string
    points?: number
    fasterUser?: boolean

}


export default function QuickWord({ io }: Props): JSX.Element {
    const { value: word, bind } = useInput();
    const [message, setMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<User>();
    const [round, setRound] = useState<Number>(1);
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

        io.on("Quickword::word", ({ myRandomWord }: { myRandomWord: string }) => {
            setRandomWord(myRandomWord)
        });
        io.emit("QuickWord::randomWord", {});
    }, [randomWord]);


    const sendWord = () => {

        io.on("QuickWord::resume", ({ message, currentUser, users, round, myRandomWord }: { message: string, currentUser: User, users: Array<User>, round: number, myRandomWord: string }) => {
            setMessage(message)
            setCurrentUser(currentUser)
            if (currentUser.points) {
                setPoints(currentUser?.points)
            }
            setRound(round)
            setRandomWord(myRandomWord)
            endGame(users)
        })

        io.emit("QuickWord::sendWord", JSON.stringify({ word }))
    }

    const paste = (e: any) => {
        e.preventDefault();
        return false;
    }

    const display = (bool: boolean): JSX.Element => {
        if (bool) {
            return <div className="alert alert-success" role="alert">
                Félicitation {currentUser?.nickname} vous avez été le plus rapide
  </div>
        } else {
            return <div className="alert alert-warning" role="alert">
                {currentUser?.nickname} vous n'avez pas copié le bon mot ou vous avez pris trop de temps
  </div>
        }

    }


    if (currentUser?.points === 15) {
        return <div className="container" >
            <div className="alert alert-success" role="alert">
                Félicitation {currentUser?.nickname} vous avez gagné la partie
</div>
            <br></br>
            {/* <a href='/'><button className="btn btn-info" type="button"> Retourner au menu </button></a> */}
        </div>
    }

    if (finisher && finisher !== currentUser) {
        return <div className="container">
            <div className="alert alert-warning" role="alert">
                Nous sommes désolé {currentUser?.nickname} vous avez perdu la partie
</div>
            <br></br>
            {/* <a style={{marginLeft: 50}} href='/'><button className="btn btn-info" type="button"> Retourner au menu </button></a> */}
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
