pragma solidity ^0.4.21;


// Open Zeppelin library for preventing overflows and underflows.
library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0.
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold.
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}


// ERC20 Token interface.
interface IERC20 {
    function totalSupply() public constant returns (uint256 totalSupply);
    function balanceOf(address _owner) public constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) public returns (bool success);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
}


// Contract onwer restrictions.
contract Owned {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}


contract FidelityPoints is IERC20, Owned {
    // Overlay of the Safemath library on uint256 datatype
    using SafeMath for uint256;

    // Restrinct the usage of a function to a user
    modifier onlyUser {
        require(!containsShop(msg.sender));
        _;
    }

    // Restrinct the usage of a function to a shop
    modifier onlyShop {
        require(containsShop(msg.sender));
        _;
    }

    // Structure of a payment request done by a shop asking money from the ISP.
    struct EthereumPaymentRequest {
        address shop;       // Ethereum address of the shop, sender of the request.
        string note;        // Additional notes for the admin
        uint value;         // Amount of ethereum to be transfered
        string shopId;      // Id of the shop who is making the request in order to get its data from the database
        bool completed;     // Flag regarding the admin execution of the payment
        bool rejected;      // Flag regarding the approvation status of the request
    }

    // Structure of a buy request done by a user for buying a product from a shop.
    struct BuyingRequest {
        address user;       // Ethereum address of the user, sender of the request.
        address shop;       // Ethereum address of the shop, receiver of the request.
        string product;     // Id of the product object to be bought.
        string shopEmail;   // Email of the shop, used for diplaying the request to its belonging shops.
        string userId;      // Id of the user, used for showing him every request he has performed.
        uint value;         // Tokens used for buying the product, they are sent with the request
        bool shipped;       // Flag regarding the shipment status of the request
        bool rejected;       // Flag regarding the approvation status of the request
    }

    // Contract variables.
    uint public constant INITIAL_SUPPLY =  1000000000000;                // Initial supply of tokens: 1.000.000.000.000
    uint public _totalSupply =  0;                                      // Total amount of tokens
    address public owner;                                               // Address of the contract owner
    address[] public shops;                                             // Array of shop addresses
    EthereumPaymentRequest[] public ethereumPaymentRequests;            // Array of shop payment requests
    BuyingRequest[] public buyingRequests;                              // Array of user buy requests

    // Cryptocurrency characteristics.
    string public constant symbol = "FID";                              // Cryprocurrency symbol
    string public constant name = "Fido Coin";                          // Cryptocurrency name
    uint8 public constant decimals = 18;                                // Standard number for Eth Token
    uint256 public constant RATE = 1000000000000000000;                 // 1 ETH = 10^18 FID;

    // Map definions.
    mapping (address => uint256) public balances;                       // Map [User,Amount]
    mapping (address => bool) public shopsMap;                          // Map [Shop,Official]
    mapping (address => mapping (address => uint256)) public allowed;   // Map [User,[OtherUser,Amount]]

    // Events definition.
    // This notify clients about the transfer.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Constructor, set the contract sender/deployer as owner.
    function FidelityPoints() public {
        // Check for the null address.
        require(msg.sender != 0x00);
        // Update total supply with decimals.
        _totalSupply = INITIAL_SUPPLY * 10 ** uint256(decimals);
        // Give an initial supply to the contract creator.
        balances[msg.sender] = _totalSupply;
        // Who deploys the contract is the owner.
        owner = msg.sender;
        // Add owner in shops Array.
        shops.push(owner);
        // add owner in shopsMap.
        shopsMap[owner] = true;
    }

    /******************************************************************************
     * Fallback function, a function with no name that gets called.                *
     * whenever you do not actually pass a function name.                         *
     * This allow people to just send money directly to the contract address.     *
     ******************************************************************************/
    function () public payable {
        // People will send money directly to the contract address.
    }

    /*****************************************************************************
    * Check if a shop exists.                                                    *
    ******************************************************************************/
    function containsShop(address _shop) public view returns (bool) {
        return shopsMap[_shop];
    }

    /*****************************************************************************
    * Perform a FIDO token generation.                                           *
    ******************************************************************************/
    function createTokens() public payable onlyOwner {
        // Check if the amount trasfered is greather than 0.
        require(msg.value > 0);
        // Check if the sender address is 0.
        require(msg.sender != 0x00);
        // Create tokens from Ether multiplying for 10^18
        uint256 tokens = msg.value.mul(RATE);
        // Add tokens to the buyer account.
        balances[msg.sender] = balances[msg.sender].add(tokens);
        // Total supply number increased by the new token creation.
        _totalSupply = _totalSupply.add(tokens);
        // Transfer the amount to the owner, auto rollback if the transaction fails.
        owner.transfer(msg.value);
    }

    /*****************************************************************************
    * Perform a payment with the ETH cryptocurrency.                             *
    *                                                                            *
    * Return true if success.                                                    *
    *                                                                            *
    * @param _to the address of the receiver.                                    *
    * @param _value amount of ETH transfered.                                    *
    ******************************************************************************/
    function payWithEthereum(address _to, uint256 _value) public payable onlyOwner returns (bool success) {
        // Check if the amount trasfered is greather than 0.
        require(msg.value > 0);
        // Check if the sender is differrent from 0x00.
        require(msg.sender != 0x00);
        // Transfer Operation.
        _to.transfer(_value);
        return true;
    }

    /*****************************************************************************
    * Return the total supply of the token.                                      *
    *                                                                            *
    *                                                                            *
    * Return the value of the variable `_totalSupply`.                           *
    ******************************************************************************/
    function totalSupply() public constant returns (uint256 totalSupply) {
        // Value of the contract variable
        return _totalSupply;
    }

    /*****************************************************************************
    * Return the balance of an account.                                          *
    *                                                                            *
    * Return the amount of money of the `_account`.                              *
    *                                                                            *
    * @param _account the address of the account of which I want the balance.    *
    ******************************************************************************/
    function balanceOf(address _account) public constant returns (uint256 balance) {
        return balances[_account];
    }

    /*****************************************************************************
    * Transfer tokens from sender to receiver.                                   *
    *                                                                            *
    * Send `_value` tokens from the msg.sender to the `_to` address.             *
    *                                                                            *
    * @param _to the address of the receiver.                                    *
    * @param _value the amount of points to send.                                *
    ******************************************************************************/
    function transfer(address _to, uint256 _value) public returns (bool success) {
        _value = _value * 10 ** uint256(decimals);
        // Check if the sender has enough.
        require(balances[msg.sender] >= _value);
        // Check if the amount trasfered is greather than 0.
        require(_value > 0);
        // Prevent transfer to 0x0 address.
        require(_to != 0x0);
        // Check for overflows.
        require(balances[_to] + _value > balances[_to]);
        // Check for underflows.
        require(balances[msg.sender] - _value < balances[msg.sender]);
        // Save for the future assertion.
        uint previousBalances = balances[msg.sender].add(balances[_to]);
        // Subtract the token amount from the sender.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        // Add the token amount to the recipient.
        balances[_to] = balances[_to].add(_value);
        // Emit the Transfer event.
        emit Transfer(msg.sender, _to, _value);
        // Asserts are used to use static analysis to find bugs in code. They should never fail.
        assert(balances[msg.sender].add(balances[_to]) == previousBalances);
        return true;
    }

    /*****************************************************************************
    * Get the most important token informations                                  *
    ******************************************************************************/
    function getSummary() public view returns (uint, address, string, string, uint8, uint256) {
        uint exponent = 10 ** uint(decimals);
        uint256 tokenUnits = _totalSupply / exponent;
        return(
            tokenUnits,
            owner,
            symbol,
            name,
            decimals,
            RATE
        );
    }

    /*****************************************************************************
    * Add a new shop to the collection of official shops                         *
    ******************************************************************************/
    function addShop(address _newShop) public onlyOwner returns (bool) {
        // Add shop in shops Array
        shops.push(_newShop);
        // Add shop in shopsMap
        shopsMap[_newShop] = true;
        return true;
    }

    /*****************************************************************************
    * Returns the number of the official shops                                   *
    ******************************************************************************/
    function getShopsCount() public view returns (uint) {
        return shops.length;
    }

    /*****************************************************************************
    * Shop create a request to be payed  and pay the ISP.                        *
    *                                                                            *
    *                                                                            *
    * @param _value                                                              *
    * @param _note                                                               *
    * @param _shopId                                                             *
    ******************************************************************************/
    function createEthereumPaymentRequest(uint _value, string _note, string _shopId)
        public onlyShop returns (bool) {
            // Check if the shop has enough token.
            require(balances[msg.sender] >= _value);
            // Check if the amount trasfered is greather than 0.
            require(_value > 0);
            // Prevent transfer to 0x0 address.
            require(owner != 0x0);
            // Check for overflows.
            require(balances[owner] + _value > balances[owner]);
            // Check for underflows.
            require(balances[msg.sender] - _value < balances[msg.sender]);
            // Create the new EthereumPaymentRequest.
            EthereumPaymentRequest memory ethereumPaymentRequest = EthereumPaymentRequest({
                shop: msg.sender,
                note: _note,
                value: _value,
                shopId: _shopId,
                completed: false,
                rejected: false
            });
            // Adding a new ethereum payment request.
            ethereumPaymentRequests.push(ethereumPaymentRequest);
            // Value convertion.
            _value = _value * 10 ** uint256(decimals);
            // Save for the future assertion.
            uint previousBalances = balances[msg.sender].add(balances[owner]);
            // Subtract the token amount from the shop.
            balances[msg.sender] = balances[msg.sender].sub(_value);
            // Add the token amount to the contract owner.
            balances[owner] = balances[owner].add(_value);
            // Emit the Transfer event.
            emit Transfer(msg.sender, owner, _value);
            // Asserts are used to use static analysis to find bugs in code. They should never fail.
            assert(balances[msg.sender].add(balances[owner]) == previousBalances);
            return true;
        }

    /*****************************************************************************
    * User create a request to buy a product from a shop.                        *
    *                                                                            *
    *                                                                            *
    * @param _product                                                            *
    * @param _shopEmail                                                           *
    * @param _receiver                                                           *
    * @param _value                                                              *
    * @param _userId                                                             *
    ******************************************************************************/
    function createBuyingRequest(string _product, string _shopEmail, address _receiver, uint _value, string _userId)
        public onlyUser returns (bool) {
            // Check if the sender has enough.
            require(balances[msg.sender] >= _value);
            // Check if the amount trasfered is greather than 0.
            require(_value > 0);
            // Prevent transfer to 0x0 address.
            require(_receiver != 0x0);
            // Check for overflows.
            require(balances[_receiver] + _value > balances[_receiver]);
            // Check for underflows.
            require(balances[msg.sender] - _value < balances[msg.sender]);
            // Receiver should be an official shop.
            require(containsShop(_receiver));
            // Create the new BuyingRequest.
            BuyingRequest memory buyingRequest = BuyingRequest({
                user: msg.sender,
                shop: _receiver,
                product: _product,
                shopEmail: _shopEmail,
                value: _value,
                userId: _userId,
                shipped: false,
                rejected: false
            });
            // Adding a new buy request.
            buyingRequests.push(buyingRequest);
            // Value convertion.
            _value = _value * 10 ** uint256(decimals);
            // Save for the future assertion.
            uint previousBalances = balances[msg.sender].add(balances[_receiver]);
            // Subtract the token amount from the user sender.
            balances[msg.sender] = balances[msg.sender].sub(_value);
            // Add the token amount to the shop receiver
            balances[_receiver] = balances[_receiver].add(_value);
            // Emit the Transfer event.
            emit Transfer(msg.sender, _receiver, _value);
            // Asserts are used to use static analysis to find bugs in code. They should never fail.
            assert(balances[msg.sender].add(balances[_receiver]) == previousBalances);
            return true;
        }

    /*****************************************************************************
    * Used for returning ethereum payment requests done by shop one by one.      *
    ******************************************************************************/
    function getRequestsCount() public view returns (uint256) {
        return ethereumPaymentRequests.length;
    }

    /*****************************************************************************
    * Used for returning user buy requests one by one.                           *
    ******************************************************************************/
    function getUserRequestsBuyCount() public view returns (uint256) {
        return buyingRequests.length;
    }

    /****************************************************************************
    * Shop accepts the request and user is notified.                            *
    *                                                                           *
    * shop ship the product if phisical.                                        *
    *                                                                           *
    * @param _index                                                             *
    *****************************************************************************/
    function finalizeUserRequestBuy(uint _index) public onlyShop {
        BuyingRequest storage buyingRequest = buyingRequests[_index];
        // Check if the product of the request is not reject.
        require(!buyingRequests[_index].rejected);
        // Check if the product of the request is still not shipped.
        require(!buyingRequests[_index].shipped);
        // Set the request to shipped, this must be done after the product is shipped phisically by the shop.
        buyingRequest.shipped = true;
    }

    /****************************************************************************
    * Shop rejected the request and user is refunded with tokens                *
    *                                                                           *
    * If the product has been shipped it can still be rejected                  *
    * tokens should be given back later                                         *
    *                                                                           *
    * @param _index                                                             *
    *****************************************************************************/
    function rejectUserRequestBuy(uint _index) public onlyShop {
        BuyingRequest storage buyingRequest = buyingRequests[_index];
        // Check if the product of the request is still not rejected.
        require(!buyingRequests[_index].rejected);
        // Check if the product of the request is still not shipped.
        require(!buyingRequests[_index].shipped);
        // Value convertion
        uint value = buyingRequest.value * 10 ** uint256(decimals);
        // Save for the future assertion.
        uint previousBalances = balances[buyingRequest.shop].add(balances[buyingRequest.user]);
        // Subtract the token amount from the shop.
        balances[buyingRequest.shop] = balances[buyingRequest.shop].sub(value);
        // Give back the token amount to the user.
        balances[buyingRequest.user] = balances[buyingRequest.user].add(value);
        // Emit the Transfer event.
        emit Transfer(buyingRequest.shop, buyingRequest.user, value);
        // Asserts are used to use static analysis to find bugs in code. They should never fail.
        assert(balances[buyingRequest.shop].add(balances[buyingRequest.user]) == previousBalances);
        // Set the request as rejected.
        buyingRequest.rejected = true;
    }

    /****************************************************************************
    * Owner accepts the request and shop is payed in eth.                       *
    *                                                                           *
    * Owner finalize the request manually.                                      *
    *                                                                           *
    * @param _index                                                             *
    *****************************************************************************/
    function finalizeRequestEthereum(uint _index) public onlyOwner payable {
        EthereumPaymentRequest storage ethereumPaymentRequest = ethereumPaymentRequests[_index];
        // Check if not rejected.
        require(!ethereumPaymentRequests[_index].rejected);
        // Check if still not finalized.
        require(!ethereumPaymentRequests[_index].completed);
        // Convert Token to ethereum.
        uint256 ethValue = ethereumPaymentRequest.value.div(RATE);
        // Trasfer ethereum amount to the shop.
        ethereumPaymentRequest.shop.transfer(ethValue);
        // Set shop request status to completed.
        ethereumPaymentRequest.completed = true;
    }

    /****************************************************************************
    * Owner reject the request and shop is refunded with tokens                 *
    *                                                                           *
    * @param _index                                                             *
    *****************************************************************************/
    function rejectRequestEthereum(uint _index) public onlyOwner {
        EthereumPaymentRequest storage ethereumPaymentRequest = ethereumPaymentRequests[_index];
        // Check if already finalized.
        require(!ethereumPaymentRequests[_index].completed);
        // Check if the product of the request is still not rejected.
        require(!ethereumPaymentRequests[_index].rejected);
        // Value convertion.
        uint value = ethereumPaymentRequest.value * 10 ** uint256(decimals);
        // Save for the future assertion.
        uint previousBalances = balances[owner].add(balances[ethereumPaymentRequest.shop]);
        // Subtract the token amount from the owner.
        balances[owner] = balances[owner].sub(value);
        // Give bacje the token amount to the shop.
        balances[ethereumPaymentRequest.shop] = balances[ethereumPaymentRequest.shop].add(value);
        // Emit the Transfer event.
        emit Transfer(owner, ethereumPaymentRequest.shop, value);
        // Asserts are used to use static analysis to find bugs in code. They should never fail.
        assert(balances[owner].add(balances[ethereumPaymentRequest.shop]) == previousBalances);
        // Set the shop payment request as rejected.
        ethereumPaymentRequest.rejected = true;
    }
}