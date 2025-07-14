let applications = JSON.parse(localStorage.getItem("applications")) || [];
let isEditing = false;
let currentEditIndex = null;
let chart = null;

function saveAndRender() {
  localStorage.setItem("applications", JSON.stringify(applications));
  render();
}

function addApplication() {
  const company = document.getElementById("company").value.trim();
  const role = document.getElementById("role").value.trim();
  const link = document.getElementById("link").value.trim();
  const status = document.getElementById("status").value;
  const notes = document.getElementById("notes").value.trim();

  if (!company || !role) {
    alert("Please fill in company and role.");
    return;
  }

  const job = { company, role, link, status, notes };

  if (isEditing) {
    applications[currentEditIndex] = job;
    isEditing = false;
    currentEditIndex = null;
    document.getElementById("addBtn").textContent = "Add";
    document.getElementById("cancelBtn").style.display = "none";
  } else {
    applications.push(job);
  }

  document.getElementById("company").value = "";
  document.getElementById("role").value = "";
  document.getElementById("link").value = "";
  document.getElementById("status").value = "applied";
  document.getElementById("notes").value = "";

  saveAndRender();
}

function editApplication(index) {
  const job = applications[index];
  document.getElementById("company").value = job.company;
  document.getElementById("role").value = job.role;
  document.getElementById("link").value = job.link;
  document.getElementById("status").value = job.status;
  document.getElementById("notes").value = job.notes;

  isEditing = true;
  currentEditIndex = index;

  document.getElementById("addBtn").textContent = "Update";
  document.getElementById("cancelBtn").style.display = "inline-block";
}

function cancelEdit() {
  isEditing = false;
  currentEditIndex = null;
  document.getElementById("addBtn").textContent = "Add";
  document.getElementById("cancelBtn").style.display = "none";

  document.getElementById("company").value = "";
  document.getElementById("role").value = "";
  document.getElementById("link").value = "";
  document.getElementById("status").value = "applied";
  document.getElementById("notes").value = "";
}

function deleteApplication(index) {
  if (confirm("Delete this application?")) {
    applications.splice(index, 1);
    saveAndRender();
  }
}

function render() {
  const list = document.getElementById("applicationList");
  list.innerHTML = "";

  const filterStatus = document.getElementById("filterStatus").value;
  const searchTerm = document.getElementById("search").value.toLowerCase();

  const filtered = applications.filter(app => {
    return (filterStatus === "all" || app.status === filterStatus) &&
           app.company.toLowerCase().includes(searchTerm);
  });

  filtered.forEach((app, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${app.company}</strong> - ${app.role} [${app.status}]
      <div class="actions">
        <button onclick="editApplication(${index})">✏️</button>
        <button onclick="deleteApplication(${index})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });

  renderChart();
}

function renderChart() {
  const ctx = document.getElementById("statusChart").getContext("2d");
  const counts = { applied: 0, interviewing: 0, offer: 0, rejected: 0 };

  applications.forEach(app => counts[app.status]++);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Applied", "Interviewing", "Offer", "Rejected"],
      datasets: [{
        data: [counts.applied, counts.interviewing, counts.offer, counts.rejected],
        backgroundColor: ["#60a5fa", "#fbbf24", "#34d399", "#f87171"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  render();
};
