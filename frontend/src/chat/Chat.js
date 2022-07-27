import React from 'react';
import Messages from "./Messages";
import './Chat.scss';
import socketClient from "socket.io-client";
import Input from "./Input";
import User from "./User";
import qs from 'qs'

const SERVER = "http://127.0.0.1:3001";

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

export class Chat extends React.Component {
    state = {
        messages: [ {
            text: "Have a nice day",
            member: {
                username: 'Admin',
                id: null,
                color: randomColor()
            },
            time: Date.now()
        }],
        currentUser: {
            id: null,
            username: null,
            color: null
        },
        channel: null
    }
    socket;


    componentDidMount() {
        this.loadChannel()
        this.configureSocket();
    }

    configureSocket = () => {
        const socket = socketClient(SERVER);

        socket.on('connection', () => {
            console.log('Client connected')
        });

        socket.on('message', (message, user, time) =>{
            const messages = this.state.messages
            messages.push({text: message, time: time, member: {color: randomColor(), id: user.id, username: user.username}})
            this.setState(messages)
        })

        socket.on('current-user', (user) => {
            this.setState({currentUser: user} )
        })
        this.socket = socket
    }

    loadChannel = async () => {
        fetch('http://localhost:3001/getChannels').then(async response => {
            let data = await response.json();
            this.setState({channel: data.channel});
        })
    }

    handleSendMessage = (message) => {
        let user = qs.stringify(this.state.currentUser)
        const regex = /(=\d+)/
        user = user.match(regex)
        let result = user[0].toString().replace(/.(?=(.*))/, '')
        result = Number(result)
        this.socket.emit('send-message', message, result)
    }
    handleChangeUser = (user) => this.socket.emit('change-user', user)

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Online chat</h1>
                </div>
                <Messages
                    messages={this.state.messages}
                    currentUser={this.state.currentUser}
                />
                <Input onSendMessage={this.handleSendMessage}/>
                <User onChangeUser={this.handleChangeUser}/>
            </div>
        );
    }
}