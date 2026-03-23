import type { JobStatus } from "../types";

export default function JobStatusBadge({ status }: { status: JobStatus }) {
	const color: Record<JobStatus, string> = {
		IDLE: "text-gray-500",
		PENDING: "text-white-500",
		PROCESSING: "text-blue-500",
		COMPLETED: "text-green-500",
		FAILED: "text-red-500",
	};

	return <span className={`${color[status]}`}>{status}</span>;
}
