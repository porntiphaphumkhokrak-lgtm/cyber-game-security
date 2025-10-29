const emailData = [
    // อีเมลจริง (Legit) - answer: 'legit'
    { sender: "ธนาคาร X", subject: "แจ้งเตือนการใช้งานบัญชีของคุณ", isPhishing: false, body: "เรียนลูกค้า, เราตรวจพบการเข้าสู่ระบบที่ผิดปกติเมื่อเวลา 10:00 น. หากคุณไม่ได้ดำเนินการนี้ โปรดเข้าสู่ระบบอย่างเป็นทางการที่ **https://bankx.com/login** เพื่อตรวจสอบ" },
    { sender: "IT Support (internal)", subject: "การอัพเดตซอฟต์แวร์ประจำเดือน", isPhishing: false, body: "เรียนพนักงาน, โปรดรันสคริปต์อัพเดตระบบรักษาความปลอดภัยจากเครือข่ายภายในภายในวันนี้ เพื่อให้ระบบของคุณปลอดภัย" },
    { sender: "HR Department", subject: "เอกสารสรุปสิทธิประโยชน์ปี 2568", isPhishing: false, body: "สวัสดีค่ะ, คุณสามารถดาวน์โหลดเอกสารสรุปสิทธิประโยชน์ได้ที่ลิงก์ใน SharePoint (ภายในองค์กร) **sharepoint.company.com/benefits** ขอบคุณค่ะ" },
    
    // อีเมลปลอม (Phishing) - answer: 'phish'
    { sender: "PayPal Service <paypal-verify@service.co.biz>", subject: "บัญชีของคุณถูกระงับ! [URGENT]", isPhishing: true, body: "เรียนลูกค้า, บัญชี PayPal ของคุณจะถูกยกเลิกภายใน 24 ชั่วโมงหากไม่ยืนยันข้อมูล <span class='suspicious-link'>คลิกที่นี่เพื่อยืนยันทันที</span> (ลิงก์: http://paypa1-security.com/update)" },
    { sender: "Microsoft Security", subject: "คุณได้รับรางวัลใหญ่จากการเป็นผู้ใช้", isPhishing: true, body: "ยินดีด้วย! คุณได้รับรางวัลเป็น iPhone 16 Pro Max <span class='suspicious-link'>กรุณากรอกข้อมูลส่วนตัวเพื่อรับรางวัล</span> (ลิงก์: http://m1crosoft-winner.net/prize-claim)" },
    { sender: "Netflix Support", subject: "การชำระเงินของคุณถูกปฏิเสธ", isPhishing: true, body: "โปรดอัปเดตข้อมูลบัตรเครดิตของคุณทันทีเพื่อหลีกเลี่ยงการระงับบริการ <span class='suspicious-link'>อัพเดตข้อมูลตอนนี้</span> (ลิงก์: http://netfIix-payment.com)" },
    { sender: "Apple Inc.", subject: "มีคนพยายามรีเซ็ตรหัสผ่าน Apple ID ของคุณ", isPhishing: true, body: "หากไม่ใช่คุณ กรุณาเข้าสู่ระบบผ่านลิงก์ด้านล่างนี้เพื่อยกเลิกการดำเนินการ: <span class='suspicious-link'>ยกเลิกการรีเซ็ต</span> (ลิงก์: http://apple-id-security.org/cancel)" },
];

let currentEmails = [];
let score = 0;
let timeLeft = 60;
let timerInterval;
let emailHandled = 0;
const totalEmailsToHandle = 5;

// Elements
const emailListEl = document.getElementById('email-list');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const remainingEmailsEl = document.getElementById('remaining-emails');
const modal = document.getElementById('email-detail-modal');
const closeButton = document.querySelector('.close-button');
const btnLegit = document.getElementById('btn-legit');
const btnPhish = document.getElementById('btn-phish');
let currentEmail = null; // เก็บอีเมลที่กำลังแสดงใน Modal

// ฟังก์ชันเริ่มเกม
function startGame() {
    score = 0;
    timeLeft = 60;
    emailHandled = 0;
    scoreEl.textContent = score;
    remainingEmailsEl.textContent = totalEmailsToHandle;
    
    // สุ่มอีเมลมา 5 ฉบับ
    currentEmails = shuffleArray(emailData).slice(0, totalEmailsToHandle);
    
    renderEmailList();
    startTimer();
}

// ฟังก์ชันสลับตำแหน่ง Array (Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ฟังก์ชันแสดงรายการอีเมล
function renderEmailList() {
    emailListEl.innerHTML = '';
    currentEmails.forEach((email, index) => {
        if (!email.isHandled) {
            const emailDiv = document.createElement('div');
            emailDiv.classList.add('email-item');
            emailDiv.dataset.index = index;
            emailDiv.innerHTML = `<span class="email-sender">${email.sender}</span> - <span class="email-subject">${email.subject}</span>`;
            emailDiv.addEventListener('click', () => openEmailDetail(email));
            emailListEl.appendChild(emailDiv);
        }
    });
    // ถ้าอีเมลหมดแล้วแต่เวลายังไม่หมด ให้จบเกม
    if (emailHandled >= totalEmailsToHandle) {
        endGame("win");
    }
}

// ฟังก์ชันเปิด Modal แสดงเนื้อหาอีเมล
function openEmailDetail(email) {
    currentEmail = email;
    document.getElementById('detail-subject').textContent = `หัวข้อ: ${email.subject}`;
    document.getElementById('detail-sender').textContent = email.sender;
    document.getElementById('detail-body').innerHTML = email.body;
    modal.style.display = 'block';
}

// ฟังก์ชันปิด Modal
function closeEmailDetail() {
    modal.style.display = 'none';
    currentEmail = null;
}

// ฟังก์ชันตรวจสอบคำตอบ
function checkAnswer(isPlayerPhishChoice) {
    if (!currentEmail) return;

    // คำตอบที่ถูกต้อง
    const isCorrect = (isPlayerPhishChoice && currentEmail.isPhishing) || 
                      (!isPlayerPhishChoice && !currentEmail.isPhishing);

    if (isCorrect) {
        score += 10;
        alert("✅ ถูกต้อง! การตัดสินใจของคุณถูกต้อง");
    } else {
        score -= 5;
        alert(`❌ ผิด! อีเมลนี้${currentEmail.isPhishing ? 'เป็น Phishing' : 'เป็นอีเมลจริง'} - คะแนนลด`);
    }

    scoreEl.textContent = score;
    
    // ทำเครื่องหมายว่าอีเมลนี้ถูกจัดการแล้ว และอัพเดตสถานะ
    currentEmail.isHandled = true;
    emailHandled++;
    remainingEmailsEl.textContent = totalEmailsToHandle - emailHandled;

    closeEmailDetail();
    renderEmailList();
}

// Event Listeners สำหรับปุ่มใน Modal
btnLegit.addEventListener('click', () => checkAnswer(false));
btnPhish.addEventListener('click', () => checkAnswer(true));
closeButton.addEventListener('click', closeEmailDetail);

// ปิด Modal เมื่อคลิกนอก Modal
window.onclick = function(event) {
    if (event.target == modal) {
        closeEmailDetail();
    }
}

// ฟังก์ชันจับเวลา
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame("timeup");
        }
    }, 1000);
}

// ฟังก์ชันจบเกม
function endGame(reason) {
    clearInterval(timerInterval);
    emailListEl.innerHTML = '';
    
    let message = `เกมจบลงแล้ว! คุณได้คะแนนสุดท้าย: **${score}** คะแนน\n\n`;
    if (reason === "timeup") {
        message += "หมดเวลาแล้ว! คุณจัดการอีเมลไม่ทัน";
    } else if (reason === "win") {
        message += "ยินดีด้วย! คุณจัดการอีเมลทั้งหมดได้สำเร็จ";
    }
    
    alert(message);
    
    // รีเซ็ตเพื่อเริ่มเกมใหม่
    startGame();
}

// เริ่มเกมทันทีที่โหลดหน้าจอ
document.addEventListener('DOMContentLoaded', startGame);