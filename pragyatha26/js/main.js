/* ===========================================================
   PRAGYATHA '26 — interactions
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Event data (from the official Rule Book) ---------- */
  const EVENTS = [
    {
      num: "01", name: "ADSPIZE", cat: "business",
      type: "Marketing & Advertising Challenge",
      tag: "Strategy · Creativity · Impact",
      date: "30 Oct 2026", time: "12:00 PM", venue: "Basketball Court", team: "Team event",
      desc: "A creative marketing and advertising challenge where participants explore branding, communication and strategy through a real-world brief. Teams understand the target audience, develop a clear campaign idea and present creative promotional content.",
      rules: [
        "Teams must register according to the team size specified by the organizers.",
        "The brief, target audience, deliverables and submission format are explained at the start.",
        "All campaign content must be created by the team during the event.",
        "No copyrighted, plagiarized or misleading content; permission needed for third-party assets.",
        "Submit within the announced deadline and present if required."
      ],
      evaluation: [
        "Creativity and originality",
        "Clarity of message and audience relevance",
        "Campaign strategy and branding",
        "Execution and presentation"
      ]
    },
    {
      num: "02", name: "UEXPLORE", cat: "hackathon",
      type: "24-Hour UI/UX Hackathon",
      tag: "Explore · Learn · Build",
      date: "30 – 31 Oct 2026", time: "Report 1:00 PM · 24 hrs", venue: "CS Lab 1", team: "Team of 2",
      desc: "A 24-hour UI/UX hackathon focused on designing user-centred digital experiences that solve real-world problems. Teams work through a design challenge and build a digital interface or interactive prototype.",
      rules: [
        "Each team has two members; one member completes registration if instructed.",
        "Bring your own laptop, charger and design tools — ensure they are accessible before the event.",
        "The problem statement / design brief is provided by the organizers.",
        "The complete solution must be built during the hackathon — no copied templates.",
        "Stay available for check-ins, reviews and the final presentation.",
        "Follow the 24-hour schedule and campus safety instructions."
      ],
      bring: ["Laptop and charger", "College ID card", "Notebook and pen, if required"]
    },
    {
      num: "03", name: "CODEFORGE '26", cat: "hackathon",
      type: "24-Hour Software Hackathon",
      tag: "Code · Innovate · Create",
      date: "30 – 31 Oct 2026", time: "Report 1:00 PM · 24 hrs", venue: "Library", team: "Max 4",
      desc: "A 24-hour software hackathon. Teams receive a problem statement from the organizers and develop a software-based solution within the allotted 24 hours, followed by a demonstration and presentation.",
      rules: [
        "Teams register according to the team size (max 4 participants).",
        "The problem statement is released at the start of the hackathon.",
        "The core solution must be developed during the 24 hours; disclose any pre-existing code, libraries, APIs or services.",
        "Bring your own laptops, chargers and peripherals; ensure your dev environment is ready.",
        "Remain available for checkpoints, mentor interactions and final evaluation.",
        "Submit the working solution, source code/repository and presentation by the deadline."
      ],
      bring: ["Laptop, charger and extension board", "College ID card", "Required development tools and accounts"]
    },
    {
      num: "04", name: "HARDWARE-X", cat: "hackathon",
      type: "24-Hour Hardware Hackathon",
      tag: "Design · Build · Solve",
      date: "31 Oct – 1 Nov 2026", time: "Report 9:00 AM · 24 hrs", venue: "Library", team: "Max 4",
      desc: "A hands-on hardware hackathon in which teams build and demonstrate a working prototype addressing a real-world problem, connected to one of the announced themes and showing practical application of hardware, electronics and embedded systems.",
      extra: { title: "Themes", items: ["Agriculture", "Healthcare", "Smart Systems", "Renewable Energy", "Robotics", "Waste Management"] },
      rules: [
        "Teams register in the format and size announced (max 4 participants).",
        "Pick a problem that fits one of the announced themes.",
        "Bring the components and tools needed; the final allowed-items list is confirmed by organizers.",
        "All wiring/assembly must be safe — mains-voltage, hazardous materials and open flames are prohibited unless approved.",
        "No pre-built projects — components are verified before start and the product is built from scratch during the event.",
        "The jury may ask about the design, circuit, code, feasibility and real-world use."
      ],
      bring: [
        "Microcontroller boards (Arduino / ESP32) if relevant",
        "Sensors & modules (ultrasonic, IR, temperature, soil-moisture, gas, light…)",
        "Breadboard, jumper wires, resistors, LEDs, switches and basic components",
        "Motor driver, DC/servo motors, relay modules or actuators if required",
        "Low-voltage power source, USB cable, batteries with holders",
        "Laptop, charger and extension board; basic hand tools & PPE if permitted"
      ]
    },
    {
      num: "05", name: "ENTRORPHOSIS", cat: "business",
      type: "Entrepreneurial Challenge",
      tag: "Ideate · Pitch · Grow",
      date: "30 – 31 Oct 2026", time: "Report 9:00 AM", venue: "EEE Seminar Hall", team: "Team event",
      desc: "An entrepreneurial challenge designed to build creativity, problem-solving, prototyping, pitching and marketing skills. Participants progress through four stages — from idea to advertisement.",
      extra: { title: "The 4 Stages", items: ["Yojana — Ideation", "Nirmana — Prototyping", "Pregkha — Pitching", "Vighnapana — Advertisement"] },
      rules: [
        "Conducted over the schedule announced by the organizers.",
        "Register individually; teams are formed or assigned at the venue.",
        "Develop an idea, create a prototype/model, pitch the concept and prepare an advertisement.",
        "Complete the required deliverables within the allotted time at each stage.",
        "Be ready to explain the problem, target users, value proposition, prototype and promotion.",
        "Plagiarism, misrepresentation and disruptive behaviour may lead to disqualification."
      ]
    },
    {
      num: "06", name: "INVEST SMART 2026", cat: "business",
      type: "Stock Market Workshop",
      tag: "Analyse · Invest · Prosper",
      date: "30 – 31 Oct 2026", time: "Report 10:00 AM", venue: "Alumni Hall", team: "Individual",
      desc: "An introductory workshop on the basics of the stock market. Participants are introduced to foundational concepts such as shares, stock exchanges, market indices, risk and return, and responsible investing.",
      rules: [
        "Arrive on time and complete check-in before the session begins.",
        "Bring a notebook and pen to record key concepts and questions.",
        "Participate in activities and demonstrations.",
        "Educational only — this is not personalized investment advice.",
        "Do not share another person's personal financial information."
      ],
      bring: ["Notebook and pen", "College ID card"]
    },
    {
      num: "07", name: "BRIDGE-X", cat: "build",
      type: "Bridge Building Competition",
      tag: "Connect · Collaborate · Build",
      date: "31 Oct 2026", time: "10:00 AM", venue: "ME-RIISE Foundation", team: "Max 2",
      desc: "A structural design challenge in which teams build a bridge using materials supplied by the organizers. The objective is to design and construct a bridge that can withstand the greatest load while meeting the construction and safety requirements.",
      rules: [
        "Teams register in the format and size announced (max 2 participants).",
        "All bridge-building materials are provided by the organizers.",
        "Build only during the allotted event time using permitted materials.",
        "Follow the dimensions, span, support and construction constraints announced beforehand.",
        "Do not reinforce or modify the testing apparatus; submit for inspection before load testing.",
        "Stand clear during testing — the jury's load measurements and decision are binding."
      ],
      evaluation: [
        "Maximum load-bearing capacity",
        "Structural stability and efficiency of design",
        "Quality of construction and compliance with constraints",
        "Overall bridge length: minimum 30 cm"
      ]
    },
    {
      num: "08", name: "CATAPULT", cat: "build",
      type: "Launcher Building Challenge",
      tag: "Launch · Scale · Lead",
      date: "31 Oct 2026", time: "10:00 AM · 1.5 hrs", venue: "ME-RIISE Foundation", team: "Max 2",
      desc: "Teams design and build a launcher using materials provided by the organizers. Teams get 1 hour 30 minutes to construct and test their design. The winner is determined primarily by the distance travelled by the launched object, with design quality also considered.",
      rules: [
        "Teams register in the format and size announced (max 2 participants).",
        "All construction materials are provided — use only permitted materials and tools.",
        "You get 1 hour 30 minutes to design, build and prepare the catapult.",
        "Do not begin construction before the official start time.",
        "Follow the launch procedure and safety instructions; never aim at people or outside the test area.",
        "Number of attempts and measurement method are announced before testing."
      ],
      evaluation: [
        "Distance travelled by the launched object",
        "Design quality, stability and build craftsmanship",
        "Consistency and safe operation"
      ]
    }
  ];

  const FILTERS = [
    { key: "all", label: "All Events" },
    { key: "hackathon", label: "Hackathons" },
    { key: "business", label: "Business" },
    { key: "build", label: "Build Challenges" }
  ];

  /* Per-event posters (dropped in pragyatha26/images/). A missing entry just
     falls back to the numbered card automatically. ADSPIZE (01) pending. */
  const POSTERS = {
    "01": "images/adspize.jpeg",       // pending — 404s gracefully until added
    "02": "images/UiUx.jpeg",
    "03": "images/codeforge.jpeg",
    "04": "images/Hardwarex.jpeg",
    "05": "images/entrorphosis.jpeg",
    "06": "images/Investsmart.jpeg",
    "07": "images/bridgex.jpeg",
    "08": "images/catapult.jpeg"
  };
  function posterPath(ev) { return POSTERS[ev.num] || ""; }

  /* ---------- Render event cards ---------- */
  const grid = document.getElementById("eventsGrid");
  const filtersEl = document.getElementById("filters");

  function cardHTML(ev) {
    // Starts in "no image" mode (shows number). If the poster loads, we flip to
    // poster mode; if it 404s we remove the <img> and stay in number mode.
    return (
      '<article class="ecard ecard--noimg" data-cat="' + ev.cat + '" data-num="' + ev.num + '"' +
        ' tabindex="0" role="button" aria-label="' + ev.name + ' details">' +
        '<div class="ecard__media">' +
          '<img class="ecard__poster" src="' + posterPath(ev) + '" alt="' + ev.name + ' poster"' +
            ' onload="this.closest(\'.ecard\').classList.remove(\'ecard--noimg\')"' +
            ' onerror="this.remove()">' +
          '<span class="ecard__badge">' + ev.num + '</span>' +
        '</div>' +
        '<div class="ecard__body">' +
          '<div class="ecard__num">' + ev.num + '</div>' +
          '<p class="ecard__type">' + ev.type + '</p>' +
          '<h3 class="ecard__name">' + ev.name + '</h3>' +
          '<p class="ecard__tag">' + ev.tag + '</p>' +
          '<div class="ecard__meta">📍 <b>' + ev.venue + '</b> · ' + ev.date + '</div>' +
          '<span class="ecard__more">View details →</span>' +
        '</div>' +
      '</article>'
    );
  }

  function renderCards(cat) {
    grid.innerHTML = EVENTS
      .filter(function (e) { return cat === "all" || e.cat === cat; })
      .map(cardHTML).join("");
    bindCards();
    observeCards();
  }

  // Staggered entrance for event cards (timing-based, so hover stays snappy).
  function observeCards() {
    const cards = Array.prototype.slice.call(grid.querySelectorAll(".ecard"));
    if (!("IntersectionObserver" in window)) {
      cards.forEach(function (c) { c.classList.add("in"); });
      return;
    }
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          const i = cards.indexOf(en.target);
          setTimeout(function () { en.target.classList.add("in"); }, (i % 4) * 90);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(function (c) { cio.observe(c); });
  }

  function renderFilters() {
    filtersEl.innerHTML = FILTERS.map(function (f, i) {
      return '<button class="filter' + (i === 0 ? " active" : "") + '" data-filter="' + f.key + '">' + f.label + "</button>";
    }).join("");
    filtersEl.querySelectorAll(".filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filtersEl.querySelectorAll(".filter").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        renderCards(btn.dataset.filter);
      });
    });
  }

  /* ---------- Modal ---------- */
  const modal = document.getElementById("eventModal");
  const modalBody = document.getElementById("modalBody");
  let lastFocused = null;

  function listBlock(title, items) {
    if (!items || !items.length) return "";
    return "<h4>" + title + "</h4><ul>" +
      items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
  }

  function modalHTML(ev) {
    return (
      '<img class="m-poster" src="' + posterPath(ev) + '" alt="' + ev.name + ' poster"' +
        ' onload="this.classList.add(\'is-on\')" onerror="this.remove()">' +
      '<div class="m-head">' +
        '<div class="m-head__num">EVENT ' + ev.num + '</div>' +
        '<div class="m-head__name">' + ev.name + '</div>' +
        '<div class="m-head__type">' + ev.type + '</div>' +
        '<span class="m-head__tag">' + ev.tag + '</span>' +
      '</div>' +
      '<div class="m-meta">' +
        '<div><span>Date</span><b>' + ev.date + '</b></div>' +
        '<div><span>Reporting</span><b>' + ev.time + '</b></div>' +
        '<div><span>Venue</span><b>' + ev.venue + '</b></div>' +
      '</div>' +
      '<div class="m-content">' +
        '<p>' + ev.desc + '</p>' +
        '<h4>Team</h4><ul><li>' + ev.team + '</li></ul>' +
        (ev.extra ? listBlock(ev.extra.title, ev.extra.items) : "") +
        listBlock("Rules & Regulations", ev.rules) +
        listBlock("What to Bring", ev.bring) +
        listBlock("Evaluation Criteria", ev.evaluation) +
        '<a class="btn btn--primary" href="https://www.certifyy.in/" target="_blank" rel="noopener">Register for ' + ev.name + '</a>' +
      '</div>'
    );
  }

  function openModal(num) {
    const ev = EVENTS.find(function (e) { return e.num === num; });
    if (!ev) return;
    modalBody.innerHTML = modalHTML(ev);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    lastFocused = document.activeElement;
    document.getElementById("modalClose").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    modalBody.innerHTML = "";
    if (lastFocused) lastFocused.focus();
  }

  function bindCards() {
    grid.querySelectorAll(".ecard").forEach(function (card) {
      card.addEventListener("click", function () { openModal(card.dataset.num); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card.dataset.num); }
      });
    });
  }

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close") || e.target.id === "modalClose") closeModal();
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------- Countdown ---------- */
  const target = new Date("2026-10-30T09:00:00+05:30").getTime();
  const el = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs")
  };
  function pad(n) { return String(n).padStart(2, "0"); }
  function set(node, val) {
    const v = pad(val);
    if (node.textContent !== v) {
      node.textContent = v;
      node.classList.remove("flip"); void node.offsetWidth; node.classList.add("flip");
    }
  }
  function tick() {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;
    set(el.d, Math.floor(diff / 86400000));
    set(el.h, Math.floor((diff % 86400000) / 3600000));
    set(el.m, Math.floor((diff % 3600000) / 60000));
    set(el.s, Math.floor((diff % 60000) / 1000));
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById("scrollProgress");
  function updateProgress() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
  }
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ---------- Stat count-up ---------- */
  function countUp(node) {
    const target = parseInt(node.getAttribute("data-count"), 10) || 0;
    const prefix = node.getAttribute("data-prefix") || "";
    const suffix = node.getAttribute("data-suffix") || "";
    const dur = 1100; let startT = null;
    function step(ts) {
      if (startT === null) startT = ts;
      const p = Math.min((ts - startT) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else node.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }
  const statNodes = document.querySelectorAll(".stat__num[data-count]");
  if ("IntersectionObserver" in window) {
    const statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); statIO.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    statNodes.forEach(function (n) { statIO.observe(n); });
  }

  /* ---------- Navbar: scrolled state + mobile toggle ---------- */
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");

  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 20); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  navToggle.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  let io = null;
  function revealObserve(nodes) {
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
    }
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Init ---------- */
  renderFilters();
  renderCards("all");
  // reveal the static sections too
  document.querySelectorAll(".section .section__title, .about__grid, .stat, .contact__card, .rulebook__inner")
    .forEach(function (n) { n.classList.add("reveal"); });
  revealObserve(document.querySelectorAll(".reveal"));
})();
