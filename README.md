[![Build Status](https://travis-ci.org/lexcorp16/ride-my-way.svg?branch=ft-rides-rest-endpoints)](https://travis-ci.org/lexcorp16/ride-my-way)  [![Coverage Status](https://coveralls.io/repos/github/lexcorp16/ride-my-way/badge.svg?branch=develop)](https://coveralls.io/github/lexcorp16/ride-my-way?branch=ft-rides-rest-endpoints)  [![Maintainability](https://api.codeclimate.com/v1/badges/9f48290e60daa593aaa6/maintainability)](https://codeclimate.com/github/lexcorp16/ride-my-way/maintainability)  [![Test Coverage](https://api.codeclimate.com/v1/badges/9f48290e60daa593aaa6/test_coverage)](https://codeclimate.com/github/lexcorp16/ride-my-way/test_coverage)

# Ride My Way
A carpooling application that provides drivers with the ability to create ride offers and passengers to join available ride offers.

### Features

- Users can create an account and log in.
- Drivers can add ride offers..
- Passengers can view all available ride offers.
- Passengers can see the details of a ride offer and request to join the ride. E.g What time
the ride leaves, where it is headed e.t.c
- Drivers can view the requests to the ride offer they created.
- Drivers can either accept or reject a ride request.

### Relevant Tech Stack

1.  **Node.js/express.js**: The API was built using Node JS(server side implementation of javascript) and the Express JS framework.
2.  **PostgreSQL/node-postgres**: PostgreSQL is the database used for this application, with node-postgres being a collection of node.js modules for interfacing with the PostgreSQL database.

### Installation and Setup

To get a local version of this application, please make sure to have the following system dependencies installed and ensure postgreSQL has been setup properly,

- [Node.js](https://nodejs.org/)
- [PostgresQL](https://www.postgresql.org/)


1.  Clone the repository:

```
git clone  https://github.com/lexcorp16/ride-my-way.git

```

2.  Navigate into the cloned repository directory using:

```
cd ride-my-way

```

3.  Install dependencies:

```
npm i 

```

4.  create a **.env** file and add the required environment variables as defined in the **.env.example** file
5.  Run the following commands in the specified order to set up your database. 

```
npm run create:enums
npm run create:usertable
npm run create:rideofferstable
npm run create:requeststable
```

6.  Now run the command below to start the app.

```
npm run dev
```

### Running tests

To run the tests already written for this application, run

```
npm test
```

### API Endpoints

See  [API Documentation](https://ride-my-way-app.herokuapp.com/api/docs)

### Contact the Author

- [Google](<mailto:[afasorojoseph@gmail.com](afasorojoseph@gmail.com)>)
- [LinkedIn](https://www.linkedin.com/in/alexander-fasoro-joseph/)

