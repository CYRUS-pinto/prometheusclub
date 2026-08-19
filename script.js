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
      "Initializing Peer Mentor Registry [Ms. Nishmitha & Team] ... OK",
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

      // Global Keyboard Hotkeys
      window.addEventListener('keydown', (e) => {
        // Alt + Tab: Cycle through open windows
        if (e.altKey && e.key === 'Tab') {
          e.preventDefault();
          const openIds = Object.keys(this.windows).filter(id => this.windows[id].isOpen && !this.windows[id].isMinimized);
          if (openIds.length > 1) {
            const currentIdx = openIds.indexOf(this.activeWindowId);
            const nextIdx = (currentIdx + 1) % openIds.length;
            this.bringToFront(openIds[nextIdx]);
            AudioFX.playBeep(900, 0.04, 'sine');
          }
        }
      });
    },

    openDefaultWindows() {
      // Auto open Events Browser & Trails on boot
      this.openWindow('browser-win');
      setTimeout(() => this.openWindow('trails-win'), 300);
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

      const startDrag = (clientX, clientY) => {
        isDragging = true;
        startX = clientX;
        startY = clientY;
        startLeft = winEl.offsetLeft;
        startTop = winEl.offsetTop;
      };

      const moveDrag = (clientX, clientY) => {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        winEl.style.left = Math.max(0, Math.min(window.innerWidth - 100, startLeft + dx)) + 'px';
        winEl.style.top = Math.max(0, Math.min(window.innerHeight - 80, startTop + dy)) + 'px';
      };

      const stopDrag = () => {
        isDragging = false;
      };

      handleEl.addEventListener('mousedown', (e) => {
        if (window.innerWidth <= 700) return;
        if (e.target.closest('.window-btn')) return;

        startDrag(e.clientX, e.clientY);

        const onMouseMove = (moveEvent) => moveDrag(moveEvent.clientX, moveEvent.clientY);
        const onMouseUp = () => {
          stopDrag();
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      // Touch Drag Support for Phones and Tablets
      handleEl.addEventListener('touchstart', (e) => {
        if (e.target.closest('.window-btn')) return;
        const touch = e.touches[0];
        if (touch) {
          startDrag(touch.clientX, touch.clientY);
        }
      }, { passive: true });

      handleEl.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        if (touch && isDragging) {
          moveDrag(touch.clientX, touch.clientY);
        }
      }, { passive: true });

      handleEl.addEventListener('touchend', () => stopDrag(), { passive: true });
    },
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

  // 5. SYSTEM MONITOR ENGINE (Live RAM & CPU Meter & Sidebar Gadget)
  const SysMonEngine = {
    init() {
      // Gadget click to open full SysMon window
      const gadgetBox = document.getElementById('sysmon-gadget');
      if (gadgetBox) {
        gadgetBox.addEventListener('click', () => {
          WindowManager.openWindow('sysmon-win');
        });
      }

      setInterval(() => {
        // RAM gauge simulation (280MB to 420MB out of 1024MB)
        const ramUsed = 280 + Math.floor(Math.random() * 120);
        const ramPct = Math.floor((ramUsed / 1024) * 100);
        const ramVal = document.getElementById('sysmon-ram-val');
        const ramFill = document.getElementById('sysmon-ram-fill');
        if (ramVal) ramVal.textContent = `${ramUsed} MB / 1024 MB (${ramPct}%)`;
        if (ramFill) ramFill.style.width = ramPct + '%';

        // Update Right Sidebar Gadget RAM
        const gRamVal = document.getElementById('gadget-ram-val');
        const gRamBar = document.getElementById('gadget-ram-bar');
        if (gRamVal) gRamVal.textContent = `${ramUsed} MB`;
        if (gRamBar) gRamBar.style.width = ramPct + '%';

        // CPU gauge simulation (8% to 45%)
        const cpuPct = 8 + Math.floor(Math.random() * 37);
        const cpuVal = document.getElementById('sysmon-cpu-val');
        const cpuFill = document.getElementById('sysmon-cpu-fill');
        if (cpuVal) cpuVal.textContent = `${cpuPct}% Load`;
        if (cpuFill) cpuFill.style.width = cpuPct + '%';

        // Update Right Sidebar Gadget CPU
        const gCpuVal = document.getElementById('gadget-cpu-val');
        const gCpuBar = document.getElementById('gadget-cpu-bar');
        if (gCpuVal) gCpuVal.textContent = `${cpuPct}%`;
        if (gCpuBar) gCpuBar.style.width = cpuPct + '%';
      }, 2000);
    }
  };

  // 6. TRAIL PROGRESS TRACKER ENGINE (WITH LOCALSTORAGE PERSISTENCE)
  const TrailTrackerEngine = {
    init() {
      const saved = JSON.parse(localStorage.getItem('prometheus_trail_progress') || '{}');
      const checkboxes = document.querySelectorAll('.checklist-cb');
      checkboxes.forEach((cb, idx) => {
        const item = cb.closest('.checklist-item');
        if (saved[idx] !== undefined) {
          item.setAttribute('data-done', saved[idx] ? 'true' : 'false');
          cb.textContent = saved[idx] ? '✓' : '';
        }
        cb.addEventListener('click', () => {
          const isDone = item.getAttribute('data-done') === 'true';
          const nextState = !isDone;
          item.setAttribute('data-done', nextState ? 'true' : 'false');
          cb.textContent = nextState ? '✓' : '';
          this.updateProgress();
          AudioFX.playBeep(nextState ? 750 : 350, 0.05, 'sine');
        });
      });
      this.updateProgress();
    },
    updateProgress() {
      const items = document.querySelectorAll('.checklist-item');
      let doneCount = 0;
      const stateObj = {};
      items.forEach((item, idx) => {
        const isDone = item.getAttribute('data-done') === 'true';
        stateObj[idx] = isDone;
        if (isDone) doneCount++;
      });
      localStorage.setItem('prometheus_trail_progress', JSON.stringify(stateObj));
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
          resLine.innerHTML = `Available Commands:<br>- <b>trails</b>: List learning tracks<br>- <b>mentors</b>: Peer mentor list<br>- <b>events</b>: View hackathons<br>- <b>matrix</b>: Toggle Matrix digital rain<br>- <b>sysmon</b>: Open System Monitor<br>- <b>snake</b>: Launch Snake Arcade<br>- <b>game</b>: Launch CodeBreaker<br>- <b>whoami</b>: Current user role<br>- <b>reboot</b>: Replay BIOS boot sequence<br>- <b>clear</b>: Clear terminal screen`;
          break;
        case 'trails':
          resLine.textContent = "Trails: [01] Fundamentals [02] Web [03] Backend [04] ML [05] AppDev [06] CP [07] Open Source";
          break;
        case 'mentors':
          resLine.textContent = "Team: Ms. Nishmitha (Faculty Coordinator), Cyrus (President), Aaron (Vice President)";
          break;
        case 'events':
          resLine.textContent = "Events: CodeSprint 2026 National Hackathon, Skunkworks Hardware Lab, Deep Work Sprints";
          break;
        case 'matrix':
          MatrixRainController.toggle();
          resLine.textContent = "Matrix digital rain toggled.";
          break;
        case 'sysmon':
          WindowManager.openWindow('sysmon-win');
          resLine.textContent = "SysMon.exe launched.";
          break;
        case 'snake':
          WindowManager.openWindow('snake-win');
          resLine.textContent = "Snake.exe launched.";
          break;
        case 'game':
          WindowManager.openWindow('memory-win');
          resLine.textContent = "CodeBreaker.exe launched.";
          break;
        case 'whoami':
          resLine.textContent = "guest_coder (Permissions: Full Skunkworks Access)";
          break;
        case 'sudo':
          resLine.textContent = "Access Granted: Welcome Skunkworks Administrator.";
          break;
        case 'reboot':
          BootController.replayBoot();
          resLine.textContent = "Rebooting system...";
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
            WindowManager.openWindow('browser-win');
          }
        });
      });
    }
  };

  // 11. BACKGROUND CANVAS PARTICLES & GRID CONTROLLER
  const BackgroundCanvasController = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },

    init() {
      this.canvas = document.getElementById('bg-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();

      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      this.createParticles();
      this.animate();
    },

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createParticles() {
      const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.8 + 0.8
        });
      }
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw subtle grid lines
      this.ctx.strokeStyle = 'rgba(27, 59, 54, 0.15)';
      this.ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < this.canvas.width; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
      }
      for (let y = 0; y < this.canvas.height; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
        this.ctx.stroke();
      }

      // Draw & update particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;

        this.ctx.fillStyle = 'rgba(47, 212, 196, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            this.ctx.strokeStyle = `rgba(47, 212, 196, ${0.15 * (1 - dist / 100)})`;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (this.mouse.x && this.mouse.y) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            this.ctx.strokeStyle = `rgba(127, 237, 224, ${0.35 * (1 - dist / 130)})`;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  };

  // 12. SYSMON SPARKLINE CHART CONTROLLER
  const SysMonChartController = {
    canvas: null,
    ctx: null,
    history: [],
    maxPoints: 30,

    init() {
      this.canvas = document.getElementById('sysmon-chart');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      for (let i = 0; i < this.maxPoints; i++) {
        this.history.push(20 + Math.floor(Math.random() * 15));
      }
      setInterval(() => this.update(), 1000);
      this.render();
    },

    update() {
      const last = this.history[this.history.length - 1];
      const next = Math.max(10, Math.min(85, last + (Math.floor(Math.random() * 15) - 7)));
      this.history.push(next);
      if (this.history.length > this.maxPoints) this.history.shift();
      this.render();
    },

    render() {
      if (!this.canvas || !this.ctx) return;
      const w = this.canvas.width = this.canvas.clientWidth;
      const h = this.canvas.height = this.canvas.clientHeight;

      this.ctx.clearRect(0, 0, w, h);
      this.ctx.fillStyle = '#0A1614';
      this.ctx.fillRect(0, 0, w, h);

      if (this.history.length < 2) return;

      const step = w / (this.maxPoints - 1);
      this.ctx.beginPath();
      this.ctx.moveTo(0, h - (this.history[0] / 100) * h);

      for (let i = 1; i < this.history.length; i++) {
        const x = i * step;
        const y = h - (this.history[i] / 100) * h;
        this.ctx.lineTo(x, y);
      }

      this.ctx.strokeStyle = '#2FD4C4';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Fill area under line
      this.ctx.lineTo(w, h);
      this.ctx.lineTo(0, h);
      this.ctx.closePath();
      const grad = this.ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(47, 212, 196, 0.35)');
      grad.addColorStop(1, 'rgba(47, 212, 196, 0.0)');
      this.ctx.fillStyle = grad;
      this.ctx.fill();
    }
  };

  // 13. AUDIO VISUALIZER SPECTRUM CONTROLLER
  const AudioVizController = {
    canvas: null,
    ctx: null,

    init() {
      this.canvas = document.getElementById('audio-viz');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.animate();
    },

    animate() {
      if (!this.canvas || !this.ctx) return;
      const w = this.canvas.width;
      const h = this.canvas.height;

      this.ctx.clearRect(0, 0, w, h);

      const bars = 6;
      const barW = (w - (bars - 1) * 2) / bars;

      for (let i = 0; i < bars; i++) {
        let val;
        if (AudioFX.enabled) {
          val = Math.random() * (h - 3) + 3;
        } else {
          val = 2;
        }
        const x = i * (barW + 2);
        const y = h - val;

        this.ctx.fillStyle = AudioFX.enabled ? '#7FEDE0' : '#0F6158';
        this.ctx.fillRect(x, y, barW, val);
      }

      setTimeout(() => requestAnimationFrame(() => this.animate()), 120);
    }
  };

  // 14. LIGHTBOX MODAL CONTROLLER
  const LightboxController = {
    modal: null,
    img: null,
    caption: null,

    init() {
      this.modal = document.getElementById('lightbox-modal');
      this.img = document.getElementById('lightbox-img');
      this.caption = document.getElementById('lightbox-caption');
      const closeBtn = document.getElementById('lightbox-close');

      if (!this.modal) return;

      const galleryCards = document.querySelectorAll('.gallery-card');
      galleryCards.forEach(card => {
        card.addEventListener('click', () => {
          const cardImg = card.querySelector('.gallery-img');
          const cardTitle = card.querySelector('.gallery-title');
          if (cardImg) {
            this.img.src = cardImg.src;
            this.caption.textContent = cardTitle ? cardTitle.textContent : '';
            this.modal.classList.add('open');
            AudioFX.playBeep(900, 0.06, 'sine');
          }
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('open')) {
          this.close();
        }
      });
    },

    close() {
      if (this.modal) this.modal.classList.remove('open');
    }
  };

  // 15. MATRIX DIGITAL RAIN CONTROLLER
  const MatrixRainController = {
    canvas: null,
    ctx: null,
    columns: 0,
    drops: [],
    interval: null,
    active: false,

    init() {
      this.canvas = document.getElementById('matrix-canvas');
      const btn = document.getElementById('tray-matrix-btn');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      if (btn) {
        btn.addEventListener('click', () => this.toggle());
      }
    },

    toggle() {
      this.active = !this.active;
      const btn = document.getElementById('tray-matrix-btn');
      if (this.active) {
        this.canvas.classList.add('active');
        if (btn) btn.style.borderColor = 'var(--teal-bright)';
        this.start();
        AudioFX.playBeep(1200, 0.08, 'sine');
      } else {
        this.canvas.classList.remove('active');
        if (btn) btn.style.borderColor = 'var(--border)';
        this.stop();
        AudioFX.playBeep(400, 0.08, 'sine');
      }
    },

    start() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = Math.floor(this.canvas.width / 18);
      this.drops = [];
      for (let i = 0; i < this.columns; i++) {
        this.drops[i] = Math.floor(Math.random() * -50);
      }

      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => this.draw(), 40);
    },

    stop() {
      if (this.interval) clearInterval(this.interval);
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    draw() {
      if (!this.active || !this.ctx) return;
      this.ctx.fillStyle = 'rgba(10, 22, 20, 0.12)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = '#7FEDE0';
      this.ctx.font = '12px "JetBrains Mono", monospace';

      const chars = '01PROMETHEUS_ALOYSIUS_SKUNKWORKS_KERNEL_SYSTEM_CODE_01';

      for (let i = 0; i < this.drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * 18;
        const y = this.drops[i] * 18;

        this.ctx.fillText(text, x, y);

        if (y > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i]++;
      }
    }
  };

  // 16. DESKTOP MASCOT COMPANION (TASKBAR WALKING WITH GRAVITY PHYSICS)
  const MascotPetController = {
    pet: null,
    bubble: null,
    isDragging: false,
    isWalking: false,
    dragOffset: { x: 0, y: 0 },
    idleTimer: null,
    walkTimer: null,
    gravityTimer: null,
    quotes: [
      "Select an icon to launch a window.",
      "Drag the mascot to test gravity physics!",
      "Click Mentors to view club leaders.",
      "Click Progress to track completed sessions.",
      "Use Terminal to execute system commands.",
      "Ms. Nishmitha is the Club Coordinator.",
      "System operates at peak efficiency.",
      "Play Snake.exe to set high scores."
    ],
    quoteIdx: 0,

    init() {
      this.pet = document.getElementById('desktop-pet');
      this.bubble = document.getElementById('pet-speech-bubble');
      if (!this.pet || !this.bubble) return;

      this.setupDragging();
      this.setupInteractions();
      this.startTaskbarWalking();
      this.startIdleChatter();
    },

    setupDragging() {
      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        this.isDragging = true;
        this.stopWalking();
        if (this.gravityTimer) cancelAnimationFrame(this.gravityTimer);

        this.pet.classList.add('dragging');
        this.pet.classList.remove('walking');

        const rect = this.pet.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;

        this.say("Lifted mascot...");
        AudioFX.playBeep(950, 0.05, 'sine');

        const onMouseMove = (moveEvent) => {
          if (!this.isDragging) return;
          const x = Math.max(10, Math.min(window.innerWidth - 100, moveEvent.clientX - this.dragOffset.x));
          const y = Math.max(10, Math.min(window.innerHeight - 130, moveEvent.clientY - this.dragOffset.y));
          this.pet.style.left = x + 'px';
          this.pet.style.top = y + 'px';
          this.pet.style.right = 'auto';
          this.pet.style.bottom = 'auto';
        };

        const onMouseUp = () => {
          if (!this.isDragging) return;
          this.isDragging = false;
          this.pet.classList.remove('dragging');

          // Apply Gravity Physics to drop mascot back to taskbar floor
          this.applyGravity();

          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      this.pet.addEventListener('mousedown', onMouseDown);
    },

    applyGravity() {
      // Taskbar ground Y coordinate (top of taskbar)
      const groundY = window.innerHeight - 135;
      const rect = this.pet.getBoundingClientRect();
      let currentY = rect.top;
      let velocityY = 0;
      const gravity = 1.8;

      if (currentY >= groundY) {
        this.pet.style.top = groundY + 'px';
        this.say("Landed on taskbar!");
        AudioFX.playBeep(700, 0.06, 'triangle');
        return;
      }

      this.say("Falling with gravity...");

      const stepGravity = () => {
        if (this.isDragging) return;
        velocityY += gravity;
        currentY += velocityY;

        if (currentY >= groundY) {
          currentY = groundY;
          this.pet.style.top = groundY + 'px';
          this.say("Landed safely!");
          AudioFX.playBeep(650, 0.08, 'triangle');
          setTimeout(() => AudioFX.playBeep(900, 0.08, 'sine'), 80);
          return;
        }

        this.pet.style.top = currentY + 'px';
        this.gravityTimer = requestAnimationFrame(stepGravity);
      };

      this.gravityTimer = requestAnimationFrame(stepGravity);
    },

    setupInteractions() {
      this.pet.addEventListener('mouseenter', () => {
        if (!this.isDragging && !this.isWalking) {
          this.say("Hello builder!");
          AudioFX.playBeep(1100, 0.04, 'sine');
        }
      });

      this.pet.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioFX.playBeep(1300, 0.08, 'sine');
        setTimeout(() => AudioFX.playBeep(1600, 0.08, 'sine'), 90);

        this.quoteIdx = (this.quoteIdx + 1) % this.quotes.length;
        this.say(this.quotes[this.quoteIdx]);
      });
    },

    startTaskbarWalking() {
      // Mascot periodically steps and walks along top edge of taskbar
      setInterval(() => {
        if (!this.isDragging && !this.isWalking && Math.random() > 0.3) {
          this.walkOnTaskbar();
        }
      }, 13000);
    },

    walkOnTaskbar() {
      this.isWalking = true;
      this.pet.classList.add('walking');

      const rect = this.pet.getBoundingClientRect();
      const currentX = rect.left;
      const groundY = window.innerHeight - 135;

      // Choose a target X spot on taskbar
      const targetX = Math.max(160, Math.min(window.innerWidth - 240, Math.random() * (window.innerWidth - 400) + 160));

      if (targetX < currentX) {
        this.pet.classList.add('facing-left');
      } else {
        this.pet.classList.remove('facing-left');
      }

      this.pet.style.left = currentX + 'px';
      this.pet.style.top = groundY + 'px';
      this.pet.style.right = 'auto';
      this.pet.style.bottom = 'auto';

      const duration = 2800;
      const startTime = performance.now();

      const stepWalk = (now) => {
        if (this.isDragging) {
          this.stopWalking();
          return;
        }
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;

        const nowX = currentX + (targetX - currentX) * easeProgress;
        this.pet.style.left = nowX + 'px';

        if (progress < 1) {
          this.walkTimer = requestAnimationFrame(stepWalk);
        } else {
          this.stopWalking();
          this.say("Inspecting taskbar...", 2200);
        }
      };

      this.walkTimer = requestAnimationFrame(stepWalk);
    },

    stopWalking() {
      this.isWalking = false;
      this.pet.classList.remove('walking');
      if (this.walkTimer) cancelAnimationFrame(this.walkTimer);
    },

    startIdleChatter() {
      setInterval(() => {
        if (!this.isDragging && !this.isWalking && Math.random() > 0.4) {
          const randomMsg = this.quotes[Math.floor(Math.random() * this.quotes.length)];
          this.say(randomMsg, 3500);
        }
      }, 16000);
    },

    say(msg, duration = 3000) {
      if (!this.bubble) return;
      this.bubble.textContent = msg;
      this.bubble.classList.add('show');

      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.bubble.classList.remove('show');
      }, duration);
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
    BackgroundCanvasController.init();
    SysMonChartController.init();
    AudioVizController.init();
    LightboxController.init();
    MatrixRainController.init();
    MascotPetController.init();
  });

})();
