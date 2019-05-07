import React, { Component } from 'react';
import { Button, Form, Input, Message, Header } from 'semantic-ui-react';
import Layout from "../components/template/Layout";
import AddNewShopForm from '../components/admin/AddNewShopForm';
import { Link, Router } from '../routes';
import fidelityPoints from '../ethereum/fido';


class CreateTokensNew extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    state = {
        amount: '',
        errorMessage: '',
        loading: false
    };

    render() {
        return(
            <Layout>
                <Header as='h1'>Add new shop</Header>
                <br/>
                <p>This function usage is <b>restricted to the manager</b> or deployer.</p>
                <br/>
                <br/>
                <AddNewShopForm/>
                <br/>
                <br/>
                <p>A text container is used for the main container, which is useful for single column layouts.</p>
            </Layout>
        );
    }
}

export default CreateTokensNew;