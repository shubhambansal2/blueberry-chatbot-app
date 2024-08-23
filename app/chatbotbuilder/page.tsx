'use client'
import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  Node,
  Edge,
  Connection,
  NodeTypes,
  ReactFlowInstance,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';

const nodeTypes: NodeTypes = {
  message: MessageNode,
  input: InputNode,
};

const CanvasWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default function ChatbotBuilder() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onNodesDelete = useCallback((deleted: Node[]) => {
    setNodes((nds) => nds.filter((node) => !deleted.some((del) => del.id === node.id)));
  }, []);

  const addNode = (type: 'message' | 'input') => {
    const newNode: Node = {
      id: `${type}_${Date.now()}`,
      type,
      data: { label: `New ${type} Node` },
      position: { x: 250, y: 250 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onSave = useCallback(() => {
    const flowObject = {
      nodes,
      edges,
    };
    const json = JSON.stringify(flowObject, null, 2);
    console.log(json);
    // Here you would typically save this JSON to a file or send it to a server
  }, [nodes, edges]);

  const onRestore = useCallback((flowObject: { nodes: Node[]; edges: Edge[] }) => {
    const { nodes: restoredNodes, edges: restoredEdges } = flowObject;
    setNodes(restoredNodes);
    setEdges(restoredEdges);
  }, []);

  return (
    <CanvasWrapper>
      <button onClick={() => addNode('message')}>Add Message Node</button>
      <button onClick={() => addNode('input')}>Add Input Node</button>
      <button onClick={onSave}>Save Flow</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </CanvasWrapper>
  );
}

interface NodeData {
  label: string;
}

interface NodeProps {
  data: NodeData;
}

function MessageNode({ data }: NodeProps) {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <div>{data.label}</div>
    </div>
  );
}

function InputNode({ data }: NodeProps) {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <div>{data.label}</div>
      <input type="text" placeholder="User input" />
    </div>
  );
}