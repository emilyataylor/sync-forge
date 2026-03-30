import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobList from "../features/jobs/components/JobList";
import { getJobs, getJobsByIntegration } from "../features/jobs/api";
import type { Job } from "@syncforge/types";

export default function Jobs() {
	const [searchParams] = useSearchParams();
	const integrationId = searchParams.get("integrationId") ?? "";
	const [jobs, setJobs] = useState<Job[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			setError("");
			try {
				const data = integrationId
					? await getJobsByIntegration(integrationId)
					: await getJobs();
				setJobs(data);
			} catch (err) {
				setJobs([]);
				setError(
					err instanceof Error ? err.message : "Failed to load jobs",
				);
			} finally {
				setLoading(false);
			}
		};

		void load();
	}, [integrationId]);

	return (
		<div className="max-w-3xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Jobs</h1>
			<JobList
				jobs={jobs}
				integrationId={integrationId || undefined}
				loading={loading}
				error={error}
			/>
		</div>
	);
}
