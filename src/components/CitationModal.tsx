import React from 'react';
import { X, BookOpen, ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';
import { KnowledgeCitation } from '../types';

interface CitationModalProps {
  citation: KnowledgeCitation | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                知识库原文切片溯源 (RAG Chunk Citation)
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                  相似度: {(citation.similarityScore * 100).toFixed(0)}%
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                所属客户: {citation.clientBrand} · 类别: {citation.docCategory}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">来源文档与章节:</span>
              <span className="font-semibold text-slate-900 text-sm">{citation.docTitle}</span>
              <span className="text-teal-700 block mt-0.5 font-medium">{citation.section}</span>
            </div>
            <span className="text-[10px] font-mono bg-white text-slate-600 px-2 py-1 rounded border border-slate-200 shadow-2xs">
              Chunk ID: {citation.chunkId}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-700 font-medium">高亮命中匹配依据 (Highlighted Match):</span>
              <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                已通过512Token标准化清洗
              </span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-medium">
              "{citation.highlightSnippet}"
            </div>
          </div>

          <div>
            <span className="text-slate-600 font-medium block mb-1.5">完整512-Token切片内容 (Full Raw Chunk):</span>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 whitespace-pre-wrap font-sans text-xs leading-6">
              {citation.chunkContent}
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg flex items-center gap-3 text-teal-900 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong>治理原则：</strong>本切片坚持“知识库为唯一答案源”约束。大模型不得根据未经核实的互联网通用常识凭空发散，若此切片不覆盖用户诉求，坐席需手动补充或转二线技术支持。
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            向量检索模型: BGE-Large-m3 (1024-dim, 多语言对齐)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition shadow-xs cursor-pointer"
          >
            完成核验并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
