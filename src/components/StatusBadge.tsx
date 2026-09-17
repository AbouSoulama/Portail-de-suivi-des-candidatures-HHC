import { statusBadgeClass, statusLabel, type StepStatus } from "@/lib/types";

export function StatusBadge({ status, code }: { status: StepStatus; code?: string }) {
  return <span className={`badge badge-${statusBadgeClass(status, code)}`}>{statusLabel(status, code)}</span>;
}
