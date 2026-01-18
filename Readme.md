# Personalized To-Do App (Backend)

This repository contains the backend server for the Personalized To-Do App. It is a RESTful API built with Node.js and Express, designed to handle user authentication, task management, and data persistence with a MongoDB database.

**Personalized To-Do App (Frontend)** - [Link](https://github.com/sameermandve/Personalized-To-Do-App-Frontend)

## Key Features

-   **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
-   **CRUD Operations for Tasks**: Full support for creating, reading, updating, and deleting to-do items.
-   **Personalized Experience**: Each user can only view and manage their own tasks.
-   **Data Validation**: Ensures that data sent to the server is in the correct format before processing.
-   **Password Hashing**: Uses `bcrypt.js` to securely hash and store user passwords.

## Tech Stack

-   **Runtime Environment**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
-   **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)
-   **Password Hashing**: [bcrypt.js](https://www.npmjs.com/package/bcrypt)
-   **Environment Variables**: [dotenv](https://www.npmjs.com/package/dotenv)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. You will also need a MongoDB database instance (either local or a cloud service like MongoDB Atlas).

-   [Node.js](https://nodejs.org/en/download/)
-   [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/sameermandve/Personalized-To-Do-App.git](https://github.com/sameermandve/Personalized-To-Do-App.git)
    cd Personalized-To-Do-App
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the root directory and add the following environment variables.

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=8000
    ```
    * `MONGO_URI`: Your connection string for the MongoDB database.
    * `JWT_SECRET`: A secret key for signing JWTs.
    * `PORT`: The port on which the server will run (defaults to 8000 if not specified).

### Usage

Run the following command to start the development server:
```sh
npm start
