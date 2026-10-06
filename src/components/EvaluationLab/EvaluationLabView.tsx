import React, { useState } from 'react';
import {
  ShieldCheck,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  GitBranch,
  Terminal,
  Activity,
  Filter,
  Check
} from 'lucide-react';
import { BenchmarkItem, PromptVersion, LanguageCode, ModelRouteType } from '../../types';

interface EvaluationLabViewProps {
  benchmarkItems: BenchmarkItem[];
  promptVersions: PromptVersion[];
}

export const EvaluationLabView: React.FC<EvaluationLabViewProps> = ({
  benchmarkItems,
  promptVersions
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode | 'all'>('pl');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'normal' | 'boundary' | 'compliance'>('all');
  const [activeTab, setActiveTab] = useState<'benchmark' | 'prompt_history'>('benchmark');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(100);
  const [selectedPromptVersion, setSelectedPromptVersion] = useState<PromptVersion>(promptVersions[0]);

  const handleRunEvaluation = () => {
    setIsRunningTest(true);
    setTestProgress(0);
    const interval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningTest(false);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const filteredItems = benchmarkItems.filter((item) => {
    const matchLang = selectedLang === 'all' || item.language === selectedLang;
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchLang && matchCategory;
  });

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col h-full overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            黄金问答评测集与 Prompt 工程实验室 (Eval & Regression Matrix)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            每语种100+条评测集（正常/边界/合规三类）· 离线保证“不出错” · 在线验证“真有用” · 经历15个版本迭代
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'benchmark'
                ? 'bg-white text-emerald-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            黄金评测集跑分 (100+条)
          </button>
          <button
            onClick={() => setActiveTab('prompt_history')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
              activeTab === 'prompt_history'
                ? 'bg-white text-emerald-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prompt 15版本演进矩阵
          </button>
        </div>
      </div>

      {/* TAB 1: Benchmark Runner */}
      {activeTab === 'benchmark' && (
        <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
          {/* Controls & Runner Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                <span>评测语种:</span>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800"
                >
                  <option value="all">全部语种</option>
                  <option value="pl">PL 波兰语 (小语种核心)</option>
                  <option value="es">ES 西班牙语</option>
                  <option value="tr">TR 土耳其语</option>
                  <option value="fr">FR 法语</option>
                  <option value="en">EN 英语 (一期基线)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                <span>用例分类:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800"
                >
                  <option value="all">正常/边界/合规全覆盖</option>
                  <option value="normal">🟢 正常业务问题 (Normal FAQ)</option>
                  <option value="boundary">🟡 边界歧义问题 (Boundary Cases)</option>
                  <option value="compliance">🔴 合规红线问题 (Compliance Redlines)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunEvaluation}
              disabled={isRunningTest}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isRunningTest ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  正在运行离线回归评测 ({testProgress}%)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  一键运行离线评测批次
                </>
              )}
            </button>
          </div>

          {/* Metric Scoreboard */}
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">离线测试集平均准确率</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5 block">
                94.8%
              </span>
              <span className="text-[10px] text-slate-400">高于上线基线标准 (90.0%)</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">回答语义相关性评分</span>
              <span className="text-xl font-bold font-mono text-teal-700 mt-0.5 block">
                93.2%
              </span>
              <span className="text-[10px] text-slate-400">BGE多语言向量检索保障</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">合规红线拦截通过率</span>
              <span className="text-xl font-bold font-mono text-amber-700 mt-0.5 block">
                100.0%
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">0起刷机/超权限承诺幻觉</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <span className="text-slate-500 block text-[11px]">当前线上生产Prompt版本</span>
              <span className="text-sm font-bold font-mono text-purple-800 mt-0.5 block truncate">
                v15.2 (生产稳定版)
              </span>
              <span className="text-[10px] text-slate-400">由坐席拒绝原因数据驱动优化</span>
            </div>
          </div>

          {/* Benchmark Items List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.id}
                    </span>
                    <span className="text-slate-800 font-semibold">{item.clientBrand}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.language}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.category === 'compliance'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.category === 'boundary'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.category === 'compliance'
                        ? '合规红线'
                        : item.category === 'boundary'
                        ? '边界用例'
                        : '正常问答'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-500">准确率: <strong className="text-emerald-700">{item.actualAccuracy}%</strong></span>
                    <span className="text-slate-500">相关性: <strong className="text-teal-700">{item.relevanceScore}%</strong></span>
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      测试通过
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">测试输入问题 (Foreign Query):</span>
                  <p className="text-slate-900 font-medium font-sans mt-0.5">{item.question}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block font-semibold mb-0.5">标准黄金回答 (Ground Truth):</span>
                    <span className="text-slate-700 leading-relaxed">{item.expectedAnswer}</span>
                  </div>

                  <div className="p-2.5 rounded bg-rose-50/70 border border-rose-200 text-rose-900">
                    <span className="text-rose-700 block font-semibold mb-0.5">禁止出现的幻觉与违规关键词:</span>
                    <span className="font-mono text-[10px]">{item.forbiddenKeywords.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Prompt Versions Matrix */}
      {activeTab === 'prompt_history' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-600" />
              Prompt 工程演进体系：从 v1.0 到 v15.2 的 15 个版本迭代轨迹
            </h3>
            <p className="text-slate-600">
              很多初级从业者以为调Prompt就是改几句形容词。在本项目中，Prompt迭代是由<strong>坐席端被拒绝建议的原因标签反向回流驱动</strong>的（每周抽取分析高频拒绝案例，提炼共性缺陷后改写Prompt并跑评测集验证）。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Left list of versions */}
            <div className="space-y-2">
              {promptVersions.map((ver) => (
                <div
                  key={ver.version}
                  onClick={() => setSelectedPromptVersion(ver)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs shadow-2xs ${
                    selectedPromptVersion.version === ver.version
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{ver.version}</span>
                    {ver.isActive && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                        当前生产
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">{ver.date} · {ver.author}</div>
                  <div className="text-[11px] text-teal-700 mt-1 font-mono font-medium">
                    评测跑分: {ver.benchmarkScore}分 · {ver.adoptionRateImpact}
                  </div>
                </div>
              ))}
            </div>

            {/* Right details of selected version */}
            <div className="col-span-2 p-5 bg-white border border-slate-200 rounded-xl space-y-4 text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {selectedPromptVersion.version}
                  </h4>
                  <span className="text-slate-500 text-xs">
                    更新日期: {selectedPromptVersion.date} · 维护人: {selectedPromptVersion.author}
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">评测基准得分</span>
                  <span className="text-base font-bold text-emerald-700">
                    {selectedPromptVersion.benchmarkScore} / 100
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 font-semibold block mb-1">
                  变更原因与业务驱动 (ChangeLog):
                </span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-sans">
                  {selectedPromptVersion.changeLog}
                </p>
              </div>

              <div>
                <span className="text-slate-700 font-semibold block mb-1">
                  系统提示词核心架构摘录 (System Prompt Excerpt):
                </span>
                <pre className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                  {selectedPromptVersion.systemPromptExcerpt}
                </pre>
              </div>

              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-purple-900 text-[11px]">
                <strong>业务效果量化：</strong> {selectedPromptVersion.adoptionRateImpact}。每次改写Prompt后必须在离线评测集完整回归，确保合规性不发生版本漂移。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
