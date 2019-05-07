import React, { Component } from 'react';
import { Button, Image, Header, Card } from 'semantic-ui-react';
import Layout from '../../components/template/Layout';
import fidelityPoints from '../../ethereum/fido';
import { Link } from '../../routes';
import BuyProductForm from '../../components/user/BuyProductForm';

class ProductIndex extends Component {

    state = {
        receiver: '0x36C6BbF42E54a693320E725D46E4363Be6A9e338',
        email: 'shop@shop.com'
    }

    render() {
        return(
            <Layout>
                <Header as='h1'>Tech Shop page</Header>
                <br/>
                <p>Here you can select your favorite shop.</p>
                <br/>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' />
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
                            <BuyProductForm shopEmail={this.state.email} product="smartphone2" receiver={this.state.receiver} tokens="1000"/>
                        </Card.Content>
                    </Card>

                </Card.Group>
                <br/>
            </Layout>
        );
    }
}

export default ProductIndex;
