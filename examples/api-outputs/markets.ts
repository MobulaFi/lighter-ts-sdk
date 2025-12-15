const markets = [
  {
    symbol: "PLTR",
    market_index: 111,
  },
  {
    symbol: "PYTH",
    market_index: 78,
  },
  {
    symbol: "SKY",
    market_index: 79,
  },
  {
    symbol: "TRUMP",
    market_index: 15,
  },
  {
    symbol: "SUI",
    market_index: 16,
  },
  {
    symbol: "XRP",
    market_index: 7,
  },
  {
    symbol: "LINK",
    market_index: 8,
  },
  {
    symbol: "NEAR",
    market_index: 10,
  },
  {
    symbol: "DOT",
    market_index: 11,
  },
  {
    symbol: "GBPUSD",
    market_index: 97,
  },
  {
    symbol: "USDCAD",
    market_index: 100,
  },
  {
    symbol: "XLM",
    market_index: 119,
  },
  {
    symbol: "MYX",
    market_index: 80,
  },
  {
    symbol: "1000TOSHI",
    market_index: 81,
  },
  {
    symbol: "0G",
    market_index: 84,
  },
  {
    symbol: "COIN",
    market_index: 109,
  },
  {
    symbol: "AMZN",
    market_index: 114,
  },
  {
    symbol: "XAG",
    market_index: 93,
  },
  {
    symbol: "APEX",
    market_index: 86,
  },
  {
    symbol: "SOL",
    market_index: 2,
  },
  {
    symbol: "WIF",
    market_index: 5,
  },
  {
    symbol: "TON",
    market_index: 12,
  },
  {
    symbol: "USDJPY",
    market_index: 98,
  },
  {
    symbol: "META",
    market_index: 117,
  },
  {
    symbol: "HOOD",
    market_index: 108,
  },
  {
    symbol: "MEGA",
    market_index: 94,
  },
  {
    symbol: "FF",
    market_index: 87,
  },
  {
    symbol: "FIL",
    market_index: 103,
  },
  {
    symbol: "AVNT",
    market_index: 82,
  },
  {
    symbol: "EURUSD",
    market_index: 96,
  },
  {
    symbol: "CC",
    market_index: 101,
  },
  {
    symbol: "EDEN",
    market_index: 89,
  },
  {
    symbol: "UNI",
    market_index: 30,
  },
  {
    symbol: "POPCAT",
    market_index: 23,
  },
  {
    symbol: "BNB",
    market_index: 25,
  },
  {
    symbol: "JUP",
    market_index: 26,
  },
  {
    symbol: "AAVE",
    market_index: 27,
  },
  {
    symbol: "MKR",
    market_index: 28,
  },
  {
    symbol: "ENA",
    market_index: 29,
  },
  {
    symbol: "POL",
    market_index: 14,
  },
  {
    symbol: "1000FLOKI",
    market_index: 19,
  },
  {
    symbol: "BERA",
    market_index: 20,
  },
  {
    symbol: "AI16Z",
    market_index: 22,
  },
  {
    symbol: "DOLO",
    market_index: 75,
  },
  {
    symbol: "LINEA",
    market_index: 76,
  },
  {
    symbol: "ETH/USDC",
    market_index: 2048,
  },
  {
    symbol: "STABLE",
    market_index: 118,
  },
  {
    symbol: "XMR",
    market_index: 77,
  },
  {
    symbol: "ZRO",
    market_index: 60,
  },
  {
    symbol: "GMX",
    market_index: 61,
  },
  {
    symbol: "DYDX",
    market_index: 62,
  },
  {
    symbol: "MNT",
    market_index: 63,
  },
  {
    symbol: "S",
    market_index: 40,
  },
  {
    symbol: "VIRTUAL",
    market_index: 41,
  },
  {
    symbol: "SPX",
    market_index: 42,
  },
  {
    symbol: "TRX",
    market_index: 43,
  },
  {
    symbol: "SYRUP",
    market_index: 44,
  },
  {
    symbol: "PUMP",
    market_index: 45,
  },
  {
    symbol: "LDO",
    market_index: 46,
  },
  {
    symbol: "PENGU",
    market_index: 47,
  },
  {
    symbol: "APT",
    market_index: 31,
  },
  {
    symbol: "SEI",
    market_index: 32,
  },
  {
    symbol: "CRV",
    market_index: 36,
  },
  {
    symbol: "PENDLE",
    market_index: 37,
  },
  {
    symbol: "ONDO",
    market_index: 38,
  },
  {
    symbol: "ADA",
    market_index: 39,
  },
  {
    symbol: "IP",
    market_index: 34,
  },
  {
    symbol: "PAXG",
    market_index: 48,
  },
  {
    symbol: "EIGEN",
    market_index: 49,
  },
  {
    symbol: "ARB",
    market_index: 50,
  },
  {
    symbol: "RESOLV",
    market_index: 51,
  },
  {
    symbol: "GRASS",
    market_index: 52,
  },
  {
    symbol: "ZORA",
    market_index: 53,
  },
  {
    symbol: "LAUNCHCOIN",
    market_index: 54,
  },
  {
    symbol: "ZK",
    market_index: 56,
  },
  {
    symbol: "PROVE",
    market_index: 57,
  },
  {
    symbol: "NVDA",
    market_index: 110,
  },
  {
    symbol: "USELESS",
    market_index: 66,
  },
  {
    symbol: "BCH",
    market_index: 58,
  },
  {
    symbol: "HBAR",
    market_index: 59,
  },
  {
    symbol: "ETHFI",
    market_index: 64,
  },
  {
    symbol: "AERO",
    market_index: 65,
  },
  {
    symbol: "TIA",
    market_index: 67,
  },
  {
    symbol: "MORPHO",
    market_index: 68,
  },
  {
    symbol: "VVV",
    market_index: 69,
  },
  {
    symbol: "AUDUSD",
    market_index: 106,
  },
  {
    symbol: "MSFT",
    market_index: 115,
  },
  {
    symbol: "2Z",
    market_index: 88,
  },
  {
    symbol: "CRO",
    market_index: 73,
  },
  {
    symbol: "NMR",
    market_index: 74,
  },
  {
    symbol: "YZY",
    market_index: 70,
  },
  {
    symbol: "XPL",
    market_index: 71,
  },
  {
    symbol: "MET",
    market_index: 95,
  },
  {
    symbol: "DOGE",
    market_index: 3,
  },
  {
    symbol: "HYPE",
    market_index: 24,
  },
  {
    symbol: "OP",
    market_index: 55,
  },
  {
    symbol: "USDCHF",
    market_index: 99,
  },
  {
    symbol: "GOOGL",
    market_index: 116,
  },
  {
    symbol: "1000PEPE",
    market_index: 4,
  },
  {
    symbol: "AVAX",
    market_index: 9,
  },
  {
    symbol: "ASTER",
    market_index: 83,
  },
  {
    symbol: "ICP",
    market_index: 102,
  },
  {
    symbol: "ZEC",
    market_index: 90,
  },
  {
    symbol: "BTC",
    market_index: 1,
  },
  {
    symbol: "ETH",
    market_index: 0,
  },
  {
    symbol: "STRK",
    market_index: 104,
  },
  {
    symbol: "USDKRW",
    market_index: 105,
  },
  {
    symbol: "AAPL",
    market_index: 113,
  },
  {
    symbol: "TSLA",
    market_index: 112,
  },
  {
    symbol: "TAO",
    market_index: 13,
  },
  {
    symbol: "LTC",
    market_index: 35,
  },
  {
    symbol: "FARTCOIN",
    market_index: 21,
  },
  {
    symbol: "WLD",
    market_index: 6,
  },
  {
    symbol: "1000SHIB",
    market_index: 17,
  },
  {
    symbol: "1000BONK",
    market_index: 18,
  },
  {
    symbol: "KAITO",
    market_index: 33,
  },
  {
    symbol: "NZDUSD",
    market_index: 107,
  },
  {
    symbol: "MON",
    market_index: 91,
  },
  {
    symbol: "STBL",
    market_index: 85,
  },
  {
    symbol: "WLFI",
    market_index: 72,
  },
  {
    symbol: "XAU",
    market_index: 92,
  },
]
