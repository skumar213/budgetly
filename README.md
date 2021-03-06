# Budgetly

<div align='center'>
<img src="public/logo.png" height='150'>
</div>
<br/>
<div align='center'>Don't want to give your personal banking information to a budgeting app? Budgetly can help! Budgetly is for those that want a robust and secure budgeting app that will help them develop a budgeting routine. Budgetly will help you develop a budgeting mindset while also allowing you to track your investments!
</div>
<br/>

# Tech Stack

Budgetly was built using React and Redux for state management on the front-end. All charts and styling were done with Chart.js and Bootstrap. The back-end and database were done using Express, Sequelize, Postgres and Node.js.

# Setup & Start

1. Install dependencies: `npm install`
2. Create a database called `budgetly`
3. A few secret variables need to be defined before using the app. Make a `.env` file on the project's root folder and add the following:
   1. `JWT="budgetlyApp"`
   2. `SEED_USER_PASS="budgetlyApp"`
   3. `YAHOO_FINANCE_API="Can get one for free from: https://www.yahoofinanceapi.com/"`
4. Sync and seed your database by running `npm run seed`
5. Use `npm run start:dev` to start a local server (on port 8080)

# How to use

1. Dashboard will show all data analysis related to your budgeting, expenses, and investments
2. Update user settings and monthly income in Profile
3. Add and pay expenses in Expenses. Can pay an expense by just inputting the paid date
4. Add budgets in Budgets. Only one budget can be added for a month; the add new budget button will disappear if they're all being used. New budgets will be added to the selected date/year.
5. Add new investments in Investments
<br/>
<div align='center'>
<img src="public/budgetlyGif.gif" height="400">
</div>
<h1 align='center'>
Demo here: https://budgetly-sk.herokuapp.com/
</h1>
<br/>

# Contact Info

Sabi Kumar: [Github](https://github.com/skumar213) | [LinkedIn](http://www.linkedin.com/in/skumar213) | <a href="mailto:skumar213@gmail.com">Email</a>
