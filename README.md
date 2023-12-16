# InvoiceForge

## Collaborators

  - Oluwatobi Onipede
  - Andrew Li
  - Nathan Wiles
  - Caroline Olagunju

# Dependancies

## Frontend

- @popperjs/core
- @react-pdf/renderer
- cors
- font-awesome
- jspdf
- jspdf-autotable
- moment
- nodemailer
- react
- react-bootstrap
- react-big-calendar
- react-dom
- react-icons
- react-modal

## Backend

- body-parser
- cors
- express
- humps
- knex
- moment
- multer
- nodemailer
- pg
- yup

- During development, make sure to frequently run the following command to ensure that you have the latest dependancies:
```sh
    npm install
```
# Trouble Shooting
-if you are have trouble with installing the dependancies, make sure that you are using node 16.  You can check your node version by running the following command:
```sh
    node -v
```

# Database Initialization
1.  Ensure that your .env has the following:
```
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD= your_db_password
    DB_HOST=localhost
    DB_PORT=5432
```
2.  Ensure that you have a postgres database created with the name specified in your .env file
3. Ensure that you are in the backend directory:
```
    cd backend
```
4. run the following commands in the terminal:
```sh
    npm run db:migrate
    npm run db:seed
```
5. You should see two message in the terminal that confirm that the migration and seeding were successful
```sh
# lines preceeding
Using environment: development
Batch 1 run: 1 migrations
# lines in between
Using environment: development
Ran 3 seed files
```
6.  You should now have a database with the correct tables and some seed data

# Running Tests
1.  Ensure that you are in the desired directory:
```
    # depending on which tests you want to run
    cd frontend
    cd backend
```
2.  Run the following command:
```sh
    npm test
```
3. cypress is a bit different Run the following command:
```sh
    npm run cypress
```

## Creating Jest Tests (backend)
Follow the guide found here: https://jestjs.io/docs/en/getting-started

## Creating Vitest Tests (frontend)

Follow the guide found here: https://vitest.dev/guide/

## Creating Cypress Tests (frontend)

Follow the guide found here: https://docs.cypress.io/guides/overview/why-cypress

# Setting up App password to authenticate gmail
follow the instruction on this link and apply changes to backend dotenv
https://support.google.com/accounts/answer/185833?visit_id=638364070840582656-2264851718&p=InvalidSecondFactor&rd=1
