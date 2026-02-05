document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("destiny-form");
  const inputSection = document.getElementById("input-section");
  const resultSection = document.getElementById("result-section");
  const btnReset = document.getElementById("btn-reset");

  // 천간 (10간)
  const heavenlyStems = [
    "경(庚)",
    "신(辛)",
    "임(壬)",
    "계(癸)",
    "갑(甲)",
    "을(乙)",
    "병(丙)",
    "정(丁)",
    "무(戊)",
    "기(己)",
  ];

  // 지지 (12지) - 띠
  const earthlyBranches = [
    "신(申)",
    "유(酉)",
    "술(戌)",
    "해(亥)",
    "자(子)",
    "축(丑)",
    "인(寅)",
    "묘(卯)",
    "진(辰)",
    "사(巳)",
    "오(午)",
    "미(未)",
  ];

  // 띠 동물
  const zodiacAnimals = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const birthdate = document.getElementById("birthdate").value;
    const birthtime = document.getElementById("birthtime").value;

    if (!birthdate) return alert("생년월일을 입력해주세요.");

    const dateObj = new Date(birthdate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // 1. 띠 & 간지 계산 (양력 기준 간이 계산)
    // 실제 사주는 입춘을 기준으로 바뀌지만, 여기서는 편의상 양력 1월 1일 기준으로 계산합니다.
    const stemIndex = year % 10;
    const branchIndex = year % 12;

    const stem = heavenlyStems[stemIndex];
    const branch = earthlyBranches[branchIndex];
    const animal = zodiacAnimals[branchIndex];

    const ganji = `${stem[2]}${branch[2]}년 (${animal}띠)`;

    // 2. 별자리 계산
    const constellation = getConstellation(month, day);

    // 결과 표시
    document.getElementById("result-name").textContent = `${username}님의 사주/별자리 정보`;
    document.getElementById("result-zodiac-kr").textContent = animal;
    document.getElementById("result-constellation").textContent = constellation.name;
    document.getElementById("result-ganji").textContent = ganji;

    // 간단한 설명 생성
    const description = `
            ${year}년에 태어난 당신은 ${stem[2]}${branch[2]}년생입니다.
            하늘의 기운은 '${stem[0]}'이고 땅의 기운은 '${branch[0]}'입니다.
            
            서양 별자리는 ${constellation.name}이며, 
            ${constellation.desc}
        `;
    document.getElementById("result-desc").textContent = description.trim();

    // 화면 전환
    inputSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
    resultSection.classList.add("fade-in");
  });

  btnReset.addEventListener("click", () => {
    resultSection.classList.add("hidden");
    inputSection.classList.remove("hidden");
    inputSection.classList.add("fade-in");
    form.reset();
  });
});

function getConstellation(month, day) {
  // 별자리 날짜 기준
  const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
  const constellations = [
    { name: "염소자리", desc: "책임감이 강하고 목표를 향해 꾸준히 나아가는 성향입니다." },
    { name: "물병자리", desc: "독창적이고 자유로운 영혼을 가진 혁신가입니다." },
    { name: "물고기자리", desc: "감수성이 풍부하고 타인에 대한 공감 능력이 뛰어납니다." },
    { name: "양자리", desc: "열정적이고 도전적인 리더십을 가지고 있습니다." },
    { name: "황소자리", desc: "신중하고 우직하며 아름다움을 사랑하는 평화주의자입니다." },
    { name: "쌍둥이자리", desc: "호기심이 많고 재치 있으며 소통 능력이 뛰어납니다." },
    { name: "게자리", desc: "가정을 소중히 여기며 따뜻한 모성애/부성애를 가졌습니다." },
    { name: "사자자리", desc: "자신감이 넘치고 주목받기를 좋아하는 타고난 스타입니다." },
    { name: "처녀자리", desc: "섬세하고 분석적이며 완벽을 추구하는 성향입니다." },
    { name: "천칭자리", desc: "조화와 균형을 중시하며 사교적인 매력이 있습니다." },
    { name: "전갈자리", desc: "통찰력이 깊고 한번 마음먹은 것은 끝까지 해냅니다." },
    { name: "사수자리", desc: "자유를 사랑하고 낙천적이며 모험을 즐깁니다." },
    { name: "염소자리", desc: "책임감이 강하고 목표를 향해 꾸준히 나아가는 성향입니다." },
  ];

  let index = month - 1;
  if (day < dates[month - 1]) {
    index = index - 1;
    if (index < 0) index = 11; // 1월 초 -> 이전 해 12월(염소자리)
  }

  return constellations[index];
}
