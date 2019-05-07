import React, { Component } from 'react';
import { Header, Card } from 'semantic-ui-react';
import Layout from "../components/template/Layout";
import fidelityPoints from '../ethereum/fido';
import { Link } from '../routes';


class ShopIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const summary = await fidelityPoints.methods.getSummary().call();
        const owner = summary[1];
        // fetch list of campaigns
        const shopsCount = await fidelityPoints.methods.getShopsCount().call();
        // inside I have the list of all different indexes of campaign, try it in terminal
        const shops = await Promise.all(
            Array(parseInt(shopsCount))
            .fill()
            .map((element, index) => {
                return fidelityPoints.methods.shops(index).call();
            })
        );
        // return the object
        return { address, shops, shopsCount, owner };
    }

    renderShops(){
        const { shops, address, owner } = this.props;

        const items = [
            {
                header:  "Main Shop",
                meta: shops[0],
                description: (
					<Link route={`/shops/${shops[0]}`}>
						<a>Enter shop</a>
					</Link>
				),
                style: {overflowWrap: 'break-word'}
            },
            {
                header: "Technology Shop",
                meta: shops[2],
                description: (
					<Link route={`/shops/${shops[2]}`}>
						<a>Enter shop</a>
					</Link>
				),
                style: {overflowWrap: 'break-word'}
            },
            {
                header: "Under Contruction...",
                meta: shops[1],
                description: (
					{/*<Link route={`/shops/${shops[1]}`}>
						<a>Enter shop</a>
                </Link>*/}
				),
                style: {overflowWrap: 'break-word'}
            }
        ]
        return <Card.Group items={items} />
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Welcome to Fido Coin shopping page</Header>
                <br/>
                <p>Here you can select your favorite shop.</p>
                <br/>
                {this.renderShops()}
                <br/>
            </Layout>
        );
    }
}

export default ShopIndex;