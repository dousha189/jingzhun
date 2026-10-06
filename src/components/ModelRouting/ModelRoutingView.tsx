import React, { useState } from 'react';
import {
  Zap,
  Server,
  DollarSign,
  TrendingUp,
  Cpu,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Layers,
  Database
} from 'lucide-react';
import { ModelRouteRule, TokenCostRecord } from '../../types';

interface ModelRoutingViewProps {
  rules: ModelRouteRule[];
  costRecords: TokenCostRecord[];
}

export const ModelRoutingView: React.FC<ModelRoutingViewProps> = ({
  rules,
  costRecords
}) => {
  const [activeTab, setActiveTab] = useState<'routing' | 'costs' | 'concurrency'>('routing');
  const [isSimulatingAiDown, setIsSimulatingAiDown] = useState(false);
  const [simulatedConcurrency, setSimulatedConcurrency] = useState(30);

  const latestRecord = costRecords[costRecords.length - 1];

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col h-full overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            多模型分层路由引擎与 Token 成本管控大盘
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            英文/西文用通义千问 · 小语种用DeepSeek · 敏感客户用Ollama本地部署 · 单座席月均AI成本约120元 (占人力3%)
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('routing')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'routing'
                ? 'bg-white text-amber-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            模型分层路由规则
          </button>
          <button
            onClick={() => setActiveTab('costs')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'costs'
                ? 'bg-white text-amber-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Token成本与ROI大盘
          </button>
          <button
            onClick={() => setActiveTab('concurrency')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'concurrency'
                ? 'bg-white text-amber-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            高并发限流与降级容灾
          </button>
        </div>
      </div>

      {/* TAB 1: Layered Model Routing */}
      {activeTab === 'routing' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Strategy Highlight */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-700 text-xs leading-relaxed space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Cpu className="w-4 h-4 text-amber-600" />
              面试与架构重点：为什么要做分层模型路由？而不是只用一个模型？
            </div>
            <p>
              BPO客服外包行业利润薄（毛利通常仅 15%-20%），如果统一用高阶大模型，海量多语种调用会导致Token成本失控；而统一用便宜模型又无法保证欧美大语种的复杂争议推理。<strong>因此产品经理必须做场景分层，追求综合性价比极致最优。</strong>
            </p>
          </div>

          {/* Rules Cards */}
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {rule.displayName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      当前活跃
                    </span>
                  </div>
                  <div className="text-slate-700">
                    <strong>适用场景：</strong> {rule.scenario}
                  </div>
                  <div className="text-slate-500">
                    <strong>覆盖语种：</strong> {rule.languageScope}
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-sans">
                    <strong>选型理由：</strong> {rule.reason}
                  </p>
                </div>

                <div className="flex md:flex-col items-end gap-3 text-right shrink-0 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">千Token单价</span>
                    <span className="text-sm font-bold text-amber-700">
                      ¥{rule.costPer1kTokens.toFixed(3)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">P95响应时延</span>
                    <span className="text-xs font-semibold text-teal-700">
                      {rule.avgLatencyMs} ms
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Token Cost & ROI Dashboard */}
      {activeTab === 'costs' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">单座席月均AI调用成本</span>
              <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block">
                ¥{latestRecord.costPerSeatRMB}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">仅占人力成本约 {latestRecord.pctOfLaborCost}%</span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">AHT缩短节省总工时</span>
              <span className="text-2xl font-bold font-mono text-teal-700 mt-1 block">
                {latestRecord.hoursSavedTotal} 小时/月
              </span>
              <span className="text-[10px] text-slate-400">等效释放 4.5 个全职坐席</span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">折算每月节省人力价值</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                ¥{latestRecord.estimatedLaborSavingRMB.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">按石家庄/吉隆坡均薪折算</span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">项目综合商业 ROI 倍数</span>
              <span className="text-2xl font-bold font-mono text-purple-700 mt-1 block">
                {latestRecord.netRoiMultiple}x 倍
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">投入产出显著为正</span>
            </div>
          </div>

          {/* Monthly Trend Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Token 消耗与坐席成本月度监控流水</span>
              <span className="text-xs text-slate-500">已连续 5 个月稳定受控</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50/50">
                    <th className="py-2.5 px-3">统计月份</th>
                    <th className="py-2.5 px-3">活跃坐席数</th>
                    <th className="py-2.5 px-3">消耗Token总量</th>
                    <th className="py-2.5 px-3">模型总费用(RMB)</th>
                    <th className="py-2.5 px-3">单座席月均AI成本</th>
                    <th className="py-2.5 px-3">占坐席薪资比</th>
                    <th className="py-2.5 px-3">净ROI倍数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {costRecords.map((rec) => (
                    <tr key={rec.month} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{rec.month}</td>
                      <td className="py-2.5 px-3 text-slate-700">{rec.activeSeats} 人</td>
                      <td className="py-2.5 px-3 text-slate-700">{rec.totalTokensMillions} M</td>
                      <td className="py-2.5 px-3 text-amber-700 font-semibold">¥{rec.totalCostRMB}</td>
                      <td className="py-2.5 px-3 text-teal-700 font-semibold">¥{rec.costPerSeatRMB}</td>
                      <td className="py-2.5 px-3 text-slate-700">{rec.pctOfLaborCost}%</td>
                      <td className="py-2.5 px-3 text-purple-700 font-bold">{rec.netRoiMultiple}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Concurrency & Graceful Degradation */}
      {activeTab === 'concurrency' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Explanation Box */}
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 text-slate-700 text-xs leading-relaxed space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-sky-900 text-sm">
              <Shield className="w-4 h-4 text-sky-600" />
              面试核心 Q11 &amp; Q12：AI服务挂了怎么办？30个坐席同时用并发够吗？
            </div>
            <p>
              1. <strong>降级容灾设计 (Q11)：</strong>AI是“辅助层”而非“核心交易层”。当模型接口故障时，系统自动优雅降级为纯人工模式，工单主流程、知识库搜索与发信不受任何阻断。<br />
              2. <strong>高并发队列与语义缓存 (Q12)：</strong>做请求队列调度 + 历史高频问题语义缓存（重复问题直接命中Redis缓存，Cache命中率达38%），实测30个坐席并发下P95耗时控制在8秒内。
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>高并发请求限流队列与降级熔断测试控制台</span>
              <button
                onClick={() => setIsSimulatingAiDown(!isSimulatingAiDown)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                  isSimulatingAiDown
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'
                }`}
              >
                {isSimulatingAiDown ? '🔴 正在模拟AI服务熔断/宕机' : '🟢 模拟触发AI故障熔断测试'}
              </button>
            </h3>

            {isSimulatingAiDown ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  已触发优雅降级模式 (Graceful Degradation Active)
                </div>
                <p>
                  当前外部大模型API响应超时或熔断。右侧Copilot面板已自动向坐席呈现：“AI助手维护中，当前已切换为标准人工坐席模式”。
                </p>
                <p className="text-[11px] text-rose-800 bg-white/80 p-2 rounded border border-rose-200">
                  <strong>验证效果：</strong>坐席依然能够正常打字、查询本地知识库、发送邮件与工单流转，主工单业务连续性 100% 得到保护。
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between text-slate-700 mb-1">
                    <span>当前实时活跃并发坐席数:</span>
                    <span className="font-mono font-bold text-teal-700">{simulatedConcurrency} 坐席</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={simulatedConcurrency}
                    onChange={(e) => setSimulatedConcurrency(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block text-[11px]">高频语义缓存命中率</span>
                    <span className="text-lg font-bold font-mono text-emerald-700 mt-1 block">
                      38.4%
                    </span>
                    <span className="text-[10px] text-slate-400">免调用LLM，极速直出</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block text-[11px]">队列排队等待时间</span>
                    <span className="text-lg font-bold font-mono text-teal-700 mt-1 block">
                      ~1.2 秒
                    </span>
                    <span className="text-[10px] text-slate-400">优先级调度保证紧急工单</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block text-[11px]">P95 端到端响应延迟</span>
                    <span className="text-lg font-bold font-mono text-purple-700 mt-1 block">
                      7.8 秒
                    </span>
                    <span className="text-[10px] text-slate-400">坐席可接受范围(&lt;8秒)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
