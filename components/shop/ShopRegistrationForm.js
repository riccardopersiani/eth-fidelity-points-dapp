import React, { Component } from "react";
import { Form, Input, Button, Message, Select, Checkbox } from "semantic-ui-react";
import { Router } from "../../routes";
import * as firebase from "firebase";
import { countryOptions, options } from "../../others/common";

class ShopRegistrationForm extends Component {
  state = {
    shopName: "",
    ownerFirstName: "",
    country: "",
    gender: "",
    phone: "",
    email: "",
    city: "",
    shopAddress: "",
    zipCode: "",
    ethereum: "",
    username: "",
    password: "",
    confirmPassword: "",
    bankId: "",
    accountId: "",
    ownerLastName: "",
    errorMessage: "",
    approved: false,
  };

  // Functions for handling changes in dropdown fields
  handleChangeCountry = (e, { value }) => this.setState({ country: value });
  handleChangeGender = (e, { value }) => this.setState({ gender: value });

  // Form validation
  validate = () => {
    let isError = false;
    if (this.state.username.length < 5) {
      isError = true;
      this.setState({ errorMessage: "Username is too short." });
    }
    else if (this.state.zipCode.length != 5 || this.state.zipCode.match('e')) {
      isError = true;
      this.setState({ errorMessage: "Zip code must be 5 number long." });
    }
    else if (this.state.password != this.state.confirmPassword) {
      isError = true;
      this.setState({ errorMessage: "Password is different from Confirm Password." });
    }
    else if(!/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/i.test(this.state.email)) {
      isError = true;
      this.setState({ errorMessage: "Remove special characters from Email field."})
    }
    else if(this.state.password.length < 6) {
      isError = true;
      this.setState({ errorMessage: "Password length must be greater that 6."})
    }
    else if(!/^(0x)?[0-9a-fA-F]{40}$/i.test(this.state.ethereum)) {
      isError = true;
      this.setState({ errorMessage: "Ethereum address inserted is not hexadecimal or 40 byte long. Letters must be all small caps or all all caps."})
    }
    return isError;
  };

  // Submit the shop request
  onSubmit = async event => {
    event.preventDefault();
    var self = this;
    // Perform the form validation
    const err = this.validate();
    if (!err) {
      // Create a new shop with username and password and log in instantly
      console.log("Create a new SHOP with email and password");
      firebase.auth().createUserWithEmailAndPassword(self.state.email, self.state.password)
        .then(response => console.log("response in then: ", response))
        .catch(e => console.log("Shop Creaton failed:", e.message)) //TODO
        .finally(() => {
          var shop = firebase.auth().currentUser;
          console.log("SHOP: ",shop);
          // Send email verification to the shop after registering him with emailVerified = false.
          shop.sendEmailVerification()
            .then(function() {
              firebase.app().database().ref("shops/" + shop.uid)
                .set({
                  shopName: self.state.shopName,
                  ownerFirstName: self.state.ownerFirstName,
                  ownerLastName: self.state.ownerLastName,
                  gender: self.state.gender,
                  country: self.state.country,
                  city: self.state.city,
                  phone: self.state.phone,
                  email: self.state.email,
                  zipcode: self.state.zipCode,
                  shopAddress: self.state.shopAddress,
                  bankId: self.state.bankId,
                  accountId: self.state.accountId,
                  ethereum: self.state.ethereum,
                  username: self.state.username,
                  approved: false,
                })
                .then(() => {
                  alert("Email Verification for Shop Sent!");
                  // Redirect to home
                  window.location.replace("http://localhost:3000/index");
                })
                .catch(error => {
                  self.setState({ errorMessage: error.message });
                });
            })
            .catch(function(error) {
              alert("Error in sending email verification");
              self.setState({ errorMessage: error.message });
            });
        });
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Shop name"
            placeholder="Shop name"
            onChange={event => this.setState({ shopName: event.target.value })}
            value={this.state.shopName}
            required
          />
          <Form.Field
            control={Input}
            label="Owner first name"
            placeholder="Owner first name"
            onChange={event => this.setState({ ownerFirstName: event.target.value })}
            value={this.state.ownerFirstName}
            required
          />
          <Form.Field
            control={Input}
            label="Owner last name"
            placeholder="Owner last name"
            onChange={event => this.setState({ ownerLastName: event.target.value })}
            value={this.state.ownerLastName}
            required
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Field
            control={Select}
            label="Country"
            options={countryOptions}
            placeholder="Country"
            onChange={this.handleChangeCountry}
            value={this.state.country}
            required
          />
          <Form.Field
            control={Select}
            label="Gender"
            options={options}
            placeholder="Gender"
            onChange={this.handleChangeGender}
            value={this.state.gender}
            required
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Phone"
            placeholder="Phone"
            type="number"
            onChange={event => this.setState({ phone: event.target.value })}
            value={this.state.phone}
            required
          />
          <Form.Field
            control={Input}
            label="Email"
            placeholder="Email"
            onChange={event => this.setState({ email: event.target.value })}
            value={this.state.email}
            required
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="City"
            placeholder="City"
            onChange={event => this.setState({ city: event.target.value })}
            value={this.state.city}
            required
          />
          <Form.Field
            control={Input}
            label="Zip Code"
            placeholder="Zip Code"
            type="number"
            onChange={event => this.setState({ zipCode: event.target.value })}
            value={this.state.zipCode}
            required
          />
          <Form.Field
            control={Input}
            label="Shop address"
            placeholder="Shop address"
            onChange={event => this.setState({ shopAddress: event.target.value })}
            value={this.state.shopAddress}
            required
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            label="Username"
            placeholder="Username"
            onChange={event => this.setState({ username: event.target.value })}
            value={this.state.username}
            required
          />
          <Form.Field
            control={Input}
            label="Password"
            placeholder="Password"
            onChange={event => this.setState({ password: event.target.value })}
            value={this.state.password}
            type="password"
            required
          />
          <Form.Field
            control={Input}
            label="Confirm Password"
            placeholder="Confirm Password"
            onChange={event => this.setState({ confirmPassword: event.target.value })}
            value={this.state.confirmPassword}
            type="password"
            required
          />
        </Form.Group>

        <Form.Field
          control={Input}
          label="Ethereum Account"
          placeholder="Ethereum Account"
          onChange={event => this.setState({ ethereum: event.target.value })}
          value={this.state.ethereum}
          required
        />
        psd201-bank-y--uk
        <Form.Field
          control={Input}
          label="Bank Id"
          placeholder="Bank Id"
          onChange={event => this.setState({ bankId: event.target.value })}
          value={this.state.bankId}
          required
        />
        45355323453
        <Form.Field
          control={Input}
          label="Account Id"
          placeholder="Account Id"
          onChange={event => this.setState({ accountId: event.target.value })}
          value={this.state.accountId}
          type="number"
          required
        />

        <Form.Field
          control={Checkbox}
          label="I agree to the Terms and Conditions"
        />
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Form.Field control={Button}>Submit</Form.Field>
      </Form>
    );
  }
}

export default ShopRegistrationForm;