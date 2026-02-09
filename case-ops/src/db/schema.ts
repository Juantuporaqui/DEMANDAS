// ============================================
// CASE OPS - Dexie Database Schema
// ============================================

import Dexie, { type EntityTable } from 'dexie';
import type {
  Settings,
  Counter,
  Case,
  Document,
  DocFile,
  Span,
  Fact,
  Issue,
  Partida,
  Event,
  Strategy,
  Task,
  Link,
  AuditLog,
  AnalyticsMeta,
  Rule,
  ScenarioModel,
  ScenarioNode,
  ScenarioBrief,
  ScenarioRefutation,
} from '../types';

// Database Schema Version
export const SCHEMA_VERSION = 5;

// Database class extending Dexie
class CaseOpsDB extends Dexie {
  settings!: EntityTable<Settings, 'id'>;
  counters!: EntityTable<Counter, 'id'>;
  cases!: EntityTable<Case, 'id'>;
  documents!: EntityTable<Document, 'id'>;
  docFiles!: EntityTable<DocFile, 'id'>;
  spans!: EntityTable<Span, 'id'>;
  facts!: EntityTable<Fact, 'id'>;
  issues!: EntityTable<Issue, 'id'>;
  partidas!: EntityTable<Partida, 'id'>;
  events!: EntityTable<Event, 'id'>;
  strategies!: EntityTable<Strategy, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  links!: EntityTable<Link, 'id'>;
  rules!: EntityTable<Rule, 'id'>;
  scenario_briefs!: EntityTable<ScenarioBrief, 'id'>;
  scenario_refutations!: EntityTable<ScenarioRefutation, 'id'>;
  scenario_models!: EntityTable<ScenarioModel, 'id'>;
  scenario_nodes!: EntityTable<ScenarioNode, 'id'>;
  auditLogs!: EntityTable<AuditLog, 'id'>;
  analytics_meta!: EntityTable<AnalyticsMeta, 'id'>;

  constructor() {
    super('CaseOpsDB');

    this.version(SCHEMA_VERSION).stores({
      // Settings table - singleton
      settings: 'id',

      // Counters for sequential IDs
      counters: 'id',

      // Cases - main litigation containers
      cases: 'id, &caseKey, title, court, type, status, parentCaseId, updatedAt, *tags',

      // Documents - metadata only (blobs in docFiles)
      documents: 'id, caseId, title, docType, hashSha256, fileId, annexCode, updatedAt, *tags',

      // Document files - actual blobs stored here
      docFiles: 'id, hashSha256',

      // Spans - page ranges within documents
      spans: 'id, documentId, caseId, label, updatedAt, *tags',

      // Facts - legal facts to prove/defend
      facts: 'id, caseId, title, status, burden, risk, strength, updatedAt, *tags',

      // Issues - debated items for scenarios
      issues: 'id, caseId, title, updatedAt, *tags',

      // Partidas - economic items
      partidas: 'id, caseId, date, amountCents, state, updatedAt, *tags',

      // Events - timeline entries
      events: 'id, caseId, date, type, updatedAt, *tags',

      // Strategies - war room entries
      strategies: 'id, caseId, updatedAt, *tags',

      // Tasks - action items
      tasks: 'id, caseId, dueDate, priority, status, updatedAt',

      // Links - generic entity relationships
      links: 'id, fromType, fromId, toType, toId, [fromType+fromId], [toType+toId], updatedAt',

      // Rules - legal modifiers for scenarios
      rules: 'id, caseId, title, updatedAt, *appliesToTags',

      // Scenario briefs - audiencia tactics (escenarios)
      scenario_briefs: 'id, caseId, tipo, updatedAt',

      // Scenario refutations - audiencia matrix
      scenario_refutations: 'id, caseId, updatedAt',

      // Scenario models - alternative assumptions
      scenario_models: 'id, caseId, name, updatedAt',

      // Scenario nodes - overrides per scenario
      scenario_nodes: 'id, scenarioId, nodeType, nodeId, updatedAt, [scenarioId+nodeType+nodeId]',

      // Audit log - optional tracking
      auditLogs: 'id, at, action, entityType, entityId',

      // Analytics meta - singleton configuration
      analytics_meta: 'id, updatedAt',
    });
  }
}

// Singleton database instance
export const db = new CaseOpsDB();

// Export for type inference
export type { CaseOpsDB };
