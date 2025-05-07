// pages/index.js or App.js
import React, { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import LeadModal from "./modals/LeadModal";
import EmailModal from "./modals/EmailModal";

import EmailScheduler from "../components/EmailScheduler";
import EmailNode from "./nodes/EmailNode";
import { SignOutButton, UserButton } from "@clerk/clerk-react";

let id = 1;
const getId = (prefix) => `${prefix}-${id++}`;

const nodeTypes = { emailNode: EmailNode };




const MainComponent = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [followUpSourceId, setFollowUpSourceId] = useState(null);
  const leadNodeIds = useRef([]);
  const hasLabeledEdge = useRef(false);
  const lastLeadPosition = useRef({ x: 100, y: 50 });

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleInsertLead = (lead) => {
    const newNode = {
      id: getId("lead"),
      type: "default",
      position: {
        x: lastLeadPosition.current.x,
        y: lastLeadPosition.current.y,
      },
      data: {
        label: `Lead: ${lead.name}`,
        email: lead.email, // optional: use in node rendering or logic
      },
    };
    lastLeadPosition.current.y += 100;

    leadNodeIds.current.push(newNode.id);
    setNodes((prevNodes) => [...prevNodes, newNode]);
    
  };

  const handleInsertEmail = (emailData, sourceId = null) => {
    const newNodeId = getId("email");
    const newNode = {
      id: newNodeId,
      type: "emailNode",
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: {
        ...emailData,
        label: `Email: ${emailData.name}`,
        nodeId: newNodeId,
        onAddFollowUp: (sourceId) => {
          setFollowUpSourceId(sourceId);
          setShowEmailModal(true);
        },
      },
    };

    setNodes((prev) => [...prev, newNode]); // Add new node

    

    setEdges((prevEdges) => {
      let newEdges = [];

      if (!sourceId) {
        newEdges = leadNodeIds.current.map((leadId, index) => ({
          id: `e${leadId}-${newNodeId}`,
          source: leadId,
          target: newNodeId,
          ...(index === 0 &&
            !hasLabeledEdge.current && { label: "sequence start" }),
        }));
        hasLabeledEdge.current = true;
      } else {
        newEdges = [
          {
            id: `e${sourceId}-${newNodeId}`,
            source: sourceId,
            target: newNodeId,
            label: "follow-up",
          },
        ];
      }

      return [...prevEdges, ...newEdges]; // Properly preserve previous edges
    });

    console.log("Updated Edges:", edges);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="absolute top-4 left-4 z-50 flex gap-4 items-center">
        <LeadModal onInsert={handleInsertLead} />
        {showEmailModal && (
          <EmailModal
            onInsertEmail={(data) => {
              handleInsertEmail(data, followUpSourceId);
              setFollowUpSourceId(null);
              setShowEmailModal(false);
            }}
            onClose={() => {
              setFollowUpSourceId(null);
              setShowEmailModal(false);
            }}
          />
        )}
        {!showEmailModal && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-blue-600 text-white p-2 rounded"
          >
            Add Email
          </button>
        )}

        <EmailScheduler
          emails={nodes.filter((node) => node.type === "emailNode")}
          leads={nodes.filter((lead) => lead.type == "default")}
          edges={edges}
        ></EmailScheduler>
        <div className="p-2">
          <UserButton />
        </div>

        <div className="bg-blue-600 p-2 text-white font-bold rounded-md hover:bg-blue-500">
          <SignOutButton></SignOutButton>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MainComponent;
