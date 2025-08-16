const subjects = JSON.parse(localStorage.getItem("subjects")) || {
"Physics": Array.from({ length: 10 }, (, i) => ({ name: Topic ${i + 1}, done: 0, total: 10, subtopics: [] })),
"Chemistry": Array.from({ length: 10 }, (, i) => ({ name: Topic ${i + 1}, done: 0, total: 10, subtopics: [] })),
"Biology": Array.from({ length: 10 }, (, i) => ({ name: Topic ${i + 1}, done: 0, total: 10, subtopics: [] })),
"Higher Math": Array.from({ length: 10 }, (, i) => ({ name: Topic ${i + 1}, done: 0, total: 10, subtopics: [] }))
};

const subjectsEl = document.getElementById("subjects");
const addSubjectBtn = document.getElementById("addSubjectBtn");

function saveData() {
localStorage.setItem("subjects", JSON.stringify(subjects));
}

function pct(done, total) {
return total > 0 ? (done / total) * 100 : 0;
}

function toggleSubtopics(topicElement) {
const topic = topicElement.topicData;
if (!topic.subtopics) topic.subtopics = [];
const container = topicElement.subContainer;
container.style.display = container.style.display === "none" || container.style.display === "" ? "block" : "none";
}

function updateOverallProgress() {
let allDone = 0, allTotal = 0;
Object.values(subjects).forEach(topicList => {
topicList.forEach(topic => {
allDone += topic.done;
allTotal += topic.total;
});
});
const percent = allTotal > 0 ? (allDone / allTotal) * 100 : 0;

const circle = document.querySelector(".progress-circle .progress");
const text = document.getElementById("progressText");
const radius = 15.9155;
const dash = (percent / 100) * 2 * Math.PI * radius;
circle.setAttribute("stroke-dasharray", ${dash}, 100);
text.textContent = ${Math.round(percent)}%;
}

function updateUI() {
subjectsEl.innerHTML = "";

Object.keys(subjects).forEach(subjectName => {
const topicList = subjects[subjectName];

const subDiv = document.createElement("div");  
subDiv.className = "subject";  

const header = document.createElement("h2");  
header.innerHTML = `<span>${subjectName}</span>`;  
const headerBtns = document.createElement("span");  
headerBtns.className = "actions";  

const delBtn = document.createElement("button");  
delBtn.textContent = "❌ Delete Subject";  
delBtn.onclick = () => {  
  if (confirm(`Delete subject "${subjectName}"?`)) {  
    delete subjects[subjectName];  
    updateUI();  
  }  
};  

const addTopicBtn = document.createElement("button");  
addTopicBtn.textContent = "➕ Topic";  
addTopicBtn.onclick = () => {  
  const name = prompt("Enter topic name:");  
  if (name) {  
    topicList.push({ name: name.trim(), done: 0, total: 10, subtopics: [] });  
    updateUI();  
  }  
};  

headerBtns.appendChild(addTopicBtn);  
headerBtns.appendChild(delBtn);  
header.appendChild(headerBtns);  
subDiv.appendChild(header);  

// Subject progress bar  
const totalDone = topicList.reduce((a, t) => a + t.done, 0);  
const totalAll = topicList.reduce((a, t) => a + t.total, 0);  
const subProgBar = document.createElement("div");  
subProgBar.className = "progress-bar";  
const subProg = document.createElement("div");  
subProg.className = "progress";  
subProg.style.width = pct(totalDone, totalAll) + "%";  
subProgBar.appendChild(subProg);  
subDiv.appendChild(subProgBar);  

// Topics with toggleable subtopics  
topicList.forEach((topic, idx) => {  
  const topicDiv = document.createElement("div");  
  topicDiv.className = "topic";  
  topicDiv.topicData = topic; // link data  
  const title = document.createElement("div");  
  title.className = "topic-title";  
  title.textContent = `${topic.name} (${topic.done}/${topic.total})`;  

  const bar = document.createElement("div");  
  bar.className = "progress-bar";  
  const barInner = document.createElement("div");  
  barInner.className = "progress";  
  barInner.style.width = pct(topic.done, topic.total) + "%";  
  bar.appendChild(barInner);  

  const btns = document.createElement("div");  
  btns.className = "actions";  

  const editProgressBtn = document.createElement("button");  
  editProgressBtn.textContent = "✏️ Progress";  
  editProgressBtn.onclick = () => {  
    const val = parseInt(prompt(`Enter completed lectures for "${topic.name}":`, String(topic.done)), 10);  
    if (!Number.isNaN(val) && val >= 0 && val <= topic.total) {  
      topic.done = val;  
      updateUI();  
    }  
  };  

  const renameBtn = document.createElement("button");  
  renameBtn.textContent = "✏️ Name";  
  renameBtn.onclick = () => {  
    const newName = prompt(`Enter new name for "${topic.name}":`, topic.name);  
    if (newName && newName.trim() !== "") {  
      topic.name = newName.trim();  
      updateUI();  
    }  
  };  

  const editTotalBtn = document.createElement("button");  
  editTotalBtn.textContent = "✏️ Total";  
  editTotalBtn.onclick = () => {  
    const newTotal = parseInt(prompt(`Enter total lectures for "${topic.name}":`, String(topic.total)), 10);  
    if (!Number.isNaN(newTotal) && newTotal > 0) {  
      if (topic.done > newTotal) topic.done = newTotal;  
      topic.total = newTotal;  
      updateUI();  
    }  
  };  

  const deleteBtn = document.createElement("button");  
  deleteBtn.textContent = "❌";  
  deleteBtn.onclick = () => {  
    if (confirm("Delete this topic?")) {  
      topicList.splice(idx, 1);  
      updateUI();  
    }  
  };  

  btns.appendChild(editProgressBtn);  
  btns.appendChild(renameBtn);  
  btns.appendChild(editTotalBtn);  
  btns.appendChild(deleteBtn);  

  topicDiv.appendChild(title);  
  topicDiv.appendChild(bar);  
  topicDiv.appendChild(btns);  

  // Subtopics container  
  const subContainer = document.createElement("div");  
  subContainer.className = "subtopics-container";  
  subContainer.style.display = "none";  
  topic.subtopics.forEach(sub => {  
    const subDiv = document.createElement("div");  
    subDiv.className = "subtopic";  
    subDiv.textContent = sub;  
    subContainer.appendChild(subDiv);  
  });  
  topicDiv.subContainer = subContainer;  
  topicDiv.onclick = (e) => {  
    if (e.target === topicDiv || e.target === title) toggleSubtopics(topicDiv);  
  };  

  topicDiv.appendChild(subContainer);  
  subDiv.appendChild(topicDiv);  
});  

subjectsEl.appendChild(subDiv);

});

saveData();
updateOverallProgress();
}

// Add Subject (toolbar)
addSubjectBtn.onclick = () => {
const name = prompt("Enter new subject name:");
if (name) {
const clean = name.trim();
if (!clean) return;
if (!subjects[clean]) {
subjects[clean] = [{ name: "Topic 1", done: 0, total: 10, subtopics: [] }];
updateUI();
} else {
alert("Subject already exists.");
}
}
};

updateUI();

  
