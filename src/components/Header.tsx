import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Building2,
  Clock,
  ChevronDown,
  Layers,
  Zap,
  HelpCircle,
  TrendingUp,
  LayoutDashboard,
  ArrowRightLeft,
  Settings,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';
import { BaseLocation } from '../types';

export type TopNavTab = 'workbench' | 'handover' | 'pm_console' | 'interview';

interface HeaderProps {
  currentBase: BaseLocation;
  setCurrentBase: (base: BaseLocation) => void;
  agentStatus: 'online' | 'busy' | 'break' | 'offline';
  setAgentStatus: (status: 'online' | 'busy' | 'break' | 'offline') => void;
  adoptedCount: number;
  totalSuggestions: number;
  activeNavTab: TopNavTab;
  setActiveNavTab: (tab: TopNavTab) => void;
  onOpenPmConsole: () => void;
  isPmConsoleOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentBase,
  setCurrentBase,
  agentStatus,
  setAgentStatus,
  adoptedCount,
  totalSuggestions,
  activeNavTab,
  setActiveNavTab,
  onOpenPmConsole,
  isPmConsoleOpen
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showBaseMenu, setShowBaseMenu] = useState(false);

  const getStatusBadge = () => {
    switch (agentStatus) {
      case 'online':
        return { label: '在线接单中', color: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50' };
      case 'busy':
        return { label: '忙碌 (工单后处理)', color: 'bg-amber-500', text: 'text-amber-800', border: 'border-amber-200', bg: 'bg-amber-50' };
      case 'break':
        return { label: '小休中 (15分钟)', color: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50' };
      case 'offline':
        return { label: '离线', color: 'bg-slate-400', text: 'text-slate-600', border: 'border-slate-200', bg: 'bg-slate-100' };
    }
  };

  const statusInfo = getStatusBadge();

  const navItems = [
    {
      id: 'workbench' as TopNavTab,
      label: '坐席协同工作台',
      icon: LayoutDashboard,
      badge: '实时接单',
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      id: 'handover' as TopNavTab,
      label: '7×24小时跨基地交接',
      icon: ArrowRightLeft,
      badge: '石家庄 ➔ 吉隆坡',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'pm_console' as TopNavTab,
      label: 'PM设计与治理中枢',
      icon: Settings,
      badge: 'RAG·评测·路由',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'interview' as TopNavTab,
      label: 'STAR面试答辩架构全书',
      icon: HelpCircle,
      badge: '高频20问',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-xs select-none">
      {/* Level 1: System Title & Frontline Info Bar */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs gap-3">
        {/* Left: Branding & Agent Desk Identification */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-sm shadow-xs">
              普
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold tracking-tight text-sm">
                  PrecisionDesk · 出海多语种智能客服坐席端
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                  AI-Copilot 内置版
                </span>
              </div>
              <span className="text-slate-400 text-[11px] block">
                北京精准互通科技 · 多语种BPO客服一线工作台
              </span>
            </div>
          </div>

          {/* Delivery Base Selector Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowBaseMenu(!showBaseMenu)}
              className="hidden lg:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-slate-500 text-[11px]">基地:</span>
              <span className="font-semibold text-slate-800 text-xs">{currentBase}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {showBaseMenu && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 text-xs divide-y divide-slate-100">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  切换服务交付基地
                </div>
                {[
                  { name: '石家庄运营总部 (白班)', time: '08:00-20:00', tag: '当前在线主力' },
                  { name: '吉隆坡交付中心 (夜班)', time: '20:00-08:00', tag: '跨时区接力' },
                  { name: '沈阳客服基地', time: '日韩/俄语线', tag: '区域分中心' },
                  { name: '大连技术中心', time: '算法与质检支持', tag: '工程中台' }
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setCurrentBase(b.name as BaseLocation);
                      setShowBaseMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                      currentBase === b.name ? 'bg-teal-50/70 text-teal-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.time}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                      {b.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Agent Real-Time Quantitative Performance */}
        <div className="hidden xl:flex items-center gap-4 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
          <div className="flex items-center gap-1.5" title="今日个人结单数量与班组日标达成率">
            <span className="text-slate-500">今日结单:</span>
            <span className="font-mono font-bold text-teal-700">58 单</span>
            <span className="text-[10px] text-slate-400">/ 60单 (96.6%)</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3" title="平均会话处理时长 (Average Handling Time)">
            <span className="text-slate-500">AHT:</span>
            <span className="font-mono font-bold text-emerald-700">5.9 分钟</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1 rounded border border-emerald-200">
              -26% 降本
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3" title="AI回复草稿一线采纳率 (Adoption Rate)">
            <span className="text-slate-500">AI采纳率:</span>
            <span className="font-mono font-bold text-teal-700">
              {((adoptedCount / Math.max(totalSuggestions, 1)) * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400">({adoptedCount}/{totalSuggestions})</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3" title="首响时长 (First Response Time)">
            <span className="text-slate-500">首响 FRT:</span>
            <span className="font-mono font-bold text-sky-700">1.6 分钟</span>
            <span className="text-[10px] text-sky-600 font-medium">合规</span>
          </div>
        </div>

        {/* Right: Agent Status & Profile */}
        <div className="flex items-center gap-3">
          {/* Agent Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${statusInfo.bg} ${statusInfo.border} ${statusInfo.text} shadow-2xs hover:brightness-95`}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`} />
              <span>{statusInfo.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 text-xs divide-y divide-slate-100">
                <button
                  onClick={() => { setAgentStatus('online'); setShowStatusMenu(false); }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>在线 (Ready 接单)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-mono">进线优先</span>
                </button>
                <button
                  onClick={() => { setAgentStatus('busy'); setShowStatusMenu(false); }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>忙碌 (ACW 后处理)</span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-mono">暂不分配</span>
                </button>
                <button
                  onClick={() => { setAgentStatus('break'); setShowStatusMenu(false); }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>小休 (Break 15m)</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono">午间/工间</span>
                </button>
                <button
                  onClick={() => { setAgentStatus('offline'); setShowStatusMenu(false); }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 text-slate-500 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>签退离线 (Offline)</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Agent Avatar */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-2xs ring-1 ring-teal-500/20">
              董
            </div>
            <div className="leading-tight text-left">
              <span className="font-semibold text-slate-800 text-xs">董亚旗</span>
              <span className="text-[10px] text-teal-700 block font-mono">工号 A-2048</span>
            </div>
          </div>
        </div>
      </div>

      {/* Level 2: Top Interactive Navigation Tabs Bar (菜单栏核心交互) */}
      <div className="px-4 bg-white flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNavTab(item.id);
                  if (item.id === 'pm_console') {
                    onOpenPmConsole();
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-teal-600 text-teal-800 bg-teal-50/50 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Help / Architecture Badge on Right of Navigation */}
        <div className="hidden md:flex items-center gap-2 text-slate-500 text-[11px] py-1.5">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
            <Sparkles className="w-2.5 h-2.5 text-teal-600" />
            Dify + BGE多语言向量 + DeepSeek-V3 / Qwen-Max
          </span>
        </div>
      </div>
    </header>
  );
};

