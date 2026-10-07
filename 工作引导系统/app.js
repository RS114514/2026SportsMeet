/**
 * 2026 春晖中学校运会 · 希沃白板摄制引导与排班看板控制器 (app.js)
 * 严格依据官方赛程与 21 人排班数据驱动，支持日期切换、分类过滤、人员快速查岗与全屏演示
 */

(function () {
    const DATA = window.GUIDANCE_DATA;

    // 运行状态
    const state = {
        dayIndex: 0,
        selectedCategory: "all",
        selectedMember: null,
        searchQuery: ""
    };

    // DOM 元素缓存
    const els = {
        dayTabs: document.querySelectorAll(".day-tab"),
        categoryChips: document.querySelectorAll(".filter-chip"),
        memberChipsContainer: document.getElementById("member-chips-container"),
        btnClearFilter: document.getElementById("btn-clear-filter"),
        cardsContainer: document.getElementById("cards-container"),
        currentDayTitle: document.getElementById("current-day-title"),
        currentDayTheme: document.getElementById("current-day-theme"),
        currentStatsCount: document.getElementById("current-stats-count"),
        inputSearch: document.getElementById("input-search"),
        btnFullscreen: document.getElementById("btn-fullscreen")
    };

    /**
     * 初始化看板
     */
    function init() {
        renderMemberRosterChips();
        bindEvents();
        renderBoard();
    }

    /**
     * 1. 渲染顶部 21 位成员快速查岗按钮
     */
    function renderMemberRosterChips() {
        let html = "";
        DATA.members.forEach((m) => {
            html += `<button class="member-chip" data-name="${m.name}" title="${m.grade} | ${m.team} | ${m.alert}">${m.name}</button>`;
        });
        els.memberChipsContainer.innerHTML = html;

        // 挂载人员点击事件
        els.memberChipsContainer.querySelectorAll(".member-chip").forEach((chip) => {
            chip.addEventListener("click", () => {
                const name = chip.getAttribute("data-name");
                if (state.selectedMember === name) {
                    // 取消选中
                    state.selectedMember = null;
                    chip.classList.remove("selected");
                    els.btnClearFilter.style.display = "none";
                } else {
                    // 选中该人员
                    els.memberChipsContainer.querySelectorAll(".member-chip").forEach((c) => c.classList.remove("selected"));
                    chip.classList.add("selected");
                    state.selectedMember = name;
                    els.btnClearFilter.style.display = "inline-block";
                }
                renderBoard();
            });
        });
    }

    /**
     * 2. 渲染核心赛程看板卡片列表
     */
    function renderBoard() {
        const currentDay = DATA.schedule[state.dayIndex];
        els.currentDayTitle.textContent = currentDay.dayLabel;
        els.currentDayTheme.textContent = currentDay.theme;

        // 过滤项目列表
        let filteredItems = currentDay.items.filter((item) => {
            // 分类过滤
            if (state.selectedCategory === "径赛" && !item.category.includes("径赛")) return false;
            if (state.selectedCategory === "田赛" && !item.category.includes("田赛")) return false;
            if (state.selectedCategory === "仪式" && !item.category.includes("仪式") && !item.category.includes("开幕式") && !item.category.includes("闭幕式") && !item.category.includes("归档")) return false;
            if (state.selectedCategory === "alert" && !item.alert) return false;

            // 人员查岗过滤
            if (state.selectedMember) {
                const inCrew = item.crew.includes(state.selectedMember);
                const inAlert = item.alert && item.alert.includes(state.selectedMember);
                const inContent = item.content.includes(state.selectedMember);
                if (!inCrew && !inAlert && !inContent) return false;
            }

            // 搜索词过滤
            if (state.searchQuery) {
                const q = state.searchQuery.toLowerCase();
                const text = `${item.time} ${item.event} ${item.crew} ${item.content} ${item.tips} ${item.alert || ""}`.toLowerCase();
                if (!text.includes(q)) return false;
            }

            return true;
        });

        els.currentStatsCount.textContent = `当前呈现 ${filteredItems.length} 个赛程节点`;

        if (filteredItems.length === 0) {
            els.cardsContainer.innerHTML = `
                <div class="empty-state">
                    <p>🔍 未找到符合条件的赛程节点</p>
                    <p style="font-size: 13px; margin-top: 8px;">请尝试切换分类或点击“清除人员筛选”。</p>
                </div>
            `;
            return;
        }

        let cardsHtml = "";
        filteredItems.forEach((item) => {
            // 高亮突出人员姓名
            let crewDisplay = item.crew;
            if (state.selectedMember) {
                const regex = new RegExp(`(${state.selectedMember})`, "g");
                crewDisplay = crewDisplay.replace(regex, `<span style="background: #0284c7; color: #fff; padding: 1px 6px; border-radius: 4px; font-weight: bold;">$1</span>`);
            }

            cardsHtml += `
                <article class="schedule-card">
                    <!-- 头部：时间 + 标签 + 比赛项目名称 -->
                    <div class="card-header-row">
                        <div class="card-title-group">
                            <div class="card-time-badge">
                                <span>🕒</span>
                                <span>${item.time}</span>
                            </div>
                            <span class="card-tag">${item.categoryTag}</span>
                            <h3 class="card-event-name">${escapeHtml(item.event)}</h3>
                        </div>
                    </div>

                    <!-- 社员参赛避让特别预警 (若有) -->
                    ${
                        item.alert
                            ? `
                        <div class="card-alert-box">
                            ${escapeHtml(item.alert)}
                        </div>
                    `
                            : ""
                    }

                    <!-- 核心内容两栏网格：当班人员 + 比赛内容 -->
                    <div class="card-body-grid">
                        <div class="info-block">
                            <span class="block-title">👥 当班负责人员与机位分工</span>
                            <div class="block-content">${crewDisplay}</div>
                        </div>

                        <div class="info-block">
                            <span class="block-title">📝 现场赛事与核心流程</span>
                            <div class="block-content">${escapeHtml(item.content)}</div>
                        </div>

                        <!-- 拍摄提示与技术要点 (全宽专属高亮卡) -->
                        <div class="shooting-tips-block">
                            <span class="block-title">💡 拍摄要点与技术提示</span>
                            <div class="block-content">${escapeHtml(item.tips)}</div>
                        </div>
                    </div>
                </article>
            `;
        });

        els.cardsContainer.innerHTML = cardsHtml;
    }

    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * 3. 事件绑定
     */
    function bindEvents() {
        // 日期切换 Tab
        els.dayTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const dayIdx = parseInt(tab.getAttribute("data-day-idx"), 10);
                state.dayIndex = dayIdx;
                els.dayTabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
                renderBoard();
            });
        });

        // 分类筛选
        els.categoryChips.forEach((chip) => {
            chip.addEventListener("click", () => {
                els.categoryChips.forEach((c) => c.classList.remove("active"));
                chip.classList.add("active");
                state.selectedCategory = chip.getAttribute("data-cat");
                renderBoard();
            });
        });

        // 清除人员筛选
        els.btnClearFilter.addEventListener("click", () => {
            state.selectedMember = null;
            els.memberChipsContainer.querySelectorAll(".member-chip").forEach((c) => c.classList.remove("selected"));
            els.btnClearFilter.style.display = "none";
            renderBoard();
        });

        // 搜索输入
        els.inputSearch.addEventListener("input", (e) => {
            state.searchQuery = e.target.value.trim();
            renderBoard();
        });

        // 希沃白板全屏切换
        els.btnFullscreen.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.warn("Fullscreen error:", err);
                });
                els.btnFullscreen.innerHTML = "<span>↙️</span><span>退出全屏</span>";
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                els.btnFullscreen.innerHTML = "<span>⛶</span><span>全屏演示</span>";
            }
        });
    }

    // 页面加载启动
    window.addEventListener("DOMContentLoaded", init);
})();
