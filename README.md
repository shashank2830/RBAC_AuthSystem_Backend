# RBAC_AuthSystem_Backend

This project is an RBAC (Role-Based Access Control) backend system designed to provide a secure and robust authentication and authorization mechanism. The system implements user role management and offers additional features to enhance security and user management. Developed using Node.js, this backend system adheres to modern security best practices and is tailored to meet the requirements of VRV Security.

#  Features 

# Core Functionalities
 1) Authentication:
    * Secure user registration, login, and logout.
    * JWT-based authentication to manage user sessions securely.
 2) Role-Based Access Control (RBAC):
    * Users are assigned roles (e.g., Admin, User).
    * Access to resources is restricted based on roles.
    * Permissions are managed dynamically for each role.
 3)  Authorization Middleware:
    * Protects endpoints to ensure only authorized roles can access specific routes or perform certain actions.

# Enhanced Functionalities
  1)  Password Reset via Email:
       * Users can request a password reset link via email.
       * Tokens for password reset are securely hashed and expire after 10 minutes.
       * Passwords can be updated securely using the reset link.

  2)  OAuth Login:
       * Integration with Google OAuth for third-party authentication.
       * New users logging in via Google are automatically registered.

  3)   Account Lockout After Failed Attempts:
      * Accounts are locked for 15 minutes after 5 consecutive failed login attempts 
      * Prevents brute-force attacks and enhances security.

  4)  Security Best Practices:
      * Password hashing with bcrypt.
      * Expiring JWT tokens to enhance session security.
      * Input validation to prevent common vulnerabilities like SQL injection.
    
#  API Endpoints 
  # Authentication

  Method	    Endpoint	            Description
  POST	   /auth/register	       Register a new user
  POST	   /auth/login	          Log in a user
  POST	   /auth/logout	          Log out the user

  # RBAC

   Method	    Endpoint	            Description
    GET	      /admin	            Accessed by admin
    GET	      /moderator	        Accessed by admin & moderator
    GET	      /user	              Accessed by admin , moderator & user

#  Password Reset
  Method	        Endpoint	                          Description
  POST	        /auth/request-reset	              Request a password reset link
  PUT	          /auth/reset-password/:token	      Reset password using token

#  Google OAuth
  Method	       Endpoint	                       Description
    GET	       /auth/google	                 Initiate Google login
    GET	      /auth/google/callback	         Handle Google OAuth callback4


#  Project Setup 

1) Clone the repo and go the project directory
2) npm install
3) Create a .env file and configure the environment variables:
    # MongoDB Configuration
      MONGO_URI=your_mongodb_connection_string

    # JWT Secret
      JWT_SECRET=your_jwt_secret
      JWT_EXPIRES_IN=1h

    # Email Configuration
      EMAIL=your_email@example.com
      EMAIL_PASSWORD=your_email_password

    # Google OAuth
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_CLIENT_SECRET=your_google_client_secret

 4) Start the server using command : "nodemon server.js"

#  File System 

auth-system/
├── server.js
├── auth/
│   └── passport.js
├── config/
│   └── db.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── utils/
│   └── token.js
|   └── email.js
└── .env




