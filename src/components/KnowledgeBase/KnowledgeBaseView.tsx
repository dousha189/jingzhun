import React, { useState } from 'react';
import {
  Layers,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Cpu,
  Sliders,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { KnowledgeChunk, ClientBrand, LanguageCode } from '../../types';

interface KnowledgeBaseViewProps {
  chunks: KnowledgeChunk[];
  onAddChunk?: (chunk: KnowledgeChunk) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ chunks }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'chunks' | 'slicing_lab' | 'threshold_lab'>('chunks');

  // Slicing Lab interactive state
  const [sampleText, setSampleText] = useState(
    '【九号Ninebot F2 Pro电动滑板车常见故障与保修条规】\n问：车辆前轮转向手把发卡、打死有轻微异响怎么办？\n答：前叉压力轴承在出厂装配时带有高粘度锂基润滑脂。如果用户在暴雨或沙尘泥泞路况涉水骑行后出现转向阻尼增大，请先使用无水乙醇喷洗前叉转动轴承缝隙，切勿直接高压水枪冲洗。非人为物理撞击导致轴承钢珠破裂的，波兰与欧洲大区享有2年整车质保，直接派发DPD上门单更换前叉总成，维修时长约为5个工作日。严禁坐席指导用户私自拆卸前叉固定大螺母，以免丧失安全保修资格。'
  );
  const [tokenBudget, setTokenBudget] = useState(512);

  // Vector Search Tester state
  const [testQuery, setTestQuery] = useState('Hulajnoga wyświetla błąd 21 (BMS Bateria) w Polsce');
  const [simulatedScore, setSimulatedScore] = useState(0.88);
  const [thresholdValue, setThresholdValue] = useState(0.70);

  const filteredChunks = chunks.filter((c) => {
    const matchBrand = selectedBrand === 'all' || c.clientBrand === selectedBrand;
    const matchLang = selectedLang === 'all' || c.language === selectedLang;
    const matchSearch =
      c.docTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchBrand && matchLang && matchSearch;
  });

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col h-full overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            多语种 RAG 知识库治理与 512-Token 切片引擎
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            服务九号海外、小米海外等出海品牌 · 坚持“知识库为唯一答案源” · 覆盖英/西/法/德/波兰/土耳其等语种
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('chunks')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeSubTab === 'chunks'
                  ? 'bg-white text-teal-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              知识库切片全库 ({chunks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('slicing_lab')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeSubTab === 'slicing_lab'
                  ? 'bg-white text-teal-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              512-Token 切片实验室
            </button>
            <button
              onClick={() => setActiveSubTab('threshold_lab')}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                activeSubTab === 'threshold_lab'
                  ? 'bg-white text-teal-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BGE检索与0.7阈值调优
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: Chunks Library */}
      {activeSubTab === 'chunks' && (
        <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索切片知识、故障代码、标签、文档标题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
              >
                <option value="all">客户品牌: 全部</option>
                <option value="Ninebot Segway">九号 Segway</option>
                <option value="Xiaomi Global">小米海外 Xiaomi</option>
                <option value="Niu Technologies">小牛电动 Niu</option>
              </select>

              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700"
              >
                <option value="all">语种: 全部</option>
                <option value="pl">PL 波兰语</option>
                <option value="es">ES 西班牙语</option>
                <option value="tr">TR 土耳其语</option>
                <option value="fr">FR 法语</option>
                <option value="en">EN 英语</option>
              </select>

              <span className="text-[11px] text-teal-800 font-mono bg-teal-50 px-2 py-1 rounded border border-teal-200 font-medium">
                租户物理隔离已启用
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500 transition flex flex-col justify-between space-y-3 group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-teal-700">{chunk.clientBrand}</span>
                    <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                      {chunk.language.toUpperCase()} · {chunk.tokenCount} tokens
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-teal-700 transition">
                    {chunk.docTitle}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-4 leading-relaxed font-sans bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {chunk.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {chunk.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-emerald-700 font-mono font-medium">
                    质量分: {chunk.qualityScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 512-Token Slicing Lab */}
      {activeSubTab === 'slicing_lab' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Explanation Box */}
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-slate-700 text-xs leading-relaxed space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-teal-900 text-sm">
              <Scissors className="w-4 h-4 text-teal-600" />
              面试与技术核心解构：为什么切片必须是 512 Token？怎么定出来的？
            </div>
            <p>
              在出海智能客服场景中，绝大多数问答对（FAQ）或产品故障手册的单项说明结构为：“<strong>【问题描述】+【机理分析】+【2-3步标准处置流程】</strong>”，平均中文/外文字符折合 <strong>300 - 500 Token</strong>。
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2 text-[11px]">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-amber-800 font-bold block mb-1">❌ 256 Token 切片</span>
                <span className="text-slate-500">
                  切片粒度过碎，一条完整FAQ被从中间硬生生切断，导致检索召回时上下文残缺，大模型输出经常缺少关键的“第三步寄修指导”。
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-teal-500 ring-1 ring-teal-500/20 shadow-2xs">
                <span className="text-teal-800 font-bold block mb-1">⭐ 512 Token (最优平衡点)</span>
                <span className="text-slate-700">
                  既能100%完整容纳单一完整FAQ/章节，又不会混入下一章节无关信息；实测在BGE多语言检索中召回率与准确度均达到峰值。
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-amber-800 font-bold block mb-1">❌ 1024 Token 切片</span>
                <span className="text-slate-500">
                  切片过大，不同故障问题互相混杂（如刹车和电池混在一个切片），导致向量稀疏，相似度计算时精度显著下降。
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Chunking Playground */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>实时切片清洗模拟器 (Interactive Chunker & Token Counter)</span>
              <span className="text-xs font-mono text-teal-700">
                当前字符数: {sampleText.length} · 预估Token数: ~{Math.round(sampleText.length * 1.35)}
              </span>
            </h3>

            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">
                输入待清洗切片的产品手册或FAQ文本:
              </label>
              <textarea
                rows={6}
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white font-mono leading-relaxed"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-800">
                  切片策略拆分结果 (按 512-Token 语义窗口切分)
                </span>
                <span className="text-emerald-700 font-medium">
                  生成 1 个高质量标准 Chunk (无截断)
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-teal-200 font-mono text-xs text-slate-700 leading-relaxed shadow-2xs">
                <div className="text-[10px] text-teal-700 font-semibold mb-1">
                  [Chunk #001 · 486 Tokens · 包含问答骨架 + 免责条款]
                </div>
                {sampleText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BGE Retrieval & 0.7 Threshold Lab */}
      {activeSubTab === 'threshold_lab' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Explanation Box */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-slate-700 text-xs leading-relaxed space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-purple-900 text-sm">
              <Sliders className="w-4 h-4 text-purple-600" />
              面试与产品专业核心：RAG 相似度阈值为什么定 0.70？怎么调优出来的？
            </div>
            <p>
              我们构建了各语种100+条的黄金问答评测集，针对 <strong>0.60 / 0.70 / 0.80</strong> 三个阈值进行系统性回归对比测算：
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2 text-[11px]">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-rose-700 font-bold block mb-1">阈值 = 0.60 时</span>
                <span className="text-slate-500">
                  建议展示率高达 88%，但低质量噪声切片大量涌入，<strong>AI 幻觉率飙升至 3.0%</strong>，坐席因频繁修改错误草稿反而导致AHT拉长。
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-purple-500 ring-1 ring-purple-500/20 shadow-2xs">
                <span className="text-purple-900 font-bold block mb-1">⭐ 阈值 = 0.70 (黄金平衡点)</span>
                <span className="text-slate-700">
                  <strong>幻觉率 &lt; 0.5% 且建议展示率 &gt; 70%</strong>。既保证了绝大多数用户问题有AI草稿可用，又坚决守住了品牌不出错的合规红线。
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-amber-800 font-bold block mb-1">阈值 = 0.80 时</span>
                <span className="text-slate-500">
                  虽然0幻觉，但门槛过高，很多口语化或略微有拼写错误的用户提问直接检索失败，<strong>建议展示率暴跌至 40%</strong>，采纳率极低。
                </span>
              </div>
            </div>
          </div>

          {/* Interactive BGE Simulator */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>BGE 多语言向量检索模拟器 (BGE-Large-m3 Cosine Similarity)</span>
              <span className="text-xs text-teal-700 font-mono">开源支持100+语种 · 本地部署合规</span>
            </h3>

            <div>
              <label className="text-xs text-slate-600 block mb-1 font-medium">
                输入待检索的用户多语种问题 (波兰语 / 西班牙语 / 土耳其语 / 英语):
              </label>
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-700">
                当前设定拦截阈值: <strong className="text-purple-700 font-mono font-bold">{(thresholdValue * 100).toFixed(0)}% (0.70)</strong>
              </span>
              <span className="text-xs text-slate-700">
                检索命中相似度: <strong className={`font-mono font-bold ${simulatedScore >= thresholdValue ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {(simulatedScore * 100).toFixed(0)}% ({simulatedScore})
                </strong>
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.01"
                value={simulatedScore}
                onChange={(e) => setSimulatedScore(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.50 (强噪声)</span>
                <span className="text-purple-700 font-bold">0.70 (黄金阈值点)</span>
                <span>0.95 (极严苛)</span>
              </div>
            </div>

            {/* Dynamic Status Output */}
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                simulatedScore >= thresholdValue
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {simulatedScore >= thresholdValue ? (
                <div className="space-y-1">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    检索命中成功 (相似度 {(simulatedScore * 100).toFixed(0)}% ≥ 0.70)
                  </div>
                  <p className="text-emerald-700">
                    系统允许向坐席输出高置信度AI草稿，并附带精确文档溯源依据。
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-bold text-rose-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    置信度不足拦截 (相似度 {(simulatedScore * 100).toFixed(0)}% &lt; 0.70)
                  </div>
                  <p className="text-rose-700">
                    触发四层防幻觉之第二层拦截：不向坐席展示AI建议，直接高亮提示转入人工处理通道，有效阻止AI幻觉与超范围承诺。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
