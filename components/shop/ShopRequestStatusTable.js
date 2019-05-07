import React, { Component } from "react";
import * as firebase from "firebase";
import { Table } from "semantic-ui-react";
import fidelityPoints from "../../ethereum/fido";
import web3 from "../../ethereum/web3";
import EthereumRequestRowShop from "./EthereumRequestRowShop";
import Psd2RequestRowShop from "./Psd2RequestRowShop";

class ShopRequestStatusTable extends Component {
    state = {
        ethereumRequestCount: '',
        ethereumRequests: [],
        psd2Requests: [],
        loadingRenderFirst: true
    };

    // Loading psd2 request data from the database.
    async loadData() {
        // Refer to the database psd2 payments table.
        var paymentRef = firebase.app().database().ref("pending_payments_psd2");
        // Get the snapshot of pending_payments_psd2.
        var promise = new Promise((resolve, reject) => {
            paymentRef.once("value").then(function(snapshot) {
                resolve(snapshot);
            });
        });
        return promise;
    }

    // Getting requests data when component is mounting.
    async componentDidMount() {
        var self = this;
        this.loadData()
        .then(async (snapshot) => {
            // Get the psd2 requests.
            var promise = new Promise((resolve, reject) => {
                snapshot.forEach(item => {
                    self.state.psd2Requests.push(item);
                });
                resolve();
            });
            // Get the ethereum requests.
            const ethereumRequestCount = await fidelityPoints.methods.getRequestsCount().call();
            const ethereumRequests = await Promise.all(
                Array(parseInt(ethereumRequestCount))
                .fill()
                .map((element, index) => {
                    return fidelityPoints.methods.ethereumPaymentRequests(index).call();
                })
            );
            self.setState({ ethereumRequestCount, ethereumRequests, loadingRenderFirst: false });
            return promise;
        })
        .catch(err => {
            // Show nothing if there is an error
            self.setState({ loadingRenderFirst: true });
        });
    }

    renderRowsEthereumShop() {
        var shopId = firebase.auth().currentUser.uid;
        return this.state.ethereumRequests.map((request, index) => {
            if(request.shopId == shopId){
                return <EthereumRequestRowShop
                    key={index}
                    request={request}
                />
            }
        })
    }

    renderRowsPsd2Shop() {
        var shopId = firebase.auth().currentUser.uid;
        return this.state.psd2Requests.map((request, index) => {
            if(request.val().shop == shopId){
                return <Psd2RequestRowShop
                    key={index}
                    request={request.val()}
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
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Method</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Note</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body />
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan="4" />
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
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Method</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Note</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.renderRowsEthereumShop()}
                    {this.renderRowsPsd2Shop()}
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
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

export default ShopRequestStatusTable;