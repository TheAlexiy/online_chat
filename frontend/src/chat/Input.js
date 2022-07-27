import {Component} from "react";
import React from "react";

class Input extends Component {
    state = {text: ""}

    send (e) {
        e.preventDefault()
        if (this.state.text !== '') {
            this.props.onSendMessage(this.state.text)
            this.setState({text: ''});
        }
    }

    handleInput(e) {
        this.setState({text: e.target.value});
    }

    render() {
        return (
            <div className="Input">
                <form onSubmit={e => this.send(e)}>
                    <input
                        onChange={e => this.handleInput(e)}
                        value={this.state.text}
                        type="text"
                        placeholder="Enter your message and press ENTER"
                        autoFocus={true}
                    />
                    <button>Send</button>
                </form>
            </div>
        );
    }
}

export default Input;