import { AccountApi, Configuration } from "../../src"
import { MAINNET_BASE_URL } from "./constants"

async function getAccountIndex(ethAddress: string): Promise<number | null> {
  const configuration = new Configuration({
    basePath: MAINNET_BASE_URL,
  })

  const apiClient = new AccountApi(configuration)

  let accountIndex: number | null = null

  try {
    const response = await apiClient.accountsByL1Address(ethAddress)
    const subAccounts = response.data.sub_accounts

    if (subAccounts.length > 0) {
      accountIndex = subAccounts[0].index
    }

    if (!accountIndex) {
      throw new Error("Account index not found")
    }

    return accountIndex
  } catch (error) {
    throw new Error("Account index not found")
  }
}

const ACCOUNT_ADDRESS = "0x0435b1aE398D3FD9035142d529B20dd0Cf722eD7"

getAccountIndex(ACCOUNT_ADDRESS)
  .then((accountIndex) => {
    console.log(`Account index: ${accountIndex}`)
  })
  .catch((error) => {
    console.error(error)
  })
