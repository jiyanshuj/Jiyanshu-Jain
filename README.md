# Modern Portfolio - Jiyanshu Jain

A modern, responsive portfolio website showcasing work in machine learning, web development, and software engineering. Built with React, TypeScript, Vite, and Tailwind CSS. This project features smooth animations, particle effects, dark mode support, and an interactive user experience that highlights projects, skills, certifications, and contact information.

**Live Demo**: [jiyanshu.netlify.app](https://jiyanshu.netlify.app/)

## ✨ Features

- **Responsive Design**: Fully responsive and mobile-optimized layout
- **Dark Mode Support**: Toggle between light and dark themes with persistent storage
- **Smooth Animations**: Built with Framer Motion for engaging transitions and effects
- **Particle Background**: Dynamic particle effects on the hero section
- **Typing Effect**: Animated typing text that cycles through multiple roles
- **Visitor Counter**: Track portfolio visits
- **Performance Optimized**: Built with Vite for fast development and production builds
- **Intersection Observer**: Lazy animations when sections come into view
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS
- **SEO Friendly**: Clean HTML structure and semantic markup
- **Social Links**: Easy access to GitHub, LinkedIn, and other social profiles

## 🎯 Project Sections

- **Header**: Navigation with dark/light theme toggle
- **Hero**: Eye-catching introduction with typing effect, particle background, and call-to-action buttons
- **About**: Personal information and professional introduction
- **Skills**: Comprehensive skill showcase organized by categories (Languages, Frameworks, Tools, Soft Skills)
- **Projects**: Portfolio of completed projects with descriptions and links
- **Certifications**: Professional certifications and achievements
- **Contact**: Get in touch section with contact form
- **Footer**: Social links and additional information
- **Loading Screen**: Initial page load animation for visual polish
- **Visitor Counter**: Track and display portfolio visits

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Component Details](#component-details)
- [Customization](#customization)
- [Performance](#performance)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Steps

1. Clone the repository:

```bash
git clone https://github.com/jiyanshuj/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

## 💻 Usage

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

### Build for Production

Build the project for production:

```bash
npm run build
```

The optimized production files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |

## 📁 Project Structure

```
portfolio/
├── public/                          # Static assets
│   └── images/                      # Image files
├── src/
│   ├── components/
│   │   ├── About.tsx               # About section component
│   │   ├── Certifications.tsx      # Certifications section
│   │   ├── Contact.tsx             # Contact section
│   │   ├── Footer.tsx              # Footer component
│   │   ├── Header.tsx              # Navigation header
│   │   ├── Hero.tsx                # Hero/intro section with particles
│   │   ├── LoadingScreen.tsx       # Initial loading animation
│   │   ├── ParticleBackground.tsx  # Particle effect component
│   │   ├── Projects.tsx            # Projects showcase
│   │   ├── Skills.tsx              # Skills section
│   │   ├── ThemeToggle.tsx         # Dark mode toggle button
│   │   └── VisitorCounter.tsx      # Visitor counter display
│   ├── hooks/
│   │   └── useTypingEffect.ts      # Custom hook for typing animation
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles
│   └── vite-env.d.ts               # Vite environment types
├── package.json                     # Project dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── vite.config.ts                   # Vite bundler configuration
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
└── README.md                        # This file
```

## 🛠 Technologies Used

### Core Framework
- **React** (v18.3.1) - UI library
- **TypeScript** (v5.5.3) - Type-safe JavaScript
- **Vite** (v6.3.5) - Fast build tool and dev server

### Styling
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **PostCSS** (v8.4.35) - CSS transformations
- **Autoprefixer** (v10.4.18) - Browser prefix auto-adding

### Animations & Effects
- **Framer Motion** (v11.0.3) - Advanced animation library
- **React Intersection Observer** (v9.8.0) - Element visibility detection

### UI Components
- **Lucide React** (v0.344.0) - Beautiful icon library

### Development Tools
- **ESLint** (v9.9.1) - Code quality checker
- **TypeScript ESLint** (v8.3.0) - TypeScript linting support
- **Vite React Plugin** (v4.3.1) - React support for Vite

## 🎨 Component Details

### Hero Component
The hero section features:
- Particle background animation
- Typing effect that cycles through: "Web Developer", "AI-ML Enthusiast", "Problem Solver", "Full-Stack Developer"
- Animated gradient background
- Call-to-action buttons (GitHub, LinkedIn, Download CV)
- Smooth scroll navigation

## 💼 Featured Projects

### 1. **Student Campus Cloud Network**
A full-stack, cloud-based smart campus management system integrating:
- AI-powered attendance (face recognition)
- PaperVista (AI question paper generation)
- AutoSlideX (AI presentation generation)
- Smart Career Guidance
- Student Forum
- E-Canteen & E-Library
- Online Fee Payment
- Role-based access control (Teacher, Student, Admin, Guest)

**Tech Stack**: React.js, Python, Flask  
**Demo**: [Visit Live](https://neuro-campus-73w8.vercel.app/) | **Code**: [GitHub](https://github.com/Yug-Bothra/NEURO_CAMPUS)

---

### 2. **Smart Career Guidance System**
An AI-driven career assessment and guidance platform that:
- Evaluates students across CS domains (OS, DBMS, Compiler Design, OOP, Programming)
- Analyzes performance and tracks progress
- Recommends personalized career paths
- Suggests tailored learning resources

**Tech Stack**: React.js, Python, FastAPI  
**Demo**: [Visit Live](https://smart-career-guidance-system.vercel.app/) | **Code**: [GitHub](https://github.com/jiyanshuj/Smart-Career-Guidance-System)

---

### 3. **AutoSlideX**
An AI-powered presentation generation platform that:
- Converts topics into complete, structured PowerPoint presentations
- Two-step AI workflow for customization
- Auto-generates detailed content with images and diagrams

**Tech Stack**: React, FastAPI, Python  
**Demo**: [Visit Live](https://auto-slide-x.vercel.app/) | **Code**: [GitHub](https://github.com/jiyanshuj/AutoSlideX)

---

### 4. **PaperVista**
A smart AI-powered question paper generator for college examinations:
- Generates MST-1, MST-2, and End-Semester papers
- University-style formatting
- Customizable by subject, syllabus, and marks distribution

**Tech Stack**: React, FastAPI, Python  
**Demo**: [Visit Live](https://paper-vista-five.vercel.app/) | **Code**: [GitHub](https://github.com/jiyanshuj/PaperVista)

---

### 5. **Health Guard AI**
A machine learning-powered disease prediction web application:
- Predicts Diabetes, Heart Disease, and Parkinson's Disease
- Based on user health parameters
- Utilizes pre-trained ML models
- Streamlit interface for intuitive user experience

**Tech Stack**: Python, Streamlit, scikit-learn  
**Demo**: [Visit Live](https://health-guard-ai.streamlit.app/) | **Code**: [GitHub](https://github.com/jiyanshuj/Health-Guard-AI)

---

### 6. **NextStep Resume**
A full-stack web application for generating professional resumes:
- Dynamic form handling with real-time preview
- Modern tech stack
- Professional document generation
- Easy-to-use interface

**Tech Stack**: React, TypeScript, Flask  
**Demo**: [Visit Live](https://nextstep-resume.netlify.app/) | **Code**: [GitHub](https://github.com/jiyanshuj/Resume-Gen)

---

### 7. **Sustainable Travel Planner**
An eco-friendly travel planning application:
- Helps users make environmentally conscious travel decisions
- Hack Wave Hackathon Finalist
- Focus on sustainability

**Tech Stack**: Python, Django, JavaScript  
**Demo**: [Visit Live](https://error-404-v1-1.onrender.com/) | **Code**: [GitHub](https://github.com/jiyanshuj/Errror-404-v1-)

---

### 8. **Skills Bridge Platform**
An AI-powered educational platform bridging academic learning and job skills:
- Personalized learning paths
- Skill gap analysis
- Industry collaboration portal

**Tech Stack**: React, Node.js, TensorFlow  
**Demo**: [Visit Live](https://skillpulse.netlify.app/) | **Code**: [GitHub](https://github.com/jiyanshuj/project)

## � Certifications & Achievements

### Microsoft Learn Certified (2023-2024)
**Issuer**: Microsoft  
Developed expertise in:
- AI workloads
- Machine Learning
- Computer Vision
- Natural Language Processing (NLP)
- Generative AI on Azure

**Achievements**: Completed 30+ modules and 40+ hours of coursework

---

### The Joy of Computing using Python (June 2024)
**Issuer**: NPTEL  
A 12-week intensive course covering:
- Python fundamentals and syntax
- Algorithms and data structures
- Data analysis techniques
- Real-world applications and problem solving

---

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
