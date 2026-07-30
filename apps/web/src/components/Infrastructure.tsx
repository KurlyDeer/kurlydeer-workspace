import React from "react";
import { motion } from "motion/react";
import { Server, Shield, HardDrive, Network, Cpu, Activity, CheckCircle2, ArrowRight, Monitor, Wifi } from "lucide-react";
import SystemStatus from "@/components/SystemStatus";

const INFRA_NODES = [
  {
    label: "Proxmox VE",
    detail: "Hypervisor Cluster",
    icon: <Cpu className="h-4 w-4" />,
    status: "online",
    metric: "3 Nodes",
  },
  {
    label: "TrueNAS",
    detail: "Network Storage",
    icon: <HardDrive className="h-4 w-4" />,
    status: "online",
    metric: "48TB Pool",
  },
  {
    label: "Fortinet",
    detail: "Edge Firewall",
    icon: <Shield className="h-4 w-4" />,
    status: "online",
    metric: "FortiGate",
  },
  {
    label: "Cisco IOS-XE",
    detail: "Core Switching",
    icon: <Network className="h-4 w-4" />,
    status: "online",
    metric: "Cat 9500",
  },
];

const MIGRATION_STEPS = [
  "Audited existing Layer 2/3 topology and VLAN trunking architecture",
  "Provisioned Cisco Catalyst 9500 with IOS-XE 17.x golden image",
  "Migrated inter-VLAN routing, DHCP scoping, and ACL rule sets",
  "Implemented read-only SNMP monitoring and secure backup configs",
  "Validated failover paths and documented run-book for team handoff",
];

/* ------------------------------------------------------------------ */
/*  Network Topology Node                                             */
/* ------------------------------------------------------------------ */
const TOPOLOGY_NODES = [
  { label: "Core Switch", sublabel: "Catalyst 9500", icon: <Network className="h-4 w-4" /> },
  { label: "Distribution", sublabel: "Layer 3", icon: <Server className="h-4 w-4" /> },
  { label: "Access Switches", sublabel: "Layer 2", icon: <Wifi className="h-4 w-4" /> },
  { label: "Endpoints", sublabel: "Clients", icon: <Monitor className="h-4 w-4" /> },
];

function NetworkTopology() {
  return (
    <div className="w-full rounded-xl bg-zinc-800/30 border border-zinc-700/30 p-6 mb-8 overflow-x-auto">
      <div className="flex items-center gap-2 mb-5">
        <Network className="h-3.5 w-3.5 text-amber-400/70" />
        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
          Network Topology
        </span>
      </div>
      {/* Horizontal on lg, vertical on mobile */}
      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-0 lg:gap-0 justify-center">
        {TOPOLOGY_NODES.map((node, i) => (
          <React.Fragment key={node.label}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="h-12 w-28 bg-zinc-800 border border-zinc-700/50 rounded-lg flex items-center justify-center gap-2 hover:border-amber-500/30 transition-all duration-300">
                <span className="text-zinc-400">{node.icon}</span>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-zinc-200 font-semibold leading-tight">
                    {node.label}
                  </span>
                  <span className="font-mono text-[8px] text-zinc-500 leading-tight">
                    {node.sublabel}
                  </span>
                </div>
              </div>
            </div>
            {i < TOPOLOGY_NODES.length - 1 && (
              <>
                {/* Horizontal connector (lg) */}
                <div className="hidden lg:flex items-center">
                  <div className="w-8 border-t border-dashed border-zinc-700" />
                  <ArrowRight className="h-3 w-3 text-zinc-600 -ml-1" />
                </div>
                {/* Vertical connector (mobile) */}
                <div className="flex lg:hidden flex-col items-center">
                  <div className="h-5 border-l border-dashed border-zinc-700" />
                  <ArrowRight className="h-3 w-3 text-zinc-600 rotate-90 -mt-1" />
                </div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resource Bar                                                      */
/* ------------------------------------------------------------------ */
function ResourceBar({ label, value, percentage }: { label: string; value: string; percentage: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">{label}</span>
        <span className="font-mono text-[10px] text-zinc-500">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function Infrastructure() {
  return (
    <section id="infrastructure" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
              <Server className="h-4 w-4 text-amber-400" />
            </div>
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              Infrastructure &amp; Homelab
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 tracking-tight">
            Enterprise Systems
          </h2>
          <p className="font-sans text-sm text-zinc-500 mt-3 max-w-xl">
            Production-grade networking and server infrastructure — from rack to routing table.
          </p>
        </motion.div>

        {/* Infrastructure Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {INFRA_NODES.map((node, i) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700/80 transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 bg-zinc-800 border border-zinc-700/50 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-amber-400 transition-colors">
                  {node.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[9px] text-emerald-400/70 uppercase">{node.status}</span>
                </div>
              </div>
              <h4 className="font-display font-semibold text-sm text-zinc-200">{node.label}</h4>
              <p className="font-mono text-[10px] text-zinc-500 mt-0.5">{node.detail}</p>
              <div className="mt-3 pt-3 border-t border-zinc-800/60">
                <span className="font-mono text-xs text-zinc-400">{node.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Migration Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 hover:border-amber-500/30 rounded-2xl p-8 relative overflow-hidden transition-all duration-500"
        >
          {/* Subtle glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/[0.04] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest">
                    Featured Achievement
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-zinc-100 tracking-tight">
                  Core Network Migration
                </h3>
                <p className="font-sans text-sm text-zinc-400 mt-2 max-w-lg leading-relaxed">
                  Successfully migrated workplace infrastructure to Cisco Catalyst 9500 hardware,
                  implementing secure backup configurations with read-only monitoring access for
                  team environments.
                </p>
              </div>
              <div className="shrink-0 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
                <div>
                  <span className="font-display font-bold text-sm text-amber-400">Completed</span>
                  <p className="font-mono text-[10px] text-zinc-500">Zero Downtime</p>
                </div>
              </div>
            </div>

            {/* Network Topology Diagram */}
            <NetworkTopology />

            {/* Migration Timeline */}
            <div className="space-y-0">
              {MIGRATION_STEPS.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 bg-zinc-800 border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-500 shrink-0">
                      <span className="font-mono text-[9px] font-bold">{i + 1}</span>
                    </div>
                    {i < MIGRATION_STEPS.length - 1 && (
                      <div className="w-px h-6 bg-zinc-800/80" />
                    )}
                  </div>
                  <p className="font-sans text-sm text-zinc-400 pt-0.5 pb-3">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/*  Homelab Environment                                             */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
              <Server className="h-4 w-4 text-amber-400" />
            </div>
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              Homelab Environment
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Proxmox VE Cluster Card */}
            <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/80 transition-all">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-zinc-100">Proxmox VE</h4>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Hypervisor Cluster</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 uppercase tracking-wider font-semibold">
                  3 Nodes
                </span>
              </div>

              {/* Resource Bars */}
              <div className="space-y-4 mb-5">
                <ResourceBar label="CPU Allocation" value="65% Allocated" percentage={65} />
                <ResourceBar label="RAM Allocation" value="72% Allocated" percentage={72} />
              </div>

              {/* Workload Counters */}
              <div className="pt-4 border-t border-zinc-800/60 flex items-center gap-3">
                <span className="font-mono text-[10px] text-zinc-300 bg-zinc-800 border border-zinc-700/50 rounded-lg px-3 py-1.5 font-semibold">
                  12 VMs
                </span>
                <span className="font-mono text-[10px] text-zinc-300 bg-zinc-800 border border-zinc-700/50 rounded-lg px-3 py-1.5 font-semibold">
                  8 LXC Containers
                </span>
              </div>
            </div>

            {/* TrueNAS Storage Card */}
            <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700/80 transition-all">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center">
                    <HardDrive className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-zinc-100">TrueNAS</h4>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">ZFS Storage Pool</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-2.5 py-1 uppercase tracking-wider font-semibold">
                  48 TB
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="mb-5">
                <ResourceBar label="Pool Capacity" value="28.8 TB Used" percentage={60} />
              </div>

              {/* Health Info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[10px] text-zinc-400">Snapshots: 47 Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span className="font-mono text-[10px] text-zinc-400">Scrub: Healthy</span>
                </div>
              </div>

              {/* Protocol Badges */}
              <div className="pt-4 border-t border-zinc-800/60 flex items-center gap-2">
                {["SMB", "NFS", "iSCSI"].map((proto) => (
                  <span
                    key={proto}
                    className="font-mono text-[9px] uppercase bg-zinc-800 border border-zinc-700/50 px-2 py-0.5 rounded text-zinc-400 tracking-wider"
                  >
                    {proto}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Status Widget */}
        <div className="mt-12 flex justify-center">
          <SystemStatus />
        </div>
      </div>
    </section>
  );
}
