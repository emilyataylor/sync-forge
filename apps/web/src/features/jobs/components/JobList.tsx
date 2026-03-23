import JobStatusBadge from "./JobStatusBadge";

export default function JobList() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Jobs</h1>
			<p className="text-gray-600">List of all jobs will go here.</p>
			<JobStatusBadge status="PENDING" />
			<JobStatusBadge status="RUNNING" />
			<JobStatusBadge status="SUCCESS" />
			<JobStatusBadge status="FAILED" />
		</div>
	);
}
