import React, { Component } from 'react';
import { Button, Image, Header, Card } from 'semantic-ui-react';
import Layout from '../../components/template/Layout';
import fidelityPoints from '../../ethereum/fido';
import { Link } from '../../routes';
import BuyProductForm from '../../components/user/BuyProductForm';

class ProductIndex extends Component {
    static async getInitialProps(props) {
        const summary = await fidelityPoints.methods.getSummary().call();
        return {
            owner: summary[1],
        };
    }

    state = {
        receiver: this.props.owner,
        email: "r.persiani92@gmail.com"
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Operator Shop page</Header>
                <br/>
                <p>Here you can select your favorite shop.</p>
                <br/>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg'/>
                            <Card.Header>
                                Smartpthone
                            </Card.Header>
                            <Card.Meta>
                                Last model
                            </Card.Meta>
                            <Card.Description>
                                1000 FIDO
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <BuyProductForm shopEmail={this.state.email} product="smartphone1" receiver={this.state.receiver} tokens="1000"/>
                        </Card.Content>
                    </Card>
                </Card.Group>
                <br/>
            </Layout>
        );
    }
}

export default ProductIndex;