import React, { useState } from 'react';
import {
  Globe,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Users,
  Building2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Ticket } from '../../types';

interface HandoverViewProps {
  tickets: Ticket[];
  onSelectTicketForWorkbench?: (ticket: Ticket) => void;
}

export const HandoverView: React.FC<HandoverViewProps> = ({ tickets, onSelectTicketForWorkbench }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket>(tickets[0]);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  // Tickets marked for handover or pending cross-base
  const handoverTickets = tickets.filter(
    (t) => t.isHandedOver || t.status === 'processing' || t.status === 'pending'
  );

  const handleGenerateSummary = () => {
    setGeneratedSummary(
      `【AI跨基地交接智能纪要 · 石家庄白班 ➔ 吉隆坡夜班】\n` +
      `工单编号：${selectedTicket.id} (${selectedTicket.clientBrand} - ${selectedTicket.productModel})\n` +
      `客户诉求：${selectedTicket.title}\n` +
      `当前进展：已核验欧洲购买凭证与SN码，确认错误代码属于欧洲官方24个月免费保修范围。\n` +
      `待办交接重点：\n` +
      `1. 等待客户提供波兰/西班牙本地取件地址及发票扫描件。\n` +
      `2. 吉隆坡夜班接班坐席收到地址后，请在欧洲物流系统生成预付费DPD/SEUR回邮运单。\n` +
      `3. 若客户有改装刷机意图，严禁指导，已在工单中绑定合规免责话术。`
    );
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col h-full overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            跨基地 7×24 小时交接班协同看板
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            告别传统“微信群+Excel”旧模式 · 石家庄白班 (08:00-20:00) ↔ 吉隆坡夜班 (20:00-08:00) 结构化上下文无缝交接
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>石家庄运营总部 (白班) 42单在线</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>吉隆坡交付中心 (夜班) 28单就绪</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Left Column: Tickets pending handover */}
        <div className="p-4 overflow-y-auto space-y-3 bg-slate-50">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-800">待交接/跨时区流转工单 ({handoverTickets.length})</span>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
              全链路上下文可追溯
            </span>
          </div>

          {handoverTickets.map((t) => {
            const isSelected = t.id === selectedTicket.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTicket(t);
                  setGeneratedSummary(null);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-xs ring-1 ring-indigo-400/20'
                    : 'bg-white border-slate-200 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-teal-700">{t.id}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    SLA剩余: {t.slaMinutesRemaining}m
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 line-clamp-1">{t.title}</h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>{t.clientBrand}</span>
                  <span className="text-indigo-600 font-medium flex items-center gap-1">
                    石家庄 ➔ 吉隆坡
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center & Right Column: Context & Handover Memorandum */}
        <div className="col-span-2 p-5 overflow-y-auto space-y-5 text-xs bg-slate-50">
          {/* Ticket Header & Bases */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-teal-700 font-bold">{selectedTicket.id}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedTicket.title}</h3>
                <span className="text-slate-500 text-xs">{selectedTicket.productModel}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block">白班接单基地</span>
                  <span className="text-xs font-semibold text-slate-700">石家庄运营总部</span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block">夜班接力基地</span>
                  <span className="text-xs font-semibold text-indigo-700">吉隆坡交付中心</span>
                </div>
              </div>
            </div>

            {/* Conversation History Summary */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-700 font-semibold block mb-1">
                白班阶段历史处理摘要 (Historical Timeline):
              </span>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-teal-700 font-mono font-medium">14:12</span>
                  <span>客户通过Zendesk发起错误代码21报障，客户语言：波兰语(PL)。</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal-700 font-mono font-medium">14:18</span>
                  <span>石家庄坐席采纳AI回复草稿，向客户发送波兰语退修条件与发票索取说明。</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-teal-700 font-mono font-medium">14:28</span>
                  <span>客户提供SN码，目前正在等待客户回传MediaMarkt购买收据与DPD上门地址。</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI One-Click Handover Memorandum Generator */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-indigo-950 text-xs">
                  一键生成跨基地交接备忘录 (AI Handover Briefing)
                </span>
              </div>
              <button
                onClick={handleGenerateSummary}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-xs transition shadow-xs"
              >
                生成本工单交接纪要
              </button>
            </div>

            {generatedSummary ? (
              <pre className="p-3 bg-white rounded-lg border border-indigo-200 text-slate-800 font-sans text-xs whitespace-pre-wrap leading-relaxed shadow-2xs">
                {generatedSummary}
              </pre>
            ) : (
              <p className="text-slate-500 text-xs">
                点击上方按钮，系统将自动汇总客户对话、SOP当前节点、待办物流事项并生成吉隆坡夜班接班备忘录。
              </p>
            )}
          </div>

          {/* SOP Pending Checklist for Night Shift */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
            <span className="font-bold text-slate-800 block">
              吉隆坡夜班坐席待办事项清单 (Action Items):
            </span>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100/60 transition cursor-pointer">
                <input type="checkbox" defaultChecked className="text-indigo-600 rounded border-slate-300" />
                <span>检查客户是否在欧洲工作时间内回传了发票扫描件</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100/60 transition cursor-pointer">
                <input type="checkbox" defaultChecked className="text-indigo-600 rounded border-slate-300" />
                <span>核实波兰DPD取件地址邮编与联系人电话格式是否符合欧盟标准</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100/60 transition cursor-pointer">
                <input type="checkbox" className="text-indigo-600 rounded border-slate-300" />
                <span>在欧洲售后物流中台调用API下发预付费运单Label并回复客户确认</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
