import { logError } from "./logger.js"
//============================================================================
// EXERCISE 5: The Identity Crisis - Order IDs
//
// ANTI-PATTERN: Using a plain `string` for an identifier. Nothing enforces
// format, non-emptiness, or uniqueness. Duplicate and empty IDs slip through.
//
// DDD FIX: Model identity as a dedicated Value Object with a controlled
// creation strategy. In DDD, the identity of an Entity is a first-class
// concept -- it deserves its own type.
//
// HINT - Branded type + factory:
//   type OrderId = string & { readonly __brand: unique symbol }
//
//   // Option A: Enforce a format (e.g., "ORD-" prefix + numeric)
//   function createOrderId(raw: string): OrderId {
//       if (!/^ORD-\d{5,}$/.test(raw))
//           throw new Error("OrderId must match ORD-XXXXX format")
//       return raw as OrderId
//   }
//
//   // Option B: Generate guaranteed-unique IDs (UUID-based)
//   function generateOrderId(): OrderId {
//       return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` as OrderId
//   }
//
// For uniqueness across a collection, use a Repository pattern: the
// Repository is responsible for ensuring no two Entities share an ID.
// This separates identity validation (Value Object) from uniqueness
// enforcement (Repository).
// ============================================================================

type OrderId = string & { readonly __brand: unique symbol }

function createOrderId(raw: string): OrderId {
    if (!/^ORD-\d{5,}$/.test(raw))
        throw new Error(`OrderId must match ORD-XXXXX format: ${raw}`)
    return raw as OrderId
}

function generateOrderId(): OrderId {
    return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` as OrderId
}

export function exercise5_IdentityCrisis() {
    type Order = {
        orderId: OrderId
        customerName: string
        total: number
    }

    // Test 1: Empty ID
    try {
        const order: Order = {
            orderId: createOrderId(""),
            customerName: "Alice",
            total: 25,
        }
        logError(5, "Empty ID accepted", { order })
    } catch (error) {
        console.log(`✓ Exercise 5: Correctly rejected - ${(error as Error).message}`)
    }

    // Test 2: Invalid format
    try {
        const order: Order = {
            orderId: createOrderId("12345"),
            customerName: "Bob",
            total: 30,
        }
        logError(5, "Invalid format accepted", { order })
    } catch (error) {
        console.log(`✓ Exercise 5: Correctly rejected - ${(error as Error).message}`)
    }

    // Test 3: Another invalid format
    try {
        const order: Order = {
            orderId: createOrderId("not-a-number"),
            customerName: "Diana",
            total: 20,
        }
        logError(5, "Invalid format accepted", { order })
    } catch (error) {
        console.log(`✓ Exercise 5: Correctly rejected - ${(error as Error).message}`)
    }

    // Test 4: Valid order with proper format
    try {
        const validOrder: Order = {
            orderId: createOrderId("ORD-12345"),
            customerName: "Eve",
            total: 50,
        }
        console.log(`✓ Exercise 5: Valid order created - ${validOrder.orderId}`)
    } catch (error) {
        console.log(`✗ Exercise 5: Unexpected error - ${(error as Error).message}`)
    }

    // Test 5: Auto-generated ID (always unique)
    const autoOrder: Order = {
        orderId: generateOrderId(),
        customerName: "Frank",
        total: 35,
    }
    console.log(`✓ Exercise 5: Auto-generated order ID - ${autoOrder.orderId}`)
}
