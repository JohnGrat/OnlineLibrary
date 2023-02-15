import { checkAuth } from "./Guards";
import Dashboard from "./Components/Shell/_dashboard";
import { booksList } from "./Pages/_booksList";
import { bookDetail } from "./Pages/_bookDetail";


export interface Props {
  children: React.ReactNode;
  history: History;
  location: any
  guardData?: object;
}


export default [
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
        path: "/books/:id",
        component: bookDetail
      },
    ]
  }
];

