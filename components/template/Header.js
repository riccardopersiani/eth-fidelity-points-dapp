import { Container, Dropdown, Header, Menu } from "semantic-ui-react"
import React, { Component } from "react"
import * as firebase from "firebase"
import Favicon from "react-favicon"
import { Link } from "../../routes"
import Head from "next/head"


// Logout if button logout is pressed in the dropdown menu
function onClickLogout() {
  event.preventDefault()
  // Call firebase for sign out
  firebase.auth().signOut()
    .then(
      window.location.replace("http://localhost:3000/index")
    )
}

function onClickRedirectProfile() {
  window.location.replace("http://localhost:3000/auth/profile")
}

function onClickRedirectProfileShop() {
  window.location.replace("http://localhost:3000/auth/profileShop")
}

function onClickRedirectUserSignup() {
  window.location.replace("http://localhost:3000/auth/signUpUser")
}

function onClickShopRegistration() {
  window.location.replace("http://localhost:3000/auth/signUpShop")
}

// User logged Header
function UserLogged() {
  return (
    <Menu.Menu position="right">
      <Menu.Item key="b" name="transfer">
        <Link route="/transfer">
          <a>Transfer</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="c" name="shop">
        <Link route="/shop">
          <a>Shop</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="d" name="orderStatus">
        <Link route="/userOrderStatus">
          <a>Order Status</a>
        </Link>
      </Menu.Item>
      <Dropdown item text="Welcome User">
        <Dropdown.Menu>
          <Dropdown.Header>
            <a>Options</a>
          </Dropdown.Header>
          <Dropdown.Item onClick={onClickRedirectProfile}>
            Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={onClickLogout}>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  )
}

// Shop logged Header
function ShopLogged() {
  return (
    <Menu.Menu position="right">
      <Menu.Item key="z" name="transfer">
        <Link route="/transfer">
          <a>Transfer</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="s" name="askPayment">
        <Link route="/askPayment">
          <a>Ask Payment</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="t" name="requestStatus">
        <Link route="/shopRequestStatus">
          <a>Request Status</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="u" name="shipOrder">
        <Link route="/shopShipOrder">
          <a>Complete Order</a>
        </Link>
      </Menu.Item>
      <Dropdown item text="Welcome Shop">
        <Dropdown.Menu>
          <Dropdown.Header>
            <a>Options</a>
          </Dropdown.Header>
          <Dropdown.Item onClick={onClickRedirectProfileShop}>
            Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={onClickLogout}>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  )
}

// No login Header
function NoLogged() {
  return (
    <Menu.Menu position="right">
      <Menu.Item name="signIn">
        <Link route="/auth/signIn">
          <a>Sign In</a>
        </Link>
      </Menu.Item>
      <Dropdown text="Sign Up" item>
        <Dropdown.Menu>
          <Dropdown.Header>
            <a>Options</a>
          </Dropdown.Header>
          <Dropdown.Item onClick={onClickRedirectUserSignup}>
            User Sign Up
          </Dropdown.Item>
          <Dropdown.Item onClick={onClickShopRegistration}>
            Shop Registration Request
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  )
}

// Admin Header
function AdminLogged() {
  var user = firebase.auth().currentUser
  return (
    <Menu.Menu position="right">
      <Menu.Item name="createTokens">
        <Link route="/createTokens">
          <a>Token Generation</a>
        </Link>
      </Menu.Item>
      <Menu.Item name="transfer">
        <Link route="/transfer">
          <a>Transfer</a>
        </Link>
      </Menu.Item>
      <Menu.Item name="approveShop">
        <Link route="/approve/approveShop">
          <a>Approve Shops</a>
        </Link>
      </Menu.Item>
      <Menu.Item name="approvePayment">
        <Link route="/approve/approvePayment">
          <a>Approve Payments</a>
        </Link>
      </Menu.Item>
      <Menu.Item name="shipOrder">
        <Link route="/adminShipOrder">
          <a>Complete Order</a>
        </Link>
      </Menu.Item>
      <Dropdown item text="Welcome Admin">
        <Dropdown.Menu>
          <Dropdown.Header>
            <a>Signed in as {user.email}</a>
          </Dropdown.Header>
          <Dropdown.Item onClick={onClickRedirectProfile}>
            Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={onClickLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  )
}

class HeaderTop extends Component {
  // Initial state is that none is logged in
  state = {
    isAdminLoggedIn: false,
    isUserLoggedIn: false,
    isShopLoggedIn: false,
    isNoneLoggedIn: true,
  }
  // Checks if the authentication state changes
  componentDidMount() {
    firebase.auth()
      .onAuthStateChanged(user => {
        // If user exists someone is logged in.
        if (user) {
          // Check if it is an ADMIN.
          if (user.email == "r.persiani92@gmail.com") {
            console.log("Admin logged in")
            this.setState({
              isAdminLoggedIn: true,
              isUserLoggedIn: false,
              isShopLoggedIn: false,
              isNoneLoggedIn: false
            })
          }
          else {
            // Checks if the user email is present in the shop section of the DB
            firebase.app().database().ref("shops").orderByChild("email").equalTo(user.email).once("value", snapshot => {
                const userData = snapshot.val()
                // Check if it is a SHOP.
                if (userData) {
                  console.log("Shop logged in")
                  this.setState({
                    isAdminLoggedIn: false,
                    isUserLoggedIn: false,
                    isShopLoggedIn: true,
                    isNoneLoggedIn: false
                  })
                // Check if it is a USER
                } else {
                  console.log("User logged in")
                  this.setState({
                    isAdminLoggedIn: false,
                    isUserLoggedIn: true,
                    isShopLoggedIn: false,
                    isNoneLoggedIn: false
                  })
                }
            })
          }
        // The variable user==null, so NONE is logged in
        } else {
          console.log("None logged in")
          this.setState({
            isAdminLoggedIn: false,
            isUserLoggedIn: false,
            isShopLoggedIn: false,
            isNoneLoggedIn: true
          })
        }
      })
  }

  render() {
    // Firebase configuration
    var config = {
      apiKey: "AIzaSyB7-H-6t5kb5D8XB9jf33SVkpjgmeJqATg",
      authDomain: "test-3ff4d.firebaseapp.com",
      databaseURL: "https://test-3ff4d.firebaseio.com",
      projectId: "test-3ff4d",
      storageBucket: "test-3ff4d.appspot.com",
      messagingSenderId: "1059441748413"
    }
    // If Firebase is not initialized, do it
    if (!firebase.apps.length)
      firebase.initializeApp(config)
    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
          />
        </Head>
        <div>
          <Favicon url="https://cdn.iconscout.com/public/images/icon/premium/png-512/ethereum-e-payment-money-payment-system-finance-business-ecommerce-37130f673fd3b537-512x512.png" />
          <h1>Hello, Favicon!</h1>
        </div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              Fidelity Points
            </Menu.Item>
            <Menu.Item name="home">
              <Link route="/index">
                <a>Home</a>
              </Link>
            </Menu.Item>
            <Menu.Item name="stats">
              <Link route="/stats">
                <a>Statistics</a>
              </Link>
            </Menu.Item>
            {this.state.isAdminLoggedIn ? <AdminLogged /> : <div></div> }
            {this.state.isUserLoggedIn ? <UserLogged/> : <div></div>  }
            {this.state.isShopLoggedIn ? <ShopLogged/> : <div></div>  }
            {this.state.isNoneLoggedIn ? <NoLogged /> : <div></div> }
          </Container>
        </Menu>
      </div>
    )
  }
}

export default HeaderTop
