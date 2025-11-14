// Test to verify the dealership filter fix

console.log("=== DEALERSHIP FILTER FIX VERIFICATION ===\n");

// Simulate the filter building logic
function buildFiltersOLD(filters) {
  return {
    search: filters.search || undefined,
    status: filters.status || undefined,
    recurrence: filters.recurrence || undefined,
    task_type: filters.task_type || undefined,
    response_type: filters.response_type || undefined,
    dealership_id: filters.dealership_id || undefined,  // BUG: treats 0 as falsy
  };
}

function buildFiltersNEW(filters) {
  return {
    search: filters.search || undefined,
    status: filters.status || undefined,
    recurrence: filters.recurrence || undefined,
    task_type: filters.task_type || undefined,
    response_type: filters.response_type || undefined,
    dealership_id: filters.dealership_id ?? undefined,  // FIX: only null/undefined are converted
  };
}

// Test cases
const testCases = [
  {
    name: "Dealership ID = 0 (the bug case)",
    filters: {
      search: '',
      status: '',
      recurrence: '',
      task_type: '',
      response_type: '',
      dealership_id: 0,
    },
    expectedDealershipId: 0
  },
  {
    name: "Dealership ID = 1",
    filters: {
      search: '',
      status: '',
      recurrence: '',
      task_type: '',
      response_type: '',
      dealership_id: 1,
    },
    expectedDealershipId: 1
  },
  {
    name: "Dealership ID = 2",
    filters: {
      search: '',
      status: '',
      recurrence: '',
      task_type: '',
      response_type: '',
      dealership_id: 2,
    },
    expectedDealershipId: 2
  },
  {
    name: "Dealership ID = null (show all)",
    filters: {
      search: '',
      status: '',
      recurrence: '',
      task_type: '',
      response_type: '',
      dealership_id: null,
    },
    expectedDealershipId: undefined
  },
  {
    name: "With search and dealership ID = 0",
    filters: {
      search: 'test task',
      status: '',
      recurrence: '',
      task_type: '',
      response_type: '',
      dealership_id: 0,
    },
    expectedDealershipId: 0
  }
];

// Run tests
testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log("─".repeat(50));

  const oldResult = buildFiltersOLD(testCase.filters);
  const newResult = buildFiltersNEW(testCase.filters);

  console.log("OLD behavior (with ||):");
  console.log("  dealership_id:", oldResult.dealership_id);
  console.log("  Expected:", testCase.expectedDealershipId);
  const oldPass = oldResult.dealership_id === testCase.expectedDealershipId;
  console.log("  Status:", oldPass ? "✓ PASS" : "✗ FAIL");

  console.log("\nNEW behavior (with ??):");
  console.log("  dealership_id:", newResult.dealership_id);
  console.log("  Expected:", testCase.expectedDealershipId);
  const newPass = newResult.dealership_id === testCase.expectedDealershipId;
  console.log("  Status:", newPass ? "✓ PASS" : "✗ FAIL");

  console.log("\n");
});

// Summary
console.log("=== SUMMARY ===");
console.log("The fix changes dealership_id from || to ?? operator");
console.log("This ensures that dealership_id = 0 is preserved and sent to the API");
console.log("While null and undefined are still converted to undefined (not sent to API)");
console.log("\nThis fixes the bug where the second dealership (ID 0) couldn't be filtered.");
