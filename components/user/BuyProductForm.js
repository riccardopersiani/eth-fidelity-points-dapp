import React, { Component } from 'react';
import { Form, Button, Message, Icon } from 'semantic-ui-react';
import fidelityPoints from '../../ethereum/fido';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import * as firebase from "firebase";


class BuyProductForm extends Component {
    state = {
        receiver: this.props.receiver,
        value: this.props.tokens,
        product: this.props.product,
        shopEmail: this.props.shopEmail,
        userId: '',
        errMsg: false,
        okMsg: false,
        loading: false
    }

    componentDidMount() {
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            // User is signed in.
            if (user) {
                // If data are not take, take it.
                if (!self.state.userId) {
                    const userId = firebase.auth().currentUser.uid;
                    self.setState({ userId });
                }
            }
        });
    }

    onSubmit = async event => {
        event.preventDefault();
        const { value, receiver, product, shopEmail, userId } = this.state;
        this.setState({ loading: true, errMsg: false, okMsg: false });
        try {
            // Get the accounts.
            const accounts = await web3.eth.getAccounts();
            // Create the buying requst on the contract
            await fidelityPoints.methods.createBuyingRequest(
                product,
                shopEmail,
                receiver,
                value,
                userId
            ).send({
                from: accounts[0],
                gas: '5000000'
            });
            console.log("accounts");

            this.setState({ loading: false, okMsg: true });
        } catch (err) {
            var trimmedString = err.message.substring(0, 90);
            this.setState({ loading: false, errMsg: trimmedString });
        }
        this.setState({ loading: false });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} loading={this.state.loading} error={!!this.state.errMsg} success={!!this.state.okMsg}>
                <Button disabled={this.state.loading} floated='right' basic color='green'>Exchange for {this.state.value} tokens</Button>
                <Message error size='mini'>
                    <Message.Content>
                        <Message.Header><Icon size="big" name='warning sign'/>Oops!</Message.Header>
                        {this.state.errMsg}
                    </Message.Content>
                </Message>
                <Message success header="Ok!" content={`Tokens sent and buy request forwarded.`} />
            </Form>
        );
    }
}

export default BuyProductForm;