import ApiAuthorzationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import Details from "./components/details";
import { Extensions } from "./components/extensions";
import { FetchData } from "./components/FetchData";

const AppRoutes = [
	{
		index: true,
		path: "/",
		element: <Extensions />,
	},
	{
		path: "/details/:identifier/:version?",
		element: <Details />,
	},
	{
		path: "/fetch-data",
		requireAuth: true,
		element: <FetchData />,
	},
	...ApiAuthorzationRoutes,
];

export default AppRoutes;
