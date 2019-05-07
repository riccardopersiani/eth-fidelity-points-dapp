import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import HeaderTop from "./Header";
import Footer from "./Footer";

class Layout extends Component {
  render() {
    return (
      <div>
        <HeaderTop />
        <Container text style={{ marginTop: "7em" }}>
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}
export default Layout;
