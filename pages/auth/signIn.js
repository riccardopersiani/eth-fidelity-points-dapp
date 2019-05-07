import React, { Component } from "react";
import Layout from "../../components/template/Layout";
import LoginForm from "../../components/auth/LoginForm";

class LoginPage extends Component {
  state = {};

  render() {
    return (
      <Layout>
        <h1>Login page</h1>
        <br />
        <p>Welcome to the Login Page.</p>
        <p>Here you can login to your personal account.</p>
        <br />
        <LoginForm />
      </Layout>
    );
  }
}

export default LoginPage;
