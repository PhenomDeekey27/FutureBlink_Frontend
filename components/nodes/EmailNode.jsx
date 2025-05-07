import { Handle } from "@xyflow/react";

const EmailNode = ({ data }) => {
  return (
    <div className="bg-white p-2 rounded shadow text-sm border border-gray-300 w-[200px]">
      <div>{data.label}</div>
      {data.onAddFollowUp && (
        <button
          className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
          onClick={() => data.onAddFollowUp?.(data.nodeId)}
        >
          Add Follow-Up Email
        </button>
      )}

      {/* **Add Handles for React Flow connections** */}
      <Handle type="target" position="top" id="target" />
      <Handle type="source" position="bottom" id="source" />
    </div>
  );
};

export default EmailNode;
