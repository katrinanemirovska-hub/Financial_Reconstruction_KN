"use client";
import {euro, submission, type Decision} from "../lib/case-data";
import presentation from "../lib/decision-presentation.json";

const labels = ["Management workbook","August bank export","CRM export","Contracts & customer evidence","Warehouse count","Purchases & goods received","Payroll records","Asset records","Loan & legal evidence","Email & WhatsApp evidence","Post-takeover evidence"];
const materialSources:Record<string,number[]> = {D041:[2,3,4],D042:[2,9],D043:[2,6,8],D044:[2,6,8],D045:[8],D046:[2,9,10],D047:[2,9,10],D048:[5,6],D049:[7],D056:[8],D057:[3,4,11],D058:[5,11],D059:[9,11],D064:[2,3,4],D065:[2,3,4],D066:[2,3,4],D067:[2,3,4],D068:[2,4],D071:[3,4,11],D072:[5,11],D073:[9,11],D074:[8],D075:[5,6],D091:[1,2,5,6,8,9,11],D100:[1,2,4,9,10]};
export function EvidenceChips({d}:{d:Decision}){
 const files=materialSources[d.id]?.map(n=>submission.evidence[n-1])||d.evidence;
 return <section className="supporting-evidence"><h4>Supporting evidence</h4><div className="chips">{files.map((file:string)=>{const i=submission.evidence.indexOf(file);return <span key={file} title={file}>{i>=0?`E${String(i+1).padStart(2,"0")} · ${labels[i]}`:file}</span>})}</div></section>;
}
function status(d:Decision){const n=Number(d.id.slice(1));if(n>=14&&n<=21)return "Evidence limitation";if([34,60,78,89].includes(n))return "Unresolved";if(n===83)return "Estimate";if(n>=92&&n<=99)return "Control action";return "Resolved";}
export default function DecisionCard({d,material}:{d:Decision;material:boolean}){
 const p=presentation[d.id as keyof typeof presentation];
 const title=d.question.replace(/^(Resolve the source and treatment of |Classify |Estimate )/,"").replace(/ and document the basis\.$/,"").replace(/\.$/,"");
 const short=d.id==="D006"?"€270k revenue · €250k collected · €20k receivable":d.answer.match(/€[\d,]+/g)?.filter((v:string,i:number,a:string[])=>a.indexOf(v)===i).slice(0,4).join(" · ");
 return <details className={material?"decision material":"decision operational"} id={d.id} data-decision={d.id}>
 <summary><div><b>{d.id}</b><strong>{title}</strong>{!material&&short&&<small>{short}</small>}</div><div className="badges"><i className={material?"cert":"status-badge"}>{material?"Student Certified":status(d)}</i><i className={d.confidence}>{d.confidence}</i>{material&&["D048","D075","D091","D100"].includes(d.id)&&<i className="warn">Agent disagreement</i>}{material&&d.changedFromAI&&<i className="warn">Changed from Agent 1</i>}</div></summary>
 <div className="decision-body">{material?<>
 <div className="trail"><article className="agent1"><h4>Agent 1</h4><p>{p.agent1}</p></article><article className="agent2"><h4>Agent 2</h4><p>{p.agent2}</p></article></div>
 <article className="student"><h4>My decision</h4><p>{d.answer}</p></article>
 <section className="reason"><h4>My reasoning</h4><p>{p.reasoning}</p></section>
 {p.calculation&&<section className="calculation"><h4>Calculation</h4><p>{p.calculation}</p></section>}
 <section className="financial-effect"><h4>{["D043","D044"].includes(d.id)?"Financial effect at acquisition":"Financial effect"}</h4><div className="effect">{Object.entries(d.statementEffect || {}).map(([k,v])=><span key={k}><small>{k==="assets"&&["D043","D044"].includes(d.id)?"Assets / PPE":k}</small><b>{(v as number)>0?"+":""}{euro(v as number)}</b></span>)}</div></section>
 <EvidenceChips d={d}/>
 </>:<><section><h4>Certified treatment</h4><p>{d.answer}</p></section><EvidenceChips d={d}/></>}</div>
 </details>;
}
