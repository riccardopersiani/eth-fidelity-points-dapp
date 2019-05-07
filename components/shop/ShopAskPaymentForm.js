import React, { Component } from "react";
import { Form, Input, Button, Message, Select } from "semantic-ui-react";
import { Router } from "../../routes";
import * as firebase from "firebase";
import { paymentOptions } from "../../others/common";
import fidelityPoints from "../../ethereum/fido";
import web3 from "../../ethereum/web3";
import guid from "../../components/utils/guidGenerator"

class ShopAskPaymentForm extends Component {
  state = {
    method: '',
    value: '',
    note: '',
    owner: '',
    errMsg: '',
    okMsg: '',
    loading: false
  };

  handleChangePaymentMethod = (e, { value }) => this.setState({ method: value });

  onSubmit = async event => {
    event.preventDefault();
    var self = this;
    try {
      // Asking for an Ethereum payment.
      if(self.state.method == 'eth'){
        // Get from the contract the summary of information.
        const summary = await fidelityPoints.methods.getSummary().call();
        // Get the shop which is asking for payment.
        var shop = firebase.auth().currentUser;
        // Save the owner address in the state variable.
        this.setState({ owner: summary[3], loading: true, okMsg: false, errMsg: false });
        // Get the accounts.
        const accounts = await web3.eth.getAccounts();
        // Perform the tokens transfer to the owner.
        await fidelityPoints.methods.createEthereumPaymentRequest(self.state.value, self.state.note, shop.uid)
        .send({
          from: accounts[0],
          gas: '4500000'
        });
        this.setState({ okMsg: true, loading: false });
      // Asking for a PSD2 payment.
      } else {
          // Get from the blockchain the summary of information.
          const summary = await fidelityPoints.methods.getSummary().call();
          // Get the shop id which is asking for payment.
          var shop = firebase.auth().currentUser;
          // Save the owner address in the state variable.
          this.setState({ owner: summary[1], loading: true, okMsg: false, errMsg: false });
          // Get the accounts.
          const accounts = await web3.eth.getAccounts();
          console.log("writing psd2 request in firebase");
          // After the trasfer in the blockchain, register the payment in the db with paymentid = timestamp.
          firebase.app().database().ref("pending_payments_psd2/" +  guid())
          .set({
            shop: shop.uid, // in the blockchain is memorized the eth address, here avoid because we need a query to the database
            tokenAmount: self.state.value,
            method: self.state.method,
            note: self.state.note,
            timestamp: Math.floor(Date.now()),
            completed: false,
            rejected: false
          });
          // Send the token amount to the owner and create the request.
          console.log("sending tokens for psd2 request in eth");
          await fidelityPoints.methods.transfer(self.state.owner, self.state.value)
          .send({
            from: accounts[0],
            gas: '5000000'
          }).then(() => {
            this.setState({ okMsg: true, loading: false });
          });
      }
    } catch (err) {
      //TODO revert the psd2 request transaction
      // Print the first part of error message to the user.
      var trimmedString = err.message.substring(0, 150);
      this.setState({ errMsg: trimmedString, loading: false });
    }
    // Operation completed, reset the input values.
    this.setState({ value: '', note: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errMsg} loading={this.state.loading} success={!!this.state.okMsg}>
        <Form.Field required>
          <label>Token amount to send</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="token"
            labelPosition="right"
            required
          />
        </Form.Field>
        <Form.Field
          control={Select}
          label="Payment Method"
          options={paymentOptions}
          placeholder="Payment Method"
          onChange={this.handleChangePaymentMethod}
          value={this.state.method}
          required
        />
        Note
        <Form.TextArea
          onChange={event => this.setState({ note: event.target.value })}
          value={this.state.note}
          placeholder="Give us additional information..."
        />
        <Message success header="Ok!" content={"Request forwarded, points transfer completed and registered on the blockchain"} />
        <Message error header="Oops!" content={this.state.errMsg} />
        <Form.Field control={Button}>Ask</Form.Field>
      </Form>
    );
  }
}

export default ShopAskPaymentForm;
