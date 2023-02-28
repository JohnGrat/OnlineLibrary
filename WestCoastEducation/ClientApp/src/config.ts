import Dashboard from "./Components/Shell/_dashboard";
import { bookList } from "./Pages/_bookList";
import { bookDetail } from "./Pages/_bookDetail";
import { checkAdmin } from "./Guards/checkAdmin";
import { userList } from "./Pages/_usersList";
import { github } from "./Pages/_github";

export interface Props {
  children: React.ReactNode;
  history: History;
  location: any;
  guardData?: object;
}

export default [
  {
    path: "/",
    component: Dashboard,
    routes: [
      {
        path: "/books",
        exact: true,
        component: bookList,
      },
      {
        path: "/books/:id",
        component: bookDetail,
      },
      {
        path: "/users",
        canActivate: [checkAdmin],
        component: userList,
      },
      {
        path: "/github",
        exact: true,
        component: github,
      },
    ],
  },
];
