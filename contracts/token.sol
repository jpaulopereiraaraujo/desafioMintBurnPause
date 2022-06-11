// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


interface IERC20 {

    //Implementado (mais ou menos)
    function totalSupply() external view returns(uint256);
    function balanceOf(address account) external view returns(uint256);
    function transfer(address recipient, uint256 amount) external returns(bool);

    //Não implementados (ainda)
    //function allowence(address owner, address spender) external view returns(uint256);
    //function approve(address spender, uint256 amount) external returns(bool);
    //function transferFrom(address sender, address recipient, uint256 amount) external returns(bool);

    //Implementado
    event Transfer(address from, address to, uint256 value);

    //Não está implementado (ainda)
    //event Approval(address owner, address spender, uint256 value);

}


contract CryptoToken is IERC20 {

    //Libs
    using Math for uint256;

    //Enums

    enum Status { ACTIVE, PAUSED, CANCELLED, KILLED }
    
    //Properties
    string public constant name = "CryptoToken";
    string public constant symbol = "CRY";
    uint8 public constant decimals = 3;  //Default dos exemplos é sempre 18
    uint256 private totalsupply;
    address private owner;
    address[] private tokenOwners;
    address private furnace;
    Status contractState;
    
    
    
    mapping(address => uint256) private addressToBalance;

      modifier isOwner() {
        require(address(msg.sender) == owner , "Sender is not owner!");
        _;
    } 

    // Events
    
 
    //Constructor
    constructor(uint256 total) {
        totalsupply = total;
        owner = msg.sender;
        addressToBalance[owner] = totalsupply;
        tokenOwners.push(owner);
        contractState = Status.PAUSED;
        
    }


    //Public Functions
    function totalSupply() public override view returns(uint256) {
        require(contractState == Status.ACTIVE,"The Contract is not available now :(");
        return totalsupply;
    }

    function balanceOf(address tokenOwner) public override view returns(uint256) {
        require(contractState == Status.ACTIVE,"The Contract is not available now :(");
        return addressToBalance[tokenOwner];
    }

    //FIX: Ta feio, podemos melhorar
    function transfer(address receiver, uint256 quantity) public isOwner override returns(bool) {
        require(contractState == Status.ACTIVE,"The Contract is not available now :(");
        require(quantity <= addressToBalance[owner], "Insufficient Balance to Transfer");
        addressToBalance[owner] = addressToBalance[owner] - quantity;
        addressToBalance[receiver] = addressToBalance[receiver] + quantity;
        tokenOwners.push(receiver);
        uint256 valueToBurn = 0;
        
        if (valueToBurn > 0) {
            burn(valueToBurn);
        }
        
        emit Transfer(owner, receiver, quantity);
        return true;
    }

    function burn(uint256 value) public isOwner returns(bool) {
        //require(contractState == Status.ACTIVE,"The Airdrop is not available now :(");
        require(contractState == Status.ACTIVE,"The Contract is not available now :(");
        furnace = 0xf000000000000000000000000000000000000000;

        for (uint i = 0; i < tokenOwners.length; i++) {
            addressToBalance[tokenOwners[i]] = 
            addressToBalance[tokenOwners[i]].percent(value);
            
            emit Transfer(tokenOwners[i], furnace, addressToBalance[tokenOwners[i]]);
            
        }
        totalsupply = totalsupply.percent(value);
   
        return true;
    }

    function state() public view returns(Status) {
        return contractState;
    }

    function cancelContract() public isOwner{
        burn(100);
        contractState = Status.CANCELLED;
        
    }

    function pauseContract() public isOwner{
       
        contractState = Status.PAUSED;
        
    }

    function activeContract() public isOwner{
       
        contractState = Status.ACTIVE;
        
    }


    function kill() public isOwner {
        require(contractState == Status.CANCELLED,"The contract is active");
        contractState = Status.KILLED;
        selfdestruct(payable(owner));
        
    }


}
library Math {


    function percent(uint256 a, uint256 b) public pure returns(uint256){
        uint256 c = a - a*b/100;
        return c;
    }




}

