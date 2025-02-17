# Password Reset Server

This is a Node.js server for handling password reset functionality using Express, MongoDB, and Nodemailer.

## Project Structure

## Installation

1. Clone the repository:

   git clone https://github.com/NickshanJ/Password-reset-server.git

   cd Password-reset-server

2. Install dependencies:

   npm install

Usage:

Start the server:

The server will run on https://password-reset-server-fbsl.onrender.com

API Endpoints:

POST https://password-reset-server-fbsl.onrender.com/api/forget-password

Request body:

{
  "email": "user@example.com"
}

Response:

200 OK if the email was sent successfully.
404 Not Found if the user was not found.
500 Internal Server Error if there was an error processing the request.

GET https://password-reset-server-fbsl.onrender.com/api/reset-password/:token

Response:

200 OK if the token is valid.
400 Bad Request if the token is invalid or expired.
500 Internal Server Error if there was an error processing the request.

POST https://password-reset-server-fbsl.onrender.com/api/update-password

Request body:
{
  "newPassword": "newpassword123",
  "token": "resetToken",
  "email": "user@example.com"
}

Response:

200 OK if the password was updated successfully.
400 Bad Request if the token is invalid or expired.
500 Internal Server Error if there was an error processing the request.
