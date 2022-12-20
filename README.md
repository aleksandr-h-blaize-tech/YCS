# YoungCompanyStaking

EVM-enabled blockchain for a young company.
The company has two currencies: ETH (gas coin) and ERC20 Governance token.

The company encourages users to hold ETH with rewards. Users can deposit a certain amount of Ether and block it on the balance of the contract for a certain time.

After this time, the user has the opportunity to withdraw all deposited ether + a certain amount of ERC20 Governance token as a reward
(The reward is calculated according to the formula: 10% of the amount of withdrawn ether).

The contract is updated: stores the address of the token, the lock period and the % of the reward.

Additionally, the owner of the contract has the ability to change the values of the lock period and % of rewards.
The lock period should not be longer than 6 months.
% of rewards is not more than 50%.