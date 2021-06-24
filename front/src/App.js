import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, ButtonToggle, Col, FormGroup, Label } from 'reactstrap';
import './App.css'


const App = (props) => {

  const [fieldName, setName] = useState('')
  const [room, setRoom] = useState('')
  const [display, setDisplay] = useState('')

  const handleClick = () => {
    props.socket.emit('join_room', room)
    if (room !== '' && fieldName !== '') {
      console.log(room, fieldName)
      setDisplay('none')
      props.socket.emit("join_room", room)
    }
  }
  return (

    <div>
      <div className="container">
        <div style={{ display }} >
          <h2 className="title" >Bienvenue sur la plateforme cross-x</h2>
          <Form>
            <FormGroup >
              <Label for="Name" sm={2} size="lg">Name</Label>
              <Col md={12}>
                <Input type="text" name="Name" id="Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
            </FormGroup>
            <FormGroup >
              <Label for="Room" sm={2}>Room</Label>
              <Col md={12}>
                <Input type="text" name="Room" id="Room"
                  onChange={(e) => setRoom(e.target.value)}
                />
              </Col>
              <br />
              <ButtonToggle color="primary"
                onClick={() => handleClick()}
              >Valider</ButtonToggle>{' '}
            </FormGroup>
          </Form>
        </div>

      </div>
    </div>


  );
}


export default App;
