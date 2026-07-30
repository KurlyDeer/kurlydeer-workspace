import React from "react";
import { motion } from "motion/react";
import { Terminal, Calendar, User, Mail, ShieldAlert, Sparkles, Trash2, Cpu } from "lucide-react";
import { ContactMessage } from "../types";

interface MessagesSectionProps {
  messages: ContactMessage[];
  onDeleteMessage: (id: string) => void;
  onClearAllMessages: () => void;
}

export default function MessagesSection({ messages, onDeleteMessage, onClearAllMessages }: MessagesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Terminal className="h-4.5 w-4.5 text-indigo-400" />
          <div>
            <h3 className="font-display font-semibold text-xs tracking-wider text-zinc-200 uppercase">
              Inbox Mailbox Packet Indexes
            </h3>
            <p className="font-sans text-[11px] text-zinc-500">
              Showing active cached message telemetry
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            id="clear-all-messages-btn"
            onClick={onClearAllMessages}
            className="px-3.5 py-2 bg-zinc-950 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-zinc-850 hover:border-rose-500/20 rounded-xl font-mono text-[11px] transition flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Purge Local Mailbox</span>
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-4">
          <Terminal className="h-10 w-10 text-zinc-750 mx-auto animate-pulse" />
          <div>
            <p className="font-sans text-sm text-zinc-300 font-medium">No contact packets in queue</p>
            <p className="font-mono text-[10px] text-zinc-550 mt-1 max-w-md mx-auto leading-relaxed">
              Transmit a packet from the contact portal on the **HQ Overview** page, then navigate back to watch it populated with simulated security hashes.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, idx) => {
            // Generate some static thematic metrics based on the index
            const packetSize = msg.message.length + msg.name.length + 32;
            const pseudoHash = `0x${((idx + 1) * 7865).toString(16).toUpperCase()}FF${idx}A3`;
            const pseudoIp = `192.168.1.1${10 + idx}`;
            
            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900 border border-zinc-850 hover:border-zinc-700/80 rounded-2xl p-5 relative overflow-hidden group"
              >
                {/* Border Accent */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500/10 group-hover:bg-emerald-500/40 transition-colors"></div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Message details */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                        PACKET {idx + 1}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">Hash: {pseudoHash}</span>
                      <span className="text-zinc-700 font-sans">•</span>
                      <span className="font-mono text-[10px] text-zinc-500">Size: {packetSize} bytes</span>
                      <span className="text-zinc-700 font-sans">•</span>
                      <span className="font-mono text-[10px] text-zinc-500">IP: {pseudoIp}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display font-medium text-sm text-zinc-200">
                        {msg.subject || "No Subject Header Specified"}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1.5 font-sans">
                          <User className="h-3.5 w-3.5 text-zinc-500" />
                          <strong className="text-zinc-300 font-medium">{msg.name}</strong>
                        </span>
                        
                        <span className="flex items-center gap-1.5 font-sans truncate">
                          <Mail className="h-3.5 w-3.5 text-zinc-500" />
                          <a href={`mailto:${msg.email}`} className="text-zinc-400 hover:text-emerald-400 underline transition">
                            {msg.email}
                          </a>
                        </span>

                        <span className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {msg.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl mt-2">
                      <p className="font-sans text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex justify-between md:flex-col items-center md:items-end justify-center md:justify-start pt-3 md:pt-0 border-t md:border-t-0 border-zinc-850">
                    <span className="font-mono text-[10px] text-emerald-400/80 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Nominal Readout
                    </span>

                    <button
                      title="Decommission message packet"
                      onClick={() => onDeleteMessage(msg.id)}
                      className="mt-2 md:mt-4 p-2 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-xl border border-transparent hover:border-rose-500/25 transition flex items-center gap-1.5 font-mono text-[10px] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="md:hidden lg:inline">Decommission Rec</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {messages.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4 flex items-center gap-3">
          <div className="h-7 w-7 bg-indigo-500/10 rounded border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Cpu className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="font-mono text-[10px] text-zinc-500 leading-relaxed">
            SYSTEM-LOG: Current storage register limits are 100 contact arrays. All records are buffered standard AES-256 equivalent locally to guard privacy endpoints.
          </p>
        </div>
      )}
    </motion.div>
  );
}
