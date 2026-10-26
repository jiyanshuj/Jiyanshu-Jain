export type ProjectCategory = 'AI / ML' | 'Data / Cloud' | 'Full stack' | 'API / Backend' | 'Computer vision';

/** One countable fact, e.g. { value: '26', label: 'API endpoints' }. Keep labels short (max ~3 words). */
export type ProjectFact = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  image: string;
  /** One line: what it is. */
  summary: string;
  /** The real-world problem, in plain words. */
  problem: string;
  /** What the project does about it, from the user's side. */
  solution: string;
  /** How it was built, in order. Each step is something that exists in the code. */
  approach: string[];
  /** Counted from the repo (endpoints, tables, files, datasets). No accuracy, no vanity numbers. */
  facts: ProjectFact[];
  /** Who built what. */
  role: string;
  /** Start date and commit count from git history. */
  timeline: string;
  /** One honest line about current status or limits. */
  status?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  confidential?: boolean;
};

export const contact = {
  email: 'jiyanshujain321@gmail.com',
  github: 'https://github.com/jiyanshuj',
  linkedin: 'https://www.linkedin.com/in/jiyanshu-jain/',
  resume: 'https://drive.google.com/file/d/1ctvuIWKStE55AY5SCBZfmd-CbsGLZ0Xh/view?usp=sharing',
  resumeDownload: 'https://drive.google.com/uc?export=download&id=1ctvuIWKStE55AY5SCBZfmd-CbsGLZ0Xh',
};

/*
  Every number below was counted from the public repos (checked 26 Oct 2026):
  endpoints = route decorators, tables = distinct .table()/.from()/CREATE TABLE names,
  commits and dates = git log. If you change the code, re-count before changing a number.
*/
export const projects: Project[] = [
  {
    id: 'ev-site-suitability',
    title: 'EV Site Suitability Analysis',
    category: 'Data / Cloud',
    image: '/images/EY-EV-Charging.png',
    summary: 'A ranked, explainable shortlist of EV charging sites, built during my EY internship.',
    problem:
      'Choosing where to put EV chargers means weighing roads, grid access and demand across many candidate sites, and the final list has to be defended in front of a planning team.',
    solution:
      'A ranked shortlist of candidate sites across 9 states, where every score can be explained and the result opens as layers in QGIS.',
    approach: [
      'Pulled roads, power-grid and points-of-interest data into PostGIS and GeoPandas.',
      'Turned them into per-site features: proximity, density and demand signals.',
      'Scored each site with XGBoost and an AHP weighting of the planning criteria.',
      'Explained every ranking with SHAP values so the team could challenge it.',
      'Served scoring through async FastAPI endpoints and exported QGIS-ready layers.',
    ],
    facts: [
      { value: '9', label: 'states shortlisted' },
      { value: '3', label: 'methods combined' },
    ],
    role: 'AI/ML Engineer Intern at EY',
    timeline: 'Feb – May 2026',
    status: 'Client work, so the code and data are not public.',
    technologies: ['Python', 'XGBoost', 'GeoPandas', 'AHP', 'PostGIS', 'QGIS', 'SHAP'],
    featured: true,
    confidential: true,
  },
  {
    id: 'campus-cloud-network',
    title: 'Campus Cloud Network',
    category: 'Full stack',
    image: '/images/Student-Campus-Cloud-Network.png',
    summary: 'A campus suite with five role-based panels and face-recognition attendance.',
    problem:
      'A university runs attendance, subjects, fees and student tools in separate places, and attendance is taken by hand in every class.',
    solution:
      'One suite where Admin, Teacher, Student, Guest and Accounts each get their own panel, and a teacher can mark a whole class present from a camera frame.',
    approach: [
      'Enrol each person with at least 5 face photos stored in Cloudinary.',
      'Turn every photo into a 128-number face encoding and train a model per section and semester.',
      'A teacher starts a session: everyone begins absent, recognised faces become present, or late after 10 minutes.',
      'Build reports per student, per subject and per day, and flag anyone below 75% attendance.',
      'Keep all records in Supabase Postgres, with a React hub and a teacher panel in front.',
    ],
    facts: [
      { value: '26', label: 'API endpoints' },
      { value: '21', label: 'database tables' },
      { value: '5', label: 'role panels' },
      { value: '4', label: 'developers' },
    ],
    role: 'Team of 4. I built the face-recognition attendance API and the teacher panel; a teammate built the student hub.',
    timeline: 'Aug 2025 – Oct 2026 · 91 commits across 3 repos (59 mine)',
    status: 'Final-year major project. The README lists the next hardening steps (API auth, upload limits).',
    technologies: ['Python', 'React', 'FastAPI', 'Supabase', 'OpenCV', 'Cloudinary', 'Gemini API'],
    githubUrl: 'https://github.com/jiyanshuj/Major-project',
    liveUrl: 'https://neuro-campus-73w8.vercel.app/',
    featured: true,
  },
  {
    id: 'autoslidex',
    title: 'AutoSlideX',
    category: 'AI / ML',
    image: '/images/AutoSlideX.png',
    summary: 'Turns a topic into an editable outline, then into a real .pptx file.',
    problem:
      'Building a teaching deck means researching the topic, structuring the slides and fixing the layout by hand before any real teaching content exists.',
    solution:
      'Type a topic and a slide count, edit the generated outline in the browser, then download a finished PowerPoint file.',
    approach: [
      'Stage 1: Gemini turns the topic into slides with a title, bullets, speaker notes and an image query.',
      'Edit, add or remove slides in the browser before anything is exported.',
      'Stage 2: python-pptx builds the deck at 10 × 7.5 inches in a Modern or Professional theme.',
      'Slide images come from a three-step chain: Google Images, then Unsplash, then a fallback.',
      'If a Gemini model fails, the call retries and moves down a chain of three models.',
    ],
    facts: [
      { value: '7', label: 'API endpoints' },
      { value: '2', label: 'deck themes' },
      { value: '3', label: 'fallback AI models' },
      { value: '3', label: 'image sources' },
    ],
    role: 'Solo build',
    timeline: 'Started Nov 2025 · 21 commits',
    status: 'Decks are held in server memory while you edit, so a restart clears them.',
    technologies: ['Python', 'React', 'Vite', 'FastAPI', 'Gemini API', 'python-pptx', 'Tailwind CSS'],
    githubUrl: 'https://github.com/jiyanshuj/AutoSlideX',
    liveUrl: 'https://auto-slide-x.vercel.app/',
    featured: true,
  },
  {
    id: 'healthguard-ai',
    title: 'HealthGuard AI',
    category: 'AI / ML',
    image: '/images/Health-Guard-AI.png',
    summary: 'Risk estimates for diabetes, heart disease and Parkinson’s from basic health inputs.',
    problem:
      'Early screening for diabetes, heart disease and Parkinson’s usually needs a clinic visit, and the numbers on a lab report mean little to the person holding it.',
    solution:
      'A three-page web app where you enter your values and get a risk estimate with a probability, clearly marked as informational.',
    approach: [
      'Used three public datasets: Pima Indians diabetes (768 rows), Cleveland heart disease (303 rows) and UCI Parkinson’s voice recordings (195 rows).',
      'Cleaned each set. The diabetes data drops from 768 to 723 rows after removing impossible values such as zero glucose.',
      'Trained one scikit-learn pipeline per condition: scaling, then a linear SVM or logistic regression.',
      'Checked each model with an 80/20 split and 5-fold cross-validation.',
      'Saved three model files and loaded them in Streamlit, which retrains by itself if a file is missing.',
    ],
    facts: [
      { value: '3', label: 'conditions' },
      { value: '3', label: 'public datasets' },
      { value: '723', label: 'cleaned diabetes rows' },
      { value: '8 · 13 · 22', label: 'inputs per model' },
    ],
    role: 'Solo build (a classmate is credited in the README)',
    timeline: 'May 2025',
    status: 'An informational tool, not a medical device. The app shows a disclaimer.',
    technologies: ['Python', 'scikit-learn', 'Streamlit', 'Pandas'],
    githubUrl: 'https://github.com/jiyanshuj/Health-Guard-AI',
    liveUrl: 'https://health-guard-ai.streamlit.app/',
  },
  {
    id: 'smart-career-guidance',
    title: 'Smart Career Guidance System',
    category: 'AI / ML',
    image: '/images/Smart-Career-Guidance-System.png',
    summary: 'A 30-question placement quiz that scores six areas and recommends a career domain.',
    problem:
      'Engineering students reach placements without knowing which skills are weak, and generic mock tests do not say which direction suits them.',
    solution:
      'A timed 30-question quiz followed by a scored breakdown, a recommended domain, career paths with links, and a result page that can be shared.',
    approach: [
      'Sign in with Clerk; the Flask API checks every request against Clerk’s public keys.',
      'Choose a difficulty (easy, moderate or hard) and a programming language.',
      'One batched Gemini call writes all 30 questions, 5 each for OS, DBMS, Networks, Aptitude, Verbal and Programming, throttled to stay under the 30-requests-a-minute limit.',
      'If the model fails or returns too few questions, a built-in question bank fills the gap.',
      'Answers become four domain scores; the top domain is recommended and Gemini writes career paths for it.',
      'Everything is stored in Supabase and each result gets a public link.',
    ],
    facts: [
      { value: '30', label: 'questions per quiz' },
      { value: '6', label: 'subject areas' },
      { value: '4', label: 'Supabase tables' },
      { value: '9', label: 'API routes' },
    ],
    role: 'Solo build',
    timeline: 'First build 15 – 23 Nov 2025 · 26 commits in total',
    technologies: ['Python', 'React', 'Flask', 'Supabase', 'Gemini API', 'Clerk'],
    githubUrl: 'https://github.com/jiyanshuj/Smart-Career-Guidance-System',
    liveUrl: 'https://smart-career-guidance-system.vercel.app',
  },
  {
    id: 'papervista',
    title: 'PaperVista',
    category: 'AI / ML',
    image: '/images/PaperVista.png',
    summary: 'Generates MST-1, MST-2 and End-Sem exam papers in the university format.',
    problem:
      'Writing an exam paper means balancing topics and marks, then typing it into the department’s format every semester.',
    solution:
      'Enter the course, exam type and topics, and get a formatted paper with parts (a), (b) and (c), marks and an OR option, ready to print.',
    approach: [
      'Pick one of three formats: MST-1, MST-2 or End-Sem.',
      'Stage 1: Gemini plans an outline with one topic per question (2 questions for an MST, 5 for End-Sem).',
      'Stage 2: each question is written on its own, worth 3 + 3 + 4 marks in an MST and 4 + 4 + 6 in End-Sem, with an OR choice on part (c).',
      'Every model call has a 45-second timeout, 3 retries and a chain of 3 models, with a template question as the last resort.',
      'The browser prints the paper in exam layout.',
    ],
    facts: [
      { value: '3', label: 'exam formats' },
      { value: '5', label: 'max questions' },
      { value: '3', label: 'API routes' },
      { value: '45 s', label: 'timeout per call' },
    ],
    role: 'Solo build',
    timeline: 'Started Nov 2025 · 18 commits',
    technologies: ['Python', 'React', 'Vite', 'FastAPI', 'Gemini API', 'Pydantic', 'Tailwind CSS'],
    githubUrl: 'https://github.com/jiyanshuj/PaperVista',
    liveUrl: 'https://paper-vista-five.vercel.app',
  },
  {
    id: 'resume-parser-api',
    title: 'Resume Parser API',
    category: 'API / Backend',
    image: '/images/Resume-Parser-API.png',
    summary: 'Turns an uploaded PDF résumé into a structured profile stored in MongoDB.',
    problem:
      'Recruiters read hundreds of PDF résumés by hand, and every candidate formats theirs differently, so profiles cannot be searched or compared.',
    solution:
      'Upload a PDF and get back a structured profile that is saved in MongoDB and ready to search.',
    approach: [
      'Accept a PDF up to 5 MB and keep the original file in Cloudinary.',
      'Extract the text with PyPDF2 and clean up the spacing and bullets.',
      'Ask Gemini 2.0 Flash-Lite for a fixed JSON shape with 20 profile fields: contact details, skills, experience, education, projects and links.',
      'Validate the result with Pydantic models before it is saved.',
      'Upsert the profile in MongoDB under a unique user id, and expose get, update and delete endpoints.',
    ],
    facts: [
      { value: '5', label: 'API endpoints' },
      { value: '20', label: 'profile fields' },
      { value: '1', label: 'MongoDB collection' },
      { value: '5 MB', label: 'upload limit' },
    ],
    role: 'Built with one teammate. 17 of the 20 commits are mine.',
    timeline: 'Started Sep 2025 · 20 commits',
    status: 'Reads PDF résumés only.',
    technologies: ['Python', 'FastAPI', 'Gemini API', 'MongoDB', 'Pydantic', 'Cloudinary'],
    githubUrl: 'https://github.com/jiyanshuj/resume-parse',
    liveUrl: 'https://resume-parse-1.onrender.com',
  },
  {
    id: 'snapattend',
    title: 'SnapAttend',
    category: 'Computer vision',
    image: '/images/SnapAttend.png',
    summary: 'Marks attendance from a webcam and writes the day’s sheet automatically.',
    problem:
      'Calling out names takes minutes from every lecture, and paper registers are slow to total at the end of the month.',
    solution:
      'Point a webcam at the class: the app finds each face, names the student and writes that day’s attendance sheet.',
    approach: [
      'Add a student and capture face photos from the browser camera.',
      'Find faces with OpenCV’s Haar cascade, then crop and shrink each one to 64 × 64 grayscale.',
      'Train a KNN classifier in the background whenever a student is added.',
      'Recognise faces in the live video feed and mark each student once per day, so repeat detections are ignored.',
      'Keep student records in SQLite, write one CSV sheet per day and show today’s and past attendance in a React dashboard.',
    ],
    facts: [
      { value: '15', label: 'API routes' },
      { value: '1', label: 'SQLite table' },
      { value: '1 / day', label: 'CSV sheet' },
    ],
    role: 'Solo build',
    timeline: 'May 2026',
    status: 'The repo ships with one demo student. Enrol your own from the camera.',
    technologies: ['Python', 'Flask', 'OpenCV', 'scikit-learn', 'SQLite', 'React'],
    githubUrl: 'https://github.com/jiyanshuj/SnapAttend',
  },
  {
    id: 'nextstep-cv',
    title: 'NextStep CV',
    category: 'Full stack',
    image: '/images/NextStep-CV.png',
    summary: 'A browser résumé builder with a live preview, five templates and PDF export.',
    problem:
      'Building a résumé in a word processor means fighting the layout, and switching style means redoing the work.',
    solution:
      'Fill in one form, watch the live preview, switch between five templates without losing your data, and save as PDF. No sign-up and no server.',
    approach: [
      'Modelled the résumé as six form sections: personal, experience, education, projects, skills and achievements.',
      'Rendered the same data through five template components: Classic, Minimal, Modern, Sidebar and Academic.',
      'Updated the preview on every keystroke from one shared state object.',
      'Autosaved the draft to localStorage so a refresh never loses work.',
      'Used the browser’s print dialog for PDF export, so there is no backend to run.',
    ],
    facts: [
      { value: '5', label: 'templates' },
      { value: '6', label: 'form sections' },
      { value: '0', label: 'servers needed' },
    ],
    role: 'Solo build',
    timeline: 'Started Apr 2025 · 20 commits',
    technologies: ['JavaScript', 'React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/jiyanshuj/Resume-Gen',
    liveUrl: 'https://nextstep-resume.netlify.app/',
  },
  {
    id: 'visnex-global',
    title: 'Visnex Global',
    category: 'Full stack',
    image: '/images/Visnex-Global.png',
    summary: 'A founder and investor platform with a full CRUD API behind it.',
    problem:
      'Early-stage founders and investors find each other through scattered lists and cold outreach, with no single place to filter by industry, stage and location.',
    solution:
      'A platform with investor, startup, partnership and success-story pages, backed by an API that can create, read, update and delete investors and startups.',
    approach: [
      'Split the work across three developers: React front end, FastAPI and MongoDB back end.',
      'Modelled two MongoDB collections, investors and startups, with filters for industry, stage, location, category and tags.',
      'Built 23 REST endpoints: full CRUD for both collections, filter-option lists and two stats endpoints.',
      'Built 7 front-end views and filled them with sample data: 6 investors, 4 incubators, 8 startups and 6 success stories.',
    ],
    facts: [
      { value: '23', label: 'API endpoints' },
      { value: '2', label: 'MongoDB collections' },
      { value: '7', label: 'front-end views' },
      { value: '3', label: 'developers' },
    ],
    role: 'Team of 3. I built the FastAPI and MongoDB back end and 8 of the team’s 15 commits.',
    timeline: '4 – 24 Feb 2026 · 15 commits',
    status: 'The front end runs on bundled sample data. The API is built but not connected yet.',
    technologies: ['React', 'Tailwind CSS', 'Python', 'FastAPI', 'MongoDB'],
    githubUrl: 'https://github.com/jiyanshuj/Visnex-Global',
    liveUrl: 'https://visnex-global.vercel.app',
  },
  {
    id: 'skills-bridge',
    title: 'Skills Bridge Platform',
    category: 'Full stack',
    image: '/images/Skills-Bridge-Platform.png',
    summary: 'A front-end prototype of a learning platform with three role views.',
    problem:
      'Learners can find courses easily, but nothing shows them where they stand, what to learn next and what employers are asking for.',
    solution:
      'A 13-page prototype with a learner dashboard, a partner portal for hiring teams, an admin panel and a chatbot for asking questions about a video.',
    approach: [
      'Designed 13 pages and 15 routes in React and TypeScript with React Router.',
      'Built three role views (learner, partner, admin) with realistic sample data.',
      'Added GitHub sign-in and a contact form.',
      'Wired a chatbot component that sends a video path and a question to a /chatbot endpoint.',
      'Deployed the front end on Netlify.',
    ],
    facts: [
      { value: '13', label: 'pages' },
      { value: '15', label: 'routes' },
      { value: '3', label: 'role views' },
    ],
    role: 'Solo build',
    timeline: 'First build 18 – 26 Jan 2025 · 14 commits in total',
    status: 'A UI prototype. Dashboards use sample data and the chatbot back end is not in this repo.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    githubUrl: 'https://github.com/jiyanshuj/Skills-Bridge-Platform',
    liveUrl: 'https://skillpulse.netlify.app/',
  },
  {
    id: 'travel-planner',
    title: 'Error 404 Travel Planner',
    category: 'Full stack',
    image: '/images/Error-404-Travel-Planner.png',
    summary: 'Recommends bus, train or flight from the real route distance, then walks through a booking.',
    problem:
      'Planning a trip means jumping between a map, a transport site and hotel sites just to decide whether to take a bus, a train or a flight.',
    solution:
      'Enter where you are and where you are going. The app measures the route distance, recommends a mode of transport and walks you through hotels and a booking form.',
    approach: [
      'Send both places to the TomTom routing API and read back the distance in kilometres.',
      'Apply a simple rule: under 70 km suggests a bus, 70 to 1,000 km a train, and over 1,000 km a flight.',
      'Show a hotel list for the destination.',
      'Keep five guest details in a Django session, then finish with a QR payment page and a confirmation ID.',
      'Deploy on Render with Gunicorn.',
    ],
    facts: [
      { value: '5', label: 'Django routes' },
      { value: '9', label: 'page templates' },
      { value: '3', label: 'transport modes' },
    ],
    role: 'Built for a hackathon final. All commits in this repo are mine.',
    timeline: 'Started Dec 2024 · 12 commits',
    status: 'A hackathon prototype. Hotels are a fixed list and payment is a QR page, not a gateway.',
    technologies: ['Python', 'Django', 'TomTom API', 'SQLite', 'JavaScript'],
    githubUrl: 'https://github.com/jiyanshuj/GoPlan',
    liveUrl: 'https://goplan.onrender.com/',
  },
];

export const projectCategories: Array<'All' | ProjectCategory> = ['All', 'AI / ML', 'Data / Cloud', 'Full stack', 'API / Backend', 'Computer vision'];