export type ChannelType = 'zendesk' | 'email' | 'meta_social' | 'web_form';

export type LanguageCode = 'pl' | 'es' | 'fr' | 'tr' | 'th' | 'en' | 'de';

export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TicketStatus = 'pending' | 'processing' | 'waiting_client' | 'resolved' | 'closed';

export type ClientBrand = 'Ninebot Segway' | 'Xiaomi Global' | 'Niu Technologies' | 'AliExpress';

export type BaseLocation = '石家庄运营总部 (白班)' | '吉隆坡交付中心 (夜班)' | '沈阳客服基地' | '大连技术中心';

export type ModelRouteType = 'qwen_max' | 'deepseek_v3' | 'ollama_local';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  timestamp: string;
  originalText: string;
  translatedText?: string;
  language: LanguageCode;
  isAiAssisted?: boolean;
  adoptedFromAi?: boolean;
}

export interface KnowledgeCitation {
  id: string;
  docTitle: string;
  docCategory: string;
  clientBrand: ClientBrand;
  section: string;
  chunkId: string;
  chunkContent: string;
  similarityScore: number;
  highlightSnippet: string;
}

export interface AiDraftSuggestion {
  id: string;
  ticketId: string;
  modelUsed: ModelRouteType;
  modelName: string;
  confidenceScore: number; // 0.0 - 1.0
  isBelowThreshold: boolean; // < 0.7
  originalDraftTargetLang: string;
  translatedDraftAgentLang: string;
  citations: KnowledgeCitation[];
  compliancePassed: boolean;
  sensitiveCheckPassed: boolean;
  suggestedAction: string;
  createdAt: string;
  status: 'pending' | 'adopted' | 'edited_adopted' | 'rejected';
  rejectionReason?: string;
  editedDraftContent?: string;
}

export interface SopStep {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  requiredFields?: string[];
  actionRecommendation: string;
}

export interface CustomerInfo {
  name?: string;
  phone?: string;
  email?: string;
  snCode?: string;
  isComplete: boolean;
  ticketCreated: boolean;
  warrantyStatus?: string;
}

export interface Ticket {
  id: string;
  mainTicketId: string; // 主工单
  userIdentifier: string; // 客户唯一标识 (跨渠道合并)
  clientBrand: ClientBrand;
  channel: ChannelType;
  language: LanguageCode;
  priority: TicketPriority;
  status: TicketStatus;
  productModel: string;
  assignedAgent: string;
  assignedBase: BaseLocation;
  createdAt: string;
  lastUpdate: string;
  slaDeadline: string;
  slaMinutesRemaining: number;
  title: string;
  messages: TicketMessage[];
  currentAiDraft?: AiDraftSuggestion;
  sopCategory: string;
  sopSteps: SopStep[];
  currentSopIndex: number;
  customerInfo?: CustomerInfo;
  handoverNotes?: string;
  isHandedOver?: boolean;
  handoverFromBase?: BaseLocation;
  handoverToBase?: BaseLocation;
}

export interface KnowledgeChunk {
  id: string;
  docId: string;
  docTitle: string;
  clientBrand: ClientBrand;
  category: 'FAQ' | '产品手册' | '保修政策' | '故障代码' | '退换货SOP';
  language: LanguageCode;
  content: string;
  tokenCount: number; // typically ~512
  tags: string[];
  lastCleanedAt: string;
  qualityScore: number;
}

export interface BenchmarkItem {
  id: string;
  language: LanguageCode;
  clientBrand: ClientBrand;
  category: 'normal' | 'boundary' | 'compliance';
  question: string;
  expectedAnswer: string;
  forbiddenKeywords: string[];
  testedModel: ModelRouteType;
  actualAccuracy: number; // 0 - 100
  relevanceScore: number;
  compliancePassed: boolean;
  lastTestedDate: string;
}

export interface PromptVersion {
  version: string;
  date: string;
  changeLog: string;
  author: string;
  benchmarkScore: number;
  adoptionRateImpact: string;
  systemPromptExcerpt: string;
  isActive: boolean;
}

export interface ModelRouteRule {
  id: string;
  scenario: string;
  languageScope: string;
  targetModel: ModelRouteType;
  displayName: string;
  costPer1kTokens: number; // in RMB
  avgLatencyMs: number;
  reason: string;
  status: 'active' | 'standby';
}

export interface TokenCostRecord {
  month: string;
  activeSeats: number;
  totalTokensMillions: number;
  totalCostRMB: number;
  costPerSeatRMB: number;
  pctOfLaborCost: number; // ~3% - 5%
  hoursSavedTotal: number;
  estimatedLaborSavingRMB: number;
  netRoiMultiple: number;
}
