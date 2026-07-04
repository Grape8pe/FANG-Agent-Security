export type ActionType = 'fs_read' | 'fs_write' | 'shell_exec' | 'http_request' | 'db_query' | 'email_send' | 'kill_switch' | 'other';

export interface ActionDescriptor {
  type: ActionType;
  resource: string;
  parameters?: Record<string, any>;
  agentId: string;
  sessionId: string;
}

export type Decision = 'allow' | 'deny' | 'approval_required' | 'grant_required' | 'kill';

export interface DecisionResult {
  decision: Decision;
  reason: string;
  riskScore: number;
  metadata?: Record<string, any>;
}

export interface Policy {
  id: string;
  rules: Array<{
    pattern: string;
    action: Decision;
    conditions?: any;
  }>;
}