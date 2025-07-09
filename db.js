const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const dbPath = path.join(dbDir, 'sqlite.db');

// 確保 db 目錄存在
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// 開啟資料庫
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('無法開啟資料庫:', err.message);
        process.exit(1);
    } else {
        console.log('成功開啟資料庫');
    }
});

// 建立 movie_quotes table（若不存在）
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS movie_quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT NOT NULL,
        movie_name TEXT NOT NULL,
        quote TEXT NOT NULL,
        votes INTEGER DEFAULT 0
    )`, (err) => {
        if (err) {
            console.error('建立 table 失敗:', err.message);
            process.exit(1);
        } else {
            console.log('確認 movie_quotes table 存在');
            insertQuotes();
        }
    });
});

// 插入資料
function insertQuotes() {
    const quotes = [
        ["廖旼謙", "花束般的戀愛", "我們一路走來的風景很美，就只差了一步"],
        ["李振維", "王牌冤家", "Blessed are the forgetful, for they get the better even of their blunders。"],
        ["陳俊諳", "鐵達尼號", "You jump ,I jump"],
        ["陶子中", "愛在午夜希臘時", "不要在愛情上浪費太多時間，友誼與工作會給你帶來更多快樂。"],
        ["廖卿秀", "喜劇之王", "我養你啊"],
        ["簡鍵帆", "大話西游", "曾經有一份真摯的愛情擺在我面前，我沒有去珍惜，等到失去了才後悔莫及，人世間最痛苦的事莫過於此。如果上天能給我一個再來一次的機會，我會對那個女孩說：我愛你。如果非要在這份愛上加上一個期限，我希望是一萬年。"],
        ["蕭方雯", "真愛挑日子", "無論明天發生什麼事，至少我們擁有當下。"],
        ["周彥廷", "殭屍先生", "人鬼殊途，人和鬼是不能在一起的．你和他在一起只會害了他"],
        ["游程鈞", "戀夏500日", "Some people are meant to fall in love with each other, but not meant to be together."],
        ["林政佑", "樂來樂愛你", "你為什麼把『浪漫』說得像是個骯髒的詞？"],
        ["謝依晴", "霍爾的移動城堡", "無論你變成什麼樣子，我都愛你。"],
        ["陳亭瑜", "After", "Whatever our souls are made of, his and mine are the same"],
        ["陳韋翰", "刻在你心底的名字", "你喜歡女生就可以,我喜歡男生就不行。你有多愛一點,我有少愛一點嗎?"],
        ["廖卿如", "新娘不是我", "如果你愛上某人你就說出來，你立刻說出來，大聲地說出來。不然你就會錯過時機了。"],
        ["周說", "蜘蛛人", "能力越大，責任越大！"],
        ["張郁眉", "鬼怪", "跟你在一起的時間全部都很耀眼。因為天氣好，因為天氣不好，因為天氣剛剛好，每一天，都是美好的。"]
    ];
    const stmt = db.prepare("INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)");
    quotes.forEach(q => {
        stmt.run(q[0], q[1], q[2]);
    });
    stmt.finalize((err) => {
        if (err) {
            console.error('插入資料失敗:', err.message);
        } else {
            console.log('資料已成功插入 movie_quotes');
            fetchQuotes();
        }
        db.close();
    });
}

// 驗證抓取資料
function fetchQuotes() {
    db.all("SELECT * FROM movie_quotes", (err, rows) => {
        if (err) {
            console.error('查詢資料失敗:', err.message);
        } else {
            console.log('movie_quotes 資料如下:');
            console.log(rows);
        }
    });
}

