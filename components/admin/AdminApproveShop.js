import React, { Component } from "react";
import * as firebase from "firebase";
import { Button, Table } from "semantic-ui-react";
import fidelityPoints from '../../ethereum/fido';
import web3 from '../../ethereum/web3';

class AdminApproveShop extends Component {
  state = {
    shopList: [],
    loadingRenderFirst: true,
    errMsg: '',
    loading: false
  };

  // Take the ethereum address approved and push the value into the shop approved in the blockchain
  onSubmit = async event => {
    event.preventDefault();
    event.persist();
    const shopEthereumAddress = event.target.value;
    const shopId = event.target.id;
    this.setState({ loading: true });
    // Get accounts.
    const accounts = await web3.eth.getAccounts();
    // Add the shop the official shop array in the contract.
    await fidelityPoints.methods.addShop(shopEthereumAddress)
    .send({
      from: accounts[0],
      gas: '4500000'
    }).then(() => {
      // Edit file in firebase and than in table.
      firebase.app().database().ref("shops").child(shopId).update({ approved: true });
    }).catch((err) => {
      // If the operation fauls set the status to "approved = false".
      firebase.app().database().ref("shops").child(shopId).update({ approved: false });
      var trimmedString = err.message.substring(0, 90);
      this.setState({ errMsg: trimmedString });
    });
    this.setState({ loading: false });
    window.location.reload();
  }

  // Load all shops from the db.
  async loadData() {
    var self = this;
    const shopsRef = firebase.app().database().ref("shops").orderByChild("approved");
    var promise = new Promise((resolve, reject) => {
      shopsRef.once("value").then(function(snapshot) {
        resolve(snapshot);
      });
    });
    return promise;
  }

  // Getting list of approved and not approved shop when component is mounting
  async componentDidMount() {
    var self = this;
    this.loadData()
      .then((snapshot) => {
        var promise = new Promise((resolve, reject) => {
          snapshot.forEach((item) => {
            self.state.shopList.push(item);
          });
          resolve();
        });
        self.setState({ loadingRenderFirst: false });
        return promise;
      });
  }

  render() {
    // Phase 1 of rendering, data not fetched from the db.
    if (this.state.loadingRenderFirst== true) {
      return (
        <Table celled compact definition size="small">
          <Table.Header fullWidth>
            <Table.Row key={"header"}>
              <Table.HeaderCell />
              <Table.HeaderCell>Shop Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Ethereum Address</Table.HeaderCell>
              <Table.HeaderCell>Approved</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body/>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan="4" />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      );
    }
    // Phase 2 of rendering, data fetched from the db.
    if (this.state.loadingRenderFirst == false) {
    return (
      <Table celled compact definition size="small">
        <Table.Header fullWidth>
          <Table.Row key={"header"}>
            <Table.HeaderCell />
            <Table.HeaderCell>Shop Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Shop Address</Table.HeaderCell>
            <Table.HeaderCell>Ethereum Address</Table.HeaderCell>
            <Table.HeaderCell>Approved</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            this.state.shopList.map((item, index) => {
              var shop = item.val();
              return (
                  <Table.Row key={item.key} disabled={!!shop.approved} positive={shop.approved} negative={!shop.approved}>
                    <Table.Cell collapsing>
                      <Button  disabled={!!shop.approved || this.state.loading} loading={this.state.loading} onClick={this.onSubmit} id={item.key} value={shop.ethereum} size="small">Approve</Button>
                    </Table.Cell>
                    <Table.Cell collapsing>{shop.shopName}</Table.Cell>
                    <Table.Cell collapsing>{shop.email}</Table.Cell>
                    <Table.Cell collapsing>{shop.shopAddress}, {shop.city}, {shop.country}</Table.Cell>
                    <Table.Cell collapsing>{shop.ethereum}</Table.Cell>
                    <Table.Cell collapsing>{shop.approved.toString()}</Table.Cell>
                  </Table.Row>
              );
            })
          }
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4" />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Footer>
      </Table>
      );
    }
  }
}
export default AdminApproveShop;