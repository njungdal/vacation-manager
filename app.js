// Siyoon's 2026 Winter Vacation Manager
// Firebase-enabled Application

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
                { name: 'page', label: '교과서 페이지', type: 'text', required: false },
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
                { name: 'page', label: '교과서 페이지', type: 'text', required: false },
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
                { name: 'page', label: '교과서 페이지', type: 'text', required: false },
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
                { name: 'page', label: '교과서 페이지', type: 'text', required: false },
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
        currentScreen: 'home',
        currentChannel: null,
        currentMonth: 0,
        selectedDate: null,
        editingEntryId: null,
        data: {}
    };

    // ===== DOM Elements =====
    const elements = {
        appHeader: document.getElementById('appHeader'),
        appMain: document.getElementById('appMain'),
        loginScreen: document.getElementById('loginScreen'),
        btnGoogleLogin: document.getElementById('btnGoogleLogin'),
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
        loadingOverlay: document.getElementById('loadingOverlay')
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
            elements.loginScreen.style.display = 'none';
            elements.appMain.style.display = 'block';
            elements.userAvatar.src = user.photoURL || '';
            elements.userName.textContent = user.displayName || user.email;
            loadAllData();
        } else {
            state.user = null;
            state.data = {};
            elements.loginScreen.style.display = 'flex';
            elements.appMain.style.display = 'none';
        }
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
    function getUserDocRef() {
        if (!state.user) return null;
        return db.collection('users').doc(state.user.uid);
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
                // 지식 디딤돌 하위 채널은 전체 이름으로 표시
                let label;
                if (entry.channel.id.startsWith('study-')) {
                    label = entry.channel.name;
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
        } else if (channel.id.startsWith('study-')) {
            if (entry.page) return `p.${entry.page}`;
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
                html += `
                    <div class="entry-item" style="border-left-color: var(--color-${entry.channel.category})">
                        <div class="entry-item-content">
                            <strong>[${channelName}]</strong> ${label}
                            ${entry.content ? `<br><small>${entry.content.substring(0, 50)}${entry.content.length > 50 ? '...' : ''}</small>` : ''}
                        </div>
                        <button class="entry-item-delete" data-channel="${entry.channelId}" data-id="${entry.id}">&times;</button>
                    </div>
                `;
            });

            html += '</div>';
        }

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

        elements.modalBody.innerHTML = html;
        elements.btnDelete.style.display = 'none';
        elements.modalOverlay.classList.add('active');

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
                const label = getEntryLabel({ ...entry, channel });
                html += `
                    <div class="entry-item">
                        <div class="entry-item-content" data-edit="${entry.id}" style="cursor: pointer;">
                            ${label}
                            ${entry.content ? `<br><small>${entry.content.substring(0, 30)}${entry.content.length > 30 ? '...' : ''}</small>` : ''}
                        </div>
                        <button class="entry-item-delete" data-id="${entry.id}">&times;</button>
                    </div>
                `;
            });

            html += '</div>';
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

        elements.modalBody.innerHTML = html;
        elements.btnDelete.style.display = entryId ? 'block' : 'none';
        elements.btnDelete.disabled = !entryId;
        elements.modalOverlay.classList.add('active');

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

    // ===== CSV Download for Google Sheets =====
    function generateCSV(channelId) {
        let rows = [];
        let headers = ['날짜', '채널'];

        if (channelId === 'all') {
            // 전체 데이터 - 모든 채널의 모든 필드 포함
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
            // 특정 채널 데이터
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

        // 날짜순 정렬
        rows.sort((a, b) => a[0].localeCompare(b[0]));

        // CSV 문자열 생성 (BOM 추가로 한글 지원)
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
        const csv = generateCSV(channelId);
        if (!csv) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        const channelName = channelId === 'all' ? '전체일정' : CHANNELS[channelId]?.name || channelId;
        const filename = `시윤_겨울방학_${channelName}_${new Date().toISOString().split('T')[0]}.csv`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    // ===== Event Listeners =====
    function initEventListeners() {
        elements.appHeader.addEventListener('click', goHome);
        elements.btnGoogleLogin.addEventListener('click', loginWithGoogle);
        elements.btnLogout.addEventListener('click', logout);

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
        auth.onAuthStateChanged(handleAuthStateChanged);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
