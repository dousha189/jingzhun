import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Clock,
  Shield,
  User,
  ArrowRight,
  ExternalLink,
  Info,
  CornerDownLeft,
  FileCheck,
  Languages,
  Zap,
  Tag,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShoppingBag,
  Calendar,
  AlertCircle,
  ClipboardCheck,
  UserCheck
} from 'lucide-react';
import { Ticket, TicketMessage, CustomerInfo } from '../../types';

interface ChatConversationProps {
  ticket: Ticket;
  onSendMessage: (text: string, isAiAssisted: boolean) => void;
  onAdvanceSopStep: () => void;
  onUpdateCustomerInfo?: (ticketId: string, info: CustomerInfo, autoReply?: { original: string; translated: string }) => void;
  externalDraftToInsert?: string;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  ticket,
  onSendMessage,
  onAdvanceSopStep,
  onUpdateCustomerInfo,
  externalDraftToInsert
}) => {
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'direct' | 'english_translate'>('direct');
  const [englishInput, setEnglishInput] = useState('');
  const [showAssetDetails, setShowAssetDetails] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Interactive Customer Info Form state synced with ticket
  const customerInfo = ticket.customerInfo || {
    name: ticket.messages[0]?.senderName?.split(' (')[0] || '',
    phone: '+48 501 234 567',
    email: ticket.userIdentifier || '',
    snCode: 'N4GDC2104C1289',
    isComplete: true,
    ticketCreated: true,
    warrantyStatus: '欧洲24个月官方质保有效'
  };

  const [formName, setFormName] = useState(customerInfo.name || '');
  const [formPhone, setFormPhone] = useState(customerInfo.phone || '');
  const [formEmail, setFormEmail] = useState(customerInfo.email || '');
  const [formSn, setFormSn] = useState(customerInfo.snCode || '');

  React.useEffect(() => {
    const info = ticket.customerInfo || {
      name: ticket.messages[0]?.senderName?.split(' (')[0] || '',
      phone: '+48 501 234 567',
      email: ticket.userIdentifier || '',
      snCode: 'N4GDC2104C1289',
      isComplete: true,
      ticketCreated: true,
      warrantyStatus: '欧洲24个月官方质保有效'
    };
    setFormName(info.name || '');
    setFormPhone(info.phone || '');
    setFormEmail(info.email || '');
    setFormSn(info.snCode || '');
  }, [ticket.id, ticket.customerInfo]);

  // When external draft changes, populate into input text
  React.useEffect(() => {
    if (externalDraftToInsert) {
      setInputText(externalDraftToInsert);
      setInputMode('direct');
    }
  }, [externalDraftToInsert]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1800);
  };

  const handleSend = () => {
    const textToSend = inputMode === 'english_translate' ? inputText || englishInput : inputText;
    if (!textToSend.trim()) return;

    const isAi = !!(
      (ticket.currentAiDraft && textToSend.includes(ticket.currentAiDraft.originalDraftTargetLang.slice(0, 30))) ||
      inputMode === 'english_translate'
    );

    onSendMessage(textToSend.trim(), isAi);
    setInputText('');
    setEnglishInput('');
  };

  // Keyboard shortcut: Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const missingFields: string[] = [];
  if (!formName.trim()) missingFields.push('姓名');
  if (!formPhone.trim()) missingFields.push('手机号');
  if (!formEmail.trim()) missingFields.push('邮箱');
  if (!formSn.trim()) missingFields.push('SN码');

  const isInfoComplete = missingFields.length === 0;

  // Trigger asking for missing info or creating ticket & replying with ticket ID + model + warranty
  const handleProcessInfoCollection = () => {
    if (!isInfoComplete) {
      // Missing info -> Ask customer to provide SN, phone, email, name
      if (ticket.language === 'pl') {
        setInputText(
          'Dzień dobry! Proszę o podanie numeru seryjnego (SN) hulajnogi, numeru telefonu, adresu e-mail oraz imienia i nazwiska, abym mógł utworzyć dla Pana zgłoszenie serwisowe ułatwiające dalsze śledzenie sprawy.'
        );
      } else if (ticket.language === 'es') {
        setInputText(
          'Hola, por favor proporciónenos el código SN de su vehículo eléctrico, su número de teléfono, correo electrónico y nombre para que pueda crear un ticket de servicio para su posterior seguimiento.'
        );
      } else if (ticket.language === 'fr') {
        setInputText(
          'Bonjour, veuillez nous fournir le code SN de votre appareil, votre numéro de téléphone, votre adresse e-mail et votre nom afin que je puisse créer un ticket de suivi pour vous.'
        );
      } else {
        setInputText(
          'Hello, please provide your electric scooter SN code, phone number, email address, and full name so that I can create a service ticket for your follow-up tracking.'
        );
      }
      setInputMode('direct');
      return;
    }

    // All 4 fields collected -> Create Ticket, return ticket number & model/warranty status, and ask what problem occurred
    let replyOriginal = '';
    const modelShort = ticket.productModel.split(' (')[0];
    const replyTranslated = `Great, we have created service ticket #${ticket.id} for you. Your scooter is the ${modelShort} model and is currently under warranty. What specific issue are you experiencing?`;

    if (ticket.language === 'pl') {
      replyOriginal = `Dobrze, utworzyliśmy dla Pana zgłoszenie serwisowe nr ${ticket.id}. Pana pojazd to model ${modelShort} i nadal znajduje się w okresie gwarancyjnym. Proszę powiedzieć, jaki problem wystąpił?`;
    } else if (ticket.language === 'es') {
      replyOriginal = `De acuerdo, hemos creado su orden de servicio Nº ${ticket.id}. Su patinete eléctrico es el modelo ${modelShort} y actualmente se encuentra dentro del periodo de garantía. ¿Podría indicarnos qué problema ha encontrado?`;
    } else if (ticket.language === 'fr') {
      replyOriginal = `D'accord, nous avons créé votre ticket de service n° ${ticket.id}. Votre appareil est le modèle ${modelShort} et est toujours sous garantie. Quel problème rencontrez-vous ?`;
    } else {
      replyOriginal = `Okay, we have created service ticket #${ticket.id} for you. Your electric scooter is the ${modelShort} model and is currently under warranty. What problem are you experiencing?`;
    }

    if (onUpdateCustomerInfo) {
      onUpdateCustomerInfo(
        ticket.id,
        {
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim(),
          snCode: formSn.trim(),
          isComplete: true,
          ticketCreated: true,
          warrantyStatus: '欧洲24个月官方质保有效'
        },
        {
          original: replyOriginal,
          translated: replyTranslated
        }
      );
    }
  };

  // Quick Macro phrases for frontline agents
  const applyMacro = (macroType: 'collect_info' | 'confirm_ticket' | 'invoice' | 'logistics' | 'safety') => {
    if (macroType === 'collect_info') {
      if (ticket.language === 'pl') {
        setInputText(
          'Dzień dobry! Proszę o podanie numeru seryjnego (SN) hulajnogi, numeru telefonu, adresu e-mail oraz imienia i nazwiska, abym mógł utworzyć dla Pana zgłoszenie serwisowe ułatwiające dalsze śledzenie sprawy.'
        );
      } else if (ticket.language === 'es') {
        setInputText(
          'Hola, por favor proporciónenos el código SN de su patinete eléctrico, su número de teléfono, correo electrónico y nombre para que pueda crear un ticket de servicio para su posterior seguimiento.'
        );
      } else {
        setInputText(
          'Hello, please provide your scooter SN code, phone number, email, and name so I can create a service ticket for follow-up tracking.'
        );
      }
    } else if (macroType === 'confirm_ticket') {
      const modelShort = ticket.productModel.split(' (')[0];
      if (ticket.language === 'pl') {
        setInputText(
          `Dobrze, utworzyliśmy zgłoszenie nr ${ticket.id}. Pana hulajnoga to model ${modelShort} i nadal znajduje się w okresie gwarancji. Proszę powiedzieć, jaki problem wystąpił?`
        );
      } else if (ticket.language === 'es') {
        setInputText(
          `De acuerdo, hemos creado el ticket ${ticket.id}. Su patinete es el modelo ${modelShort} y está dentro del período de garantía. ¿Qué problema ha tenido?`
        );
      } else {
        setInputText(
          `Okay, your ticket #${ticket.id} has been created. Your scooter is the ${modelShort} model and is still under warranty. What issue are you experiencing?`
        );
      }
    } else if (macroType === 'invoice') {
      if (ticket.language === 'pl') {
        setInputText(
          'Uprzejmie prosimy o przesłanie czytelnego zdjęcia dowodu zakupu (paragon fiskalny lub faktura VAT z MediaMarkt), aby zweryfikować 24-miesięczną gwarancję europejską.'
        );
      } else if (ticket.language === 'es') {
        setInputText(
          'Por favor, facilítenos una copia clara de su factura de compra oficial (mi.com o distribuidor autorizado) para validar su periodo de garantía europea.'
        );
      } else {
        setInputText(
          'Please provide a clear copy or photo of your purchase invoice/receipt to validate your 24-month European warranty coverage.'
        );
      }
    } else if (macroType === 'logistics') {
      if (ticket.language === 'pl') {
        setInputText(
          'Prosimy o podanie pełnego adresu odbioru dla kuriera DPD w Polsce (ulica, kod pocztowy, miasto oraz numer telefonu kontaktowego).'
        );
      } else {
        setInputText(
          'Please provide your full pick-up address for the courier service (street, postal code, city, and mobile phone number).'
        );
      }
    } else if (macroType === 'safety') {
      if (ticket.language === 'tr') {
        setInputText(
          'Yasal hız limitini (25 km/s) aşmaya yönelik yazılım modifikasyonları uluslararası garantinizi geçersiz kılar ve sürüş güvenliğini tehlikeye atar.'
        );
      } else {
        setInputText(
          'Modifying speed limits or flashing unofficial firmware will strictly void the manufacturer warranty under European safety regulations.'
        );
      }
    }
    setInputMode('direct');
  };

  // Simulated auto-translation when agent types in English
  const handleEnglishInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const en = e.target.value;
    setEnglishInput(en);
    if (!en.trim()) {
      setInputText('');
      return;
    }

    // Smart simulated translation to target customer language
    if (ticket.language === 'pl') {
      setInputText(
        `Dzień dobry, w odniesieniu do Pańskiego zgłoszenia: ${en} (Przetłumaczono przez Precision AI)`
      );
    } else if (ticket.language === 'es') {
      setInputText(
        `Estimado cliente, con respecto a su consulta: ${en} (Traducido por Precision AI)`
      );
    } else if (ticket.language === 'tr') {
      setInputText(
        `Merhaba, talebinizle ilgili olarak: ${en} (Precision AI ile çevrildi)`
      );
    } else {
      setInputText(
        `Dear customer, regarding your request: ${en} (Translated by Precision AI)`
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 text-slate-800 overflow-hidden">
      {/* Customer Profile & Device Asset Bar (Frontline Agent View) */}
      <div className="p-3 bg-white border-b border-slate-200 flex flex-col gap-2 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {ticket.id}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {ticket.title}
              </span>
              <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 font-mono">
                主工单: {ticket.mainTicketId} (跨渠道聚合)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
              <span>客户: <strong className="text-slate-800">{ticket.userIdentifier}</strong></span>
              <span>品牌: <strong className="text-slate-800">{ticket.clientBrand}</strong></span>
              <span>机型: <strong className="text-teal-700">{ticket.productModel}</strong></span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                欧洲24个月官方质保有效
              </span>
            </div>
          </div>

          {/* SLA Countdown & Asset Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAssetDetails(!showAssetDetails)}
              className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1 transition cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>{showAssetDetails ? '收起SN码与信息收集面板' : '展开SN码与信息收集'}</span>
              {showAssetDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <div className="text-right pl-2 border-l border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">SLA响应倒计时</span>
              <span className="font-mono text-xs font-bold text-amber-600 flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" />
                {ticket.slaMinutesRemaining} 分钟
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible SN Code & Customer Info Collection Panel */}
        {showAssetDetails && (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-[11px] animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  1. SN码与信息收集 (建单前置四要素)
                </span>
                {isInfoComplete ? (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                    ✅ 四要素已收齐 · 已生成工单号 {ticket.id}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                    ⚠️ 信息不全 (缺失: {missingFields.join('、')}) · 需先追问补齐后再建单排障
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {!isInfoComplete ? (
                  <button
                    onClick={handleProcessInfoCollection}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-semibold transition cursor-pointer shadow-2xs"
                  >
                    一键填入追问话术 (索要缺失信息)
                  </button>
                ) : (
                  <button
                    onClick={handleProcessInfoCollection}
                    className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-semibold transition cursor-pointer shadow-2xs"
                  >
                    收齐创建工单并返工单号 ({ticket.id}) 与在保机型
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <label className="text-slate-500 block text-[10px] mb-0.5">客户姓名 (Name):</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="待收集客户姓名..."
                  className={`w-full px-2 py-1 rounded border text-[11px] font-medium focus:outline-none ${
                    formName.trim()
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-amber-50/60 border-amber-300 text-amber-900 placeholder-amber-400'
                  }`}
                />
              </div>
              <div>
                <label className="text-slate-500 block text-[10px] mb-0.5">手机号码 (Phone):</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="待收集手机号..."
                  className={`w-full px-2 py-1 rounded border text-[11px] font-mono focus:outline-none ${
                    formPhone.trim()
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-amber-50/60 border-amber-300 text-amber-900 placeholder-amber-400'
                  }`}
                />
              </div>
              <div>
                <label className="text-slate-500 block text-[10px] mb-0.5">电子邮箱 (Email):</label>
                <input
                  type="text"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="待收集邮箱..."
                  className={`w-full px-2 py-1 rounded border text-[11px] font-mono focus:outline-none ${
                    formEmail.trim()
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-amber-50/60 border-amber-300 text-amber-900 placeholder-amber-400'
                  }`}
                />
              </div>
              <div>
                <label className="text-slate-500 block text-[10px] mb-0.5">电车SN码 (Serial Number):</label>
                <input
                  type="text"
                  value={formSn}
                  onChange={(e) => setFormSn(e.target.value)}
                  placeholder="待收集车辆SN码..."
                  className={`w-full px-2 py-1 rounded border text-[11px] font-mono font-bold focus:outline-none ${
                    formSn.trim()
                      ? 'bg-white border-slate-200 text-teal-800'
                      : 'bg-amber-50/60 border-amber-300 text-amber-900 placeholder-amber-400'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SOP Action Progress Ribbon */}
      <div className="px-3.5 py-2 bg-white border-b border-slate-200 flex items-center justify-between gap-2 text-xs shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1">
          <span className="text-slate-600 text-[11px] font-bold shrink-0 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-teal-600" />
            SOP 规范节点:
          </span>
          <div className="flex items-center gap-2 flex-1">
            {ticket.sopSteps.map((step, idx) => {
              const isCurrent = idx === ticket.currentSopIndex;
              const isDone = step.isCompleted;
              return (
                <div
                  key={step.stepNumber}
                  className={`px-2.5 py-1 rounded border text-[11px] shrink-0 flex items-center gap-1.5 transition ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : isCurrent
                      ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-500/30 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span>{step.stepNumber}. {step.title}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onAdvanceSopStep}
          className="text-[11px] text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded border border-teal-200 shrink-0 flex items-center gap-1 transition shadow-2xs cursor-pointer font-medium"
        >
          推进SOP至下一步 <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/60">
        {ticket.messages.map((msg) => {
          const isAgent = msg.sender === 'agent';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'} group`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{msg.senderName}</span>
                <span className="font-mono text-slate-400">{msg.timestamp}</span>
                {msg.isAiAssisted && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-mono font-medium"
                    title="发送给客户的回复若含AI生成内容，内部系统标记但客户无感知，便于质检追踪"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-teal-600" />
                    [AI-Copilot 采纳]
                  </span>
                )}
                <button
                  onClick={() => handleCopyMessage(msg.id, msg.originalText)}
                  title="复制此条消息文本"
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition cursor-pointer ml-1"
                >
                  {copiedMsgId === msg.id ? (
                    <span className="text-[10px] text-emerald-600 font-bold">已复制!</span>
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <div
                className={`max-w-2xl rounded-xl p-3.5 text-xs leading-relaxed shadow-xs ${
                  isAgent
                    ? 'bg-teal-700 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-wrap font-sans">{msg.originalText}</div>

                {/* Machine Translation Bar for Customer foreign speech */}
                {msg.translatedText && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 bg-slate-50 -mx-2 -mb-2 p-2.5 rounded-b-lg border border-slate-100/80">
                    <div className="flex items-center justify-between text-[10px] text-teal-700 font-semibold mb-1">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        <span>多语种互译引擎 (客户母语 ➔ 英文):</span>
                      </div>
                      <button
                        onClick={() => handleCopyMessage(`${msg.id}-en`, msg.translatedText || '')}
                        className="text-slate-400 hover:text-teal-700 text-[10px] font-normal cursor-pointer"
                      >
                        {copiedMsgId === `${msg.id}-en` ? '已复制英文' : '复制英文'}
                      </button>
                    </div>
                    <div className="text-slate-800 text-xs font-sans leading-relaxed">
                      {msg.translatedText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Frontline Agent Reply Composer Box */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-2">
        {/* Macro Buttons & Input Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          {/* Quick Macros */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-medium">快捷常用宏:</span>
            <button
              onClick={() => applyMacro('collect_info')}
              className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-medium transition cursor-pointer"
            >
              1.追问SN码与信息收集
            </button>
            <button
              onClick={() => applyMacro('confirm_ticket')}
              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition cursor-pointer"
            >
              2.建单返号与询问故障
            </button>
            <button
              onClick={() => applyMacro('invoice')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              索取发票凭证
            </button>
            <button
              onClick={() => applyMacro('logistics')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              DPD本地取件指引
            </button>
            <button
              onClick={() => applyMacro('safety')}
              className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
            >
              防破解免责声明
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px]">
            <button
              onClick={() => setInputMode('direct')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                inputMode === 'direct' ? 'bg-white text-teal-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              直接编辑外语
            </button>
            <button
              onClick={() => setInputMode('english_translate')}
              className={`px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer ${
                inputMode === 'english_translate' ? 'bg-white text-teal-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Languages className="w-3 h-3 text-teal-600" />
              英文输入转外语
            </button>
          </div>
        </div>

        {/* Dynamic Composer based on Input Mode */}
        {inputMode === 'english_translate' ? (
          <div className="space-y-2">
            <div>
              <textarea
                rows={2}
                value={englishInput}
                onChange={handleEnglishInputChange}
                onKeyDown={handleKeyDown}
                placeholder="在此直接输入英文回复内容，按 Enter 快速发送，系统将自动调用多语言引擎转为客户母语..."
                className="w-full bg-slate-50 border border-teal-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white resize-none font-sans"
              />
            </div>

            {inputText && (
              <div className="p-2.5 bg-teal-50/50 rounded-lg border border-teal-200 text-xs">
                <span className="text-[10px] text-teal-800 font-bold block mb-1">
                  自动外语预览 (即将以客户母语 {ticket.language.toUpperCase()} 发送):
                </span>
                <p className="text-slate-800 font-sans whitespace-pre-wrap">{inputText}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="在此输入外文回复，按 Enter 键发送，或在右侧Copilot面板点击【一键采纳】直接填入..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white resize-none font-sans leading-relaxed"
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-500 flex items-center gap-3">
            <span>目标语种: <strong className="text-slate-800 uppercase">{ticket.language}</strong></span>
            <span className="text-slate-400 text-[10px]">按 Enter 发送 · Shift+Enter 换行</span>
          </div>

          <button
            onClick={handleSend}
            disabled={!(inputText.trim() || englishInput.trim())}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            发送回复给客户
          </button>
        </div>
      </div>
    </div>
  );
};

