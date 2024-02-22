import { Configuration } from '@alephium/cli'
import { Address } from '@alephium/web3'

// Settings are usually for configuring
export type Settings = {
  feeSetter?: Address
}

const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: 'http://localhost:22973',
      privateKeys: [
        'a642942e67258589cd2b1822c631506632db5a12aabcf413604e785300d762a5' // group 0
      ],
      settings: { feeSetter: '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH' }
    },

    testnet: {
      nodeUrl: (process.env.NODE_URL as string) ?? 'https://wallet-v20.testnet.alephium.org',
      privateKeys: process.env.PRIVATE_KEYS === undefined ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: { feeSetter: '19ymyoDKsqgYtEZoJva1BQr14oeYzaCHve9nnQXSuqLiH' }
    },

    mainnet: {
      nodeUrl: (process.env.NODE_URL as string) ?? 'https://wallet-v20.mainnet.alephium.org',
      privateKeys: process.env.PRIVATE_KEYS === undefined ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: {}
    }
  },
  compilerOptions: {
    errorOnWarnings: true,
    ignoreUnusedConstantsWarnings: true
  }
}

export default configuration
