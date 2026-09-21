"use client";
import Link from "next/link";
import {decisions} from "../../lib/case-data";
import DecisionCard from "../../components/decision-card";
export default function Review(){return <main><header><div className="identity"><p className="eyebrow">Financial Reconstruction · DPI-HT-01</p><h1>DIVORCE PARTY INTERNATIONAL LTD</h1><p>Reporting date: 31 August 2026 · Student: Katrīna Nemirovska</p></div><nav><Link href="/#decisions">Return to decisions</Link></nav></header><section><div className="section-head"><h2>Material judgments</h2><p>25 student-certified reviews</p></div><div className="decision-list">{decisions.filter((d)=>d.reviewTier==="material_judgment").map((d)=><DecisionCard d={d} material key={d.id}/>)}</div></section><footer>Final conclusions personally reviewed and certified by the student. <a href="/submission.json">Submission JSON</a></footer></main>}
