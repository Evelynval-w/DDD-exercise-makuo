import { logError } from "./logger.js"
//============================================================================
// EXERCISE 6: Temporal Logic Error - Operating Hours
//
// ANTI-PATTERN: Representing domain-specific time concepts as raw numbers.
// Two problems: (1) invalid values (25, -5) are accepted, and (2) the
// business logic for "is the restaurant open?" is wrong for overnight spans.
//
// DDD FIX: Encapsulate the concept of "operating hours" in a Value Object
// that owns its own validation AND its own logic.
//
// HINT - Value Object with behavior:
//   type Hour = number & { readonly __brand: unique symbol }
//   function createHour(h: number): Hour {
//       if (!Number.isInteger(h) || h < 0 || h > 23)
//           throw new Error("Hour must be 0-23")
//       return h as Hour
//   }
//
//   class OperatingHours {
//       private constructor(
//           public readonly opens: Hour,
//           public readonly closes: Hour,
//       ) {}
//
//       static create(opens: number, closes: number): OperatingHours {
//           return new OperatingHours(createHour(opens), createHour(closes))
//       }
//
//       isOpenAt(hour: Hour): boolean {
//           // Handles midnight crossover correctly
//           if (this.opens <= this.closes) {
//               return hour >= this.opens && hour < this.closes
//           }
//           return hour >= this.opens || hour < this.closes
//       }
//   }
//
// KEY INSIGHT: In DDD, domain logic lives inside the domain objects, not in
// external utility functions. OperatingHours knows how to answer "am I open?"
// because that question is part of its domain responsibility.
// ============================================================================

type Hour = number & { readonly __brand: unique symbol }

function createHour(h: number): Hour {
    if (!Number.isInteger(h) || h < 0 || h > 23)
        throw new Error(`Hour must be 0-23: ${h}`)
    return h as Hour
}

class OperatingHours {
    private constructor(
        public readonly opens: Hour,
        public readonly closes: Hour,
    ) {}

    static create(opens: number, closes: number): OperatingHours {
        return new OperatingHours(createHour(opens), createHour(closes))
    }

    isOpenAt(hour: Hour): boolean {
        // Handles midnight crossover correctly
        if (this.opens <= this.closes) {
            return hour >= this.opens && hour < this.closes
        }
        return hour >= this.opens || hour < this.closes
    }
}

type Restaurant = {
    name: string
    hours: OperatingHours
}

export function exercise6_TemporalLogic() {
    // Test 1: Overnight restaurant - logic should work correctly now
    try {
        const restaurant: Restaurant = {
            name: "Joe's Diner",
            hours: OperatingHours.create(22, 6),  // Opens 10 PM, closes 6 AM
        }

        const testHour = createHour(2)  // 2 AM
        const isOpen = restaurant.hours.isOpenAt(testHour)

        if (isOpen) {
            console.log(`✓ Exercise 6: ${restaurant.name} is correctly OPEN at 2 AM`)
        } else {
            logError(6, "Operating hours logic broken for overnight restaurants", {
                restaurant: restaurant.name,
                testHour: 2,
                isOpenCalculated: isOpen,
                issue: "Simple comparison fails when hours cross midnight!",
            })
        }
    } catch (error) {
        console.log(`✗ Exercise 6: Unexpected error - ${(error as Error).message}`)
    }

    // Test 2: Invalid hours - should be rejected
    try {
        const brokenRestaurant: Restaurant = {
            name: "Broken Cafe",
            hours: OperatingHours.create(25, -5),  // Invalid hours!
        }

        logError(6, "Invalid hours accepted without validation", {
            restaurant: brokenRestaurant,
            issue: "Hours should be 0-23 only!",
        })
    } catch (error) {
        console.log(`✓ Exercise 6: Correctly rejected - ${(error as Error).message}`)
    }
}
