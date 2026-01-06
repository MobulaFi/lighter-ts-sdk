/**
 * Root level of event_info structure
 */
export interface EventInfo {
  /** m: MarketId - Market ID where the transaction occurred */
  m: number

  /** gt: Grouping type (for grouped orders) - inferred, not in official structs */
  gt?: number

  /** i: Array of order indices (for grouped orders) - inferred, not in official structs */
  i?: number[]

  /** t: Trade - Trade information */
  t: TradeInfo

  /** mo: Maker order information */
  mo: OrderInfo

  /** to: Taker order information */
  to: OrderInfo

  /** ae: AppError - Application error (JSON string if error occurred) */
  ae: string

  /** oe: Order event (outer event structure, appears in some responses) - inferred */
  oe?: OrderEvent

  /** oo: OldOrder - Old order (for ModifyOrder transactions) */
  oo?: OrderInfo

  /** no: NewOrder - New order (for ModifyOrder transactions) */
  no?: OrderInfo
}

/**
 * Trade information
 * Based on official Go Trade struct
 */
export interface TradeInfo {
  /** p: Price - Price at which the trade occurred */
  p: number

  /** s: Size - Size/amount of the trade */
  s: number

  /** tf: TakerFee - Fee paid by the taker */
  tf: number

  /** mf: MakerFee - Fee paid by the maker */
  mf: number
}

/**
 * Order information (used for both maker and taker orders)
 * Based on official Go Order struct
 */
export interface OrderInfo {
  /** i: OrderIndex - Unique order index */
  i: number

  /** u: ClientOrderIndex - Client order index */
  u: number

  /** a: OwnerAccountId - Owner account ID */
  a: number

  /** is: InitialBaseAmount - Initial base amount */
  is: number

  /** p: Price - Order price */
  p: number

  /** rs: RemainingBaseAmount - Remaining base amount */
  rs: number

  /** ia: IsAsk - Is ask order (1 for ask/sell, 0 for bid/buy) */
  ia: number

  /** ot: Type - Order type
   * 0 = Limit
   * 1 = Market
   * 2 = Stop Loss
   * 3 = Stop Loss Limit
   * 4 = Take Profit
   * 5 = Take Profit Limit
   * 6 = TWAP
   */
  ot: number

  /** f: TimeInForce - Time in force
   * 0 = IOC (Immediate or Cancel)
   * 1 = GTT (Good Till Time)
   * 2 = PostOnly
   */
  f: number

  /** ro: ReduceOnly - Reduce only flag (1 if true, 0 if false) */
  ro: number

  /** tp: TriggerPrice - Trigger price for stop-loss/take-profit orders */
  tp: number

  /** e: Expiry - Expiry timestamp */
  e: number

  /** st: Status - Order status
   * 0 = in-progress
   * 1 = pending
   * 2 = open
   * 3 = filled
   * 4 = canceled
   * 5 = canceled-post-only
   * 6 = canceled-reduce-only
   * 7 = canceled-position-not-allowed
   * 8 = canceled-margin-not-allowed
   * 9 = canceled-too-much-slippage
   * 10 = canceled-not-enough-liquidity
   * 11 = canceled-self-trade
   * 12 = canceled-expired
   * 13 = canceled-oco
   * 14 = canceled-child
   * 15 = canceled-liquidation
   * 16 = canceled-invalid-balance
   */
  st: number

  /** ts: TriggerStatus - Trigger status (for conditional orders) */
  ts: number

  /** t0: ToTriggerOrderIndex0 - To trigger order index 0 (for OCO orders) */
  t0: number

  /** t1: ToTriggerOrderIndex1 - To trigger order index 1 (for OCO orders) */
  t1: number

  /** c0: ToCancelOrderIndex0 - To cancel order index 0 (for OCO orders) */
  c0: number
}

/**
 * Order event structure (appears in some transaction responses)
 * This structure wraps the order event data
 */
export interface OrderEvent {
  /** m: MarketId - Market ID */
  m: number

  /** t: Trade - Trade information */
  t: TradeInfo

  /** mo: Maker order information */
  mo: OrderInfo

  /** to: Taker order information */
  to: OrderInfo

  /** ae: AppError - Application error */
  ae: string
}

/**
 * CancelOrder structure (for cancel order transactions)
 * Based on official Go CancelOrder struct
 */
export interface CancelOrderInfo {
  /** a: AccountId - Account ID */
  a: number

  /** i: OrderIndex - Order index to cancel */
  i: number

  /** u: ClientOrderIndex - Client order index */
  u: number

  /** ae: AppError - Application error if any */
  ae: string
}

/**
 * ModifyOrder structure (for modify order transactions)
 * Based on official Go ModifyOrder struct
 */
export interface ModifyOrderInfo {
  /** m: MarketId - Market ID */
  m: number

  /** oo: OldOrder - Old order */
  oo: OrderInfo

  /** no: NewOrder - New order */
  no: OrderInfo

  /** ae: AppError - Application error if any */
  ae: string
}

/**
 * Helper function to parse event_info string
 */
export function parseEventInfo(eventInfoString: string): EventInfo {
  return typeof eventInfoString === "string"
    ? JSON.parse(eventInfoString)
    : eventInfoString
}

/**
 * Helper function to get order status name
 */
export function getOrderStatusName(statusCode: number): string {
  const statusMap: { [key: number]: string } = {
    0: "in-progress",
    1: "pending",
    2: "open",
    3: "filled",
    4: "canceled",
    5: "canceled-post-only",
    6: "canceled-reduce-only",
    7: "canceled-position-not-allowed",
    8: "canceled-margin-not-allowed",
    9: "canceled-too-much-slippage",
    10: "canceled-not-enough-liquidity",
    11: "canceled-self-trade",
    12: "canceled-expired",
    13: "canceled-oco",
    14: "canceled-child",
    15: "canceled-liquidation",
    16: "canceled-invalid-balance",
  }
  return statusMap[statusCode] || `unknown-status-${statusCode}`
}

/**
 * Helper function to get order type name
 */
export function getOrderTypeName(orderType: number): string {
  const typeMap: { [key: number]: string } = {
    0: "limit",
    1: "market",
    2: "stop-loss",
    3: "stop-loss-limit",
    4: "take-profit",
    5: "take-profit-limit",
    6: "twap",
  }
  return typeMap[orderType] || `unknown-type-${orderType}`
}

/**
 * Helper function to parse account error if present
 */
export function parseAccountError(
  ae: string
): { code?: number; message?: string } | null {
  if (!ae || ae === "") {
    return null
  }
  try {
    return JSON.parse(ae)
  } catch {
    return { message: ae }
  }
}

/**
 * Helper function to get time in force name
 */
export function getTimeInForceName(timeInForce: number): string {
  const tifMap: { [key: number]: string } = {
    0: "IOC", // Immediate or Cancel
    1: "GTT", // Good Till Time
    2: "PostOnly", // Post Only
  }
  return tifMap[timeInForce] || `unknown-time-in-force-${timeInForce}`
}

/**
 * Helper function to get transaction status name
 */
export function getTransactionStatusName(status: number): string {
  const statusMap: { [key: number]: string } = {
    0: "Failed",
    1: "Pending",
    2: "Executed",
    3: "Pending - Final State",
  }
  return statusMap[status] || `unknown-transaction-status-${status}`
}

/**
 * Transformed order information with full property names
 */
export interface TransformedOrderInfo {
  orderIndex: number
  clientOrderIndex: number
  ownerAccountId: number
  initialBaseAmount: number
  price: number
  remainingBaseAmount: number
  isAsk: number
  type: number
  timeInForce: number
  reduceOnly: number
  triggerPrice: number
  expiry: number
  status: number
  triggerStatus: number
  toTriggerOrderIndex0: number
  toTriggerOrderIndex1: number
  toCancelOrderIndex0: number
}

/**
 * Transformed trade information with full property names
 */
export interface TransformedTradeInfo {
  price: number
  size: number
  takerFee: number
  makerFee: number
}

/**
 * Transformed order event with full property names
 */
export interface TransformedOrderEvent {
  marketId: number
  trade?: TransformedTradeInfo
  makerOrder?: TransformedOrderInfo
  takerOrder?: TransformedOrderInfo
  appError?: string
}

/**
 * Transformed event information with full property names
 */
export interface TransformedEventInfo {
  marketId: number
  groupingType?: number
  orderIndices?: number[]
  trade?: TransformedTradeInfo
  makerOrder?: TransformedOrderInfo
  takerOrder?: TransformedOrderInfo
  appError?: string
  orderEvent?: TransformedOrderEvent
  oldOrder?: TransformedOrderInfo
  newOrder?: TransformedOrderInfo
}

/**
 * Transforms an OrderInfo object from abbreviated keys to full property names
 */
function transformOrderInfo(order: OrderInfo): TransformedOrderInfo {
  return {
    orderIndex: order.i,
    clientOrderIndex: order.u,
    ownerAccountId: order.a,
    initialBaseAmount: order.is,
    price: order.p,
    remainingBaseAmount: order.rs,
    isAsk: order.ia,
    type: order.ot,
    timeInForce: order.f,
    reduceOnly: order.ro,
    triggerPrice: order.tp,
    expiry: order.e,
    status: order.st,
    triggerStatus: order.ts,
    toTriggerOrderIndex0: order.t0,
    toTriggerOrderIndex1: order.t1,
    toCancelOrderIndex0: order.c0,
  }
}

/**
 * Transforms a TradeInfo object from abbreviated keys to full property names
 */
function transformTradeInfo(trade: TradeInfo): TransformedTradeInfo {
  return {
    price: trade.p,
    size: trade.s,
    takerFee: trade.tf,
    makerFee: trade.mf,
  }
}

/**
 * Transforms an EventInfo object from abbreviated keys to full property names
 * This makes the event_info structure much more readable
 */
export function transformEventInfo(eventInfo: EventInfo): TransformedEventInfo {
  const result: TransformedEventInfo = {
    marketId: eventInfo.m,
  }

  if (eventInfo.gt !== undefined) {
    result.groupingType = eventInfo.gt
  }

  if (eventInfo.i !== undefined) {
    result.orderIndices = eventInfo.i
  }

  if (eventInfo.t) {
    result.trade = transformTradeInfo(eventInfo.t)
  }

  if (eventInfo.mo) {
    result.makerOrder = transformOrderInfo(eventInfo.mo)
  }

  if (eventInfo.to) {
    result.takerOrder = transformOrderInfo(eventInfo.to)
  }

  if (eventInfo.ae) {
    result.appError = eventInfo.ae
  }

  if (eventInfo.oe) {
    result.orderEvent = {
      marketId: eventInfo.oe.m,
      trade: eventInfo.oe.t ? transformTradeInfo(eventInfo.oe.t) : undefined,
      makerOrder: eventInfo.oe.mo
        ? transformOrderInfo(eventInfo.oe.mo)
        : undefined,
      takerOrder: eventInfo.oe.to
        ? transformOrderInfo(eventInfo.oe.to)
        : undefined,
      appError: eventInfo.oe.ae,
    }
  }

  if (eventInfo.oo) {
    result.oldOrder = transformOrderInfo(eventInfo.oo)
  }

  if (eventInfo.no) {
    result.newOrder = transformOrderInfo(eventInfo.no)
  }

  return result
}
