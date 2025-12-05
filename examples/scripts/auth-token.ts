import * as fs from "fs"
import { SignerClient } from "../../src/signer"
import { MAINNET_BASE_URL } from "./constants"

interface AccountInfo {
  account_index: number
  api_key_private_key: string
  api_key_index: number
}

interface AuthTokens {
  [accountIndex: string]: {
    [timestamp: string]: string
  }
}

function createAuthTokenForTimestamp(
  signerClient: SignerClient,
  timestamp: number,
  expiryHours: number
): string {
  const expirySeconds = expiryHours * 3600
  const [authToken, error] = signerClient.create_auth_token_with_expiry(
    expirySeconds,
    timestamp
  )

  if (error !== null) {
    throw new Error(`Failed to create auth token: ${error}`)
  }

  if (authToken === null) {
    throw new Error("Auth token is null")
  }

  return authToken
}

async function generateTokensForAccount(
  accountInfo: AccountInfo,
  baseUrl: string,
  durationDays: number
): Promise<[number, { [timestamp: string]: string }]> {
  const accountIndex = accountInfo.account_index
  const apiKeyPrivateKey = accountInfo.api_key_private_key
  const apiKeyIndex = accountInfo.api_key_index

  console.log(`Generating tokens for account ${accountIndex}`)

  const signerClient = new SignerClient(
    baseUrl,
    apiKeyPrivateKey,
    apiKeyIndex,
    accountIndex
  )

  const currentTime = Math.floor(Date.now() / 1000)
  const intervalSeconds = 6 * 3600
  const startTimestamp =
    Math.floor(currentTime / intervalSeconds) * intervalSeconds

  const numTokens = 4 * durationDays
  const expiryHours = 8

  const tokens: { [timestamp: string]: string } = {}

  for (let i = 0; i < numTokens; i++) {
    const timestamp = startTimestamp + i * intervalSeconds
    try {
      const authToken = createAuthTokenForTimestamp(
        signerClient,
        timestamp,
        expiryHours
      )
      tokens[timestamp.toString()] = authToken
      console.debug(`Generated token for timestamp ${timestamp}`)
    } catch (error: any) {
      console.error(
        `Failed to generate token for timestamp ${timestamp}: ${
          error.message || error
        }`
      )
    }
  }

  await signerClient.close()

  return [accountIndex, tokens]
}

async function main() {
  const ACCOUNT_INDEX = process.env.ACCOUNT_INDEX
  const API_KEY_PRIVATE_KEY = process.env.API_KEY_PRIVATE_KEY
  const API_KEY_INDEX = process.env.API_KEY_INDEX

  if (!ACCOUNT_INDEX || !API_KEY_PRIVATE_KEY || !API_KEY_INDEX) {
    console.error(
      "ACCOUNT_INDEX, API_KEY_PRIVATE_KEY, and API_KEY_INDEX are required"
    )
    process.exit(1)
  }

  const account: AccountInfo = {
    account_index: parseInt(ACCOUNT_INDEX),
    api_key_private_key: API_KEY_PRIVATE_KEY,
    api_key_index: parseInt(API_KEY_INDEX),
  }

  const baseUrl = MAINNET_BASE_URL
  const accounts = [account]
  const durationDays = 28

  console.log(`Generating tokens for ${accounts.length} account(s)`)
  console.log(
    `Duration: ${durationDays} days (${4 * durationDays} tokens per account)`
  )

  const authTokens: AuthTokens = {}

  for (const accountInfo of accounts) {
    const [accountIndex, tokens] = await generateTokensForAccount(
      accountInfo,
      baseUrl,
      durationDays
    )
    authTokens[accountIndex.toString()] = tokens
  }

  const outputFile = "auth-tokens.json"
  fs.writeFileSync(outputFile, JSON.stringify(authTokens, null, 2))

  console.log(`Successfully generated tokens and saved to ${outputFile}`)
  console.log(`Total accounts: ${Object.keys(authTokens).length}`)
  for (const [accountIndex, tokens] of Object.entries(authTokens)) {
    console.log(
      `  Account ${accountIndex}: ${Object.keys(tokens).length} tokens`
    )
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error)
  process.exit(1)
})
