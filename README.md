# ClipCode Backend

The backend for **ClipCode**, a code snippet manager built using the MERN stack. This backend provides a REST API to manage users, code snippets, comments, leaderboards, and supported programming languages.

## Features

- User authentication and authorization (JWT-based).
- Create, read, update, and delete (CRUD) operations for code snippets.
- Support for comments on code snippets.
- Leaderboard tracking for user activity.
- RESTful APIs built with **Node.js** and **Express.js**.
- MongoDB database integration using **Mongoose**.
- Secure configuration with **dotenv**.
- CORS support for cross-origin requests.

## Tech Stack

- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Environment Management**: dotenv
- **Development Tools**: Nodemon
- **Version Control**: Git

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dhirajarya/clipcode-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd clipcode-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=7000
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-secret-key>
     ```

5. Start the server:
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

6. The backend server will run on `http://localhost:7000` by default.

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in and get a JWT.

### Snippets
- **GET** `/api/snippets`: Get all snippets.
- **POST** `/api/snippets`: Create a new snippet.
- **GET** `/api/snippets/:id`: Get a snippet by ID.
- **PUT** `/api/snippets/:id`: Update a snippet by ID.
- **DELETE** `/api/snippets/:id`: Delete a snippet by ID.

### Comments
- **GET** `/api/snippets/:id/comments`: Get comments for a snippet.
- **POST** `/api/snippets/:id/comments`: Add a comment to a snippet.

### Leaderboard
- **GET** `/api/leaderboard`: Get the top users.

## Project Structure

```
clipcode-backend/
├── src/
│   ├── controllers/   # Business logic for each resource
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   ├── middlewares/   # Authentication and validation
│   └── utils/         # Helper functions
├── .env               # Environment variables
├── .gitignore         # Ignored files
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation
```

## Contribution

Contributions are welcome! Here's how you can help:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your branch.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Dhiraj Arya**  
[GitHub Profile](https://github.com/dhirajarya)  
