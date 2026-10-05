import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Code2, BookOpen, Lightbulb, Play, RotateCcw, Terminal, X } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';
import { lessons, type Course } from '@/lib/lessons';
import { makeRunner } from '@/lib/runner';

type Log = { kind: string; text: string };
export function LessonWorkspace() {
  const [course, setCourse] = useState<Course>('javascript');
  const [lessonIndex, setLessonIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [hint, setHint] = useState(false);
  const [output, setOutput] = useState('');
  const [logs, setLogs] = useState<Log[]>([]);
  const [outputTab, setOutputTab] = useState('preview');
  const [hasRun, setHasRun] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);
  const runId = useRef(0);
  const editor = useRef<HTMLTextAreaElement>(null);
  const lesson = lessons[course][lessonIndex] ?? lessons[course][0];
  const key = `${course}-${lesson.id}`;
  const code = drafts[key] ?? lesson.code;
  const done = completed.includes(key);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== iframe.current?.contentWindow) return;
      const data = event.data;
      if (data?.type !== 'lesson-console' || data.runId !== runId.current || typeof data.text !== 'string' || !['log', 'warn', 'error'].includes(data.kind)) return;
      setLogs(previous => [...previous.slice(-149), { kind: data.kind, text: data.text.slice(0, 3000) }]);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  function clearOutput() { runId.current += 1; setOutput(''); setLogs([]); setHasRun(false); setHint(false); }
  function switchLesson(index: number) { setLessonIndex(index); clearOutput(); }
  function run() {
    setLogs([]); setHasRun(true); runId.current += 1;
    try { setOutput(makeRunner(code, course, runId.current)); }
    catch (error) { setOutput(''); setLogs([{ kind: 'error', text: error instanceof Error ? error.message : String(error) }]); setOutputTab('console'); }
  }
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/" aria-label="Scriptroom home"><span className="brand-mark"><Code2 size={22}/></span><span>scriptroom<span className="brand-period">.</span></span></a>
        <span className="header-caption">A little practice. A lot of possibility.</span>
        <span className="header-label"><span className="status-dot"/>YOUR LEARNING SPACE</span>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-heading"><span className="eyebrow">THE CURRICULUM</span><BookOpen size={15}/></div>
          <Tabs.Root value={course} onValueChange={value => { setCourse(value as Course); switchLesson(0); }}>
            <Tabs.List className="course-tabs" aria-label="Choose a course"><Tabs.Trigger value="javascript">JavaScript</Tabs.Trigger><Tabs.Trigger value="react">React</Tabs.Trigger></Tabs.List>
          </Tabs.Root>
          <div className="course-intro"><h2>{course === 'javascript' ? 'The foundations' : 'Thinking in React'}</h2><p>{course === 'javascript' ? 'Start small. Build something real.' : 'Build interfaces, one piece at a time.'}</p></div>
          <nav className="lesson-nav" aria-label="Curriculum">{lessons[course].map((item, index) => <Button key={item.id} variant="ghost" className={`lesson-nav-item ${index === lessonIndex ? 'selected' : ''}`} onClick={() => switchLesson(index)}><span className="lesson-number">{completed.includes(`${course}-${item.id}`) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span>{item.title}</span>{index === lessonIndex && <span className="active-dot"/>}</Button>)}</nav>
          <div className="course-progress"><div><span>Your progress</span><span>{completed.filter(id => id.startsWith(course)).length} / 5</span></div><progress max={5} value={completed.filter(id => id.startsWith(course)).length}/><p>One lesson closer to “I built that.”</p></div>
          <div className="sidebar-note"><span className="small-code">&lt;/&gt;</span><p>You don’t have to know it all.<br/>Just keep showing up.</p><span className="gold-rule"/></div>
          <div className="sidebar-bottom">MADE FOR THE CURIOUS.</div>
        </aside>
        <main className="main-workspace">
          <div className="page-heading"><div className="breadcrumb">Your classroom <span>/</span> {course === 'javascript' ? 'JavaScript' : 'React'}</div><span className="level-label">BEGINNER <span>•</span> 5 LESSONS</span></div>
          <div className="welcome"><span className="eyebrow">LEARN. TINKER. REPEAT.</span><h1>{course === 'javascript' ? 'JavaScript, one step at a time.' : 'React, one component at a time.'}</h1><p>A few clear ideas, a little code, and room to make it your own.</p></div>
          <Tabs.Root value={lesson.id} onValueChange={id => switchLesson(lessons[course].findIndex(item => item.id === id))}>
            <Tabs.List className="lesson-tabs" aria-label="Lesson tabs">{lessons[course].map((item, index) => <Tabs.Trigger key={item.id} value={item.id}><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</Tabs.Trigger>)}</Tabs.List>
            <Tabs.Content value={lesson.id} className="lesson-content">
              <div className="lesson-copy">
                <div className="lesson-title-row"><span className="lesson-badge">LESSON {String(lessonIndex + 1).padStart(2, '0')}</span><span className="reading-time">~ 5 min</span></div>
                <h2>{lesson.title}</h2><p className="lesson-subtitle">{lesson.subtitle}</p><p className="lesson-description">{lesson.description}</p>
                <h3 className="section-label">THE BIG IDEAS</h3><div className="concepts">{lesson.concepts.map((concept, index) => <div className="concept" key={concept.title}><span className="concept-number">{index + 1}</span><div><h4>{concept.title}</h4><p>{concept.text}</p></div></div>)}</div>
                <div className="challenge"><div className="challenge-heading"><Lightbulb size={17}/><h3>Make it yours</h3></div><p>{lesson.challenge}</p><Button variant="link" onClick={() => setHint(!hint)} className="hint-button">{hint ? 'Hide hint' : 'A little hint'}<ChevronDown size={13}/></Button>{hint && <p className="hint-text">{lesson.hint}</p>}</div>
              </div>
              <div className="runner">
                <div className="editor-header"><span><Code2 size={15}/>{course === 'javascript' ? 'index.js' : 'App.jsx'}</span><div><Button variant="ghost" size="icon" className="editor-reset" title="Reset code" aria-label="Reset code" onClick={() => { setDrafts(previous => ({ ...previous, [key]: lesson.code })); clearOutput(); }}><RotateCcw size={15}/></Button><Button onClick={run} size="sm" className="run-button"><Play size={13} fill="currentColor"/>Run code</Button></div></div>
                <div className="code-editor"><div className="line-numbers" aria-hidden="true">{code.split('\n').map((_, index) => <div key={index}>{index + 1}</div>)}</div><textarea ref={editor} aria-label="Lesson code editor" value={code} spellCheck={false} onChange={event => setDrafts(previous => ({ ...previous, [key]: event.target.value }))} onScroll={event => { const numbers = event.currentTarget.previousElementSibling; if (numbers) numbers.scrollTop = event.currentTarget.scrollTop; }} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); run(); } if (event.key === 'Tab') { event.preventDefault(); const start = event.currentTarget.selectionStart; const end = event.currentTarget.selectionEnd; setDrafts(previous => ({ ...previous, [key]: code.slice(0, start) + '  ' + code.slice(end) })); requestAnimationFrame(() => editor.current?.setSelectionRange(start + 2, start + 2)); } }}/></div>
                <div className="editor-footer"><span>{course === 'javascript' ? 'JavaScript' : 'JavaScript · JSX'}</span><span>UTF-8</span></div>
                <Tabs.Root value={outputTab} onValueChange={setOutputTab} className="output-area"><div className="output-toolbar"><Tabs.List aria-label="Code output" className="output-tabs"><Tabs.Trigger value="preview">Preview</Tabs.Trigger><Tabs.Trigger value="console"><Terminal size={13}/>Console{logs.length > 0 && <span className="log-count">{logs.length}</span>}</Tabs.Trigger></Tabs.List><span className="output-status"><span className={`status-dot ${hasRun ? 'has-run' : ''}`}/>{hasRun ? 'Executed' : 'Ready to run'}</span></div>
                  <Tabs.Content value="preview" forceMount hidden={outputTab !== 'preview'} className="preview-panel">{output ? <iframe ref={iframe} title="Code preview" sandbox="allow-scripts" srcDoc={output}/> : <div className="output-empty"><span className="empty-play"><Play size={18}/></span><p>A blank canvas, for now.</p><span>Your next idea starts with a little code.</span></div>}</Tabs.Content>
                  <Tabs.Content value="console" className="console-panel"><div className="console-title"><span>CONSOLE OUTPUT</span><Button variant="ghost" size="icon" aria-label="Clear console" title="Clear console" onClick={() => setLogs([])}><X size={14}/></Button></div>{logs.length ? logs.map((log, index) => <pre key={index} className={`console-line ${log.kind}`}>{log.kind === 'error' ? '×' : '›'} {log.text}</pre>) : <p className="console-empty">{hasRun ? 'No messages logged.' : 'Your console messages will appear here.'}</p>}</Tabs.Content>
                </Tabs.Root>
              </div>
            </Tabs.Content>
          </Tabs.Root>
          <div className="lesson-bottom"><Button variant="ghost" disabled={lessonIndex === 0} onClick={() => switchLesson(lessonIndex - 1)}><ArrowLeft/>Previous lesson</Button><Button variant={done ? 'secondary' : 'outline'} onClick={() => setCompleted(previous => done ? previous.filter(id => id !== key) : [...previous, key])}><Check/>{done ? 'Completed' : 'Mark as complete'}</Button><Button variant="ghost" disabled={lessonIndex === 4} onClick={() => switchLesson(lessonIndex + 1)}>Next lesson<ArrowRight/></Button></div>
          <footer className="workspace-footer"><span>Small steps. Real progress.</span><span>NO RUSH. JUST YOU & THE CODE.</span></footer>
        </main>
      </div>
    </div>
  );
}
