import { BaseEdge, EdgeProps } from "@xyflow/react";
import { X } from "lucide-react";

// Edge prerequisite (simple arrow)
export class PrerequisiteEdge extends BaseEdge {
  id: string;
  source: string;
  target: string;
  data: { label?: string };
  type: "prerequisite" = "prerequisite";

  constructor(
    id: string,
    source: string,
    target: string,
    data: { label?: string } = {}
  ) {
    super();
    this.id = id;
    this.source = source;
    this.target = target;
    this.data = data;
  }
}

// Edge related (dashed line)
export class RelatedEdge extends BaseEdge {
  id: string;
  source: string;
  target: string;
  data: { label?: string };
  type: "related" = "related";

  constructor(
    id: string,
    source: string,
    target: string,
    data: { label?: string } = {}
  ) {
    super();
    this.id = id;
    this.source = source;
    this.target = target;
    this.data = data;
  }
}

// Edge contradicts (with X marker)
export class ContradictsEdge extends BaseEdge {
  id: string;
  source: string;
  target: string;
  data: { label?: string };
  type: "contradicts" = "contradicts";

  constructor(
    id: string,
    source: string,
    target: string,
    data: { label?: string } = {}
  ) {
    super();
    this.id = id;
    this.source = source;
    this.target = target;
    this.data = data;
  }
}

// Edge default simple
export const DefaultEdge = (props: EdgeProps & { type?: string; strokeDasharray?: string; stroke?: string }) => {
  const { sourceX, sourceY, targetX, targetY, style = {} } = props;
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const edgeStyle = { ...style };
  if (props.strokeDasharray) edgeStyle.strokeDasharray = props.strokeDasharray;
  if (props.stroke) edgeStyle.color = props.stroke;

  return (
    <line
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
      style={edgeStyle}
      strokeWidth={2}
    />
  );
};

// Render functions
export const renderPrerequisiteEdge = (props: EdgeProps) => {
  return DefaultEdge(props);
};

export const renderRelatedEdge = (props: EdgeProps) => {
  return DefaultEdge({ ...props, strokeDasharray: "5,5" });
};

export const renderContradictsEdge = (props: EdgeProps) => {
  return DefaultEdge({ ...props, stroke: "var(--color-state-leech)" });
};
