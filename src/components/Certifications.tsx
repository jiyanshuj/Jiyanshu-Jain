import { useState, useRef, useEffect } from 'react';
import { ExternalLink, GraduationCap, Search, Check, Copy, Eye, FileText, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderCard, type FolderItem } from './BorderGlow';

type Credential = {
  title: string;
  issuer: string;
  date: string;
  note: string;
  credential?: string;
  url?: string;
  image?: string;
  pdf?: string;
  featured?: boolean;
};

const credentials: Credential[] = [
  {
    title: 'Microsoft Certified: Azure AI Fundamentals',
    issuer: 'Microsoft',
    date: 'May 2024',
    note: 'Azure machine learning workloads, computer vision, natural language processing, and generative AI services.',
    credential: 'F46BFAA4E1353162',
    url: 'https://learn.microsoft.com/api/credentials/share/en-gb/JiyanshuJain-7891/F46BFAA4E1353162?sharingId=38F71508E7DBF0EB',
    image: '/Certifications/Microsoft/AI-900.png',
    pdf: '/Certifications/Microsoft/AI-900.pdf',
    featured: true,
  },
  {
    title: 'Microsoft Certified: Fabric Data Engineer Associate',
    issuer: 'Microsoft',
    date: '2026',
    note: 'Data ingestion, lakehouse architecture, data transformation, semantic models and analytics engineering on Microsoft Fabric.',
    credential: '11F82A2A328A26A4',
    url: 'https://learn.microsoft.com/api/credentials/share/en-gb/JiyanshuJain-7891/11F82A2A328A26A4?sharingId=38F71508E7DBF0EB',
    image: '/Certifications/Microsoft/dp-700.png',
    pdf: '/Certifications/Microsoft/dp-700.pdf',
    featured: true,
  },
  {
    title: 'OCI 2025 Certified Data Science Professional',
    issuer: 'Oracle',
    date: 'Sep 2025',
    note: 'Oracle Certified Professional status in OCI Data Science and cloud ML pipelines.',
    credential: '102436787OCI25DSOCP',
    image: '/Certifications/Oracle/Data Science Professional.png',
    pdf: '/Certifications/Oracle/Data Science Professional.pdf',
    featured: true,
  },
  {
    title: 'The Joy of Computing using Python',
    issuer: 'NPTEL – IIT Madras',
    date: 'Jan–Apr 2024',
    note: 'Elite + Silver certification for 12-week intensive Python computing; 80% overall score.',
    image: '/Certifications/Python/The Joy of Computing using Python.png',
    pdf: '/Certifications/Python/The Joy of Computing using Python.pdf',
    featured: true,
  },
  {
    title: 'Campus Cloud Network – AI & ML System',
    issuer: 'Research Papers',
    date: 'Dec 2025',
    note: 'Presented at AVDHARAN 2025, SVVV, Indore.',
    image: '/Certifications/research paper/Campus Cloud Network.png',
    pdf: '/Certifications/research paper/Campus Cloud Network.pdf',
    featured: true,
  },
  {
    title: 'Birddex: Intelligent Bird Identification System',
    issuer: 'Research Papers',
    date: 'Dec 2025',
    note: 'Presented at AVDHARAN 2025, SVVV, Indore.',
    image: '/Certifications/research paper/Birddex An Intelligent MobileBasedBird Identification System.png',
    pdf: '/Certifications/research paper/Birddex An Intelligent MobileBasedBird Identification System.pdf',
    featured: true,
  },
  {
    title: 'Hack Wave Hackathon Finalist',
    issuer: 'Chameli Devi Group',
    date: 'Apr 2024',
    note: 'Final round finalist with the Sustainable Travel Planner project.',
    image: '/Certifications/Collage certifications/Hackathon.jpg',
    featured: true,
  },
  {
    title: 'Microsoft AI Skills Challenge',
    issuer: 'Microsoft',
    date: 'Jan 2024',
    note: 'Microsoft Learn program across AI and Azure fundamentals.',
    image: '/Certifications/Microsoft/Microsoft AI skill Challange.png',
    pdf: '/Certifications/Microsoft/Microsoft AI skill Challange.pdf',
  },
  {
    title: 'Asia AI Odyssey Challenge',
    issuer: 'Microsoft',
    date: 'May 2024',
    note: 'Microsoft Learn program focused on AI skills across the Asia region.',
    image: '/Certifications/Microsoft/AsiaAIOdysseyL1CertificateMAY4B (284).png',
    pdf: '/Certifications/Microsoft/AsiaAIOdysseyL1CertificateMAY4B (284).pdf',
  },
  {
    title: 'Build NLP Solution with Azure AI Language',
    issuer: 'Microsoft',
    date: 'Feb 2024',
    note: 'Applied Skills credential for building NLP solutions using Azure AI Language.',
    credential: 'B030CE9B0D93BE5C',
    image: '/Certifications/Microsoft/Build a natural language processing solution with Azure AI Language.png',
    pdf: '/Certifications/Microsoft/Build a natural language processing solution with Azure AI Language.pdf',
  },
  {
    title: 'Intelligent Document Processing with Azure AI',
    issuer: 'Microsoft',
    date: 'May 2024',
    note: 'Applied Skills credential for Azure AI Document Intelligence.',
    credential: '3B1A931735EB7AEE',
    image: '/Certifications/Microsoft/Create an intelligent document processing solution with Azure AI.png',
    pdf: '/Certifications/Microsoft/Create an intelligent document processing solution with Azure AI.pdf',
  },
  {
    title: 'Automated Processes with Power Automate',
    issuer: 'Microsoft',
    date: 'Feb 2025',
    note: 'Designing and managing automated workflows using Power Automate.',
    credential: '14D6FCBEB96D6D19',
    image: '/Certifications/Microsoft/Create and manage automated processes by using Power Automate.png',
    pdf: '/Certifications/Microsoft/Create and manage automated processes by using Power Automate.pdf',
  },
  {
    title: 'Azure AI Fundamentals Challenge',
    issuer: 'Microsoft',
    date: '2024',
    note: 'Microsoft Learn Student Ambassadors challenge.',
    image: '/Certifications/Microsoft/Jiyanshu Jain.png',
    pdf: '/Certifications/Microsoft/Jiyanshu Jain.pdf',
  },
  {
    title: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    date: '2024',
    note: 'Microsoft Learn Student Ambassadors program.',
    image: '/Certifications/Microsoft/Microsoft Azure Fundamentals.png',
    pdf: '/Certifications/Microsoft/Microsoft Azure Fundamentals.pdf',
  },
  {
    title: 'Data Analysis Using Python',
    issuer: 'IBM',
    date: 'Mar 2024',
    note: 'Data manipulation, visualisation and analytical techniques.',
    url: 'https://www.credly.com/go/p1syQ10o',
    image: '/Certifications/Oracle/Data_Analysis_Using_Python_Badge20240329-29-59zlk.png',
    pdf: '/Certifications/Oracle/Data_Analysis_Using_Python_Badge20240329-29-59zlk.pdf',
  },
  {
    title: 'Introduction to Data Science',
    issuer: 'IBM',
    date: '2024',
    note: 'Foundational data science, data methodologies and analytical workflows.',
    image: '/Certifications/IBM/Introduction to Data Science.png',
    pdf: '/Certifications/IBM/Introduction to Data Science.pdf',
  },
  {
    title: 'Introduction to Data Science',
    issuer: 'Infosys Springboard',
    date: 'Aug 2024',
    note: 'Core data-science concepts, statistics and Python data analysis.',
    image: '/Certifications/Infosys/Introduction to Data Science.png',
    pdf: '/Certifications/Infosys/Introduction to Data Science.pdf',
  },
  {
    title: 'Introduction to Natural Language Processing',
    issuer: 'Infosys Springboard',
    date: 'Aug 2024',
    note: 'Text processing, language models, tokenization and NLP fundamentals.',
    image: '/Certifications/Infosys/Introduction to Natural Language Processing.png',
    pdf: '/Certifications/Infosys/Introduction to Natural Language Processing.pdf',
  },
  {
    title: 'Problem Solving (Basic)',
    issuer: 'HackerRank',
    date: 'Jan 2024',
    note: 'Data structures and algorithms assessment.',
    credential: '870742A09E25',
    image: '/Certifications/Python/problem_solving_basic certificate.png',
    pdf: '/Certifications/Python/problem_solving_basic certificate.pdf',
  },
  {
    title: 'Python (Basic)',
    issuer: 'HackerRank',
    date: 'Oct 2023',
    note: 'HackerRank verified Python core proficiency.',
    credential: '9C4B2E84903D',
    image: '/Certifications/Python/python_basic certificate.png',
    pdf: '/Certifications/Python/python_basic certificate.pdf',
  },
  {
    title: 'Data Visualisation: Empowering Business',
    issuer: 'Tata / Forage',
    date: 'Sep 2023',
    note: 'Practical data-visualisation and executive communication tasks.',
    image: '/Certifications/Oracle/Data_Visualisation_Empowering_Business.png',
    pdf: '/Certifications/Oracle/Data_Visualisation_Empowering_Business.pdf',
  },
  {
    title: 'C & C++ OOPS',
    issuer: 'Universal Informatics',
    date: 'Mar–May 2023',
    note: 'Object-oriented programming and algorithmic implementation in C & C++.',
    image: '/Certifications/universal.jpg',
  },
  {
    title: 'Technical Quiz Organizer',
    issuer: 'SVVV, Indore',
    date: 'Jun 2024',
    note: 'Organised a campus-wide technical computing challenge.',
    image: '/Certifications/Collage certifications/KAUSHAL.jpg',
  },
  {
    title: 'IGNITE 180 3.0 – Global Strategy Challenge',
    issuer: 'Unstop',
    date: '2024',
    note: 'Participated as team "the coder boyZ" at KMC, University of Delhi.',
    image: '/Certifications/Untop.jpg',
  },
];

/* Premier Credentials for direct plain-view display */
const premierCredentials = [
  {
    title: 'Microsoft Certified: Azure AI Fundamentals',
    issuer: 'Microsoft',
    date: 'May 2024',
    badge: 'Microsoft Certified',
    note: 'Azure machine learning workloads, computer vision, natural language processing, and generative AI services.',
    credential: 'F46BFAA4E1353162',
    url: 'https://learn.microsoft.com/api/credentials/share/en-gb/JiyanshuJain-7891/F46BFAA4E1353162?sharingId=38F71508E7DBF0EB',
    image: '/Certifications/Microsoft/AI-900.png',
    pdf: '/Certifications/Microsoft/AI-900.pdf',
  },
  {
    title: 'Microsoft Certified: Fabric Data Engineer Associate',
    issuer: 'Microsoft',
    date: '2026',
    badge: 'Microsoft Certified',
    note: 'Enterprise data ingestion, lakehouse architecture, transformation, and semantic modeling on Microsoft Fabric.',
    credential: '11F82A2A328A26A4',
    url: 'https://learn.microsoft.com/api/credentials/share/en-gb/JiyanshuJain-7891/11F82A2A328A26A4?sharingId=38F71508E7DBF0EB',
    image: '/Certifications/Microsoft/dp-700.png',
    pdf: '/Certifications/Microsoft/dp-700.pdf',
  },
  {
    title: 'OCI 2025 Certified Data Science Professional',
    issuer: 'Oracle',
    date: 'Sep 2025',
    badge: 'Oracle Certified',
    note: 'Oracle Certified Professional status in OCI Data Science and cloud ML pipelines.',
    credential: '102436787OCI25DSOCP',
    image: '/Certifications/Oracle/Data Science Professional.png',
    pdf: '/Certifications/Oracle/Data Science Professional.pdf',
  },
  {
    title: 'The Joy of Computing using Python',
    issuer: 'NPTEL – IIT Madras',
    date: 'Jan–Apr 2024',
    badge: 'NPTEL Elite + Silver',
    note: '12-week Python computing course; Elite + Silver result with 80% overall score.',
    image: '/Certifications/Python/The Joy of Computing using Python.png',
    pdf: '/Certifications/Python/The Joy of Computing using Python.pdf',
  },
];

/* Glass folders (@kedhareswer/glass-folder-cards): all items feed with authentic certificate images */
const folderVaults = [
  {
    categoryTitle: 'Cloud & Microsoft Vault',
    artPreset: 'aurora' as const,
    items: [
      {
        id: 'ai900',
        title: 'Azure AI Fundamentals (AI-900)',
        subtitle: 'Microsoft Certified: Azure AI',
        date: 'May 2024',
        credentialId: 'F46BFAA4E1353162',
        image: '/Certifications/Microsoft/AI-900.png',
        url: 'https://learn.microsoft.com/api/credentials/share/en-gb/JiyanshuJain-7891/F46BFAA4E1353162?sharingId=38F71508E7DBF0EB',
        pdf: '/Certifications/Microsoft/AI-900.pdf',
      },
      {
        id: 'dp700',
        title: 'Fabric Data Engineer Associate',
        subtitle: 'Microsoft Certified: DP-700',
        date: '2026',
        credentialId: '11F82A2A328A26A4',
        image: '/Certifications/Microsoft/dp-700.png',
        url: 'https://learn.microsoft.com/api/credentials/share/en-gb/JiyanshuJain-7891/11F82A2A328A26A4?sharingId=38F71508E7DBF0EB',
        pdf: '/Certifications/Microsoft/dp-700.pdf',
      },
      {
        id: 'nlp',
        title: 'Build NLP with Azure AI Language',
        subtitle: 'Microsoft Applied Skills',
        date: 'Feb 2024',
        credentialId: 'B030CE9B0D93BE5C',
        image: '/Certifications/Microsoft/Build a natural language processing solution with Azure AI Language.png',
        pdf: '/Certifications/Microsoft/Build a natural language processing solution with Azure AI Language.pdf',
      },
      {
        id: 'doc-intel',
        title: 'Azure AI Document Processing',
        subtitle: 'Microsoft Applied Skills',
        date: 'May 2024',
        credentialId: '3B1A931735EB7AEE',
        image: '/Certifications/Microsoft/Create an intelligent document processing solution with Azure AI.png',
        pdf: '/Certifications/Microsoft/Create an intelligent document processing solution with Azure AI.pdf',
      },
    ] as FolderItem[],
  },
  {
    categoryTitle: 'Oracle & Data Science Dossier',
    artPreset: 'ember' as const,
    items: [
      {
        id: 'oci25',
        title: 'OCI Data Science Professional',
        subtitle: 'Oracle Certified Professional (OCP)',
        date: 'Sep 2025',
        credentialId: '102436787OCI25DSOCP',
        image: '/Certifications/Oracle/Data Science Professional.png',
        pdf: '/Certifications/Oracle/Data Science Professional.pdf',
      },
      {
        id: 'ibm',
        title: 'Data Analysis Using Python',
        subtitle: 'IBM Credly Verified Credential',
        date: 'Mar 2024',
        url: 'https://www.credly.com/go/p1syQ10o',
        image: '/Certifications/Oracle/Data_Analysis_Using_Python_Badge20240329-29-59zlk.png',
        pdf: '/Certifications/Oracle/Data_Analysis_Using_Python_Badge20240329-29-59zlk.pdf',
      },
      {
        id: 'infosys',
        title: 'Natural Language Processing',
        subtitle: 'Infosys Springboard AI Workflow',
        date: 'Aug 2024',
        image: '/Certifications/Infosys/Introduction to Natural Language Processing.png',
        pdf: '/Certifications/Infosys/Introduction to Natural Language Processing.pdf',
      },
      {
        id: 'ibm-ds',
        title: 'Introduction to Data Science',
        subtitle: 'IBM Verified Credential',
        date: '2024',
        image: '/Certifications/IBM/Introduction to Data Science.png',
        pdf: '/Certifications/IBM/Introduction to Data Science.pdf',
      },
    ] as FolderItem[],
  },
  {
    categoryTitle: 'Elite Academic Computing',
    artPreset: 'dusk' as const,
    items: [
      {
        id: 'iit',
        title: 'The Joy of Computing using Python',
        subtitle: 'NPTEL – IIT Madras (Elite + Silver, 80%)',
        date: 'Jan–Apr 2024',
        image: '/Certifications/Python/The Joy of Computing using Python.png',
        pdf: '/Certifications/Python/The Joy of Computing using Python.pdf',
      },
      {
        id: 'hr1',
        title: 'Problem Solving (Algorithms & DSA)',
        subtitle: 'HackerRank Certified Assessment',
        date: 'Jan 2024',
        credentialId: '870742A09E25',
        image: '/Certifications/Python/problem_solving_basic certificate.png',
        pdf: '/Certifications/Python/problem_solving_basic certificate.pdf',
      },
      {
        id: 'hr2',
        title: 'Python Core Assessment',
        subtitle: 'HackerRank Verified Proficiency',
        date: 'Oct 2023',
        credentialId: '9C4B2E84903D',
        image: '/Certifications/Python/python_basic certificate.png',
        pdf: '/Certifications/Python/python_basic certificate.pdf',
      },
    ] as FolderItem[],
  },
  {
    categoryTitle: 'Published Research & Hackathons',
    artPreset: 'verdant' as const,
    items: [
      {
        id: 'paper1',
        title: 'Campus Cloud Network Paper',
        subtitle: 'AVDHARAN 2025 Research Presentation',
        date: 'Dec 2025',
        image: '/Certifications/research paper/Campus Cloud Network.png',
        pdf: '/Certifications/research paper/Campus Cloud Network.pdf',
      },
      {
        id: 'paper2',
        title: 'Birddex: Mobile Bird ID System',
        subtitle: 'AVDHARAN 2025 Research Presentation',
        date: 'Dec 2025',
        image: '/Certifications/research paper/Birddex An Intelligent MobileBasedBird Identification System.png',
        pdf: '/Certifications/research paper/Birddex An Intelligent MobileBasedBird Identification System.pdf',
      },
      {
        id: 'hack',
        title: 'Hack Wave Hackathon Finalist',
        subtitle: 'Chameli Devi Group of Institutions',
        date: 'Apr 2024',
        image: '/Certifications/Collage certifications/Hackathon.jpg',
      },
      {
        id: 'unstop',
        title: 'IGNITE 180 3.0 Global Strategy',
        subtitle: 'Unstop / KMC Delhi University',
        date: '2024',
        image: '/Certifications/Untop.jpg',
      },
    ] as FolderItem[],
  },
];

const credentialGroups = ['All', 'Featured', 'Certifications', 'Research & achievements', 'Challenges & learning'] as const;
type CredentialGroup = typeof credentialGroups[number];

function groupForCredential(credential: Credential): Exclude<CredentialGroup, 'All' | 'Featured'> {
  if (credential.issuer === 'Research Papers' || credential.issuer === 'SVVV, Indore' || credential.title.includes('Hack Wave')) return 'Research & achievements';
  if (credential.title.includes('Challenge') || credential.issuer === 'Unstop' || credential.issuer === 'Tata / Forage') return 'Challenges & learning';
  return 'Certifications';
}

export default function Certifications() {
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const [group, setGroup] = useState<CredentialGroup>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<Credential | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const count = (item: CredentialGroup) => {
    if (item === 'All') return credentials.length;
    if (item === 'Featured') return credentials.filter((c) => c.featured).length;
    return credentials.filter((c) => groupForCredential(c) === item).length;
  };

  const filtered = credentials.filter((c) => {
    const matchesGroup =
      group === 'All'
        ? true
        : group === 'Featured'
        ? c.featured
        : groupForCredential(c) === group;

    const matchesSearch =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.credential && c.credential.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesGroup && matchesSearch;
  });

  return (
    <section id="certifications" className="section relative overflow-hidden" aria-labelledby="certifications-heading">
      <div className="page-width">
        {/* Section Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-[var(--line)] pb-8">
          <div>
            <span className="section-label">
              Credentials
            </span>
            <h2 id="certifications-heading" className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
              Education &amp; Credentials
            </h2>
            <p className="mt-1.5 mono text-xs sm:text-sm font-semibold text-[var(--accent-text)]">
              Verified certifications, academic credentials, and published research
            </p>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[var(--muted)]">
            Professional cloud certifications from Microsoft and Oracle, paired with verified university computing coursework and published research.
          </p>
        </div>

        {/* ── PLAIN VIEW 1: Education & CGPA Card ── */}
        <div className="mt-8 rounded-2xl border-2 border-[var(--line-strong)] bg-[var(--panel)] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg)] p-3.5 text-[var(--text)] shrink-0">
                <GraduationCap size={28} className="text-[var(--accent-text)]" />
              </div>
              <div>
                <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)]">
                  Primary Education
                </span>
                <h3 className="mt-1 text-xl sm:text-2xl font-black text-[var(--text)]">
                  Bachelor of Technology in Computer Science &amp; Engineering
                </h3>
                <p className="mono text-xs font-semibold text-[var(--muted-strong)] mt-1">
                  Specialisation in Artificial Intelligence &amp; Machine Learning
                </p>
              </div>
            </div>

            {/* CGPA Display Pill */}
            <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
              <div className="rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-2.5 text-center shadow-md">
                <span className="mono text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] block">
                  Cumulative GPA
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-[var(--text)]">7.91</span>
                  <span className="mono text-xs font-semibold text-[var(--muted)]">/ 10.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-sm text-[var(--text)]">
              Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore
            </span>
            <span className="mono text-xs font-semibold text-[var(--muted)]">
              Session: 2022 — 2026 (Graduation Year: 2026)
            </span>
          </div>
        </div>

        {/* ── PLAIN VIEW 2: Top 4 Premier Credentials Grid (Specially Showcasing Images like AI-900) ── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--text)]">
                Featured Industry Credentials
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Click any certificate image to view high-resolution verification document
              </p>
            </div>
            <span className="mono text-xs text-[var(--accent-text)] font-semibold">
              4 Premier Badges
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {premierCredentials.map((cred) => (
              <div
                key={cred.title}
                className="group flex flex-col justify-between rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] overflow-hidden shadow-sm transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg"
              >
                <div>
                  {/* Certificate Image Frame */}
                  <div
                    onClick={() => setSelectedCert(cred)}
                    className="relative aspect-[16/11] w-full overflow-hidden bg-[var(--bg)] cursor-pointer border-b border-[var(--line)]"
                    title={`Click to view full certificate: ${cred.title}`}
                  >
                    <img
                      src={cred.image}
                      alt={`${cred.title} certificate document`}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-bold backdrop-blur-[2px]">
                      <Eye size={15} /> View Certificate
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="mono rounded bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--accent-text)]">
                        {cred.badge}
                      </span>
                      <span className="mono text-[11px] text-[var(--muted)]">{cred.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[var(--text)] leading-snug group-hover:text-[var(--accent-text)] transition-colors">
                      {cred.title}
                    </h4>
                    <p className="mt-1 mono text-xs font-semibold text-[var(--muted)]">{cred.issuer}</p>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--muted-strong)] line-clamp-2">
                      {cred.note}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[var(--line)] flex flex-wrap items-center gap-2">
                    {cred.credential && (
                      <button
                        type="button"
                        onClick={() => handleCopy(cred.credential!)}
                        className="focus-ring mono inline-flex items-center gap-1.5 rounded border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors flex-1 justify-center"
                        title="Copy Credential ID"
                      >
                        {copiedId === cred.credential ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>ID: {cred.credential}</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedCert(cred)}
                      className="focus-ring mono inline-flex items-center gap-1 rounded bg-[var(--bg)] border border-[var(--line-strong)] px-2.5 py-1 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent-text)] transition-colors whitespace-nowrap"
                    >
                      <Eye size={12} /> Preview
                    </button>

                    {cred.url && (
                      <a
                        href={cred.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring mono inline-flex items-center gap-1 rounded bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-text)] hover:underline whitespace-nowrap"
                      >
                        Verify <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Credential Folders & Complete Register ── */}
        <div className="mt-14 border-t border-[var(--line)] pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--text)]">
                Credential Vaults &amp; Categories
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Hover over folders to fan out certificate documents, or explore the complete verifiable register below.
              </p>
            </div>
            <span className="mono text-xs text-[var(--muted)]">
              {credentials.length} Total Credentials
            </span>
          </div>

          {/* 4 Interactive 3D Glass Dossier Folders */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 justify-items-center py-6">
            {folderVaults.map((vault) => (
              <FolderCard
                key={vault.categoryTitle}
                categoryTitle={vault.categoryTitle}
                countLabel={`${vault.items.length} items`}
                items={vault.items}
                artPreset={vault.artPreset}
              />
            ))}
          </div>

          {/* ── Button to Look at All Certifications (Hidden by Default) ── */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllCertifications((v) => !v)}
              className="focus-ring mono inline-flex items-center gap-2.5 rounded-xl border-2 border-[var(--line-strong)] bg-[var(--panel)] px-6 py-3.5 text-xs sm:text-sm font-bold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent-text)] hover:shadow-lg transition-all duration-200"
            >
              {showAllCertifications ? (
                <>
                  <span>Hide Certifications Directory</span>
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  <GraduationCap size={18} className="text-[var(--accent-text)]" />
                  <span>View All Certifications &amp; Credentials ({credentials.length})</span>
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Filterable Credentials Register (Rendered Only When Toggled) ── */}
        <AnimatePresence>
          {showAllCertifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 border-t border-[var(--line)] pt-8 overflow-hidden"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-1.5" role="tablist">
                  {credentialGroups.map((item) => (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={group === item}
                      onClick={() => setGroup(item)}
                      className={`focus-ring mono rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                        group === item
                          ? 'border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-text)] font-bold'
                          : 'border border-[var(--line)] bg-[var(--panel)] text-[var(--muted-strong)] hover:border-[var(--text)]'
                      }`}
                    >
                      {item}
                      <span className="ml-1 text-xs opacity-70">({count(item)})</span>
                    </button>
                  ))}
                </div>

                <div className="relative sm:w-64">
                  <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search credential or issuer..."
                    className="focus-ring mono h-9 w-full rounded-lg border border-[var(--line-strong)] bg-[var(--panel)] pl-8 pr-3 text-xs placeholder:text-[var(--muted)]"
                  />
                </div>
              </div>

              {/* Credentials Register List */}
              <ul className="mt-4 divide-y divide-[var(--line)]">
                {filtered.map((c) => (
                  <li
                    key={`${c.issuer}-${c.title}`}
                    className="group grid gap-2 py-4 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center sm:gap-6 transition-colors hover:bg-[var(--panel)]/60 px-3 rounded-lg"
                  >
                    <p className="mono text-xs text-[var(--muted)]">{c.date}</p>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-[var(--muted)]">{c.issuer}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted-strong)] leading-relaxed">{c.note}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {c.image && (
                        <button
                          type="button"
                          onClick={() => setSelectedCert(c)}
                          className="focus-ring mono inline-flex items-center gap-1 rounded border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent-text)] transition-colors"
                          title="Preview Certificate"
                        >
                          <Eye size={12} />
                          <span>Preview</span>
                        </button>
                      )}
                      {c.pdf && (
                        <a
                          href={c.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring mono inline-flex items-center gap-1 rounded border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)] transition-colors"
                          title="Open Original PDF"
                        >
                          <FileText size={12} />
                          <span>PDF</span>
                        </a>
                      )}
                      {c.credential && (
                        <button
                          type="button"
                          onClick={() => handleCopy(c.credential!)}
                          className="focus-ring mono inline-flex items-center gap-1 rounded border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
                          title="Copy Credential ID"
                        >
                          {copiedId === c.credential ? <Check size={12} className="text-[var(--accent)]" /> : <Copy size={12} />}
                          <span>{copiedId === c.credential ? 'Copied' : `ID: ${c.credential}`}</span>
                        </button>
                      )}
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring mono inline-flex items-center gap-1 rounded bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--accent-text)] hover:underline"
                        >
                          Verify <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Certificate Lightbox Viewer Modal ── */}
      <AnimatePresence>
        {selectedCert && (
          <CertificateModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
            onCopy={handleCopy}
            copiedId={copiedId}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function CertificateModal({
  cert,
  onClose,
  onCopy,
  copiedId,
}: {
  cert: Credential;
  onClose: () => void;
  onCopy: (id: string) => void;
  copiedId: string | null;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-dialog-title"
      className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-md"
      onMouseDown={onClose}
    >
      <motion.article
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] p-5 sm:p-7 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="mono rounded bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-bold text-[var(--accent-text)]">
                {cert.issuer}
              </span>
              <span className="mono text-xs text-[var(--muted)]">{cert.date}</span>
            </div>
            <h3 id="certificate-dialog-title" className="mt-1.5 text-xl sm:text-2xl font-bold text-[var(--text)]">
              {cert.title}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted-strong)]">{cert.note}</p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--line-strong)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent-text)] transition-colors"
            aria-label="Close certificate preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate High-Resolution Image Frame */}
        {cert.image && (
          <div className="relative mt-5 overflow-hidden rounded-xl border border-[var(--line-strong)] bg-black/50 shadow-inner flex items-center justify-center p-2">
            <img
              src={cert.image}
              alt={`${cert.title} verified certificate`}
              className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain shadow-md"
            />
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {cert.credential && (
              <button
                type="button"
                onClick={() => onCopy(cert.credential!)}
                className="focus-ring mono inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--accent)] transition-colors"
              >
                {copiedId === cert.credential ? (
                  <>
                    <Check size={13} className="text-emerald-500" />
                    <span className="text-emerald-500 font-bold">Copied ID</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Credential ID: {cert.credential}</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {cert.pdf && (
              <a
                href={cert.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mono inline-flex items-center gap-1.5 rounded-lg border border-[var(--line-strong)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent-text)] transition-colors"
              >
                <FileText size={13} />
                <span>Open Original PDF ↗</span>
              </a>
            )}

            {cert.url && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mono inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 py-1.5 text-xs font-bold text-[var(--accent-ink)] shadow-sm hover:opacity-90 transition-opacity"
              >
                <span>Verify on Issuer Site ↗</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
