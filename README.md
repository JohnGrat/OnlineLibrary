# WestCoastEducation
A online bookstore 

This is a full-stack project that implements a bookstore application utilizing Entity Framework, ASP.NET Core, and React. 

The backend is designed using a layered architecture that includes data, business and presentation layers. 
A separate SQL database will handle authentication and act as the identity provider for the system. 
API endpoints will be secured through the use of ASP.NET Core middleware and JSON Web Tokens (JWT). 
Unit tests will be implemented to ensure proper functionality. 

On the frontend, React will be used to provide diverse user interfaces and options based on the user's account role. 
There will be at least three different types of user roles: Administrators, Employees, and Customers.

* Administrators will have full access to all aspects of the application such as managing books, orders, and user accounts. 
* Employees will be able to manage books and orders but will not have access to user accounts. 
* Customers will only be able to view books, add them to their cart, and place orders.