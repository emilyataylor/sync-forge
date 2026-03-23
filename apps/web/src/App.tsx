// import { useEffect, useState } from "react";
// import type { Job, Integration } from "@syncforge/types";
// import {
// 	createIntegration,
// 	getIntegrations,
// 	getJob,
// 	syncIntegration,
// } from "./client";

import { Route, Routes } from "react-router";
import Dashboard from "./app/Dashboard";
import Integrations from "./app/Integrations";
import Jobs from "./app/Jobs";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/integrations" element={<Integrations />} />
			<Route path="/jobs" element={<Jobs />} />
		</Routes>
	);
}

export default App;
