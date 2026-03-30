import type { Integration } from "../types";
import { useEffect, useState } from "react";
import type { Job } from "@syncforge/types";
import { getIntegrationApiKey, getJob, syncIntegration } from "../../../client";
import JobStatusBadge from "../../jobs/components/JobStatusBadge";
import { useNavigate } from "react-router-dom";

type Props = {
	integration: Integration;
};

export default function IntegrationCard({ integration }: Props) {
	const navigate = useNavigate();
	const [integrationJobs, setIntegrationJobs] = useState<
		Record<string, string>
	>({});
	const [jobs, setJobs] = useState<Record<string, Job>>({});
	const [revealedApiKey, setRevealedApiKey] = useState<string | null>(null);
	const [isApiKeyLoading, setIsApiKeyLoading] = useState(false);
	const [apiKeyError, setApiKeyError] = useState<string | null>(null);
	const hiddenMask = "••••••••••••";

	const handleToggleApiKey = async () => {
		if (revealedApiKey) {
			setRevealedApiKey(null);
			setApiKeyError(null);
			return;
		}

		setIsApiKeyLoading(true);
		setApiKeyError(null);
		try {
			const data = await getIntegrationApiKey(integration.id);
			setRevealedApiKey(data.api_key);
		} catch (error) {
			setApiKeyError(
				error instanceof Error
					? error.message
					: "Failed to load API key",
			);
		} finally {
			setIsApiKeyLoading(false);
		}
	};

	const handleSync = async () => {
		alert("Sync triggered!"); // replace this with a toast notification in the future
		await syncIntegration(integration.id)
			.then(({ jobId }) => {
				setIntegrationJobs((prev) => ({
					...prev,
					[integration.id]: jobId,
				}));
			})
			.catch((err) => console.error(err));
	};
	useEffect(() => {
		if (Object.keys(integrationJobs).length === 0) return;
		const interval = setInterval(async () => {
			const jobIds = Object.values(integrationJobs);
			const results = await Promise.all(jobIds.map((id) => getJob(id)));
			setJobs((prev) => {
				const updated = { ...prev };
				results.forEach((job, i) => {
					if (!job) return;
					updated[jobIds[i]] = job;
				});
				return updated;
			});
		}, 2000);
		return () => clearInterval(interval);
	}, [integrationJobs]);

	const jobId = integrationJobs[integration.id];
	const job = jobId ? jobs[jobId] : undefined;

	return (
		<div className="border rounded-xl p-4 flex flex-col justify-between gap-4">
			<div className="flex-1">
				<h3 className="font-semibold text-lg">{integration.name}</h3>
				<p className="text-sm text-gray-500">{integration.type}</p>
				<div className="mt-2">
					<p className="text-xs text-gray-500">API Key</p>
					<p className="font-mono text-sm break-all">
						{revealedApiKey ?? hiddenMask}
					</p>
					{apiKeyError ? (
						<p className="text-xs text-red-600 mt-1">
							{apiKeyError}
						</p>
					) : null}
					<button
						type="button"
						onClick={handleToggleApiKey}
						disabled={isApiKeyLoading}
						className="mt-2 text-xs border border-gray-300 hover:bg-gray-50 transition px-2 py-1 rounded disabled:opacity-60"
					>
						{isApiKeyLoading
							? "Loading..."
							: revealedApiKey
								? "Hide API Key"
								: "Reveal API Key"}
					</button>
				</div>
			</div>
			<div className="flex flex-col items-center gap-2">
				<JobStatusBadge status={job?.status || "IDLE"} />
				<p className="text-sm text-gray-600">
					Attempt {job?.attempt ?? "-"}
				</p>
			</div>

			<div className="flex gap-2">
				<button
					disabled={job?.status === "PROCESSING"}
					onClick={handleSync}
					className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white px-3 py-1 rounded disabled:opacity-75"
				>
					Trigger Sync
				</button>
				<button
					onClick={() =>
						navigate(
							`/logs?mode=integration&id=${encodeURIComponent(integration.id)}`,
						)
					}
					className="flex-1 border border-sky-500 text-sky-600 hover:bg-sky-50 transition px-3 py-1 rounded"
				>
					View Logs
				</button>
				<button
					onClick={() =>
						navigate(
							`/jobs?integrationId=${encodeURIComponent(integration.id)}`,
						)
					}
					className="flex-1 border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition px-3 py-1 rounded"
				>
					View Jobs
				</button>
			</div>
		</div>
	);
}
