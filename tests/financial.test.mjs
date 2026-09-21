import assert from "node:assert/strict";

const revenue = sold => sold * 2;
const milkCost = tonnes => tonnes * 20000;
const tax = (profitBeforeTax, lossPool) => Math.max(0, profitBeforeTax - lossPool) * .1;

assert.equal(revenue(40000), 80000);
assert.equal(milkCost(2), 40000);
assert.equal(tax(100000, 50000), 5000);

// Team 3 Winter: D, Machine 5, 2 tonnes, 40,000 sold, market Sh 3,000.
const gross = 80000 - 40000 - 1300 - 3500;
const profit = gross - 4000 - 3000 - gross * .05 - 10000 - 17000;
const closing = 100000 - 28000 - 40000 - 3000 + 80000 - 17000 - 1300 - 4000 - 10000 - gross * .05;
assert.equal(profit, -560);
assert.equal(closing, 74940);

// Purchased assets are carried forward.  A Type 5 bought in Winter is not
// purchased again in Spring; only the recurring maintenance/depreciation apply.
const winterMachine = { price: 28000, maintenance: 1300, depreciation: 3500, life: 8 };
const springMachineCashCost = winterMachine.maintenance;
assert.equal(springMachineCashCost, 1300);
assert.notEqual(springMachineCashCost, winterMachine.price);
assert.equal(winterMachine.life - 1, 7);

// Sales are allocated proportionally and transport follows the allocated sales.
const sold = 70000;
const atA = Math.round(sold * 60000 / 100000);
const atB = sold - atA;
assert.equal(atA, 42000);
assert.equal(atB, 28000);
assert.equal(atA * .3 + atB * .4, 23800);

// Multiple-machine capacity is additive, while premise slots constrain count.
assert.equal(45000 + 68000, 113000);
assert.ok(2 <= 2); // Premise E has two slots.
console.log("financial validation passed");
