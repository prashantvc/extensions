import Details from "./components/details";
import { Extensions } from "./components/extensions";

const AppRoutes = [
    {
        index: true,
        path: "/",
        element: <Extensions />,
    },
    {
        path: "/details/:name/:version",
        element: <Details />
    }
];

export default AppRoutes;
