import React from 'react';
import {
  TrendingUp,
  Clock,
  UserCheck,
  ShieldCheck,
  DollarSign,
  Smile,
  CheckCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';

export const KpiDashboardView: React.FC = () => {
  const kpiCards = [
    {
      title: 'AI建议采纳率',
      value: '52.4%',
      badge: '+52% 达标',
      subtext: '英文线达60% · 小语种约45%',
      formula: '(一键采纳数 + 编辑后采纳数) ÷ AI生成草稿总数 × 100%',
      definition: '坐席对AI生成的回复草稿执行“一键采纳”或“编辑后采纳”的比例，按单按日统计取月度均值。',
      whyDefined: 'AI Copilot最核心价值指标。AI生成了建议坐席不用等于零。超过一半回复AI写好初稿，坐席只需确认或微调。',
      color: 'teal'
    },
    {
      title: '平均处理时长 (AHT)',
      value: '6.2 分钟',
      badge: '降低 23%',
      subtext: '由约 8.0 分钟降至 6.2 分钟 (取中位数)',
      formula: 'AHT = 工单完成时间 - 坐席接单时间；月度取中位数',
      definition: '从坐席接手工单到处理完成（发送回复+标记处理完毕）的时间，按单统计取中位数。',
      whyDefined: 'BPO行业的“产能货币”——客户按坐席付费，AHT越低单座席产能越高。用中位数避免投诉升级工单拉高均值。',
      color: 'emerald'
    },
    {
      title: '首次响应时间 (FRT)',
      value: '1.8 分钟',
      badge: '大幅压缩',
      subtext: '由 15分钟(人工路由) ➔ 3分钟 ➔ 1.8分钟',
      formula: '首次响应时间 = 坐席首次回复时间 - 工单创建时间',
      definition: '从工单创建到坐席首次回复客户的时间，按单统计取月度中位数。',
      whyDefined: '客户体验的第一印象与SLA考核硬指标。AI草稿让坐席“打开工单就能看到现成回复”，直接采纳即可发出。',
      color: 'sky'
    },
    {
      title: '新人上岗培训周期',
      value: '2 周',
      badge: '缩短 60%',
      subtext: '由原 4-6 周大幅压缩至 2 周达标',
      formula: '上岗周期 = 独立处理达标日期(质检≥80%) - 入职日期',
      definition: '从新人入职到能够独立处理工单（质检合格率≥80%）的时间，按人统计。',
      whyDefined: 'BPO小语种新人培训成本极高，期间只拿底薪不产生产能。缩短到2周意味着培训成本降低60%，产能提前释放1个月。',
      color: 'purple'
    },
    {
      title: '客户满意度 (CSAT)',
      value: '85.2%',
      badge: '反升 +3.2%',
      subtext: '由 82.0% 上升至 85.2% 没有下降',
      formula: 'CSAT = 满意评价数 ÷ 总评价数 × 100%',
      definition: '客户在工单结束后评价“满意/一般/不满意”的比例，按客户真实反馈统计。',
      whyDefined: 'BPO续约关键指标。证明Copilot“AI辅助让坐席回复更准确、更及时，客户体验反而更好”，而非降低质量。',
      color: 'indigo'
    },
    {
      title: 'AI幻觉/合规事件数',
      value: '0 起',
      badge: '100% 安全底线',
      subtext: '人审兜底 + 低置信度转人工 + 唯一答案源',
      formula: '事件数 = 质检发现的AI幻觉数 + 客户投诉的AI合规问题数',
      definition: 'AI生成内容中包含与知识库不符的虚假信息、或违反合规要求（承诺超权限/泄露信息）的事件数。',
      whyDefined: 'AI项目的“红线指标”。服务品牌客户，0起事件证明四层防护严密有效，这也是选择Copilot而非Autopilot的核心理由。',
      color: 'amber'
    },
    {
      title: '单座席月均AI成本',
      value: '¥120 / 人',
      badge: '占人力 3%',
      subtext: '月均模型调用总费用 ÷ 活跃坐席数',
      formula: '月均成本 = 月度模型调用总费用 ÷ 活跃坐席数',
      definition: '每个坐席每月使用AI服务产生的模型调用Token费用，按人按月统计。',
      whyDefined: 'BPO外包毛利仅15-20%，成本失控就没有商业价值。120元/月/座席，而AHT降23%带来的产能提升远大于成本，ROI显著为正。',
      color: 'rose'
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col h-full overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-teal-600" />
            项目量化指标体系与定义原因全景看板
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            经HR总监与AI产品总监双视角审视 · 严谨口径 · 计算公式 · 业务逻辑与商业价值深度印证
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>7 大量化考核指标全部超额达成</span>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((kpi) => (
            <div
              key={kpi.title}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{kpi.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {kpi.badge}
                  </span>
                </div>

                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {kpi.value}
                </div>
                <div className="text-xs text-slate-500 font-sans mt-0.5">
                  {kpi.subtext}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block font-semibold">统计口径与计算公式:</span>
                    <span className="font-mono text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 block mt-0.5">
                      {kpi.formula}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">为什么定义这个指标:</span>
                    <p className="text-slate-700 leading-relaxed font-sans mt-0.5">
                      {kpi.whyDefined}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Business Conclusion Note */}
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-slate-700 text-xs leading-relaxed space-y-2 shadow-2xs">
          <div className="font-bold text-teal-900 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-700" />
            项目商业价值结论总结 (Business Impact & ROI)
          </div>
          <p>
            覆盖九号海外、小米海外等 3 个大客户、5 个语种、30+ 坐席。AI建议采纳率稳定在 52%，坐席平均处理时长（AHT）从约 8 分钟降至 6.2 分钟（降低23%），首次响应时间压缩至 1.8 分钟，新人上岗周期缩短 60%。最重要的是在整个上线与运营周期中实现了 <strong>AI 幻觉与品牌合规事件 0 起</strong>，通过“Copilot 辅助坐席”的务实工程化路线，在保证服务质量的前提下实现了显著的 AI 降本提效，为 BPO 行业 AI 落地提供了可复制范式。
          </p>
        </div>
      </div>
    </div>
  );
};
