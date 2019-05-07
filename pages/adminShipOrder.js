import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import Layout from "../components/template/Layout";
import AdminShipOrderForm from "../components/shop/ShopShipOrderForm";
import { Link, Router } from "../routes";

class AdminShipOrderPage extends Component {
    render() {
        return (
            <Layout>
                <Header as="h1">Complete Order page</Header>
                <br/>
                <p>
                    Hello admin, here you can mark as shipped the product request by a user with an order.
                </p>
                <br />
                <AdminShipOrderForm />
            </Layout>
        );
    }
}

export default AdminShipOrderPage;
