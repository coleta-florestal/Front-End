import type { AdminAuditEntry, AuditAction, AuditEntity, AuditLog } from '@/types/admin';
import type { AuditLogEntry } from '@/components/admin/audit/AuditLogCard';

const ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: 'criou',
  UPDATE: 'alterou',
  DELETE: 'removeu',
  COMPLETE: 'concluiu',
  REOPEN: 'reabriu',
  APPROVE: 'aprovou',
  REJECT: 'recusou',
};

const ENTITY_LABELS: Record<AuditEntity, string> = {
  USER: 'usuário',
  FARM: 'fazenda',
  PLOT: 'talhão',
  SUBPLOT: 'parcela',
  TREE: 'árvore',
  EQUATION: 'equação',
  VALIDATION_SETTINGS: 'limites de validação',
};

const NAME_KEYS = ['subPlotName', 'plotName', 'farmName', 'newName', 'name'];

function targetName(log: AuditLog, usersById: Map<string, string>): string | null {
  for (const key of NAME_KEYS) {
    const value = log.metadata?.[key];
    if (typeof value === 'string' && value) return value;
  }

  // Ações sobre usuário só trazem o id do alvo no metadata.
  const targetUserId = log.metadata?.targetUserId;
  return log.entity === 'USER' && typeof targetUserId === 'string'
    ? (usersById.get(targetUserId) ?? null)
    : null;
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function toAdminAuditEntry(log: AuditLog, usersById: Map<string, string>): AdminAuditEntry {
  return {
    id: log.id,
    timestamp: dateFormat.format(new Date(log.createdAt)).replace(',', ''),
    actorName: log.user?.name ?? 'Usuário removido',
    actionText: `${ACTION_LABELS[log.action]} ${ENTITY_LABELS[log.entity]}`,
    targetText: targetName(log, usersById) ?? '',
  };
}

export function toAuditEntry(log: AuditLog, usersById: Map<string, string>): AuditLogEntry {
  const entry = toAdminAuditEntry(log, usersById);

  return {
    id: entry.id,
    date: entry.timestamp,
    description: `${entry.actorName} ${entry.actionText}${entry.targetText ? ` · ${entry.targetText}` : ''}`,
  };
}
