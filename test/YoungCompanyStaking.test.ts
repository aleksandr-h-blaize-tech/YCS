import type { SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { takeSnapshot, time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";

import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Event } from "@ethersproject/contracts";

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
    let lockTIme = week;
    let rewardPercentage = 0.1;
    
    before(async () => {
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

    it("Owner deploy contracts", async () => {
        // Deploy YoungCompanyStaking
        const ycs = await ethers.getContractFactory("YoungCompanyStaking");
        YCS = await ycs.deploy(token.address);
        await YCS.deployed();

        // Initialize YoungCompanyStaking lockTime and and rewardPercentage
        await YCS.initialize(lockTIme, rewardPercentage);

        // Check state
        expect(await YCS.token()).to.be.eq(token.address);
        expect(await YCS.lockTIme()).to.be.eq(week);
        expect(await YCS.rewardPercentage()).to.be.eq(rewardPercentage);
    });

    it("User deposit, show state and withdraw", async () => {
        // Deploy YoungCompanyStaking
        const ycs = await ethers.getContractFactory("YoungCompanyStaking");
        YCS = await ycs.deploy(token.address);
        await YCS.deployed();
        await YCS.initialize(lockTIme, rewardPercentage);

        // User1 deposit
        TODO: "Change to work with Ether"
        let amountUser1 = 100;
        let tx = await YCS.connect(users[0]).deposit(amountUser1);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[0].address, amountUser1,
            await time.latest(), await time.latest() + week,
            rewardPercentage);

        // User2 deposit
        TODO: "Change to work with Ether"
        let amountUser2 = 200;
        tx = await YCS.connect(users[1]).deposit(amountUser2);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[1].address, amountUser2,
            await time.latest(), await time.latest() + week,
            rewardPercentage);

        // User1 show state
        let user1State = await YCS.connect(users[0]).showState();
        expect(user1State.length).to.be.eq(1);

        // Owner show state
        let allState = await YCS.showState();
        expect(allState.length).to.be.eq(2);

        // Pass time
        await time.increase(week);

        // User1 withdraw
        TODO: "Change to work with Ether"
        tx = await YCS.connect(users[0]).withdraw();
        await expect(tx).to.emit(YCS, "Withdrawed").withArgs(
            [users[0].address, amountUser1,
            await time.latest(),
            rewardPercentage * amountUser1]);
        expect(await token.balanceOf(users[0].address)).to.be.eq(amountUser1 * rewardPercentage);
    });

    it("Owner changes lockTime and rewardPercentage", async () => {
        // Deploy YoungCompanyStaking
        const ycs = await ethers.getContractFactory("YoungCompanyStaking");
        YCS = await ycs.deploy(token.address);
        await YCS.deployed();
        await YCS.initialize(lockTIme, rewardPercentage);

        // User1 deposit
        TODO: "Change to work with Ether"
        let amountUser1 = 100;
        let tx = await YCS.connect(users[0]).deposit(amountUser1);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[0].address, amountUser1,
            await time.latest(), await time.latest() + week,
            rewardPercentage);

        // Owner change lockTime
        let newLockTIme = 2 * week;
        tx = await YCS.setLockTime(newLockTIme);
        await expect(tx).to.emit(YCS, "LockTimeChanged").withArgs(lockTIme, newLockTIme);

        // Owner change rewardPercentage        
        let newRewardPercentage = 0.3;        
        tx = await YCS.setRewardPercentage(newRewardPercentage);
        await expect(tx).to.emit(YCS, "RewardPercentageChanged").withArgs(rewardPercentage, newRewardPercentage);

        // User2 deposit
        TODO: "Change to work with Ether"
        let amountUser2 = 200;
        tx = await YCS.connect(users[1]).deposit(amountUser2);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[1].address, amountUser2,
            await time.latest(), await time.latest() + week,
            rewardPercentage);

        // Owner show state
        let allState = await YCS.showState();
        expect(allState[0].rewardPercentage).to.be.eq(rewardPercentage);
        expect(allState[1].rewardPercentage).to.be.eq(newRewardPercentage);
    });

    it("Owner add and delete Admin", async () => {
        // Deploy YoungCompanyStaking
        const ycs = await ethers.getContractFactory("YoungCompanyStaking");
        YCS = await ycs.deploy(token.address);
        await YCS.deployed();
        await YCS.initialize(lockTIme, rewardPercentage);

        // Owner add Admin
        let tx = await YCS.addAdmin(admin.address);
        await expect(tx).to.emit(YCS, "AdminAdded").withArgs(admin.address);

        // User1 deposit
        TODO: "Change to work with Ether"
        let amountUser1 = 100;
        tx = await YCS.connect(users[0]).deposit(amountUser1);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[0].address, amountUser1,
            await time.latest(), await time.latest() + week,
            rewardPercentage);

        // User2 deposit
        TODO: "Change to work with Ether"
        let amountUser2 = 200;
        tx = await YCS.connect(users[1]).deposit(amountUser2);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[1].address, amountUser2,
            await time.latest(), await time.latest() + week,
            rewardPercentage);

        // Admin show state
        let allState = await YCS.connect(admin).showState();
        expect(allState.length).to.be.eq(2);

        // Owner remove Admin
        tx = await YCS.removeAdmin(admin.address);
        await expect(tx).to.emit(YCS, "AdminRemoved").withArgs(admin.address);
    });

    it("Admin lock and unlock User", async () => {
        // Deploy YoungCompanyStaking
        const ycs = await ethers.getContractFactory("YoungCompanyStaking");
        YCS = await ycs.deploy(token.address);
        await YCS.deployed();
        await YCS.initialize(lockTIme, rewardPercentage);

        // Owner add Admin
        let tx = await YCS.addAdmin(admin.address);
        await expect(tx).to.emit(YCS, "AdminAdded").withArgs(admin.address);

        // Admin lock User1
        tx = await YCS.connect(admin).lockUser(users[0]);
        await expect(tx).to.emit(YCS, "UserLocked").withArgs(users[0].address);

        // User1 try deposiit
        TODO: "Change to work with Ether"
        let amountUser1 = 100;
        let stringError = "UserLocked";
        await expect(YCS.connect(users[0]).deposit(amountUser1)).to.be.revertedWithCustomError(YCS, stringError);

        // User2 deposit
        TODO: "Change to work with Ether"
        let amountUser2 = 200;
        tx = await YCS.connect(users[1]).deposit(amountUser2);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[1].address, amountUser2,
            await time.latest(), await time.latest() + week,
            rewardPercentage);

        // Admin unlock User1
        tx = await YCS.connect(admin).unlockUser(users[0]);
        await expect(tx).to.emit(YCS, "UserUnlocked").withArgs(users[0].address);

        // User1 deposit
        TODO: "Change to work with Ether"
        amountUser1 = 100;
        tx = await YCS.connect(users[0]).deposit(amountUser1);
        await expect(tx).to.emit(YCS, "Deposited").withArgs(
            users[0].address, amountUser1,
            await time.latest(), await time.latest() + week,
            rewardPercentage);
    });

    // restore snapshot
    afterEach(async () => await snapshotA.restore());
});
