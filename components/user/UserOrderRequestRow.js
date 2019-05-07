import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class UserOrderRequestRow extends Component {
    render() {
        const { Cell, Row } = Table;
        const { request } = this.props;
        return (
            <Row negative={!!request.rejected} positive={!!request.shipped}>
                <Cell>{request.product}</Cell>
                <Cell>{request.shopEmail}</Cell>
                <Cell>{request.shop}</Cell>
                <Cell>{request.value} FID</Cell>
                <Cell>{request.shipped.toString()}</Cell>
                <Cell>{request.rejected.toString()}</Cell>
            </Row>
        );
    }
}

export default UserOrderRequestRow;