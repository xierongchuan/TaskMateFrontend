# Solution Summary: Dealership Filter Fix

## Issue
When filtering tasks by dealership on the Tasks page, searching for tasks from the second dealership (ID=0) returned no results, even though the tasks existed in the system.

## Root Cause
The bug was in `src/pages/TasksPage.tsx` line 53:

```typescript
dealership_id: filters.dealership_id || undefined,
```

**Problem:** The logical OR operator (`||`) treats the value `0` as falsy and converts it to `undefined`. This means when a user selects a dealership with ID=0, the parameter is not sent to the API.

### JavaScript Falsy Values
In JavaScript, these values are considered "falsy":
- `0`
- `""` (empty string)
- `false`
- `null`
- `undefined`
- `NaN`

When using `||`, any falsy value on the left side causes the operator to return the right side:
```javascript
0 || undefined      // returns: undefined ❌
1 || undefined      // returns: 1 ✓
```

## Solution
Changed the operator from `||` to `??` (nullish coalescing) for the `dealership_id` parameter:

```typescript
dealership_id: filters.dealership_id ?? undefined,
```

### Nullish Coalescing Operator (`??`)
The `??` operator only treats `null` and `undefined` as "nullish", preserving all other values:

```javascript
0 ?? undefined      // returns: 0 ✓
null ?? undefined   // returns: undefined ✓
undefined ?? undefined  // returns: undefined ✓
1 ?? undefined      // returns: 1 ✓
```

## Why Not Change All Filters?
String filters (`search`, `status`, etc.) intentionally use `||` because empty strings should be converted to `undefined` to avoid sending them to the API. Only numeric filters like `dealership_id` need `??`.

## Testing
Created `experiments/test-filter-fix.js` to verify the fix:
- ✓ Dealership ID = 0: correctly passed to API (was: undefined, now: 0)
- ✓ Dealership ID = 1, 2, 3: continue to work as before
- ✓ Dealership ID = null: correctly converts to undefined (show all)
- ✓ Combined filters work correctly

## Code Quality
- ✅ ESLint found no errors in the modified file
- ✅ Code conforms to TypeScript interfaces
- ✅ Other filter functionality unaffected

## Files Changed
- `src/pages/TasksPage.tsx` (1 line changed)

## Commit
```
fix(tasks): исправлен фильтр по автосалонам для ID=0
```

## Result
The dealership filter now works correctly for **all** dealerships, including those with ID=0! 🎉
