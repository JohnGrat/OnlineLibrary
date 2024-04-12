# WestCoastEducation
A online library

This is a full-stack project that implements a library application using ASP.NET Core and React. 

The backend is built with .NET Core and follows a layered architecture that comprises data, business,and presentation layers.
It communicates with two SQL databases, one for identity and the other for book information. 
It utilizes a Firestore database to handle user-generated content such as comments on the website.
The backend supports authentication for both frontend using cookies and direct API communication using JWT.

the frontend offers Google sign-in functionality and implements signalr
It uses the Mantine component library, React-router-guards, and Axios.

![Alt Text](https://i.imgur.com/cDbhevV.gif)
![WestCoastEdu](https://github.com/JohnGrat/WestCoastEducation/assets/51702387/f17924d5-7a6c-44cf-acfb-410d04f3e3db)

# API Documentation

AUTH
/api/auth/register-admin:
    Method: POST
    Description: Register a new admin user.
    Authorization: User must have Admin role.
    Tags: Authentication

/api/auth/revoke-all:
    Method: POST
    Description: Revoke all tokens for all users.
    Authorization: User must have Admin role.
    Tags: Authentication

/api/auth/revoke/{username}:
    Method: POST
    Description: Revoke all tokens for a specific user.
    Parameters:
        - username: The username of the user whose tokens are to be revoked.
    Authorization: User must have Admin role.
    Tags: Authentication

/api/auth/refresh-token:
    Method: POST
    Description: Refresh authentication token.
    Tags: Authentication

/api/auth/logout:
    Method: GET
    Description: Logout the current user.
    Authorization: Required
    Tags: Authentication

/api/auth/googleexternallogin:
    Method: GET
    Description: Perform login via Google.
    Tags: Authentication

/api/auth/login:
    Method: GET
    Description: Login to the system for using API User.
    Tags: Authentication

/api/auth/me:
    Method: GET
    Description: Get current user details.
    Authorization: Required
    Tags: Authentication



BOOKS
/api/book:
    Method: GET
    Description: Get all books.
    Tags: Books

/api/book/{id}:
    Method: GET
    Description: Get a specific book by ID.
    Parameters:
        - id: The unique identifier of the book.
    Tags: Books
