import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import Layout from "../../components/template/Layout";
import AdminApprovePaymentForm from "../../components/admin/AdminApprovePaymentForm";
import { Link, Router } from "../../routes";

class ApprovePaymentPage extends Component {
    render() {
        return (
            <Layout>
                <Header as="h1">Approve Payment page</Header>
                <br/>
                <p>
                    Hello admin, here you can approve the shop request to be payed for the
                    produc delivers.
                </p>
                <br />
                <AdminApprovePaymentForm />
            </Layout>
        );
    }
}

export default ApprovePaymentPage;
