export function validate(model){
 if(!model||!Array.isArray(model.nodes)||model.nodes.length<1||model.nodes.length>150)throw Error('Provide 1–150 nodes.');
 const nodes=new Map();let bytes=0;
 for(const n of model.nodes){
  if(!n||typeof n.id!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(n.id)||nodes.has(n.id))throw Error('Node IDs must be unique, 1–64 letters, numbers, underscores or hyphens.');
  if(typeof n.content!=='string'||n.content.length>100000||typeof n.recipe!=='string'||n.recipe.length>2000||!Array.isArray(n.parents)||n.parents.length>30||!n.parents.every(p=>typeof p==='string')||new Set(n.parents).size!==n.parents.length)throw Error('Invalid content, recipe or parent list.');
  bytes+=n.content.length;if(bytes>1000000)throw Error('Combined content exceeds one million characters.');nodes.set(n.id,n);
 }
 const order=[],active=new Set(),done=new Set();
 function visit(id){if(active.has(id))throw Error('Dependency cycle detected.');if(done.has(id))return;const n=nodes.get(id);if(!n)throw Error(`Missing parent: ${id}`);active.add(id);for(const p of [...n.parents].sort())visit(p);active.delete(id);done.add(id);order.push(id);}
 for(const id of [...nodes.keys()].sort())visit(id);return {nodes,order};
}
export async function sha256(text){const hash=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');}
export async function snapshot(model){
 const {nodes,order}=validate(model),records=new Map();
 for(const id of order){const n=nodes.get(id),parents=[...n.parents].sort();const contentHash=await sha256(n.content);const recipeHash=await sha256(n.recipe);const signature=await sha256(JSON.stringify([id,contentHash,recipeHash,parents.map(p=>[p,records.get(p).signature])]));records.set(id,{id,parents,contentHash,recipeHash,signature});}
 return {schema:1,records:[...records.values()]};
}
export async function compare(model,baseline){
 if(!baseline||baseline.schema!==1||!Array.isArray(baseline.records))throw Error('A version-1 snapshot is required.');
 const current=await snapshot(model),old=new Map(baseline.records.map(n=>[n.id,n])),now=new Map(current.records.map(n=>[n.id,n]));
 const results=current.records.map(n=>{const b=old.get(n.id);if(!b)return {...n,status:'new',reasons:['Not present in baseline']};const reasons=[];
 if(n.contentHash!==b.contentHash)reasons.push('Content changed');if(n.recipeHash!==b.recipeHash)reasons.push('Recipe changed');if(JSON.stringify(n.parents)!==JSON.stringify(b.parents))reasons.push('Dependencies changed');
 const upstream=n.parents.filter(p=>!old.has(p)||now.get(p).signature!==old.get(p).signature);if(upstream.length)reasons.push(`Upstream changed: ${upstream.join(', ')}`);
 return {...n,status:reasons.length?'review':'unchanged',reasons};});
 return {schema:1,results,removed:baseline.records.filter(n=>!now.has(n.id)).map(n=>n.id),reviewOrder:results.filter(n=>n.status!=='unchanged').map(n=>n.id)};
}
