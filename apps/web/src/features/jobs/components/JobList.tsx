import type { Job } from "@syncforge/types";
import JobStatusBadge from "./JobStatusBadge";

type Props = {
	jobs: Job[];
	integrationId?: string;
	loading: boolean;
	error: string;
};

export default function JobList({
	jobs,
	integrationId,
	loading,
	error,
}: Props) {
	return (
		<div className="border rounded-xl p-4 text-left">
			{integrationId && (
				<p className="text-sm text-gray-500 mb-3">
					Integration ID: {integrationId}
				</p>
			)}

			{loading && (
				<p className="text-gray-600">Loading jobs...</p>
			)}

			{error && <p className="text-red-600 text-sm">{error}</p>}

			{!loading && !error && jobs.length === 0 && (
				<p className="text-gray-600">No jobs found.</p>
			)}

			{!loading && !error && jobs.length > 0 && (
				<ul className="space-y-2">
					{jobs.map((job) => (
						<li
							key={job.id}
							className="border rounded-lg p-3 flex items-center justify-between"
						>
							<div>
								<p className="font-medium text-sm">{job.id}</p>
								<p className="text-xs text-gray-500">
									Attempt {job.attempt} / {job.maxAttempts}
								</p>
							</div>
							<JobStatusBadge status={job.status} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
