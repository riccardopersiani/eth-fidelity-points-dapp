// Open Bank Project
// Copyright 2011-2016 TESOBE Ltd
const express = require('express', template = require('pug'))
const session = require('express-session')
const util = require('util')
const  oauth = require('oauth')
const firebase = require('firebase')
const app = express()
const pug = require('pug') // template engine (previously known as Jade)
const config = require('./config.json') // this loads your consumer key and secret from a file you create
const bodyParser = require('body-parser') // used to validate forms
const urlencodedParser = bodyParser.urlencoded({ extended: false }) // create application/x-www-form-urlencoded parser

// Take parameters from config.json file
const _openbankConsumerKey = config.consumerKey
const _openbankConsumerSecret = config.consumerSecret
const _openbankRedirectUrl = config.redirectUrl

// The location, on the interweb, of the OBP API server we want to use
const apiHost = config.apiHost
console.log ("* apiHost is: " + apiHost)

// Oauth Configuration
const consumer = new oauth.OAuth(
  apiHost + '/oauth/initiate',
  apiHost + '/oauth/token',
  _openbankConsumerKey,
  _openbankConsumerSecret,
  '1.0',
  _openbankRedirectUrl,
  'HMAC-SHA1'
)

// Cookie Parser
const cookieParser = require('cookie-parser')
app.use(
  session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
  })
)

// Firebase Configuration
var configFirebase = {
  apiKey: "AIzaSyB7-H-6t5kb5D8XB9jf33SVkpjgmeJqATg",
  authDomain: "test-3ff4d.firebaseapp.com",
  databaseURL: "https://test-3ff4d.firebaseio.com",
  projectId: "test-3ff4d",
  storageBucket: "test-3ff4d.appspot.com",
  messagingSenderId: "1059441748413"
}

// Admin credentials
var accountIdISP = "12456734234"
var bankIdISP = "psd201-bank-x--uk"

// First step of OAuth authentication
app.get('/connect', function(req, res) {
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.status(500).send("Error getting OAuth request token : " + util.inspect(error))
    } else {
      req.session.oauthRequestToken = oauthToken
      req.session.oauthRequestTokenSecret = oauthTokenSecret
      res.redirect(apiHost + "/oauth/authorize?oauth_token="+req.session.oauthRequestToken)
    }
  })
})

// Second step of OAuth authentication.
app.get('/callback', function(req, res) {
  consumer.getOAuthAccessToken(
    req.session.oauthRequestToken,
    req.session.oauthRequestTokenSecret,
    req.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, result) {
      if (error) {
        // oauthAccessToken - Secret and result are now undefined
        res.status(500).send("Error getting OAuth access token : " + util.inspect(error))
      } else {
        req.session.oauthAccessToken = oauthAccessToken
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret
        // Redirect to signed_in.
        res.redirect('/signed_in')
      }
    }
  )
})

app.get('/signed_in', function(req, res) {
  // Set the template page.
  var template = "./template/signInFailed.pug"
  // Set parameters for the template.
  var options = { "title" : "Sign In failed" }
  // Get PID from the current session.
  var pid = req.session.pid
  console.log("SIGNED IN pid", pid)
  // Get the account info of the user signing in.
  consumer.get(apiHost + "/obp/v2.1.0/my/accounts",
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    function (error, data, response) {
      // Get the data about the user.
      const parsedData = JSON.parse(data)
      // variable ok used for checking if account is valid.
      let ok = false
      // Scanning each account of the user.
      parsedData.forEach(function(item) {
        // check the binomial accountId and bankId
        if(item.id == accountIdISP && item.bank_id == bankIdISP)
          ok = true
      })
      // if the user is not the admin, show an error page.
      if(ok == false) {
        const html = pug.renderFile(template, options)
        res.status(200).send(html)
      // if the user is the admin, send a pre-compiled form for the final transaction.
      } else {
        res.redirect('/createTransactionRequest')
      }
    }
  )
})

app.get('/home', function(req, res) {
  const template = "./template/home.pug"
  const options = {
      "title": "Home",
  }
  const html = pug.renderFile(template, options)
  res.status(200).send(html)
})

app.get('/createTransactionRequest', function(req, res) {
  // Set the template file.
  const template = "./template/createTransactionRequest.pug"
  const pid = req.session.pid
  console.log("SIGNED IN pid", pid)
  if (!firebase.apps.length)
    firebase.initializeApp(configFirebase)
  // Refer to the specific element of the "pending_payments_psd2" table in firebase.
  const refPsd2Payment = firebase.database().ref("pending_payments_psd2/" + req.session.pid)
  // Take a snapshot of the payment selected.
  refPsd2Payment.once("value").then(function(snapshot) {
    // Get the token amount sent in the request.
    const tokenAmount = snapshot.child("tokenAmount").val()
    // TODO Conversion from the token to €.
    const euroAmount = tokenAmount / 1000 * 700
    // Get the shop id.
    const shopId = snapshot.child("shop").val()
    // Refer to the specific element of the "shops" table in firebase.
    const refShop = firebase.database().ref("shops/" + shopId)
    // Take a snapshot of the shop selected.
    refShop.once("value").then(function(snapshot) {
      // Get the shop data desired.
      const toBankId = snapshot.child("bankId").val()
      const toAccountId = snapshot.child("accountId").val()
      const options = {
        "title": "Create Transaction",
        "pid": req.session.pid,
        "shopId": shopId,
        "toBankId": toBankId,
        "toAccountId": toAccountId,
        "tokenAmount": tokenAmount,
        "euroAmount": euroAmount,
      }
      // Template rendering.
      const html = pug.renderFile(template, options)
      res.status(200).send(html)
    }).catch(() => {
      console.log("Error management TODO Catch 1")
    })
  }).catch(()=>{
    // TODO handle error safely.
    console.log("Error management TODO Catch 2")
  })
})

app.post('/createTransactionRequest', urlencodedParser, function(req, res) {
  // Set the template file.
  const template = "./template/createTransactionRequest.pug"
  const pid = req.body.pid
  // Check request body
  if (!req.body)
    return res.sendStatus(400)
  // Set bankId of the admin
  const fromBankId = "psd201-bank-x--uk"
  // Set accountId of the admin
  const fromAccountId = "12456734234"
  // Set the bankId of the designated shop
  const toBankId = req.body.to_bank_id
  // Set the accountId of the designated shop
  const toAccountId = req.body.to_account_id
  // Set the currency to €
  const currency = "EUR"
  // Set the amount for the designated shop
  const amount = req.body.amount
  // Set the description as the corresponding token amount
  const description = req.body.description
  // Set type to "SANDBOX_TAN"
  const transactionRequestType = "SANDBOX_TAN"
  // Build the post body
  const toObj = { "bank_id": toBankId, "account_id": toAccountId }
  const valueObj = { "currency": currency, "amount": amount }
  const detailsObj = { "to": toObj, "value": valueObj, "description": description }
  const details = JSON.stringify(detailsObj)
  // Set the view field as owner
  const viewId = "owner"
  const apiHost = config.apiHost
  const postUrl = apiHost + "/obp/v2.1.0/banks/" + fromBankId + "/accounts/" + fromAccountId + "/" + viewId + "/transaction-request-types/" + transactionRequestType + "/transaction-requests"
  // Perform the POST request
  consumer.post(postUrl,
    req.session.oauthAccessToken,
    req.session.oauthAccessTokenSecret,
    details,                                    // This is the body of the request.
    "application/json",                         // Must specify this, else will get 404.
    function (error, data, response) {
      // If everything is ok, error is null
      const error = JSON.stringify(error)
      console.log("\nerror is: " + error)
      console.log("\ndata is: " + data)
      console.log("\nresponse is: " + response)
      // Parsing received data
      try {
        if (!firebase.apps.length)
            firebase.initializeApp(configFirebase)
        const parsedData = JSON.parse(data)
        // Set completed value to true
        firebase.database().ref("pending_payments_psd2/" + pid + "/completed/").set(true)
        console.log("AFTER UPDATE req.session.pid: ", pid)
        message = "Nothing went wrong"
        // Set params for the template
        const options = {
          "title": "Transaction",
          "error": error,
          "postUrl": postUrl,
          "fromBankId": fromBankId,
          "fromAccountId": fromAccountId,
          "toBankId": toBankId,
          "toAccountId": toAccountId,
          "currency": currency,
          "transactionRequestType": transactionRequestType,
          "details": details,
          "data": data
        }
        // Render template
        const html = pug.renderFile(template, options)
        res.status(200).send(html)
      } catch (err) {
        // Handle the error safely
        console.log(err)
        message = "Something went wrong creating a transaction request - did you supply the correct values?"
      }
    }
  )
})

// Save the session pid as soon as the user connect to the service.
app.get('*', function(req, res) {
  req.session.pid = req.query.pid
  res.redirect('/connect')
})

// Service available on port 8085.
app.listen(8085)
