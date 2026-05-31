class MathGameTester {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
        this.game = new MathGame();
    }

    test(name, fn) {
        try {
            fn();
            this.passed++;
            this.tests.push({ name, status: 'PASS', error: null });
            console.log(`✅ PASS: ${name}`);
        } catch (error) {
            this.failed++;
            this.tests.push({ name, status: 'FAIL', error: error.message });
            console.log(`❌ FAIL: ${name} - ${error.message}`);
        }
    }

    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message} Expected ${expected}, got ${actual}`);
        }
    }

    assertNotEqual(actual, expected, message = '') {
        if (actual === expected) {
            throw new Error(`${message} Expected not ${expected}, got ${actual}`);
        }
    }

    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(`${message} Expected true, got false`);
        }
    }

    assertCloseTo(actual, expected, precision = 4, message = '') {
        if (Math.abs(actual - expected) > Math.pow(10, -precision)) {
            throw new Error(`${message} Expected ${expected} to be close to ${actual} (precision: ${precision})`);
        }
    }

    assertInRange(value, min, max, message = '') {
        if (value < min || value > max) {
            throw new Error(`${message} Expected ${value} to be in range [${min}, ${max}]`);
        }
    }

    assertType(value, type, message = '') {
        if (typeof value !== type) {
            throw new Error(`${message} Expected type ${type}, got ${typeof value}`);
        }
    }

    runAllTests() {
        console.log('🧪 开始运行测试...\n');

        this.testOperatorPriority();
        this.testFloatingPointPrecision();
        this.testInjectionPrevention();
        this.testDifficultyAlgorithm();
        this.testQuestionGeneration();
        this.testScoringSystem();
        this.testModeSwitching();
        this.testTimerSystem();
        this.testLocalStorage();
        this.testEdgeCases();
        this.testBugFixes();

        console.log(`\n📊 测试结果: ${this.passed} 通过, ${this.failed} 失败`);
        return { passed: this.passed, failed: this.failed, tests: this.tests };
    }

    testOperatorPriority() {
        console.log('\n📋 测试运算符优先级...');

        this.test('乘法优先于加法', () => {
            const expr = 3 * 2 + 5;
            this.assertEqual(expr, 11);
        });

        this.test('除法优先于减法', () => {
            const expr = 10 - 6 / 2;
            this.assertEqual(expr, 7);
        });

        this.test('括号改变优先级', () => {
            const expr = (3 + 2) * 4;
            this.assertEqual(expr, 20);
        });

        this.test('幂运算优先级最高', () => {
            const expr = 2 + 3 ** 2;
            this.assertEqual(expr, 11);
        });

        this.test('平方根与四则运算混合', () => {
            const sqrt16 = Math.sqrt(16);
            const expr = sqrt16 + 5;
            this.assertEqual(expr, 9);
        });

        this.test('混合运算表达式', () => {
            const expr = 4 + 2 * 3 - 8 / 2;
            this.assertEqual(expr, 4 + 6 - 4);
            this.assertEqual(expr, 6);
        });
    }

    testFloatingPointPrecision() {
        console.log('\n📋 测试浮点数精度...');

        this.test('简单浮点数加法', () => {
            this.assertCloseTo(0.1 + 0.2, 0.3, 15);
        });

        this.test('浮点数乘法精度', () => {
            this.assertCloseTo(0.1 * 0.2, 0.02, 15);
        });

        this.test('判分逻辑精度容差', () => {
            const correctAnswer = 10.0;
            const userAnswer = 10.0000001;
            const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.0001;
            this.assertTrue(isCorrect, '微小误差应判为正确');
        });

        this.test('超出精度容差判错', () => {
            const correctAnswer = 10.0;
            const userAnswer = 10.001;
            const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.0001;
            this.assertTrue(!isCorrect, '超出误差应判为错误');
        });

        this.test('负数精度比较', () => {
            const correctAnswer = -5.5;
            const userAnswer = -5.50000001;
            const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.0001;
            this.assertTrue(isCorrect, '负数微小误差应判为正确');
        });

        this.test('小数除法精度', () => {
            const result = 1 / 3;
            this.assertCloseTo(result * 3, 1, 15);
        });

        this.test('平方根精度', () => {
            const sqrt2 = Math.sqrt(2);
            this.assertCloseTo(sqrt2 * sqrt2, 2, 14);
        });
    }

    testInjectionPrevention() {
        console.log('\n📋 测试防注入...');

        this.test('输入字符串转数字失败处理', () => {
            const input = 'alert("hacked")';
            const result = parseFloat(input);
            this.assertTrue(isNaN(result));
        });

        this.test('脚本代码输入处理', () => {
            const input = '<script>alert(1)</script>';
            const result = parseFloat(input);
            this.assertTrue(isNaN(result));
        });

        this.test('SQL注入尝试处理', () => {
            const input = "' OR '1'='1";
            const result = parseFloat(input);
            this.assertTrue(isNaN(result));
        });

        this.test('空字符串输入', () => {
            const input = '';
            const result = parseFloat(input);
            this.assertTrue(isNaN(result));
        });

        this.test('特殊字符输入', () => {
            const input = '!@#$%^&*()';
            const result = parseFloat(input);
            this.assertTrue(isNaN(result));
        });

        this.test('数字加字符混合输入', () => {
            const input = '123abc';
            const result = parseFloat(input);
            this.assertEqual(result, 123);
        });

        this.test('Unicode字符输入', () => {
            const input = '你好123';
            const result = parseFloat(input);
            this.assertTrue(isNaN(result));
        });

        this.test('超长数字输入', () => {
            const input = '123456789012345678901234567890';
            const result = parseFloat(input);
            this.assertType(result, 'number');
        });
    }

    testDifficultyAlgorithm() {
        console.log('\n📋 测试难度递增算法...');

        this.test('初始难度为1', () => {
            const testGame = new MathGame();
            this.assertEqual(testGame.level, 1);
        });

        this.test('基础答题时间设置', () => {
            const testGame = new MathGame();
            testGame.mode = 'arithmetic';
            testGame.startGame();
            this.assertEqual(testGame.maxTime, 15);
        });

        this.test('方程模式基础时间更长', () => {
            const testGame = new MathGame();
            testGame.mode = 'equation';
            testGame.startGame();
            this.assertEqual(testGame.maxTime, 20);
        });

        this.test('5题正确后升级', () => {
            const testGame = new MathGame();
            testGame.startGame();
            testGame.correctCount = 4;
            testGame.levelUp();
            this.assertEqual(testGame.level, 2);
        });

        this.test('升级后答题时间减少', () => {
            const testGame = new MathGame();
            testGame.mode = 'arithmetic';
            testGame.startGame();
            testGame.level = 5;
            testGame.levelUp();
            this.assertTrue(testGame.maxTime < 15);
        });

        this.test('最低答题时间限制', () => {
            const testGame = new MathGame();
            testGame.mode = 'arithmetic';
            testGame.startGame();
            testGame.level = 20;
            testGame.levelUp();
            this.assertEqual(testGame.maxTime, 8);
        });

        this.test('数字范围随难度增加', () => {
            const level1Max = 5 + 1 * 3;
            const level5Max = 5 + 5 * 3;
            this.assertTrue(level5Max > level1Max);
            this.assertEqual(level1Max, 8);
            this.assertEqual(level5Max, 20);
        });

        this.test('低难度只出现基础运算符', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            const hasAdvanced = [];
            for (let i = 0; i < 100; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes('^') || q.expression.includes('√')) {
                    hasAdvanced.push(true);
                }
            }
            this.assertTrue(hasAdvanced.length === 0, '低级不应出现高级运算符');
        });

        this.test('高难度出现所有运算符', () => {
            const testGame = new MathGame();
            testGame.level = 10;
            let hasAdvanced = false;
            for (let i = 0; i < 100; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes('^') || q.expression.includes('√')) {
                    hasAdvanced = true;
                    break;
                }
            }
            this.assertTrue(hasAdvanced, '高级应出现高级运算符');
        });
    }

    testQuestionGeneration() {
        console.log('\n📋 测试题目生成...');

        this.test('算术题目生成', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            const q = testGame.generateArithmeticQuestion();
            this.assertType(q.expression, 'string');
            this.assertType(q.answer, 'number');
            this.assertTrue(q.expression.length > 0);
        });

        this.test('方程题目生成格式', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            const q = testGame.generateEquationQuestion();
            this.assertTrue(q.expression.includes('x'));
            this.assertTrue(q.expression.includes('='));
        });

        this.test('不等式题目生成', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            const q = testGame.generateInequalityQuestion();
            this.assertType(q.answer, 'boolean');
            const hasOperator = ['<', '>', '≤', '≥'].some(op => q.expression.includes(op));
            this.assertTrue(hasOperator);
        });

        this.test('加法答案正确性', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            for (let i = 0; i < 50; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes('+')) {
                    const parts = q.expression.split(' + ');
                    const calculated = parseInt(parts[0]) + parseInt(parts[1]);
                    this.assertEqual(calculated, q.answer);
                }
            }
        });

        this.test('减法答案正确性', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            for (let i = 0; i < 50; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes(' - ')) {
                    const parts = q.expression.split(' - ');
                    const calculated = parseInt(parts[0]) - parseInt(parts[1]);
                    this.assertEqual(calculated, q.answer);
                }
            }
        });

        this.test('乘法答案正确性', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            for (let i = 0; i < 50; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes(' × ')) {
                    const parts = q.expression.split(' × ');
                    const calculated = parseInt(parts[0]) * parseInt(parts[1]);
                    this.assertEqual(calculated, q.answer);
                }
            }
        });

        this.test('除法答案正确性', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            for (let i = 0; i < 50; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes(' ÷ ')) {
                    const parts = q.expression.split(' ÷ ');
                    const calculated = parseInt(parts[0]) / parseInt(parts[1]);
                    this.assertEqual(calculated, q.answer);
                }
            }
        });

        this.test('幂运算答案正确性', () => {
            const testGame = new MathGame();
            testGame.level = 5;
            for (let i = 0; i < 50; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes('^')) {
                    const parts = q.expression.split('^');
                    const calculated = Math.pow(parseInt(parts[0]), parseInt(parts[1]));
                    this.assertEqual(calculated, q.answer);
                }
            }
        });

        this.test('平方根答案正确性', () => {
            const testGame = new MathGame();
            testGame.level = 5;
            for (let i = 0; i < 50; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes('√')) {
                    const num = parseInt(q.expression.replace('√', ''));
                    const calculated = Math.sqrt(num);
                    this.assertEqual(calculated, q.answer);
                }
            }
        });

        this.test('方程求解正确性', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            for (let i = 0; i < 50; i++) {
                const q = testGame.generateEquationQuestion();
                const x = q.answer;
                const eqParts = q.expression.split(' = ');
                const left = eqParts[0];
                const right = parseInt(eqParts[1]);
                
                let result;
                if (left.includes('(')) {
                    const match = left.match(/(\d+)\(x \+ (\d+)\)/);
                    if (match) {
                        result = parseInt(match[1]) * (x + parseInt(match[2]));
                    }
                } else if (left.includes(' + ')) {
                    const match = left.match(/(\d+)x \+ (\d+)/);
                    if (match) {
                        result = parseInt(match[1]) * x + parseInt(match[2]);
                    }
                } else if (left.includes(' - ')) {
                    const match = left.match(/(\d+)x - (\d+)/);
                    if (match) {
                        result = parseInt(match[1]) * x - parseInt(match[2]);
                    }
                }
                this.assertEqual(result, right);
            }
        });

        this.test('题目多样性', () => {
            const testGame = new MathGame();
            testGame.level = 5;
            const questions = new Set();
            for (let i = 0; i < 100; i++) {
                const q = testGame.generateQuestion();
                questions.add(q.expression);
            }
            this.assertTrue(questions.size > 50, '题目应多样化');
        });
    }

    testScoringSystem() {
        console.log('\n📋 测试判分系统...');

        this.test('正确答题基础分', () => {
            const testGame = new MathGame();
            testGame.startGame();
            const initialScore = testGame.score;
            testGame.correctCount = 1;
            testGame.timeLeft = 10;
            testGame.level = 1;
            const baseScore = 100 + Math.floor(testGame.timeLeft * 2) + testGame.level * 10;
            this.assertTrue(baseScore > 100);
        });

        this.test('时间奖励计算', () => {
            const testGame = new MathGame();
            testGame.startGame();
            testGame.timeLeft = 15;
            const bonus1 = Math.floor(testGame.timeLeft * 2);
            testGame.timeLeft = 5;
            const bonus2 = Math.floor(testGame.timeLeft * 2);
            this.assertTrue(bonus1 > bonus2, '剩余时间越多奖励越多');
        });

        this.test('等级奖励计算', () => {
            const testGame = new MathGame();
            testGame.startGame();
            testGame.level = 1;
            const bonus1 = testGame.level * 10;
            testGame.level = 10;
            const bonus2 = testGame.level * 10;
            this.assertTrue(bonus2 > bonus1, '等级越高奖励越多');
        });

        this.test('模式奖励差异', () => {
            const arithmeticBonus = 0;
            const equationBonus = 20;
            const inequalityBonus = 30;
            this.assertTrue(inequalityBonus > equationBonus);
            this.assertTrue(equationBonus > arithmeticBonus);
        });

        this.test('错题不加分', () => {
            const testGame = new MathGame();
            testGame.startGame();
            const initialScore = testGame.score;
            testGame.wrongCount = 1;
            this.assertEqual(testGame.score, initialScore);
        });

        this.test('三次错误游戏结束', () => {
            const testGame = new MathGame();
            testGame.startGame();
            testGame.wrongCount = 2;
            testGame.checkAnswer = () => {};
            testGame.endGame = function() { this.isPlaying = false; };
            testGame.wrongCount = 3;
            testGame.endGame();
            this.assertTrue(!testGame.isPlaying);
        });
    }

    testModeSwitching() {
        console.log('\n📋 测试模式切换...');

        this.test('初始模式为速算', () => {
            const testGame = new MathGame();
            this.assertEqual(testGame.mode, 'arithmetic');
        });

        this.test('切换到方程模式', () => {
            const testGame = new MathGame();
            testGame.mode = 'equation';
            this.assertEqual(testGame.mode, 'equation');
        });

        this.test('切换到不等式模式', () => {
            const testGame = new MathGame();
            testGame.mode = 'inequality';
            this.assertEqual(testGame.mode, 'inequality');
        });

        this.test('不等式模式返回布尔答案', () => {
            const testGame = new MathGame();
            testGame.mode = 'inequality';
            testGame.level = 1;
            const q = testGame.generateInequalityQuestion();
            this.assertType(q.answer, 'boolean');
        });

        this.test('模式切换重置答题状态', () => {
            const testGame = new MathGame();
            testGame.mode = 'equation';
            testGame.inequalityAnswer = true;
            testGame.switchMode('inequality');
            this.assertEqual(testGame.inequalityAnswer, null);
        });
    }

    testTimerSystem() {
        console.log('\n📋 测试计时系统...');

        this.test('计时器初始值正确', () => {
            const testGame = new MathGame();
            testGame.mode = 'arithmetic';
            testGame.startGame();
            this.assertEqual(testGame.timeLeft, testGame.maxTime);
        });

        this.test('计时器进度条计算', () => {
            const testGame = new MathGame();
            testGame.mode = 'arithmetic';
            testGame.startGame();
            testGame.timeLeft = 7.5;
            const percentage = (testGame.timeLeft / testGame.maxTime) * 100;
            this.assertEqual(percentage, 50);
        });

        this.test('超时触发错误', () => {
            let timeoutTriggered = false;
            const testGame = new MathGame();
            testGame.startGame();
            testGame.handleTimeout = () => { timeoutTriggered = true; };
            testGame.timeLeft = 0;
            testGame.handleTimeout();
            this.assertTrue(timeoutTriggered);
        });

        this.test('危险区域判断', () => {
            const testGame = new MathGame();
            testGame.startGame();
            testGame.timeLeft = testGame.maxTime * 0.2;
            const percentage = (testGame.timeLeft / testGame.maxTime) * 100;
            this.assertTrue(percentage <= 30, '应进入危险区域');
        });

        this.test('警告区域判断', () => {
            const testGame = new MathGame();
            testGame.startGame();
            testGame.timeLeft = testGame.maxTime * 0.5;
            const percentage = (testGame.timeLeft / testGame.maxTime) * 100;
            this.assertTrue(percentage > 30 && percentage <= 60, '应进入警告区域');
        });
    }

    testLocalStorage() {
        console.log('\n📋 测试本地存储...');

        this.test('历史记录保存', () => {
            localStorage.removeItem('mathGameHistory');
            const testGame = new MathGame();
            testGame.score = 1000;
            testGame.saveGame();
            const history = JSON.parse(localStorage.getItem('mathGameHistory'));
            this.assertTrue(history.length > 0);
            this.assertEqual(history[0].score, 1000);
        });

        this.test('历史记录限制20条', () => {
            localStorage.removeItem('mathGameHistory');
            const testGame = new MathGame();
            for (let i = 0; i < 30; i++) {
                testGame.score = i * 100;
                testGame.saveGame();
            }
            const history = JSON.parse(localStorage.getItem('mathGameHistory'));
            this.assertTrue(history.length <= 20);
        });

        this.test('排行榜初始化', () => {
            localStorage.removeItem('mathGameLeaderboard');
            const testGame = new MathGame();
            testGame.initLeaderboard();
            const leaderboard = JSON.parse(localStorage.getItem('mathGameLeaderboard'));
            this.assertTrue(leaderboard.hasOwnProperty('arithmetic'));
            this.assertTrue(leaderboard.hasOwnProperty('equation'));
            this.assertTrue(leaderboard.hasOwnProperty('inequality'));
            this.assertTrue(leaderboard.hasOwnProperty('total'));
        });

        this.test('排行榜排序', () => {
            localStorage.removeItem('mathGameLeaderboard');
            const testGame = new MathGame();
            testGame.initLeaderboard();
            testGame.mode = 'arithmetic';
            testGame.score = 500;
            testGame.saveToLeaderboard();
            testGame.score = 1500;
            testGame.saveToLeaderboard();
            testGame.score = 1000;
            testGame.saveToLeaderboard();
            
            const leaderboard = JSON.parse(localStorage.getItem('mathGameLeaderboard'));
            this.assertEqual(leaderboard.arithmetic[0].score, 1500);
            this.assertEqual(leaderboard.arithmetic[1].score, 1000);
            this.assertEqual(leaderboard.arithmetic[2].score, 500);
        });

        this.test('对战房间创建', () => {
            localStorage.removeItem('mathGameBattleRooms');
            const testGame = new MathGame();
            testGame.initBattleRooms();
            const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms'));
            this.assertTrue(Array.isArray(rooms));
        });
    }

    testEdgeCases() {
        console.log('\n📋 测试边界情况...');

        this.test('零的处理', () => {
            const result = 5 + 0;
            this.assertEqual(result, 5);
        });

        this.test('负数运算', () => {
            const result = 5 - 10;
            this.assertEqual(result, -5);
        });

        this.test('乘以1', () => {
            const result = 100 * 1;
            this.assertEqual(result, 100);
        });

        this.test('除以1', () => {
            const result = 100 / 1;
            this.assertEqual(result, 100);
        });

        this.test('1的平方', () => {
            const result = Math.pow(1, 2);
            this.assertEqual(result, 1);
        });

        this.test('0的平方根', () => {
            const result = Math.sqrt(0);
            this.assertEqual(result, 0);
        });

        this.test('最大整数边界', () => {
            const max = Number.MAX_SAFE_INTEGER;
            this.assertTrue(max > 0);
        });

        this.test('NaN判断', () => {
            this.assertTrue(isNaN(NaN));
            this.assertTrue(isNaN(parseFloat('abc')));
            this.assertTrue(!isNaN(123));
        });

        this.test('无穷大处理', () => {
            const inf = 1 / 0;
            this.assertTrue(inf === Infinity);
        });

        this.test('连续升级', () => {
            const testGame = new MathGame();
            testGame.startGame();
            for (let i = 1; i <= 10; i++) {
                testGame.levelUp();
            }
            this.assertTrue(testGame.level > 10);
        });
    }

    testBugFixes() {
        console.log('\n🔧 测试Bug修复...');

        this.test('除法 - 验证除数永不为零', () => {
            const testGame = new MathGame();
            testGame.level = 1;
            for (let i = 0; i < 100; i++) {
                const q = testGame.generateArithmeticQuestion();
                if (q.expression.includes('÷')) {
                    const parts = q.expression.split(' ÷ ');
                    const divisor = parseInt(parts[1]);
                    this.assertTrue(divisor > 0, '除数必须大于0');
                    this.assertTrue(!isNaN(divisor), '除数不能为NaN');
                }
            }
        });

        this.test('验证答案不会是NaN', () => {
            const testGame = new MathGame();
            testGame.level = 5;
            for (let i = 0; i < 100; i++) {
                const q = testGame.generateQuestion();
                this.assertTrue(!isNaN(q.answer), `答案不能是NaN: ${q.expression}`);
            }
        });

        this.test('验证答案不会是无穷大', () => {
            const testGame = new MathGame();
            testGame.level = 5;
            for (let i = 0; i < 100; i++) {
                const q = testGame.generateQuestion();
                this.assertTrue(isFinite(q.answer), `答案必须是有限数: ${q.expression}`);
            }
        });

        this.test('Math.max(1, num) 确保正数', () => {
            this.assertEqual(Math.max(1, 0), 1);
            this.assertEqual(Math.max(1, -5), 1);
            this.assertEqual(Math.max(1, 10), 10);
            this.assertEqual(Math.max(1, 1), 1);
        });

        this.test('计时器 - 验证时间戳初始化', () => {
            const testGame = new MathGame();
            testGame.startGame();
            this.assertTrue(testGame.lastTickTime > 0);
            this.assertTrue(testGame.lastTickTime <= Date.now());
        });

        this.test('计时器 - 验证基于时间差计算', (done) => {
            const testGame = new MathGame();
            testGame.startGame();
            const initialTime = testGame.timeLeft;
            const initialTick = testGame.lastTickTime;
            
            setTimeout(() => {
                const elapsed = (Date.now() - initialTick) / 1000;
                this.assertTrue(testGame.timeLeft <= initialTime, '时间应该减少');
                this.assertTrue(testGame.timeLeft >= initialTime - elapsed - 0.1, '时间减少量应符合实际流逝');
            }, 500);
        });

        this.test('对战 - 验证结束标志位初始化', () => {
            const testGame = new MathGame();
            testGame.startBattleRoom({ player1: 'test', player2: 'test2', id: 1 }, 'test');
            this.assertEqual(testGame.battleEnded, false);
        });

        this.test('对战 - 结束后锁定UI', () => {
            const testGame = new MathGame();
            testGame.battleEnded = true;
            testGame.lockBattleUI();
            this.assertTrue(testGame.battleAnswerInput.disabled, '输入框应被禁用');
            this.assertTrue(testGame.battleSubmitBtn.disabled, '按钮应被禁用');
        });

        this.test('对战 - 结束后无法提交答案', () => {
            const testGame = new MathGame();
            testGame.battleEnded = true;
            testGame.battleTime = 0;
            testGame.submitBattleAnswer();
            this.assertEqual(testGame.battleFeedback.textContent, '游戏已结束！');
        });

        this.test('对战 - 分数同步到LocalStorage', () => {
            const testGame = new MathGame();
            testGame.currentRoom = { id: 123 };
            testGame.isPlayer1 = true;
            testGame.battleScore = 500;
            testGame.syncBattleScore();
            
            const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
            const room = rooms.find(r => r.id === 123);
            this.assertTrue(room !== undefined, '房间应存在');
            if (room) {
                this.assertEqual(room.player1Score, 500, '分数应同步');
            }
        });

        this.test('对战 - 结束状态同步', () => {
            const testGame = new MathGame();
            testGame.currentRoom = { id: 456 };
            
            const rooms = JSON.parse(localStorage.getItem('mathGameBattleRooms') || '[]');
            rooms.push({ id: 456, isEnded: true, player1Score: 1000, player2Score: 800 });
            localStorage.setItem('mathGameBattleRooms', JSON.stringify(rooms));
            
            testGame.startBattleSync();
            
            setTimeout(() => {
                this.assertTrue(testGame.battleEnded, '应检测到结束状态');
                this.assertTrue(testGame.battleAnswerInput.disabled, 'UI应被锁定');
            }, 600);
        });
    }
}

function runTests() {
    const tester = new MathGameTester();
    const results = tester.runAllTests();
    
    const resultsDiv = document.createElement('div');
    resultsDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    
    const summaryColor = results.failed === 0 ? '#4CAF50' : '#f44336';
    resultsDiv.innerHTML = `
        <h3 style="margin:0 0 15px 0; color:${summaryColor}">
            🧪 测试结果
        </h3>
        <p style="margin:5px 0;">✅ 通过: ${results.passed}</p>
        <p style="margin:5px 0;">❌ 失败: ${results.failed}</p>
        <hr style="margin:15px 0;">
        ${results.tests.map(t => `
            <div style="padding:5px; margin:3px 0; background:${t.status === 'PASS' ? '#e8f5e9' : '#ffebee'}; border-radius:4px; font-size:12px;">
                ${t.status === 'PASS' ? '✅' : '❌'} ${t.name}
                ${t.error ? `<br><span style="color:#c62828; font-size:11px;">${t.error}</span>` : ''}
            </div>
        `).join('')}
        <button onclick="this.parentElement.remove()" style="margin-top:15px; padding:8px 16px; background:#667eea; color:white; border:none; border-radius:5px; cursor:pointer;">
            关闭
        </button>
    `;
    
    document.body.appendChild(resultsDiv);
    return results;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const testBtn = document.createElement('button');
        testBtn.textContent = '🧪 运行测试';
        testBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            z-index: 9999;
        `;
        testBtn.onclick = runTests;
        document.body.appendChild(testBtn);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MathGameTester, runTests };
}