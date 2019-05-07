import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import fidelityPoints from '../../ethereum/fido';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';


class AddNewShopForm extends Component {
    state = {
        value: '',
        receiver: '',
        errMsg: '',
        okMsg: '',
        shopAddress: '',
        loading: false
    }

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, errMsg: false, okMsg: false });
        try {
            // Get accounts.
            const accounts = await web3.eth.getAccounts();
            // Save the shop address
            const shopAddress = this.state.value;
            // Add the shop to the shops vector in the contract, only the owner can call this function.
            await fidelityPoints.methods.addShop(shopAddress)
            .send({
                from: accounts[0],
                gas: '1000000'
            });
            this.setState({ loading: false, okMsg: true, shopAddress })
        } catch (err) {
            var trimmedString = err.message.substring(0, 90);
            this.setState({ loading: false, errMsg: trimmedString });
        }
        this.setState({ value: '' });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errMsg} loading={this.state.loading} success={!!this.state.okMsg}>
                <Form.Field>
                    <label>Shop address</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="address"
                        labelPosition="right"
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errMsg} />
                <Message success header="Ok!" content={`${this.state.shopAddress} is now an approved shop`} />
                <Button primary>
                    Add
                </Button>
            </Form>
        );
    }
}

export default AddNewShopForm;