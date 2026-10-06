import React, { useState } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  Mail,
  Share2,
  FileText,
  Clock,
  AlertCircle,
  Tag,
  CheckCircle,
  Check,
  Flame,
  Globe,
  X,
  ArrowUpDown,
  Copy
} from 'lucide-react';
import { Ticket, ChannelType, LanguageCode, TicketPriority, ClientBrand } from '../../types';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: string;
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sla' | 'id' | 'confidence'>('sla');
  const [quickQueueFilter, setQuickQueueFilter] = useState<'all' | 'urgent' | 'handover' | 'minor_lang'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'zendesk':
        return <span title="Zendesk 在线实时会话"><MessageSquare className="w-3.5 h-3.5 text-emerald-600" /></span>;
      case 'email':
        return <span title="邮件渠道 (IMAP/SMTP)"><Mail className="w-3.5 h-3.5 text-sky-600" /></span>;
      case 'meta_social':
        return <span title="Meta / WhatsApp 海外社媒"><Share2 className="w-3.5 h-3.5 text-indigo-600" /></span>;
      case 'web_form':
        return <span title="官网售后报障表单"><FileText className="w-3.5 h-3.5 text-amber-600" /></span>;
    }
  };

  const getLangBadge = (lang: LanguageCode) => {
    const map: Record<LanguageCode, { label: string; bg: string }> = {
      pl: { label: 'PL 波兰语', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
      es: { label: 'ES 西班牙语', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
      tr: { label: 'TR 土耳其语', bg: 'bg-red-50 text-red-700 border-red-200' },
      fr: { label: 'FR 法语', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
      en: { label: 'EN 英语', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
      de: { label: 'DE 德语', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
      th: { label: 'TH 泰语', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    };
    const item = map[lang] || { label: lang.toUpperCase(), bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-medium ${item.bg}`}>
        {item.label}
      </span>
    );
  };

  const filteredTickets = tickets
    .filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.productModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchChannel = selectedChannel === 'all' || t.channel === selectedChannel;
      const matchLang = selectedLang === 'all' || t.language === selectedLang;
      const matchPriority = selectedPriority === 'all' || t.priority === selectedPriority;
      const matchBrand = selectedBrand === 'all' || t.clientBrand === selectedBrand;

      let matchQueue = true;
      if (quickQueueFilter === 'urgent') {
        matchQueue = t.slaMinutesRemaining < 20;
      } else if (quickQueueFilter === 'handover') {
        matchQueue = !!t.isHandedOver;
      } else if (quickQueueFilter === 'minor_lang') {
        matchQueue = ['pl', 'tr', 'th'].includes(t.language);
      }

      return matchSearch && matchChannel && matchLang && matchPriority && matchBrand && matchQueue;
    })
    .sort((a, b) => {
      if (sortBy === 'sla') {
        return a.slaMinutesRemaining - b.slaMinutesRemaining;
      } else if (sortBy === 'confidence') {
        return (b.currentAiDraft?.confidenceScore || 0) - (a.currentAiDraft?.confidenceScore || 0);
      } else {
        return b.id.localeCompare(a.id);
      }
    });

  return (
    <div className="w-80 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden text-slate-800">
      {/* Search & Header */}
      <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-slate-900">
              待办工单队列 ({filteredTickets.length})
            </span>
          </div>
          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-medium">
            实时聚合调度
          </span>
        </div>

        {/* Quick Queue Pills */}
        <div className="flex items-center space-x-1 text-[11px] bg-slate-100/80 p-1 rounded-lg border border-slate-200 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setQuickQueueFilter('all')}
            className={`px-2 py-1 rounded transition shrink-0 cursor-pointer ${
              quickQueueFilter === 'all' ? 'bg-white text-teal-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部 ({tickets.length})
          </button>
          <button
            onClick={() => setQuickQueueFilter('urgent')}
            className={`px-2 py-1 rounded transition shrink-0 flex items-center gap-1 cursor-pointer ${
              quickQueueFilter === 'urgent' ? 'bg-rose-600 text-white font-semibold shadow-xs' : 'text-rose-600 hover:text-rose-800'
            }`}
          >
            <Flame className="w-3 h-3" />
            紧急SLA
          </button>
          <button
            onClick={() => setQuickQueueFilter('minor_lang')}
            className={`px-2 py-1 rounded transition shrink-0 cursor-pointer ${
              quickQueueFilter === 'minor_lang' ? 'bg-amber-600 text-white font-semibold shadow-xs' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            波兰/小语种
          </button>
          <button
            onClick={() => setQuickQueueFilter('handover')}
            className={`px-2 py-1 rounded transition shrink-0 cursor-pointer ${
              quickQueueFilter === 'handover' ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            夜班交接
          </button>
        </div>

        {/* Search Bar with clear button */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="搜索工单号/SN码/客户邮箱/标题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3 Filters + Sorting Dropdown */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-[11px]">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 text-[11px] focus:outline-none focus:bg-white truncate cursor-pointer"
          >
            <option value="all">品牌: 全部</option>
            <option value="Ninebot Segway">九号 Segway</option>
            <option value="Xiaomi Global">小米海外</option>
            <option value="Niu Technologies">小牛电动</option>
          </select>

          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 text-[11px] focus:outline-none focus:bg-white truncate cursor-pointer"
          >
            <option value="all">语种: 全部</option>
            <option value="pl">PL 波兰语</option>
            <option value="es">ES 西班牙语</option>
            <option value="tr">TR 土耳其语</option>
            <option value="fr">FR 法语</option>
            <option value="en">EN 英语</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 text-[11px] focus:outline-none focus:bg-white truncate cursor-pointer"
          >
            <option value="sla">排序: SLA优先</option>
            <option value="confidence">排序: AI置信度</option>
            <option value="id">排序: 工单编号</option>
          </select>
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
        {filteredTickets.map((ticket) => {
          const isSelected = ticket.id === selectedTicketId;
          const isUrgent = ticket.slaMinutesRemaining < 20;

          return (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={`p-3 cursor-pointer transition-all border-l-3 relative group ${
                isSelected
                  ? 'bg-teal-50/70 border-teal-600 shadow-2xs'
                  : 'hover:bg-slate-50 border-transparent'
              }`}
            >
              {/* Top Row: Channel icon, Brand, Lang, SLA */}
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-slate-100 border border-slate-200">
                    {getChannelIcon(ticket.channel)}
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[100px]">
                    {ticket.clientBrand}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {getLangBadge(ticket.language)}
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                      isUrgent
                        ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    {ticket.slaMinutesRemaining}m
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 mb-1 leading-snug">
                {ticket.title}
              </h4>

              {/* User, Product, and Quick Copy button */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between mb-1.5">
                <span className="truncate max-w-[140px] text-slate-600">{ticket.userIdentifier}</span>
                <button
                  onClick={(e) => handleCopyId(e, ticket.id)}
                  title="点击复制工单号"
                  className="text-[10px] font-mono text-slate-400 hover:text-teal-700 flex items-center gap-0.5 transition cursor-pointer"
                >
                  {copiedId === ticket.id ? (
                    <span className="text-emerald-600 font-bold">已复制!</span>
                  ) : (
                    <>
                      <span>{ticket.id}</span>
                      <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition" />
                    </>
                  )}
                </button>
              </div>

              {/* Status and Sub-conversation Tag */}
              <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span className="truncate max-w-[120px]">{ticket.productModel}</span>
                </div>

                {ticket.currentAiDraft && ticket.currentAiDraft.status === 'adopted' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" />
                    已采纳草稿
                  </span>
                ) : ticket.currentAiDraft ? (
                  <span className="inline-flex items-center gap-1 text-teal-800 font-mono font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    AI草稿 ({(ticket.currentAiDraft.confidenceScore * 100).toFixed(0)}%)
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

