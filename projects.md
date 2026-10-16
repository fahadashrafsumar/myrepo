# Projects

Content source for the Projects section of the profile site.

## Publishing rules (for Claude Code)

- Use only what's in this file. Don't add details, numbers or claims that aren't here.
- Never name the employer, its industry, its people or its vendors and service providers.
- Never add IP addresses, hostnames, internal domain names, server names, account names or file paths.
- Never mention open vulnerabilities, unresolved security gaps or specific weaknesses. Describe the work, not the environment's weak spots.
- Status values: **Done**, **Live**, **In progress**, **Planned**.

---

## Infrastructure & Disaster Recovery

### DR Site Migration to Colocation Data Center
**Status:** Done
Migrated the organization's disaster recovery site to a colocation data center, including infrastructure replication and DR planning, with minimal disruption to DR functions. The work was recognized by senior leadership.
**Tools:** VMware vSphere, Veeam Backup & Replication

### DR Drill Program
**Status:** In progress
Leading the next disaster recovery drill and building the full document set: a management-facing drill plan, an execution runbook, pre/during/post checklists, and a final report template.
**Tools:** Veeam, VMware vSphere

### Host Server Rollout
**Status:** Done
Led the deployment of new host servers across the primary and DR data centers.
**Tools:** HPE ProLiant, VMware ESXi

### Backup Storage Upgrade
**Status:** Done
Replaced backup storage with a higher-capacity unit and cut over the backup sync jobs so database backups kept flowing to secondary and DR copies with no data loss.
**Tools:** NAS, backup sync

### Branch VPN Migration
**Status:** Done
Migrated branch site-to-site VPNs to new connectivity providers, jointly with the network team.
**Tools:** Next-generation firewalls

### Centralized Firewall Management
**Status:** In progress
Bringing the branch firewall estate under central management so policies can be pushed consistently from one place.
**Tools:** Central firewall management platform

### Kubernetes Proof of Concept
**Status:** In progress
Built a single-node Kubernetes cluster as a learning and proof-of-concept platform for containerized workloads.
**Tools:** RKE2, Rocky Linux

---

## Security & Compliance

### Vulnerability Remediation Program
**Status:** Done
Led remediation of findings from internal vulnerability assessments across Windows, Linux and appliance hosts, prioritizing by severity. Focused on root-cause patching, where one fix often cleared many findings, and trained the support team to keep endpoint security healthy going forward.
**Tools:** Endpoint protection, WSUS, Windows Server, Linux

### Active Directory Least-Privilege Redesign
**Status:** Done
Redesigned admin delegation in Active Directory onto a tiered, least-privilege model and documented the final state for leadership and the team.
**Tools:** Active Directory, PowerShell

### Patch Management Coverage
**Status:** Done
Brought servers and workstations under centralized patch management.
**Tools:** WSUS, Group Policy

### Endpoint Security Handover
**Status:** Done
Handed day-to-day endpoint protection monitoring to the support team with role setup, a task guide, a live demo and daily report emails.
**Tools:** Endpoint protection platform

### SOC Log Collection
**Status:** Done
Deployed log collection to a managed security operations center and coordinated log onboarding with third-party providers.

### Infrastructure Improvement Register
**Status:** In progress
Created a register of infrastructure improvement items and have been driving them to closure.

### Regulatory Asset Inventory
**Status:** In progress
Building a classified inventory of infrastructure assets across primary and DR sites for regulatory submission.

---

## Automation

### Daily Backup Verification
**Status:** Live
Replaced a manual daily check with a script that confirms backups have landed on backup storage and emails a daily report automatically.
**Tools:** PowerShell

### Weekly Patch-Compliance Report
**Status:** Live
Automated a weekly export of workstation patch status, which the support team uses to resolve pending updates and update errors on their own.
**Tools:** PowerShell, WSUS

### Verify-Then-Purge Backup Scripts
**Status:** In progress
Replacing copy-only backup scripts with ones that delete old local backups only after confirming the copy exists on backup storage, then email the result.
**Tools:** PowerShell

### Internal Email Relay
**Status:** In progress
Set up a Linux mail relay so servers, network devices and scripts can send alert emails through Microsoft 365 without each one holding credentials.
**Tools:** Postfix, Linux, Microsoft 365

### Storage Retention Automation
**Status:** Done
Set up daily automated retention cleanup so shared folders maintain themselves instead of being cleared by hand.
**Tools:** NAS scheduling

---

## Applications & AI

### Private On-Prem AI Server
**Status:** Done
Deployed a private AI server so AI use stays inside the organization's perimeter for data privacy. Also experimented with RAG and built the case for a GPU and a phased AI roadmap.
**Tools:** Ollama, Open WebUI, Gemma, Docker, Ubuntu

### IT Operations Web App
**Status:** In progress (architecture done)
Designing an internal web app for the infrastructure team covering inventory, expiry tracking (licenses, SLAs, SSL certificates) and notifications. Built as a modular monolith on Docker Compose, with single sign-on, audit logging, and push-based data ingest so the app holds no infrastructure credentials.
**Tools:** Python, FastAPI, HTMX, PostgreSQL, Nginx, Docker Compose, Microsoft Entra ID, Microsoft Graph

### IT Request Forms App
**Status:** In progress (milestone 1 built)
Replacing paper forms for VM creation, VM deletion and network access requests with web forms. Includes directory-based login, an append-only audit log, and a health endpoint for monitoring.
**Tools:** Django, Caddy, PostgreSQL, Docker

### Source Control for Company Code
**Status:** Planned
Setting up Git-based source control for application code.
**Tools:** Git

---

## Process & Documentation

### IT KPI & KRI Framework
**Status:** In progress
Building the IT department's KPI and KRI framework across People, Process and Technology.

### IT Operational Level Agreement
**Status:** In progress
Drafting the IT department's OLA with business and support departments.

### Standardized SOP Set
**Status:** In progress
Writing, reviewing and standardizing infrastructure SOPs (backup and restore, VM deployment, GPO deployment, approved software, network and VPN administration, user account management), plus a support tier and escalation matrix.

### IT Infrastructure Roadmap
**Status:** In progress
Added infrastructure projects and timelines to the IT steering committee's project roadmap.

---

## People & Training

### New-Staff IT Onboarding
**Status:** Done
Built an IT onboarding deck and delivered the training to new staff across multiple batches, with positive feedback from the Training department.

### Team Knowledge Sessions
**Status:** Ongoing
Run knowledge-sharing sessions for the support team on infrastructure concepts beyond day-to-day fixes.

### Hiring
**Status:** Done
Took part in hiring system administrators: interviews, job posts, and reviewing job descriptions.

---

## Learning

- **AZ-900 (Azure Fundamentals):** In progress
- **AZ-104 (Azure Administrator):** In progress
- **Kubernetes certification:** In progress
- **CCNA:** Coursework completed
- **VCP-DCV:** Coursework completed
- **Docker:** Hands-on labs (single containers, Compose stacks, custom images)
