"use strict";

const {
  db,
  models: { User, Category, Expense },
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

  // Assigning user to expenses
  const user = await User.findByPk(1);

  for (let i = 0; i < expenses.length; i++) {
    await expenses[i].setCategory(categories[i]);
    await user.addExpense(expenses[i]);
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
