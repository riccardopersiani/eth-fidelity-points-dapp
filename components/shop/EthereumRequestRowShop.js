import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class EthereumRequestRowShop extends Component {
    render() {
        const { Cell, Row } = Table;
        const { request } = this.props;
        return (
            <Row negative={!!request.rejected} positive={!!request.completed}>
                <Cell>{request.value} FID</Cell>
                <Cell>Ethereum</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default EthereumRequestRowShop;