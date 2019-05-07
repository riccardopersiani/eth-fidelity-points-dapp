import React, { Component } from "react";
import Layout from "../../components/template/Layout";
import ProfileTable from "../../components/shop/ProfileTableShop";

class ProfileShopPage extends Component {
  state = {};

  render() {
    return (
      <Layout>
        <h1>Profile page shop</h1>
        <br />
        <p>Welcome to your Shop Profile Page.</p>
        <p>Here you can check the informations about the shop in our database.</p>
        <ProfileTable />
      </Layout>
    );
  }
}

export default ProfileShopPage;
