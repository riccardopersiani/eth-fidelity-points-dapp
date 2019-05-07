import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import fidelityPoints from "../../ethereum/fido";

class EthereumRequestRow extends Component {
    state = {
        loading: false,
    };

    onReject = async event => {
        event.preventDefault();
        this.setState({ loading: true });
        // Get accounts.
        const accounts = await web3.eth.getAccounts();
        // Reject the ether request performed by the shop.
        await fidelityPoints.methods.rejectRequestEthereum(this.props.id).send({
            from: accounts[0],
            gas: '4500000'
        }).catch(() => {
            this.setState({ loading: false })
        });
        this.setState({ loading: false });
    };

    onFinalize = async event => {
        event.preventDefault();
        event.persist();
        this.setState({ loading: true });
        // Get accounts.
        const accounts = await web3.eth.getAccounts();
        // Transfer ether in the request to the shop.
        await fidelityPoints.methods.finalizeRequestEthereum(this.props.id).send({
            from: accounts[0],
            value: event.target.value
        }).catch(() => {
            this.setState({ loading: false })
        });
        this.setState({ loading: false });

    };

    render() {
        const { Cell, Row } = Table;
        const { id, request } = this.props;
        return (
            <Row disabled={!!request.completed || !!request.rejected } positive={!!request.completed} negative={!!request.rejected}>
                <Cell>
                    {(request.completed || request.rejected) ? null : (
                        <Button disabled={this.state.loading} loading={this.state.loading} color="red" basic onClick={this.onReject}>
                            Reject
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {(request.completed || request.rejected) ? null : (
                        <Button disabled={this.state.loading}
                                loading={this.state.loading} color="teal" basic value={request.value} onClick={this.onFinalize}>
                            Finalize
                        </Button>
                    )}
                </Cell>
                <Cell>{request.value} FID</Cell>
                <Cell>Ethereum</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default EthereumRequestRow;