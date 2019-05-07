import React, { Component } from "react";
import * as firebase from "firebase";
import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import fidelityPoints from "../../ethereum/fido";
import web3 from "../../ethereum/web3";
import UserOrderRequestRow from "./UserOrderRequestRow";

class UserOrderStatusTable extends Component {
    state = {
        buyingRequestCount: '',
        userId: '',
        buyingRequests: [],
        loadingRenderFirst: true
    };

    // Getting data when component is mounting
    async componentDidMount() {
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            // User is signed in.
            if (user) {
                // If data are not take, take it
                if (!self.state.userId) {
                    var userId = '';
                    userId = user.uid;
                    self.setState({ userId });
                }
            }
        });
        // Get buying request from the contract
        const buyingRequestCount =  await fidelityPoints.methods.getUserRequestsBuyCount().call();
        const buyingRequests =  await Promise.all(
            Array(parseInt(buyingRequestCount))
            .fill()
            .map((element, index) => {
                return fidelityPoints.methods.buyingRequests(index).call();
            })
        );
        self.setState({ buyingRequestCount, buyingRequests, loadingRenderFirst: false });
    }

    renderRowsUserBuy() {
        var self = this;
        return this.state.buyingRequests.map((request, index) => {
            if(request.userId == self.state.userId){
                return <UserOrderRequestRow
                    key={index}
                    id={index}
                    request={request}
                />
            }
        })
    }

    render() {
        if (this.state.loadingRenderFirst == true) {
            return (
                <Table celled compact definition size="small">
                    <Table.Header fullWidth>
                        <Table.Row key={"header"}>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Shop Email</Table.HeaderCell>
                            <Table.HeaderCell>Shop Address</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Shipped</Table.HeaderCell>
                            <Table.HeaderCell>Rejected</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body />
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan="6" />
                        </Table.Row>
                    </Table.Footer>
                </Table>
            );
        }
        if (this.state.loadingRenderFirst == false) {
            return (
                <Table celled compact definition size="small">
                    <Table.Header fullWidth>
                        <Table.Row key={"header"}>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Shop Email</Table.HeaderCell>
                            <Table.HeaderCell>Shop Address</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Shipped</Table.HeaderCell>
                            <Table.HeaderCell>Rejected</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRowsUserBuy()}
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Footer>
                </Table>
            );
        }
    }
}

export default UserOrderStatusTable;