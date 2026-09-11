import { statusLabel, type StepStatus } from "@/lib/types";

export function StatusBadge({ status, code }: { status: StepStatus; code?: string }) {
  const classStatus = code === "admission" && status === "valide" ? "valide" : status;
  return <span className={`badge badge-${classStatus}`}>{statusLabel(status, code)}</span>;
}
