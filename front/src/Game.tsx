import React, { useState, useEffect } from "react";
import useInput from "./hooks/useInput";
import MagicNumber from "./MagicNumber";
import QuickWord from "./QuickWord"


type Props = {
  io: SocketIOClient.Socket;
  game: string
};


export default function Game({ io, game }: Props): JSX.Element {
  const [howManyPlayers, setHowManyPlayers] = useState<number>(0);
  const { value: nickname, bind } = useInput();
  const [boolean, setBoolean] = useState(false)

  // useEffect(() => {

  //   io.on("game::start", ({ howManyPlayers }: { howManyPlayers: number }) => {
  //     setHowManyPlayers(howManyPlayers)     // setPlayer({ nickname, points });
  //     console.log(howManyPlayers)
  //   });

  // },[]);


  const handleNickname = () => {

    io.on("game::start", ({ howManyPlayers }: { howManyPlayers: number }) => {
      setHowManyPlayers(howManyPlayers)     // setPlayer({ nickname, points });
      // console.log(howManyPlayers)
    });
    if (nickname) {
      io.emit("game::sendNickname", JSON.stringify({ nickname }));
    }
    setBoolean(true)
  };

  if (boolean) {
    if (game === 'MagicNumber') {
      // console.log("howManyPlayers")
      // console.log(howManyPlayers)
      return <MagicNumber io={io} howManyPlayers={howManyPlayers}></MagicNumber>
    }
  }

  if (boolean) {
    if (game === 'QuickWord') {
      return <QuickWord io={io} howManyPlayers={howManyPlayers} ></QuickWord>
    }
  }
  return (

    <div className="container">
      <form className="formWidth">
        <h2 className="title">Choisissez votre nom </h2><br></br>
        <div className="form-group">
          <input
            className="form-control col-md-12 col-sm-2"
            placeholder="Sephiroth"
            {...bind}
          />
        </div>
        <div className="">

          <button
            className="btn btn-success mb-2"
            type="button"
            onClick={() => handleNickname()}
          >
            Commencer la partie
            </button>
        </div>
      </form>
    </div>
  );
}
