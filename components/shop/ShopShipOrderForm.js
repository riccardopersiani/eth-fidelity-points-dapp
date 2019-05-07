import React, { Component } from "react";
import * as firebase from "firebase";
import { Table } from "semantic-ui-react";
import fidelityPoints from "../../ethereum/fido";
import OrderRequestRow from "./OrderRequestRow";

class ShopShipOrderForm extends Component {
    state = {
        buyingRequestCount: '',
        shopAddress: '',
        buyingRequests: [],
        loadingRenderFirst: true
    };

    // Getting buying request data when component is mounting.
    componentDidMount() {
        var self = this;
        firebase.auth().onAuthStateChanged(async function(shop) {
            if (shop) {
                // Get all the buying requests.
                const shopId = shop.uid;
                var ref = firebase.database().ref("shops/" + shopId);
                ref.once("value").then(function(snapshot) {
                    const shopAddress = snapshot.child("ethereum").val();
                    self.setState({ shopAddress })
                });
                const buyingRequestCount = await fidelityPoints.methods.getUserRequestsBuyCount().call();
                const buyingRequests = await Promise.all(
                    Array(parseInt(buyingRequestCount))
                    .fill()
                    .map((element, index) => {
                        return fidelityPoints.methods.buyingRequests(index).call();
                    })
                );
                self.setState({ buyingRequestCount, buyingRequests, loadingRenderFirst: false });
            }
        });
    }

    renderRows() {
        // Get all the buying request from all the users.
        return this.state.buyingRequests.map((request, index) => {
            // Show only the request to the current shop logged in.
            if(request.shop == this.state.shopAddress){
                return <OrderRequestRow
                    key={index}
                    id={index}
                    request={request}
                />
            }
        });
    }

    render() {
        if (this.state.loadingRenderFirst == true) {
            return (
                <Table celled compact definition size="small">
                    <Table.Header fullWidth>
                        <Table.Row key={"header"}>
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell>User First Name</Table.HeaderCell>
                            <Table.HeaderCell>Shipping Address</Table.HeaderCell>
                            <Table.HeaderCell>User Address</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Shipped</Table.HeaderCell>
                            <Table.HeaderCell>Rejected</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body />
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan="5" />
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
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell>User First Name</Table.HeaderCell>
                            <Table.HeaderCell>Shipping Address</Table.HeaderCell>
                            <Table.HeaderCell>User Address</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Product</Table.HeaderCell>
                            <Table.HeaderCell>Shipped</Table.HeaderCell>
                            <Table.HeaderCell>Rejected</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell colSpan="5" />
                        </Table.Row>
                    </Table.Footer>
                </Table>
            );
        }
    }
}

export default ShopShipOrderForm;