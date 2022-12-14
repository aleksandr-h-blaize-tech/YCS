import type { SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { takeSnapshot, time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";

import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Event } from "@ethersproject/contracts";

const { AddressZero } = ethers.constants;


TODO: "Work with events in all tests"
describe("Contract: MintController", function () {
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
        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        token = await GovernanceToken.deploy();
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
        await YCS.connect(users[0]).deposit(amountUser1);

        // User2 deposit
        TODO: "Change to work with Ether"
        let amountUser2 = 200;
        await YCS.connect(users[1]).deposit(amountUser2);

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
        await YCS.connect(users[0]).withdraw();
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
        await YCS.connect(users[0]).deposit(amountUser1);

        // Owner change lockTima and rewardPercentage
        let newLockTIme = 2 * week;
        let newRewardPercentage = 0.3;
        await YCS.setLockTime(newLockTIme);
        await YCS.setRewardPercentage(newRewardPercentage);

        // User2 deposit
        TODO: "Change to work with Ether"
        let amountUser2 = 200;
        await YCS.connect(users[1]).deposit(amountUser2);

        // Owner show state
        let allState = await YCS.showState();
        expect(allState[0].rewardPercentage).to.be.eq(rewardPercentage);
        expect(allState[1].rewardPercentage).to.be.eq(newRewardPercentage);
    });

    it("Owner add and delete admin", async () => {
    });

    it("Admin lock and unlock user", async () => {
    });

    // restore snapshot
    afterEach(async () => await snapshotA.restore());
});
