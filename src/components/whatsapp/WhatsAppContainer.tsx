import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  CheckCheck,
  Send,
  ShieldCheck,
  Truck,
  Lock,
  AlertTriangle,
  Smartphone,
  Phone,
  Video,
  MoreVertical,
  Bot,
  Factory
} from 'lucide-react';

export const WhatsAppContainer: React.FC = () => {
  const {
    whatsAppMessages,
    sendWhatsAppUserMessage,
    verifyCustomerOtp,
    selectedJobCard,
    jobCards,
    selectedOrder
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [customerOtpInput, setCustomerOtpInput] = useState('849201');
  const [otpVerifiedState, setOtpVerifiedState] = useState(selectedJobCard?.otpVerified || false);

  const currentJob = selectedJobCard || jobCards[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendWhatsAppUserMessage(currentJob.id, inputText);
    setInputText('');
  };

  const handleVerifyOtpInWhatsApp = () => {
    const success = verifyCustomerOtp(currentJob.id, customerOtpInput);
    if (success) {
      setOtpVerifiedState(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-slate-950 p-2 sm:p-6">
      {/* WhatsApp Smartphone Mockup */}
      <div className="w-full max-w-[440px] bg-slate-900 border-4 sm:border-8 border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col h-[780px] relative font-sans text-slate-100">
        
        {/* Phone Top Notch */}
        <div className="bg-emerald-950 px-6 py-2 flex items-center justify-between text-[11px] text-emerald-200 shrink-0">
          <span className="font-semibold text-white">09:42</span>
          <div className="w-16 h-3 bg-emerald-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-300">5G</span>
          </div>
        </div>

        {/* WhatsApp Business Header */}
        <div className="bg-emerald-800 px-4 py-3 flex items-center justify-between border-b border-emerald-700 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900 border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-300 text-sm relative">
              <Factory className="w-5 h-5 text-emerald-200" />
              <span className="w-3 h-3 bg-emerald-400 border-2 border-emerald-800 rounded-full absolute -bottom-0.5 -right-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-white text-sm">TVS TREAD Official</span>
                <ShieldCheck className="w-4 h-4 text-emerald-300 fill-emerald-300/20" />
              </div>
              <span className="text-[10px] text-emerald-200 block font-medium">
                Sundaram Industries • <strong className="text-white">INAIWAZHI Verified</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-emerald-100">
            <Video className="w-4 h-4" />
            <Phone className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* WhatsApp Chat Thread Background */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0b141a] bg-opacity-95 text-xs">
          
          {/* Encryption Badge */}
          <div className="bg-[#182229] border border-[#222d34] text-[#8696a0] p-2 rounded-lg text-[10px] text-center max-w-xs mx-auto shadow-sm">
            🔒 Messages & notifications are end-to-end encrypted. TVS TREAD chain-of-custody OTP and Complaint SMS confirmations are automated via Inaiwazhi.
          </div>

          {/* Active Job / Order Card */}
          <div className="bg-[#182229] border border-[#2a3942] rounded-xl p-2.5 text-slate-300 text-[11px] space-y-1">
            <div className="flex justify-between font-bold text-emerald-400">
              <span>Order: {selectedOrder?.orderNo || 'TVS-CHN-000124'}</span>
              <span className="text-slate-400">Job: {currentJob.id}</span>
            </div>
            <p className="text-slate-300">Customer: <strong className="text-white">{currentJob.customerName}</strong> ({currentJob.vehicleNo})</p>
          </div>

          {/* Render Messages */}
          {whatsAppMessages.map((msg) => {
            const isSystem = msg.sender === 'INAIWAZHI' || msg.sender === 'SYSTEM';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSystem ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-2xl space-y-1.5 shadow-md ${
                    isSystem
                      ? 'bg-[#202c33] text-[#e9edef] rounded-tl-xs border border-[#2a3942]'
                      : 'bg-[#005c4b] text-[#e9edef] rounded-tr-xs'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{msg.text}</pre>

                  {/* Interactive OTP Box if OTP type */}
                  {msg.type === 'OTP' && !msg.isVerified && !otpVerifiedState && (
                    <div className="mt-2 bg-[#111b21] p-2.5 rounded-xl border border-emerald-500/40 space-y-2">
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        Tap below to verify {currentJob.pickupQty || 20} tyres pickup
                      </span>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={customerOtpInput}
                          onChange={(e) => setCustomerOtpInput(e.target.value)}
                          className="w-24 bg-[#202c33] border border-[#2a3942] rounded-lg px-2 py-1 text-center font-mono font-bold text-white text-xs"
                        />
                        <button
                          onClick={handleVerifyOtpInWhatsApp}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded-lg text-[11px]"
                        >
                          VERIFY OTP & CONFIRM {currentJob.pickupQty || 20}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end items-center gap-1 text-[9px] text-[#8696a0]">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* WhatsApp Message Input Bar */}
        <form onSubmit={handleSendMessage} className="bg-[#202c33] p-2 flex items-center gap-2 border-t border-[#2a3942] shrink-0">
          <input
            type="text"
            placeholder="Type a message as customer (RAJA)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-[#2a3942] text-white rounded-full px-4 py-2 text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-[#00a884] text-slate-950 flex items-center justify-center font-bold shadow-md hover:bg-[#008f70]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
