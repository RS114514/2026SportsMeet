/**
 * 2026 春晖中学校运会 · 希沃白板工作引导系统核心控制器 (app.js)
 * 实现赛场矢量场景渲染、动态机位光波、时间轴步进、白板触控墨水批注与弹窗交互
 */

(function () {
    const DATA = window.STADIUM_DATA;

    // 运行状态
    const state = {
        dayIndex: 0,
        periodIndex: 0,
        isPlaying: false,
        playTimer: null,
        isDrawingMode: false,
        penColor: "#ef4444",
        penSize: 4,
        isEraser: false,
        activeModalCameraId: null,
        checkedPriorities: new Set()
    };

    // DOM 元素缓存
    const els = {
        dayTabs: document.querySelectorAll(".day-tab"),
        stadiumSvg: document.getElementById("stadium-svg"),
        whiteboardCanvas: document.getElementById("whiteboard-canvas"),
        penToolbar: document.getElementById("pen-toolbar"),
        penToggleBtn: document.getElementById("btn-pen-toggle"),
        fullscreenBtn: document.getElementById("btn-fullscreen"),
        btnPlay: document.getElementById("btn-play"),
        btnPrev: document.getElementById("btn-prev"),
        btnNext: document.getElementById("btn-next"),
        periodTracks: document.getElementById("period-tracks"),
        deckBadgeTime: document.getElementById("deck-badge-time"),
        deckTimeTitle: document.getElementById("deck-time-title"),
        deckEventSummary: document.getElementById("deck-event-summary"),
        deckAlertContainer: document.getElementById("deck-alert-container"),
        priorityList: document.getElementById("priority-list"),
        crewList: document.getElementById("crew-list"),
        cameraModalOverlay: document.getElementById("camera-modal-overlay"),
        cameraModalClose: document.getElementById("camera-modal-close"),
        modalCamTitle: document.getElementById("modal-cam-title"),
        modalCamType: document.getElementById("modal-cam-type"),
        modalCamLens: document.getElementById("modal-cam-lens"),
        modalCamRig: document.getElementById("modal-cam-rig"),
        modalCamMode: document.getElementById("modal-cam-mode"),
        modalCamDesc: document.getElementById("modal-cam-desc"),
        modalCamSafety: document.getElementById("modal-cam-safety")
    };

    // 白板 Canvas 上下文与触控笔迹缓存
    let ctx = null;
    let isPointerDown = false;
    let lastPoint = { x: 0, y: 0 };

    /**
     * 初始化系统
     */
    function init() {
        renderStadiumSvg();
        initWhiteboardCanvas();
        bindEvents();
        updateDayView(0);
    }

    /**
     * 1. 赛场真实矢量场景还原渲染
     */
    function renderStadiumSvg() {
        const svg = els.stadiumSvg;
        svg.setAttribute("viewBox", "0 0 1200 750");

        let svgHtml = `
            <defs>
                <!-- 草坪草纹渐变 -->
                <radialGradient id="grassGrad" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stop-color="#15803d" />
                    <stop offset="100%" stop-color="#14532d" />
                </radialGradient>
                <!-- 塑胶跑道红渐变 -->
                <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#b91c1c" />
                    <stop offset="50%" stop-color="#c2410c" />
                    <stop offset="100%" stop-color="#9a3412" />
                </linearGradient>
                <!-- 沙坑金沙渐变 -->
                <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#fde047" />
                    <stop offset="50%" stop-color="#eab308" />
                    <stop offset="100%" stop-color="#ca8a04" />
                </linearGradient>
                <!-- 机位脉冲光波发光滤镜 -->
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <!-- 1. 场地底座 -->
            <rect x="0" y="0" width="1200" height="750" fill="#090d16" rx="20" />

            <!-- 2. 北看台与台阶纹理 -->
            <path d="M 280,30 L 920,30 L 960,65 L 240,65 Z" fill="#1e293b" stroke="#334155" stroke-width="2" />
            <text x="600" y="52" fill="#94a3b8" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="4">北看台 · 全校班级大本营观众席</text>

            <!-- 3. 400米塑胶跑道 (经典圆弧加直道胶囊体) -->
            <!-- 跑道外边缘 (长 600, 弯道半径 260) -->
            <rect x="250" y="90" width="700" height="520" rx="260" fill="url(#trackGrad)" stroke="#451a03" stroke-width="6" />

            <!-- 跑道分道白线 (8条道模拟线) -->
            <rect x="260" y="100" width="680" height="500" rx="250" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="8,6" />
            <rect x="272" y="112" width="656" height="476" rx="238" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
            <rect x="284" y="124" width="632" height="452" rx="226" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
            <rect x="296" y="136" width="608" height="428" rx="214" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
            <rect x="308" y="148" width="584" height="404" rx="202" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />

            <!-- 4. 跑道内圈绿茵草坪 -->
            <rect x="320" y="160" width="560" height="380" rx="190" fill="url(#grassGrad)" stroke="#166534" stroke-width="4" />

            <!-- 5. 足球场草坪白线 (中圈、半场线、禁区) -->
            <line x1="600" y1="160" x2="600" y2="540" stroke="rgba(255,255,255,0.5)" stroke-width="2" />
            <circle cx="600" cy="350" r="60" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" />
            <circle cx="600" cy="350" r="3" fill="#fff" />
            <!-- 西禁区 -->
            <rect x="320" y="270" width="80" height="160" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <!-- 东禁区 -->
            <rect x="800" y="270" width="80" height="160" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />

            <!-- 6. 100米直道起点与终点冲刺线 -->
            <!-- 起跑线 (北端) -->
            <line x1="250" y1="105" x2="320" y2="105" stroke="#ffffff" stroke-width="5" />
            <text x="375" y="102" fill="#facc15" font-size="12" font-weight="bold">⚡ 100米起点</text>

            <!-- 终点冲刺线 (南端红白交错线) -->
            <line x1="250" y1="595" x2="320" y2="595" stroke="#ffffff" stroke-width="6" />
            <line x1="250" y1="595" x2="320" y2="595" stroke="#ef4444" stroke-width="6" stroke-dasharray="10,10" />
            <text x="360" y="600" fill="#f87171" font-size="13" font-weight="bold">🏁 终点冲刺线</text>

            <!-- 7. 田赛专项区域 -->
            <!-- A. 跳远沙坑区 (西草坪) -->
            <g id="zone-sandpit" transform="translate(430, 310)">
                <!-- 助跑跑道 -->
                <rect x="0" y="30" width="90" height="16" fill="#c2410c" rx="4" />
                <!-- 白色起跳板 -->
                <rect x="85" y="28" width="6" height="20" fill="#ffffff" />
                <!-- 真实沙坑池 -->
                <rect x="95" y="15" width="85" height="46" rx="8" fill="url(#sandGrad)" stroke="#a16207" stroke-width="2" />
                <text x="137" y="42" fill="#78350f" font-size="11" font-weight="bold" text-anchor="middle">跳远沙坑</text>
            </g>

            <!-- B. 跳高海绵垫区 (东草坪) -->
            <g id="zone-highjump" transform="translate(670, 315)">
                <!-- 助跑弧线 -->
                <path d="M 0,90 Q 50,70 65,40" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="4,4" />
                <!-- 蓝色海绵垫 -->
                <rect x="55" y="10" width="75" height="50" rx="8" fill="#1d4ed8" stroke="#3b82f6" stroke-width="3" />
                <!-- 横杆立柱与红色横杆 -->
                <circle cx="55" cy="5" r="4" fill="#64748b" />
                <circle cx="130" cy="5" r="4" fill="#64748b" />
                <line x1="55" y1="5" x2="130" y2="5" stroke="#ef4444" stroke-width="3" />
                <text x="92" y="40" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">跳高垫</text>
            </g>

            <!-- C. 铅球投掷圈 (西北角) -->
            <g id="zone-shotput" transform="translate(450, 185)">
                <!-- 投掷圈 -->
                <circle cx="25" cy="25" r="22" fill="#475569" stroke="#cbd5e1" stroke-width="3" />
                <!-- 抵趾板 -->
                <path d="M 40,12 A 22,22 0 0 1 40,38" fill="none" stroke="#ffffff" stroke-width="5" />
                <!-- 扇形落地区边界虚线 -->
                <line x1="45" y1="20" x2="95" y2="5" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4,3" />
                <line x1="45" y1="30" x2="95" y2="45" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4,3" />
                <text x="25" y="29" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">铅球</text>
            </g>

            <!-- D. 立定跳远垫 (西南角) -->
            <g id="zone-standjump" transform="translate(450, 480)">
                <rect x="0" y="0" width="70" height="32" rx="6" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
                <text x="35" y="20" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">立定跳远</text>
            </g>

            <!-- 8. 主席台与计时裁判中心 (南侧) -->
            <g id="zone-rostrum" transform="translate(420, 645)">
                <rect x="0" y="0" width="360" height="75" rx="14" fill="#1e293b" stroke="#475569" stroke-width="2" />
                <!-- 领导席桌椅与顶棚装饰 -->
                <rect x="30" y="12" width="300" height="20" rx="4" fill="#334155" />
                <text x="180" y="26" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">🏛️ 主席台 · 官方计时裁判席与指挥中心</text>
                <!-- 终点计时台凸出部 -->
                <rect x="-40" y="10" width="60" height="40" rx="6" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />
                <text x="-10" y="34" fill="#f43f5e" font-size="10" font-weight="bold" text-anchor="middle">计时裁判台</text>
            </g>

            <!-- 9. 检录处与广播台地标标签 -->
            <g transform="translate(200, 665)">
                <rect x="0" y="0" width="110" height="36" rx="8" fill="#14532d" stroke="#22c55e" stroke-width="1.5" />
                <text x="55" y="23" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">📋 官方检录处</text>
            </g>

            <!-- 10. 机位节点图层 (由 JS 动态生成附带动画) -->
            <g id="camera-pins-layer"></g>
        `;

        svg.innerHTML = svgHtml;
    }

    /**
     * 2. 动态更新赛场机位标记 (带雷达光环波纹动画)
     */
    function updateCameraPins(activeCamIds) {
        const layer = document.getElementById("camera-pins-layer");
        if (!layer) return;

        let pinsHtml = "";
        const allCameras = DATA.cameras;

        Object.keys(allCameras).forEach((camId) => {
            const cam = allCameras[camId];
            const isActive = activeCamIds.includes(camId);

            pinsHtml += `
                <g class="svg-camera-pin ${isActive ? "active" : ""}" 
                   id="pin-${cam.id}" 
                   data-cam-id="${cam.id}"
                   transform="translate(${cam.x}, ${cam.y})"
                   filter="${isActive ? "url(#neonGlow)" : ""}">
                    
                    <!-- 动态雷达波纹圈 -->
                    <circle class="pin-radar" cx="0" cy="0" r="16" fill="none" 
                            stroke="${isActive ? "#10b981" : "#64748b"}" 
                            stroke-width="2" 
                            style="display: ${isActive ? "block" : "none"};" />
                    
                    <!-- 机位主图标底盘 -->
                    <circle cx="0" cy="0" r="17" 
                            fill="${isActive ? "#0f172a" : "#1e293b"}" 
                            stroke="${isActive ? "#10b981" : "#475569"}" 
                            stroke-width="${isActive ? "3.5" : "1.5"}" />
                    
                    <!-- 摄像机 Emoji / 编号 -->
                    <text x="0" y="5" font-size="14" text-anchor="middle">📹</text>
                    
                    <!-- 机位名称微型胶囊浮标 -->
                    <g transform="translate(0, -23)">
                        <rect x="-42" y="-14" width="84" height="20" rx="10" 
                              fill="${isActive ? "rgba(16, 185, 129, 0.95)" : "rgba(30, 41, 59, 0.85)"}" 
                              stroke="${isActive ? "#ffffff" : "#475569"}" 
                              stroke-width="1" />
                        <text x="0" y="0" font-size="10.5" font-weight="bold" 
                              fill="${isActive ? "#022c22" : "#94a3b8"}" 
                              text-anchor="middle">${cam.name.split(" ")[0]}</text>
                    </g>
                </g>
            `;
        });

        layer.innerHTML = pinsHtml;

        // 重新挂载机位触控点击事件
        layer.querySelectorAll(".svg-camera-pin").forEach((pinEl) => {
            pinEl.addEventListener("click", () => {
                const camId = pinEl.getAttribute("data-cam-id");
                openCameraModal(camId);
            });
        });
    }

    /**
     * 3. 切换日期与时间段视图
     */
    function updateDayView(dayIdx) {
        state.dayIndex = dayIdx;
        state.periodIndex = 0;

        // 更新顶部 Tab 状态
        els.dayTabs.forEach((tab, i) => {
            tab.classList.toggle("active", i === dayIdx);
        });

        const currentDay = DATA.timelineDays[dayIdx];

        // 渲染底部时间段轨道
        let periodsHtml = "";
        currentDay.periods.forEach((p, idx) => {
            periodsHtml += `
                <div class="period-card ${idx === 0 ? "active" : ""}" data-period-idx="${idx}">
                    <span class="period-time">${p.timeRange}</span>
                    <span class="period-title">${p.periodLabel}</span>
                </div>
            `;
        });
        els.periodTracks.innerHTML = periodsHtml;

        // 挂载时间段点击事件
        els.periodTracks.querySelectorAll(".period-card").forEach((card) => {
            card.addEventListener("click", () => {
                const idx = parseInt(card.getAttribute("data-period-idx"), 10);
                selectPeriod(idx);
            });
        });

        selectPeriod(0);
    }

    /**
     * 4. 激活特定时间段并刷新指挥中心与机位
     */
    function selectPeriod(periodIdx) {
        state.periodIndex = periodIdx;
        const currentDay = DATA.timelineDays[state.dayIndex];
        const period = currentDay.periods[periodIdx];

        // 轨道卡片激活态
        els.periodTracks.querySelectorAll(".period-card").forEach((card, i) => {
            card.classList.toggle("active", i === periodIdx);
        });

        // 平滑滚动卡片入视野
        const activeCard = els.periodTracks.children[periodIdx];
        if (activeCard) {
            activeCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }

        // 刷新右侧指挥中心卡片
        els.deckBadgeTime.textContent = `${currentDay.dateStr} · ${period.timeRange}`;
        els.deckTimeTitle.textContent = period.periodLabel;
        els.deckEventSummary.textContent = period.majorEvent;

        // 刷新预警横幅 (社团自家人参赛避让)
        if (period.internalAlerts && period.internalAlerts.length > 0) {
            els.deckAlertContainer.innerHTML = period.internalAlerts
                .map(
                    (alert) => `
                <div class="alert-banner">
                    <span class="alert-icon">🚨</span>
                    <div class="alert-content">
                        <h4>社团成员参赛离岗避让 / 专机盯防预警</h4>
                        <p>${alert}</p>
                    </div>
                </div>
            `
                )
                .join("");
            els.deckAlertContainer.style.display = "block";
        } else {
            els.deckAlertContainer.innerHTML = "";
            els.deckAlertContainer.style.display = "none";
        }

        // 刷新重点必抓镜头清单 (带触控勾选体验)
        let priHtml = "";
        period.priorityShots.forEach((shot, i) => {
            const key = `${state.dayIndex}_${periodIdx}_${i}`;
            const isChecked = state.checkedPriorities.has(key);
            priHtml += `
                <div class="priority-item ${isChecked ? "checked" : ""}" data-pri-key="${key}">
                    <div class="priority-checkbox">${isChecked ? "✓" : ""}</div>
                    <div class="priority-text">${shot}</div>
                </div>
            `;
        });
        els.priorityList.innerHTML = priHtml;

        // 挂载勾选监听
        els.priorityList.querySelectorAll(".priority-item").forEach((item) => {
            item.addEventListener("click", () => {
                const key = item.getAttribute("data-pri-key");
                if (state.checkedPriorities.has(key)) {
                    state.checkedPriorities.delete(key);
                    item.classList.remove("checked");
                    item.querySelector(".priority-checkbox").textContent = "";
                } else {
                    state.checkedPriorities.add(key);
                    item.classList.add("checked");
                    item.querySelector(".priority-checkbox").textContent = "✓";
                }
            });
        });

        // 刷新当班人员与推荐机位列表
        let crewHtml = "";
        period.crew.forEach((c) => {
            crewHtml += `
                <div class="crew-item">
                    <div class="crew-item-top">
                        <div class="crew-name-badge">
                            <span class="crew-name">${c.name}</span>
                            <span class="crew-role">${c.role}</span>
                        </div>
                    </div>
                    <div class="crew-task">${c.task}</div>
                </div>
            `;
        });
        els.crewList.innerHTML = crewHtml;

        // 同步更新赛场活跃机位
        updateCameraPins(period.activeCameras);
    }

    /**
     * 5. 自动巡航 / 播放器时间推进
     */
    function togglePlay() {
        state.isPlaying = !state.isPlaying;
        els.btnPlay.classList.toggle("play-active", state.isPlaying);
        els.btnPlay.textContent = state.isPlaying ? "⏸️" : "▶️";

        if (state.isPlaying) {
            runAutoPlay();
        } else {
            clearInterval(state.playTimer);
        }
    }

    function runAutoPlay() {
        clearInterval(state.playTimer);
        state.playTimer = setInterval(() => {
            const currentDay = DATA.timelineDays[state.dayIndex];
            if (state.periodIndex < currentDay.periods.length - 1) {
                selectPeriod(state.periodIndex + 1);
            } else {
                // 推进到下一天
                if (state.dayIndex < DATA.timelineDays.length - 1) {
                    updateDayView(state.dayIndex + 1);
                } else {
                    // 回到第一天
                    updateDayView(0);
                }
            }
        }, 5000);
    }

    /**
     * 6. 机位详情弹窗 (Whiteboard Modal)
     */
    function openCameraModal(camId) {
        const cam = DATA.cameras[camId];
        if (!cam) return;

        state.activeModalCameraId = camId;
        els.modalCamTitle.textContent = cam.name;
        els.modalCamType.textContent = `机位类型：${cam.type}`;
        els.modalCamLens.textContent = cam.lens;
        els.modalCamRig.textContent = cam.rig;
        els.modalCamMode.textContent = cam.mode;
        els.modalCamDesc.textContent = cam.desc;
        els.modalCamSafety.textContent = `【安全警示与站位红线】：${cam.safetyNotice}`;

        els.cameraModalOverlay.classList.add("active");
    }

    function closeCameraModal() {
        els.cameraModalOverlay.classList.remove("active");
        state.activeModalCameraId = null;
    }

    /**
     * 7. 希沃白板电子墨水涂鸦系统 (触控批注)
     */
    function initWhiteboardCanvas() {
        const canvas = els.whiteboardCanvas;
        ctx = canvas.getContext("2d");
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // 统一 Pointer 事件 (支持手指、白板触控笔、鼠标)
        canvas.addEventListener("pointerdown", handlePointerDown);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerup", handlePointerUp);
        canvas.addEventListener("pointercancel", handlePointerUp);
    }

    function resizeCanvas() {
        const container = document.querySelector(".stadium-map-container");
        if (!container) return;
        const rect = container.getBoundingClientRect();
        els.whiteboardCanvas.width = rect.width;
        els.whiteboardCanvas.height = rect.height;
    }

    function toggleDrawingMode() {
        state.isDrawingMode = !state.isDrawingMode;
        els.penToggleBtn.classList.toggle("active", state.isDrawingMode);
        els.whiteboardCanvas.classList.toggle("drawing-active", state.isDrawingMode);
        els.penToolbar.style.display = state.isDrawingMode ? "flex" : "none";
    }

    function handlePointerDown(e) {
        if (!state.isDrawingMode) return;
        isPointerDown = true;
        const rect = els.whiteboardCanvas.getBoundingClientRect();
        lastPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function handlePointerMove(e) {
        if (!isPointerDown || !state.isDrawingMode) return;
        const rect = els.whiteboardCanvas.getBoundingClientRect();
        const currentPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);

        if (state.isEraser) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 24;
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = state.penColor;
            ctx.lineWidth = state.penSize;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = 4;
            ctx.shadowColor = state.penColor;
        }

        ctx.stroke();
        lastPoint = currentPoint;
    }

    function handlePointerUp() {
        isPointerDown = false;
    }

    function clearWhiteboard() {
        ctx.clearRect(0, 0, els.whiteboardCanvas.width, els.whiteboardCanvas.height);
    }

    /**
     * 8. 全屏模式切换 (适合 65/86寸 希沃白板)
     */
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.warn("Fullscreen request error:", err);
            });
            els.fullscreenBtn.textContent = "↙️ 退出全屏";
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            els.fullscreenBtn.textContent = "⛶ 希沃白板全屏";
        }
    }

    /**
     * 9. 事件绑定
     */
    function bindEvents() {
        // 日期 Tab
        els.dayTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const dayIdx = parseInt(tab.getAttribute("data-day-idx"), 10);
                updateDayView(dayIdx);
            });
        });

        // 播放控制
        els.btnPlay.addEventListener("click", togglePlay);
        els.btnPrev.addEventListener("click", () => {
            if (state.periodIndex > 0) {
                selectPeriod(state.periodIndex - 1);
            }
        });
        els.btnNext.addEventListener("click", () => {
            const currentDay = DATA.timelineDays[state.dayIndex];
            if (state.periodIndex < currentDay.periods.length - 1) {
                selectPeriod(state.periodIndex + 1);
            }
        });

        // 白板画笔开关与全屏
        els.penToggleBtn.addEventListener("click", toggleDrawingMode);
        els.fullscreenBtn.addEventListener("click", toggleFullscreen);

        // 弹窗关闭
        els.cameraModalClose.addEventListener("click", closeCameraModal);
        els.cameraModalOverlay.addEventListener("click", (e) => {
            if (e.target === els.cameraModalOverlay) {
                closeCameraModal();
            }
        });

        // 白板浮动工具条颜色选择
        document.querySelectorAll(".color-dot").forEach((dot) => {
            dot.addEventListener("click", () => {
                document.querySelectorAll(".color-dot").forEach((d) => d.classList.remove("active"));
                dot.classList.add("active");
                state.isEraser = false;
                state.penColor = dot.getAttribute("data-color");
            });
        });

        // 橡皮擦与清屏
        const btnEraser = document.getElementById("btn-pen-eraser");
        if (btnEraser) {
            btnEraser.addEventListener("click", () => {
                state.isEraser = !state.isEraser;
                btnEraser.classList.toggle("active", state.isEraser);
            });
        }

        const btnClear = document.getElementById("btn-pen-clear");
        if (btnClear) {
            btnClear.addEventListener("click", clearWhiteboard);
        }

        const btnClosePen = document.getElementById("btn-pen-close");
        if (btnClosePen) {
            btnClosePen.addEventListener("click", toggleDrawingMode);
        }
    }

    // 页面加载完成后启动
    window.addEventListener("DOMContentLoaded", init);
})();
