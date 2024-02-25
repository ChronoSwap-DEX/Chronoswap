import { Deployer, DeployFunction, Network } from '@alephium/cli';
import { Settings } from '../alephium.config';
import { ChronexToken } from '../artifacts/ts';

const deployChronexToken: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {

  const issueTokenAmount = 10_000_000n * (10n ** 18n)
  
  const result = await deployer.deployContract(ChronexToken, {
    issueTokenAmount: issueTokenAmount,
    initialFields: {
      totalSupply: issueTokenAmount,
      owner_: '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH'
    }
  })

  console.log(`ChronexToken contract address: ${result.contractInstance.address}, contract id: ${result.contractInstance.contractId}`);
};

export default deployChronexToken;