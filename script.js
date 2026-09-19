const key="campusfix_issues";
const form=document.getElementById("issueForm");
const list=document.getElementById("issues");
const total=document.getElementById("totalIssues");
const clearBtn=document.getElementById("clearBtn");

let issues=JSON.parse(localStorage.getItem(key)||"[]");

function classify(text){
  const t=text.toLowerCase();
  let category="General";
  if(/water|leak|tap|toilet|washroom|drain/.test(t)) category="Water & Sanitation";
  else if(/light|electric|fan|ac|power|socket|wire/.test(t)) category="Electrical";
  else if(/clean|garbage|dust|waste|dirty/.test(t)) category="Cleanliness";
  else if(/security|unsafe|fight|theft|gate|camera/.test(t)) category="Security";
  else if(/wifi|internet|network|computer|lab/.test(t)) category="IT & Network";
  let priority="Low";
  if(/danger|fire|spark|shock|theft|unsafe|flood|broken pipe/.test(t)) priority="High";
  else if(/leak|not working|blocked|urgent|dark|wifi/.test(t)) priority="Medium";
  return {category,priority};
}

function save(){localStorage.setItem(key,JSON.stringify(issues)); render();}
function render(){
  total.textContent=issues.length;
  if(!issues.length){list.innerHTML='<div class="empty">No issues yet. Submit the first campus issue above.</div>';return;}
  list.innerHTML=issues.slice().reverse().map(i=>`
    <div class="issue">
      <div class="issue-top">
        <div><h3>${escapeHtml(i.title)}</h3><div class="meta">${escapeHtml(i.location)} · Reported by ${escapeHtml(i.name)}</div></div>
        <span class="badge ${i.priority.toLowerCase()}">${i.priority} priority</span>
      </div>
      <p>${escapeHtml(i.description)}</p>
      <div class="meta">Category: <b>${i.category}</b> · Status: <b>${i.status}</b></div>
      <div class="status">
        <button onclick="updateStatus('${i.id}','In Progress')">Start work</button>
        <button onclick="updateStatus('${i.id}','Resolved')">Mark resolved</button>
      </div>
    </div>`).join("");
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
form.addEventListener("submit",e=>{
  e.preventDefault();
  const title=document.getElementById("title").value.trim();
  const description=document.getElementById("description").value.trim();
  const {category,priority}=classify(title+" "+description);
  issues.push({id:Date.now().toString(),name:document.getElementById("name").value.trim(),title,description,location:document.getElementById("location").value.trim(),category,priority,status:"Reported"});
  form.reset(); save();
});
window.updateStatus=(id,status)=>{issues=issues.map(i=>i.id===id?{...i,status}:i);save();};
clearBtn.addEventListener("click",()=>{issues=[];save();});
render();
