let evidence = [];

let custody = [];



// LOAD DATA
let saved =
localStorage.getItem(
"evidenceData"
);

if(saved){

evidence =
JSON.parse(saved);

}


let savedCustody =
localStorage.getItem(
"custodyData"
);

if(savedCustody){

custody =
JSON.parse(
savedCustody
);

}



// NAVIGATION
function showPage(id){

document
.querySelectorAll(
"section"
)
.forEach(
s=>
s.classList.add(
"hidden"
)
);

document
.getElementById(id)
.classList.remove(
"hidden"
);

}

window.showPage =
showPage;




// ADD EVIDENCE
window.addEvidence =
function(){

let caseInput =
document.getElementById(
"caseId"
);

let typeInput =
document.getElementById(
"type"
);

let descInput =
document.getElementById(
"desc"
);

let photo = "";

let file =

document
.getElementById(
"photo"
)
.files[0];

let item={

evidenceId:

"EVID-" +

(
1000 +
evidence.length +
1
),

case:

caseInput.value,

type:

typeInput.value,

officer:

document
.getElementById(
"officer"
).value,

date:

document
.getElementById(
"date"
).value,

status:

document
.getElementById(
"status"
).value,
 photo:photo,
desc:

descInput.value

};



if(
!item.case
||
!item.type
){

alert(
"Fill all fields"
);

return;

}

if(file){

let reader =
new FileReader();

reader.onload =
function(){

item.photo =
reader.result;

evidence.push(
item
);

localStorage.setItem(

"evidenceData",

JSON.stringify(
evidence
)

);

render();

alert(
"Evidence Saved"
);

};

reader.readAsDataURL(
file
);

}

else{

item.photo =
"";

evidence.push(
item
);

localStorage.setItem(

"evidenceData",

JSON.stringify(
evidence
)

);

render();

alert(
"Evidence Saved"
);

}

caseInput.value="";
typeInput.value="";
descInput.value="";

document.getElementById(
"officer"
).value="";

document.getElementById(
"date"
).value="";



alert(
"Evidence Saved"
);

};




// RENDER
function render(){

let box=

document.getElementById(
"records"
);

if(!box)
return;

box.innerHTML=
"";



evidence.forEach(
(e,index)=>{

box.innerHTML+=`

<div
class="record"
onclick=
"showDetails(${index})">

<h3>

${e.evidenceId}

</h3>

${
e.photo

?

`<img
src="${e.photo}"
width="150">`

:

""

}

<p>

Case:
${e.case}

</p>

<p>

Type:
${e.type}

</p>

<p>

Officer:
${e.officer || "Not Assigned"}

</p>

<p>

Date:
${e.date || "-"}

</p>

<p>

Status:
${e.status}

</p>

<div class="progress">

<div
class="fill"

style="width:${getProgress(
e.status
)}%">

</div>

</div>

</div>

`;

});



let count1=

document.getElementById(
"caseCount"
);

let count2=

document.getElementById(
"evidenceCount"
);



if(count1)
count1.innerText=
evidence.length;



if(count2)
count2.innerText=

evidence.filter(
e=>

e.status
!=="Archived"

).length;

let archived =

document.getElementById(
"archivedCount"
);

if(archived){

archived.innerText =

evidence.filter(
e=>

e.status===

"Archived"

).length;

}



let verified =

document.getElementById(
"verifiedCount"
);

if(verified){
    let investigation =

document.getElementById(
"investigationCount"
);



if(investigation){

investigation.innerText =

evidence.filter(
e=>

e.status
&&
(

e.status
.toLowerCase()

===

"collected"

||

e.status
.toLowerCase()

===

"in lab"

)

).length;

}
verified.innerText =

evidence.filter(
e=>

e.status===

"Verified"

).length;

}

}




// DETAILS
window.showDetails=
function(i){

let box=

document.getElementById(
"detailsBox"
);



box.innerHTML=`

<h2>

${evidence[i].evidenceId}

</h2>

<p>

${
evidence[i].photo

?

`<img
src="${evidence[i].photo}"
width="250">`

:

""

}

Case:
${evidence[i].case}

</p>

<p>

Type:
${evidence[i].type}

</p>

<p>

Officer:
${evidence[i].officer}

</p>

<p>

Date:
${evidence[i].date}

</p>

<p>

Status:
${evidence[i].status}

</p>

<p>

${evidence[i].desc}

</p>

<button
onclick=
"archiveCase(${i})">

Archive

</button>

<button
onclick=
"deleteCase(${i})">

Delete

</button>

`;

showPage(
"details"
);

};




// ARCHIVE
window.archiveCase=
function(i){

evidence[i].status=
"Archived";

localStorage.setItem(

"evidenceData",

JSON.stringify(
evidence
)

);

render();

alert(
"Archived"

);

};




// DELETE
window.deleteCase=
function(i){

if(
confirm(
"Delete?"
)
){

evidence.splice(
i,
1
);

localStorage.setItem(

"evidenceData",

JSON.stringify(
evidence
)

);

render();

showPage(
"list"
);

}

};




// SEARCH
window.searchEvidence=
function(){

let value=

document
.getElementById(
"searchBox"
)
.value
.toLowerCase();



let box=

document
.getElementById(
"records"
);

box.innerHTML=
"";



evidence

.filter(
e=>

e.case

.toLowerCase()

.includes(
value
)

)

.forEach(
(e,index)=>{

box.innerHTML+=`

<div
class="record"
onclick=
"showDetails(${index})">

<h3>

${e.evidenceId}

</h3>

<p>

${e.type}

</p>

</div>

`;

});

};




// ARCHIVED
window.showArchived=
function(){

showPage(
"archived"
);

let box=

document.getElementById(
"archivedBox"
);

box.innerHTML=
"";



evidence

.filter(
e=>

e.status
===

"Archived"

)

.forEach(
e=>{

box.innerHTML+=`

<div
class="record">

<h3>

${e.evidenceId}

</h3>

<p>

${e.case}

</p>

</div>

`;

});

};

// CUSTODY
window.addCustody=
function(){

custody.push({

officer:

document
.getElementById(
"custodyOfficer"
).value,

action:

document
.getElementById(
"action"
).value,

time:

new Date()
.toLocaleString()

});



localStorage.setItem(

"custodyData",

JSON.stringify(
custody
)

);



renderCustody();

};

// EXPORT
window.exportData=
function(){

let csv=

"Evidence ID,Case,Type,Officer,Date,Status,Description\n";



evidence.forEach(
e=>{

csv+=

`${e.evidenceId},
${e.case},
${e.type},
${e.officer},
${e.date},
${e.status},
${e.desc}\n`;

});



let blob=

new Blob(
[csv],
{
type:
"text/csv"
}
);



let url=

URL.createObjectURL(
blob
);



let a=

document.createElement(
"a"
);



a.href=
url;

a.download=
"evidence-report.csv";

a.click();

};



render();
renderCustody();

showPage(
"dashboard"
);


function getProgress(
status
){

if(
status==="Collected"
)
return 25;

if(
status==="In Lab"
)
return 50;

if(
status==="Verified"
)
return 100;

if(
status==="Archived"
)
return 100;

return 0;

}