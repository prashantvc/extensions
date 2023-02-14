import { Extensions } from "./components/extensions";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";

const AppRoutes = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: "/fetch-data",
        element: <FetchData />,
    },
    {
        path: "/extensions",
        element: <Extensions />,
    },
];

export default AppRoutes;
