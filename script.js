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
        btnReset: "다시 기록하기",
        faqTitle: "자주 묻는 질문 (FAQ)",
        faqQ1: "나의 사주와 어울리는 연예인은 누구인가요?",
        faqA1: "운명록(K-Destiny)에서는 입력하신 생년월일을 동양 명리학 기반으로 분석하여, 귀하의 기운과 가장 잘 어울리는 연예인(아이돌, 배우)을 찾아드립니다. 결과 페이지에서 '운명의 단짝'을 확인해보세요.",
        faqQ2: "무료로 띠별 운세를 보는 방법은?",
        faqA2: "별도의 회원가입이나 결제 없이, 이름과 생년월일만 입력하면 즉시 무료로 띠별 운세와 사주 분석 결과를 확인하실 수 있습니다. 친구들에게 결과를 공유해보세요.",
        faqQ3: "운명록은 어떤 원리인가요?",
        faqA3: "동양의 전통적인 60갑자 사주 명리학과 서양의 점성술(별자리) 데이터를 현대적으로 재해석하여 결합했습니다. 이를 통해 단순한 재미를 넘어, 나를 더 깊이 이해할 수 있는 통찰을 제공합니다."
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
        luckyColor: "LUCKY COLOR",
        luckyNumber: "LUCKY NUMBER",
        faqTitle: "Frequently Asked Questions (FAQ)",
        faqQ1: "Which celebrity matches my destiny?",
        faqA1: "Based on Eastern Saju astrology and your birth date, K-Destiny analyzes your energy to find the perfect celebrity (idol, actor) match. Check your 'Destiny Connection' in the result.",
        faqQ2: "Is this zodiac reading free?",
        faqA2: "Yes! Simply enter your name and birth date to get your free Zodiac and Saju analysis instantly. No sign-up or payment required. Share the results with your friends!",
        faqQ3: "How does K-Destiny work?",
        faqA3: "We combine traditional Eastern 60-Gapja Saju astrology with Western horoscope data, reinterpreted for the modern age. It provides insights into your destiny beyond simple entertainment."
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("destiny-form");
    const inputSection = document.getElementById("input-section");
    const resultSection = document.getElementById("result-section");
    const btnReset = document.getElementById("btn-reset");
    const btnShare = document.getElementById("btn-share"); // NEW
    const langToggle = document.getElementById("lang-toggle");
    const faqSection = document.getElementById("faq-section"); // NEW
    
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
      faqSection.classList.add("hidden"); // Ensure hidden on loading
      const loadingSection = document.getElementById("loading-section");
      loadingSection.classList.remove("hidden");
      loadingSection.classList.add("flex");
      
      window.scrollTo(0, 0);
  
      // 3초 후 결과 표시 (광고 노출 시간 확보)
      setTimeout(() => {
          loadingSection.classList.add("hidden");
          resultSection.classList.remove("hidden");
          faqSection.classList.remove("hidden"); // Show FAQ
          
          updateResultUI(username, birthdate, currentLang);
          
          window.scrollTo(0, 0);
      }, 3000); 
    });

    btnReset.addEventListener("click", () => {
      resultSection.classList.add("hidden");
      faqSection.classList.add("hidden"); // Hide FAQ
      inputSection.classList.remove("hidden");
      window.scrollTo(0, 0);
      form.reset();
    });

    // Share Button Events
    const btnKakao = document.getElementById("btn-kakao");
    const btnTwitter = document.getElementById("btn-twitter");
    const btnFacebook = document.getElementById("btn-facebook");
    const btnLink = document.getElementById("btn-link");
    const btnLine = document.getElementById("btn-line");
    const btnTelegram = document.getElementById("btn-telegram");
    const btnInstagram = document.getElementById("btn-instagram");
    const btnThreads = document.getElementById("btn-threads");

    if (btnKakao) btnKakao.addEventListener("click", () => handleSNSShare('kakao', currentLang));
    if (btnTwitter) btnTwitter.addEventListener("click", () => handleSNSShare('twitter', currentLang));
    if (btnFacebook) btnFacebook.addEventListener("click", () => handleSNSShare('facebook', currentLang));
    if (btnLink) btnLink.addEventListener("click", () => handleSNSShare('link', currentLang));
    if (btnLine) btnLine.addEventListener("click", () => handleSNSShare('line', currentLang));
    if (btnTelegram) btnTelegram.addEventListener("click", () => handleSNSShare('telegram', currentLang));
    if (btnInstagram) btnInstagram.addEventListener("click", () => handleSNSShare('instagram', currentLang)); // Fallback to copy
    if (btnThreads) btnThreads.addEventListener("click", () => handleSNSShare('threads', currentLang));
});
  
function updateLanguage(lang) {
    const t = UI_TEXT[lang];
    
    // Header
    document.querySelector("header h1").innerHTML = t.title;
    document.querySelector("header p").textContent = t.subtitle;
    
    // Input Form
    const usernameInput = document.getElementById("username");
    if(usernameInput) usernameInput.placeholder = t.placeholderName;
    
    // Select labels by common class "text-amber-200" to capture Name, Date, Time (labels) and Gender (span)
    const labels = document.querySelectorAll("#input-section .block.text-amber-200"); 
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
    const luckyContainer = document.querySelector("#result-section .bg-\\[\\#fffcf5\\]\\/50");
    if (luckyContainer) {
        const pTags = luckyContainer.querySelectorAll("p:first-child"); // select first p in each flex col
        if (pTags.length >= 2) {
            pTags[0].textContent = lang === 'ko' ? "오늘의 행운 컬러" : "LUCKY COLOR";
            pTags[1].textContent = lang === 'ko' ? "오늘의 행운 숫자" : "LUCKY NUMBER";
        }
    }

    // Saju/Star Labels - TARGET SPANS ONLY to avoid wiping the container
    const sectionLabels = document.querySelectorAll("span.bg-\\[\\#f0e6d2\\]");
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
    const labelShare = document.querySelector("#label-share");
    if(labelShare) labelShare.textContent = lang === 'ko' ? "운명 공유하기" : "Share Result";

    // FAQ Translations
    const faqTitle = document.getElementById("faq-title");
    if(faqTitle) faqTitle.textContent = t.faqTitle;
    
    const faqQ1 = document.getElementById("faq-q1");
    if(faqQ1) faqQ1.textContent = t.faqQ1;
    const faqA1 = document.getElementById("faq-a1");
    if(faqA1) faqA1.textContent = t.faqA1;

    const faqQ2 = document.getElementById("faq-q2");
    if(faqQ2) faqQ2.textContent = t.faqQ2;
    const faqA2 = document.getElementById("faq-a2");
    if(faqA2) faqA2.textContent = t.faqA2;

    const faqQ3 = document.getElementById("faq-q3");
    if(faqQ3) faqQ3.textContent = t.faqQ3;
    const faqA3 = document.getElementById("faq-a3");
    if(faqA3) faqA3.textContent = t.faqA3;

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

// SNS Sharing Functions
async function handleSNSShare(platform, lang) {
    if (!storedUserData) return;

    // Data Preparation
    const fortuneData = lang === "ko" ? window.FORTUNE_DATA : window.FORTUNE_DATA_EN;
    const dateObj = new Date(storedUserData.birthdate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    
    const stems = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
    const branches = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
    const branchKey = branches[year % 12];
    const animal = fortuneData.earthlyBranches[branchKey].animal;
    const star = getConstellation(fortuneData.constellations, month, day).name;

    const url = window.location.href;
    const cleanUrl = url.split('?')[0]; // Remove query params for cleaner sharing

    // Viral Text Generation
    let shareTitle, shareText;
    if (lang === 'ko') {
        shareTitle = "운명록 (運命錄)";
        shareText = `[운명록] 😲 저는 '${animal}띠'의 기운을 타고났어요! \n저의 운명의 단짝 연예인은 누구일까요? \n지금 바로 확인해보세요. #운명록 #사주 #띠별운세`;
    } else {
        shareTitle = "Book of Destiny";
        shareText = `[K-Destiny] 😲 I was born with the energy of the ${animal}! \nWho is my celebrity soulmate? \nCheck yours now! #KDestiny #Saju #Zodiac`;
    }

    switch (platform) {
        case 'kakao':
            shareKakao(shareTitle, shareText, cleanUrl, animal);
            break;
        case 'twitter':
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(cleanUrl)}`;
            window.open(twitterUrl, '_blank');
            break;
        case 'facebook':
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`;
            window.open(fbUrl, '_blank');
            break;
        case 'line':
            const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}%20${encodeURIComponent(cleanUrl)}`;
            window.open(lineUrl, '_blank');
            break;
        case 'telegram':
            const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(cleanUrl)}&text=${encodeURIComponent(shareText)}`;
            window.open(telegramUrl, '_blank');
            break;
        case 'threads':
             const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(cleanUrl)}`;
             window.open(threadsUrl, '_blank');
             break;
        case 'instagram':
            // Instagram doesn't have a direct Web Share URL for feed/stories.
            // Fallback to Copy Link and alert logic.
            // Fallthrough to 'link' case intent but with specific message?
            // Actually, let's just use the link logic but customize the alert.
            try {
                await navigator.clipboard.writeText(`${shareText}\n${cleanUrl}`);
                alert(lang === 'ko' ? "링크가 복사되었습니다. 인스타그램에 공유해보세요!" : "Link copied! Ready to share on Instagram.");
                // Optional: window.open('https://instagram.com', '_blank');
            } catch (err) {
                console.error('Clipboard failed', err);
            }
            break;
        case 'link':
            try {
                await navigator.clipboard.writeText(`${shareText}\n${cleanUrl}`);
                alert(lang === 'ko' ? "링크가 복사되었습니다." : "Link copied to clipboard!");
            } catch (err) {
                console.error('Clipboard failed', err);
                alert(lang === 'ko' ? "복사에 실패했습니다." : "Failed to copy.");
            }
            break;
    }
}

function shareKakao(title, description, link, animal) {
    if (!window.Kakao) return;
    if (!Kakao.isInitialized()) {
        // User should replace this with their actual key
        try {
            Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); 
        } catch(e) {
            console.error("Kakao init failed. Please check your key.");
            return alert("Kakao Share is not configured.");
        }
    }

    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: title,
            description: description,
            imageUrl: 'https://k-destiny.pages.dev/assets/og-image.png', // Ensure this image exists
            link: {
                mobileWebUrl: link,
                webUrl: link,
            },
        },
        buttons: [
            {
                title: '결과 확인하기 (View Result)',
                link: {
                    mobileWebUrl: link,
                    webUrl: link,
                },
            },
        ],
    });
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
