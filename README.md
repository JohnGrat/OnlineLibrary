# WestCoastEducation
A online library

This is a full-stack project that implements a library application using ASP.NET Core and React. 

The backend is built with .NET Core and follows a layered architecture that comprises data, business,and presentation layers.
It communicates with two SQL databases, one for identity and the other for book information. 
It utilizes a Firestore database to handle user-generated content such as comments on the website.
The backend supports authentication for both frontend using cookies and direct API communication using JWT.

the frontend offers Google sign-in functionality and implements signalr
It uses the Mantine component library, React-router-guards, and Axios.
