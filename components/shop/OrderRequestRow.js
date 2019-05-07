import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";
import * as firebase from "firebase";


class OrderRequestRow extends Component {
    state = {
        shippingAddress: '',
        firstname: '',
        lastname: '',
        city: '',
        country: '',
        shopId: '',
        zipcode: ''
    };

    // Reject the user buy request
    onReject = async event => {
        event.preventDefault();
        event.persist();
        // Get accounts.
        const accounts = await web3.eth.getAccounts();
        // Reject the order of the user.
        await fidelityPoints.methods.rejectUserRequestBuy(this.props.id).send({
            from: accounts[0],
            gas: '4500000'
        });
    };

    // Mark as shipped the user buy request
    onFinalize = async event => {
        event.preventDefault();
        event.persist();
        // Get accounts.
        const accounts = await web3.eth.getAccounts();
        // Declare the order of the user as shipped.
        await fidelityPoints.methods.finalizeUserRequestBuy(this.props.id).send({
            from: accounts[0],
            gas: '4500000'
        });
    };

    componentDidMount() {
        console.log("weeee");
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            // User is signed in.
            if (user) {
                // If user data are not take, take it
                if (!self.state.shopId) {
                    var shopId = firebase.auth().currentUser.uid;
                    var ref = firebase.database().ref("shops/" + shopId);
                    console.log("shopId",shopId);
                    ref.once("value").then(function(snapshot) {
                        var shippingAddress = snapshot.child("shopAddress").val();
                        var firstname = snapshot.child("ownerFirstName").val();
                        var lastname = snapshot.child("ownerFirstLast").val();
                        var city = snapshot.child("city").val();
                        var country = snapshot.child("country").val();
                        var zipcode = snapshot.child("zipcode").val();
                        self.setState({
                            shopId,
                            shippingAddress,
                            firstname,
                            lastname,
                            city,
                            country,
                            zipcode,
                        });
                        console.log("shippingAddress",shippingAddress);

                    });
                }
            }
        });
    }

    render() {
        const { Cell, Row } = Table;
        const { request } = this.props;
        return (
            <Row disabled={!!request.completed} positive={!!request.completed}>
                <Cell>
                    {(request.reject || request.shipped) ? null : (
                        <Button color="teal" basic onClick={this.onReject} >
                            Reject
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {(request.reject || request.shipped) ? null : (
                        <Button color="teal" basic onClick={this.onFinalize} >
                            Ship
                        </Button>
                    )}
                </Cell>
                <Cell>{this.state.firstname}</Cell>
                <Cell>{this.state.shippingAddress}</Cell>
                <Cell>{request.user}</Cell>
                <Cell>{request.value}</Cell>
                <Cell>{request.product} FID</Cell>
                <Cell>{request.shipped.toString()}</Cell>
                <Cell>{request.rejected.toString()}</Cell>
            </Row>
        );
    }
}

export default OrderRequestRow;