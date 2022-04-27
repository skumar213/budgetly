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
  await db.sync({ force: false }); // will not clear db
  console.log("db synced!");

  const todayDate = new Date();

  const dueDate = new Date(
    `${todayDate.getMonth() + 1}/25/${todayDate.getFullYear()}`
  );
  const paidDate = new Date(
    `${todayDate.getMonth() + 1}/20/${todayDate.getFullYear()}`
  );
  const createdAt = new Date(
    `${todayDate.getMonth() + 1}/1/${todayDate.getFullYear()}`
  );

  function randomRange(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  // Creating current month Expenses
  const expenses = await Promise.all([
    Expense.create({
      merchant: "apt rent",
      amount: randomRange(1500, 1400),
      dueDate,
      paidDate,
    }),
    Expense.create({
      merchant: "peco",
      amount: randomRange(300, 200),
      dueDate,
      paidDate,
    }),
    Expense.create({
      merchant: "whole Foods",
      amount: randomRange(600, 500),
      dueDate,
      paidDate,
    }),
    Expense.create({
      merchant: "Watching a movie with friends",
      amount: randomRange(50, 40),
      dueDate,
      paidDate,
    }),
    Expense.create({
      merchant: "Savings for the month",
      amount: randomRange(500, 400),
      dueDate,
      paidDate,
    }),
    Expense.create({
      merchant: "Gym Membership",
      amount: randomRange(30, 20),
      dueDate,
      paidDate,
    }),
  ]);

  const outstandingExpenses = await Promise.all([
    Expense.create({
      merchant: "Cell phone",
      amount: randomRange(100, 50),
      dueDate,
      repeat: true,
    }),
    Expense.create({
      merchant: "Costco",
      amount: randomRange(80, 40),
      dueDate,
    }),
  ]);

  // Creating current months budgets
  const budgets = await Promise.all([
    Budget.create({ amount: 1500, createdAt }),
    Budget.create({ amount: 110, createdAt }),
    Budget.create({ amount: 750, createdAt }),
    Budget.create({ amount: 150, createdAt }),
    Budget.create({ amount: 500, createdAt }),
    Budget.create({ amount: 100, createdAt }),
  ]);

  const categories = await Category.findAll({});

  // Assigning user to expenses/investments and each expense to a category
  const user = await User.findOne({
    where: {
      email: "mike@gmail.com",
    },
  });

  //adding paid expenses for current month to user
  for (let i = 0; i < expenses.length; i++) {
    //setting category for expenses
    await expenses[i].setCategory(categories[i]);

    //setting category for budgets
    await budgets[i].setCategory(categories[i]);

    //adding expenses and budgets to user
    await user.addExpense(expenses[i]);
    await user.addBudget(budgets[i]);
  }

  //adding unpaid expesnes for current month to user
  for (let i = 0; i < outstandingExpenses.length; i++) {
    await outstandingExpenses[i].setCategory(categories[i + 1]);
    await user.addExpense(outstandingExpenses[i]);
  }

  //removes one budget and expense for current and previous month
  budgets[1].destroy();
  expenses[1].destroy();

  console.log(`seed updated successfully`);
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
