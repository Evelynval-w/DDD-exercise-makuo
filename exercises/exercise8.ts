import { logError } from "./logger.js"
//============================================================================
// EXERCISE 8: The Email Validation Gap
//
// ANTI-PATTERN: Using `string` for email. TypeScript's type system cannot
// distinguish "alice@example.com" from "not-an-email" -- they're both strings.
// Every invalid format silently passes through.
//
// DDD FIX: Apply the "Parse, Don't Validate" principle.
// Instead of validating a string and hoping callers remember to check,
// parse it into a domain type. Once you have an `Email`, it is guaranteed
// valid -- no further checking needed anywhere in the codebase.
//
// HINT:
//   type Email = string & { readonly __brand: unique symbol }
//
//   function parseEmail(raw: string): Email {
//       const trimmed = raw.trim()
//       if (trimmed.length === 0) throw new Error("Email cannot be empty")
//       // Basic structural check: local@domain.tld
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
//           throw new Error(`Invalid email format: "${raw}"`)
//       return trimmed.toLowerCase() as Email
//   }
//
// KEY INSIGHT - "Parse, Don't Validate":
//   - Validation checks a value and returns boolean -> caller can ignore it.
//   - Parsing converts raw input into a strong type or throws -> impossible
//     to have an invalid Email in the system.
//   - This is a core DDD principle: push validation to the boundary of
//     your system (user input, API responses) and work with guaranteed-valid
//     types everywhere else.
// ============================================================================

type Email = string & { readonly __brand: unique symbol }

function parseEmail(raw: string): Email {
    const trimmed = raw.trim()
    if (trimmed.length === 0) throw new Error("Email cannot be empty")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
        throw new Error(`Invalid email format: "${raw}"`)
    return trimmed.toLowerCase() as Email
}

type Customer = {
    name: string
    email: Email
}

export function exercise8_EmailValidation() {
    // Test data - mix of valid and invalid emails
    const testData = [
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "not-an-email" },
        { name: "Charlie", email: "charlie@@double.com" },
        { name: "Diana", email: "@no-local-part.com" },
        { name: "Eve", email: "eve@" },
        { name: "Frank", email: " " },
    ]

    // Parse each entry - valid ones pass, invalid ones are caught
    for (const entry of testData) {
        try {
            const customer: Customer = {
                name: entry.name,
                email: parseEmail(entry.email),
            }
            console.log(`✓ Exercise 8: Valid customer - ${customer.name}: ${customer.email}`)
        } catch (error) {
            console.log(`✓ Exercise 8: Correctly rejected ${entry.name} - ${(error as Error).message}`)
        }
    }
}
