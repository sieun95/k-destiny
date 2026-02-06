// 전역 사용자 데이터 저장소
let storedUserData = null;

// 다국어 UI 텍스트 상수
const UI_TEXT = {
    ko: {
        title: "운명록<span class='text-xl ml-2 font-light text-amber-500/80'>(運命錄)</span>",
        subtitle: "하늘의 이치를 기록하다",
        inputTitle: "정보를 입력해주세요",
        labelName: "NAME",
        placeholderName: "이름을 입력하세요",
        labelDate: "BIRTH DATE (SOLAR)",
        labelTime: "BIRTH TIME",
        timeAm: "오전",
        timePm: "오후",
        timeDesc: "* 모르면 비워두셔도 됩니다",
        labelGender: "GENDER",
        genderMale: "남성",
        genderFemale: "여성",
        btnSubmit: "운명 확인하기",
        loadingTitle: "천체의 흐름을 읽는 중...",
        loadingDesc: "잠시만 기다려주세요",
        resultHeader: "運命錄",
        resultHeaderSub: "Private Destiny Report",
        labelOun: "귀하의 명운(命運)",
        labelSaju: "사주(四柱) - 띠",
        labelStar: "천문(天文) - 별자리",
        labelCeleb: "운명의 단짝",
        descCeleb: "* 이름을 누르면 검색됩니다",
        quote: "\"운명은 정해진 것이 아니라, <br>스스로 개척해 나가는 것입니다.\"",
        btnReset: "다시 기록하기"
    },
    en: {
        // 영어 타이틀 길이 조절 및 반응형 텍스트 크기 적용
        title: "<span class='text-3xl md:text-4xl tracking-wider'>Book of Destiny</span>",
        subtitle: "Recording the Laws of the Heavens",
        inputTitle: "Enter Your Information",
        labelName: "NAME",
        placeholderName: "Enter your name",
        labelDate: "BIRTH DATE (SOLAR)",
        labelTime: "BIRTH TIME",
        timeAm: "AM",
        timePm: "PM",
        timeDesc: "* Optional if unknown",
        labelGender: "GENDER",
        genderMale: "Male",
        genderFemale: "Female",
        btnSubmit: "Reveal Destiny",
        loadingTitle: "Reading Celestial Flows...",
        loadingDesc: "Please wait a moment",
        resultHeader: "Destiny",
        resultHeaderSub: "Private Destiny Report",
        labelOun: "Your Destiny",
        labelSaju: "Four Pillars - Zodiac",
        labelStar: "Astronomy - Constellation",
        labelCeleb: "Destiny Connection",
        descCeleb: "* Click name to search",
        quote: "\"Destiny is not set in stone, <br>but carved by your own hands.\"",
        btnReset: "Record Again",
        btnShare: "Share Result",
        shareSuccess: "Destiny copied to clipboard!",
        shareFail: "Failed to share.",
        shareTitle: "[Book of Destiny]",
        shareText: "Check out my destiny report!",
        luckyColor: "LUCKY COLOR",
        luckyNumber: "LUCKY NUMBER"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("destiny-form");
    const inputSection = document.getElementById("input-section");
    const resultSection = document.getElementById("result-section");
    const btnReset = document.getElementById("btn-reset");
    const btnShare = document.getElementById("btn-share"); // NEW
    const langToggle = document.getElementById("lang-toggle");
    
    // 현재 언어 상태 (기본: ko)
    let currentLang = "ko"; 

    // 초기 UI 언어 설정
    updateLanguage(currentLang);

    // 언어 변경 버튼 이벤트
    langToggle.addEventListener("click", () => {
        currentLang = currentLang === "ko" ? "en" : "ko";
        updateLanguage(currentLang);
        langToggle.innerHTML = currentLang === "ko" 
            ? 'KR / <span class="text-amber-400 font-bold">EN</span>' 
            : '<span class="text-amber-400 font-bold">KR</span> / EN';
    });
    
    // 시간/분 입력 제한
    const hourInput = document.getElementById("time-hour");
    const minuteInput = document.getElementById("time-minute");
  
    hourInput.addEventListener("input", function() {
      if (this.value.length > 2) this.value = this.value.slice(0, 2);
      if (parseInt(this.value) > 12) this.value = "12";
    });
  
    minuteInput.addEventListener("input", function() {
        if (this.value.length > 2) this.value = this.value.slice(0, 2);
        if (parseInt(this.value) > 59) this.value = "59";
    });
  
    // 폼 제출 이벤트
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const birthdate = document.getElementById("birthdate").value;
  
      if (!birthdate) return alert(currentLang === 'ko' ? "생년월일을 입력해주세요." : "Please enter your birth date.");

      // 데이터 저장
      storedUserData = { username, birthdate };

      // 로딩 화면 표시
      inputSection.classList.add("hidden");
      const loadingSection = document.getElementById("loading-section");
      loadingSection.classList.remove("hidden");
      loadingSection.classList.add("flex");
      
      window.scrollTo(0, 0);
  
      // 3초 후 결과 표시 (광고 노출 시간 확보)
      setTimeout(() => {
          loadingSection.classList.add("hidden");
          resultSection.classList.remove("hidden");
          
          updateResultUI(username, birthdate, currentLang);
          
          window.scrollTo(0, 0);
      }, 3000); 
    });

    btnReset.addEventListener("click", () => {
      resultSection.classList.add("hidden");
      inputSection.classList.remove("hidden");
      window.scrollTo(0, 0);
      form.reset();
    });

    // Share Button Event
    if (btnShare) {
        btnShare.addEventListener("click", () => handleShare(currentLang));
    }
});
  
function updateLanguage(lang) {
    const t = UI_TEXT[lang];
    
    // Header
    document.querySelector("header h1").innerHTML = t.title;
    document.querySelector("header p").textContent = t.subtitle;
    
    // Input Form
    const usernameInput = document.getElementById("username");
    if(usernameInput) usernameInput.placeholder = t.placeholderName;
    
    const labels = document.querySelectorAll("#input-section label.block"); 
    if(labels.length >= 4) {
        labels[0].textContent = t.labelName;
        labels[1].textContent = t.labelDate;
        labels[2].textContent = t.labelTime;
        labels[3].textContent = t.labelGender;
    }
    
    // Time options
    const timeOptions = document.querySelectorAll("#time-ampm option");
    if(timeOptions.length >= 2) {
        timeOptions[0].textContent = t.timeAm;
        timeOptions[1].textContent = t.timePm;
    }
    document.querySelector("#input-section p.text-gray-500").textContent = t.timeDesc;
    
    // Gender options
    const genderLabels = document.querySelectorAll("#input-section .group span"); 
    if(genderLabels.length >= 2) {
       genderLabels[0].textContent = t.genderMale;
       genderLabels[1].textContent = t.genderFemale;
    }

    // Submit Button
    document.querySelector("button[type='submit']").textContent = t.btnSubmit;

    // Loading
    document.querySelector("#loading-section h3").textContent = t.loadingTitle;
    document.querySelector("#loading-section p").textContent = t.loadingDesc;

    // Result Header
    document.querySelector("#result-section h2.font-serif").textContent = t.resultHeader;
    document.querySelector("#result-section p.tracking-\\[0\\.5em\\]").textContent = t.resultHeaderSub;
    
    // Result Labels
    document.querySelector("#result-section .text-center > p.text-sm").textContent = t.labelOun;
    
    // Lucky Labels
    const luckyLabels = document.querySelectorAll(".border-black\\/10").parentElement?.querySelectorAll("p.text-\\[10px\\]"); 
    // Easier selection via text content update if structure is complex, but let's query carefully
    // Using simple query based on index in lucky container
    const luckyContainer = document.querySelector("#result-section .bg-\\[\\#fffcf5\\]\\/50");
    if (luckyContainer) {
        const pTags = luckyContainer.querySelectorAll("p:first-child"); // select first p in each flex col
        if (pTags.length >= 2) {
            pTags[0].textContent = lang === 'ko' ? "오늘의 행운 컬러" : "LUCKY COLOR";
            pTags[1].textContent = lang === 'ko' ? "오늘의 행운 숫자" : "LUCKY NUMBER";
        }
    }

    // Saju/Star Labels
    const sajuLabel = document.querySelector("#result-section div.flex-col > div:nth-child(2) span.absolute"); // index shifted due to lucky section
    if(sajuLabel) sajuLabel.textContent = t.labelSaju;

    const starLabel = document.querySelector("#result-section div.flex-col > div:nth-child(4) span.absolute"); // 1(lucky) + 2(saju) + 3(ad) + 4(star) ? No, depends on structure
    // Let's re-select by class since unique
    const sectionLabels = document.querySelectorAll(".bg-\\[\\#f0e6d2\\]");
    if (sectionLabels.length >= 2) {
        sectionLabels[0].textContent = t.labelSaju;
        sectionLabels[1].textContent = t.labelStar;
    }

    // Celebrity Labels
    const labelCeleb = document.getElementById("label-celeb");
    if(labelCeleb) labelCeleb.textContent = t.labelCeleb;
    const descCeleb = document.getElementById("desc-celeb");
    if(descCeleb) descCeleb.textContent = t.descCeleb;
    
    // Quote & Buttons
    document.querySelector("#result-section .text-center.mt-6 p").innerHTML = t.quote;
    document.getElementById("btn-reset").textContent = t.btnReset;
    const btnShareLabel = document.querySelector("#label-share");
    if(btnShareLabel) btnShareLabel.textContent = lang === 'ko' ? "운명 공유하기" : "Share Result";

    // 만약 이미 결과가 나와있다면 내용도 언어에 맞게 업데이트
    if (storedUserData) {
        updateResultUI(storedUserData.username, storedUserData.birthdate, lang);
    }
}

function getConstellation(constellations, month, day) {
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
    let index = month - 1;
    if (day < dates[month - 1]) {
        index = index - 1;
        if (index < 0) index = 11; 
    }
    return constellations[index];
}

// 행운 데이터 생성 (일일 고정 랜덤)
function generateLuckyData(username, birthdateStr, lang) {
    const today = new Date().toISOString().split('T')[0];
    const seed = username + birthdateStr + today;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0; 
    }
    const rand = Math.abs(hash);

    const colors = [
        { name_ko: '청색', name_en: 'Blue', code: '#3b82f6' },
        { name_ko: '적색', name_en: 'Red', code: '#ef4444' },
        { name_ko: '황색', name_en: 'Yellow', code: '#eab308' },
        { name_ko: '백색', name_en: 'White', code: '#f3f4f6' },
        { name_ko: '흑색', name_en: 'Black', code: '#1f2937' },
        { name_ko: '자색', name_en: 'Purple', code: '#a855f7' },
        { name_ko: '녹색', name_en: 'Green', code: '#22c55e' },
    ];
    
    const luckyColor = colors[rand % colors.length];
    const luckyNumber = (rand % 99) + 1;

    return { luckyColor, luckyNumber };
}

// 결과 업데이트 함수
function updateResultUI(username, birthdate, lang) {
    const fortuneData = lang === "ko" ? window.FORTUNE_DATA : window.FORTUNE_DATA_EN;
    if (!fortuneData) return;

    const dateObj = new Date(birthdate);
    const year = dateObj.getFullYear();
    const month = dateObj.getDate() ? dateObj.getMonth() + 1 : 1; // getMonth is 0-indexed
    const day = dateObj.getDate();

    // 1. 띠 & 간지 계산
    const stems = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
    const branches = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
    
    const stemKey = stems[year % 10];
    const branchKey = branches[year % 12];
    
    const stemData = fortuneData.heavenlyStems[stemKey];
    const branchData = fortuneData.earthlyBranches[branchKey];

    // 간지 문자열
    let ganjiChar, animalChar;
    if (lang === 'ko') {
        ganjiChar = `${stemKey}${branchKey}`;
        animalChar = branchData.animal;
    } else {
        ganjiChar = year; 
        animalChar = branchData.animal;
    }

    // 2. 별자리 계산
    const constellation = getConstellation(fortuneData.constellations, month, day);

    // 3. 행운 데이터
    const { luckyColor, luckyNumber } = generateLuckyData(username, birthdate, lang);

    // UI 텍스트 반영
    if (lang === 'ko') {
        document.getElementById("result-name").textContent = `${username} 님`;
        document.getElementById("result-ganji").textContent = `${ganjiChar}년 (${animalChar}띠)`;
    } else {
        document.getElementById("result-name").textContent = `Dear ${username}`;
        document.getElementById("result-ganji").textContent = `Year of the ${animalChar}`;
    }

    // Lucky UI
    const colorEl = document.getElementById("lucky-color");
    const colorNameEl = document.getElementById("lucky-color-name");
    const numEl = document.getElementById("lucky-number");

    if (colorEl) colorEl.style.backgroundColor = luckyColor.code;
    if (colorNameEl) colorNameEl.textContent = lang === 'ko' ? luckyColor.name_ko : luckyColor.name_en;
    if (numEl) numEl.textContent = luckyNumber;

    const sajuDesc = `
        <strong class="text-[#8b5a2b] font-bold">"${stemData.keyword}"</strong><br>
        ${lang === 'ko' ? '하늘의 기운' : 'Heavenly Energy'}: <span class="font-bold text-gray-800">${stemData.element}</span><br>
        <span class="text-xs text-gray-500 block mt-1">${branchData.trait}</span>
        <span class="text-gray-500 text-xs mt-2 block italic">(${stemData.desc})</span>
    `;
    document.getElementById("result-saju-desc").innerHTML = sajuDesc;

    document.getElementById("result-constellation").textContent = constellation.name;
    document.getElementById("result-star-desc").innerHTML = constellation.desc;

    // 연예인 다시 그리기
    renderCelebrities(branchKey, lang);
}

// 공유 기능
async function handleShare(lang) {
    if (!storedUserData) return;
    
    // 현재 결과 데이터 재확인
    const fortuneData = lang === "ko" ? window.FORTUNE_DATA : window.FORTUNE_DATA_EN;
    const dateObj = new Date(storedUserData.birthdate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    
    // Simple recalculation for share text
    const stems = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
    const branches = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
    const branchKey = branches[year % 12];
    const animal = fortuneData.earthlyBranches[branchKey].animal;
    const star = getConstellation(fortuneData.constellations, month, day).name;

    const shareTitle = lang === 'ko' ? "운명록 (運命錄)" : "Book of Destiny";
    const shareText = lang === 'ko' 
        ? `[운명록] ${storedUserData.username}님의 운명: ${animal}띠 & ${star}. 당신의 운명도 확인해보세요.`
        : `[K-Destiny] ${storedUserData.username}'s Destiny: ${animal} & ${star}. Check yours now!`;
    const url = window.location.href;

    if (navigator.share) {
        try {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: url,
            });
        } catch (error) {
            console.log('Share canceled', error);
        }
    } else {
        // Fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(`${shareText}\n${url}`);
            alert(lang === 'ko' ? "결과가 클립보드에 복사되었습니다." : "Result copied to clipboard!");
        } catch (err) {
            console.error('Clipboard failed', err);
            alert(lang === 'ko' ? "공유할 수 없습니다." : "Failed to copy.");
        }
    }
}

// Celebrity Rendering
function renderCelebrities(branchChar, lang) {
    const listContainer = document.getElementById("celebrity-list");
    if (!listContainer) return;
    listContainer.innerHTML = ""; // reset

    const dataset = lang === "ko" ? window.CELEBRITY_DATA : window.CELEBRITY_DATA_EN;
    
    if (!dataset || !dataset[branchChar]) {
        console.warn("No celebrity data found for:", branchChar);
        return;
    }

    // Shuffle and pick 4
    const celebs = [...dataset[branchChar]].sort(() => 0.5 - Math.random()).slice(0, 4);

    celebs.forEach(celeb => {
        const item = document.createElement("div");
        item.className = "bg-[#fffcf5] border border-[#b08d5b]/30 p-3 rounded cursor-pointer hover:bg-[#8b5a2b] hover:text-[#f0e6d2] transition-colors group text-center flex flex-col justify-center items-center h-20 shadow-sm";
        item.innerHTML = `
            <div class="font-bold text-sm group-hover:text-white leading-tight break-keep w-full whitespace-normal">${celeb.name}</div>
            <div class="text-[10px] text-gray-500 group-hover:text-[#f0e6d2]/80 mt-1 truncate w-full">${celeb.desc}</div>
        `;
        item.onclick = () => {
            const query = encodeURIComponent(celeb.name);
            window.open(`https://www.google.com/search?q=${query}&tbm=isch`, "_blank");
        };
        listContainer.appendChild(item);
    });
}
