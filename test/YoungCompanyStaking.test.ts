import type { SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { takeSnapshot, time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";

import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const { AddressZero } = ethers.constants;

describe("Contract: YoungCompanyStaking", function () {
    // snapshoter
    let snapshotA: SnapshotRestorer;

    // Signers
    let owner: SignerWithAddress,
        admin: SignerWithAddress,
        users: SignerWithAddress[];
    const USER_NUMBER = 2;
    
    // contracts
    let token: any;
    let YCS: any;

    // Time in seconds
    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    // YCS setting
    let lockTime = week;
    let rewardPercentage = 10;
    
    beforeEach(async () => {
        // Getting of signers.
        const signers = await ethers.getSigners();
        owner = signers[0];
        admin = signers[1];
        users = signers.slice(2, 2 + USER_NUMBER);

        // snapshot
        snapshotA = await takeSnapshot();

        // Deploy GovernanceToken
        const tokenName = "GovernanceToken";
        const tokenSymbol = "GT";
        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        token = await GovernanceToken.deploy(tokenName, tokenSymbol);
        await token.deployed();
    });

    describe("End-to-End tests", function () {
        it("Owner deploy contracts", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();

            // Initialize YoungCompanyStaking lockTime and and rewardPercentage
            await YCS.initialize(lockTime, rewardPercentage);

            // Check state
            expect(await YCS.token()).to.be.eq(token.address);
            expect(await YCS.lockTime()).to.be.eq(week);
            expect(await YCS.rewardPercentage()).to.be.eq(rewardPercentage);
        });

        it("User deposit, show state and withdraw", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            let tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // User2 deposit
            let amountUser2 = ethers.utils.parseEther("200");
            tx = await YCS.connect(users[1]).deposit(
                {
                    value: amountUser2,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[1].address, amountUser2,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // User1 show state
            let user1State = await YCS.connect(users[0]).getDeposits();
            expect(user1State.length).to.be.eq(1);

            // Owner show state
            let allState = await YCS.getDeposits();
            expect(allState.length).to.be.eq(0);

            // Pass time
            await time.increase(week);

            // User1 withdraw
            tx = await YCS.connect(users[0]).withdraw();            
            await expect(tx).to.emit(YCS, "Withdrawed");
        });

        it("Owner changes lockTime and rewardPercentage", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            let tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // Owner change lockTime
            let newlockTime = 2 * week;
            tx = await YCS.setLockTime(newlockTime);
            await expect(tx).to.emit(YCS, "LockTimeChanged").withArgs(lockTime, newlockTime);

            // Owner change rewardPercentage        
            let newRewardPercentage = 30;
            tx = await YCS.setRewardPercentage(newRewardPercentage);
            await expect(tx).to.emit(YCS, "RewardPercentageChanged").withArgs(rewardPercentage, newRewardPercentage);

            // User2 deposit
            let amountUser2 = ethers.utils.parseEther("200");
            tx = await YCS.connect(users[1]).deposit(
                {
                    value: amountUser2,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[1].address, amountUser2,
                await time.latest(), await time.latest() + newlockTime,
                newRewardPercentage);

            // Owner show state
            let allState = await YCS.getDeposits();
            expect((await YCS.connect(users[0]).getDeposits())[0].rewardPercentage).to.be.eq(rewardPercentage);
            expect((await YCS.connect(users[1]).getDeposits())[0].rewardPercentage).to.be.eq(newRewardPercentage);
        });

        it("Owner add and delete Admin", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // Owner add Admin
            let tx = await YCS.addAdmin(admin.address);
            await expect(tx).to.emit(YCS, "AdminAdded").withArgs(admin.address);

            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // User2 deposit
            let amountUser2 = ethers.utils.parseEther("200");
            tx = await YCS.connect(users[1]).deposit(
                {
                    value: amountUser2,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[1].address, amountUser2,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // User2 show state
            let allState = await YCS.connect(users[1]).getDeposits();
            expect(allState.length).to.be.eq(1);

            // Owner remove Admin
            tx = await YCS.revokeAdmin(admin.address);
            await expect(tx).to.emit(YCS, "AdminRevoked").withArgs(admin.address);
        });

        it("Admin lock and unlock User", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // Owner add Admin
            let tx = await YCS.addAdmin(admin.address);
            await expect(tx).to.emit(YCS, "AdminAdded").withArgs(admin.address);

            // Admin lock User1
            tx = await YCS.connect(admin).lockUser(users[0].address);
            await expect(tx).to.emit(YCS, "UserLocked").withArgs(users[0].address);

            // User1 try deposiit
            TODO: "Change to work with Ether"
            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            let stringError = "AccountLocked";
            await expect(YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })).to.be.revertedWithCustomError(YCS, stringError);

            // User2 deposit
            let amountUser2 = ethers.utils.parseEther("200");
            tx = await YCS.connect(users[1]).deposit(
                {
                    value: amountUser2,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[1].address, amountUser2,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // Admin unlock User1
            tx = await YCS.connect(admin).unlockUser(users[0].address);
            await expect(tx).to.emit(YCS, "UserUnlocked").withArgs(users[0].address);

            // User1 deposit
            amountUser1 = ethers.utils.parseEther("100");
            tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);
        });
    });

    describe("Test Ether", function () {
        it(".deposit()", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            let tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);
        });

        it(".withdraw()", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            let tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);
            
            // User1 withdraw
            tx = await YCS.connect(users[0]).withdraw();            
            await expect(tx).to.emit(YCS, "Withdrawed");
        });

        it(".withdrawEther()", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            let tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // admin withdraw Ether
            await YCS.withdrawEther(amountUser1);
        });

        it(".sendEther()", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);

            // User1 deposit
            let amountUser1 = ethers.utils.parseEther("100");
            let tx = await YCS.connect(users[0]).deposit(
                {
                    value: amountUser1,
                })            
            await expect(tx).to.emit(YCS, "Deposited").withArgs(
                users[0].address, amountUser1,
                await time.latest(), await time.latest() + week,
                rewardPercentage);

            // admin withdraw Ether
            await YCS.withdrawEther(amountUser1);

            // admin send Ether
            await YCS.sendEther({
                value: amountUser1,
            });
        });
    });

    describe("Error trapping", function () {
        it("Should not deploy contract with ZeroAddress token", async () => {
            // Deploy YoungCompanyStaking
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            await expect(ycs.deploy(AddressZero)).to.be.reverted;            
        });
    });

    describe("Additional test cases: full coverage", function () {
        it("Initialize method can only be called once", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            
            // Initialize YoungCompanyStaking with lockTime and rewardPercentage
            await YCS.initialize(lockTime, rewardPercentage);
            
            // Attempt to initialize YoungCompanyStaking again, should throw an error
            await expect(YCS.initialize(lockTime, rewardPercentage)).to.be.revertedWith("Initializable: contract is already initialized");
        });

        it("Initialize: LockTime must be between 0 and 26 weeks", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
          
            // Attempt to initialize YoungCompanyStaking with lockTime greater than 26 weeks, should throw an error
            await expect(YCS.initialize(27 * week, rewardPercentage)).to.be.revertedWithCustomError(YCS, "IncorrectLockTime");
        });

        it("Initialize: RewardPercentage must be between 0 and 50", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
          
            // Attempt to initialize YoungCompanyStaking with rewardPercentage greater than 50, should throw an error
            await expect(YCS.initialize(lockTime, 51)).to.be.revertedWithCustomError(YCS, "IncorrectRewardPercentage");
        });

        it("Initialize method can only be called by the contract owner", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
          
            // Attempt to initialize YoungCompanyStaking as a non-owner account, should throw an error
            await expect(YCS.connect(admin).initialize(lockTime, rewardPercentage)).to.be.reverted;
        });

        it("AddAdmin method can only be called with a valid address", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);
          
            // Grant admin role to user[0]
            await YCS.addAdmin(users[0].address);
          
            // Attempt to add an admin with a zero address, should throw an error
            await expect(YCS.connect(owner).addAdmin(AddressZero)).to.be.revertedWithCustomError(YCS, "ZeroAddress");
        });

        it("AddAdmin method can only be called with an address that is not already an admin", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);
          
            // Grant admin role to user[0]
            await YCS.addAdmin(users[0].address);
          
            // Attempt to add user[0] as an admin again, should throw an error
            await expect(YCS.connect(owner).addAdmin(users[0].address)).to.be.revertedWithCustomError(YCS, "AdminAlreadyGranted");
        });

        it("AddAdmin method emits the correct event", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);
          
            // Grant admin role to user[0]
            let tx = await YCS.addAdmin(users[0].address);
            await expect(tx).to.emit(YCS, "AdminAdded").withArgs(users[0].address);
          
            // Add user[1] as an admin
            tx = await YCS.connect(owner).addAdmin(users[1].address);
            await expect(tx).to.emit(YCS, "AdminAdded").withArgs(users[1].address);
          });

        it("AddAdmin method adds the correct role to the correct address", async () => {
            const ycs = await ethers.getContractFactory("YoungCompanyStaking");
            YCS = await ycs.deploy(token.address);
            await YCS.deployed();
            await YCS.initialize(lockTime, rewardPercentage);
          
            // Grant admin role to user[0]
            await YCS.addAdmin(users[0].address);
          
            // Add user[1] as an admin
            await YCS.connect(owner).addAdmin(users[1].address);
          
            // Check that user[1] has the admin role
            expect(await YCS.hasRole(YCS.ADMIN_ROLE(), users[1].address)).to.be.true;
        });
    });

    // restore snapshot
    afterEach(async () => await snapshotA.restore());
});
