import React, { useState } from 'react';
import {
  X,
  Layers,
  ShieldCheck,
  Zap,
  TrendingUp,
  HelpCircle,
  Settings,
  ArrowLeft,
  BookOpen,
  Globe
} from 'lucide-react';
import { KnowledgeBaseView } from './KnowledgeBase/KnowledgeBaseView';
import { EvaluationLabView } from './EvaluationLab/EvaluationLabView';
import { ModelRoutingView } from './ModelRouting/ModelRoutingView';
import { KpiDashboardView } from './KpiDashboard/KpiDashboardView';
import { InterviewGuideView } from './InterviewGuide/InterviewGuideView';
import { HandoverView } from './CrossBaseHandover/HandoverView';
import {
  KnowledgeChunk,
  BenchmarkItem,
  PromptVersion,
  ModelRouteRule,
  TokenCostRecord,
  Ticket
} from '../types';

interface PmConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeChunks: KnowledgeChunk[];
  benchmarkItems: BenchmarkItem[];
  promptVersions: PromptVersion[];
  modelRules: ModelRouteRule[];
  costRecords: TokenCostRecord[];
  tickets?: Ticket[];
  onSelectTicketForWorkbench?: (ticket: Ticket) => void;
}

export const PmConsoleModal: React.FC<PmConsoleModalProps> = ({
  isOpen,
  onClose,
  knowledgeChunks,
  benchmarkItems,
  promptVersions,
  modelRules,
  costRecords,
  tickets = [],
  onSelectTicketForWorkbench
}) => {
  const [activePmTab, setActivePmTab] = useState<'kpi' | 'knowledge' | 'evaluation' | 'routing' | 'handover' | 'interview'>('kpi');

  if (!isOpen) return null;

  const pmTabs = [
    { id: 'kpi', label: '7大核心量化指标驾驶舱', icon: TrendingUp, desc: '采纳率52% · AHT-23% · 首次响应1.8m · 0幻觉' },
    { id: 'knowledge', label: 'RAG切片治理与0.7阈值实验室', icon: Layers, desc: '512Token分块 · BGE多语言向量检索 · 0.7防幻觉' },
    { id: 'evaluation', label: '黄金评测集与Prompt 15版本演进', icon: ShieldCheck, desc: '100+用例 · 正常/边界/合规三分类 · 离线回归' },
    { id: 'routing', label: '模型分层路由与Token成本大盘', icon: Zap, desc: '通义千问+DeepSeek+Ollama · 单座席月均120元' },
    { id: 'handover', label: '7×24小时跨基地交接班看板', icon: Globe, desc: '石家庄白班 ↔ 吉隆坡夜班 结构化无缝流转' },
    { id: 'interview', label: 'STAR项目架构与高频20问答辩全书', icon: HelpCircle, desc: '900字STAR逐字稿 · 20道核心面试追问与回答' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 text-slate-800 animate-in fade-in duration-150">
      {/* Console Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 text-xs transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回坐席一线工作台</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-600" />
                出海多语种 AI 坐席助手 · 产品经理系统设计与后台治理中枢
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                PM & Supervisor Architecture Console
              </span>
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">
              用于架构解构、算法/工程调优验证、Token成本监控与面试复盘，不干扰一线坐席日常接单操作
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Console Nav Ribbon */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center space-x-2 overflow-x-auto">
        {pmTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePmTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePmTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition shrink-0 cursor-pointer ${
                isActive
                  ? 'border-amber-500 text-amber-900 bg-amber-50/70 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Console View Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-50">
        {activePmTab === 'kpi' && <KpiDashboardView />}
        {activePmTab === 'knowledge' && <KnowledgeBaseView chunks={knowledgeChunks} />}
        {activePmTab === 'evaluation' && (
          <EvaluationLabView
            benchmarkItems={benchmarkItems}
            promptVersions={promptVersions}
          />
        )}
        {activePmTab === 'routing' && (
          <ModelRoutingView rules={modelRules} costRecords={costRecords} />
        )}
        {activePmTab === 'handover' && (
          <HandoverView
            tickets={tickets}
            onSelectTicketForWorkbench={onSelectTicketForWorkbench}
          />
        )}
        {activePmTab === 'interview' && <InterviewGuideView />}
      </div>
    </div>
  );
};
