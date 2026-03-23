import { useState } from "react";
import { createIntegration } from "../../../client";

type Props = {
	onSuccess: () => void;
};

export default function CreateIntegrationForm({ onSuccess }: Props) {
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const clearForm = () => {
		setName("");
		setType("");
		setApiKey("");
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !type.trim() || !apiKey.trim()) {
			setError("All fields are required.");
			return;
		}

		setError("");
		setLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
		await createIntegration({ name, type, api_key: apiKey });

		setLoading(false);
		clearForm();
		onSuccess(); // refresh list
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="border rounded-xl p-4 mb-4 flex flex-col gap-3"
		>
			<h2 className="font-semibold">New Integration</h2>

			{error && <p className="text-sm text-red-600">{error}</p>}

			<input
				placeholder="Name (e.g. GitHub Sync)"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				className="border p-2 rounded"
			/>

			<input
				placeholder="Type (e.g. github, stripe)"
				value={type}
				onChange={(e) => setType(e.target.value)}
				required
				className="border p-2 rounded"
			/>

			<input
				placeholder="API Key"
				value={apiKey}
				onChange={(e) => setApiKey(e.target.value)}
				required
				className="border p-2 rounded"
			/>

			<button
				className="bg-sky-500 hover:bg-sky-600 transition text-white py-2 rounded flex items-center justify-center"
				type="submit"
				disabled={!!error || loading}
			>
				{loading ? (
					<span className="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block animate-spin mr-2"></span>
				) : (
					"Create Integration"
				)}
			</button>
		</form>
	);
}
