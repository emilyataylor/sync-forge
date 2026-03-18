import { useEffect, useState } from "react";
import type { Integration } from "../../../packages/types/integration";

function App() {
	const [integrations, setIntegrations] = useState<Array<Integration>>([]);

	useEffect(() => {
		fetch("http://localhost:3000/api/integrations")
			.then((res) => res.json())
			.then((data) => setIntegrations(data))
			.catch((err) => console.error(err));
	}, []);
	return (
		<>
			<h1>SyncForge Dashboard</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					fetch("http://localhost:3000/api/integrations", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							name: formData.get("name"),
							type: formData.get("type"),
						}),
					})
						.then((res) => res.json())
						.then((data) =>
							setIntegrations([...integrations, data]),
						)
						.catch((err) => console.error(err));
					e.currentTarget.reset();
				}}
			>
				<input name="name" placeholder="Integration name" required />
				<input name="type" placeholder="Integration type" required />
				<button type="submit">Add Integration</button>
			</form>

			<h2>Integrations</h2>
			<ul>
				{integrations.map((integration) => (
					<li key={integration.id}>
						{integration.name} ({integration.type})
					</li>
				))}
			</ul>
		</>
	);
}

export default App;
