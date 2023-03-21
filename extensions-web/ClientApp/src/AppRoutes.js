import { Extensions } from "./components/extensions";
import { Home } from "./components/Home";

const AppRoutes = [
    {
        index: true,
        element: <Home />,
    },
    {
        path: "/extensions",
        element: <Extensions />,
    },
];

export default AppRoutes;
