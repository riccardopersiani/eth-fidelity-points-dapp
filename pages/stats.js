import React, { Component } from 'react';
import { Statistic, Card, Header, Container } from 'semantic-ui-react';
import Layout from "../components/template/Layout";
import { Link, Router } from '../routes';
import fidelityPoints from '../ethereum/fido';


class Statistics extends Component {
    static async getInitialProps(props) {
        const summary = await fidelityPoints.methods.getSummary().call();
        const address = await fidelityPoints.options.address;
        return {
            address: address,
            _totalSupply: summary[0],
            owner: summary[1],
            symbol: summary[2],
            name: summary[3],
            decimals: summary[4],
            rate: summary[5]
        };
    }

    render () {
        const {
            owner,
            symbol,
            name,
            decimals,
            rate,
            _totalSupply,
            buyPrice,
            sellPrice,
            address
        } = this.props;

        return(
            <Layout>
                <Header as='h1'>General informations</Header>
                <br/>
                <Card.Group centered>
                    <Card fluid color='green' header={name} meta="Token name"/>
                    <Card fluid color='green' header={symbol} meta="Token symbol"/>
                    <Card fluid color='red' header={owner} meta="Contract owner address"/>
                    <Card fluid color='red' header={address} meta="Contract address"/>
                    <Card fluid color='blue' header={`${_totalSupply} token units`} meta="Total supply"/>
                    <Card fluid color='blue' header={rate} meta="Rate"/>
                </Card.Group>
                <br />
            </Layout>
        );
    }
}

export default Statistics;