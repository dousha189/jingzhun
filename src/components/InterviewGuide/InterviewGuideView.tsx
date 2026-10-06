import React, { useState } from 'react';
import {
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  Search,
  MessageSquare,
  ShieldCheck,
  Code
} from 'lucide-react';
import { INTERVIEW_20_QUESTIONS } from '../../data/initialData';

export const InterviewGuideView: React.FC = () => {
  const [copiedStar, setCopiedStar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const starText = `S（情境）： 2024年底的时候，大模型特别火，我们BPO行业压力也很大——客户每年压价5-10%，但人力成本一直在涨，小语种坐席特别难招，新人要培训4-6周才能上岗，单均处理时长8分钟下不来。公司也想尝试AI，但特别谨慎：一是不能用海外大模型，客户数据有合规风险；二不能让AI直接回复客户，万一出错了品牌方要追责；三是我们公司没有自研技术团队，投不起大模型研发。

T（任务）： 我的目标是做一个AI坐席助手，走Copilot路线——AI帮坐席写回复草稿，坐席审核后再发送，人审兜底。先在英文线小范围试点，验证效果后再逐步扩展到小语种。核心指标是AI采纳率50%以上、AHT降低20%以上，同时保证AI幻觉零事件、成本可控。

A（行动）： 我做了三件核心的事。
第一件是RAG知识库治理和评测体系。我没有一上来就接大模型API，而是先花了一个月梳理知识库——把小米海外、九号等客户的FAQ、产品手册、历史工单做清洗、切片、向量化。这里有个关键：我建了黄金问答评测集，每个语种100多条，覆盖正常问题、边界问题、合规问题，每次改Prompt或换模型都跑一遍评测，用数据说话而不是感觉。我坚持“知识库是唯一答案源”，检索相似度低于0.7就不展示AI建议，直接转人工，从源头控制幻觉。
第二件是Copilot的交互设计。我把AI面板嵌在工单详情的右侧，上面是AI回复草稿，每句话都标了引用来源，坐席点一下就能跳到知识库原文；中间是实时翻译，小语种坐席也能看懂客户在说什么；下面是三个按钮——一键采纳、编辑后发送、拒绝并反馈原因。坐席的每个操作都会回流数据，哪些建议被采纳、哪些被拒绝、拒绝原因是什么，我们用这些数据持续优化Prompt和知识库。这里有个细节：AI生成的内容在内部系统会标记，但客户看不到，不影响客户体验。
第三件是灰度发布和成本管控。我没有一上来全量推，而是分三期：先10个英文坐席试点做A/B测试，效果好了再扩到英文全量和西文法文，最后才上小语种。模型选型上我做了分层——英文西文用通义千问，小语种用DeepSeek，敏感客户用Ollama本地部署。我还建了成本监控看板，按客户、语种、坐席维度看Token消耗，单座席月均成本控制在120块钱左右，只占人力成本的3%。

R（结果）： 2025年5月正式上线，覆盖3个客户、5个语种、30多个坐席。AI建议采纳率52%，英文线能到60%。AHT从8分钟降到6.2分钟，降了23%。新人上岗周期从4-6周缩到2周，这个是培训主管最满意的。首次响应从3分钟降到1.8分钟。CSAT从82%升到85%，没有降。最重要的是AI幻觉和合规事件零起——这个是底线，我们人审兜底加低置信度转人工的策略是有效的。不足的地方是小语种采纳率只有45%，主要是小语种知识库质量还不够，后面需要持续优化。`;

  const handleCopyStar = () => {
    navigator.clipboard.writeText(starText);
    setCopiedStar(true);
    setTimeout(() => setCopiedStar(false), 2000);
  };

  const filteredQuestions = INTERVIEW_20_QUESTIONS.filter((item, idx) => {
    const matchCat = selectedCategory === 'all' || item.category.includes(selectedCategory);
    const matchSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col h-full overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            项目架构解构与面试答辩全书 (STAR逐字稿 · 高频20问通关卡)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            经HR总监与AI产品总监双视角审视 · 深度覆盖专业/架构/协作/HR离职四类高频深度追问
          </p>
        </div>

        <button
          onClick={handleCopyStar}
          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          {copiedStar ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedStar ? '已复制完整STAR逐字稿' : '一键复制STAR逐字稿'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* STAR Structured Section */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              STAR 结构化面试逐字稿 (约900字，地道口语化，面试开场直接用)
            </h3>
            <span className="text-xs text-slate-400">STAR完整闭环</span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed font-sans">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-teal-800 font-bold block mb-1">
                S（情境 Context）：
              </strong>
              <p className="text-slate-700">
                2024年底的时候，大模型特别火，我们BPO行业压力也很大——客户每年压价5-10%，但人力成本一直在涨，小语种坐席特别难招，新人要培训4-6周才能上岗，单均处理时长8分钟下不来。公司也想尝试AI，但特别谨慎：一是不能用海外大模型，客户数据有合规风险；二不能让AI直接回复客户，万一出错了品牌方要追责；三是我们公司没有自研技术团队，投不起大模型研发。
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-sky-800 font-bold block mb-1">
                T（任务 Task）：
              </strong>
              <p className="text-slate-700">
                我的目标是做一个AI坐席助手，走Copilot路线——AI帮坐席写回复草稿，坐席审核后再发送，人审兜底。先在英文线小范围试点，验证效果后再逐步扩展到小语种。核心指标是AI采纳率50%以上、AHT降低20%以上，同时保证AI幻觉零事件、成本可控。
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-amber-800 font-bold block mb-1">
                A（行动 Action）：
              </strong>
              <p className="text-slate-700">
                我做了三件核心的事：<br />
                <strong>第一件是RAG知识库治理和评测体系。</strong> 我没有一上来就接大模型API，而是先花了一个月梳理知识库——把小米海外、九号等客户的FAQ、产品手册、历史工单做清洗、切片（512token/片）、向量化（BGE多语言嵌入模型）。我建了黄金问答评测集，每个语种100多条（正常/边界/合规三类），每次改Prompt或换模型必跑离线评测。坚持“知识库是唯一答案源”，检索相似度低于0.7就不展示AI建议直接转人工，从源头控制幻觉。<br />
                <strong>第二件是Copilot的交互设计与人机协同。</strong> 把AI面板嵌在工单详情右侧，上面是AI回复草稿（每句话标引用来源可跳原文），中间是实时翻译，下面是三个按钮（一键采纳、编辑后发送、拒绝并反馈原因）。坐席操作数据实时回流优化Prompt和知识库。发送给客户的回复若含AI生成内容，内部系统标记但客户无感知。<br />
                <strong>第三件是灰度发布和成本管控。</strong> 分三期灰度：10个英文坐席试点做A/B测试 ➔ 英文全量+西/法 ➔ 小语种（波兰/土耳其/泰语）。模型按场景分层路由：英文西文用通义千问，小语种用DeepSeek，敏感客户用Ollama本地部署。建立成本监控看板，单座席月均成本控制在120元左右，只占人力成本的3%。
              </p>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200">
              <strong className="text-emerald-800 font-bold block mb-1">
                R（结果 Result）：
              </strong>
              <p className="text-slate-700">
                2025年5月正式上线，覆盖3个客户、5个语种、30多个坐席。<strong>AI建议采纳率52%</strong>（英文线到60%）；<strong>AHT从8分钟降到6.2分钟（降了23%）</strong>；<strong>新人上岗周期从4-6周缩到2周</strong>；首次响应从3分钟降到1.8分钟；CSAT从82%升到85%；<strong>AI幻觉和合规事件零起</strong>。不足的地方是小语种采纳率只有45%，主要是小语种知识库质量还不够，后面需要持续优化。
              </p>
            </div>
          </div>
        </div>

        {/* 20 Questions Section */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                高频 20 问分类通关卡 (全量覆盖面试官必问点)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                覆盖AI产品专业类(8题)、技术架构类(4题)、项目协作类(4题)、HR与职业类(4题)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="搜索问题或知识点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white w-48"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                {[
                  { id: 'all', label: '全部(20)' },
                  { id: 'AI产品专业类', label: 'AI产品(8)' },
                  { id: '技术与架构类', label: '技术架构(4)' },
                  { id: '项目协作类', label: '项目协作(4)' },
                  { id: 'HR与职业类', label: 'HR职业(4)' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2 py-1 rounded transition cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-white text-purple-800 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Accordion List */}
          <div className="space-y-2.5">
            {filteredQuestions.map((qItem, idx) => {
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={qItem.q}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                        {qItem.tag}
                      </span>
                      <span className="font-semibold text-slate-900">{qItem.q}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {qItem.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
