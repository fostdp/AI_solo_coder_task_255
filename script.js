class MathGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.timer = null;
        this.timeLeft = 0;
        this.maxTime = 15;
        this.isPlaying = false;
        this.wrongQuestions = [];
        this.mode = 'arithmetic';
        this.inequalityAnswer = null;
        this.selectedRoom = null;
        
        this.initElements();
        this.bindEvents();
        this.initLeaderboard();
        this.initBattleRooms();
    }

    initElements() {
        this.scoreEl = document.getElementById('score');
        this.levelEl = document.getElementById('level');
        this.correctEl = document.getElementById('correct');
        this.wrongEl = document.getElementById('wrong');
        this.questionEl = document.getElementById('question');
        this.answerInput = document.getElementById('answer-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.timerBar = document.getElementById('timer-bar');
        this.startBtn = document.getElementById('start-btn');
        this.historyBtn = document.getElementById('history-btn');
        this.leaderboardBtn = document.getElementById('leaderboard-btn');
        this.battleBtn = document.getElementById('battle-btn');
        this.historyModal = document.getElementById('history-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.leaderboardModal = document.getElementById('leaderboard-modal');
        this.battleModal = document.getElementById('battle-modal');
        this.historyContent = document.getElementById('history-content');
        this.gameOverStats = document.getElementById('game-over-stats');
        this.leaderboardContent = document.getElementById('leaderboard-content');
        this.restartBtn = document.getElementById('restart-btn');
        this.saveScoreBtn = document.getElementById('save-score-btn');
        this.playerNameInput = document.getElementById('player-name');
        this.closeBtns = document.querySelectorAll('.close');
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.inequalityButtons = document.getElementById('inequality-buttons');
        this.inequalityBtns = document.querySelectorAll('.inequality-btn');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.currentLeaderboardTab = 'arithmetic';
        
        this.battleLobby = document.getElementById('battle-lobby');
        this.battleRoom = document.getElementById('battle-room');
        this.roomNameInput = document.getElementById('room-name');
        this.player1NameInput = document.getElementById('player1-name');
        this.player2NameInput = document.getElementById('player2-name');
        this.createRoomBtn = document.getElementById('create-room-btn');
        this.joinRoomBtn = document.getElementById('join-room-btn');
        this.roomList = document.getElementById('room-list');
        
        this.player1Card = document.getElementById('player1-card');
        this.player2Card = document.getElementById('player2-card');
        this.battleQuestionEl = document.getElementById('battle-question');
        this.battleAnswerInput = document.getElementById('battle-answer-input');
        this.battleSubmitBtn = document.getElementById('battle-submit-btn');
        this.battleFeedback = document.getElementById('battle-feedback');
        this.battleTimerEl = document.getElementById('battle-timer');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.restartBtn.addEventListener('click', () => {
            this.gameOverModal.style.display = 'none';
            this.startGame();
        });
        this.historyBtn.addEventListener('click', () => this.showHistory());
        this.leaderboardBtn.addEventListener('click', () => this.showLeaderboard());
        this.battleBtn.addEventListener('click', () => this.showBattleModal());
        this.saveScoreBtn.addEventListener('click', () => this.saveToLeaderboard());
        
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        
        this.closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });
        
        this.inequalityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.inequalityBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.inequalityAnswer = btn.dataset.value === 'true';
            });
        });
        
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLeaderboardTab = btn.dataset.tab;
                this.renderLeaderboard();
            });
        });
        
        this.createRoomBtn.addEventListener('click', () => this.createRoom());
        this.joinRoomBtn.addEventListener('click', () => this.joinRoom());
        this.battleSubmitBtn.addEventListener('click', () => this.submitBattleAnswer());
        this.battleAnswerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitBattleAnswer();
        });
    }

    switchMode(mode) {
        this.mode = mode;
        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'inequality') {
            this.answerInput.style.display = 'none';
            this.inequalityButtons.classList.remove('hidden');
        } else {
            this.answerInput.style.display = 'block';
            this.inequalityButtons.classList.add('hidden');
        }
        
        this.questionEl.textContent = this.getModeName(mode) + ' - 点击开始游戏';
    }

    getModeName(mode) {
        const names = {
            'arithmetic': '⚡ 速算模式',
            'equation': '📐 方程求解',
            'inequality': '⚖️ 不等式判断'
        };
        return names[mode];
    }

    startGame() {
        this.score = 0;
        this.level = 1;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.wrongQuestions = [];
        this.isPlaying = true;
        this.maxTime = this.mode === 'arithmetic' ? 15 : 20;
        
        this.updateStats();
        this.startBtn.textContent = '游戏中...';
        this.startBtn.disabled = true;
        this.answerInput.value = '';
        this.inequalityAnswer = null;
        this.inequalityBtns.forEach(b => b.classList.remove('selected'));
        this.feedbackEl.textContent = '';
        
        this.nextQuestion();
    }

    generateQuestion() {
        switch (this.mode) {
            case 'arithmetic':
                return this.generateArithmeticQuestion();
            case 'equation':
                return this.generateEquationQuestion();
            case 'inequality':
                return this.generateInequalityQuestion();
            default:
                return this.generateArithmeticQuestion();
        }
    }

    generateArithmeticQuestion() {
        const operators = ['+', '-', '*', '/', '^', '√'];
        let operator;
        
        if (this.level <= 2) {
            operator = operators[Math.floor(Math.random() * 4)];
        } else if (this.level <= 4) {
            operator = operators[Math.floor(Math.random() * 5)];
        } else {
            operator = operators[Math.floor(Math.random() * 6)];
        }

        let num1, num2, expression, answer;
        const maxNum = 5 + this.level * 3;

        switch (operator) {
            case '+':
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                expression = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                expression = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * Math.min(12, maxNum)) + 1;
                num2 = Math.floor(Math.random() * Math.min(12, maxNum)) + 1;
                expression = `${num1} × ${num2}`;
                answer = num1 * num2;
                break;
            case '/':
                num2 = Math.floor(Math.random() * Math.min(10, maxNum)) + 1;
                num2 = Math.max(1, num2);
                answer = Math.floor(Math.random() * Math.min(10, maxNum)) + 1;
                answer = Math.max(1, answer);
                num1 = num2 * answer;
                expression = `${num1} ÷ ${num2}`;
                break;
            case '^':
                num1 = Math.floor(Math.random() * Math.min(10, maxNum)) + 1;
                num2 = Math.floor(Math.random() * 3) + 2;
                expression = `${num1}^${num2}`;
                answer = Math.pow(num1, num2);
                break;
            case '√':
                num1 = Math.floor(Math.random() * Math.min(15, maxNum)) + 1;
                num1 = Math.max(1, num1);
                answer = num1 * num1;
                expression = `√${answer}`;
                answer = num1;
                break;
        }

        if (isNaN(answer) || !isFinite(answer)) {
            console.warn('检测到无效答案，重新生成题目');
            return this.generateArithmeticQuestion();
        }

        return { expression, answer };
    }

    generateEquationQuestion() {
        const maxNum = 5 + this.level * 2;
        let a, b, c, x, expression, answer;
        
        const type = Math.floor(Math.random() * 3);
        
        switch (type) {
            case 0:
                a = Math.floor(Math.random() * maxNum) + 1;
                b = Math.floor(Math.random() * maxNum * 2) + 1;
                x = Math.floor(Math.random() * maxNum) + 1;
                c = a * x + b;
                expression = `${a}x + ${b} = ${c}`;
                answer = x;
                break;
            case 1:
                a = Math.floor(Math.random() * maxNum) + 1;
                b = Math.floor(Math.random() * maxNum) + 1;
                x = Math.floor(Math.random() * maxNum) + 1;
                c = a * x - b;
                expression = `${a}x - ${b} = ${c}`;
                answer = x;
                break;
            case 2:
                a = Math.floor(Math.random() * maxNum) + 1;
                b = Math.floor(Math.random() * maxNum) + 1;
                x = Math.floor(Math.random() * maxNum) + 1;
                c = a * (x + b);
                expression = `${a}(x + ${b}) = ${c}`;
                answer = x;
                break;
        }

        return { expression, answer };
    }

    generateInequalityQuestion() {
        const maxNum = 10 + this.level * 3;
        let num1, num2, operator, expression, answer;
        
        const operators = ['<', '>', '≤', '≥'];
        operator = operators[Math.floor(Math.random() * 4)];
        
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        
        if (Math.random() > 0.3) {
            switch (operator) {
                case '<':
                    answer = num1 < num2;
                    break;
                case '>':
                    answer = num1 > num2;
                    break;
                case '≤':
                    answer = num1 <= num2;
                    break;
                case '≥':
                    answer = num1 >= num2;
                    break;
            }
        } else {
            const op1 = Math.floor(Math.random() * 4) + 2;
            const op2 = Math.floor(Math.random() * 4) + 2;
            const val1 = num1 * op1;
            const val2 = num2 * op2;
            
            switch (operator) {
                case '<':
                    answer = val1 < val2;
                    break;
                case '>':
                    answer = val1 > val2;
                    break;
                case '≤':
                    answer = val1 <= val2;
                    break;
                case '≥':
                    answer = val1 >= val2;
                    break;
            }
            expression = `${num1}×${op1} ${operator} ${num2}×${op2}`;
            return { expression, answer };
        }

        expression = `${num1} ${operator} ${num2}`;
        return { expression, answer };
    }

    nextQuestion() {
        if (!this.isPlaying) return;

        const questionData = this.generateQuestion();
        this.currentQuestion = questionData.expression;
        this.currentAnswer = questionData.answer;
        
        this.questionEl.textContent = this.currentQuestion;
        this.questionEl.className = 'question';
        this.answerInput.value = '';
        this.inequalityAnswer = null;
        this.inequalityBtns.forEach(b => b.classList.remove('selected'));
        this.feedbackEl.textContent = '';
        
        this.startTimer();
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);

        this.timeLeft = this.maxTime;
        this.lastTickTime = Date.now();
        this.updateTimerBar();

        this.timer = setInterval(() => {
            const now = Date.now();
            const deltaTime = (now - this.lastTickTime) / 1000;
            this.lastTickTime = now;
            
            this.timeLeft -= deltaTime;
            this.updateTimerBar();

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.timeLeft = 0;
                this.updateTimerBar();
                this.handleTimeout();
            }
        }, 100);
    }

    updateTimerBar() {
        const percentage = (this.timeLeft / this.maxTime) * 100;
        this.timerBar.style.width = `${percentage}%`;
        
        this.timerBar.classList.remove('warning', 'danger');
        if (percentage <= 30) {
            this.timerBar.classList.add('danger');
        } else if (percentage <= 60) {
            this.timerBar.classList.add('warning');
        }
    }

    handleTimeout() {
        this.wrongCount++;
        this.wrongQuestions.push({
            question: this.currentQuestion,
            correctAnswer: this.currentAnswer,
            userAnswer: '超时'
        });
        
        this.feedbackEl.textContent = `⏰ 超时！正确答案: ${this.currentAnswer}`;
        this.feedbackEl.className = 'feedback wrong';
        this.questionEl.classList.add('wrong');
        
        this.updateStats();
        
        setTimeout(() => {
            if (this.wrongCount >= 3) {
                this.endGame();
            } else {
                this.nextQuestion();
            }
        }, 1500);
    }

    checkAnswer() {
        if (!this.isPlaying) return;
        
        let userAnswer;
        if (this.mode === 'inequality') {
            if (this.inequalityAnswer === null) {
                this.feedbackEl.textContent = '请选择是否成立！';
                return;
            }
            userAnswer = this.inequalityAnswer;
        } else {
            userAnswer = parseFloat(this.answerInput.value);
            if (isNaN(userAnswer)) {
                this.feedbackEl.textContent = '请输入有效数字！';
                return;
            }
        }

        clearInterval(this.timer);

        let isCorrect;
        if (this.mode === 'inequality') {
            isCorrect = userAnswer === this.currentAnswer;
        } else {
            isCorrect = Math.abs(userAnswer - this.currentAnswer) < 0.0001;
        }

        if (isCorrect) {
            this.correctCount++;
            const timeBonus = Math.floor(this.timeLeft * 2);
            const levelBonus = this.level * 10;
            const modeBonus = this.mode === 'arithmetic' ? 0 : (this.mode === 'equation' ? 20 : 30);
            this.score += 100 + timeBonus + levelBonus + modeBonus;
            
            this.feedbackEl.textContent = `✅ 正确！+${100 + timeBonus + levelBonus + modeBonus}分`;
            this.feedbackEl.className = 'feedback correct';
            this.questionEl.classList.add('correct');
            
            if (this.correctCount % 5 === 0) {
                this.levelUp();
            }
        } else {
            this.wrongCount++;
            this.wrongQuestions.push({
                question: this.currentQuestion,
                correctAnswer: this.currentAnswer,
                userAnswer: userAnswer
            });
            
            this.feedbackEl.textContent = `❌ 错误！正确答案: ${this.currentAnswer}`;
            this.feedbackEl.className = 'feedback wrong';
            this.questionEl.classList.add('wrong');
        }

        this.updateStats();

        setTimeout(() => {
            if (this.wrongCount >= 3) {
                this.endGame();
            } else {
                this.nextQuestion();
            }
        }, 1000);
    }

    levelUp() {
        this.level++;
        this.maxTime = Math.max(8, this.mode === 'arithmetic' ? 15 - this.level : 20 - this.level);
        this.feedbackEl.textContent += ` 🎉 升级到等级 ${this.level}！`;
    }

    updateStats() {
        this.scoreEl.textContent = this.score;
        this.levelEl.textContent = this.level;
        this.correctEl.textContent = this.correctCount;
        this.wrongEl.textContent = this.wrongCount;
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timer);
        
        this.startBtn.textContent = '开始游戏';
        this.startBtn.disabled = false;
        
        this.saveGame();
        this.showGameOver();
    }

    saveGame() {
        const gameRecord = {
            date: new Date().toLocaleString('zh-CN'),
            score: this.score,
            level: this.level,
            correctCount: this.correctCount,
            wrongCount: this.wrongCount,
            mode: this.mode,
            wrongQuestions: this.wrongQuestions
        };

        let history = JSON.parse(localStorage.getItem('mathGameHistory') || '[]');
        history.unshift(gameRecord);
        history = history.slice(0, 20);
        localStorage.setItem('mathGameHistory', JSON.stringify(history));
    }

    showGameOver() {
        this.gameOverStats.innerHTML = `
            <div class="game-over-stat">最终得分: <span>${this.score}</span></div>
            <div class="game-over-stat">游戏模式: <span>${this.getModeName(this.mode)}</span></div>
            <div class="game-over-stat">达到等级: <span>${this.level}</span></div>
            <div class="game-over-stat">正确答题: <span>${this.correctCount}</span></div>
            <div class="game-over-stat">错误答题: <span>${this.wrongCount}</span></div>
        `;
        this.gameOverModal.style.display = 'block';
    }

    showHistory() {
        const history = JSON.parse(localStorage.getItem('mathGameHistory') || '[]');
        
        if (history.length === 0) {
            this.historyContent.innerHTML = '<p style="text-align: center; color: #666;">暂无历史记录</p>';
        } else {
            this.historyContent.innerHTML = history.map((record, index) => `
                <div class="history-item">
                    <div class="history-item-header">
                        <span>${this.getModeName(record.mode || 'arithmetic')}</span>
                        <span>${record.date}</span>
                    </div>
                    <div class="history-item-stats">
                        <div>得分: ${record.score}</div>
                        <div>等级: ${record.level}</div>
                        <div>正确率: ${Math.round(record.correctCount / (record.correctCount + record.wrongCount) * 100)}%</div>
                    </div>
                    ${record.wrongQuestions && record.wrongQuestions.length > 0 ? `
                        <div class="wrong-questions">
                            <strong>错题回顾:</strong>
                            ${record.wrongQuestions.map(q => `
                                <div class="wrong-question-item">
                                    ${q.question} = ${q.correctAnswer} (你答: ${q.userAnswer})
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }
        
        this.historyModal.style.display = 'block';
    }

    initLeaderboard() {
        if (!localStorage.getItem('mathGameLeaderboard')) {
            const defaultLeaderboard = {
                arithmetic: [],
                equation: [],
                inequality: [],
                total: []
            };
            localStorage.setItem('mathGameLeaderboard', JSON.stringify(defaultLeaderboard));
        }
    }

    saveToLeaderboard() {
        const playerName = this.playerNameInput.value.trim() || '匿名玩家';
        const leaderboard = JSON.parse(localStorage.getItem('mathGameLeaderboard'));
        
        const record = {
            name: playerName,
            score: this.score,
            level: this.level,
            mode: this.mode,
            date: new Date().toLocaleString('zh-CN')
        };
        
        leaderboard[this.mode].push(record);
        leaderboard[this.mode].sort((a, b) => b.score - a.score);
        leaderboard[this.mode] = leaderboard[this.mode].slice(0, 10);
        
        leaderboard.total.push(record);
        leaderboard.total.sort((a, b) => b.score - a.score);
        leaderboard.total = leaderboard.total.slice(0, 10);
        
        localStorage.setItem('mathGameLeaderboard', JSON.stringify(leaderboard));
        
        this.saveScoreBtn.textContent = '已保存！';
        this.saveScoreBtn.disabled = true;
        
        setTimeout(() => {
            this.gameOverModal.style.display = 'none';
            this.saveScoreBtn.textContent = '保存成绩';
            this.saveScoreBtn.disabled = false;
            this.playerNameInput.value = '';
        }, 1500);
    }

    showLeaderboard() {
        this.renderLeaderboard();
        this.leaderboardModal.style.display = 'block';
    }

    renderLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('mathGameLeaderboard'));
        const data = this.currentLeaderboardTab === 'total' 
            ? leaderboard.total 
            : leaderboard[this.currentLeaderboardTab];
        
        if (!data || data.length === 0) {
            this.leaderboardContent.innerHTML = '<p style="text-align: center; color: #666;">暂无排行榜数据</p>';
            return;
        }
        
        this.leaderboardContent.innerHTML = data.map((record, index) => `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${index < 3 ? 'rank-' + (index + 1) : 'other'}">${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${record.name}</div>
                    <div class="leaderboard-date">${this.getModeName(record.mode || 'arithmetic')} · ${record.date}</div>
                </div>
                <div class="leaderboard-score">${record.score}</div>
            </div>
        `).join('');
    }

    initBattleRooms() {
        if (!localStorage.getItem('mathGameBattleRooms')) {
            localStorage.setItem('mathGameBattleRooms', JSON.stringify([]));
        }
        this.updateRoomList();
    }

    showBattleModal() {
        this.battleLobby.style.display = 'block';
        this.battleRoom.classList.add('hidden');
        this.updateRoomList();
        this.battleModal.style.display = 'block';
    }

    updateRoomList() {
        const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
        
        if (rooms.length === 0) {
            this.roomList.innerHTML = '<p style="text-align: center; color: #888; font-size: 14px;">暂无房间</p>';
        } else {
            this.roomList.innerHTML = rooms.map((room, index) => `
                <div class="room-item" data-index="${index}">
                    <div class="room-name">${room.name}</div>
                    <div class="room-host">房主: ${room.host}</div>
                </div>
            `).join('');
            
            this.roomList.querySelectorAll('.room-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.roomList.querySelectorAll('.room-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    this.selectedRoom = parseInt(item.dataset.index);
                });
            });
        }
    }

    createRoom() {
        const roomName = this.roomNameInput.value.trim() || '数学对战房间';
        const playerName = this.player1NameInput.value.trim() || '玩家1';
        
        const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
        const newRoom = {
            id: Date.now(),
            name: roomName,
            host: playerName,
            player1: playerName,
            player2: null,
            player1Score: 0,
            player2Score: 0,
            currentQuestion: null,
            currentAnswer: null,
            isPlaying: false,
            battleTime: 60
        };
        
        rooms.push(newRoom);
        localStorage.setItem('mathGameBattleRooms', JSON.stringify(rooms));
        
        this.currentRoom = newRoom;
        this.isPlayer1 = true;
        this.startBattleRoom(newRoom, playerName);
    }

    joinRoom() {
        if (this.selectedRoom === null) {
            alert('请选择一个房间！');
            return;
        }
        
        const playerName = this.player2NameInput.value.trim() || '玩家2';
        const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
        const room = rooms[this.selectedRoom];
        
        if (!room) {
            alert('房间不存在！');
            return;
        }
        
        room.player2 = playerName;
        room.isPlaying = true;
        localStorage.setItem('mathGameBattleRooms', JSON.stringify(rooms));
        
        this.currentRoom = room;
        this.isPlayer1 = false;
        this.startBattleRoom(room, playerName);
    }

    startBattleRoom(room, playerName) {
        this.battleLobby.style.display = 'none';
        this.battleRoom.classList.remove('hidden');
        
        this.player1Card.querySelector('.player-name').textContent = room.player1;
        this.player2Card.querySelector('.player-name').textContent = room.player2 || '等待加入...';
        this.player1Card.querySelector('.player-score').textContent = '0';
        this.player2Card.querySelector('.player-score').textContent = '0';
        
        this.battleScore = 0;
        this.battleQuestionEl.textContent = '游戏即将开始...';
        this.battleAnswerInput.value = '';
        this.battleFeedback.textContent = '';
        this.battleEnded = false;
        
        if (room.player2) {
            setTimeout(() => this.startBattle(), 1000);
        }
        
        this.startBattleSync();
    }

    startBattleSync() {
        if (this.battleSyncTimer) clearInterval(this.battleSyncTimer);
        
        this.battleSyncTimer = setInterval(() => {
            if (this.battleEnded) {
                this.lockBattleUI();
                return;
            }
            
            const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
            const room = rooms.find(r => r.id === this.currentRoom?.id);
            
            if (room?.isEnded) {
                this.battleEnded = true;
                this.endBattle();
                return;
            }
            
            if (room) {
                if (this.isPlayer1 && room.player2Score !== undefined) {
                    this.player2Card.querySelector('.player-score').textContent = room.player2Score;
                } else if (!this.isPlayer1 && room.player1Score !== undefined) {
                    this.player1Card.querySelector('.player-score').textContent = room.player1Score;
                }
            }
        }, 500);
    }

    startBattle() {
        this.battleStartTime = Date.now();
        this.battleTotalTime = 60;
        this.battleEnded = false;
        this.battleQuestionEl.textContent = '开始！';
        this.battleTimerEl.textContent = this.battleTotalTime;
        
        if (this.battleTimer) clearInterval(this.battleTimer);
        
        this.battleTimer = setInterval(() => {
            const elapsed = (Date.now() - this.battleStartTime) / 1000;
            this.battleTime = Math.max(0, this.battleTotalTime - elapsed);
            this.battleTimerEl.textContent = Math.ceil(this.battleTime);
            
            this.battleTimerEl.classList.remove('warning', 'danger');
            if (this.battleTime <= 10) {
                this.battleTimerEl.classList.add('danger');
            } else if (this.battleTime <= 20) {
                this.battleTimerEl.classList.add('warning');
            }
            
            if (this.battleTime <= 0) {
                clearInterval(this.battleTimer);
                this.battleEnded = true;
                this.endBattle();
            }
        }, 100);
        
        setTimeout(() => this.nextBattleQuestion(), 1000);
    }

    nextBattleQuestion() {
        if (this.battleEnded || this.battleTime <= 0) return;
        
        const questionData = this.generateArithmeticQuestion();
        this.battleCurrentQuestion = questionData.expression;
        this.battleCurrentAnswer = questionData.answer;
        
        this.battleQuestionEl.textContent = this.battleCurrentQuestion;
        this.battleAnswerInput.value = '';
        this.battleAnswerInput.focus();
        this.battleFeedback.textContent = '';
    }

    submitBattleAnswer() {
        if (this.battleEnded || this.battleTime <= 0) {
            this.battleFeedback.textContent = '游戏已结束！';
            return;
        }
        
        const userAnswer = parseFloat(this.battleAnswerInput.value);
        if (isNaN(userAnswer)) {
            this.battleFeedback.textContent = '请输入有效数字！';
            return;
        }
        
        const isCorrect = Math.abs(userAnswer - this.battleCurrentAnswer) < 0.0001;
        
        if (isCorrect) {
            this.battleScore += 100;
            const scoreEl = this.isPlayer1 
                ? this.player1Card.querySelector('.player-score')
                : this.player2Card.querySelector('.player-score');
            scoreEl.textContent = this.battleScore;
            
            this.syncBattleScore();
            
            this.battleFeedback.textContent = '✅ 正确！+100分';
            this.battleFeedback.style.color = '#4CAF50';
        } else {
            this.battleFeedback.textContent = `❌ 错误！正确答案: ${this.battleCurrentAnswer}`;
            this.battleFeedback.style.color = '#f44336';
        }
        
        setTimeout(() => this.nextBattleQuestion(), 800);
    }

    syncBattleScore() {
        const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
        const roomIndex = rooms.findIndex(r => r.id === this.currentRoom?.id);
        
        if (roomIndex !== -1) {
            if (this.isPlayer1) {
                rooms[roomIndex].player1Score = this.battleScore;
            } else {
                rooms[roomIndex].player2Score = this.battleScore;
            }
            localStorage.setItem('mathGameBattleRooms', JSON.stringify(rooms));
        }
    }

    lockBattleUI() {
        this.battleAnswerInput.disabled = true;
        this.battleSubmitBtn.disabled = true;
        this.battleAnswerInput.style.cursor = 'not-allowed';
        this.battleSubmitBtn.style.cursor = 'not-allowed';
    }

    endBattle() {
        this.battleEnded = true;
        clearInterval(this.battleTimer);
        clearInterval(this.battleSyncTimer);
        
        const player1Score = parseInt(this.player1Card.querySelector('.player-score').textContent) || 0;
        const player2Score = parseInt(this.player2Card.querySelector('.player-score').textContent) || 0;
        
        let result = '';
        if (player1Score > player2Score) {
            result = `${this.player1Card.querySelector('.player-name').textContent} 获胜！`;
        } else if (player2Score > player1Score) {
            result = `${this.player2Card.querySelector('.player-name').textContent} 获胜！`;
        } else {
            result = '平局！';
        }
        
        this.battleQuestionEl.textContent = `游戏结束！${result}`;
        this.battleFeedback.textContent = `最终比分: ${player1Score} - ${player2Score}`;
        this.lockBattleUI();
        
        const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
        const roomIndex = rooms.findIndex(r => r.id === this.currentRoom?.id);
        if (roomIndex !== -1) {
            rooms[roomIndex].isEnded = true;
            localStorage.setItem('mathGameBattleRooms', JSON.stringify(rooms));
            
            setTimeout(() => {
                const updatedRooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
                const idx = updatedRooms.findIndex(r => r.id === this.currentRoom?.id);
                if (idx !== -1) {
                    updatedRooms.splice(idx, 1);
                    localStorage.setItem('mathGameBattleRooms', JSON.stringify(updatedRooms));
                }
            }, 5000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MathGame();
});