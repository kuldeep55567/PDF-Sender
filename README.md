# PDF Sender Backend Application

This is a backend application built using AWS Lambda, API Gateway, SendGrid, and the `pdfkit` library. The application provides APIs for user authentication, sending dynamic PDF files, and retrieving the sending history.

## Features

1. **User Authentication (`/auth`)**:
   - Users can authenticate using their email.
   - A JWT token is generated upon successful authentication.
   - If it's the user's first authentication, they need to verify their email using a verification link.

2. **Send Dynamic PDF (`/send-report`)**:
   - Users can send dynamic PDF files to a specified email.
   - Requires a valid JWT token in the request header.
   - The PDF content includes the current date, time, and user's email address.

3. **Retrieve Sending History (`/get-history`)**:
   - Users can retrieve the history of sent PDF files.
   - Requires a valid JWT token in the request header.
   - The response contains the date created and the recipient's email

## Deployment

1. Deploy the application using AWS Lambda and API Gateway using the Serverless Framework.
2. Configure the SendGrid API key in the environment variables for sending emails.
3. Ensure that the necessary npm packages (`pdfkit`, `jsonwebtoken`, `aws-sdk`, etc.) are installed.
4. Follow the provided examples for API usage.

## Security

- User authentication is implemented using JWT tokens.
- Emails are sent using SendGrid's secure APIs.

## Instructions for Verification

1. Upon first authentication, a verification link will be sent to the user's email.
2. The user needs to click the verification link to verify their email.
3. After email verification, the user will receive a JWT token for subsequent requests.

## API Documentation

Detailed API documentation, including request examples and response structures, is available in the examples provided above.

## Technology Stack

- AWS Lambda for serverless computing
- AWS API Gateway for API management
- SendGrid for sending emails
- `pdfkit` library for generating PDF files

For any further details or assistance, please refer to the provided code and documentation.
