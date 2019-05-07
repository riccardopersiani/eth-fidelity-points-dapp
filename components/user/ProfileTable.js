import React, { Component } from "react";
import * as firebase from "firebase";
import { Table, Icon } from "semantic-ui-react";

class ProfileTable extends Component {
  state = {
    firstname: '',
    lastname: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    gender: '',
    username: '',
    email: '',
    ethereum: ''
  };

  componentDidMount() {
    var self = this;
    firebase.auth().onAuthStateChanged(function(user) {
      // User is signed in.
      if (user) {
        // If data are not take, take it
        if (!self.state.ethereum) {
          var userId = firebase.auth().currentUser.uid;
          var ref = firebase.database().ref("users/" + userId);
          ref.once("value").then(function(snapshot) {
            var firstname = snapshot.child("firstname").val();
            var lastname = snapshot.child("lastname").val();
            var address = snapshot.child("address").val();
            var city = snapshot.child("city").val();
            var country = snapshot.child("country").val();
            var zipcode = snapshot.child("zipcode").val();
            var gender = snapshot.child("gender").val();
            var email = snapshot.child("email").val();
            var ethereum = snapshot.child("ethereum").val();
            var username = snapshot.child("username").val();
            self.setState({
              firstname,
              lastname,
              address,
              city,
              country,
              zipcode,
              gender,
              email,
              ethereum,
              username
            });
          });
        }
      }
    });
  }

  render() {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Profile Recap</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
            <Table.Cell>{this.state.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Firstname</Table.Cell>
            <Table.Cell>{this.state.firstname}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lastname</Table.Cell>
            <Table.Cell>{this.state.lastname}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>{this.state.email}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Ethereum Account</Table.Cell>
            <Table.Cell>{this.state.ethereum}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Address</Table.Cell>
            <Table.Cell>{this.state.address}</Table.Cell>
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
            <Table.Cell>Zip Code</Table.Cell>
            <Table.Cell>{this.state.zipcode}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Gender</Table.Cell>
            <Table.Cell>{this.state.gender}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default ProfileTable;