/**
 * PROMETHEUS RETRO OS - CORE ENGINE v2.6
 * St. Aloysius University Student Coding Club
 */

(function () {
  'use strict';

  // State & Globals
  let zIndexCounter = 100;
  let isMuted = false;
  let isBooting = false;

  // Web Audio Synth for Retro Sound FX
  const AudioFX = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
    },
    playBeep(freq = 440, duration = 0.08, type = 'square') {
      if (isMuted) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio context block guard
      }
    },
    playBootChime() {
      if (isMuted) return;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playBeep(freq, 0.25, 'sine'), idx * 120);
      });
    }
  };

  // 1. MASCOT SPRITE RENDERER
  const MascotRenderer = {
    defaultPattern: [
      "....FFF....",
      "...FFFFF...",
      "..FFFFFFF..",
      "...TTTTT...",
      "..TTTTTTT..",
      ".TTEE.EETT.",
      ".TTTTTTTTT.",
      "..TTTTTTT..",
      "..GGGGGGG..",
      ".TTTTTTTTT.",
      ".TTTTTTTTT.",
      "..T.....T..",
      "..T.....T.."
    ],
    alertPattern: [
      "...FFFFF...",
      "..FYFYFYF..",
      ".FFFFFFFFF.",
      "...TTTTT...",
      "..TTWTTTW..",
      ".TTEE.EETT.",
      ".TTTTTTTTT.",
      "..GGGGGGG..",
      "..BBBBBBB..",
      ".TTTTTTTTT.",
      ".TTTTTTTTT.",
      ".T.......T.",
      ".T.......T."
    ],
    render(containerId, isAlert = false) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';
      const pattern = isAlert ? this.alertPattern : this.defaultPattern;
      pattern.forEach(row => {
        row.split('').forEach(ch => {
          const px = document.createElement('div');
          px.className = 'px' + (ch !== '.' ? ' ' + ch : '');
          container.appendChild(px);
        });
      });
    }
  };

  // 2. BOOT CONTROLLER
  const BootController = {
    biosLines: [
      "PROMETHEUS BIOS v2.6.0 (C) 2026 ST. ALOYSIUS UNIV",
      "CPU: ALOYSIUS NEURAL MATRIX @ 4.20GHz",
      "Memory Test: 640K OK, 16384K EXTENDED OK, 65536K TOTAL OK",
      "Detecting Primary Master ... PROMETHEUS_OS_KERNEL.SYS",
      "Loading Logo Watermark Module ... [assets/logo.png] OK",
      "Loading Trails Module [Web, Backend, ML, AppDev, CP, OSS] ... OK",
      "Initializing Peer Mentor Registry [Dr. Glenson Toney & Team] ... OK",
      "Mounting Hackathon Event Gallery & Browser ... OK",
      "Launching Prometheus Desktop Environment..."
    ],

    init() {
      const booted = localStorage.getItem("prometheus_booted");
      const bootScreen = document.getElementById('boot-screen');
      const loadingScreen = document.getElementById('loading-screen');
      const desktop = document.getElementById('desktop');

      if (booted === "true") {
        bootScreen.style.display = 'none';
        loadingScreen.style.display = 'none';
        desktop.style.display = 'block';
        WindowManager.openDefaultWindows();
      } else {
        this.runBootSequence();
      }

      // Event listener for skip button
      const skipBtn = document.getElementById('boot-skip-btn');
      if (skipBtn) {
        skipBtn.addEventListener('click', () => this.skipBoot());
      }
      
      // Keyboard skip listener
      window.addEventListener('keydown', (e) => {
        if (isBooting && (e.key === 'Escape' || e.key === ' ')) {
          this.skipBoot();
        }
      });
    },

    runBootSequence() {
      isBooting = true;
      const bootScreen = document.getElementById('boot-screen');
      const loadingScreen = document.getElementById('loading-screen');
      const desktop = document.getElementById('desktop');
      const terminal = document.getElementById('boot-terminal');
      const fill = document.getElementById('boot-progress-fill');

      bootScreen.style.display = 'flex';
      loadingScreen.style.display = 'none';
      desktop.style.display = 'none';
      terminal.innerHTML = '';
      fill.style.width = '0%';

      let lineIdx = 0;

      const printNextLine = () => {
        if (!isBooting) return;
        if (lineIdx < this.biosLines.length) {
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
          const div = document.createElement('div');
          div.className = 'boot-line';
          div.innerHTML = `<span class="timestamp">[${timeStr}]</span> <span class="msg">${this.biosLines[lineIdx]}</span>`;
          terminal.appendChild(div);
          terminal.scrollTop = terminal.scrollHeight;
          
          AudioFX.playBeep(600 + lineIdx * 40, 0.04, 'square');
          
          lineIdx++;
          const progress = Math.min(100, Math.floor((lineIdx / this.biosLines.length) * 100));
          fill.style.width = progress + '%';

          setTimeout(printNextLine, 220 + Math.random() * 120);
        } else {
          fill.style.width = '100%';
          setTimeout(() => this.showLoadingSplash(), 400);
        }
      };

      printNextLine();
    },

    showLoadingSplash() {
      if (!isBooting) return;
      const bootScreen = document.getElementById('boot-screen');
      const loadingScreen = document.getElementById('loading-screen');
      
      bootScreen.style.display = 'none';
      loadingScreen.style.display = 'flex';
      MascotRenderer.render('splash-mascot-grid');
      AudioFX.playBootChime();

      let segIndex = 0;
      const segs = document.querySelectorAll('.segmented-loader .seg');
      const segInterval = setInterval(() => {
        if (segIndex < segs.length) {
          segs[segIndex].classList.add('active');
          AudioFX.playBeep(400 + segIndex * 80, 0.03, 'sine');
          segIndex++;
        } else {
          clearInterval(segInterval);
          setTimeout(() => {
            this.finishBoot();
          }, 300);
        }
      }, 180);
    },

    skipBoot() {
      if (!isBooting) return;
      isBooting = false;
      this.finishBoot();
    },

    finishBoot() {
      isBooting = false;
      localStorage.setItem("prometheus_booted", "true");
      document.getElementById('boot-screen').style.display = 'none';
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('desktop').style.display = 'block';
      WindowManager.openDefaultWindows();
    },

    replayBoot() {
      localStorage.removeItem("prometheus_booted");
      this.runBootSequence();
    }
  };

  // 3. WINDOW MANAGER
  const WindowManager = {
    windows: {},
    activeWindowId: null,

    init() {
      const windowElements = document.querySelectorAll('.window');
      windowElements.forEach(win => {
        const id = win.id;
        this.windows[id] = {
          element: win,
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          prevPos: { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height }
        };

        // Window Focus Click
        win.addEventListener('mousedown', () => this.bringToFront(id));

        // Window Title Bar Controls
        const titleBar = win.querySelector('.window-title-bar');
        const minBtn = win.querySelector('.min-btn');
        const maxBtn = win.querySelector('.max-btn');
        const closeBtn = win.querySelector('.close-btn');

        if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); this.minimizeWindow(id); });
        if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMaximize(id); });
        if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.closeWindow(id); });

        // Make Draggable
        if (titleBar) this.makeDraggable(win, titleBar);
      });

      // Desktop Icons Click Listener
      const icons = document.querySelectorAll('.desktop-icon');
      icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
          e.stopPropagation();
          icons.forEach(i => i.classList.remove('selected'));
          icon.classList.add('selected');
        });

        icon.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          const winId = icon.getAttribute('data-window');
          if (winId) this.openWindow(winId);
        });
      });

      // Click desktop clears icon selections
      document.getElementById('desktop').addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.window') && !e.target.closest('#taskbar') && !e.target.closest('#start-menu')) {
          icons.forEach(i => i.classList.remove('selected'));
        }
      });
    },

    openDefaultWindows() {
      // Auto open Manifesto & Events Browser on boot
      this.openWindow('manifesto-win');
      setTimeout(() => this.openWindow('browser-win'), 300);
    },

    openWindow(id) {
      const winObj = this.windows[id];
      if (!winObj) return;

      winObj.isOpen = true;
      winObj.isMinimized = false;
      winObj.element.classList.add('open');
      winObj.element.classList.remove('minimized');
      
      this.bringToFront(id);
      TaskbarController.updateTabs();
      AudioFX.playBeep(800, 0.05, 'sine');

      // Trigger game init if opened
      if (id === 'snake-win') SnakeGame.start();
      if (id === 'memory-win') MemoryMatchGame.start();
    },

    closeWindow(id) {
      const winObj = this.windows[id];
      if (!winObj) return;

      winObj.isOpen = false;
      winObj.element.classList.remove('open');
      TaskbarController.updateTabs();
      AudioFX.playBeep(300, 0.05, 'square');
    },

    minimizeWindow(id) {
      const winObj = this.windows[id];
      if (!winObj) return;

      winObj.isMinimized = true;
      winObj.element.classList.add('minimized');
      TaskbarController.updateTabs();
      AudioFX.playBeep(450, 0.04, 'sine');
    },

    toggleMaximize(id) {
      const winObj = this.windows[id];
      if (!winObj) return;

      if (winObj.isMaximized) {
        // Restore
        winObj.element.style.top = winObj.prevPos.top;
        winObj.element.style.left = winObj.prevPos.left;
        winObj.element.style.width = winObj.prevPos.width;
        winObj.element.style.height = winObj.prevPos.height;
        winObj.isMaximized = false;
      } else {
        // Maximize
        winObj.prevPos = {
          top: winObj.element.style.top,
          left: winObj.element.style.left,
          width: winObj.element.style.width,
          height: winObj.element.style.height
        };
        winObj.element.style.top = '10px';
        winObj.element.style.left = '10px';
        winObj.element.style.width = 'calc(100vw - 20px)';
        winObj.element.style.height = 'calc(100vh - 60px)';
        winObj.isMaximized = true;
      }
      this.bringToFront(id);
    },

    bringToFront(id) {
      const winObj = this.windows[id];
      if (!winObj) return;

      zIndexCounter++;
      winObj.element.style.zIndex = zIndexCounter;
      this.activeWindowId = id;

      Object.keys(this.windows).forEach(wId => {
        this.windows[wId].element.classList.remove('active');
      });
      winObj.element.classList.add('active');
      TaskbarController.updateTabs();
    },

    makeDraggable(winEl, handleEl) {
      let isDragging = false;
      let startX, startY, startLeft, startTop;

      handleEl.addEventListener('mousedown', (e) => {
        if (window.innerWidth <= 700) return;
        if (e.target.closest('.window-btn')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = winEl.offsetLeft;
        startTop = winEl.offsetTop;

        const onMouseMove = (moveEvent) => {
          if (!isDragging) return;
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          winEl.style.left = Math.max(0, Math.min(window.innerWidth - 100, startLeft + dx)) + 'px';
          winEl.style.top = Math.max(0, Math.min(window.innerHeight - 80, startTop + dy)) + 'px';
        };

        const onMouseUp = () => {
          isDragging = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  };

  // 4. TASKBAR & START MENU CONTROLLER
  const TaskbarController = {
    init() {
      this.updateClock();
      setInterval(() => this.updateClock(), 1000);

      const startBtn = document.getElementById('start-btn');
      const startMenu = document.getElementById('start-menu');

      if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = startMenu.classList.contains('open');
          if (isOpen) {
            startMenu.classList.remove('open');
            startBtn.classList.remove('active');
          } else {
            startMenu.classList.add('open');
            startBtn.classList.add('active');
          }
        });

        document.addEventListener('click', (e) => {
          if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
            startMenu.classList.remove('open');
            startBtn.classList.remove('active');
          }
        });
      }

      // Start Menu Item Actions
      const menuItems = document.querySelectorAll('.start-menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          const action = item.getAttribute('data-action');
          const targetWin = item.getAttribute('data-window');

          if (targetWin) {
            WindowManager.openWindow(targetWin);
          } else if (action === 'replay-boot') {
            BootController.replayBoot();
          } else if (action === 'toggle-sound') {
            TaskbarController.toggleSound();
          }

          if (startMenu) startMenu.classList.remove('open');
          if (startBtn) startBtn.classList.remove('active');
        });
      });

      // Sound Tray Toggle
      const soundBtn = document.getElementById('tray-sound-btn');
      if (soundBtn) {
        soundBtn.addEventListener('click', () => this.toggleSound());
      }

      // Replay Tray Button
      const replayBtn = document.getElementById('tray-replay-btn');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => BootController.replayBoot());
      }
    },

    updateClock() {
      const clockEl = document.getElementById('taskbar-clock');
      if (!clockEl) return;
      const now = new Date();
      let hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hrsStr = String(hours).padStart(2, '0');
      clockEl.textContent = `${hrsStr}:${mins}:${secs} ${ampm}`;
    },

    toggleSound() {
      isMuted = !isMuted;
      const icon = document.getElementById('sound-icon');
      if (icon) {
        icon.textContent = isMuted ? 'MUTE' : 'VOL';
      }
      if (!isMuted) AudioFX.playBeep(880, 0.1, 'sine');
    },

    updateTabs() {
      const tabsContainer = document.getElementById('taskbar-tabs');
      if (!tabsContainer) return;
      tabsContainer.innerHTML = '';

      Object.keys(WindowManager.windows).forEach(winId => {
        const winObj = WindowManager.windows[winId];
        if (winObj.isOpen) {
          const titleText = winObj.element.querySelector('.window-title-text')?.textContent || winId;
          const tab = document.createElement('div');
          tab.className = 'taskbar-tab' + (WindowManager.activeWindowId === winId && !winObj.isMinimized ? ' active' : '');
          tab.innerHTML = `<span>${titleText}</span>`;

          tab.addEventListener('click', () => {
            if (winObj.isMinimized) {
              winObj.isMinimized = false;
              winObj.element.classList.remove('minimized');
              WindowManager.bringToFront(winId);
            } else if (WindowManager.activeWindowId === winId) {
              WindowManager.minimizeWindow(winId);
            } else {
              WindowManager.bringToFront(winId);
            }
          });

          tabsContainer.appendChild(tab);
        }
      });
    }
  };

  // 5. SYSTEM MONITOR ENGINE (Live RAM & CPU Meter)
  const SysMonEngine = {
    init() {
      setInterval(() => {
        // RAM gauge simulation (280MB to 420MB out of 1024MB)
        const ramUsed = 280 + Math.floor(Math.random() * 120);
        const ramPct = Math.floor((ramUsed / 1024) * 100);
        const ramVal = document.getElementById('sysmon-ram-val');
        const ramFill = document.getElementById('sysmon-ram-fill');
        if (ramVal) ramVal.textContent = `${ramUsed} MB / 1024 MB (${ramPct}%)`;
        if (ramFill) ramFill.style.width = ramPct + '%';

        // CPU gauge simulation (8% to 45%)
        const cpuPct = 8 + Math.floor(Math.random() * 37);
        const cpuVal = document.getElementById('sysmon-cpu-val');
        const cpuFill = document.getElementById('sysmon-cpu-fill');
        if (cpuVal) cpuVal.textContent = `${cpuPct}% Load`;
        if (cpuFill) cpuFill.style.width = cpuPct + '%';
      }, 2000);
    }
  };

  // 6. TRAIL PROGRESS TRACKER ENGINE
  const TrailTrackerEngine = {
    init() {
      const checkboxes = document.querySelectorAll('.checklist-cb');
      checkboxes.forEach(cb => {
        cb.addEventListener('click', () => {
          const item = cb.closest('.checklist-item');
          const isDone = item.getAttribute('data-done') === 'true';
          item.setAttribute('data-done', isDone ? 'false' : 'true');
          cb.textContent = isDone ? '' : '✓';
          this.updateProgress();
          AudioFX.playBeep(isDone ? 350 : 750, 0.05, 'sine');
        });
      });
    },
    updateProgress() {
      const items = document.querySelectorAll('.checklist-item');
      let doneCount = 0;
      items.forEach(item => {
        if (item.getAttribute('data-done') === 'true') doneCount++;
      });
      const pct = Math.floor((doneCount / items.length) * 100);
      const pctEl = document.getElementById('tracker-pct-val');
      const fillEl = document.getElementById('tracker-fill-val');
      if (pctEl) pctEl.textContent = pct + '%';
      if (fillEl) fillEl.style.width = pct + '%';
    }
  };

  // 7. GAME 1: SNAKE.EXE (FLAME TURTLE SNAKE)
  const SnakeGame = {
    canvas: null,
    ctx: null,
    gridSize: 16,
    tileCount: 18,
    snake: [],
    food: { x: 5, y: 5 },
    dx: 1,
    dy: 0,
    score: 0,
    highScore: 0,
    interval: null,

    start() {
      this.canvas = document.getElementById('snake-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
      this.dx = 1;
      this.dy = 0;
      this.score = 0;
      this.updateScore();

      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => this.loop(), 110);

      window.addEventListener('keydown', (e) => this.handleKey(e));
    },

    handleKey(e) {
      if (e.key === 'ArrowUp' && this.dy !== 1) { this.dx = 0; this.dy = -1; }
      if (e.key === 'ArrowDown' && this.dy !== -1) { this.dx = 0; this.dy = 1; }
      if (e.key === 'ArrowLeft' && this.dx !== 1) { this.dx = -1; this.dy = 0; }
      if (e.key === 'ArrowRight' && this.dx !== -1) { this.dx = 1; this.dy = 0; }
    },

    loop() {
      const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

      // Wrap around walls
      if (head.x < 0) head.x = this.tileCount - 1;
      if (head.x >= this.tileCount) head.x = 0;
      if (head.y < 0) head.y = this.tileCount - 1;
      if (head.y >= this.tileCount) head.y = 0;

      // Self collision check
      for (let i = 0; i < this.snake.length; i++) {
        if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
          this.score = 0;
          this.snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }];
          this.updateScore();
          AudioFX.playBeep(200, 0.2, 'sawtooth');
          return;
        }
      }

      this.snake.unshift(head);

      // Eat food
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10;
        if (this.score > this.highScore) this.highScore = this.score;
        this.updateScore();
        this.food = {
          x: Math.floor(Math.random() * this.tileCount),
          y: Math.floor(Math.random() * this.tileCount)
        };
        AudioFX.playBeep(900, 0.08, 'sine');
      } else {
        this.snake.pop();
      }

      this.draw();
    },

    draw() {
      this.ctx.fillStyle = '#0A1614';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw Flame Food
      this.ctx.fillStyle = '#FF6A3D';
      this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);

      // Draw Snake Body
      this.snake.forEach((segment, idx) => {
        this.ctx.fillStyle = idx === 0 ? '#7FEDE0' : '#2FD4C4';
        this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
      });
    },

    updateScore() {
      const sEl = document.getElementById('snake-score');
      const hEl = document.getElementById('snake-high');
      if (sEl) sEl.textContent = `SCORE: ${this.score}`;
      if (hEl) hEl.textContent = `HIGH: ${this.highScore}`;
    }
  };

  // 8. GAME 2: CODEBREAKER.EXE (MEMORY CARD MATCH)
  const MemoryMatchGame = {
    symbols: ['HTML', 'CSS', 'JS', 'ML', 'CP', 'DB', 'GIT', 'PY'],
    cards: [],
    flipped: [],
    matchedCount: 0,

    start() {
      const grid = document.getElementById('memory-card-grid');
      if (!grid) return;

      const deck = [...this.symbols, ...this.symbols].sort(() => Math.random() - 0.5);
      grid.innerHTML = '';
      this.flipped = [];
      this.matchedCount = 0;

      deck.forEach((sym, idx) => {
        const tile = document.createElement('div');
        tile.className = 'card-tile';
        tile.setAttribute('data-symbol', sym);
        tile.setAttribute('data-index', idx);
        tile.textContent = '?';

        tile.addEventListener('click', () => this.flipCard(tile, sym, idx));
        grid.appendChild(tile);
      });

      const msg = document.getElementById('memory-status');
      if (msg) msg.textContent = 'Decode all 8 tech pairs!';
    },

    flipCard(tile, sym, idx) {
      if (tile.classList.contains('flipped') || tile.classList.contains('matched') || this.flipped.length >= 2) return;

      tile.classList.add('flipped');
      tile.textContent = sym;
      this.flipped.push({ tile, sym, idx });
      AudioFX.playBeep(650, 0.05, 'sine');

      if (this.flipped.length === 2) {
        const [c1, c2] = this.flipped;
        if (c1.sym === c2.sym) {
          c1.tile.classList.add('matched');
          c2.tile.classList.add('matched');
          this.matchedCount++;
          this.flipped = [];
          AudioFX.playBeep(950, 0.12, 'sine');

          if (this.matchedCount === 8) {
            const msg = document.getElementById('memory-status');
            if (msg) msg.textContent = '🎉 SYSTEM MATRIX DECODED! PERFECT MATCH!';
          }
        } else {
          setTimeout(() => {
            c1.tile.classList.remove('flipped');
            c2.tile.classList.remove('flipped');
            c1.tile.textContent = '?';
            c2.tile.textContent = '?';
            this.flipped = [];
          }, 800);
        }
      }
    }
  };

  // 9. TERMINAL CONTROLLER (Bonus Interactive CLI Window)
  const TerminalController = {
    init() {
      const input = document.getElementById('terminal-cli-input');
      const output = document.getElementById('terminal-cli-output');
      if (!input || !output) return;

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = input.value.trim().toLowerCase();
          input.value = '';
          this.executeCommand(cmd, output);
        }
      });
    },

    executeCommand(cmd, output) {
      const promptLine = document.createElement('div');
      promptLine.innerHTML = `<span class="terminal-prompt">guest@prometheus:~$</span> ${cmd}`;
      output.appendChild(promptLine);

      const resLine = document.createElement('div');
      resLine.style.color = '#7FEDE0';
      resLine.style.marginBottom = '6px';

      switch (cmd) {
        case 'help':
          resLine.innerHTML = `Available Commands:<br>- <b>manifesto</b>: Print club ethos<br>- <b>trails</b>: List learning tracks<br>- <b>mentors</b>: Peer mentor list<br>- <b>events</b>: View hackathons<br>- <b>whoami</b>: Current user role<br>- <b>clear</b>: Clear screen`;
          break;
        case 'manifesto':
          resLine.textContent = "Knowledge isn't handed down. It's taken. Prometheus runs on tech literacy and no gatekeeping.";
          break;
        case 'trails':
          resLine.textContent = "Trails: [01] Fundamentals [02] Web [03] Backend [04] ML [05] AppDev [06] CP [07] Open Source";
          break;
        case 'mentors':
          resLine.textContent = "Mentors: Dr. Glenson Toney (Faculty Coordinator), Samarth, Robin, Shreyas, Ananya, Nihal";
          break;
        case 'events':
          resLine.textContent = "Events: CodeSprint 2026 National Hackathon, Skunkworks Hardware Lab, Deep Work Sprints";
          break;
        case 'whoami':
          resLine.textContent = "guest_coder (Permissions: Full Skunkworks Access)";
          break;
        case 'clear':
          output.innerHTML = '';
          return;
        default:
          resLine.textContent = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
          break;
      }
      output.appendChild(resLine);
      output.scrollTop = output.scrollHeight;
    }
  };

  // CONTEXT MENU CONTROLLER
  const ContextMenuController = {
    init() {
      const menu = document.getElementById('context-menu');
      const desktop = document.getElementById('desktop');

      if (!desktop || !menu) return;

      desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const x = Math.min(e.clientX, window.innerWidth - 180);
        const y = Math.min(e.clientY, window.innerHeight - 150);
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.display = 'flex';
      });

      document.addEventListener('click', () => {
        menu.style.display = 'none';
      });

      menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          const action = item.getAttribute('data-action');
          if (action === 'refresh') {
            desktop.style.opacity = '0.5';
            setTimeout(() => desktop.style.opacity = '1', 150);
          } else if (action === 'replay-boot') {
            BootController.replayBoot();
          } else if (action === 'open-terminal') {
            WindowManager.openWindow('terminal-win');
          } else if (action === 'about') {
            WindowManager.openWindow('manifesto-win');
          }
        });
      });
    }
  };

  // INITIALIZE EVERYTHING ON DOM LOAD
  document.addEventListener('DOMContentLoaded', () => {
    BootController.init();
    WindowManager.init();
    TaskbarController.init();
    ContextMenuController.init();
    SysMonEngine.init();
    TrailTrackerEngine.init();
    TerminalController.init();
  });

})();
