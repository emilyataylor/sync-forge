import type { JobStatus } from "../types";

export default function JobStatusBadge({ status }: { status: JobStatus }) {
	const color: Record<JobStatus, string> = {
		PENDING: "text-gray-500",
		RUNNING: "text-blue-500",
		SUCCESS: "text-green-500",
		FAILED: "text-red-500",
	};

	return <span className={`${color[status]}`}>{status}</span>;
}
