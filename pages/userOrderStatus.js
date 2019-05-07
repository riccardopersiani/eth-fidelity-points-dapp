import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import Layout from "../components/template/Layout";
import UserOrderStatusTable from "../components/user/UserOrderStatusTable";
import { Link, Router } from "../routes";

class UserOrderStatusPage extends Component {
    render() {
        return (
            <Layout>
                <Header as='h1'>Order Status page</Header>
                <br/>
                <p>Hello user, here you can check your pending and shipped orders.</p>
                <UserOrderStatusTable />
            </Layout>
        );
    }
}

export default UserOrderStatusPage;