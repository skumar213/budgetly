"use strict";

const {
  db,
  models: { User, Category, Expense, Budget, Investment, MonthlyIncome },
} = require("../server/db");

// sets enviroment variables
require("dotenv").config();

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
      email: "mike@gmail.com",
      password: process.env.SEED_USER_PASS,
      firstName: "Mike",
      lastName: "Bolten",
      isAdmin: true,
    }),
  ]);

  // Creating Categories
  const categories = await Promise.all([
    Category.create({ name: "Rent" }),
    Category.create({ name: "Utilites" }),
    Category.create({ name: "Food" }),
    Category.create({ name: "Entertainment" }),
    Category.create({ name: "Savings" }),
    Category.create({ name: "Misc" }),
  ]);

  // Creating current month Expenses
  const expenses = await Promise.all([
    Expense.create({
      merchant: "apt rent",
      amount: 1500,
      dueDate: new Date("2/25/2022"),
      paidDate: new Date("2/20/2022"),
    }),
    Expense.create({
      merchant: "peco",
      amount: 200,
      dueDate: new Date("2/25/2022"),
      paidDate: new Date("2/20/2022"),
    }),
    Expense.create({
      merchant: "whole Foods",
      amount: 600,
      dueDate: new Date("2/25/2022"),
      paidDate: new Date("2/20/2022"),
    }),
    Expense.create({
      merchant: "Watching a movie with friends",
      amount: 50,
      dueDate: new Date("2/25/2022"),
      paidDate: new Date("2/20/2022"),
    }),
    Expense.create({
      merchant: "Savings for the month",
      amount: 500,
      dueDate: new Date("2/25/2022"),
      paidDate: new Date("2/20/2022"),
    }),
    Expense.create({
      merchant: "Gym Membership",
      amount: 30,
      dueDate: new Date("2/25/2022"),
      paidDate: new Date("2/20/2022"),
    }),
  ]);

  const outstandingExpenses = await Promise.all([
    Expense.create({
      merchant: "Cell phone",
      amount: 100,
      dueDate: new Date("2/25/2022"),
      repeat: true,
    }),
    Expense.create({
      merchant: "Costco",
      amount: 80,
      dueDate: new Date("2/25/2022"),
    }),
  ]);

  //Creating previous months paid expenses
  const prevExpenses = await Promise.all([
    Expense.create({
      merchant: "apt rent",
      amount: 1500,
      dueDate: new Date("1/25/2022"),
      paidDate: new Date("1/20/2022"),
    }),
    Expense.create({
      merchant: "peco",
      amount: 185,
      dueDate: new Date("1/25/2022"),
      paidDate: new Date("1/20/2022"),
    }),
    Expense.create({
      merchant: "whole Foods",
      amount: 430,
      dueDate: new Date("1/25/2022"),
      paidDate: new Date("1/20/2022"),
    }),
    Expense.create({
      merchant: "Concert",
      amount: 95,
      dueDate: new Date("1/25/2022"),
      paidDate: new Date("1/20/2022"),
    }),
    Expense.create({
      merchant: "Savings for the month",
      amount: 400,
      dueDate: new Date("1/25/2022"),
      paidDate: new Date("1/20/2022"),
    }),
    Expense.create({
      merchant: "Gym Membership",
      amount: 30,
      dueDate: new Date("1/25/2022"),
      paidDate: new Date("1/20/2022"),
    }),
  ]);

  const prevOutstandingExpenses = await Promise.all([
    Expense.create({
      merchant: "Cell phone",
      amount: 100,
      dueDate: new Date("1/25/2022"),
      repeat: true,
    }),
    Expense.create({
      merchant: "Costco",
      amount: 80,
      dueDate: new Date("1/25/2022"),
    }),
  ]);

  // Creating current months budgets
  const budgets = await Promise.all([
    Budget.create({ amount: 1500, createdAt: new Date("2/1/2022") }),
    Budget.create({ amount: 110, createdAt: new Date("2/1/2022") }),
    Budget.create({ amount: 750, createdAt: new Date("2/1/2022") }),
    Budget.create({ amount: 150, createdAt: new Date("2/1/2022") }),
    Budget.create({ amount: 500, createdAt: new Date("2/1/2022") }),
    Budget.create({ amount: 100, createdAt: new Date("2/1/2022") }),
  ]);

  // Creating previous months budgets
  const prevBudgets = await Promise.all([
    Budget.create({ amount: 1500, createdAt: new Date("1/1/2022") }),
    Budget.create({ amount: 110, createdAt: new Date("1/1/2022") }),
    Budget.create({ amount: 700, createdAt: new Date("1/1/2022") }),
    Budget.create({ amount: 150, createdAt: new Date("1/1/2022") }),
    Budget.create({ amount: 500, createdAt: new Date("1/1/2022") }),
    Budget.create({ amount: 100, createdAt: new Date("1/1/2022") }),
  ]);

  // Creating Investments
  const investments = await Promise.all([
    Investment.create({
      tickerSymbol: "aapl",
      buyPrice: 160,
      totalShares: 2,
      currentPrice: 169.2,
    }),
    Investment.create({
      tickerSymbol: "tsla",
      buyPrice: 930,
      totalShares: 5,
      currentPrice: 887.15,
    }),
    Investment.create({
      tickerSymbol: "msft",
      buyPrice: 297,
      totalShares: 1,
      currentPrice: 291.81,
    }),
  ]);

  // Creating Monthly Incomes
  const monthlyIncomes = await Promise.all([
    MonthlyIncome.create({ amount: 3000, createdAt: new Date("12/1/2021") }),
    MonthlyIncome.create({ amount: 4000, createdAt: new Date("1/1/2022") }),
    MonthlyIncome.create({ amount: 5000, createdAt: new Date("2/1/2022") }),
  ]);

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

  //adding expenses for previous month to user
  for (let i = 0; i < prevExpenses.length; i++) {
    //setting category for expenses
    await prevExpenses[i].setCategory(categories[i]);

    //setting category for budgets
    await prevBudgets[i].setCategory(categories[i]);

    //adding expenses and budgets to user
    await user.addExpense(prevExpenses[i]);
    await user.addBudget(prevBudgets[i]);
  }

  //adding unpaid expesnes for previous month to user
  for (let i = 0; i < prevOutstandingExpenses.length; i++) {
    await prevOutstandingExpenses[i].setCategory(categories[i + 1]);
    await user.addExpense(prevOutstandingExpenses[i]);
  }

  //adding investements and monthly incomes to user
  for (let j = 0; j < investments.length; j++) {
    await user.addInvestment(investments[j]);
    await user.addMonthlyIncome(monthlyIncomes[j]);
  }

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${categories.length} categories`);
  console.log(`seeded ${expenses.length} expenses`);

  console.log(`seeded successfully`);
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
