import { useEffect, useState } from "react";
import { getLogsByIntegration, getLogsByJob, type LogEntry } from "../api";
import { useSearchParams } from "react-router-dom";

type ViewMode = "job" | "integration";

export default function LogViewer() {
	const [searchParams] = useSearchParams();
	const [viewMode, setViewMode] = useState<ViewMode>("job");
	const [lookupId, setLookupId] = useState("");
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [hasSearched, setHasSearched] = useState(false);

	const handleLoadLogs = async (
		modeOverride?: ViewMode,
		idOverride?: string,
	) => {
		const mode = modeOverride ?? viewMode;
		const id = (idOverride ?? lookupId).trim();

		if (!id) {
			setError(
				mode === "job"
					? "Please enter a job ID."
					: "Please enter an integration ID.",
			);
			return;
		}

		setLoading(true);
		setError("");
		setHasSearched(true);

		try {
			const data =
				mode === "job"
					? await getLogsByJob(id)
					: await getLogsByIntegration(id);
			setLogs(data);
		} catch (err) {
			setLogs([]);
			setError(
				err instanceof Error
					? err.message
					: "Failed to load logs. Try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const modeParam = searchParams.get("mode");
		const idParam = searchParams.get("id");
		if (!idParam) return;

		const parsedMode: ViewMode =
			modeParam === "integration" ? "integration" : "job";

		setViewMode(parsedMode);
		setLookupId(idParam);
		void handleLoadLogs(parsedMode, idParam);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div className="border rounded-xl p-4 flex flex-col gap-4 text-left">
			<div>
				<p className="text-sm text-gray-500 mb-2">View logs</p>
				<div className="flex gap-2 mb-2">
					<button
						onClick={() => {
							setViewMode("job");
							setLookupId("");
							setLogs([]);
							setError("");
							setHasSearched(false);
						}}
						className={`px-3 py-1 rounded border ${
							viewMode === "job"
								? "bg-sky-500 text-white border-sky-500"
								: "bg-white text-gray-700"
						}`}
					>
						By Job ID
					</button>
					<button
						onClick={() => {
							setViewMode("integration");
							setLookupId("");
							setLogs([]);
							setError("");
							setHasSearched(false);
						}}
						className={`px-3 py-1 rounded border ${
							viewMode === "integration"
								? "bg-sky-500 text-white border-sky-500"
								: "bg-white text-gray-700"
						}`}
					>
						By Integration ID
					</button>
				</div>
				<div className="flex gap-2">
					<input
						value={lookupId}
						onChange={(e) => setLookupId(e.target.value)}
						placeholder={
							viewMode === "job"
								? "Enter job ID"
								: "Enter integration ID"
						}
						className="flex-1 border rounded px-3 py-2"
					/>
					<button
						onClick={() => void handleLoadLogs()}
						disabled={loading}
						className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-70"
					>
						{loading ? "Loading..." : "Load Logs"}
					</button>
				</div>
			</div>

			{error && <p className="text-sm text-red-600">{error}</p>}

			{!loading && hasSearched && logs.length === 0 && !error && (
				<p className="text-sm text-gray-500">
					{viewMode === "job"
						? "No logs found for this job yet."
						: "No logs found for this integration yet."}
				</p>
			)}

			{logs.length > 0 && (
				<ul className="flex flex-col gap-2">
					{logs.map((log) => (
						<li key={log.id} className="border rounded-lg p-3">
							<div className="flex items-center justify-between mb-1">
								<span
									className={`text-xs font-semibold ${
										log.level === "ERROR"
											? "text-red-600"
											: "text-green-600"
									}`}
								>
									{log.level}
								</span>
								<span className="text-xs text-gray-500">
									{new Date(log.timestamp).toLocaleString()}
								</span>
							</div>
							<p className="text-sm text-gray-700">
								{log.message}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
