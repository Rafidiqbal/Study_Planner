const subjects = JSON.parse(localStorage.getItem("subjects")) || {
  "Physics": Array.from({ length: 10 }, (_, i) => ({ name: `Topic ${i + 1}`, done: 0, total: 10 })),
  "Chemistry": Array.from({ length: 10 }, (_, i) => ({ name: `Topic ${i + 1}`, done: 0, total: 10 })),
  "Biology": Array.from({ length: 10 }, (_, i) => ({ name: `Topic ${i + 1}`, done: 0, total: 10 })),
  "Higher Math": Array.from({ length: 10 }, (_, i) => ({ name: `Topic ${i + 1}`, done: 0, total: 10 }))
};

const subjectsEl = document.getElementById("subjects");
const addSubjectBtn = document.getElementById("addSubjectBtn");

function saveData() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

function pct(done, total) {
  return total > 0 ? (done / total) * 100 : 0;
}

function updateUI() {
  subjectsEl.innerHTML = "";

  let allDone = 0, allTotal = 0;

  Object.keys(subjects).forEach((subjectName) => {
    const topicList = subjects[subjectName];

    const totalDone = topicList.reduce((a, t) => a + t.done, 0);
    const totalAll = topicList.reduce((a, t) => a + t.total, 0);
    allDone += totalDone;
    allTotal += totalAll;

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
        topicList.push({ name: name.trim(), done: 0, total: 10 });
        updateUI();
      }
    };

    headerBtns.appendChild(addTopicBtn);
    headerBtns.appendChild(delBtn);
    header.appendChild(headerBtns);
    subDiv.appendChild(header);

    // Subject progress bar
    const subProgBar = document.createElement("div");
    subProgBar.className = "progress-bar";
    const subProg = document.createElement("div");
    subProg.className = "progress";
    subProg.style.width = pct(totalDone, totalAll) + "%";
    subProgBar.appendChild(subProg);
    subDiv.appendChild(subProgBar);

    // Topics
    topicList.forEach((topic, idx) => {
      const topicDiv = document.createElement("div");
      topicDiv.className = "topic";

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
      subDiv.appendChild(topicDiv);
    });

    subjectsEl.appendChild(subDiv);
  });

  // Overall progress
  const overall = document.getElementById("overall-progress");
  overall.style.width = (allTotal > 0 ? (allDone / allTotal) * 100 : 0) + "%";

  saveData();
}

// Add Subject (toolbar)
addSubjectBtn.onclick = () => {
  const name = prompt("Enter new subject name:");
  if (name) {
    const clean = name.trim();
    if (!clean) return;
    if (!subjects[clean]) {
      subjects[clean] = [{ name: "Topic 1", done: 0, total: 10 }];
      updateUI();
    } else {
      alert("Subject already exists.");
    }
  }
};

updateUI();
