// Siyoon's 2026 Winter Vacation Manager
// Firebase-enabled Application
// v1.1 - Bible verse update

(function() {
    'use strict';

    // ===== Firebase Services =====
    const auth = firebase.auth();
    const db = firebase.firestore();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // ===== Configuration =====
    const CONFIG = {
        startDate: new Date(2026, 0, 1),
        endDate: new Date(2026, 1, 28)
    };

    // ===== Bible Verses =====
    const BIBLE_VERSES = [
        { verse: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
        { verse: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라", ref: "잠언 3:5" },
        { verse: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라", ref: "데살로니가전서 5:16-18" },
        { verse: "내가 너희에게 분부한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라", ref: "여호수아 1:9" },
        { verse: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", ref: "요한복음 3:16" },
        { verse: "내가 진실로 진실로 너희에게 이르노니 내 말을 듣고 또 나 보내신 이를 믿는 자는 영생을 얻었고", ref: "요한복음 5:24" },
        { verse: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", ref: "마태복음 11:28" },
        { verse: "내가 여호와께 바라는 한 가지 일 그것을 구하리니 곧 내 평생에 여호와의 집에 살면서", ref: "시편 27:4" },
        { verse: "여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다", ref: "시편 37:4" },
        { verse: "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니", ref: "히브리서 11:1" },
        { verse: "나의 영혼아 잠잠히 하나님만 바라라 무릇 나의 소망이 그로부터 나오는도다", ref: "시편 62:5" },
        { verse: "오직 나는 여호와를 우러러보며 나를 구원하시는 하나님을 바라보나니", ref: "미가 7:7" },
        { verse: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라", ref: "이사야 41:10" },
        { verse: "여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요", ref: "시편 27:1" },
        { verse: "범사에 네 하나님 여호와를 인정하라 그리하면 네 길을 지도하시리라", ref: "잠언 3:6" },
        { verse: "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라", ref: "시편 46:1" },
        { verse: "내 마음이 낙심될 때에 땅 끝에서부터 주께 부르짖으오리니", ref: "시편 61:2" },
        { verse: "여호와께서 너를 지키사 모든 환난을 면하게 하시며 또 네 영혼을 지키시리로다", ref: "시편 121:7" },
        { verse: "무엇이든지 내게 구하면 내가 행하리라", ref: "요한복음 14:14" },
        { verse: "내가 너를 강하게 하리라 참으로 너를 도와주리라", ref: "이사야 41:10" }
    ];

    function displayRandomBibleVerse() {
        const verseEl = document.getElementById('bibleVerse');
        const refEl = document.getElementById('bibleReference');
        if (verseEl && refEl) {
            const randomIndex = Math.floor(Math.random() * BIBLE_VERSES.length);
            const selected = BIBLE_VERSES[randomIndex];
            verseEl.textContent = `"${selected.verse}"`;
            refEl.textContent = `- ${selected.ref} -`;
        }
    }

    // ===== Weather Display =====
    function displayWeather() {
        const dateEl = document.getElementById('weatherDate');
        const tempEl = document.getElementById('weatherTemp');
        const humidityEl = document.getElementById('weatherHumidity');
        const dustEl = document.getElementById('weatherDust');

        if (!dateEl) return;

        // 날짜 표시
        const now = new Date();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        dateEl.textContent = `${now.getMonth() + 1}/${now.getDate()}(${days[now.getDay()]})`;

        // 날씨 API 호출 (Open-Meteo - 무료, API키 불필요)
        // 서울 좌표: 37.5665, 126.9780
        fetch('https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,relative_humidity_2m&timezone=Asia/Seoul')
            .then(res => res.json())
            .then(data => {
                if (data.current) {
                    tempEl.textContent = `${Math.round(data.current.temperature_2m)}°C`;
                    humidityEl.textContent = `습도 ${data.current.relative_humidity_2m}%`;
                }
            })
            .catch(() => {
                tempEl.textContent = '--°C';
                humidityEl.textContent = '습도 --%';
            });

        // 미세먼지 API (에어코리아 대신 간단한 표시)
        fetch('https://api.open-meteo.com/v1/air-quality?latitude=37.5665&longitude=126.9780&current=pm10,pm2_5&timezone=Asia/Seoul')
            .then(res => res.json())
            .then(data => {
                if (data.current) {
                    const pm10 = data.current.pm10;
                    let status = '좋음';
                    if (pm10 > 150) status = '매우나쁨';
                    else if (pm10 > 80) status = '나쁨';
                    else if (pm10 > 30) status = '보통';
                    dustEl.textContent = `미세먼지 ${status}`;
                }
            })
            .catch(() => {
                dustEl.textContent = '미세먼지 --';
            });
    }

    // ===== Channel Definitions =====
    const CHANNELS = {
        schedule: {
            id: 'schedule',
            name: '방학 일정',
            screen: 'scheduleScreen',
            calendar: 'scheduleCalendar',
            category: 'schedule',
            categoryName: '일정',
            fields: [
                { name: 'title', label: '일정 제목', type: 'text', required: true },
                { name: 'content', label: '일정 내용', type: 'textarea', required: false }
            ]
        },
        'study-basic': {
            id: 'study-basic',
            name: '기초학력 진단평가',
            screen: 'studyBasicScreen',
            calendar: 'studyBasicCalendar',
            category: 'study',
            categoryName: '진단평가',
            fields: [
                { name: 'page', label: '학습한 내용', type: 'text', required: false },
                { name: 'score', label: '점수', type: 'text', required: false },
                { name: 'content', label: '메모', type: 'textarea', required: false }
            ]
        },
        'study-math': {
            id: 'study-math',
            name: '만점왕 수학(6-1)',
            screen: 'studyMathScreen',
            calendar: 'studyMathCalendar',
            category: 'study',
            categoryName: '수학',
            fields: [
                { name: 'page', label: '학습한 내용', type: 'text', required: false },
                { name: 'score', label: '점수', type: 'text', required: false },
                { name: 'content', label: '메모', type: 'textarea', required: false }
            ]
        },
        'study-calc': {
            id: 'study-calc',
            name: '기적의 계산법',
            screen: 'studyCalcScreen',
            calendar: 'studyCalcCalendar',
            category: 'study',
            categoryName: '계산법',
            fields: [
                { name: 'page', label: '학습한 내용', type: 'text', required: false },
                { name: 'score', label: '점수', type: 'text', required: false },
                { name: 'content', label: '메모', type: 'textarea', required: false }
            ]
        },
        'study-english': {
            id: 'study-english',
            name: '초등영문법 3800제',
            screen: 'studyEnglishScreen',
            calendar: 'studyEnglishCalendar',
            category: 'study',
            categoryName: '영문법',
            fields: [
                { name: 'page', label: '학습한 내용', type: 'text', required: false },
                { name: 'score', label: '점수', type: 'text', required: false },
                { name: 'content', label: '메모', type: 'textarea', required: false }
            ]
        },
        'study-elihi': {
            id: 'study-elihi',
            name: '엘리하이',
            screen: 'studyEliHiScreen',
            calendar: 'studyEliHiCalendar',
            category: 'study',
            categoryName: '엘리하이',
            fields: [
                { name: 'subject', label: '공부한 내용', type: 'text', required: false },
                { name: 'score', label: '점수', type: 'text', required: false },
                { name: 'content', label: '메모', type: 'textarea', required: false }
            ]
        },
        game: {
            id: 'game',
            name: '게임 정복기',
            screen: 'gameScreen',
            calendar: 'gameCalendar',
            category: 'game',
            categoryName: '게임',
            fields: [
                { name: 'gameName', label: '게임 이름', type: 'text', required: false },
                { name: 'content', label: '게임 소감', type: 'textarea', required: false }
            ]
        },
        reading: {
            id: 'reading',
            name: '1일 1독서',
            screen: 'readingScreen',
            calendar: 'readingCalendar',
            category: 'reading',
            categoryName: '독서',
            fields: [
                { name: 'bookTitle', label: '책 제목', type: 'text', required: false },
                { name: 'pages', label: '읽은 페이지', type: 'text', required: false },
                { name: 'content', label: '독서 내용/소감', type: 'textarea', required: false }
            ]
        },
        kindness: {
            id: 'kindness',
            name: '1일 1선행',
            screen: 'kindnessScreen',
            calendar: 'kindnessCalendar',
            category: 'kindness',
            categoryName: '선행',
            fields: [
                { name: 'content', label: '오늘 한 선행', type: 'textarea', required: false }
            ]
        },
        exercise: {
            id: 'exercise',
            name: '1일 1운동',
            screen: 'exerciseScreen',
            calendar: 'exerciseCalendar',
            category: 'exercise',
            categoryName: '운동',
            fields: [
                { name: 'exerciseType', label: '운동 종류', type: 'text', required: false },
                { name: 'duration', label: '운동 시간 (예: 30분)', type: 'text', required: false },
                { name: 'content', label: '운동 내용/소감', type: 'textarea', required: false }
            ]
        },
        phone: {
            id: 'phone',
            name: '스마트폰 사용시간',
            screen: 'phoneScreen',
            calendar: 'phoneCalendar',
            category: 'phone',
            categoryName: '스마트폰',
            fields: [
                { name: 'duration', label: '사용 시간 (예: 2시간 30분)', type: 'text', required: false },
                { name: 'content', label: '메모', type: 'textarea', required: false }
            ]
        },
        special: {
            id: 'special',
            name: '특별한 일정',
            screen: 'specialScreen',
            calendar: 'specialCalendar',
            category: 'special',
            categoryName: '특별',
            fields: [
                { name: 'title', label: '일정 제목', type: 'text', required: false },
                { name: 'content', label: '일정 내용', type: 'textarea', required: false }
            ]
        }
    };

    // ===== State Management =====
    let state = {
        user: null,
        isGuest: false,
        currentScreen: 'home',
        currentChannel: null,
        currentMonth: 0,
        selectedDate: null,
        editingEntryId: null,
        data: {},
        darkMode: localStorage.getItem('darkMode') === 'true'
    };

    // ===== DOM Elements =====
    const elements = {
        appHeader: document.getElementById('appHeader'),
        appMain: document.getElementById('appMain'),
        loginScreen: document.getElementById('loginScreen'),
        btnGoogleLogin: document.getElementById('btnGoogleLogin'),
        btnGuestLogin: document.getElementById('btnGuestLogin'),
        guestBanner: document.getElementById('guestBanner'),
        btnGuestToLogin: document.getElementById('btnGuestToLogin'),
        userBar: document.getElementById('userBar'),
        userAvatar: document.getElementById('userAvatar'),
        userName: document.getElementById('userName'),
        btnLogout: document.getElementById('btnLogout'),
        homeScreen: document.getElementById('homeScreen'),
        modalOverlay: document.getElementById('modalOverlay'),
        entryModal: document.getElementById('entryModal'),
        modalTitle: document.getElementById('modalTitle'),
        modalBody: document.getElementById('modalBody'),
        modalClose: document.getElementById('modalClose'),
        btnSave: document.getElementById('btnSave'),
        btnDelete: document.getElementById('btnDelete'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        themeToggle: document.getElementById('themeToggle')
    };

    // ===== Loading =====
    function showLoading() {
        elements.loadingOverlay.classList.add('active');
    }

    function hideLoading() {
        elements.loadingOverlay.classList.remove('active');
    }

    // ===== Authentication =====
    function handleAuthStateChanged(user) {
        if (user) {
            state.user = user;
            state.isGuest = false;
            elements.loginScreen.style.display = 'none';
            elements.appMain.style.display = 'block';
            elements.guestBanner.style.display = 'none';
            elements.userBar.style.display = 'flex';
            elements.userAvatar.src = user.photoURL || '';
            elements.userName.textContent = user.displayName || user.email;
            loadAllData();
        } else if (!state.isGuest) {
            state.user = null;
            state.data = {};
            elements.loginScreen.style.display = 'flex';
            elements.appMain.style.display = 'none';
        }
    }

    // ===== Guest Mode =====
    async function enterGuestMode() {
        state.isGuest = true;
        state.user = null;
        elements.loginScreen.style.display = 'none';
        elements.appMain.style.display = 'block';
        elements.guestBanner.style.display = 'flex';
        elements.userBar.style.display = 'none';
        await loadGuestData();
    }

    async function loadGuestData() {
        showLoading();
        try {
            const sharedDoc = await db.collection('shared').doc(SHARED_DOC_ID).get();
            if (sharedDoc.exists) {
                state.data = sharedDoc.data().entries || {};
            } else {
                state.data = {};
            }
            if (state.currentChannel) {
                initCalendar(state.currentChannel);
            }
        } catch (error) {
            console.error('Error loading guest data:', error);
            state.data = {};
        } finally {
            hideLoading();
        }
    }

    function exitGuestMode() {
        state.isGuest = false;
        state.data = {};
        elements.guestBanner.style.display = 'none';
        elements.loginScreen.style.display = 'flex';
        elements.appMain.style.display = 'none';
        showScreen('home');
    }

    async function loginWithGoogle() {
        try {
            showLoading();
            await auth.signInWithPopup(googleProvider);
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        } finally {
            hideLoading();
        }
    }

    async function logout() {
        try {
            await auth.signOut();
            state.data = {};
            showScreen('home');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // ===== Firestore Data Management =====
    // 공유 문서 ID - 모든 사용자가 같은 데이터를 공유
    const SHARED_DOC_ID = 'siyoon-family-shared';

    function getUserDocRef() {
        if (!state.user) return null;
        // 모든 사용자가 공유 문서에 접근
        return db.collection('shared').doc(SHARED_DOC_ID);
    }

    async function loadAllData() {
        if (!state.user) return;

        showLoading();
        try {
            const userDoc = await getUserDocRef().get();
            if (userDoc.exists) {
                state.data = userDoc.data().entries || {};
            } else {
                state.data = {};
                await getUserDocRef().set({ entries: {} });
            }
            // Refresh current view
            if (state.currentChannel) {
                initCalendar(state.currentChannel);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            alert('데이터를 불러오는데 실패했습니다.');
        } finally {
            hideLoading();
        }
    }

    async function saveAllData() {
        if (!state.user) return;

        try {
            await getUserDocRef().set({ entries: state.data }, { merge: true });
        } catch (error) {
            console.error('Error saving data:', error);
            alert('저장에 실패했습니다. 다시 시도해주세요.');
        }
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function getEntries(channelId, date) {
        const key = `${channelId}-${date}`;
        return state.data[key] || [];
    }

    async function addEntry(channelId, date, entry) {
        const key = `${channelId}-${date}`;
        if (!state.data[key]) {
            state.data[key] = [];
        }
        const newEntry = {
            ...entry,
            id: generateId(),
            createdAt: new Date().toISOString()
        };
        state.data[key].push(newEntry);
        await saveAllData();
        return newEntry;
    }

    async function updateEntry(channelId, date, entryId, entry) {
        const key = `${channelId}-${date}`;
        if (state.data[key]) {
            const index = state.data[key].findIndex(e => e.id === entryId);
            if (index !== -1) {
                state.data[key][index] = {
                    ...state.data[key][index],
                    ...entry,
                    updatedAt: new Date().toISOString()
                };
                await saveAllData();
            }
        }
    }

    async function deleteEntry(channelId, date, entryId) {
        const key = `${channelId}-${date}`;
        if (state.data[key]) {
            state.data[key] = state.data[key].filter(e => e.id !== entryId);
            if (state.data[key].length === 0) {
                delete state.data[key];
            }
            await saveAllData();
        }
    }

    function getAllEntriesForDate(date) {
        const entries = [];
        Object.keys(CHANNELS).forEach(channelId => {
            const channelEntries = getEntries(channelId, date);
            channelEntries.forEach(entry => {
                entries.push({
                    ...entry,
                    channelId,
                    channel: CHANNELS[channelId]
                });
            });
        });
        return entries;
    }

    // ===== Navigation =====
    function showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        let screenId;
        if (screenName === 'home') {
            screenId = 'homeScreen';
            state.currentChannel = null;
        } else if (screenName === 'study') {
            screenId = 'studyScreen';
            state.currentChannel = null;
        } else if (CHANNELS[screenName]) {
            screenId = CHANNELS[screenName].screen;
            state.currentChannel = screenName;
            setTimeout(() => initCalendar(screenName), 0);
        }

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            state.currentScreen = screenName;
        }
    }

    function goHome() {
        showScreen('home');
        state.currentMonth = 0;
        displayRandomBibleVerse();
    }

    // ===== Calendar Rendering =====
    function initCalendar(channelId) {
        const channel = CHANNELS[channelId];
        if (!channel) return;

        const container = document.getElementById(channel.calendar);
        if (!container) return;

        if (channelId === 'schedule') {
            renderFullCalendar(container);
        } else {
            renderSingleCalendar(container, channelId, state.currentMonth);
        }
    }

    function renderFullCalendar(container) {
        let html = '<div class="calendar-full">';
        html += renderMonthCalendar(0, true);
        html += renderMonthCalendar(1, true);
        html += '</div>';

        html += `
            <div class="calendar-legend">
                <div class="legend-item"><div class="legend-color schedule"></div>일정</div>
                <div class="legend-item"><div class="legend-color study"></div>학습</div>
                <div class="legend-item"><div class="legend-color game"></div>게임</div>
                <div class="legend-item"><div class="legend-color reading"></div>독서</div>
                <div class="legend-item"><div class="legend-color kindness"></div>선행</div>
                <div class="legend-item"><div class="legend-color exercise"></div>운동</div>
                <div class="legend-item"><div class="legend-color phone"></div>스마트폰</div>
                <div class="legend-item"><div class="legend-color special"></div>특별</div>
            </div>
        `;

        container.innerHTML = html;

        container.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const date = dayEl.dataset.date;
                openScheduleModal(date);
            });
        });
    }

    function renderMonthCalendar(monthOffset, isFullView) {
        const year = 2026;
        const month = monthOffset;
        const today = new Date();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const monthNames = ['2026년 1월', '2026년 2월'];
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

        let html = `
            <div class="calendar-month">
                <div class="calendar-header">
                    <span class="calendar-month-year">${monthNames[monthOffset]}</span>
                </div>
                <div class="calendar-weekdays">
                    ${weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
                </div>
                <div class="calendar-days">
        `;

        for (let i = 0; i < startDayOfWeek; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayOfWeek = (startDayOfWeek + day - 1) % 7;
            const isToday = today.getFullYear() === year &&
                           today.getMonth() === month &&
                           today.getDate() === day;

            const allEntries = getAllEntriesForDate(dateStr);
            const hasEntry = allEntries.length > 0;

            let classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (hasEntry) classes.push('has-entry');
            if (dayOfWeek === 0) classes.push('sunday');
            if (dayOfWeek === 6) classes.push('saturday');

            let entriesHtml = '<div class="day-entries">';
            allEntries.forEach(entry => {
                // 지식 디딤돌 하위 채널은 전체 이름 + 성적 표시
                let label;
                if (entry.channel.id.startsWith('study-')) {
                    label = entry.channel.name;
                    if (entry.score) {
                        label += ` (${entry.score}점)`;
                    }
                } else {
                    label = getEntryLabel(entry);
                }
                entriesHtml += `<div class="entry-tag ${entry.channel.category}">${label}</div>`;
            });
            entriesHtml += '</div>';

            html += `
                <div class="${classes.join(' ')}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    ${entriesHtml}
                </div>
            `;
        }

        html += '</div></div>';
        return html;
    }

    function renderSingleCalendar(container, channelId, monthOffset) {
        const channel = CHANNELS[channelId];
        const year = 2026;
        const month = monthOffset;
        const today = new Date();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const monthNames = ['2026년 1월', '2026년 2월'];
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

        let html = `
            <div class="calendar-header">
                <button class="calendar-nav-btn" id="calPrev" ${monthOffset === 0 ? 'disabled' : ''}>‹</button>
                <span class="calendar-month-year">${monthNames[monthOffset]}</span>
                <button class="calendar-nav-btn" id="calNext" ${monthOffset === 1 ? 'disabled' : ''}>›</button>
            </div>
            <div class="calendar-weekdays">
                ${weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
            </div>
            <div class="calendar-days">
        `;

        for (let i = 0; i < startDayOfWeek; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayOfWeek = (startDayOfWeek + day - 1) % 7;
            const isToday = today.getFullYear() === year &&
                           today.getMonth() === month &&
                           today.getDate() === day;

            const entries = getEntries(channelId, dateStr);
            const hasEntry = entries.length > 0;

            let classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (hasEntry) classes.push('has-entry');
            if (dayOfWeek === 0) classes.push('sunday');
            if (dayOfWeek === 6) classes.push('saturday');

            let entriesHtml = '<div class="day-entries">';
            const maxDisplay = 3;
            const displayEntries = entries.slice(0, maxDisplay);

            displayEntries.forEach(entry => {
                const label = getEntryLabel({ ...entry, channel });
                entriesHtml += `<div class="entry-tag ${channel.category}">${label}</div>`;
            });

            if (entries.length > maxDisplay) {
                entriesHtml += `<div class="entry-more">+${entries.length - maxDisplay}개</div>`;
            }
            entriesHtml += '</div>';

            html += `
                <div class="${classes.join(' ')}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    ${entriesHtml}
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const date = dayEl.dataset.date;
                openEntryModal(channelId, date);
            });
        });

        const prevBtn = container.querySelector('#calPrev');
        const nextBtn = container.querySelector('#calNext');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (state.currentMonth > 0) {
                    state.currentMonth--;
                    renderSingleCalendar(container, channelId, state.currentMonth);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (state.currentMonth < 1) {
                    state.currentMonth++;
                    renderSingleCalendar(container, channelId, state.currentMonth);
                }
            });
        }
    }

    function getEntryLabel(entry) {
        const channel = entry.channel;
        if (channel.id === 'schedule' || channel.id === 'special') {
            return entry.title || channel.categoryName;
        } else if (channel.id === 'reading') {
            return entry.bookTitle || '독서';
        } else if (channel.id === 'game') {
            return entry.gameName || '게임';
        } else if (channel.id === 'phone') {
            return entry.duration || '스마트폰';
        } else if (channel.id === 'kindness') {
            return '선행';
        } else if (channel.id === 'exercise') {
            return entry.exerciseType || '운동';
        } else if (channel.id.startsWith('study-')) {
            if (entry.page) return entry.page;
            if (entry.subject) return entry.subject;
            return channel.categoryName;
        }
        return channel.categoryName;
    }

    // ===== Modal =====
    function openScheduleModal(date) {
        state.selectedDate = date;
        state.currentChannel = 'schedule';

        const dateObj = new Date(date);
        const dateStr = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;

        elements.modalTitle.textContent = `${dateStr} 전체 일정`;

        const allEntries = getAllEntriesForDate(date);

        let html = '';

        if (allEntries.length > 0) {
            html += '<div class="entries-list">';
            html += '<div class="entries-list-title">등록된 일정</div>';

            allEntries.forEach(entry => {
                const label = getEntryLabel(entry);
                const channelName = entry.channel.name;
                // 상세 정보 생성
                let details = [];
                if (entry.channel.id.startsWith('study-')) {
                    if (entry.page) details.push(entry.page);
                    if (entry.score) details.push(`${entry.score}점`);
                    if (entry.subject) details.push(entry.subject);
                } else if (entry.channel.id === 'reading') {
                    if (entry.bookTitle) details.push(entry.bookTitle);
                    if (entry.pages) details.push(`${entry.pages}쪽`);
                } else if (entry.channel.id === 'exercise') {
                    if (entry.exerciseType) details.push(entry.exerciseType);
                    if (entry.duration) details.push(entry.duration);
                } else if (entry.channel.id === 'phone') {
                    if (entry.duration) details.push(entry.duration);
                } else if (entry.channel.id === 'game') {
                    if (entry.gameName) details.push(entry.gameName);
                }
                if (entry.content) details.push(entry.content.substring(0, 50) + (entry.content.length > 50 ? '...' : ''));

                html += `
                    <div class="entry-item" style="border-left-color: var(--color-${entry.channel.category})">
                        <div class="entry-item-content">
                            <strong>[${channelName}]</strong> ${details.length > 0 ? details.join(' / ') : label}
                        </div>
                        ${!state.isGuest ? `<button class="entry-item-delete" data-channel="${entry.channelId}" data-id="${entry.id}">&times;</button>` : ''}
                    </div>
                `;
            });

            html += '</div>';
        }

        // Guest mode: show login prompt instead of edit form
        if (state.isGuest) {
            if (allEntries.length === 0) {
                html += '<div class="entries-list"><div class="entries-list-title">등록된 일정이 없습니다</div></div>';
            }
            html += `
                <div class="login-required-notice">
                    <p>일정을 추가하려면 로그인이 필요합니다</p>
                    <button class="btn-login-from-modal" id="btnLoginFromModal">Google로 로그인</button>
                </div>
            `;
        } else {
            html += `
                <div class="form-group">
                    <label class="form-label">새 일정 추가</label>
                </div>
                <div class="form-group">
                    <label class="form-label">일정 제목</label>
                    <input type="text" class="form-input" name="title" placeholder="일정 제목을 입력하세요">
                </div>
                <div class="form-group">
                    <label class="form-label">일정 내용</label>
                    <textarea class="form-textarea" name="content" placeholder="일정 내용을 입력하세요"></textarea>
                </div>
            `;
        }

        elements.modalBody.innerHTML = html;
        elements.btnDelete.style.display = 'none';
        elements.btnSave.style.display = state.isGuest ? 'none' : 'block';
        elements.modalOverlay.classList.add('active');

        // Guest login button in modal
        const btnLoginFromModal = elements.modalBody.querySelector('#btnLoginFromModal');
        if (btnLoginFromModal) {
            btnLoginFromModal.addEventListener('click', () => {
                closeModal();
                exitGuestMode();
                loginWithGoogle();
            });
        }

        if (!state.isGuest) {
            elements.modalBody.querySelectorAll('.entry-item-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const channelId = btn.dataset.channel;
                    const entryId = btn.dataset.id;
                    if (confirm('이 일정을 삭제하시겠습니까?')) {
                        showLoading();
                        await deleteEntry(channelId, date, entryId);
                        hideLoading();
                        openScheduleModal(date);
                        refreshAllCalendars();
                    }
                });
            });
        }
    }

    function openEntryModal(channelId, date, entryId = null) {
        const channel = CHANNELS[channelId];
        if (!channel) return;

        state.selectedDate = date;
        state.currentChannel = channelId;
        state.editingEntryId = entryId;

        const dateObj = new Date(date);
        const dateStr = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;

        elements.modalTitle.textContent = `${channel.name} - ${dateStr}`;

        const entries = getEntries(channelId, date);
        const editingEntry = entryId ? entries.find(e => e.id === entryId) : null;

        let html = '';

        if (!entryId && entries.length > 0) {
            html += '<div class="entries-list">';
            html += '<div class="entries-list-title">등록된 내용</div>';

            entries.forEach(entry => {
                // 채널별 상세 정보 생성
                let details = [];
                if (channel.id.startsWith('study-')) {
                    if (entry.page) details.push(`📚 ${entry.page}`);
                    if (entry.score) details.push(`📊 ${entry.score}점`);
                    if (entry.subject) details.push(`📚 ${entry.subject}`);
                } else if (channel.id === 'reading') {
                    if (entry.bookTitle) details.push(`📖 ${entry.bookTitle}`);
                    if (entry.pages) details.push(`📄 ${entry.pages}쪽`);
                } else if (channel.id === 'exercise') {
                    if (entry.exerciseType) details.push(`🏃 ${entry.exerciseType}`);
                    if (entry.duration) details.push(`⏱️ ${entry.duration}`);
                } else if (channel.id === 'phone') {
                    if (entry.duration) details.push(`⏱️ ${entry.duration}`);
                } else if (channel.id === 'game') {
                    if (entry.gameName) details.push(`🎮 ${entry.gameName}`);
                } else if (channel.id === 'schedule' || channel.id === 'special') {
                    if (entry.title) details.push(`📌 ${entry.title}`);
                } else if (channel.id === 'kindness') {
                    details.push('💝 선행 완료');
                }
                if (entry.content) details.push(`💬 ${entry.content}`);

                const detailsHtml = details.length > 0 ? details.join('<br>') : channel.categoryName;

                html += `
                    <div class="entry-item">
                        <div class="entry-item-content" ${!state.isGuest ? `data-edit="${entry.id}" style="cursor: pointer;"` : ''}>
                            ${detailsHtml}
                        </div>
                        ${!state.isGuest ? `<button class="entry-item-delete" data-id="${entry.id}">&times;</button>` : ''}
                    </div>
                `;
            });

            html += '</div>';
        }

        // Guest mode: show login prompt instead of edit form
        if (state.isGuest) {
            if (entries.length === 0) {
                html += '<div class="entries-list"><div class="entries-list-title">등록된 내용이 없습니다</div></div>';
            }
            html += `
                <div class="login-required-notice">
                    <p>내용을 추가하려면 로그인이 필요합니다</p>
                    <button class="btn-login-from-modal" id="btnLoginFromModal">Google로 로그인</button>
                </div>
            `;
        } else {
            if (!entryId && entries.length > 0) {
                html += '<div class="form-group"><label class="form-label">새로 추가</label></div>';
            }

            channel.fields.forEach(field => {
                const value = editingEntry ? (editingEntry[field.name] || '') : '';
                if (field.type === 'textarea') {
                    html += `
                        <div class="form-group">
                            <label class="form-label">${field.label}</label>
                            <textarea class="form-textarea" name="${field.name}"
                                placeholder="${field.label}을(를) 입력하세요">${value}</textarea>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="form-group">
                            <label class="form-label">${field.label}</label>
                            <input type="${field.type}" class="form-input" name="${field.name}"
                                value="${value}" placeholder="${field.label}을(를) 입력하세요">
                        </div>
                    `;
                }
            });
        }

        elements.modalBody.innerHTML = html;
        elements.btnDelete.style.display = (!state.isGuest && entryId) ? 'block' : 'none';
        elements.btnDelete.disabled = !entryId;
        elements.btnSave.style.display = state.isGuest ? 'none' : 'block';
        elements.modalOverlay.classList.add('active');

        // Guest login button in modal
        const btnLoginFromModal = elements.modalBody.querySelector('#btnLoginFromModal');
        if (btnLoginFromModal) {
            btnLoginFromModal.addEventListener('click', () => {
                closeModal();
                exitGuestMode();
                loginWithGoogle();
            });
        }

        if (!state.isGuest) {
            elements.modalBody.querySelectorAll('[data-edit]').forEach(el => {
                el.addEventListener('click', () => {
                    openEntryModal(channelId, date, el.dataset.edit);
                });
            });

            elements.modalBody.querySelectorAll('.entry-item-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    if (confirm('삭제하시겠습니까?')) {
                        showLoading();
                        await deleteEntry(channelId, date, id);
                        hideLoading();
                        openEntryModal(channelId, date);
                        refreshCurrentCalendar();
                    }
                });
            });
        }
    }

    function closeModal() {
        elements.modalOverlay.classList.remove('active');
        state.selectedDate = null;
        state.editingEntryId = null;
    }

    async function saveEntry() {
        if (!state.currentChannel || !state.selectedDate) return;

        const channel = CHANNELS[state.currentChannel];
        const entry = {};
        let hasValue = false;

        channel.fields.forEach(field => {
            const input = elements.modalBody.querySelector(`[name="${field.name}"]`);
            if (input) {
                const value = input.value.trim();
                entry[field.name] = value;
                if (value) hasValue = true;
            }
        });

        if (!hasValue) {
            closeModal();
            return;
        }

        showLoading();
        try {
            if (state.editingEntryId) {
                await updateEntry(state.currentChannel, state.selectedDate, state.editingEntryId, entry);
            } else {
                await addEntry(state.currentChannel, state.selectedDate, entry);
            }
        } finally {
            hideLoading();
        }

        closeModal();
        refreshAllCalendars();
    }

    async function deleteCurrentEntry() {
        if (!state.currentChannel || !state.selectedDate || !state.editingEntryId) return;

        if (confirm('정말 삭제하시겠습니까?')) {
            showLoading();
            await deleteEntry(state.currentChannel, state.selectedDate, state.editingEntryId);
            hideLoading();
            closeModal();
            refreshAllCalendars();
        }
    }

    function refreshCurrentCalendar() {
        if (state.currentChannel && CHANNELS[state.currentChannel]) {
            const container = document.getElementById(CHANNELS[state.currentChannel].calendar);
            if (container) {
                if (state.currentChannel === 'schedule') {
                    renderFullCalendar(container);
                } else {
                    renderSingleCalendar(container, state.currentChannel, state.currentMonth);
                }
            }
        }
    }

    function refreshAllCalendars() {
        const scheduleContainer = document.getElementById('scheduleCalendar');
        if (scheduleContainer && state.currentScreen === 'schedule') {
            renderFullCalendar(scheduleContainer);
        }

        if (state.currentChannel && state.currentChannel !== 'schedule') {
            refreshCurrentCalendar();
        }
    }

    // ===== 채널별 색상 정의 =====
    const CHANNEL_COLORS = {
        'schedule': { bg: '#E8F5E9', text: '#2E7D32' },
        'study-basic': { bg: '#EDE7F6', text: '#5E35B1' },
        'study-math': { bg: '#EDE7F6', text: '#5E35B1' },
        'study-calc': { bg: '#EDE7F6', text: '#5E35B1' },
        'study-english': { bg: '#EDE7F6', text: '#5E35B1' },
        'study-elihi': { bg: '#EDE7F6', text: '#5E35B1' },
        'game': { bg: '#FFF3E0', text: '#E65100' },
        'reading': { bg: '#E3F2FD', text: '#1565C0' },
        'kindness': { bg: '#FCE4EC', text: '#C2185B' },
        'exercise': { bg: '#E8F5E9', text: '#388E3C' },
        'phone': { bg: '#E0F7FA', text: '#00838F' },
        'special': { bg: '#FFEBEE', text: '#C62828' }
    };

    // ===== HTML 테이블 다운로드 (스타일 포함) =====
    function generateStyledHTML(channelId) {
        let rows = [];
        let headers = ['날짜', '채널'];
        let channelIds = [];

        if (channelId === 'all') {
            const allFields = new Set();
            Object.values(CHANNELS).forEach(ch => {
                ch.fields.forEach(f => allFields.add(f.label));
            });
            headers = headers.concat(Array.from(allFields));

            Object.keys(state.data).forEach(key => {
                // 날짜는 항상 YYYY-MM-DD 형식 (10자)이므로 뒤에서 추출
                const date = key.slice(-10);
                const chId = key.slice(0, -11); // 날짜 앞의 '-' 포함해서 제거
                const channel = CHANNELS[chId];
                if (!channel) return;

                state.data[key].forEach(entry => {
                    const row = [date, channel.name];
                    Array.from(allFields).forEach(fieldLabel => {
                        const field = channel.fields.find(f => f.label === fieldLabel);
                        if (field) {
                            row.push(entry[field.name] || '');
                        } else {
                            row.push('');
                        }
                    });
                    rows.push(row);
                    channelIds.push(chId);
                });
            });
        } else {
            const channel = CHANNELS[channelId];
            if (!channel) return null;

            headers = headers.concat(channel.fields.map(f => f.label));

            Object.keys(state.data).forEach(key => {
                if (!key.startsWith(channelId + '-')) return;
                const date = key.replace(channelId + '-', '');

                state.data[key].forEach(entry => {
                    const row = [date, channel.name];
                    channel.fields.forEach(field => {
                        row.push(entry[field.name] || '');
                    });
                    rows.push(row);
                    channelIds.push(channelId);
                });
            });
        }

        // 날짜순 정렬
        const sortedIndices = rows.map((_, i) => i).sort((a, b) => rows[a][0].localeCompare(rows[b][0]));
        rows = sortedIndices.map(i => rows[i]);
        channelIds = sortedIndices.map(i => channelIds[i]);

        if (rows.length === 0) return null;

        // HTML 테이블 생성 (구글 시트에서 열 때 스타일 적용됨)
        let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
    table { border-collapse: collapse; width: 100%; font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
    th { background-color: #FFEB00; color: #191919; font-weight: bold; padding: 12px 8px; border: 1px solid #E0E0E0; text-align: center; font-size: 14px; }
    td { padding: 10px 8px; border: 1px solid #E0E0E0; font-size: 13px; }
    .date { font-weight: bold; text-align: center; width: 100px; }
    .channel { font-weight: 600; text-align: center; width: 150px; }
    tr:nth-child(even) { background-color: #FAFAFA; }
</style>
</head>
<body>
<table>
<thead>
<tr>`;

        headers.forEach((h, i) => {
            html += `<th>${h}</th>`;
        });
        html += `</tr></thead><tbody>`;

        rows.forEach((row, rowIndex) => {
            const chId = channelIds[rowIndex];
            const colors = CHANNEL_COLORS[chId] || { bg: '#FFFFFF', text: '#000000' };

            html += `<tr>`;
            row.forEach((cell, cellIndex) => {
                if (cellIndex === 0) {
                    html += `<td class="date">${cell}</td>`;
                } else if (cellIndex === 1) {
                    html += `<td class="channel" style="background-color: ${colors.bg}; color: ${colors.text};">${cell}</td>`;
                } else {
                    html += `<td>${cell}</td>`;
                }
            });
            html += `</tr>`;
        });

        html += `</tbody></table></body></html>`;
        return html;
    }

    function downloadStyledSheet(channelId) {
        const html = generateStyledHTML(channelId);
        if (!html) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        const channelName = channelId === 'all' ? '전체일정' : CHANNELS[channelId]?.name || channelId;
        const filename = `시윤_겨울방학_${channelName}_${new Date().toISOString().split('T')[0]}.xls`;

        // .xls 확장자로 저장하면 구글 시트/엑셀에서 스타일이 적용된 상태로 열림
        const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // ===== CSV Download (백업용) =====
    function generateCSV(channelId) {
        let rows = [];
        let headers = ['날짜', '채널'];

        if (channelId === 'all') {
            const allFields = new Set();
            Object.values(CHANNELS).forEach(ch => {
                ch.fields.forEach(f => allFields.add(f.label));
            });
            headers = headers.concat(Array.from(allFields));

            Object.keys(state.data).forEach(key => {
                const [chId, date] = key.split(/-(.+)/);
                const channel = CHANNELS[chId];
                if (!channel) return;

                state.data[key].forEach(entry => {
                    const row = [date, channel.name];
                    Array.from(allFields).forEach(fieldLabel => {
                        const field = channel.fields.find(f => f.label === fieldLabel);
                        if (field) {
                            row.push(entry[field.name] || '');
                        } else {
                            row.push('');
                        }
                    });
                    rows.push(row);
                });
            });
        } else {
            const channel = CHANNELS[channelId];
            if (!channel) return null;

            headers = headers.concat(channel.fields.map(f => f.label));

            Object.keys(state.data).forEach(key => {
                if (!key.startsWith(channelId + '-')) return;
                const date = key.replace(channelId + '-', '');

                state.data[key].forEach(entry => {
                    const row = [date, channel.name];
                    channel.fields.forEach(field => {
                        row.push(entry[field.name] || '');
                    });
                    rows.push(row);
                });
            });
        }

        rows.sort((a, b) => a[0].localeCompare(b[0]));

        const escapeCSV = (str) => {
            if (str === null || str === undefined) return '';
            str = String(str);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };

        const csvContent = '\uFEFF' + [headers, ...rows]
            .map(row => row.map(escapeCSV).join(','))
            .join('\n');

        return csvContent;
    }

    function downloadCSV(channelId) {
        // 스타일이 적용된 시트로 다운로드
        downloadStyledSheet(channelId);
    }

    // ===== Dark Mode =====
    function initDarkMode() {
        if (state.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            elements.themeToggle.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            elements.themeToggle.textContent = '🌙';
        }
    }

    function toggleDarkMode() {
        state.darkMode = !state.darkMode;
        localStorage.setItem('darkMode', state.darkMode);
        initDarkMode();
    }

    // ===== Event Listeners =====
    function initEventListeners() {
        elements.appHeader.addEventListener('click', goHome);
        elements.btnGoogleLogin.addEventListener('click', loginWithGoogle);
        elements.btnGuestLogin.addEventListener('click', enterGuestMode);
        elements.btnGuestToLogin.addEventListener('click', () => {
            exitGuestMode();
            loginWithGoogle();
        });
        elements.btnLogout.addEventListener('click', logout);
        elements.themeToggle.addEventListener('click', toggleDarkMode);

        // 다운로드 버튼 이벤트
        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const channelId = btn.dataset.channel;
                downloadCSV(channelId);
            });
        });

        document.querySelectorAll('.channel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const channel = btn.dataset.channel;
                if (channel === 'study') {
                    showScreen('study');
                } else if (channel) {
                    showScreen(channel);
                }
            });
        });

        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.back;
                if (target === 'home') {
                    goHome();
                } else if (target === 'study') {
                    showScreen('study');
                }
            });
        });

        elements.modalClose.addEventListener('click', closeModal);
        elements.modalOverlay.addEventListener('click', (e) => {
            if (e.target === elements.modalOverlay) {
                closeModal();
            }
        });
        elements.btnSave.addEventListener('click', saveEntry);
        elements.btnDelete.addEventListener('click', deleteCurrentEntry);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ===== Initialize =====
    function init() {
        initEventListeners();
        initDarkMode();
        displayRandomBibleVerse();
        displayWeather();
        auth.onAuthStateChanged(handleAuthStateChanged);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
