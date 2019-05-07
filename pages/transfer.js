import React, { Component } from 'react';
import { Button, Form, Input, Message, Header } from 'semantic-ui-react';
import Layout from "../components/template/Layout";
import TransferTokensForm from '../components/TransferTokensForm';
import { Link, Router } from '../routes';


class BlockchainPayementIndex extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Transfer Tokens</Header>
                <br/>
                <p>Collect fido coin to exchange them with fabulous prizes in our top quality shops.</p>
                <br/>
                <TransferTokensForm />
                <br/>
                <br/>
                <p>You can transfer your tokens to others.</p>
                <p>Insert the amount of token units you want to send.</p>
                <p>Insert the Ethereum address of who you want to send your tokens.</p>
                <p><b>Remeber!</b> This is not the way to get prizes but just to transfer tokens.</p>
                <p>If you want to use tokens for redeeem pizes you need to go in the "shop" section.</p>
                <br />
            </Layout>

        );
    }
}

export default BlockchainPayementIndex;