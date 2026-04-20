/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Mail, 
  Phone, 
  ExternalLink, 
  ChevronRight, 
  Code2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Linkedin,
  Instagram,
  ArrowUpRight,
  Library,
  Book,
  BookOpen,
  FileText,
  Search,
  History,
  Languages,
  X,
  ZoomIn,
  Send,
  MessageSquare,
  Loader2,
  Sparkles,
  ChevronUp,
  Share2,
  Check,
  Moon,
  Sun
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { projectKnowledgeBase } from './services/projectKnowledge';

const Spotlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(141, 110, 99, 0.1), transparent 80%)`
      }}
    />
  );
};

const ReferenceDeskChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '안녕하세요! 장성현의 포트폴리오 상담소(Reference Desk)입니다. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const projectsContext = projectKnowledgeBase.map(p => `
[프로젝트: ${p.title}]
- 상세: ${p.fullDescription}
- 성과: ${p.achievements.join(', ')}
- 기술: ${p.techStack.join(', ')}
- 인사이트: ${p.insights}
      `).join('\n');

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `당신은 '사서 장성현'의 모든 기록과 지식을 관리하고 안내하는 AI 비서입니다. 
          포트폴리오에 기재된 모든 정보를 바탕으로 답변하되, 따뜻하고 신뢰감 있는 사서의 말투를 유지하세요.

          [성현님의 전승된 지식 가이드]
          1. 프로필: 2002년 서울 출생. 한성대학교 지식정보문화/디지털인문정보학 트랙 재학 중(2021~현재).
          2. 철학: "도서관은 성장하는 유기체이다(랑가나단)."
          3. 핵심 가치: 정보 문해력(Literacy), 기억의 보존, 상호운용성, 맥락적 무결성.
          
          4. 주요 상세 프로젝트 정보(심화 지식):
          ${projectsContext}
          
          5. 전문 도구(Skills):
            - 아카이빙: Dublin Core, OAIS, Omeka S 전문가.
            - 데이터/AI: Python, SQL, Gemini, Google AI Studio 능통.
            - 사무: 워드프로세서 자격 보유, MS Excel, HWP.
          
          6. 학력 사항: 수락초-수락중-수락고를 거쳐 현재 한성대학교 재학 중.
          7. 자격 및 이수: 2025 바이브 코딩캠프(AWS AI/SW) 이수, 워드프로세서 보유.

          질문에 대해 위 정보를 적극 활용하여 답변하고, 더 자세한 내용은 사이트의 각 섹션(User Guide, Knowledge Toolbox, Major Collections)에서 확인할 수 있다고 안내하세요.`,
        }
      });

      const aiResponse = response.text || "죄송합니다, 잠시 서가 정리를 하느라 답변이 늦어졌습니다. 다시 말씀해 주시겠어요?";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "시스템 오류로 대출이 중단되었습니다. 잠시 후 다시 시도해주세요." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3 bg-brand-primary text-[#f5f2ed] rounded-full border border-brand-accent/30 shadow-lg hover:bg-brand-accent transition-all group"
      >
        <MessageSquare size={18} className="group-hover:rotate-12 transition-transform" />
        <span className="font-serif italic text-sm">Ask the Librarian (AI)</span>
        <Sparkles size={14} className="text-yellow-400 animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 left-0 w-80 md:w-96 bg-brand-secondary border border-brand-accent/20 rounded-2xl shadow-2xl overflow-hidden z-[100]"
          >
            {/* Chat Header */}
            <div className="bg-brand-primary p-4 border-b border-brand-accent/20 flex justify-between items-center text-[#f5f2ed]">
              <div className="flex items-center gap-2">
                <Library size={18} className="text-brand-accent" />
                <span className="font-display font-bold">Reference Desk</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-brand-accent transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="h-80 overflow-y-auto p-4 space-y-4 bg-brand-secondary/30"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-brand-accent text-white rounded-br-none' 
                      : 'bg-brand-secondary border border-brand-accent/20 text-ink rounded-bl-none shadow-sm font-serif transition-colors duration-300'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-brand-secondary border border-brand-accent/20 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-ink transition-colors duration-300">
                    <Loader2 size={14} className="animate-spin text-brand-accent" />
                    <span className="text-xs italic opacity-40">서가에서 답변을 찾는 중...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-brand-secondary border-t border-brand-accent/20 flex gap-2 transition-colors duration-300">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="궁금한 정보를 물어보세요..."
                className="flex-1 bg-brand-secondary dark:bg-black/30 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-brand-accent outline-none text-ink dark:text-brand-secondary"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-brand-primary text-[#f5f2ed] rounded-xl hover:bg-brand-accent disabled:opacity-50 transition-all shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectTimeline = ({ projects }: { projects: any[] }) => {
  return (
    <div className="mb-20 px-8 py-12 paper-card relative overflow-visible hidden md:block group/timeline">
      {/* Timeline Base Line */}
      <div className="absolute top-1/2 left-12 right-12 h-1 bg-brand-accent/10 -translate-y-1/2 rounded-full" />
      
      {/* Notches for each year/project */}
      <div className="flex justify-between items-center relative z-10 px-4">
        {projects.map((project, idx) => (
          <button
            key={idx}
            onClick={() => {
              const el = document.getElementById(`project-${idx}`);
              if (el) {
                const headerOffset = 100;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
              }
            }}
            className="flex flex-col items-center group relative cursor-pointer"
          >
            {/* Year & Month Label */}
            <div className="absolute -top-10 text-[10px] font-mono text-brand-accent/40 group-hover:text-brand-accent transition-colors font-bold tracking-tighter whitespace-nowrap">
              {project.period.split(' ~ ')[0].replace(/\.\s*$/, '')}
            </div>
            
            {/* Focal Point Dot */}
            <motion.div 
              whileHover={{ scale: 1.6, backgroundColor: '#8d6e63' }}
              className="w-4 h-4 rounded-full bg-brand-secondary dark:bg-brand-primary border-2 border-brand-accent group-hover:shadow-[0_0_15px_rgba(141,110,99,0.3)] transition-all z-20" 
            />
            
            {/* Project Title Tooltip-style */}
            <div className="absolute top-8 text-center w-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
              <span className="text-[11px] font-display text-ink dark:text-brand-secondary leading-tight block bg-brand-secondary dark:bg-brand-primary p-2 border border-brand-accent/20 shadow-xl rounded-sm">
                {project.title}
              </span>
            </div>
            
            {/* Secondary Notch for vertical context */}
             <div className="w-0.5 h-4 bg-brand-accent/10 absolute top-1/2 left-1/2 -translate-x-1/2 -z-10" />
          </button>
        ))}
      </div>
      
      {/* Decorative Labels */}
      <div className="absolute -bottom-2 -left-2 text-[8px] font-mono text-brand-accent/20 uppercase tracking-[0.5em] origin-bottom-left -rotate-90">
        Records
      </div>
    </div>
  );
};
const LibraryIntro = ({ onEnter }: { onEnter: () => void }) => {
  const [stage, setStage] = useState<'shelf' | 'focus' | 'opening'>('shelf');

  const handlePickBook = () => {
    setStage('focus');
    // Landing stably in the center before opening (reduced timing overlap)
    setTimeout(() => {
      setStage('opening');
    }, 600);
  };

  const handleOpenMain = () => {
    setTimeout(onEnter, 1400); // Wait for the "촤르르" to finish
  };

  useEffect(() => {
    if (stage === 'opening') {
      handleOpenMain();
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f0a] overflow-hidden">
      {/* Background Ambience - Sharp Classic Library Bookshelf */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1920')",
          filter: 'brightness(0.6)'
        }}
      />
      {/* Dark vignette to focus on the center shelf */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1a0f0a_100%)] opacity-70" />
      
      <AnimatePresence>
        {stage === 'shelf' ? (
          <motion.div 
            key="shelf"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.3 } }}
            className="relative flex flex-col items-center justify-center p-12"
          >
            <h2 className="text-[#f5f2ed]/50 font-accent italic text-xl mb-12 tracking-widest uppercase">Select a volume to begin</h2>
            
            {/* The Shelf */}
            <div className="relative flex items-end justify-center perspective-1000">
              <div className="flex items-end gap-1 px-8 py-2 border-b-4 border-[#2d1b10] bg-[#1a0f0a]/40 shadow-2xl rounded-sm">
                {[1, 2, 3].map((_, i) => (
                  <div 
                    key={`left-${i}`} 
                    className="w-8 md:w-10 bg-[#3d2b1f] border-x border-[#2d1b10]/40 rounded-t-sm shadow-inner"
                    style={{ height: `${120 + i * 20}px`, opacity: 0.6 }}
                  />
                ))}
                
                {/* The Main Book (Portfolio Spine) */}
                <motion.div 
                  layoutId="book-interaction"
                  whileHover={{ y: -20, scale: 1.05 }}
                  onClick={handlePickBook}
                  className="relative group cursor-pointer z-20"
                >
                  <div className="w-12 md:w-16 h-48 md:h-64 bg-[#3e2723] rounded-t-sm shadow-[10px_0_15px_-5px_rgba(0,0,0,0.5)] border-l-4 border-[#2d1b10] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 group-hover:brightness-125">
                    <div className="flex flex-col items-center gap-1.5 py-4 h-full [writing-mode:vertical-rl]">
                      <Library size={20} className="text-[#8d6e63] transform -rotate-90 mb-4" />
                      <span className="text-[10px] md:text-xs font-accent text-[#f5f2ed]/80 uppercase tracking-[0.3em] whitespace-nowrap">
                        성현's Portfolio
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                {[1, 2, 3, 4].map((_, i) => (
                  <div 
                    key={`right-${i}`} 
                    className="w-10 md:w-12 bg-[#2d1b10] border-x border-black/20 rounded-t-sm shadow-inner"
                    style={{ height: `${180 - i * 15}px`, opacity: 0.5 }}
                  />
                ))}
              </div>
            </div>
            
          </motion.div>
        ) : (
          <motion.div 
            key="focus-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-full w-full flex items-center justify-center z-50"
          >
            <motion.div 
              layoutId="book-interaction"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative perspective-2000 w-64 h-96 flex items-center justify-center"
            >
              {/* Entire Book Container that stays centered */}
              <div className="relative w-full h-full transform-preserve-3d" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* Back Cover / Base of the book stack */}
                <div className="absolute inset-0 bg-[#2d1b10] rounded-r-lg shadow-2xl" style={{ transform: 'translateZ(-10px)' }} />
                
                {/* The "촤르르" Pages */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ rotateY: 0 }}
                    animate={stage === 'opening' ? { rotateY: -155 - (i * 2) } : { rotateY: 0 }}
                    transition={{ 
                      duration: 1.2, 
                      delay: stage === 'opening' ? 0.2 + (i * 0.1) : 0,
                      ease: "easeInOut" 
                    }}
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'left' }}
                    className="absolute inset-y-1 right-1 left-0 bg-brand-secondary rounded-r border-r border-ink/5 shadow-sm overflow-hidden z-[15]"
                  >
                    <div className="w-full h-full p-8 opacity-[0.08] flex flex-col gap-4">
                        <div className="h-2 w-3/4 bg-ink/20 rounded" />
                        <div className="h-2 w-full bg-ink/20 rounded" />
                        <div className="mt-auto h-20 w-full border border-ink/20 rounded flex items-center justify-center">
                          <Library size={24} className="opacity-20" />
                        </div>
                    </div>
                  </motion.div>
                ))}

                {/* Front Cover Container */}
                <motion.div
                  animate={stage === 'opening' ? { rotateY: -160 } : { rotateY: 0 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                  className="absolute inset-0 transform-preserve-3d origin-left z-20"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front Cover Face */}
                  <div className="absolute inset-0 bg-[#3e2723] rounded-r-lg book-shadow flex flex-col items-center justify-center border-l-8 border-[#2d1b10] p-6 text-center z-10 backface-hidden">
                    <div className="border-2 border-[#8d6e63] p-4 flex flex-col items-center gap-4">
                      <Library size={48} className="text-[#8d6e63]" />
                      <div className="space-y-1">
                        <h1 className="text-2xl font-accent text-[#f5f2ed]">성현's Portfolio</h1>
                        <p className="text-xs text-[#8d6e63] uppercase tracking-[0.2em] font-sans">Collection Vol. 25</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Inside of Front Cover */}
                  <div className="absolute inset-0 bg-[#4e342e] rounded-r-lg" style={{ transform: 'rotateY(180deg)', backfaceHidden: 'hidden' }} />
                </motion.div>

                {/* Stationary final index page */}
                <div className="absolute inset-2 bg-brand-secondary rounded-r shadow-inner -z-10 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 border border-brand-accent/5 flex items-center justify-center">
                    <Library size={40} className="text-brand-accent/5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ href, label, active }: { href: string, label: string, active: boolean }) => (
  <a href={href} className="group flex items-center py-3">
    <div className={`mr-4 h-1 transition-all group-hover:w-12 group-hover:bg-brand-accent ${active ? 'w-12 bg-brand-accent' : 'w-4 bg-gray-300 dark:bg-gray-700'}`} />
    <span className={`font-sans text-sm font-medium uppercase tracking-widest transition-colors group-hover:text-brand-accent ${active ? 'text-brand-accent' : 'text-gray-400 dark:text-gray-500'}`}>
      {label}
    </span>
  </a>
);

const ProjectCard = ({ project, onImageClick, id }: { project: any, onImageClick: (url: string) => void, id?: string, [key: string]: any }) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="catalog-card mb-12 group transition-all hover:translate-y-[-4px] p-8 md:p-10 transition-colors dark:text-brand-secondary"
  >
    <div className="flex justify-between items-center mb-4">
      <div className="text-[11px] font-mono text-brand-accent dark:text-brand-accent/90 tabular-nums">
        #{(Math.random() * 99999).toFixed(0).padStart(5, '0')}
      </div>
      <div className="text-[11px] font-mono text-brand-accent opacity-70">
        <span className="border border-brand-accent/20 px-3 py-1 rounded bg-brand-accent/5 dark:bg-brand-accent/20 uppercase tracking-wider whitespace-nowrap font-sans">
          {project.period}
        </span>
      </div>
    </div>

    <div className="flex items-start gap-4 mb-8">
      <BookOpen size={32} className="text-brand-accent shrink-0 mt-1" />
      <h3 className="text-2xl md:text-3xl font-display leading-tight text-ink dark:text-brand-secondary decoration-brand-accent/20 decoration-2 underline-offset-4 group-hover:underline transition-colors">
        <a 
          className="transition-colors flex items-center gap-2" 
          href={project.url || "#"} 
          target={project.url ? "_blank" : undefined}
          rel={project.url ? "noopener noreferrer" : undefined}
        >
          {project.title}
          {project.url && <ExternalLink size={20} className="text-brand-accent opacity-50 group-hover:opacity-100 transition-opacity" />}
        </a>
      </h3>
    </div>
    
    <div className="space-y-6">
      <p className="text-base md:text-lg leading-relaxed text-ink/80 dark:text-brand-secondary font-serif italic border-l-2 border-ink/5 dark:border-brand-secondary/20 pl-6 py-1 transition-colors">
        {project.description}
      </p>
      
      <ul className="flex flex-wrap gap-3">
        {project.tags.map((tag: string) => (
          <li key={tag} className="text-[11px] uppercase tracking-widest font-mono px-3 py-1 bg-ink/5 dark:bg-brand-accent/30 text-ink/60 dark:text-white rounded-full group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-all">
            {tag}
          </li>
        ))}
      </ul>

      {project.url && (
        <div className="pt-2">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-[#f5f2ed] font-accent italic text-sm rounded-sm hover:bg-brand-primary transition-all shadow-sm group/link"
          >
            {project.linkLabel || 'Visit Archive Site'} 
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      )}

      {project.images && project.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-4 border-t border-ink/5 dark:border-brand-secondary/10 transition-colors">
          {project.images.slice(0, 2).map((img: string, i: number) => (
            <div 
              key={i} 
              className="aspect-video overflow-hidden rounded-sm border border-ink/10 dark:border-brand-secondary/10 shadow-sm relative group/img cursor-zoom-in"
              onClick={() => onImageClick(img)}
            >
              <img 
                src={img.startsWith('http') ? img : `${import.meta.env.BASE_URL}${img.startsWith('/') ? img.slice(1) : img}`} 
                alt={`${project.title} screenshot ${i+1}`} 
                className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-700 scale-105 group-hover/img:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-primary/5 dark:bg-brand-accent/5 pointer-events-none mix-blend-multiply transition-opacity group-hover/img:opacity-0" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/5 dark:bg-black/20 backdrop-blur-[2px]">
                <div className="bg-brand-secondary p-2 rounded-full text-brand-primary shadow-lg border border-brand-accent/20">
                  <ZoomIn size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const sections = ['about', 'skills', 'projects', 'contact'];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "장성현 | 사서 & 지식정보전문가 포트폴리오",
          text: "장성현의 기록과 지식 아카이브를 확인해보세요.",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  useEffect(() => {
    if (!hasEntered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hasEntered]);

  const projects = [
    {
      title: '한성대 마을버스 혼잡도 분석',
      description: '마을버스 승하차 통계 자료를 분석하고 시각화하여 혼잡도가 높은 시간대와 낮은 시간대를 도출하였습니다.',
      tags: ['Data Analysis', 'Visualization'],
      period: '2022. 11. ~ 2022. 12.',
      images: [
        '/소셜데이터 1.png',
        '/소셜데이터 2.png'
      ]
    },
    {
      title: '서울교통공사 전략계획 수립 보고서',
      description: '서울교통공사의 기업 분석을 기반으로 미래 비전을 설계한 경영학적 결과물입니다.',
      tags: ['Organization Management', 'Strategic Plan', 'Teamwork'],
      period: '2023. 05. ~ 2023. 06.',
      images: [
        '/조직경영론 1.png',
        '/조직경영론 2.png'
      ]
    },
    {
      title: '2025 삼선동 아카이빙 프로젝트',
      description: '재개발을 앞둔 삼선동의 모습들을 수집하고 낮과 밤에 따른 차이점을 포착한 아카이빙 작업입니다.',
      tags: ['Community Records', 'Cultural Archives', 'Teamwork'],
      period: '2025. 09. ~ 2025. 12.',
      url: 'https://hsarchives.org/s/2025-samseon/page/main',
      images: [
        '/공동체아카이빙 1.png',
        '/공동체아카이빙 2.png'
      ]
    },
    {
      title: '구로도서관 ‘바로풀기 교실’ 프로그램 기획',
      description: '다문화 가정 학생의 지식 격차를 해소하기 위한 도서관 프로그램을 기획했습니다.',
      tags: ['Library Service', 'Program Design', 'Teamwork'],
      period: '2025. 10. ~ 2025. 12.',
      images: [
        '/프기평1.png',
        '/프기평2.png'
      ]
    },
    {
      title: '장실타임(Jangsil-Time)',
      description: '기다림을 달래주는 인터랙티브 웹 애플리케이션을 구글 AI Studio를 활용하여 제작했습니다.',
      tags: ['AI-Driven', 'Google AI Studio', 'Web Development'],
      period: '2026. 03. ~ 2026. 04.',
      url: 'https://sunghyun0115.github.io/jangsil-time/',
      linkLabel: 'Visit Web Application',
      images: [
        '/장실타임 1.png',
        '/장실타임 2.png'
      ]
    }
  ];

  const education = [
    { school: '한성대학교', degree: '재학 중 (지식정보문화/디지털인문정보학)', period: '2021 - Present' },
    { school: '수락고등학교', degree: '졸업', period: '2017 - 2019' },
    { school: '수락중학교', degree: '졸업', period: '2014 - 2016' },
    { school: '수락초등학교', degree: '졸업', period: '2008 - 2013' },
    { school: '서울 출생', degree: '', period: '2002' },
  ];

  if (!hasEntered) {
    return <LibraryIntro onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className={`relative min-h-screen selection:bg-brand-accent selection:text-white overflow-x-hidden ${isDarkMode ? 'dark' : ''}`}>
      <Spotlight />
      
      <div className="mx-auto max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 relative z-10">
        <div className="lg:flex lg:justify-between lg:gap-4">
          
          {/* Left Sidebar - Fixed on Large Screens */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
            <div className="relative">
              <div className="absolute -left-12 top-0 text-brand-accent/10 dark:text-brand-accent/5 pointer-events-none">
                <Library size={180} strokeWidth={0.5} />
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight text-ink dark:text-brand-secondary sm:text-6xl font-display mb-2">
                <a href="/">장성현 <span className="text-xl font-accent italic text-brand-accent/60 block mt-2"> Librarian & Knowledge Information Expert </span></a>
              </h1>
              <h2 className="mt-4 text-xl font-serif italic text-brand-accent flex items-center gap-2">
                <Search size={18} /> A library is a growing organism.
              </h2>
              <p className="mt-6 max-w-xs leading-relaxed text-ink/60 dark:text-brand-secondary/60 font-serif text-lg italic border-l-2 border-brand-accent/20 pl-4">
                정보의 바다에서 이정표를 세우는 사서를 희망합니다. 
                지식으로 세상을 알아가고, 사라져가는 일상의 순간을 기록합니다.
              </p>
              
              <nav className="nav hidden lg:block mt-20">
                <ul className="w-max space-y-2">
                  <li><NavItem href="#about" label="User Guide" active={activeSection === 'about'} /></li>
                  <li><NavItem href="#skills" label="Knowledge Toolbox" active={activeSection === 'skills'} /></li>
                  <li><NavItem href="#projects" label="Major Collections" active={activeSection === 'projects'} /></li>
                  <li><NavItem href="#contact" label="Reference Services" active={activeSection === 'contact'} /></li>
                </ul>
              </nav>
            </div>
            
            <ul className="ml-1 mt-12 flex items-center gap-6">
              <li><a href="tel:010-7755-8362" className="p-2 rounded-full border border-ink/10 dark:border-brand-secondary/10 text-ink/40 dark:text-brand-secondary/40 hover:text-brand-accent hover:border-brand-accent dark:hover:text-brand-accent transition-all"><Phone size={20} /></a></li>
              <li><a href="mailto:amazingalex@naver.com" className="p-2 rounded-full border border-ink/10 dark:border-brand-secondary/10 text-ink/40 dark:text-brand-secondary/40 hover:text-brand-accent hover:border-brand-accent dark:hover:text-brand-accent transition-all"><Mail size={20} /></a></li>
              <li>
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full border border-ink/10 dark:border-brand-secondary/10 text-ink/40 dark:text-brand-secondary/40 hover:text-brand-accent hover:border-brand-accent dark:hover:text-brand-accent transition-all cursor-pointer relative"
                  title="Share Portfolio"
                >
                  {copied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
                  {copied && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-ink text-brand-secondary text-[10px] rounded whitespace-nowrap font-mono uppercase tracking-widest">
                      Copied!
                    </span>
                  )}
                </button>
              </li>
            </ul>

            <ReferenceDeskChat />
          </header>

          {/* Right Content - Scrollable */}
          <main className="pt-24 lg:w-1/2 lg:py-24">
            
            {/* About Section */}
            <section id="about" className="mb-20 scroll-mt-16 md:mb-32 lg:mb-40">
              <div className="flex items-center gap-4 mb-8 lg:mb-12">
                <div className="flex items-center gap-2 bg-brand-accent/5 dark:bg-brand-accent/10 px-4 py-2 rounded-full border border-brand-accent/10 dark:border-brand-accent/20">
                  <History size={14} className="text-brand-accent" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent font-sans">User Guide</h2>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-accent/20 to-transparent" />
              </div>
              
              <div className="paper-card p-8 space-y-6">
                <div className="flex items-center gap-3 text-brand-accent font-display">
                  <FileText size={20} />
                  <h3 className="text-xl md:text-2xl font-accent italic">Statement</h3>
                </div>
                
                <div className="space-y-4 text-ink/80 dark:text-brand-secondary/80 text-lg leading-[1.8] font-serif transition-colors">
                  <p>
                    저는 단순히 데이터를 수집하는 단계를 넘어 가치 있고 유용한 정보를 선별하여 이용자에게 제공하려고 노력합니다. 
                    과거로부터 전승된 지혜가 현재에 활용될 수 있게, 또 미래로 이어질 수 있도록 하는 일이 제가 추구하는 전문가로서의 본질입니다.
                  </p>
                  <p>
                    아날로그 기록의 보존부터 최신 디지털 정보 관리까지 정보를 수집하고 제공하는 모든 과정은 이용자를 위한 것입니다. 
                    모든 사람이 지식을 평등하게 누릴 수 있는 미래를 위해, 따뜻한 관심과 분석적인 시선으로 나아가겠습니다.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 pt-8 border-t border-ink/5 dark:border-brand-secondary/10 font-sans transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-brand-secondary/40 font-mono mb-2">Specialization</span>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Knowledge Organization
                      </span>
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Reference Services
                      </span>
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Data Analysis & Visualization
                      </span>
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Cultural Heritage Archiving
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-brand-secondary/40 font-mono mb-2">Core Values</span>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Information Literacy
                      </span>
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Preservation of Memory
                      </span>
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Interoperability
                      </span>
                      <span className="text-lg font-serif italic text-ink dark:text-brand-secondary leading-tight flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-brand-accent/40" /> Contextual Integrity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-10">
                  <h4 className="text-ink dark:text-brand-secondary font-accent italic text-xl mb-6 flex items-center gap-2 transition-colors">
                    <GraduationCap size={20} className="text-brand-accent" /> Academic History
                  </h4>
                  <div className="space-y-6 border-l border-brand-accent/20 ml-2 pl-8">
                    {education.map((item, idx) => (
                      <div key={idx} className="relative group/edu">
                        <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-brand-accent bg-brand-secondary dark:bg-[#1a1a1a] group-hover/edu:bg-brand-accent transition-colors" />
                        <span className="text-[10px] font-mono text-brand-accent uppercase tracking-tighter">{item.period}</span>
                        <h5 className="text-lg font-display text-ink dark:text-brand-secondary transition-colors">{item.school}</h5>
                        <p className="text-sm font-serif italic text-ink/50 dark:text-brand-secondary/40 transition-colors">{item.degree}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="mb-20 scroll-mt-16 md:mb-32 lg:mb-40">
              <div className="flex items-center gap-4 mb-8 lg:mb-12">
                <div className="flex items-center gap-2 bg-brand-accent/5 dark:bg-brand-accent/10 px-4 py-2 rounded-full border border-brand-accent/10 dark:border-brand-accent/20">
                  <Code2 size={14} className="text-brand-accent" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent font-sans">Knowledge Toolbox</h2>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-accent/20 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="paper-card p-8">
                  <h3 className="text-xl md:text-2xl font-accent italic mb-6 border-b border-ink/5 dark:border-brand-secondary/10 pb-4 transition-colors">Available Tools & Platforms</h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-brand-secondary/40 font-mono mb-4 transition-colors">Archiving & Metadata</h4>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {['Dublin Core', 'OAIS', 'Omeka S'].map(tool => (
                          <span key={tool} className="px-4 py-2 bg-brand-secondary border border-ink/20 rounded sm transition-all hover:bg-brand-accent hover:text-white hover:border-brand-accent font-sans text-sm font-medium text-ink">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-brand-secondary/40 font-mono mb-4 transition-colors">Data Science & Database</h4>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {['Python', 'Anaconda', 'Relational Database'].map(tool => (
                          <span key={tool} className="px-4 py-2 bg-brand-secondary border border-ink/20 rounded sm transition-all hover:bg-brand-accent hover:text-white hover:border-brand-accent font-sans text-sm font-medium text-ink">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-brand-secondary/40 font-mono mb-4 transition-colors">AI Intelligence</h4>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {['Gemini', 'Google AI Studio'].map(tool => (
                          <span key={tool} className="px-4 py-2 bg-brand-secondary border border-ink/20 rounded sm transition-all hover:bg-brand-accent hover:text-white hover:border-brand-accent font-sans text-sm font-medium text-ink">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-brand-secondary/40 font-mono mb-4 transition-colors">Office Productivity</h4>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {['MS Excel', 'PowerPoint', 'HWP'].map(tool => (
                          <span key={tool} className="px-4 py-2 bg-brand-secondary border border-ink/20 rounded sm transition-all hover:bg-brand-accent hover:text-white hover:border-brand-accent font-sans text-sm font-medium text-ink">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="paper-card p-8">
                  <h3 className="text-xl md:text-2xl font-accent italic mb-6 border-b border-ink/5 dark:border-brand-secondary/10 pb-4 transition-colors">Certified Licenses</h3>
                  <div className="space-y-6">
                    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-accent/30">
                      <p className="text-sm font-bold text-ink dark:text-brand-secondary transition-colors">2025 바이브 코딩캠프 이수</p>
                      <p className="text-xs text-ink/50 dark:text-brand-secondary/40 mb-2 font-serif transition-colors">AWS 기반 AI·SW 체험 프로그램(2025. 09. 27. ~ 2025. 09. 28.)</p>
                      <span className="text-[10px] font-mono bg-brand-accent/5 dark:bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded transition-colors">2025.09.28</span>
                    </div>
                    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand-accent/30">
                      <p className="text-sm font-bold text-ink dark:text-brand-secondary transition-colors">워드프로세서 국가공인자격 취득</p>
                      <span className="text-[10px] font-mono bg-brand-accent/5 dark:bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded transition-colors">2023.01.20</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="mb-20 scroll-mt-16 md:mb-32 lg:mb-40">
              <div className="flex items-center gap-4 mb-8 lg:mb-12">
                <div className="flex items-center gap-2 bg-brand-accent/5 dark:bg-brand-accent/10 px-4 py-2 rounded-full border border-brand-accent/10 dark:border-brand-accent/20">
                  <Book size={14} className="text-brand-accent" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent font-sans">Major Collections</h2>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-accent/20 to-transparent" />
              </div>
              
              <ProjectTimeline projects={projects} />

              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <ProjectCard key={idx} id={`project-${idx}`} project={project} onImageClick={setZoomedImage} />
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="mb-20 scroll-mt-16 md:mb-32 lg:mb-40">
              <div className="flex items-center gap-4 mb-8 lg:mb-12">
                <div className="flex items-center gap-2 bg-brand-accent/5 dark:bg-brand-accent/10 px-4 py-2 rounded-full border border-brand-accent/10 dark:border-brand-accent/20">
                  <Mail size={14} className="text-brand-accent" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent font-sans">Reference Services</h2>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-accent/20 to-transparent" />
              </div>
              
              <div className="bg-brand-primary p-12 text-[#f5f2ed] rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8d6e63]/10 blur-3xl" />
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-accent italic mb-6">Reference Services are Open.</h3>
                  <p className="text-lg font-serif italic opacity-60 mb-10 max-w-sm">
                    지식과 기록의 가치를 나누고 싶은 모든 분께 이 자리는 언제나 열려 있습니다. 
                    함께 소통하며 정보의 바다를 나아가실 분의 연락을 기다립니다.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                    <a href="tel:010-7755-8362" className="group/contact max-w-full">
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2 font-mono">Telephone</p>
                      <div className="text-base md:text-lg font-accent group-hover/contact:text-brand-accent transition-colors whitespace-nowrap">
                        010-7755-8362
                      </div>
                    </a>
                    <a href="mailto:amazingalex@naver.com" className="group/contact max-w-full">
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2 font-mono">Email Dispatch</p>
                      <div className="text-base md:text-lg font-accent group-hover/contact:text-brand-accent transition-colors whitespace-nowrap">
                        amazingalex@naver.com
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <footer className="pb-16 text-center border-t border-ink/10 dark:border-brand-secondary/10 pt-16">
              <div className="flex justify-center gap-4 mb-4 text-ink/20 dark:text-brand-secondary/20">
                <Library size={24} />
                <BookOpen size={24} />
                <History size={24} />
              </div>
              <p className="text-xs font-mono text-ink/40 dark:text-brand-secondary/40 uppercase tracking-widest mb-2 font-sans">
                Sunghyun Chang | Librarian & Knowledge Information Expert © 2026
              </p>
              <p className="text-[10px] font-serif italic text-ink/30 dark:text-brand-secondary/30">
                "Connecting people, preserving heritage, and architecting knowledge."
              </p>
            </footer>
          </main>
        </div>
      </div>

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-8 left-8 z-[90] p-3 rounded-full bg-brand-primary text-[#f5f2ed] shadow-2xl border border-brand-accent/20 hover:bg-brand-accent transition-all group"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          <Sun size={24} className="group-hover:rotate-90 transition-transform duration-500 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" />
        ) : (
          <Moon size={24} className="group-hover:-rotate-12 transition-transform duration-500 text-brand-secondary" />
        )}
      </button>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[90] p-3 rounded-full bg-brand-primary text-[#f5f2ed] shadow-2xl border border-brand-accent/20 hover:bg-brand-accent transition-all group"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/95 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
            onClick={() => setZoomedImage(null)}
          >
            <motion.button
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <X size={40} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center overflow-hidden rounded-lg shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={zoomedImage?.startsWith('http') ? zoomedImage : `${import.meta.env.BASE_URL}${zoomedImage?.startsWith('/') ? zoomedImage.slice(1) : zoomedImage}`}
                alt="Zoomed view"
                className="max-w-full max-h-[90vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


