import {Component} from "react";
import React from "react";

class User extends Component {
    state = {currentUser: ""}


    send(e) {
        e.preventDefault()
        if (this.state.currentUser !== '') {
            this.props.onChangeUser(this.state.currentUser)
        }
    }

    handleInput(e) {
        this.setState({currentUser: e.target.value});
    }

    render() {
        return (
            <div className="User">
                <form onSubmit={e => this.send(e)}>
                    <input
                        onChange={e => this.handleInput(e)}
                        value={this.state.currentUser}
                        type="text"
                        placeholder="Enter your username"
                        autoFocus={true}
                    />
                    <button>Confirm</button>
                </form>
            </div>
        )
    }
}

export default User;