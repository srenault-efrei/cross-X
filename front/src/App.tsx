import React, { useState } from "react";
import SocketIo from "socket.io-client";
import List from "./List";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App(): JSX.Element {
  const [io, setIo] = useState<SocketIOClient.Socket>();

  const connectIoServer = () => {
    setIo(SocketIo(process.env.REACT_APP_HOSTNAME as string));
  };

  return (
    <div>
      <div>
        <div>
          {!io ? (

            <button
              className="btn btn-info"
              type="button"
              onClick={() => connectIoServer()}
            >
              Join the Game
            </button>
          ) : (
              <List io={io} />
            )}
        </div>
      </div>
    </div>
  );
}
