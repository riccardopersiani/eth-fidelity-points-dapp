import React, { Component } from 'react';
import { Button, Form, Input, Message, Header } from 'semantic-ui-react';
import Layout from '../components/template/Layout';
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
                <Header as='h1'>Home</Header>
                <br />
                <p>Welcome to the Fido Coin main page.</p>
                <p>Fido Coin(FIDO) is an Ethereum token developed following the standard ERC20,
                    it lives in the Ethereum echosystem and its movements are recorded in the Ethereum blockchain.</p>
                <p>The user can collect Fido Coin to exchange them with services released by the operator.</p>
                <p>The user can also collect Fido Coin to exchange them with fabulous prizes in our top quality shops.</p>
                <p>The user can trasfer this tokens to others in the "transfer" section.</p>
                <p>The user can exchange tokens with prizes in the "shop" section.</p>
                <p>The informations about this token management are completely open and transparent.</p>
                <p>The user can see some info in the "statistics" section.</p>
                <p>The user can check the complete set of information about this token in Etherscan.</p>
                <p>The user can check also the full contract code in Etherscan searching the contract address.</p>
                <p>The token generation section is reserved to the contract manager, a normal user is not allowed and cannot use the functions contained in it.</p>
                <p><b>Remember!</b> You need MetaMask Chrome extention installed to perform operation on this website.</p>
                <p><b>Remember!</b> Operations with FIDO token can only be done thorugh the main contract.</p>
                <br />
            </Layout>
        );
    }
}

export default BlockchainPayementIndex;