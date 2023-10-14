# Task API

A simple task api as a backend assessment.

## Table of Contents
<font size="5">Table of Contents</font>

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Configuration](#database-configuration)
- [Running Tests](#running-tests)
- [Dependencies](#dependencies)
- [Author](#author)

## Installation

Clone the repository from https://github.com/tahirawan077/Tasks-Backend.git.
Run npm install to install the project dependencies.

## Configuration

Create a .env file in the project root directory and set the following environment variables:
NODE_ENV=test
SECRET=your-secret-key

## Usage

Run the application locally using npm run dev.
Access the API at http://localhost:5000

## API Endpoints

Postman collection is also provided, you can import and run the following endpoints.

POST /task: Create a new task.
GET /task/:id: Retrieve a task by its ID.
PUT /task/:id: Update a specific task.
DELETE /task/:id: Delete a specific task.
GET /tasks: Retrieve all tasks.
GET /tasks?assignedTo=[username]: Retrieve all tasks assigned to a specific user.
GET /tasks?category=[categoryName]: Retrieve all tasks under a specific category.


## Database Configuration

The project uses TypeORM and supports both SQLite and PostgreSQL databases. Set the NODE_ENV environment variable in your .env file to switch between testing with SQLite and running the application with PostgreSQL.
You can add your details to data-source.ts file.

## Running Tests

Run tests using npm test.
We can definitely add more assertions :) 

## Dependencies

List and briefly describe the key dependencies of your project.


## Additional Notes:

Tahir: I wanted to add so much to this project, like generic error handling, responses etc. But time is short and have focused more on completion. 
This is my first time with TypeOrm and that might be obvious.
For tests I have experimented with in memory db, but it did not work for me, I have used sqlite for testing. 