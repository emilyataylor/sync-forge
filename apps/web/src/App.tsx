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
	// const [integrations, setIntegrations] = useState<Array<Integration>>([]);
	// const [integrationJobs, setIntegrationJobs] = useState<
	// 	Record<string, string>
	// >({});
	// const [jobs, setJobs] = useState<Record<string, Job>>({});
	// const getStatusColor = (status?: string) => {
	// 	switch (status) {
	// 		case "pending":
	// 			return "orange";
	// 		case "processing":
	// 			return "blue";
	// 		case "completed":
	// 			return "green";
	// 		case "failed":
	// 			return "red";
	// 		default:
	// 			return "gray";
	// 	}
	// };
	// const handleSync = async (integrationId: string) => {
	// 	syncIntegration(integrationId)
	// 		.then(({ jobId }) => {
	// 			setIntegrationJobs((prev) => ({
	// 				...prev,
	// 				[integrationId]: jobId,
	// 			}));
	// 		})
	// 		.catch((err) => console.error(err));
	// };
	// useEffect(() => {
	// 	getIntegrations()
	// 		.then((data) => setIntegrations(data))
	// 		.catch((err) => console.error(err));
	// }, []);
	// useEffect(() => {
	// 	if (Object.keys(integrationJobs).length === 0) return;
	// 	const interval = setInterval(async () => {
	// 		const jobIds = Object.values(integrationJobs);
	// 		const results = await Promise.all(jobIds.map((id) => getJob(id)));
	// 		setJobs((prev) => {
	// 			const updated = { ...prev };
	// 			results.forEach((job, i) => {
	// 				if (!job) return;
	// 				updated[jobIds[i]] = job;
	// 			});
	// 			return updated;
	// 		});
	// 	}, 2000);
	// 	return () => clearInterval(interval);
	// }, [integrationJobs]);
	// return (
	// 	<>
	// 		<h1>SyncForge Dashboard</h1>
	// 		<form
	// 			onSubmit={(e) => {
	// 				e.preventDefault();
	// 				const formData = new FormData(e.currentTarget);
	// 				createIntegration({
	// 					name: formData.get("name") as string,
	// 					type: formData.get("type") as string,
	// 				})
	// 					.then((data) =>
	// 						setIntegrations([...integrations, data]),
	// 					)
	// 					.catch((err) => console.error(err));
	// 				e.currentTarget.reset();
	// 			}}
	// 		>
	// 			<input name="name" placeholder="Integration name" required />
	// 			<input name="type" placeholder="Integration type" required />
	// 			<button type="submit">Add Integration</button>
	// 		</form>
	// 		<h2>Integrations</h2>
	// 		<table>
	// 			<thead>
	// 				<tr>
	// 					<th>Name</th>
	// 					<th>Type</th>
	// 					<th>Status</th>
	// 					<th>Attempts</th>
	// 					<th>Actions</th>
	// 				</tr>
	// 			</thead>
	// 			{integrations.map((integration) => {
	// 				const jobId = integrationJobs[integration.id];
	// 				const job = jobId ? jobs[jobId] : undefined;
	// 				return (
	// 					<tr key={integration.id}>
	// 						<td>{integration.name}</td>
	// 						<td>{integration.type}</td>
	// 						<td style={{ color: getStatusColor(job?.status) }}>
	// 							{job?.status || "idle"}
	// 						</td>
	// 						<td>{job?.attempt ?? "-"}</td>
	// 						<td>
	// 							<button
	// 								disabled={job?.status === "processing"}
	// 								onClick={() => handleSync(integration.id)}
	// 							>
	// 								Sync
	// 							</button>
	// 						</td>
	// 					</tr>
	// 				);
	// 			})}
	// 		</table>
	// 	</>
	// );
}

export default App;
