import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";
import * as firebase from 'firebase';


class Psd2RequestRow extends Component {
    state = {
        shopEthAddress: '',
        loading: false
    };

    onReject = async event => {
        var self = this
        event.preventDefault();
        event.persist();
        // Get payment data from the db
        const shopId = this.props.request.shop;
        console.log("shopId",shopId);
        const shopRef = firebase.database().ref("shops/" + shopId);
        console.log("shopRef",shopRef);
        shopRef.once("value").then(async function(snapshot) {
            console.log("asking..");
            var shopEthAddress = snapshot.child("ethereum").val();
            self.setState({ shopEthAddress });
            console.log("shopEthAddress:", self.state.shopEthAddress);
            const accounts = await web3.eth.getAccounts();
            console.log("this.props.request.tokenAmount:", self.props.request.tokenAmount);
            console.log("self.state.shopEthAddress:",self.state.shopEthAddress);
        // Firebase write "rejected = true" in the pending psd2 requests.
        await fidelityPoints.methods.transfer(self.state.shopEthAddress, self.props.request.tokenAmount)
            .send({
                from: accounts[0],
                gas: '4500000'
            });
            console.log("token transfered");
        const paymentRef = firebase.database().ref("pending_payments_psd2/" + event.target.value + "/rejected/").set(true);
        console.log("field rejected=true");
        });
    };

    onFinalize = async event => {
        var self = this;
        event.preventDefault();
        event.persist();
        console.log("self.request.rejected: ",self.props.request.rejected);
        if(!self.props.request.rejected){
            // Send the pid to express
            window.location.replace(`http://localhost:8085?pid=${event.target.value}`);
        }
    };

    render() {
        console.log("inside one psd2 row");
        const { Cell, Row } = Table;
        const { id, request } = this.props;
        return (
            <Row negative={!!request.rejected} disabled={!!request.completed || !!request.rejected} positive={!!request.completed}>
                <Cell>
                    {(request.completed || request.rejected) ? null : (
                        <Button color="red" basic onClick={this.onReject} value={id}>
                            Reject
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {(request.completed || request.rejected) ? null : (
                        <Button color="teal" basic onClick={this.onFinalize} value={id}>
                            Finalize
                        </Button>
                    )}
                </Cell>
                <Cell>{request.tokenAmount} FID</Cell>
                <Cell>Euro</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default Psd2RequestRow;