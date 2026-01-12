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

const ACCOUNT_ADDRESS = "0x0Db38A5a236F29EECE35faEed837b1e6E7D2A2e6"

getAccountIndex(ACCOUNT_ADDRESS)
  .then((accountIndex) => {
    console.log(`Account index: ${accountIndex}`)
  })
  .catch((error) => {
    console.error(error)
  })
