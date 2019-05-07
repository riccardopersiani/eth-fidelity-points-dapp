import React, { Component } from 'react';
import { } from "semantic-ui-react";
import Layout from "../../components/template/Layout";
import UserRegistrationForm from "../../components/user/UserRegistrationForm";

class SignUpUserPage extends Component {
  render() {
    return(
      <Layout>
        <h1>Sign Up for User</h1>
        <br />
        <p>Welcome to the User Registration Page</p>
        <br />
        <UserRegistrationForm/>
      </Layout>
    );
  }
}

export default SignUpUserPage;