import { AccountApi, Configuration } from "../../src"
import { Wallet } from "ethers"
import { SignerClient, create_api_key } from "../../src/signer"
import { MAINNET_BASE_URL, TESTNET_BASE_URL } from "./constants"

// This script creates and registers a new API key for the given account and prints the API key and private key

const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY
const API_KEY_INDEX = process.env.API_KEY_INDEX

if (!ETH_PRIVATE_KEY || !API_KEY_INDEX) {
  console.error("ETH_PRIVATE_KEY and API_KEY_INDEX are required")
  process.exit(1)
}

async function generateApiKey({
  apiKeyIndex,
  ethPrivateKey,
  testnet = false,
}: {
  apiKeyIndex: number
  ethPrivateKey: string
  testnet?: boolean
}) {
  const baseUrl = testnet ? TESTNET_BASE_URL : MAINNET_BASE_URL

  console.log(`Generating API key on ${testnet ? "testnet" : "mainnet"}`)

  if (!ethPrivateKey) throw new Error("Ethereum private key is required")

  const configuration = new Configuration({
    basePath: baseUrl,
  })

  const apiClient = new AccountApi(configuration)
  const ethAccount = new Wallet(ethPrivateKey)
  const ethAddress = ethAccount.address

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
  } catch (error) {
    console.error(`Account not found for ${ethAddress}: ${error}`)
    return
  }

  console.log(`Account index ${accountIndex} found for ${ethAddress}`)

  const [apiPrivateKey, apiPublicKey, apiKeyError] = create_api_key("")

  if (apiKeyError) {
    console.error(`Error creating API key: ${apiKeyError}`)
    return
  }

  if (!apiPrivateKey || !apiPublicKey) {
    console.error("Failed to generate API key")
    return
  }

  const txClient = new SignerClient(
    baseUrl,
    apiPrivateKey,
    apiKeyIndex,
    accountIndex
  )

  const [_, error] = await txClient.change_api_key(ethPrivateKey, apiPublicKey)

  if (error) {
    console.error(`Error changing API key: ${error}`)
    return
  }

  console.log(`Waiting for API key to be changed on the server...`)

  let success = false
  let retries = 0
  const MAX_RETRIES = 10

  while (!success && retries < MAX_RETRIES) {
    const error = txClient.check_client()

    if (!error) {
      console.log(`API key changed on the server ! (${retries} retries)`)
      success = true
      break
    }

    retries++

    await new Promise((resolve) => setTimeout(resolve, 10))
  }

  if (!success) {
    throw new Error(`Failed to receive API key after ${MAX_RETRIES} retries`)
  }

  const response = await apiClient.apikeys(accountIndex, 255)

  console.log(`Account index ${accountIndex} new API key: ${apiPublicKey}`)
  console.log(`API Private key: ${apiPrivateKey}`)

  const targetApiKey = response.data.api_keys.find(
    (apiKey) => apiKey.api_key_index === apiKeyIndex
  )

  if (!targetApiKey) {
    throw new Error(`Target API key not found`)
  }

  console.log(
    `Changed API key n°${apiKeyIndex}: ${targetApiKey.public_key} (nonce: ${targetApiKey.nonce})`
  )
}

generateApiKey({
  ethPrivateKey: ETH_PRIVATE_KEY!,
  apiKeyIndex: parseInt(API_KEY_INDEX!),
  testnet: false,
}).catch((error) => {
  console.error(`Error generating API key: ${error}`)
  process.exit(1)
})
