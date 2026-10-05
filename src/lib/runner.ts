import { transform } from '@babel/standalone';
import reactRuntime from '../../node_modules/react-sandbox/umd/react.development.js?raw';
import domRuntime from '../../node_modules/react-dom-sandbox/umd/react-dom.development.js?raw';
import type { Course } from './lessons';

const escapeScript = (value: string) => value.replace(/<\/script/gi, '<\\/script');
export function makeRunner(code: string, course: Course, runId: number): string {
  const compiled = transform(code, {
    presets: course === 'react' ? ['react'] : [],
    plugins: [({ types }: any) => ({ visitor: {
      'WhileStatement|ForStatement|DoWhileStatement|ForInStatement|ForOfStatement'(path: any) {
        const check = types.ifStatement(types.binaryExpression('>', types.binaryExpression('-', types.callExpression(types.memberExpression(types.identifier('Date'), types.identifier('now')), []), types.identifier('__started')), types.numericLiteral(1500)), types.throwStatement(types.newExpression(types.identifier('Error'), [types.stringLiteral('Loop stopped: execution exceeded 1.5 seconds.')])));
        if (!types.isBlockStatement(path.node.body)) path.node.body = types.blockStatement([path.node.body]);
        path.node.body.body.unshift(check);
      },
    } })],
  }).code ?? '';
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'"><style>body{font-family:Arial,sans-serif;color:#202020;margin:0;padding:30px;background:#fff}h1{font-size:27px;line-height:1.3;margin:17px 0 12px}h2{font-size:20px;margin:0 0 10px}p,li{font-size:14px;line-height:1.8;color:#666}button{background:#791c26;color:#fff;border:0;border-radius:4px;padding:12px 19px;cursor:pointer;font-size:14px}.badge{font-size:10px;letter-spacing:1px;color:#791c26}.tile{border:1px solid #e5e5e5;padding:18px;margin-bottom:12px;border-radius:4px}</style></head><body><div id="root"></div><script>
const __runId=${runId};let __logs=0;const __send=(kind,values)=>{if(__logs++>150)return;parent.postMessage({type:'lesson-console',runId:__runId,kind,text:values.map(v=>{try{return typeof v==='string'?v:JSON.stringify(v)}catch{return String(v)}}).join(' ')},'*')};
console.log=(...v)=>__send('log',v);console.warn=(...v)=>__send('warn',v);console.error=(...v)=>__send('error',v);window.onerror=(message)=>{__send('error',[message]);return true};window.onunhandledrejection=e=>__send('error',[String(e.reason)]);
</script>${course === 'react' ? `<script>${escapeScript(reactRuntime)}</script><script>${escapeScript(domRuntime)}</script><script>const render=element=>ReactDOM.createRoot(document.getElementById('root')).render(element);</script>` : ''}<script>const __started=Date.now();try{${escapeScript(compiled)}\n}catch(error){console.error(error.message)}</script></body></html>`;
}
