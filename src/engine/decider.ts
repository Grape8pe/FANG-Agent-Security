import { ActionDescriptor, DecisionResult, Decision } from '../types.js';
import { redact } from '../redact.js';

export function decide(action: ActionDescriptor): DecisionResult {
  const { type, resource } = action;
  let decision: Decision = 'allow';
  let reason = 'Default allow';
  let riskScore = 0;

  if (resource.includes('.env') || resource.includes('secret')) {
    decision = 'deny';
    reason = 'Access to secrets denied';
    riskScore = 90;
  } else if (type === 'db_query' && /drop|truncate|delete/i.test(resource)) {
    decision = 'deny';
    reason = 'Destructive database operation blocked';
    riskScore = 95;
  } else if (type === 'email_send' && action.parameters?.external) {
    decision = 'approval_required';
    reason = 'External email requires approval';
    riskScore = 60;
  } else if (type === 'kill_switch') {
    decision = 'kill';
    reason = 'Kill switch activated';
    riskScore = 100;
  } else if (type === 'http_request' && !resource.includes('localhost')) {
    decision = 'deny';
    reason = 'External exfiltration attempt blocked';
    riskScore = 85;
  }

  return {
    decision,
    reason,
    riskScore,
    metadata: { redactedResource: redact(resource) }
  };
}