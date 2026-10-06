/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, TopNavTab } from './components/Header';
import { TicketList } from './components/Workbench/TicketList';
import { ChatConversation } from './components/Workbench/ChatConversation';
import { CopilotPanel } from './components/Workbench/CopilotPanel';
import { CitationModal } from './components/CitationModal';
import { PmConsoleModal } from './components/PmConsoleModal';
import { HandoverView } from './components/CrossBaseHandover/HandoverView';
import { InterviewGuideView } from './components/InterviewGuide/InterviewGuideView';
import {
  INITIAL_TICKETS,
  INITIAL_KNOWLEDGE_CHUNKS,
  INITIAL_BENCHMARK_ITEMS,
  PROMPT_VERSIONS,
  MODEL_ROUTING_RULES,
  TOKEN_COST_RECORDS
} from './data/initialData';
import {
  Ticket,
  KnowledgeChunk,
  KnowledgeCitation,
  AiDraftSuggestion,
  BaseLocation
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentBase, setCurrentBase] = useState<BaseLocation>('石家庄运营总部 (白班)');
  const [agentStatus, setAgentStatus] = useState<'online' | 'busy' | 'break' | 'offline'>('online');
  const [activeNavTab, setActiveNavTab] = useState<TopNavTab>('workbench');
  const [isPmConsoleOpen, setIsPmConsoleOpen] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(INITIAL_TICKETS[0].id);
  const [knowledgeChunks, setKnowledgeChunks] = useState<KnowledgeChunk[]>(INITIAL_KNOWLEDGE_CHUNKS);
  const [activeCitation, setActiveCitation] = useState<KnowledgeCitation | null>(null);
  const [externalDraftToInsert, setExternalDraftToInsert] = useState<string>('');

  // Frontline agent adoption counters
  const [adoptedCount, setAdoptedCount] = useState<number>(14);
  const [totalSuggestions, setTotalSuggestions] = useState<number>(24);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const currentTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  // 1. One-click Adopt Draft
  const handleAdoptDraft = (draft: AiDraftSuggestion) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === draft.ticketId) {
          const updatedDraft: AiDraftSuggestion = {
            ...draft,
            status: 'adopted'
          };
          const newAgentMessage = {
            id: `msg-agent-${Date.now()}`,
            sender: 'agent' as const,
            senderName: `董亚旗 (石家庄/A-2048)`,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            language: t.language,
            originalText: draft.originalDraftTargetLang,
            translatedText: draft.translatedDraftAgentLang,
            isAiAssisted: true,
            adoptedFromAi: true
          };

          return {
            ...t,
            currentAiDraft: updatedDraft,
            status: 'waiting_client',
            messages: [...t.messages, newAgentMessage]
          };
        }
        return t;
      })
    );

    setAdoptedCount((prev) => prev + 1);
    showToast('已一键采纳并发送AI回复草稿！系统已自动标记[AI-Copilot-Assisted]，客户无感知，数据回流至调优飞轮。');
  };

  // 2. Edit then Adopt Draft
  const handleEditAdoptDraft = (draft: AiDraftSuggestion) => {
    setExternalDraftToInsert(draft.originalDraftTargetLang);
    showToast('草稿已带入坐席回复框，请进行本土化微调后点击【发送回复给客户】。', 'info');
  };

  // 3. Reject Draft with Reason
  const handleRejectDraft = (draft: AiDraftSuggestion, reason: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === draft.ticketId) {
          return {
            ...t,
            currentAiDraft: {
              ...draft,
              status: 'rejected',
              rejectionReason: reason
            }
          };
        }
        return t;
      })
    );

    showToast(`已记录拒绝原因：“${reason}”。已回流至Prompt调优与切片质检池。`, 'warn');
  };

  // 4. Send Message from Chat Box
  const handleSendMessage = (text: string, isAiAssisted: boolean) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === selectedTicketId) {
          const newMsg = {
            id: `msg-agent-${Date.now()}`,
            sender: 'agent' as const,
            senderName: '董亚旗 (石家庄/A-2048)',
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            language: t.language,
            originalText: text,
            isAiAssisted: isAiAssisted
          };
          return {
            ...t,
            status: 'waiting_client',
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );
    showToast('回复已成功发送给客户。');
    setExternalDraftToInsert('');
  };

  // 5. Advance SOP step
  const handleAdvanceSopStep = () => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === selectedTicketId) {
          const nextIndex = Math.min(t.currentSopIndex + 1, t.sopSteps.length - 1);
          const updatedSteps = t.sopSteps.map((s, idx) => ({
            ...s,
            isCompleted: idx <= nextIndex
          }));
          return {
            ...t,
            currentSopIndex: nextIndex,
            sopSteps: updatedSteps
          };
        }
        return t;
      })
    );
    showToast('SOP 标准流程节点已顺利推进！');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100/70 font-sans antialiased text-slate-800 overflow-hidden select-none">
      {/* Frontline Agent Top Navigation Bar */}
      <Header
        currentBase={currentBase}
        setCurrentBase={(base) => {
          setCurrentBase(base);
          showToast(`已切换当前值班基地至：${base}`);
        }}
        agentStatus={agentStatus}
        setAgentStatus={(status) => {
          setAgentStatus(status);
          const map = {
            online: '在线接单中 (Ready)',
            busy: '忙碌 (ACW 后处理)',
            break: '小休中 (Break 15m)',
            offline: '离线签退'
          };
          showToast(`坐席状态已变更为：${map[status]}`);
        }}
        adoptedCount={adoptedCount}
        totalSuggestions={totalSuggestions}
        activeNavTab={activeNavTab}
        setActiveNavTab={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'pm_console') {
            setIsPmConsoleOpen(true);
          }
        }}
        onOpenPmConsole={() => setIsPmConsoleOpen(!isPmConsoleOpen)}
        isPmConsoleOpen={isPmConsoleOpen}
      />

      {/* Main View Area switched via Top Menu */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeNavTab === 'workbench' && (
          <>
            <TicketList
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={(t) => setSelectedTicketId(t.id)}
            />
            <ChatConversation
              ticket={currentTicket}
              onSendMessage={handleSendMessage}
              onAdvanceSopStep={handleAdvanceSopStep}
              externalDraftToInsert={externalDraftToInsert}
            />
            <CopilotPanel
              ticket={currentTicket}
              onAdoptDraft={handleAdoptDraft}
              onEditAdoptDraft={handleEditAdoptDraft}
              onRejectDraft={handleRejectDraft}
              onViewCitation={(cite) => setActiveCitation(cite)}
            />
          </>
        )}

        {activeNavTab === 'handover' && (
          <HandoverView
            tickets={tickets}
            onSelectTicketForWorkbench={(ticket) => {
              setSelectedTicketId(ticket.id);
              setActiveNavTab('workbench');
              showToast(`已选择工单 ${ticket.id}，已无缝切换回坐席协同工作台`);
            }}
          />
        )}

        {activeNavTab === 'interview' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <InterviewGuideView />
          </div>
        )}
      </main>

      {/* Knowledge Base Citation Drawer */}
      <CitationModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Product Manager & Supervisor Architecture Console Modal */}
      <PmConsoleModal
        isOpen={isPmConsoleOpen}
        onClose={() => {
          setIsPmConsoleOpen(false);
          if (activeNavTab === 'pm_console') {
            setActiveNavTab('workbench');
          }
        }}
        tickets={tickets}
        onSelectTicketForWorkbench={(ticket) => {
          setSelectedTicketId(ticket.id);
          setIsPmConsoleOpen(false);
          setActiveNavTab('workbench');
          showToast(`已选择工单 ${ticket.id} 并切换至一线坐席工作台`);
        }}
        knowledgeChunks={knowledgeChunks}
        benchmarkItems={INITIAL_BENCHMARK_ITEMS}
        promptVersions={PROMPT_VERSIONS}
        modelRules={MODEL_ROUTING_RULES}
        costRecords={TOKEN_COST_RECORDS}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border bg-white border-teal-200 text-slate-800 animate-in fade-in slide-in-from-bottom-2 ring-1 ring-slate-900/5">
          {toastMessage.type === 'warn' ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
