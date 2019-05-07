import React, { Component } from "react";
import * as firebase from "firebase";
import { Table, Icon } from "semantic-ui-react";

class ProfileTableShop extends Component {
  state = {
    shopName: '',
    shopAddress: '',
    ownerFirstName: '',
    ownerLastName: '',
    phone: '',
    city: '',
    country: '',
    zipcode: '',
    gender: '',
    username: '',
    email: '',
    ethereum: '',
    bankId: '',
    accountId: '',
    approved: true
  };

  async componentDidMount() {
    var self = this;
    // Check when the shop logs in.
    firebase.auth().onAuthStateChanged(function(shop) {
      if (shop) {
        // Getting shop info from the db
        const ref = firebase.database().ref("shops/" + shop.uid);
        ref.once("value").then(function(snapshot) {
          const shopName = snapshot.child("shopName").val();
          const shopAddress = snapshot.child("shopAddress").val();
          const ownerFirstName = snapshot.child("ownerFirstName").val();
          const ownerLastName = snapshot.child("ownerLastName").val();
          const city = snapshot.child("city").val();
          const country = snapshot.child("country").val();
          const zipcode = snapshot.child("zipcode").val();
          const phone = snapshot.child("phone").val();
          const gender = snapshot.child("gender").val();
          const email = snapshot.child("email").val();
          const ethereum = snapshot.child("ethereum").val();
          const username = snapshot.child("username").val();
          const bankId = snapshot.child("bankId").val();
          const accountId = snapshot.child("accountId").val();
          const approved = snapshot.child("approved").val();
          // Saving in state vars the fetched data
          self.setState({
            username,
            ethereum,
            shopName,
            ownerFirstName,
            ownerLastName,
            gender,
            phone,
            country,
            city,
            email,
            zipcode,
            shopAddress,
            bankId,
            accountId,
            approved
          });
        });
      }
    });
  }

  render() {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Shop Profile Recap</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
            <Table.Cell>{this.state.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Shop Name</Table.Cell>
            <Table.Cell>{this.state.shopName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Owner First Name</Table.Cell>
            <Table.Cell>{this.state.ownerFirstName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Owner Last Name</Table.Cell>
            <Table.Cell>{this.state.ownerLastName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Ethereum Account</Table.Cell>
            <Table.Cell>{this.state.ethereum}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Shop Address</Table.Cell>
            <Table.Cell>{this.state.shopAddress}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Phone</Table.Cell>
            <Table.Cell>{this.state.phone}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>{this.state.email}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>City</Table.Cell>
            <Table.Cell>{this.state.city}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Country</Table.Cell>
            <Table.Cell>{this.state.country}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Bank Id</Table.Cell>
            <Table.Cell>{this.state.bankId}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Account Id</Table.Cell>
            <Table.Cell>{this.state.accountId}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Gender</Table.Cell>
            <Table.Cell>{this.state.gender}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Zipcode</Table.Cell>
            <Table.Cell>{this.state.zipcode}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Approved</Table.Cell>
            <Table.Cell>{this.state.approved.toString()}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default ProfileTableShop;