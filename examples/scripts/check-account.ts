import { AccountApi, AccountByEnum, Configuration } from "../../src"
import { MAINNET_BASE_URL } from "./constants"

async function checkAccount(ethAddress: string): Promise<any> {
  const configuration = new Configuration({
    basePath: MAINNET_BASE_URL,
  })

  const apiClient = new AccountApi(configuration)

  try {
    const response = await apiClient.account(
      AccountByEnum.L1Address,
      ethAddress
    )

    const accounts = response.data?.accounts

    if (!accounts || accounts.length === 0) {
      throw new Error("Account not found")
    }

    const mainAccount = accounts.find(
      (account: any) => account.account_type === 0
    )

    if (!mainAccount) {
      throw new Error("Main account not found")
    }

    console.log("Main account: ", mainAccount)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const ACCOUNT_ADDRESS = "0x0Db38A5a236F29EECE35faEed837b1e6E7D2A2e6"

checkAccount(ACCOUNT_ADDRESS)
  .then((account) => {
    console.log(`Account: ${JSON.stringify(account, null, 2)}`)
  })
  .catch((error) => {
    console.error(error)
  })
