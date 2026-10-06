import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  Edit3,
  XCircle,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  ThumbsDown,
  Info,
  Search,
  CheckSquare,
  FileText,
  Send
} from 'lucide-react';
import { Ticket, KnowledgeCitation, AiDraftSuggestion, KnowledgeChunk } from '../../types';

interface CopilotPanelProps {
  ticket: Ticket;
  onAdoptDraft: (draft: AiDraftSuggestion) => void;
  onEditAdoptDraft: (draft: AiDraftSuggestion) => void;
  onRejectDraft: (draft: AiDraftSuggestion, reason: string) => void;
  onViewCitation: (citation: KnowledgeCitation) => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  ticket,
  onAdoptDraft,
  onEditAdoptDraft,
  onRejectDraft,
  onViewCitation
}) => {
  const [activeSideTab, setActiveSideTab] = useState<'draft' | 'sop' | 'search' | 'handover'>('draft');
  const [copied, setCopied] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('太生硬，缺少本土客服温度');
  const [isSimulatingLowScore, setIsSimulatingLowScore] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [handoverNoteText, setHandoverNoteText] = useState(ticket.handoverNotes || '');
  const [handoverSaved, setHandoverSaved] = useState(false);

  const draft = ticket.currentAiDraft;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmReject = () => {
    if (draft) {
      onRejectDraft(draft, rejectionReason);
      setShowRejectModal(false);
    }
  };

  const handleSaveHandover = () => {
    setHandoverSaved(true);
    setTimeout(() => setHandoverSaved(false), 3000);
  };

  const currentConfidence = isSimulatingLowScore ? 0.62 : draft?.confidenceScore ?? 0.88;
  const isBelowThreshold = currentConfidence < 0.7;

  return (
    <div className="w-96 shrink-0 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden text-slate-800 shadow-xs">
      {/* Panel Top Header with Tabs for Frontline Agent */}
      <div className="bg-white border-b border-slate-200">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                Copilot 智能坐席助手
                <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-mono font-medium">
                  人审兜底
                </span>
              </h3>
              <span className="text-[10px] text-slate-500 block font-mono">
                模型: {draft?.modelName || 'DeepSeek-V3 多语言引擎'}
              </span>
            </div>
          </div>

          {/* Test <0.7 toggle for interviews/demos */}
          <button
            onClick={() => setIsSimulatingLowScore(!isSimulatingLowScore)}
            title="测试阈值：模拟检索相似度低于0.7触发第二层安全防线拦截"
            className={`text-[10px] px-2 py-0.5 rounded border transition flex items-center gap-1 ${
              isSimulatingLowScore
                ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            {isSimulatingLowScore ? '已模拟<0.7' : '测试<0.7阈值'}
          </button>
        </div>

        {/* 4 Agent Sub-Tabs */}
        <div className="flex items-center border-t border-slate-200 text-xs px-2 bg-slate-50">
          <button
            onClick={() => setActiveSideTab('draft')}
            className={`px-3 py-2 font-medium border-b-2 transition ${
              activeSideTab === 'draft'
                ? 'border-teal-600 text-teal-800 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💡 AI回复草稿
          </button>
          <button
            onClick={() => setActiveSideTab('sop')}
            className={`px-3 py-2 font-medium border-b-2 transition ${
              activeSideTab === 'sop'
                ? 'border-teal-600 text-teal-800 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 SOP办理指南
          </button>
          <button
            onClick={() => setActiveSideTab('search')}
            className={`px-3 py-2 font-medium border-b-2 transition ${
              activeSideTab === 'search'
                ? 'border-teal-600 text-teal-800 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔍 知识库速查
          </button>
          <button
            onClick={() => setActiveSideTab('handover')}
            className={`px-3 py-2 font-medium border-b-2 transition ${
              activeSideTab === 'handover'
                ? 'border-teal-600 text-teal-800 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🌙 交接备忘
          </button>
        </div>
      </div>

      {/* TAB 1: AI Draft */}
      {activeSideTab === 'draft' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
          {!draft ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              暂无AI建议草稿，正在检索匹配...
            </div>
          ) : (
            <>
              {/* Metric Pointers Ribbon */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div
                  className={`p-2 rounded-lg border flex flex-col justify-between ${
                    isBelowThreshold
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">检索相似度:</span>
                    <span className={`font-mono font-bold text-xs ${isBelowThreshold ? 'text-rose-600' : 'text-teal-700'}`}>
                      {(currentConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isBelowThreshold ? 'bg-rose-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${currentConfidence * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {isBelowThreshold ? '⚠️ 低于0.7硬约束阈值' : '✅ 达到高置信度(≥0.7)'}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">合规/红线拦截:</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full rounded-full bg-emerald-500 w-full" />
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-1">
                    100% 通过合规核验
                  </div>
                </div>
              </div>

              {/* THRESHOLD WARNING IF < 0.7 */}
              {isBelowThreshold ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-700 text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    触发四层防幻觉之第二层：低置信度直接转人工
                  </div>
                  <p>
                    本问题经BGE多语言向量检索，与客户知识库最高相似度为{' '}
                    <strong>{(currentConfidence * 100).toFixed(0)}%</strong>，低于系统设定的{' '}
                    <strong>0.70</strong> 黄金阈值。
                  </p>
                  <p className="text-[11px] text-rose-800 bg-white/80 p-2 rounded border border-rose-200">
                    坚持“知识库为唯一答案源，大模型不凭空推断”，系统已自动隐藏AI回复草稿，防止品牌虚假承诺风险，建议坐席转交二线工程师。
                  </p>
                  <button
                    onClick={() => setIsSimulatingLowScore(false)}
                    className="w-full mt-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition shadow-xs"
                  >
                    恢复正常高置信度 (0.88+) 演示
                  </button>
                </div>
              ) : (
                <>
                  {/* AI Draft in Customer Language */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                        AI回复草稿 (目标语种: {ticket.language.toUpperCase()})
                      </span>
                      <button
                        onClick={() => handleCopy(draft.originalDraftTargetLang)}
                        className="text-[10px] text-slate-600 hover:text-slate-900 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs transition"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copied ? '已复制' : '复制外文'}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto shadow-2xs">
                      {draft.originalDraftTargetLang}
                    </div>
                  </div>

                  {/* AI Draft in Agent Mother Tongue (Chinese Translation) */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        草稿中文对照 (坐席母语实时互译)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto shadow-2xs">
                      {draft.translatedDraftAgentLang}
                    </div>
                  </div>

                  {/* Citation Sources (Every sentence is grounded with references) */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        知识溯源引用 ({draft.citations.length}处依据)
                      </span>
                      <span className="text-[10px] text-slate-400">点击卡片看原文</span>
                    </div>

                    <div className="space-y-1.5">
                      {draft.citations.map((cite, index) => (
                        <div
                          key={cite.id}
                          onClick={() => onViewCitation(cite)}
                          className="p-2 rounded-lg bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 cursor-pointer transition text-xs group shadow-2xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800 text-[11px] group-hover:text-amber-800 transition truncate max-w-[220px]">
                              [{index + 1}] {cite.docTitle}
                            </span>
                            <span className="font-mono text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                              {(cite.similarityScore * 100).toFixed(0)}% 匹配
                            </span>
                          </div>
                          <div className="text-[10px] text-amber-700 truncate font-mono">
                            {cite.section}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            "{cite.highlightSnippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal QA Notice */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      发送给客户的回复若含AI生成内容，内部系统标记但客户无感知，便于质检追踪。
                    </span>
                  </div>

                  {/* ACTION BUTTONS (The 3 Core Operations) */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onAdoptDraft(draft)}
                        className="py-2.5 px-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition active:scale-98 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        一键采纳并发送
                      </button>

                      <button
                        onClick={() => onEditAdoptDraft(draft)}
                        className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-98 shadow-2xs cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-sky-600" />
                        编辑后采纳
                      </button>
                    </div>

                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="w-full py-1.5 px-3 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      拒绝并反馈原因 (回流调优Prompt)
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: SOP Guide */}
      {activeSideTab === 'sop' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[11px] block">当前工单标准化SOP分类:</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{ticket.sopCategory}</span>
          </div>

          <div className="space-y-2.5">
            {ticket.sopSteps.map((step, idx) => (
              <div
                key={step.stepNumber}
                className={`p-3 rounded-lg border space-y-1.5 ${
                  step.isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : idx === ticket.currentSopIndex
                    ? 'bg-teal-50 border-teal-500 shadow-2xs ring-1 ring-teal-500/30'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={idx === ticket.currentSopIndex ? 'text-teal-900' : 'text-slate-900'}>
                    第 {step.stepNumber} 步：{step.title}
                  </span>
                  {step.isCompleted ? (
                    <span className="text-[10px] text-emerald-700 font-mono">已完成</span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-mono">待处理</span>
                  )}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{step.description}</p>
                <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-teal-800 font-medium">
                  💡 坐席操作建议: {step.actionRecommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Instant KB Search */}
      {activeSideTab === 'search' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="搜索产品手册、错误码21、保修退换条款..."
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:border-slate-300 cursor-pointer shadow-2xs transition">
              <span className="text-[10px] text-teal-700 font-mono font-medium">Ninebot Max G30 · 错误代码21</span>
              <h5 className="font-bold text-slate-900 text-xs mt-0.5">BMS电池管理系统通信异常</h5>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                若出现红色扳手图标，通常系主控与BMS连接线虚接。1年内直接安排DPD寄修，严禁让客户拆卸底板。
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:border-slate-300 cursor-pointer shadow-2xs transition">
              <span className="text-[10px] text-sky-700 font-mono font-medium">Xiaomi Scooter 4 Pro · 西班牙</span>
              <h5 className="font-bold text-slate-900 text-xs mt-0.5">14天无理由退款与SEUR取件SOP</h5>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                必须原包装箱齐全且无撞击痕迹，下发SEUR回邮单，仓库验货合格后48小时退款。
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white hover:border-slate-300 cursor-pointer shadow-2xs transition">
              <span className="text-[10px] text-amber-700 font-mono font-medium">Niu KQi3 · 土耳其合规</span>
              <h5 className="font-bold text-slate-900 text-xs mt-0.5">严禁解限速与破解免责条例</h5>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                严格遵守当地25km/h法定交规，严禁提供工程模式密码或刷机教程，违者追责。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Handover Note */}
      {activeSideTab === 'handover' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-[11px] block">交接班目标基地:</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">吉隆坡交付中心 (夜班 20:00-08:00)</span>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">本工单交接备忘与待办事项:</label>
            <textarea
              rows={6}
              value={handoverNoteText}
              onChange={(e) => setHandoverNoteText(e.target.value)}
              placeholder="请输入留给接班坐席的上下文要点（例如：已索要发票，夜班收到后请下发DPD运单）..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white font-sans leading-relaxed resize-none"
            />
          </div>

          {handoverSaved && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>交接备忘已成功保存并同步至吉隆坡夜班接班流！</span>
            </div>
          )}

          <button
            onClick={handleSaveHandover}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            {handoverSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已同步至吉隆坡夜班</span>
              </>
            ) : (
              <span>保存并同步至吉隆坡夜班接班流</span>
            )}
          </button>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-sm w-full text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <ThumbsDown className="w-4 h-4" />
              反馈拒绝原因 (回流至Prompt与切片优化池)
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              您的反馈将作为每周回归测试的重要样本，帮助AI产品经理优化Prompt四步结构与知识库切片：
            </p>

            <div className="space-y-1.5 text-xs">
              {[
                '太生硬，缺少本土客服温度',
                '解决方案不够具体，缺少关键配件编码',
                '与客户当前型号版本不完全匹配',
                '遗漏了当地物流商(如SEUR/DPD)关键信息',
                '语气过于官方，未体现先同理心道歉'
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-200 transition text-slate-700"
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={rejectionReason === reason}
                    onChange={() => setRejectionReason(reason)}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded text-xs text-slate-500 hover:text-slate-800"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition shadow-xs"
              >
                确认提交并回流数据
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
