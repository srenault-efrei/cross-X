import React, { useState, useEffect } from "react";
import useInput from "./hooks/useInput";
import MagicNumber from "./MagicNumber";

type Props = {
  io: SocketIOClient.Socket;
  game: string
};

interface User {
  id?: string
  nickname?: string
}

type Player = {
  nickname?: string;
  points?: number;
};

export default function Game({ io, game }: Props): JSX.Element {
  const [player, setPlayer] = useState<Player>();
  const [howManyPlayers, setHowManyPlayers] = useState<number>();
  const { value: nickname, bind } = useInput();
  const [boolean, setBoolean] = useState(false)

  // useEffect(() => {
    
  //   io.on("game::start", ({ howManyPlayers }: { howManyPlayers: number }) => {
  //     setHowManyPlayers(howManyPlayers)     // setPlayer({ nickname, points });
  //     console.log(howManyPlayers)
  //   });

  // },[howManyPlayers]);


  const handleNickname = () => {

    io.on("game::start", ({ howManyPlayers }: { howManyPlayers: number }) => {
      setPlayer({ nickname })
      setHowManyPlayers(howManyPlayers)     // setPlayer({ nickname, points });
    });
    if (nickname) {
      io.emit("game::sendNickname", JSON.stringify({ nickname }));
    }
    setBoolean(true)
  };

  if (boolean) {
    return <MagicNumber io={io}></MagicNumber>
  }
  return (
    <div className="m-  auto">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded-lg px-8 py-8 m-4">
          <h1 className="mt-2 mb-2 font-bold text-red-800">
            Hello {player?.nickname && `${player.nickname} `}
          </h1>
          <div className="mb-4">
            <label className="block text-black text-md font-bold mb-2">
              Nickname
            </label>
            <input
              className="shawod appearance-none border rounded py-2 px-4"
              placeholder="Sephiroth"
              {...bind}
            />
          </div>
          <div className="flex items-center justify-between w-full">
            {howManyPlayers !== 2 ? <button
              className="bg-blue-800 hover:bg-red-800 text-white px-2 py-2 rounded-md"
              type="button"
              onClick={() => handleNickname()}
            >
              Send and start the game
            </button> : <p>Veuillez attendre un adversaire</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
