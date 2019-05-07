import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Layout from '../components/template/Layout';
import CreateTokensForm from '../components/admin/CreateTokensForm';
import { Link, Router } from '../routes';
import fidelityPoints from '../ethereum/fido';


class CreateTokensNew extends Component {
    static async getInitialProps(props) {
        const summary = await fidelityPoints.methods.getSummary().call();
        return {
            owner: summary[1],
            rate: summary[5]
        };
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Generate Tokens from Ether</Header>
                <br/>
                <p>This function usage is <b>restricted to the manager</b> or deployer.</p>
                <p>The owner is related to this address: {this.props.owner}</p>
                <br/>
                <br/>
                <CreateTokensForm rate={this.props.rate}/>
                <br/>
                <br/>
                <p>The manager of the contract is initlially provided with an initial supply of tokens.</p>
                <p>Later the manager can decide to create other tokens.</p>
                <p>In this contract the price is set to 1 ETH = {this.props.rate} FIDO.</p>
            </Layout>
        );
    }
}

export default CreateTokensNew;