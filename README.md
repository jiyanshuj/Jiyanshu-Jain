# Modern Portfolio - Jiyanshu Jain

A modern, responsive portfolio website showcasing expertise in AI/ML, full-stack web development, and data analytics. Built with React 18, TypeScript, Vite, and Tailwind CSS, this portfolio features smooth animations, particle effects, dark mode support, and an interactive user experience that highlights professional experience, projects, technical skills, certifications, and contact information.

**Live Demo**: [jiyanshu.netlify.app](https://jiyanshu.netlify.app/)

## ✨ Features

- **Responsive Design**: Fully responsive and mobile-optimized layout with adaptive UI across all devices
- **Dark Mode Support**: Toggle between light and dark themes with persistent local storage
- **Smooth Animations**: Built with Framer Motion for engaging transitions, scroll-triggered reveals, and interactive effects
- **Particle Background**: Dynamic WebGL particle effects on the hero section with reduced motion support
- **Typing Effect**: Animated typing text that cycles through multiple professional roles and specializations
- **Professional Timeline**: Interactive experience timeline with timeline animation and hover effects
- **Visitor Counter**: Track portfolio visits via Supabase backend integration
- **Performance Optimized**: Built with Vite for fast development and production builds with optimized code splitting
- **Scroll Animations**: Lazy animations triggered by Intersection Observer when sections come into view
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS with comprehensive utility coverage
- **Glassmorphism UI**: Advanced glass effects with blur, opacity, and gradient overlays for project cards
- **SEO Friendly**: Clean HTML structure, semantic markup, and proper heading hierarchy
- **Social Integration**: Easy access to GitHub, LinkedIn, and other professional social profiles

## 🎯 Portfolio Sections

### **Header**
- Responsive navigation bar with smooth scrolling to sections
- Dark/light theme toggle with icon switching and persistent preference
- Mobile hamburger menu for touch devices

### **Hero Section**
- Eye-catching introduction with cycling typing effect (roles: AI/ML Engineer, Full-Stack Developer, Data Analyst)
- Dynamic particle background with reduced motion support
- Call-to-action buttons linking to projects and contact section
- Professional tagline and role description

### **Experience Section**
- Interactive timeline showcasing professional work experience
- **EY (Ernst & Young)** — AI/ML Engineer (Feb 2026 – Present)
  - XGBoost + AHP scoring pipeline for EV charging site selection across 9 Indian states
  - QGIS dashboards and PostGIS geospatial analysis
  
- **Hired Easy** — Android / Web Developer (Aug – Nov 2025)
  - ML resume-job matching engine with 92% accuracy using Gemini AI
  - React Native mobile UI with 55% latency reduction via Redis caching

### **About Section**
- Personal information and professional introduction
- Background and career journey overview

### **Skills Section**
- **Languages**: Python, TypeScript, JavaScript, C++, SQL, HTML/CSS
- **Frontend**: React, React Native, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: FastAPI, Flask, Django, REST APIs, Uvicorn
- **ML/Data Science**: TensorFlow, scikit-learn, XGBoost, OpenCV, Pandas, NumPy, SHAP, Folium, GeoPandas
- **Cloud & Database**: PostgreSQL, MongoDB, Redis, Firebase, Supabase, Vercel, Netlify, Azure Databricks, PostGIS, QGIS
- **Mobile**: React Native, Expo
- **AI/Tools**: Gemini API, Langflow AI, Pydantic, Streamlit

### **Projects Section**
Portfolio of **12+ completed projects** featuring AI/ML and full-stack applications:
1. **Campus Cloud Network** — Platform automating attendance, exams, resumes for ERP integration
2. **Smart Career Guidance System** — 30-question adaptive quizzes with AI-generated questions
3. **AutoSlideX** — AI-powered presentation builder with automatic diagram sourcing
4. **PaperVista** — AI exam paper generator for university MST/End-Sem formats
5. **EV Site Suitability Analysis** — Geospatial ML pipeline for infrastructure site selection
6. **HealthGuard AI** — ML-based chronic disease risk prediction (Diabetes, CHD, Parkinson's)
7. **NextStep CV** — AI-optimized resume builder with ATS optimization
8. **SnapAttend** — Face recognition attendance system with auto-training model
9. **Resume Parser API** — FastAPI service parsing PDF/DOCX resumes with Gemini AI
10. **Skills Bridge Platform** — AI learning paths with video analysis and personalized recommendations
11. **Visnex Global** — AI-matching platform connecting founders and investors across 120+ countries
12. **Error 404 Travel Planner** — (additional project)

Each project includes:
- Problem statement and business context
- Technical solution and implementation details
- AI capabilities and key differentiators
- Technology stack breakdown
- Links to GitHub repositories and live demos

### **Certifications**
- Professional certifications and achievements with visual display
- Achievement cards with hover reveal animations

### **Contact Section**
- Get in touch section with contact form
- Multiple contact channels for professional inquiries

### **Footer**
- Social links and additional information
- Quick links to main sections

### **Loading Screen**
- Initial page load animation for visual polish
- Smooth fade-in transition to main content

### **Visitor Counter**
- Track and display portfolio visits via Supabase backend
- Real-time visitor statistics

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Portfolio Analytics](#portfolio-analytics)
- [Technologies Stack](#technologies-stack)
- [Project Architecture](#project-architecture)
- [Key Components](#key-components)
- [Customization Guide](#customization-guide)
- [Performance Optimization](#performance-optimization)
- [Browser Support](#browser-support)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### Prerequisites

- **Node.js** v16 or higher (v18+ recommended)
- **npm** v8+ or **yarn** v3+
- Git for version control

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jiyanshuj/jiyanshu.git
   cd jiyanshu
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **(Optional) Configure Supabase for visitor counter**:
   - Update `src/lib/supabaseClient.ts` with your Supabase project URL and anon key
   - The visitor counter will work without Supabase but won't persist data

## 💻 Usage

### Development Server

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The server will start at `http://localhost:5173` (or the port shown in your terminal). Any changes to the source files will be automatically reflected in the browser.

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The compiled and minified files will be generated in the `dist/` directory, ready for deployment.

### Preview Production Build

Preview the production build locally before deployment:

```bash
npm run preview
```

### Linting

Check for code quality and lint errors:

```bash
npm run lint
```

## 📊 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (TypeScript compilation + minification) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality with ESLint |

## 📁 Project Architecture

```
src/
├── components/           # React components
│   ├── About.tsx        # Personal introduction section
│   ├── Header.tsx       # Navigation with theme toggle
│   ├── Hero.tsx         # Hero section with typing effect
│   ├── Experience.tsx   # Professional timeline
│   ├── Skills.tsx       # Skills organized by category
│   ├── Projects.tsx     # Project showcase with glassmorphism
│   ├── Certifications.tsx # Achievements and credentials
│   ├── Contact.tsx      # Contact form section
│   ├── Footer.tsx       # Footer with social links
│   ├── ParticleBackground.tsx # WebGL particle effects
│   ├── LoadingScreen.tsx # Initial page load animation
│   ├── VisitorCounter.tsx # Supabase visitor tracking
│   ├── BorderGlow.tsx   # Glow effect component
│   └── BorderGlow.css   # Glow styling
├── hooks/               # Custom React hooks
│   ├── usePrefersReducedMotion.ts # Accessibility hook
│   └── useTypingEffect.ts # Typing animation logic
├── lib/                 # Utility libraries
│   └── supabaseClient.ts # Supabase configuration
├── App.tsx             # Main App component
├── main.tsx            # Entry point
├── index.css           # Global styles
└── vite-env.d.ts       # Vite environment types

public/                 # Static assets
└── images/            # Image files

Config Files:
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
├── tailwind.config.js # Tailwind CSS setup
├── postcss.config.js  # PostCSS configuration
├── eslint.config.js   # ESLint rules
└── package.json       # Dependencies and scripts
```

## 🛠️ Technologies Stack

### Core Framework
- **React** 18.3.1 — UI library with modern hooks and concurrent features
- **TypeScript** 5.5.3 — Type-safe JavaScript for robust code
- **Vite** 6.3.5 — Lightning-fast build tool with ESM native support

### Styling & UI
- **Tailwind CSS** 3.4.1 — Utility-first CSS framework
- **Framer Motion** 11.0.3 — Animation library for smooth transitions
- **PostCSS** 8.4.35 — CSS transformations and autoprefixing
- **Lucide React** 0.344 — Beautiful icon library

### Utilities & Plugins
- **React Intersection Observer** 9.8.0 — Scroll-triggered animations
- **Lenis** 1.3.21 — Smooth scrolling library
- **Supabase** 2.99.1 — Backend-as-a-Service for visitor counter

### Development Tools
- **ESLint** 9.9.1 — Code quality and style checking
- **TypeScript ESLint** 8.3.0 — TypeScript linting support
- **Autoprefixer** 10.4.18 — CSS vendor prefix automation

## 🧩 Key Components

### Hero Component
- **Typing Effect**: Custom hook cycling through professional roles
- **Particle Background**: Dynamic WebGL particles with performance optimization
- **Call-to-Action**: Navigation buttons to projects and contact sections
- **Responsive**: Adapts from mobile to desktop with optimized layouts

### Projects Component
- **Glassmorphism Cards**: Advanced blur and opacity effects
- **Hover Reveal**: Full project details on hover (desktop) / tap (mobile)
- **Problem-Solution Pattern**: Structured project information
- **Technology Tags**: Visual tech stack indicators
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Dynamic Filtering**: Filter projects by technology tags

### Skills Component
- **Categorized Skills**:
  - Languages (Python, TypeScript, JavaScript, C++, SQL, HTML/CSS)
  - Frontend (React, Vite, Tailwind, Framer Motion)
  - Backend (FastAPI, Flask, Django)
  - ML/Data Science (TensorFlow, scikit-learn, XGBoost, etc.)
  - Cloud & Databases (PostgreSQL, MongoDB, Firebase, Supabase)
  - Mobile (React Native, Expo)
- **Icon Integration**: DevIcon library for visual representation
- **Expandable UI**: "Expand" functionality to reveal more skills per category

### Experience Timeline
- **Vertical Timeline**: Professional positions with timeline animation
- **Problem-Solution-Approach**: Structured experience narrative
- **Color-Coded**: Each company has unique accent color
- **Tech Stack Display**: Technologies used in each role

### Certifications
- **Card-based Display**: Professional certifications with images
- **Hover Animations**: Reveal certificate details on interaction
- **Responsive Grid**: Adapts to different screen sizes
- **Focus Styles**: Accessibility-first design with visible focus outlines

## 🎨 Customization Guide

### Adding New Projects

Edit `src/components/Projects.tsx`:

```typescript
const projects: Project[] = [
  {
    id: 1,
    title: 'Your Project Title',
    description: 'Brief description',
    problem: 'Problem you solved',
    solution: 'How you solved it',
    differentiators: ['AI Feature 1', 'Feature 2'],
    image: '/path/to/image.jpg',
    tags: ['React', 'AI'],
    technologies: ['React', 'FastAPI', 'TensorFlow'],
    githubUrl: 'https://github.com/...',
    liveUrl: 'https://...',
    icon: <SomeIcon />,
  },
];
```

### Adding New Skills

Edit `src/components/Skills.tsx`:

```typescript
const skills: Skill[] = [
  { 
    name: 'Skill Name', 
    icon: 'https://cdn.jsdelivr.net/...', 
    category: 'languages' | 'frontend' | 'backend' | 'ml-data' | 'cloud-db' | 'mobile' | 'tools'
  },
];
```

### Updating Social Links

Edit `src/components/Footer.tsx` to update GitHub, LinkedIn, and other social profiles.

### Customizing Theme Colors

Edit `tailwind.config.js` to modify color schemes:

```javascript
theme: {
  extend: {
    colors: {
      // Your custom colors
    },
  },
}
```

### Modifying Animations

- **Framer Motion**: Adjust animation variants in component files
- **Particle Effects**: Configure particle behavior in `ParticleBackground.tsx`
- **Scroll Triggers**: Modify Intersection Observer thresholds in components
- **Typing Speed**: Adjust timing in `useTypingEffect.ts`

## ⚡ Performance Optimization

### Build Optimization
- **Code Splitting**: Vite automatically splits code into chunks
- **Tree Shaking**: Removes unused code from final bundle
- **Minification**: CSS, JavaScript, and HTML are minified in production

### Runtime Performance
- **Lazy Loading**: Components render only when visible
- **Intersection Observer**: Efficient scroll-triggered animations
- **Reduced Motion**: Support for `prefers-reduced-motion` accessibility preference
- **Image Optimization**: Optimized image assets in `public/images/`
- **Caching**: Browser caching and service worker support

### Bundle Analysis
Check bundle size:
```bash
npm run build  # See output for bundle size estimate
```

## 🌐 Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions (macOS 12+)
- **Mobile**: iOS Safari 12+, Chrome Android
- **Fallback**: Graceful degradation for older browsers

## ♿ Accessibility Features

- **ARIA Labels**: Proper semantic HTML and ARIA attributes
- **Focus Visible**: Clear focus indicators for keyboard navigation (outline-[#7dd3fc])
- **Reduced Motion**: Respects `prefers-reduced-motion` system preference
- **Color Contrast**: Text meets WCAG AA standards (4.5:1+ ratio)
- **Keyboard Navigation**: Fully navigable with keyboard
- **Semantic HTML**: Proper heading hierarchy and semantic markup

## 🐛 Troubleshooting

### Development Issues

**Port Already in Use**
```bash
# Change port in terminal or kill the process
npm run dev -- --port 3000
```

**Module Not Found Errors**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Hot Module Replacement (HMR) Not Working**
- Check firewall settings
- Restart the dev server: `npm run dev`

### Build Issues

**Build Fails**
```bash
npm run build -- --debug
```

**Production Build Looks Different**
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Test with `npm run preview`

### Performance Issues

**Slow Initial Load**
- Check network tab in DevTools
- Optimize images in `public/images/`
- Check for large dependencies in `node_modules`

**Particles Lagging**
- Reduce particle count in `ParticleBackground.tsx`
- Enable reduced motion mode for testing

## 📈 Portfolio Analytics

### Project Showcase
- **12+ Completed Projects** across AI/ML, full-stack web, mobile, and data analytics domains
- **Project Categories**:
  - **AI/ML & Data**: Campus Cloud Network, Smart Career Guidance, AutoSlideX, PaperVista, EV Site Suitability, HealthGuard AI, Resume Parser
  - **Full-Stack Web**: Skills Bridge Platform, Visnex Global, NextStep CV
  - **Computer Vision**: SnapAttend (face recognition)
  - **Mobile**: React Native applications for cross-platform mobile development

### Technical Expertise Demonstrated
- **Frontend**: Modern React patterns with hooks, TypeScript, responsive design with Tailwind CSS
- **Backend**: FastAPI, REST API design, real-time data processing
- **ML/Data Science**: XGBoost, scikit-learn, TensorFlow, AI model integration (Gemini API)
- **Database & Storage**: PostgreSQL with PostGIS, MongoDB, Redis caching
- **Infrastructure**: Supabase backend, Cloudinary CDN, QGIS geospatial tools
- **DevOps**: Vercel, Netlify deployment, CI/CD ready

### Performance Metrics
- **Avg Build Time**: < 500ms with Vite
- **Lighthouse Scores**: Optimized for Core Web Vitals
- **Mobile Score**: 90+
- **Performance Score**: 85+
- **First Contentful Paint (FCP)**: < 1.5s
- **Visitor Tracking**: Real-time via Supabase

## 📝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Built by Jiyanshu Jain** | [GitHub](https://github.com/jiyanshuj) | [LinkedIn](https://linkedin.com/in/jiyanshuj) | [Portfolio](https://jiyanshu.netlify.app/)

### Technical Quiz Organizer (April 2024)
**Issuer**: Shri Vaishnav Vidyapeeth Vishwavidyalaya  
Led organization of campus-wide technical quiz:
- Fostered knowledge-sharing among students
- Promoted technical skill development
- Enhanced community engagement

---

### Hack Wave Hackathon Finalist
**Issuer**: Chameli Devi Group of Institutions  
Developed "Sustainable Travel Planner":
- Advanced to final round
- Demonstrated innovation and sustainability focus
- Built eco-friendly solution during competition

---

### Continuous Learning Journey
Committed to staying at the forefront of technology through:
- Continuous education and professional development
- Hands-on experience with emerging technologies
- Active participation in hackathons and tech events

## �🎨 Customization

### Updating Personal Information

Edit the component files in `src/components/` to add your own information:
- Update `Hero.tsx` for your name and title
- Update `About.tsx` for your biography
- Update `Skills.tsx` to list your actual skills
- Update `Projects.tsx` to showcase your projects
- Update `Contact.tsx` with your contact details
- Update `Certifications.tsx` with your achievements

### Changing Colors

Modify the Tailwind CSS configuration in `tailwind.config.js` to customize the color scheme and theme.

### Adding New Sections

1. Create a new component in `src/components/`
2. Import and add it to `App.tsx`
3. Style with Tailwind CSS classes
4. Update navigation in `Header.tsx` if needed

### Modifying Animations

Adjust animation settings in Framer Motion components or modify global animation timing in individual component files.

### Updating Social Links

Edit social media links in:
- `Header.tsx` - Navigation links
- `Footer.tsx` - Footer social links
- `Hero.tsx` - CTA buttons

### Environment & Deployment

This portfolio is live at: [jiyanshu.netlify.app](https://jiyanshu.netlify.app/)

To deploy your own:
1. Build the project: `npm run build`
2. Deploy to Netlify: Connect your GitHub repo to Netlify for automatic deployments
3. Or use other platforms: Vercel, GitHub Pages, etc.

## ⚡ Performance

The portfolio is optimized for performance:
- **Code Splitting**: Automatic with Vite
- **Image Optimization**: Use optimized image formats
- **CSS Minification**: Automatic in production
- **Tree Shaking**: Unused code is removed from production builds
- **Lazy Loading**: Sections animate on scroll with Intersection Observer

### Performance Metrics
- Fast initial load with Vite's ESM-based dev server
- Optimized production bundle with minimal dependencies
- Smooth 60fps animations with GPU acceleration

## 🌐 Browser Support

This portfolio works on all modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### Dark Mode Not Persisting
Check browser's localStorage is enabled in settings.

### Animations Not Smooth
Ensure you're using a modern browser. For older browsers, consider disabling animations in `tailwind.config.js`.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Passes ESLint checks (`npm run lint`)
- Includes proper TypeScript types
- Works in both light and dark modes

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or feedback:

- **GitHub**: [jiyanshuj](https://github.com/jiyanshuj)
- **LinkedIn**: [jiyanshu-jain](https://www.linkedin.com/in/jiyanshu-jain/)
- **Email**: jiyanshujain321@gmail.com
- **Resume**: [Download Resume](https://drive.google.com/file/d/17e5tSxGjZknRC9rvhHazbPtDpYg-apsQ/view?usp=sharing)

---

## 🎓 About Jiyanshu Jain

A passionate developer with a strong foundation in machine learning, web development, and software engineering. Focused on turning complex problems into elegant solutions and creating beautiful digital experiences.

**Current Focus**: Computer Science with specialization in AI and Machine Learning
