import React, { Component } from 'react';
import { } from "semantic-ui-react";
import Layout from "../../components/template/Layout";
import ShopRegistrationForm from "../../components/shop/ShopRegistrationForm";

class SignUpShopPage extends Component {
  render() {
    return(
      <Layout>
        <h1>Request for a new Shop</h1>
        <br />
        <p>Welcome to the Shop Registration Page.</p>
        <p>Here you can ask the operator for your shop to be added to the list of official sellers.</p>
        <p>REMEMBER: After completing the form your must wait for the request to be examinated and approved!</p>
        <br />
        <ShopRegistrationForm/>
      </Layout>
    );
  }
}

export default SignUpShopPage;