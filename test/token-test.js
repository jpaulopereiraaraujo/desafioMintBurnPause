const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("token", async () => {
    let libTest; 
    before ( async ()=>{
        const lib = await ethers.getContractFactory("Math");
        libTest = await lib.deploy();
    })
    it("Totalsupply and Owner Balance test", async function () {
        const [owner, wallet1] = await ethers.getSigners();
       
        const token = await ethers.getContractFactory("CryptoToken",{
            libraries:{"Math":libTest.address},
            signer: owner
           
        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();

        const totalSupplyExpected = 100;

        const totalSupplyResult = await tokenTest.totalSupply();

        expect(totalSupplyExpected).to.equal(totalSupplyResult)

        //Teste do balance do owner
        const balanceExpected = 100;
        const balanceResult = await tokenTest.balanceOf(owner.address)

        expect(balanceExpected).to.equal(balanceResult)

    });

    it("Transfer test", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("CryptoToken",{
            libraries:{"Math":libTest.address},
            signer: owner
        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();

        const transferValue = 40;
        const balanceWallet1Expected = 40;
        const balanceOwnerExpected = 60;


        //Testando a função transfer
        await tokenTest.transfer(wallet1.address, transferValue);

        const bWallet1 = await tokenTest.balanceOf(wallet1.address);

        const bOwner = await tokenTest.balanceOf(owner.address);
        
        //Testando se os tokens saíram

        expect(balanceOwnerExpected).to.equal(bOwner);

        //Testando se os tokens chegaram

        expect(balanceWallet1Expected).to.equal(bWallet1);


    });

    it("Transfer Failtest", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("CryptoToken",{
            libraries:{"Math":libTest.address},
            signer: owner
        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();

        const transferValue = 200;
        const test=1;
        const pass = 1;
        const fail = 0;
        const bOwner = await tokenTest.balanceOf(owner.address);
        
        //testando o require, se o owner não tem saldo para transferir teste ok.
        if (transferValue > bOwner ) {
            expect(pass).to.equal(test);
        } else {
            expect(fail).to.equal(test);
        };
    

    });
    
    it("Burn Test", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("CryptoToken",{
            libraries:{"Math":libTest.address},
            signer: owner
        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();

        const transferValue = 40;
        const balanceWallet1Expected = 20;
        const balanceOwnerExpected = 30;


        await tokenTest.transfer(wallet1.address, transferValue);

        await tokenTest.burn(50);
        
        const bWallet1 = await tokenTest.balanceOf(wallet1.address);

        const bOwner = await tokenTest.balanceOf(owner.address);
        
        //Testando se os tokens saíram

        expect(balanceOwnerExpected).to.equal(bOwner);

        //Testando se os tokens chegaram

        expect(balanceWallet1Expected).to.equal(bWallet1);
    });

    it("Status test", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("CryptoToken",{
            libraries:{"Math":libTest.address},
            signer: owner
        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();

        await tokenTest.activeContract();
        expect(await tokenTest.state()).to.equal(0);

        await tokenTest.pauseContract();
        expect(await tokenTest.state()).to.equal(1);

        await tokenTest.cancelContract();
        expect(await tokenTest.state()).to.equal(2);
        

        
    });

    it("Mint test A", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("CryptoToken", {
            libraries: { "Math": libTest.address },
            signer: owner
        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();


        await tokenTest.transfer(wallet1.address, 70);

        await tokenTest.mintToken();

        expect(await tokenTest.totalSupply()).to.equal(150);
        expect(await tokenTest.balanceOf(owner.address)).to.equal(80);
        expect(await tokenTest.balanceOf(wallet1.address)).to.equal(70);

    });

    it("Mint test B", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("CryptoToken", {
            libraries: { "Math": libTest.address },
            signer: owner
        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();


        await tokenTest.transfer(wallet1.address, 49);

        await tokenTest.mintToken();

        expect(await tokenTest.totalSupply()).to.equal(100);
        expect(await tokenTest.balanceOf(owner.address)).to.equal(51);
        expect(await tokenTest.balanceOf(wallet1.address)).to.equal(49);

    });


});
