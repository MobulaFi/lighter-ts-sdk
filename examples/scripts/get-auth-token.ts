import * as fs from "fs"
import * as path from "path"

interface AuthTokens {
  [accountIndex: string]: {
    [timestamp: string]: string
  }
}

/**
 * Gets the current valid auth token for an account from auth-tokens.json
 *
 * Tokens are aligned to 6-hour boundaries and valid for 8 hours.
 * This function finds the token that should be used at the current moment.
 *
 * @param accountIndex - The account index to get the token for
 * @param tokensFile - Path to auth-tokens.json (defaults to "auth-tokens.json")
 * @returns The auth token string, or null if no valid token found
 */
export async function getCurrentAuthToken(
  accountIndex: number,
  tokensFile: string = "auth-tokens.json"
): Promise<string | null> {
  try {
    const tokensPath = path.resolve(tokensFile)
    const tokensContent = fs.readFileSync(tokensPath, "utf-8")
    const authTokens: AuthTokens = JSON.parse(tokensContent)

    const accountTokens = authTokens[accountIndex.toString()]
    if (!accountTokens) {
      console.error(`No tokens found for account ${accountIndex}`)
      return null
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const intervalSeconds = 6 * 3600 // 6 hours
    const alignedTimestamp =
      Math.floor(currentTime / intervalSeconds) * intervalSeconds

    let token = accountTokens[alignedTimestamp.toString()]
    let tokenTimestamp = alignedTimestamp

    if (!token) {
      const previousTimestamp = alignedTimestamp - intervalSeconds
      token = accountTokens[previousTimestamp.toString()]
      if (token) {
        tokenTimestamp = previousTimestamp
      }
    }

    if (!token) {
      console.error(
        `No token found for account ${accountIndex} at timestamp ${alignedTimestamp}`
      )
      return null
    }

    const tokenExpiry = tokenTimestamp + 8 * 3600 // 8 hours

    if (currentTime > tokenExpiry) {
      console.error(
        `Token for account ${accountIndex} has expired. Token timestamp: ${tokenTimestamp}, Current time: ${currentTime}, Expiry: ${tokenExpiry}`
      )
      return null
    }

    console.log(
      `Using token for account ${accountIndex} (timestamp: ${tokenTimestamp}, expires: ${tokenExpiry})`
    )

    return token
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.error(`Auth tokens file '${tokensFile}' not found`)
      console.error("Run the auth-token generation script first")
    } else {
      console.error(`Error reading auth tokens: ${error.message || error}`)
    }
    return null
  }
}

/**
 * Prints the current valid auth token for an account
 */
async function main() {
  const accountIndex = process.env.ACCOUNT_INDEX
    ? parseInt(process.env.ACCOUNT_INDEX)
    : null

  if (!accountIndex) {
    console.error("ACCOUNT_INDEX environment variable is required")
    process.exit(1)
  }

  const tokensFile = process.argv[2] || "auth-tokens.json"
  const token = getCurrentAuthToken(accountIndex, tokensFile)

  if (token) {
    console.log(`\nAuth Token for account ${accountIndex}:`)
    console.log(token)
  } else {
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Unhandled error:", error)
    process.exit(1)
  })
}
