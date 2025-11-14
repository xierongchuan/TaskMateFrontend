// Test to demonstrate the problem with falsy values

console.log("Testing falsy value issue:");
console.log("================================");

// Simulating the current filter logic
const filters = {
  dealership_id: 0  // Second dealership might have ID 0
};

// Current code logic (BROKEN)
const currentLogic = filters.dealership_id || undefined;
console.log("Current logic (dealership_id || undefined):");
console.log("  filters.dealership_id:", filters.dealership_id);
console.log("  Result:", currentLogic);
console.log("  Expected: 0, Got:", currentLogic);
console.log("");

// Fixed logic
const fixedLogic = filters.dealership_id !== null && filters.dealership_id !== undefined
  ? filters.dealership_id
  : undefined;
console.log("Fixed logic (explicit null/undefined check):");
console.log("  filters.dealership_id:", filters.dealership_id);
console.log("  Result:", fixedLogic);
console.log("  Expected: 0, Got:", fixedLogic);
console.log("");

// Alternative fix using nullish coalescing
const alternativeFix = filters.dealership_id ?? undefined;
console.log("Alternative fix (nullish coalescing ??):");
console.log("  filters.dealership_id:", filters.dealership_id);
console.log("  Result:", alternativeFix);
console.log("  Expected: 0, Got:", alternativeFix);
console.log("");

// Test with other values
console.log("Testing with null:");
const nullTest = { dealership_id: null };
console.log("  ?? operator:", nullTest.dealership_id ?? undefined);
console.log("");

console.log("Testing with undefined:");
const undefinedTest = { dealership_id: undefined };
console.log("  ?? operator:", undefinedTest.dealership_id ?? undefined);
console.log("");

console.log("Testing with 1:");
const oneTest = { dealership_id: 1 };
console.log("  ?? operator:", oneTest.dealership_id ?? undefined);
console.log("");

console.log("Testing with empty string:");
const emptyStringTest = { dealership_id: '' };
console.log("  ?? operator:", emptyStringTest.dealership_id ?? undefined);
console.log("  (empty string is preserved, which is correct)");
