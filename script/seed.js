"use strict";

const {
  db,
  models: { User, Category, Expense, Budget, Investment, MonthlyIncome },
} = require("../server/db");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  // Creating Users
  const users = await Promise.all([
    User.create({
      email: "cody@gmail.com",
      password: "123",
      firstName: "cody",
      lastName: "pug",
      monthlyIncome: 4000.0,
      isAdmin: true,
    }),
    User.create({
      email: "murphy@gmail.com",
      password: "123",
      firstName: "murphy",
      lastName: "bulldog",
      monthlyIncome: 2000.0,
    }),
  ]);

  // Creating Categories
  const categories = await Promise.all([
    Category.create({ name: "Rent" }),
    Category.create({ name: "Utilites" }),
    Category.create({ name: "Groceries" }),
  ]);

  // Creating Expenses
  const expenses = await Promise.all([
    Expense.create({
      merchant: "apt rent",
      amount: 2000,
      dueDate: "2022-03-25",
      paidDate: "2022-03-20",
    }),
    Expense.create({ merchant: "peco", amount: 200, dueDate: "2022-03-25" }),
    Expense.create({
      merchant: "whole Foods",
      amount: 100,
      dueDate: "2022-03-25",
      isRepeat: true,
    }),
  ]);

  // Creating Budgets
  const budgets = await Promise.all([
    Budget.create({ amount: 250, createdAt: "1/1/2022" }),
    Budget.create({ amount: 2000, createdAt: "1/1/2022" }),
    Budget.create({ amount: 750, createdAt: "1/1/2022" }),
    Budget.create({ amount: 250, createdAt: "2/1/2022" }),
    Budget.create({ amount: 2000, createdAt: "2/1/2022" }),
    Budget.create({ amount: 750, createdAt: "2/1/2022" }),
  ]);

  // Creating Investments
  const investments = await Promise.all([
    Investment.create({ tickerSymbol: "aapl", buyPrice: 160, totalShares: 2 }),
    Investment.create({ tickerSymbol: "tsla", buyPrice: 930, totalShares: 5 }),
    Investment.create({ tickerSymbol: "msft", buyPrice: 297, totalShares: 1 }),
  ]);

  // Creating Monthly Income
  const monthlyIncomes = await Promise.all([
    MonthlyIncome.create({ amount: 3000, createdAt: "12/1/2021" }),
    MonthlyIncome.create({ amount: 4000, createdAt: "1/1/2022" }),
    MonthlyIncome.create({ amount: 5000, createdAt: "2/1/2022" }),
  ]);

  // Assigning user to expenses/investments and each expense to a category
  const user = await User.findByPk(1);

  for (let i = 0; i < expenses.length; i++) {
    //setting category for expenses
    await expenses[i].setCategory(categories[i]);

    //setting category for budgets
    await budgets[i].setCategory(categories[i]);
    await budgets[i+3].setCategory(categories[i])

    //adding expenses, investments, monthly incomes, and budgets to user
    await user.addExpense(expenses[i]);
    await user.addBudget(budgets[i]);
    await user.addBudget(budgets[i+3]);
    await user.addInvestment(investments[i]);
    await user.addMonthlyIncome(monthlyIncomes[i]);
  }

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${categories.length} categories`);
  console.log(`seeded ${expenses.length} expenses`);

  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
