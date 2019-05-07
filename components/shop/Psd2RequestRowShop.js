import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';


class Psd2RequestRowShop extends Component {
    render() {
        const { Cell, Row } = Table;
        const { request } = this.props;
        return (
            <Row negative={!!request.rejected} positive={!!request.completed}>
                <Cell>{request.tokenAmount} FID</Cell>
                <Cell>Euro</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.note}</Cell>
            </Row>
        );
    }
}

export default Psd2RequestRowShop;