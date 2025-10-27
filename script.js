// WAE Mission Control - Shared JavaScript Functions

// HTML escaping for security
function escapeHTML(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Console animation for homepage
function runConsole() {
  const consoleBox = document.getElementById("console");
  if (!consoleBox) return;

  const lines = [
    "Initializing secure systems...",
    "Verifying identity: Nahiyan",
    "Access granted.",
    "Activating data-protection modules...",
    "Monitoring digital defense protocols...",
    "System stable. Justice online."
  ];

  consoleBox.innerHTML = "";
  let i = 0;
  
  const interval = setInterval(() => {
    if (i < lines.length) {
      const lineElement = document.createElement("div");
      lineElement.className = "console-line";
      lineElement.textContent = lines[i];
      consoleBox.appendChild(lineElement);
      consoleBox.scrollTop = consoleBox.scrollHeight;
      i++;
    } else {
      clearInterval(interval);
    }
  }, 600);
}

// Typing effect for terminal
function startTypingEffect(textArray, elementId, delay = 100) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = "";
  let lineIndex = 0;
  let charIndex = 0;

  function typeLine() {
    if (lineIndex >= textArray.length) return;

    const currentLine = textArray[lineIndex];
    
    if (charIndex === 0) {
      const lineElement = document.createElement("div");
      lineElement.className = "console-line";
      element.appendChild(lineElement);
    }

    const lineElement = element.lastChild;
    
    if (charIndex < currentLine.length) {
      lineElement.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeLine, delay);
    } else {
      lineIndex++;
      charIndex = 0;
      if (lineIndex < textArray.length) {
        setTimeout(typeLine, delay * 3);
      }
    }
  }

  typeLine();
}

// Load and display missions
async function loadMissions(containerId, filterStatus = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = '<div class="console-line">Loading mission data...</div>';
    
    const response = await fetch('missions.json');
    if (!response.ok) throw new Error('Failed to load missions');
    
    const missions = await response.json();
    
    // Filter missions if status filter provided
    const filteredMissions = filterStatus 
      ? missions.filter(mission => mission.status.toLowerCase() === filterStatus.toLowerCase())
      : missions;

    if (filteredMissions.length === 0) {
      container.innerHTML = '<div class="console-line">No missions found.</div>';
      return;
    }

    // Clear loading message
    container.innerHTML = '';

    // Create mission cards
    filteredMissions.forEach(mission => {
      const missionCard = createMissionCard(mission);
      container.appendChild(missionCard);
    });

  } catch (error) {
    console.error('Error loading missions:', error);
    container.innerHTML = '<div class="console-line">Error loading mission data. Please try again later.</div>';
  }
}

// Create individual mission card
function createMissionCard(mission) {
  const card = document.createElement('div');
  card.className = `mission-card ${mission.status.toLowerCase()}`;

  const statusClass = `status-${mission.status.toLowerCase()}`;
  
  card.innerHTML = `
    <div class="mission-header">
      <h3 class="mission-title">${escapeHTML(mission.title)}</h3>
      <span class="status-badge ${statusClass}">${escapeHTML(mission.status)}</span>
    </div>
    <p>${escapeHTML(mission.objective)}</p>
    <div class="mission-meta">
      <span class="priority priority-${mission.priority}">Priority ${mission.priority}</span>
      <span class="created-date">${formatDate(mission.created_at)}</span>
    </div>
    <div class="mission-tags">
      ${mission.tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join('')}
    </div>
  `;

  return card;
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Initialize page specific functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Auto-run console on homepage if element exists
  const consoleElement = document.getElementById('console');
  if (consoleElement && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    setTimeout(runConsole, 1000);
  }

  // Load missions on missions page
  if (window.location.pathname.includes('missions.html')) {
    loadMissions('missionsContainer');
  }

  // Load completed missions on logs page
  if (window.location.pathname.includes('logs.html')) {
    loadMissions('missionsContainer', 'Completed');
  }

  // Start terminal typing effect
  if (window.location.pathname.includes('terminal.html')) {
    const terminalLines = [
      "Initializing AI Terminal...",
      "Identity Verified: Nahiyan",
      "Access Granted.",
      "JERVIS ONLINE.",
      "Awaiting command...",
      ">"
    ];
    
    setTimeout(() => {
      startTypingEffect(terminalLines, 'terminal-content', 80);
    }, 500);
  }
});