/**
 * 2026 春晖中学校运会 · 希沃白板工作引导系统核心数据库
 * 包含赛程时间轴、机位空间坐标、岗位分配、器材推荐、必抓镜头与参赛预警
 */

window.STADIUM_DATA = {
    // 基础场馆信息与地标坐标定义 (基于 1200 x 750 SVG 画布)
    stadium: {
        name: "浙江省春晖中学 · 白马湖田径场",
        viewBox: "0 0 1200 750",
        landmarks: [
            { id: "rostrum", name: "主席台 / 计时裁判席", x: 600, y: 700, icon: "🏛️" },
            { id: "finish_line", name: "100米 / 直道终点冲刺线", x: 380, y: 645, icon: "🏁" },
            { id: "sprint_start_100", name: "100米起点 (直道北端)", x: 380, y: 105, icon: "⚡" },
            { id: "turn_1", name: "400米第一弯道", x: 880, y: 560, icon: "🔄" },
            { id: "turn_2", name: "400米第二弯道", x: 880, y: 190, icon: "🔄" },
            { id: "north_stand", name: "北看台 / 班级大本营观众席", x: 600, y: 35, icon: "👥" },
            { id: "sand_pit", name: "跳远沙坑区 (西侧草坪)", x: 490, y: 380, icon: "🏖️" },
            { id: "high_jump", name: "跳高海绵垫区 (东侧草坪)", x: 740, y: 375, icon: "🪜" },
            { id: "shot_put", name: "铅球投掷区 (西北角草坪)", x: 490, y: 220, icon: "⚪" },
            { id: "stand_jump", name: "立定跳远测试区 (西南角草坪)", x: 490, y: 530, icon: "👟" },
            { id: "check_in", name: "检录处 / 医务应急站", x: 260, y: 700, icon: "📋" },
            { id: "broadcast", name: "主席台二楼广播室", x: 600, y: 735, icon: "🎙️" },
            { id: "relay_zone_1", name: "4x100 第一接力区", x: 915, y: 375, icon: "🎽" },
            { id: "relay_zone_3", name: "4x100 第三接力区", x: 285, y: 375, icon: "🎽" }
        ]
    },

    // 核心机位库 (全赛程机位空间分布与硬件预设)
    cameras: {
        "CAM_FINISH_FRONT": {
            id: "CAM_FINISH_FRONT",
            name: "CAM-01 终点正面长焦机位",
            type: "定点长焦",
            x: 380,
            y: 690,
            lens: "70-200mm f/2.8 或 100-400mm",
            rig: "重型三脚架",
            mode: "4K 60fps / 高速连拍 1/2000s",
            desc: "正对百米与接力冲刺线，利用长焦镜头纵深压缩感，精准定格第一名仰天怒吼、胸口压线撕裂红绸缎带的高光时刻。",
            safetyNotice: "严守终点线延长线 1 米外安全区，切勿遮挡终点裁判员视线。"
        },
        "CAM_FINISH_SLOW": {
            id: "CAM_FINISH_SLOW",
            name: "CAM-02 终点侧切120fps慢动作机位",
            type: "升格微单",
            x: 430,
            y: 645,
            lens: "24-70mm f/2.8",
            rig: "手持稳定器 / 单脚架",
            mode: "4K 120fps 慢动作 (1/240s快门)",
            desc: "终点侧向 45° 视角，捕捉选手高速撞线后向后扬起的双臂、鞋底摩擦橡胶的白烟，以及脱力向前扑倒时的面部表情。",
            safetyNotice: "保持与最内圈跑道白线 1.5 米距离，防范冲刺后选手向草坪侧扑减速。"
        },
        "CAM_STRAIGHT_TRACK": {
            id: "CAM_STRAIGHT_TRACK",
            name: "CAM-03 直道外侧跟跑手持机位",
            type: "动态跟跑",
            x: 290,
            y: 350,
            lens: "16-35mm 超广角 或 24mm 定焦",
            rig: "三轴稳定器 (忍者步法)",
            mode: "4K 120fps (AF-C 人脸追踪)",
            desc: "在西直道外侧安全带与选手并驾齐驱，贴地超低角度仰拍奔跑中的大腿肌肉紧绷与起伏节奏，营造极限破风速度感。",
            safetyNotice: "【红线】：必须严格保持在白色跑道外沿 1 米以外，严禁脚掌踩入跑道红色区域！"
        },
        "CAM_ROSTRUM_HIGH": {
            id: "CAM_ROSTRUM_HIGH",
            name: "CAM-04 主席台顶层大推拉全景机位",
            type: "定点大变焦",
            x: 600,
            y: 675,
            lens: "大变焦比 DV / 28-200mm",
            rig: "重型三脚架 + 液压云台",
            mode: "4K 60fps",
            desc: "负责开幕式主席台居高临下全景，以及发令枪响后全场 8 条道选手齐头并进的大纵深大推拉镜头。",
            safetyNotice: "注意保护高处线缆，避免被经过的领导及裁判绊脱。"
        },
        "CAM_STAND_TOP": {
            id: "CAM_STAND_TOP",
            name: "CAM-05 北看台高层长焦俯拍机位",
            type: "高位俯拍",
            x: 600,
            y: 70,
            lens: "70-200mm / 400mm 远摄",
            rig: "三脚架",
            mode: "4K 60fps",
            desc: "替代无人机的高空俯视方案，由北向南俯瞰跑道与草坪大本营，捕捉班级助威人浪与直道冲刺全景。",
            safetyNotice: "看台边缘注意安全，脚架三足拉开锁死防滑。"
        },
        "CAM_POLE_POCKET": {
            id: "CAM_POLE_POCKET",
            name: "CAM-06 碳纤维延长杆 Pocket 高空/贴地机位",
            type: "禁飞特种替代",
            x: 340,
            y: 610,
            lens: "DJI Pocket 广角云台",
            rig: "3~4米碳纤维延长杆 + 手机无线监看",
            mode: "4K 60fps 动感运镜",
            desc: "实现无人机禁飞后的超低空大俯视与贴地飞行视角。在终点和起跑区上方 3 米平滑横移推进，视觉冲击力极强。",
            safetyNotice: "【双重保险】：必须加装金属防坠安全钢丝绳！严禁在人群正上方悬停或大幅度挥动！"
        },
        "CAM_SAND_PIT": {
            id: "CAM_SAND_PIT",
            name: "CAM-07 跳远沙坑低角度侧切机位",
            type: "田赛专属",
            x: 540,
            y: 400,
            lens: "24-70mm / 70-200mm",
            rig: "独脚架 / 贴地小三脚架",
            mode: "4K 120fps / 连拍 1/2000s",
            desc: "紧盯助跑踩板刹那的鞋底形变，以及双脚切入沙坑瞬间沙花呈扇形爆炸飞溅的慢动作微观世界。",
            safetyNotice: "严禁正对落坑区前方站立，防止被沙粒溅入镜头前组或被选手滑行冲撞。"
        },
        "CAM_HIGH_JUMP": {
            id: "CAM_HIGH_JUMP",
            name: "CAM-08 跳高横杆延长线过杆机位",
            type: "田赛专属",
            x: 700,
            y: 350,
            lens: "70-200mm f/2.8",
            rig: "手持 / 独脚架",
            mode: "4K 120fps / 连拍 1/1600s",
            desc: "位于海绵垫侧方与横杆呈 15° 角，仰拍运动员身体背弓凌空反折、发丝垂挂、横杆轻微晃动而不落的惊险瞬间。",
            safetyNotice: "不得遮挡横杆裁判观察视线，与助跑起跳弧线保持 2 米安全距离。"
        },
        "CAM_SHOT_PUT": {
            id: "CAM_SHOT_PUT",
            name: "CAM-09 铅球投掷圈力量特写机位",
            type: "田赛专属",
            x: 440,
            y: 220,
            lens: "50mm / 85mm 大光圈",
            rig: "手持",
            mode: "连拍 1/2000s / 4K 120fps",
            desc: "捕捉锁骨窝紧贴铅球的紧绷下蹲、下肢蹬伸送髋、出手的肌肉青筋暴起与怒吼口型，突出力量美学。",
            safetyNotice: "站在投掷圈侧后方安全保护网外，绝对禁止踏入扇形落地区！"
        },
        "CAM_BACKSTAGE_POV": {
            id: "CAM_BACKSTAGE_POV",
            name: "CAM-10 学生会幕后双线纪录机位 (高一主力)",
            type: "纪实叙事",
            x: 230,
            y: 660,
            lens: "24-70mm / 35mm 人文定焦",
            rig: "手持 / 小型稳定器",
            mode: "1080P 60fps (保留高品质现场原声)",
            desc: "对焦沾满汗水的工作证挂绳、小跑穿梭送达成绩单、广播台桌上堆满红笔画勾的小纸条，以及终点线志愿者张臂迎接脱力选手。",
            safetyNotice: "保持隐蔽低干扰记录，提问需轻快自然，不打扰裁判与志愿者本职工作。"
        }
    },

    // 官方赛程全景时间轴与机位调度编排
    timelineDays: [
        {
            dayId: "day1",
            dateStr: "10月8日 (周四)",
            title: "Day 1 · 开幕盛典与飞人初战",
            theme: "方阵巡礼 · 铅球力量 · 飞人预赛 · 幕后初动",
            periods: [
                {
                    timeRange: "07:45 - 08:30",
                    periodLabel: "赛前准备与设备出库",
                    majorEvent: "器材清点、活动室动员就位、大本营班级物资抓拍",
                    activeCameras: ["CAM_ROSTRUM_HIGH", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "傅梓浩", role: "总控调度", task: "活动室核对器材出库与各机位电池满电确认" },
                        { name: "沈栋忆", role: "机位点名", task: "确认各年级在岗人员到场，核对个人任务单" },
                        { name: "池雨曦", role: "幕后纪实", task: "抓拍各班同学合力抬长椅穿行林荫道、晨光树影初照" }
                    ],
                    priorityShots: [
                        "晨光熹微中，推开新媒体社大门，成排相机整齐待发的气势空镜",
                        "大本营双线镜头：班级同学两人一组抬着木椅穿过绿荫校道",
                        "学生会工作人员拆开未拆封工作证塑料袋、戴在脖子上的 POV 视角"
                    ],
                    internalAlerts: []
                },
                {
                    timeRange: "08:30 - 10:00",
                    periodLabel: "力量与跳跃早场",
                    majorEvent: "高一/高二/高三 男女 铅球决赛、立定跳远",
                    activeCameras: ["CAM_SHOT_PUT", "CAM_SAND_PIT", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "陈佳炜", role: "铅球主摄", task: "铅球投掷区外围低角度抓拍肌肉紧绷与出手怒吼" },
                        { name: "朱烨恒", role: "铅球副摄", task: "捕捉球体砸入泥地扬起的沙尘特写 (120fps)" },
                        { name: "连辰毅", role: "立跳主摄", task: "立定跳远起跳瞬间脚踝蹬地发力与摆臂腾空" },
                        { name: "汪清晏", role: "田赛协同", task: "记录成绩测量员手拉皮尺跪地读数的严谨神态" }
                    ],
                    priorityShots: [
                        "【高三学长专机盯防】：08:30 高三男 铅球决赛 第 23 签位 张珒皓！抓拍其颈部青筋、怒吼推球瞬间！",
                        "铅球离手升空带背光逆光轮廓光",
                        "立定跳远选手起跳前双腿下蹲、双手后摆蓄力的呼吸特写"
                    ],
                    internalAlerts: [
                        "⚠️ 08:30 高三男 铅球第 23 签位 张珒皓 为社团学长，陈佳炜、朱烨恒务必专机锁定！"
                    ]
                },
                {
                    timeRange: "10:15 - 11:30",
                    periodLabel: "百米预赛竞速潮",
                    majorEvent: "高一/高二/高三 男女 100米 预赛 (飞人初战)",
                    activeCameras: ["CAM_FINISH_FRONT", "CAM_FINISH_SLOW", "CAM_STRAIGHT_TRACK", "CAM_STAND_TOP"],
                    crew: [
                        { name: "莫佩祥", role: "终点正面", task: "守候终点冲刺线，高速连拍 1/2000s 抓取压线瞬间" },
                        { name: "冯翼", role: "看台高位", task: "长焦大俯视捕捉 8 条道选手发令枪响弹射出击全景" },
                        { name: "徐清来", role: "直道侧跟", task: "跑道外沿安全带跟跑，捕捉 50 米加速阶段摆臂" },
                        { name: "陈玥潼", role: "检录纪实", task: "检录处抓拍选手深吸气、弯腰紧鞋带神态" }
                    ],
                    priorityShots: [
                        "【高三学长专机盯防】：10:15 高三男 100m 预赛 第 2 组 第 5 道 任煜成！莫佩祥、冯翼重点抓拍冲刺！",
                        "【高三学姐专机盯防】：10:45 高三女 100m 预赛 第 2 组 第 3 道 张慈恩！徐清来负责弯道加速锁定！",
                        "发令枪枪口白烟喷出与选手脚蹬起跑器的同框起步卡点镜头",
                        "选手撞线后胸膛剧烈起伏、脸上汗水飞溅的 120fps 慢动作"
                    ],
                    internalAlerts: [
                        "⚠️ 10:15 高三男 100m 任煜成 (第2组第5道) 重点机位锁定",
                        "⚠️ 10:45 高三女 100m 张慈恩 (第2组第3道) 重点机位锁定"
                    ]
                },
                {
                    timeRange: "12:30 - 14:00",
                    periodLabel: "开幕式全流程实况 (核心大仗)",
                    majorEvent: "全员集结、全班级入场式多机位录制、会操表演",
                    activeCameras: ["CAM_ROSTRUM_HIGH", "CAM_FINISH_FRONT", "CAM_STRAIGHT_TRACK", "CAM_POLE_POCKET", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "连辰毅", role: "CAM-A 正面全景", task: "主席台对面中线，架设三脚架拍摄方阵完整正面与标语" },
                        { name: "冯翼", role: "CAM-B 台上大推拉", task: "主席台 30° 高位，大变焦长焦自远及近推拉特写" },
                        { name: "鲍奕帆", role: "CAM-C 正面特写", task: "主席台下中轴线，微单抓拍领队举牌手、班主任微笑神态" },
                        { name: "汪清晏", role: "CAM-D 跑道贴地", task: "内圈弯道贴地仰角，广角抓取整齐划一的正步踏步声浪" },
                        { name: "莫佩祥", role: "CAM-E 侧向手持", task: "方阵行进外侧流动穿插，捕捉口号呼喊与特色道具表演" },
                        { name: "傅佳雪", role: "CAM-F 大本营花絮", task: "看台与后方候场区抓拍班级补妆、整理演出服温情花絮" }
                    ],
                    priorityShots: [
                        "【铁律】：全员 12:30 准时在社团集合领机，不参加班级方阵进场！",
                        "CAM-B 与 CAM-D 画面交替：大推拉整体阵型 与 贴地皮鞋/球鞋踏步节奏",
                        "班级行进至主席台正前方的 30 秒特色展演（武术、舞蹈、巨幅横幅展开）",
                        "国旗方队与校旗方队迎风猎猎飘扬的大特写"
                    ],
                    internalAlerts: [
                        "🚨 全员 12:30 集合！禁止参加班级进场，13:10 前各机位必须完成无线图传与白平衡对齐！"
                    ]
                },
                {
                    timeRange: "14:15 - 15:40",
                    periodLabel: "下午径赛与沙坑跳远",
                    majorEvent: "高一男女跳远预赛、高二男女400米预赛",
                    activeCameras: ["CAM_SAND_PIT", "CAM_STRAIGHT_TRACK", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "丁子妍", role: "沙坑主控", task: "沙坑侧向 45° 记录选手腾空滑行与沙花飞溅" },
                        { name: "金煜豪", role: "沙坑第二机位", task: "助跑道正面长焦抓取起跳脚踏板瞬间" },
                        { name: "石虞涵", role: "400米主摄", task: "400米第二弯道进直道，抓拍极限乳酸堆积咬牙坚持" },
                        { name: "茅熠奇", role: "400米副摄", task: "终点线前 50 米守候，捕捉逆转超车冲刺" }
                    ],
                    priorityShots: [
                        "【社员参赛预警】：15:25 高一男 100m 预赛 第 1 组 第 3 道 陈怀恒！莫佩祥、冯翼提前 14:55 就位盯防！",
                        "400米跑道弯道处身体大幅内倾的流线型视觉美感",
                        "跳远落坑后裁判拉尺丈量、工作人员铁耙平整沙坑的双线细节"
                    ],
                    internalAlerts: [
                        "⚠️ 14:55 陈怀恒 离岗检录准备 15:25 100m 预赛，莫佩祥负责专机跟跑！"
                    ]
                },
                {
                    timeRange: "15:40 - 17:15",
                    periodLabel: "高二跳远决战与百米巅峰决赛",
                    majorEvent: "高二女跳远决赛、高一/高二/高三 男女 100米 总决赛",
                    activeCameras: ["CAM_FINISH_FRONT", "CAM_FINISH_SLOW", "CAM_SAND_PIT", "CAM_POLE_POCKET"],
                    crew: [
                        { name: "丁子妍", role: "顶岗沙坑", task: "15:40 接替沈栋忆掌管沙坑机位，全权负责高二女跳远决赛拍摄" },
                        { name: "金煜豪", role: "专机盯防", task: "全程专机锁定沈栋忆参赛第 19 签位的每一次助跑与落坑！" },
                        { name: "莫佩祥", role: "百米终点正面", task: "终点线正前方守候，捕捉百米飞人决战冠军撞线！" },
                        { name: "冯翼", role: "百米延长杆高位", task: "Pocket 延长杆在终点线上方俯拍撞线冲刺群像" },
                        { name: "徐清来", role: "冲线侧切慢动", task: "捕捉撞线后第一名仰天嘶吼、第二名遗憾扶膝的鲜明对照" }
                    ],
                    priorityShots: [
                        "【核心参赛避让】：高二女跳远决赛 沈栋忆 (第 19 签位)！15:40 准时离岗交接设备！丁子妍顶岗、金煜豪专机抓拍！",
                        "【视频一核心素材】：百米总决赛全部冠军冲刺镜头，全部 120fps 录制，严禁手抖关机！",
                        "终点裁判助理掐秒表手指悬停、大拇指猛烈下按的微距特写"
                    ],
                    internalAlerts: [
                        "🚨 沈栋忆 15:40 离岗参赛！丁子妍顶岗沙坑机位，金煜豪专机锁定沈栋忆第 19 签位！"
                    ]
                }
            ]
        },
        {
            dayId: "day2",
            dateStr: "10月9日 (周五)",
            title: "Day 2 · 速度风暴与接力狂欢",
            theme: "背弓飞跃 · 200米弯道 · 4x100接力决战 · 幕后穿梭",
            periods: [
                {
                    timeRange: "07:50 - 09:30",
                    periodLabel: "跳高早场与耐力初战",
                    majorEvent: "高三男 跳高 决赛 (26人)、高一/高二男跳高预选",
                    activeCameras: ["CAM_HIGH_JUMP", "CAM_ROSTRUM_HIGH", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "连辰毅", role: "跳高主控", task: "海绵垫侧方 15° 抓拍背越式过杆反弓滞空画面" },
                        { name: "金煜豪", role: "跳高特写", task: "横杆立柱特写，记录横杆轻微颤动而不落的惊险" },
                        { name: "沈栋忆", role: "田赛协同", task: "捕捉选手试跳成功后从海绵垫上一跃而起握拳呐喊" },
                        { name: "董欣瑜", role: "长跑检录", task: "关注 1500米 跑前热身、拉伸动作" }
                    ],
                    priorityShots: [
                        "跳高背越式过杆瞬间：身体横悬于蓝天背景之上，宛如空中芭蕾",
                        "起跳脚踏地瞬间，跑鞋前掌深深下陷并反弹的慢动作",
                        "横杆掉落砸在海绵垫上的惋惜神情与下一次坚毅试跳"
                    ],
                    internalAlerts: []
                },
                {
                    timeRange: "09:30 - 11:30",
                    periodLabel: "中长跑意志大考验",
                    majorEvent: "高一/高二/高三 男女 1500米 决赛、铅球决赛",
                    activeCameras: ["CAM_STRAIGHT_TRACK", "CAM_STAND_TOP", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "沈栋忆", role: "终点温情守候", task: "守候 1500米 终点，抓拍选手完赛虚脱与同学上前搀扶" },
                        { name: "董欣瑜", role: "长跑直道跟拍", task: "记录领跑集团与跟跑队伍之间的拉扯与节奏变化" },
                        { name: "陈怀恒", role: "弯道逆光剪影", task: "在南弯道捕捉上午斜射阳光下的长跑剪影" },
                        { name: "池雨曦", role: "幕后送水纪实", task: "志愿者手端一排排纸杯、在终点线旁严阵以待的奉献镜头" }
                    ],
                    priorityShots: [
                        "长跑最后一圈摇铃响起的瞬间，选手眼神中爆发出的最后拼劲",
                        "广播台念到某班为 1500 米选手撰写加油稿的原声透出",
                        "终点脱力倒地后，三位同学立即上前架住双臂慢慢走动的真实情义"
                    ],
                    internalAlerts: []
                },
                {
                    timeRange: "13:30 - 15:40",
                    periodLabel: "200米弯道大决战",
                    majorEvent: "高一/高二/高三 男女 200米 预赛与决赛",
                    activeCameras: ["CAM_FINISH_FRONT", "CAM_STRAIGHT_TRACK", "CAM_STAND_TOP"],
                    crew: [
                        { name: "徐清来", role: "200米主摄", task: "跑道外沿跟拍弯道进直道瞬间的离心力倾斜" },
                        { name: "傅佳雪", role: "终点专机", task: "终点线侧向 120fps 抓取最后 10 米绝地反超" },
                        { name: "陈佳炜", role: "看台俯拍", task: "长焦捕捉外道选手与内道选手的身位交错" }
                    ],
                    priorityShots: [
                        "【高三学长专机盯防】：14:00 高三男 200m 预赛 第 2 组 第 4 道 任煜成！徐清来、莫佩祥专机锁定！",
                        "【高三学姐专机盯防】：14:20 高三女 200m 预赛 第 2 组 第 4 道 张慈恩！徐清来负责直道冲刺抓拍！",
                        "【社员参赛预警】：14:40 高一男 200m 预赛 第 2 组 第 7 道 陈怀恒！提前至 14:10 离岗，徐清来专机盯防！",
                        "【核心统筹避让】：15:35 高二女 200m 预赛 第 1 组 第 2 道 沈栋忆！提前至 15:05 离岗！由徐清来、陈佳炜、傅佳雪专机重点盯防！"
                    ],
                    internalAlerts: [
                        "⚠️ 14:00 任煜成 200m (第2组第4道) 重点盯防",
                        "⚠️ 14:20 张慈恩 200m (第2组第4道) 重点盯防",
                        "⚠️ 14:10 陈怀恒 离岗备战 14:40 200m预赛",
                        "🚨 15:05 沈栋忆 提前离岗备战 15:35 200m预赛！徐清来、陈佳炜、傅佳雪三机包围抓拍！"
                    ]
                },
                {
                    timeRange: "15:40 - 17:15",
                    periodLabel: "4×100米接力总决赛 (全天最高潮)",
                    majorEvent: "高一/高二/高三 男女 4×100米 接力决战！",
                    activeCameras: ["CAM_FINISH_FRONT", "CAM_FINISH_SLOW", "CAM_STRAIGHT_TRACK", "CAM_POLE_POCKET", "CAM_STAND_TOP"],
                    crew: [
                        { name: "石虞涵", role: "第三接力区", task: "西直道第三接力区，特写交接棒拍掌入手的瞬间" },
                        { name: "沈栋忆", role: "终点撞线主控", task: "完赛归位！守候主席台前终点线，抓拍第四棒拼死冲刺" },
                        { name: "徐清来", role: "直道狂飙跟拍", task: "外侧跟跑第四棒终极较量" },
                        { name: "冯翼", role: "延长杆大俯拍", task: "终点上方 3 米俯瞰班级全员跨越跑道涌上来的狂欢" },
                        { name: "莫佩祥", role: "第一接力区", task: "东弯道第一接力区，捕捉起动接棒第一反冲" }
                    ],
                    priorityShots: [
                        "【接力区黄金瞬间】：后棒拼尽全力伸直右臂，前棒掌心后翻，接力棒猛力拍入掌心的清脆一刹",
                        "【掉棒应对铁律】：若有班级发生交接掉棒，严禁关机！稳稳记录选手捡起棒子继续狂奔的顽强身影",
                        "第四棒撞线压线瞬间，全班同学冲入绿茵场将英雄高高抛起的狂欢镜头"
                    ],
                    internalAlerts: [
                        "🚨 接力赛跑道人员密集！全体摄像师坚决站在白色外沿 1 米外，防止被冲撞或遮挡视线！"
                    ]
                }
            ]
        },
        {
            dayId: "day3",
            dateStr: "10月10日 (周六)",
            title: "Day 3 · 耐力巅峰与闭幕荣光",
            theme: "千米长跑 · 800米温情 · 闭幕式大合影 · 终极归档",
            periods: [
                {
                    timeRange: "08:00 - 09:20",
                    periodLabel: "男子1000米意志决战",
                    majorEvent: "高一/高二/高三 男子 1000米 决赛",
                    activeCameras: ["CAM_STRAIGHT_TRACK", "CAM_FINISH_SLOW", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "陈怀恒", role: "千米主摄", task: "内圈草坪跟拍男子长跑第一集团的呼吸与步伐" },
                        { name: "茅熠奇", role: "直道副摄", task: "看台下捕捉全班同学敲击矿泉水瓶助威的声浪" },
                        { name: "莫佩祥", role: "终点守候", task: "记录撞线后双手撑膝大口喘粗气的汗水特写" },
                        { name: "汪清晏", role: "医务抓拍", task: "捕捉医务志愿者递上葡萄糖水、喷洒云南白药的细节" }
                    ],
                    priorityShots: [
                        "汗水从下巴尖端连珠成线滴落在红色塑胶跑道上的微距",
                        "落后半圈的最后一名选手孤身跑过看台，全场自发鼓掌起立致敬的人文高光",
                        "终点线上志愿者双臂扶住摇摇欲坠的选手，慢慢走向休息区的长镜头"
                    ],
                    internalAlerts: []
                },
                {
                    timeRange: "09:25 - 10:20",
                    periodLabel: "女子800米感动瞬间",
                    majorEvent: "高一/高二/高三 女子 800米 决赛 (全组)",
                    activeCameras: ["CAM_FINISH_FRONT", "CAM_FINISH_SLOW", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "董欣瑜", role: "800米主控", task: "重点盯防高一女 800米决赛，记录坚韧与温情" },
                        { name: "沈栋忆", role: "专机盯防", task: "专机锁定社团成员丁子妍！抓拍其拼搏全过程！" },
                        { name: "池雨曦", role: "幕后双线", task: "记录同组姐妹在跑道外沿陪跑喊加油的动人画面" }
                    ],
                    priorityShots: [
                        "【核心社员重点盯防】：09:25 高一女 800m 决赛 第 1 组 第 6 位 丁子妍！",
                        "丁子妍提前至 08:55 离岗检录，由董欣瑜、沈栋忆全程专机盯防其最后一圈冲刺与撞线脱力拥抱！",
                        "女同学相拥而泣、递上外套披在肩上的温情镜头，为视频一与视频二提供核心情感素材。"
                    ],
                    internalAlerts: [
                        "🚨 08:55 丁子妍 离岗检录 800米！董欣瑜、沈栋忆专机重点盯防其第 1 组第 6 位参赛！"
                    ]
                },
                {
                    timeRange: "10:20 - 11:30",
                    periodLabel: "趣味项目与师生表演赛",
                    majorEvent: "教工趣味赛、师生接力赛、欢声笑语",
                    activeCameras: ["CAM_ROSTRUM_HIGH", "CAM_STRAIGHT_TRACK", "CAM_POLE_POCKET"],
                    crew: [
                        { name: "金煜豪", role: "趣味抓拍", task: "捕捉平时严肃的老师们在赛道上开怀大笑的瞬间" },
                        { name: "连辰毅", role: "全景跟拍", task: "看台上学生为班主任疯狂欢呼、举起加油手幅" },
                        { name: "傅佳雪", role: "花絮特写", task: "老师们跑完后和全班学生击掌合影的温馨画面" }
                    ],
                    priorityShots: [
                        "老师冲线时逗趣的肢体语言与学生们笑逐颜开的群像",
                        "平时不苟言笑的各科老师戴上号码布的生动反差萌"
                    ],
                    internalAlerts: []
                },
                {
                    timeRange: "13:30 - 15:30",
                    periodLabel: "闭幕典礼与终极颁奖",
                    majorEvent: "闭幕式入场、团体总分颁奖、全班大合影",
                    activeCameras: ["CAM_ROSTRUM_HIGH", "CAM_FINISH_FRONT", "CAM_POLE_POCKET", "CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "陈佳炜", role: "颁奖台特写", task: "主席台前仰拍校长/校领导颁发奖杯、奖牌与大奖状" },
                        { name: "朱烨恒", role: "奖杯微距", task: "特写金色奖杯在阳光下反射的光芒，以及班长双手捧杯的激动" },
                        { name: "冯翼", role: "延长杆大摇臂", task: "在草坪上升起 4 米延长杆，大俯拍全校师生起立欢呼退场全貌" },
                        { name: "莫佩祥", role: "班级大合影", task: "深入各班级大本营，抓拍挥舞班旗、将帽子抛向空中的大合影" }
                    ],
                    priorityShots: [
                        "班长从校领导手中接过金色奖杯高高举过头顶、台下全班雷动欢呼",
                        "全班师生簇拥着奖状、班主任坐在正中间的灿烂笑脸大合照",
                        "夕阳余晖洒在空旷赛场上，志愿者摘下工作证放在看台长椅上的视频二终章定格"
                    ],
                    internalAlerts: []
                },
                {
                    timeRange: "15:30 - 17:30",
                    periodLabel: "终极归档与剪辑启动",
                    majorEvent: "全量器材入库清点、双重硬盘终极校验、后期工程建立",
                    activeCameras: ["CAM_BACKSTAGE_POV"],
                    crew: [
                        { name: "傅梓浩", role: "后期总控", task: "建立三大主片剪辑工程，导入三级目录素材，启动剪辑" },
                        { name: "鲍奕帆", role: "主片工程", task: "对齐 Nevada BGM 节拍标尺，筛选百米与接力高光 120fps 素材" },
                        { name: "张嘉炜", role: "宣传片后期", task: "汇总高一采访原声与工作证双线镜头，搭建粗剪时间线" },
                        { name: "沈栋忆", role: "器材清点", task: "全员归还设备，确认无损坏、电池插电保养" }
                    ],
                    priorityShots: [
                        "剪辑室内显示器亮起，多机位时间线轨道密密麻麻展开的专业质感",
                        "摄制组全员在活动室的大合影，画上圆满句号"
                    ],
                    internalAlerts: []
                }
            ]
        }
    ]
};
