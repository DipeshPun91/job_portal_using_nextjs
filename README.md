💼 Job Portal Website

A job portal website built using Next.js, MongoDB, Tailwind CSS, and multi-factor authentication via OTP using Gmail. The project also integrates Google reCAPTCHA for bot prevention and uses Toast for displaying messages.

Project Overview

This project is a job portal where users can browse job listings, CRUD oreration for job listing, and manage their profiles. Employers can post jobs, manage applications, and connect with potential candidates. The website is designed to provide a seamless experience with an emphasis on security, using multi-factor authentication via OTP, and spam prevention with Google reCAPTCHA.

Features

    User registration and login with NextAuth.
    Multi-factor authentication (OTP via Gmail).
    Google reCAPTCHA integration.
    Job listing and application system.
    Employer dashboard for job management.
    Responsive design using Tailwind CSS.
    Toast notifications for user actions.

Tech Stack

    Framework: Next.js
    Database: MongoDB (MongoDB Atlas)
    Styling: Tailwind CSS
    Notifications: Toast for success/error messages
    Authentication: NextAuth for user sessions and OTP with Gmail for multi-factor authentication
    Bot Prevention: Google reCAPTCHA

Getting Started

Prerequisites

Ensure you have the following tools installed on your machine:

    Node.js (v14 or higher)
    MongoDB Atlas account
    Gmail account for sending OTPs
    Google reCAPTCHA API keys

Installation

Install dependencies:

    npm install

    # or

    yarn install

Environment Variables

    Create a .env.local file in the root directory of the project and add the following:

    # NextAuth Configuration

    NEXTAUTH_URL="http://localhost:3000"                                    # URL of your Next.js app
    NEXTAUTH_SECRET="your-next-auth-secret"                                 # Secret key for NextAuth session encryption

    # MongoDB Configuration

    MONGO_URL="your-mongodb-atlas-url"                                      # MongoDB connection string (from MongoDB Atlas)

    # OTP Configuration

    OTP_SECRET="your-otp-secret-key"                                        # Secret key used to generate OTP codes
    OTP_EXPIRATION_MINUTES=1                                                # OTP expiration time (in minutes)

    # Email Configuration (for sending OTPs)

    EMAIL_USER="your-gmail-address"                                         # Your Gmail address used to send OTP emails
    EMAIL_PASS="your-gmail-app-password"                                    # App-specific password for Gmail (not your account password)
    SMTP_SERVICE="gmail"                                                    # Service provider (Gmail in this case)
    SMTP_PORT=587                                                           # Port number for SMTP (587 for Gmail)
    SMTP_SECURE=false                                                       # Secure option (false for TLS/STARTTLS, true for SSL)

    # Google reCAPTCHA Configuration

    NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"                # Site key from Google reCAPTCHA
    RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"                        # Secret key from Google reCAPTCHA

Explanation of Each Variable:

    NEXTAUTH_URL: The URL where your app is hosted. For development, this is typically http://localhost:3000.
    NEXTAUTH_SECRET: A random string used to secure your authentication sessions. You can generate one using openssl rand -base64 32.
    MONGO_URL: The connection string to your MongoDB Atlas cluster. You can find this in your MongoDB Atlas dashboard.
    OTP_SECRET: A secret string used for generating OTP (One-Time Password) tokens.
    EMAIL_USER: The email address (Gmail) used to send OTPs.
    EMAIL_PASS: Gmail requires an app-specific password for sending emails via SMTP. You can create one in your Google Account settings under "Security".
    SMTP_SERVICE: The email provider service (gmail in this case).
    SMTP_PORT: The SMTP port (587 for Gmail, 465 for secure SSL connections).
    SMTP_SECURE: Whether the connection should be secure (false for TLS, true for SSL).
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: The public site key for Google reCAPTCHA, which you get when setting up reCAPTCHA for your domain.
    RECAPTCHA_SECRET_KEY: The secret key for validating Google reCAPTCHA tokens.

More Detailed Step to setup MongoDB and Google reCAPTCHA.

1.  MONGO_URL: Connection String to MongoDB Atlas Cluster
    MongoDB Atlas is a cloud-hosted database service. Here's how you can create your cluster and get the connection string for the MONGO_URL:

    Steps to Get MongoDB Atlas Connection String:

    A. Sign up for MongoDB Atlas:
    Go to MongoDB Atlas and sign up for an account if you don't have one already.
    After signing in, click Start Free or Create Cluster.

    B. Create a Cluster:
    Once logged in, click Create a New Cluster.
    Select the cloud provider and region. You can choose the free tier for a simple project (AWS, GCP, or Azure).
    Click Create Cluster (this may take a few minutes to provision).

    C. Create a MongoDB User:
    Once the cluster is created, you'll need to create a MongoDB user.
    Go to the Database Access tab on the left.
    Click Add New Database User and enter the username and password. Make sure to copy the password somewhere secure.

    D. Allow Network Access (IP Whitelisting):
    Go to Network Access and click Add IP Address.
    You can either allow access from anywhere by adding 0.0.0.0/0 (not recommended for production) or specify your IP address.

    E. Get the Connection String:
    Go to Clusters and click Connect.
    Choose Connect your application.
    Choose your driver (Node.js) and version (e.g., 4.0 or later).
    Copy the connection string provided (e.g., mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database name>?retryWrites=true&w=majority).

    F. Modify the Connection String:
    Replace <username> and <password> with the MongoDB user credentials you created.
    Replace myFirstDatabase with the name of your database (you can name it something like job-portal).

    G. Add to .env.local:
    MONGO_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database name>?retryWrites=true&w=majority"

2.  EMAIL_PASS: Gmail App-Specific Password for Sending Emails via SMTP
    Google has security measures in place for using your Gmail account with third-party apps or websites. You’ll need to create an app-specific password for your Gmail account to send emails through the SMTP server.

    Steps to Create a Gmail App-Specific Password:

    A. Enable 2-Step Verification:
    Go to your Google Account.
    On the left-hand sidebar, click Security.
    Under Signing in to Google, make sure that 2-Step Verification is turned on.
    If it's not enabled, click 2-Step Verification and follow the steps to enable it.

    B. Generate an App-Specific Password:
    After enabling 2-Step Verification, go back to the Security tab.
    Scroll down to Signing in to Google and click App Passwords. If you can't find App Password then search for App Password on search field.
    You might be asked to sign in again for security reasons.
    In the Select app dropdown, choose Mail.
    In the Select device dropdown, choose Other (Custom name) and give it a name like "Job Portal Website SMTP".
    Click Generate.
    You will get a 16-character app password. Copy this password (you won’t be able to see it again).

    C. Add to .env.local:

3.  Google reCAPTCHA Keys
    Google reCAPTCHA helps prevent bots from accessing your website. You’ll need a site key and secret key to integrate reCAPTCHA into your application.

    Steps to Get Google reCAPTCHA Keys:

    A. Go to Google reCAPTCHA Admin Console:
    Visit Google reCAPTCHA and sign in with your Google account.

    B. Register a New Site:
    Click the + button in the top right to register a new site.
    Fill in the following details:
    Label: Enter a name like "Job Portal Website".
    reCAPTCHA Type: Choose reCAPTCHA v2 (most commonly used), or reCAPTCHA v3 if you don't want to show the reCAPTCHA checkbox.
    Domains: Enter the domain(s) where this will be used (e.g., localhost for development and your production domain for deployment).

    C. Get Site Key and Secret Key:
    After registering, you’ll receive a Site Key and a Secret Key.

    D. Add to .env.local:
    Use the keys provided by Google:

Running the Project

To run the development server:

    npm run dev

    # or

    yarn dev

Open http://localhost:3000 to view the website.

Deployment

To deploy the project, use Vercel or any cloud provider that supports Next.js.

    Push your code to GitHub.
    Go to Vercel and connect your GitHub repository.
    Configure the environment variables on Vercel:
    NEXTAUTH_URL
    MONGO_URL
    OTP_SECRET
    EMAIL_USER
    EMAIL_PASS
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    RECAPTCHA_SECRET_KEY
    Deploy the project.

API Endpoints

Here is a list of important API endpoints in the project:

    POST /api/auth: Handles user login via NextAuth.
    POST /api/auth/signup: Registers a new user.
    POST /api/otp/send: Sends OTP to the user’s email for multi-factor authentication.
    POST /api/verify-otp: Verifies the OTP entered by the user.
    POST /api/recaptcha: Validates Google reCAPTCHA token.
    GET /api/jobs: Fetches job listings.
