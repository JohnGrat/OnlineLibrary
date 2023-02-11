import { checkAuth } from "./Guards";
import  useAuth from "./Providers/auth.provider";

import { lazy } from 'react-router-guard';
import App from "./App"
import { AuthenticationTitle } from "./Pages/_login";
import Dashboard from "./Components/Shell/_dashboard";
import { AsynchronousDataLoadingExampleWithCustomLoader } from "./Components/_dataTable";
import { booksList } from "./Pages/_booksList";
import BookBriefDto from "./Models/book";
import { getBooks } from "./API/books.api";

function User(props : any) {
  const { children, location, guardData } = props;
  return (<><h1>User</h1> </>)
}

const callback : any = {
  loader: getBooks
};

export default [
  {
    path: "/login",
    component: AuthenticationTitle,
  },
  {
    path: '/',
    component: Dashboard,
    routes: [
      {
        path: '/books',
        exact: true,
        canActivate: [checkAuth],
        component: booksList,
      },
      {
        path: "/user",
        component: User
      },
    ]
  }
];

