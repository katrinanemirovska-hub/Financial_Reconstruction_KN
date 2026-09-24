"use client";
import {euro, submission, type Decision} from "../lib/case-data";
import presentation from "../lib/decision-presentation.json";

const labels = ["Management workbook","August bank export","CRM export","Contracts & customer evidence","Warehouse count","Purchases & goods received","Payroll records","Asset records","Loan & legal evidence","Email & WhatsApp evidence","Post-takeover evidence"];
const ppeMovements:Record<string,number>={D043:60000,D044:20000,D056:-24000,D074:-24000};
export function EvidenceChips({d}:{d:Decision}){
 const files=d.evidence;
 return <section className="supporting-evidence"><h4>Supporting evidence</h4><div className="chips">{files.map((file:string)=>{const i=submission.evidence.indexOf(file);return <span key={file} title={file}>{i>=0?`E${String(i+1).padStart(2,"0")} · ${labels[i]}`:file}</span>})}</div></section>;
}
function status(d:Decision){const n=Number(d.id.slice(1));if(n>=14&&n<=21)return "Evidence limitation";if([34,60,78,89].includes(n))return "Unresolved";if(n===83)return "Estimate";if(n>=92&&n<=99)return "Control action";return "Resolved";}
export default function DecisionCard({d,material}:{d:Decision;material:boolean}){
 const p=presentation[d.id as keyof typeof presentation];
 const ppe=ppeMovements[d.id];
 const title=d.question.replace(/^(Resolve the source and treatment of |Classify |Estimate )/,"").replace(/ and document the basis\.$/,"").replace(/\.$/,"");
 const short=d.id==="D006"?"€270k revenue · €250k collected · €20k receivable":d.answer.match(/€[\d,]+/g)?.filter((v:string,i:number,a:string[])=>a.indexOf(v)===i).slice(0,4).join(" · ");
 return <details className={material?"decision material":"decision operational"} id={d.id} data-decision={d.id}>
 <summary><div><b>{d.id}</b><strong>{title}</strong>{!material&&short&&<small>{short}</small>}</div><div className="badges"><i className={material?"cert":"status-badge"}>{material?"Student Certified":status(d)}</i><i className={d.confidence}>{d.confidence}</i>{material&&["D048","D075","D091","D100"].includes(d.id)&&<i className="warn">Agent disagreement</i>}{material&&d.changedFromAI&&<i className="warn">Changed from Agent 1</i>}</div></summary>
 <div className="decision-body">{material?<>
 <div className="trail"><article className="agent1"><h4>Agent 1</h4><p>{p.agent1}</p></article><article className="agent2"><h4>Agent 2</h4><p>{p.agent2}</p></article></div>
 <article className="student"><h4>My decision</h4><p>{d.answer}</p></article>
 <section className="reason"><h4>My reasoning</h4><p>{d.studentReasoning||p.reasoning}</p></section>
 {p.calculation&&<section className="calculation"><h4>Calculation</h4><p>{p.calculation}</p></section>}
 {['D043','D044'].includes(d.id)&&<section className="effect-note"><h4>Account movement</h4><p>Cash {(d.statementEffect?.cash||0)>0?'+':''}{euro(d.statementEffect?.cash||0)}; PPE +{euro(ppe)}. The purchase exchanges cash for PPE, so net total assets are unchanged at acquisition.</p></section>}
 {d.id==='D075'&&<section className="effect-note"><h4>Closing inventory balance</h4><p>€112,000 is the reconstructed closing inventory balance, not an incremental financial-statement movement created by D075.</p></section>}
 {d.id==='D091'&&<section className="effect-note"><h4>Recommendation only</h4><p>No incremental accounting effect — recommendation only.</p></section>}
 <section className="financial-effect"><h4>{['D043','D044'].includes(d.id)?'Net financial effect at acquisition':'Financial effect'}</h4><div className="effect">{Object.entries(d.statementEffect || {}).flatMap(([k,v])=>{const entry=<span key={k}><small>{k==='assets'?'Total assets':k}</small><b>{(v as number)>0?'+':''}{euro(v as number)}</b></span>;return k==='cash'&&ppe!==undefined?[entry,<span key="ppe"><small>PPE / net PPE</small><b>{ppe>0?'+':''}{euro(ppe)}</b></span>]:[entry]})}</div></section>
 <EvidenceChips d={d}/>
 </>:<><section><h4>Certified treatment</h4><p>{d.answer}</p></section><EvidenceChips d={d}/></>}</div>
 </details>;
}
