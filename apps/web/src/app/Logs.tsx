import LogViewer from "../features/logging/components/LogViewer";

export default function Logs() {
	return (
		<div className="max-w-3xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Logs</h1>
			<LogViewer />
		</div>
	);
}
