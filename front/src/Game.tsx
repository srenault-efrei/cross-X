import React, { useState } from "react";
import useInput from "./hooks/useInput";
import MagicNumber from "./MagicNumber";
import QuickWord from "./QuickWord"


type Props = {
  io: SocketIOClient.Socket;
  game: string
};


export default function Game({ io, game }: Props): JSX.Element {
  const { value: nickname, bind } = useInput();
  const [boolean, setBoolean] = useState(false)


  const handleNickname = () => {
    if (nickname) {
      io.emit("game::sendNickname", JSON.stringify({ nickname }));
    }
    setBoolean(true)
  };

  if (boolean) {
    if (game === 'MagicNumber') {
      return <MagicNumber io={io}></MagicNumber>
    }
  }

  if (boolean) {
    if (game === 'QuickWord') {
      return <QuickWord io={io} ></QuickWord>
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
