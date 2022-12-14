import type { SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { takeSnapshot, time } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";

import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Event } from "@ethersproject/contracts";

const { AddressZero } = ethers.constants;

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
    });

    it("Owner deploy contracts", async () => {
        // Deploy GovernanceToken
        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        token = await GovernanceToken.deploy();
        await token.deployed();

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
    });

    it("Owner changes lockTime and rewardPercentage", async () => {
    });

    it("Owner add and delete admin", async () => {
    });

    it("Admin lock and unlock user", async () => {
    });

    // restore snapshot
    afterEach(async () => await snapshotA.restore());
});
