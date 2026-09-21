export const revenue=(sold:number)=>sold*2;
export const milkCost=(tonnes:number)=>tonnes*20000;
export const depreciation=(price:number)=>price/8;
export const gameTax=(pbt:number,pool:number)=>Math.max(0,pbt-pool)*.1;
