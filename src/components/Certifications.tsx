import { useState, useEffect, useRef } from "react";

type Cert = {
  id: number;
  org: string;
  color: string;
  title: string;
  description: string;
  date: string;
  credential?: string;
  url?: string;
};

type OrgGroup = {
  certs: Cert[];
  color: string;
};

const certData: Cert[] = [
  { id: 1, org: "Microsoft", color: "#00a4ef", title: "Azure AI Fundamentals (AI-900)", description: "Passed the AI-900 exam covering AI workloads, machine learning, computer vision, NLP, and generative AI on Azure.", date: "May 2024", credential: "F46BFAA4E1353162" },
  { id: 2, org: "Microsoft", color: "#00a4ef", title: "Microsoft AI Skills Challenge", description: "Completed the Microsoft AI Skills Challenge covering AI and Azure fundamentals, recognized by the President of Microsoft India & South Asia.", date: "Jan 2024" },
  { id: 3, org: "Microsoft", color: "#00a4ef", title: "Asia AI Odyssey Challenge", description: "Completed the Asia AI Odyssey Challenge, an intensive Microsoft Learn program focused on AI skills across the Asia region.", date: "May 2024" },
  { id: 4, org: "Microsoft", color: "#00a4ef", title: "Build a NLP Solution with Azure AI Language", description: "Applied Skills credential for building NLP solutions using Azure AI Language.", date: "Feb 2024", credential: "B030CE9B0D93BE5C" },
  { id: 5, org: "Microsoft", color: "#00a4ef", title: "Intelligent Document Processing with Azure AI", description: "Applied Skills credential for building document processing solutions with Azure AI Document Intelligence.", date: "May 2024", credential: "3B1A931735EB7AEE" },
  { id: 6, org: "Microsoft", color: "#00a4ef", title: "Automated Processes with Power Automate", description: "Applied Skills credential for designing and managing automated workflows using Microsoft Power Automate.", date: "Feb 2025", credential: "14D6FCBEB96D6D19" },
  { id: 7, org: "Microsoft", color: "#00a4ef", title: "Azure AI Fundamentals Challenge", description: "Completed the Azure AI Fundamentals Challenge hosted by Microsoft Learn Student Ambassadors.", date: "2024" },
  { id: 8, org: "Microsoft", color: "#00a4ef", title: "Microsoft Azure Fundamentals", description: "Completed the Microsoft Azure Fundamentals program via Microsoft Learn Student Ambassadors.", date: "2024" },
  { id: 9, org: "Oracle", color: "#f80000", title: "OCI 2025 Certified Data Science Professional", description: "Oracle Certified Professional status in OCI Data Science, recognized by Oracle Corporation.", date: "Sep 2025", credential: "102436787OCI25DSOCP" },
  { id: 10, org: "IBM", color: "#1f70c1", title: "Data Analysis Using Python", description: "IBM digital credential for data analysis using Python, covering data manipulation, visualization, and analytical techniques.", date: "Mar 2024", url: "https://www.credly.com/go/p1syQ10o" },
  { id: 11, org: "Infosys Springboard", color: "#007cc3", title: "Introduction to Data Science", description: "Completed Introduction to Data Science on Infosys Springboard, covering core data science concepts and workflows.", date: "Aug 2024" },
  { id: 12, org: "Infosys Springboard", color: "#007cc3", title: "Introduction to Natural Language Processing", description: "Completed Introduction to NLP on Infosys Springboard, covering text processing, language models, and NLP fundamentals.", date: "Aug 2024" },
  { id: 13, org: "NPTEL – IIT Madras", color: "#e63946", title: "The Joy of Computing using Python", description: "Elite certification for a 12-week Python computing course. Scored 80% overall (Assignments: 24.97/25, Exam: 55/75).", date: "Jan–Apr 2024" },
  { id: 14, org: "HackerRank", color: "#00ea64", title: "Python (Basic)", description: "Cleared the HackerRank Python (Basic) skill assessment. Certificate ID: 9C4B2E84903D.", date: "Oct 2023" },
  { id: 15, org: "HackerRank", color: "#00ea64", title: "Problem Solving (Basic)", description: "Cleared the HackerRank Problem Solving (Basic) assessment covering data structures and algorithms. ID: 870742A09E25.", date: "Jan 2024" },
  { id: 16, org: "Tata / Forage", color: "#0053a0", title: "Data Visualisation: Empowering Business with Effective Insights", description: "Practical tasks in framing business scenarios, choosing visuals, creating effective charts, and communicating insights.", date: "Sep 2023" },
  { id: 17, org: "Universal Informatics", color: "#f4a31a", title: "C & C++ OOPS", description: "Training program in C and C++ with Object-Oriented Programming at Universal Informatics, Vijay Nagar Campus, Indore.", date: "Mar–May 2023" },
  { id: 18, org: "SVVV, Indore", color: "#6c3fc5", title: "Research Paper – AVDHARAN 2025", description: "Presented 'Birddex: An Intelligent Mobile-Based Bird Identification System' at AVDHARAN 2025, 5th International Conference on Intelligent, Sustainable, Social and Secure Computing.", date: "Dec 2025" },
  { id: 19, org: "SVVV, Indore", color: "#6c3fc5", title: "Technical Quiz Organizer", description: "Led the organization of a campus-wide technical quiz, fostering knowledge-sharing and technical skill development.", date: "Jun 2024" },
  { id: 20, org: "Unstop", color: "#ff6b35", title: "IGNITE 180 3.0 – Global Strategy Challenge", description: "Participated as Team 'the coder boyZ' in the Global Strategy Challenge at IGNITE 180 3.0, KMC, University of Delhi.", date: "2024" },
  { id: 21, org: "Chameli Devi Group", color: "#10b981", title: "Hack Wave Hackathon Finalist", description: "Advanced to the final round with the Sustainable Travel Planner project, demonstrating innovation and sustainability-focused development.", date: "Apr 2024" },
];

const grouped = certData.reduce<Record<string, OrgGroup>>((acc, cert) => {
  if (!acc[cert.org]) acc[cert.org] = { certs: [], color: cert.color };
  acc[cert.org].certs.push(cert);
  return acc;
}, {});

const orgList = Object.entries(grouped).map(([org, data]) => ({ org, ...data }));

/* ── CertCard ───────────────────────────────────────────── */
function CertCard({ cert, index, visible, color }: { cert: Cert; index: number; visible: boolean; color: string }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
      transition: `opacity 0.55s ease ${index * 100}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 100}ms`,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderLeft: `3px solid ${color}`,
      borderRadius: "12px",
      padding: "20px 22px",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(8px)",
      textAlign: "left",
      boxShadow: "0 18px 42px -34px rgba(0,0,0,0.88), inset 0 1px 0 rgba(255,255,255,0.03)",
    }}>
      {/* top shimmer */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${color}55,transparent)` }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
        <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#f0f0f0", lineHeight: 1.4, flex: 1 }}>{cert.title}</h4>
        <span style={{ fontSize: "11px", fontWeight: 500, color, background: `${color}18`, border: `1px solid ${color}35`, borderRadius: "20px", padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0 }}>
          {cert.date}
        </span>
      </div>

      <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#9ca3af", lineHeight: 1.6 }}>{cert.description}</p>

      {cert.credential && <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#6b7280", fontFamily: "monospace" }}>ID: {cert.credential}</p>}
      {cert.url && (
        <a href={cert.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: "8px", fontSize: "12px", color, textDecoration: "none", fontWeight: 500 }}>
          Verify on Credly →
        </a>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function CertificateShowcase() {
  const [activeOrg, setActiveOrg] = useState<string | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  const activeData = activeOrg ? grouped[activeOrg] : null;

  const handleSelect = (org: string) => {
    if (activeOrg === org) {
      // close
      setCardsVisible(false);
      setTimeout(() => setActiveOrg(null), 400);
    } else {
      setCardsVisible(false);
      setActiveOrg(null);
      // small gap so cards reset before new ones appear
      setTimeout(() => {
        setActiveOrg(org);
        setTimeout(() => setCardsVisible(true), 60);
      }, activeOrg ? 350 : 0);
    }
  };

  // scroll expanded cards into view
  useEffect(() => {
    if (cardsVisible && cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [cardsVisible]);

  return (
    <section id="certifications" style={{ padding: "80px 20px", color: "#fff", position: "relative" }}>
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 55% at 50% -15%, rgba(0,164,239,0.16), transparent 70%)",
      }} />
      <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            display: "inline-block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#6b7280", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px",
          }}>
            Credentials & Achievements
          </div>
          <h1 className="cert-title" style={{
            fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,5vw,40px)",
            fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em",
            background: "linear-gradient(135deg,#fff 0%,#9ca3af 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Certifications
          </h1>
          <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "15px", maxWidth: "480px", margin: "14px auto 0" }}>
            Click any organization to expand its certificates.
          </p>

          {/* stats */}
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginTop: "36px", flexWrap: "wrap" }}>
            {[{ label: "Total Certs", value: certData.length }, { label: "Organizations", value: orgList.length }, { label: "Latest", value: "2025" }].map(s => (
              <div
                key={s.label}
                className="cert-card"
                style={{
                  textAlign: "center",
                  padding: "14px 24px",
                  borderRadius: "12px",
                  boxShadow: "0 16px 36px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ fontSize: "26px", fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Org Buttons Row ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: activeOrg ? "center" : "center",
          marginBottom: "32px",
          transition: "all 0.4s ease",
        }}>
          {orgList.map(({ org, color }) => {
            const isActive = activeOrg === org;
            return (
              <button
                key={org}
                onClick={() => handleSelect(org)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "50px",
                  border: `1.5px solid ${isActive ? color : color + "40"}`,
                  background: isActive
                    ? `linear-gradient(135deg,${color}30,${color}15)`
                    : "rgba(255,255,255,0.04)",
                  color: isActive ? "#fff" : "#9ca3af",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: isActive ? `0 0 18px ${color}35` : "none",
                  transform: isActive ? "scale(1.07)" : "scale(1)",
                  transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                  outline: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = color + "80";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                    (e.currentTarget as HTMLButtonElement).style.background = `${color}12`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 10px 24px -18px ${color}aa`;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = color + "40";
                    (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }
                }}
              >
                {/* color dot */}
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: color,
                  boxShadow: isActive ? `0 0 7px ${color}` : "none",
                  flexShrink: 0,
                  transition: "box-shadow 0.3s",
                }} />
                {org}
                {/* cert count badge */}
                <span style={{
                  fontSize: "10px", fontWeight: 600,
                  background: isActive ? color + "30" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${isActive ? color + "50" : "rgba(255,255,255,0.1)"}`,
                  color: isActive ? color : "#6b7280",
                  borderRadius: "20px",
                  padding: "1px 7px",
                  transition: "all 0.3s",
                }}>
                  {grouped[org].certs.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Active Org Label ── */}
        <div style={{
          textAlign: "center",
          overflow: "hidden",
          maxHeight: activeOrg ? "60px" : "0px",
          opacity: activeOrg ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.4s ease",
          marginBottom: activeOrg ? "24px" : "0",
        }}>
          {activeOrg && activeData && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg,transparent,${activeData.color}60)` }} />
              <span style={{ fontSize: "13px", color: activeData.color, fontWeight: 600, letterSpacing: "0.05em" }}>
                {activeOrg} · {activeData.certs.length} certificate{activeData.certs.length > 1 ? "s" : ""}
              </span>
              <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg,${activeData.color}60,transparent)` }} />
            </div>
          )}
        </div>

        {/* ── Expanded Cards ── */}
        <div
          ref={cardsRef}
          style={{
            display: "grid",
            gap: "12px",
            overflow: "hidden",
            maxHeight: cardsVisible && activeData ? `${activeData.certs.length * 200}px` : "0px",
            opacity: cardsVisible ? 1 : 0,
            borderRadius: "14px",
            padding: cardsVisible ? "6px" : "0px",
            background: cardsVisible ? "rgba(255,255,255,0.02)" : "transparent",
            boxShadow: cardsVisible ? "0 30px 60px -44px rgba(0,0,0,0.9)" : "none",
            transition: "max-height 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease",
          }}
        >
          {activeOrg && activeData && activeData.certs.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} visible={cardsVisible} color={activeData.color} />
          ))}
        </div>

        {/* close hint */}
        {activeOrg && cardsVisible && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => handleSelect(activeOrg)}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "6px 18px",
                color: "#6b7280",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              Collapse ↑
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          className="cert-card"
          style={{
            marginTop: "72px",
            textAlign: "center",
            padding: "28px 32px",
            borderRadius: "16px",
            boxShadow: "0 20px 48px -36px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}>
            Committed to continuous learning and professional growth across cloud, AI, data science, and software development.
          </p>
        </div>

      </div>
    </section>
  );
}