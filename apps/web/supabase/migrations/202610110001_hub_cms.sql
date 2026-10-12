begin;

-- app_metadata is server-controlled. Assign role=admin using the dashboard/Admin API.
create table public.hub_content (
  id text primary key,
  kind text not null check (kind in ('project', 'blog')),
  published boolean not null default false,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payload_identity check (payload ? 'id' and payload->>'id' = id),
  constraint payload_title check (payload ? 'title' and jsonb_typeof(payload->'title') = 'string' and length(trim(payload->>'title')) > 0),
  constraint payload_object check (jsonb_typeof(payload) = 'object')
);
create table public.hub_settings (
  id integer primary key check (id = 1),
  available boolean not null default true
);
insert into public.hub_settings(id, available) values (1, true);

create function public.hub_touch_content() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
create trigger hub_content_updated before update on public.hub_content
for each row execute function public.hub_touch_content();

alter table public.hub_content enable row level security;
alter table public.hub_settings enable row level security;
grant select on public.hub_content, public.hub_settings to anon, authenticated;
grant insert, update, delete on public.hub_content to authenticated;
grant update on public.hub_settings to authenticated;
create policy "Read published hub content" on public.hub_content for select to anon, authenticated using (published);
create policy "Admins manage hub content" on public.hub_content for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');
create policy "Read availability" on public.hub_settings for select to anon, authenticated using (true);
create policy "Admins update availability" on public.hub_settings for update to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('hub-assets', 'hub-assets', true, 5242880, array['image/jpeg','image/png','image/webp','application/pdf']);
create policy "Admins upload hub assets" on storage.objects for insert to authenticated
with check (bucket_id = 'hub-assets' and (select auth.jwt()->'app_metadata'->>'role') = 'admin'
and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "Admins manage hub assets" on storage.objects for select to authenticated
using (bucket_id = 'hub-assets' and (select auth.jwt()->'app_metadata'->>'role') = 'admin');
create policy "Admins delete hub assets" on storage.objects for delete to authenticated
using (bucket_id = 'hub-assets' and (select auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Seed current bundled content once; later edits are managed through the CMS.
insert into public.hub_content(id,kind,published,payload) values ('proj_1','project',true,'{"id":"proj_1","title":"Core Switch Network Migration","description":"A major enterprise-grade network infrastructure upgrade involving the deployment and configuration of Cisco Catalyst 9500 core switches.","category":"Systems & CLI","status":"Completed","technologies":["Cisco Catalyst 9500","Enterprise Routing","Switching","VLAN Management"],"createdAt":"2026-01-15","readme":"# Core Switch Network Migration\n\n### Overview\nThis project involved a comprehensive migration of a legacy core network infrastructure to modern Cisco Catalyst 9500 hardware. The primary goal was to increase backplane bandwidth, ensure high availability, and secure routing protocols across the enterprise.\n\n### Technical Achievements\n- Configured StackWise Virtual for Catalyst 9500 to ensure seamless high-availability redundancy.\n- Migrated legacy Layer 2/Layer 3 topologies to a robust OSPF-driven routing architecture.\n- Implemented strict QoS policies and access control lists (ACLs) to secure inter-VLAN routing and optimize critical traffic.\n"}'::jsonb);
insert into public.hub_content(id,kind,published,payload) values ('proj_2','project',true,'{"id":"proj_2","title":"Silo - Personal Finance Manager","description":"A comprehensive personal finance and budgeting tool built with a focus on a sleek, modern UI and smooth user experience.","category":"Full-Stack","status":"Completed","technologies":["Flutter","Dart","Python","REST API"],"githubUrl":"https://github.com/example/silo","createdAt":"2025-11-20","readme":"# Silo - Personal Finance & Budgeting\n\n### Overview\nSilo is a financial tracking tool designed to make budgeting effortless and visually appealing. It leverages a modern frontend to provide insightful graphs and categorized spending analytics.\n\n### Architecture\n- **Frontend**: Built with Flutter for smooth cross-platform mobile performance.\n- **Backend**: Python-based REST API handling authentication, transaction logic, and data aggregation.\n- **Design**: Implements a glassmorphic aesthetic with fluid micro-animations to enhance user engagement during data entry.\n"}'::jsonb);
insert into public.hub_content(id,kind,published,payload) values ('clave','project',true,'{"id":"clave","title":"CLAVE","description":"AI-powered Spanish-to-English language learning platform with real-time speech grading and adaptive learning.","category":"Full-Stack","status":"Completed","type":"live_app","technologies":["Flutter Web","Firebase","Web Speech API","Tailwind"],"liveUrl":"https://clave.kurlydeer.com","featured":true,"createdAt":"2026-03-05","readme":"# Clave Language Platform\n\n### Overview\nClave bridges the gap between structured grammar lessons and conversational practice for Spanish speakers learning English. \n\n### Key Features\n- **Spaced Repetition System (SRS)**: Algorithmically schedules vocabulary reviews to maximize long-term retention.\n- **Interactive Exercises**: Drag-and-drop sentence building and real-time pronunciation feedback.\n- **Progress Tracking**: Detailed dashboards showing fluency metrics and daily learning streaks.\n"}'::jsonb);
insert into public.hub_content(id,kind,published,payload) values ('cybergrid','project',true,'{"id":"cybergrid","title":"CyberGrid","description":"Automated network security & infrastructure telemetry framework for hybrid server nodes.","category":"Systems & CLI","status":"Completed","type":"github_project","technologies":["TypeScript","Security","Docker","Node.js","CLI"],"githubUrl":"https://github.com/KurlyDeer/cybergrid","featured":true,"createdAt":"2026-08-09","readme":"# CyberGrid 🛡️🌐\n> Automated Network Security, Grid Monitoring & Infrastructure Defense Framework\n\nCyberGrid is a high-performance, modular security monitoring and automated grid infrastructure telemetry platform designed to monitor network nodes, secure multi-cloud/homelab environments, detect anomalies, and streamline system administration workflows.\n\n---\n\n## 📦 Features\n\n- **Real-Time Node Telemetry:** Live heartbeat, bandwidth, and resource tracking across hybrid server nodes.\n- **Automated Security Audit Engine:** Continuous scanning for open ports, unexpected service bindings, and configuration drift.\n- **Modular Integration Grid:** Custom hooks for firewall rules (FortiGate/iptables), DNS filters, and container logs.\n- **High-Contrast Terminal Dashboard:** Sleek, low-latency web and CLI dashboard inspired by enterprise grid operations.\n- **Alerting & Webhooks:** Instant notifications via Discord, Slack, Telegram, or custom webhooks upon security threshold breaches.\n"}'::jsonb);
insert into public.hub_content(id,kind,published,payload) values ('blog_1','blog',true,'{"id":"blog_1","title":"About Me: System Administrator & IT Professional","summary":"An overview of my professional journey specializing in virtualization, enterprise networking, and full-stack development.","category":"Profile","tags":["System Administration","IT Infrastructure","Proxmox","Cisco"],"publishedAt":"2026-06-15","readTime":"5 min read","difficulty":"Introductory","author":"KurlyDeer","content":"# About Me\n\nHello! I am an IT Professional and System Administrator with a deep passion for building resilient infrastructure and scalable software. My expertise spans both the physical hardware layer and the application stack.\n\n## Professional Focus\nMy daily work involves orchestrating complex environments, ensuring high availability, and automating redundant tasks. \n\n### Key Areas of Expertise:\n- **Virtualization & Hypervisors**: Extensive experience configuring and managing Proxmox clusters for optimal resource allocation and disaster recovery.\n- **Enterprise Networking**: Designing and maintaining secure, high-throughput networks utilizing Cisco and Fortinet routing and switching technologies.\n- **Full-Stack & Mobile Development**: Bridging the gap between infrastructure and software by building custom applications. I primarily use Python for backend services and Dart/Flutter for sleek, cross-platform mobile experiences.\n\nI thrive in environments where I can optimize system performance, secure network perimeters, and deliver polished software solutions.\n"}'::jsonb);
insert into public.hub_content(id,kind,published,payload) values ('blog_2','blog',true,'{"id":"blog_2","title":"My Core Technical Skills & Toolstack","summary":"A detailed breakdown of the networking gear, hypervisors, storage solutions, and programming languages I use daily.","category":"Skills","tags":["Networking","Storage","Development","TrueNAS"],"publishedAt":"2026-06-14","readTime":"4 min read","difficulty":"Intermediate","author":"KurlyDeer","content":"# Core Skills List\n\nOver the years, I''ve curated a robust toolstack that allows me to tackle infrastructure challenges from the ground up, all the way to the frontend application layer.\n\n## 1. Enterprise Networking\n- **Cisco & Fortinet**: Extensive experience deploying, configuring, and troubleshooting enterprise-grade switches and firewalls. From Catalyst 9500 core switch migrations to setting up secure Fortinet VPN tunnels and IDS/IPS policies.\n\n## 2. Virtualization & Hypervisors\n- **Proxmox VE**: My go-to hypervisor for deploying high-availability clusters, managing LXC containers, and orchestrating virtual machines with custom SDN configurations.\n\n## 3. Storage Solutions\n- **TrueNAS**: Architecting scalable, ZFS-backed storage pools. Ensuring data integrity, snapshot replication, and high-speed SMB/NFS sharing for enterprise workloads.\n\n## 4. Programming Languages & Frameworks\n- **Python**: Used heavily for infrastructure automation, scripting, and building robust backend API services.\n- **Dart & Flutter**: My primary choice for developing responsive, natively compiled mobile applications with beautiful user interfaces.\n- **TypeScript & React**: Used for building dynamic, single-page web applications and internal dashboard interfaces.\n"}'::jsonb);

commit;
