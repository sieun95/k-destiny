document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("destiny-form");
  const inputSection = document.getElementById("input-section");
  const resultSection = document.getElementById("result-section");
  const btnReset = document.getElementById("btn-reset");
  
  // 전역 변수에서 데이터 로드 (CORS 해결)
  const fortuneData = window.FORTUNE_DATA;
  
  if (!fortuneData) {
      console.error("Fortune data not found in window object.");
      alert("데이터를 불러오는데 실패했습니다. 새로고침 해주세요.");
      return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const birthdate = document.getElementById("birthdate").value;

    if (!birthdate) return alert("생년월일을 입력해주세요.");

    const dateObj = new Date(birthdate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // 1. 띠 & 간지 계산 (양력 기준 간이 계산)
    // 0~9 (갑~계)
    const stems = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
    // 0~11 (신~미)
    const branches = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];
    
    // 매핑용 키 (한글 1글자) -> JSON 키
    const stemKey = stems[year % 10];
    const branchKey = branches[year % 12];
    
    const stemData = fortuneData.heavenlyStems[stemKey]; // { element, keyword, desc }
    const branchData = fortuneData.earthlyBranches[branchKey]; // { animal, trait, ... }

    // 간지 문자열 (예: 갑자, 병인)
    const ganjiChar = `${stemKey}${branchKey}`;
    const animalChar = branchData.animal;

    // 2. 별자리 계산
    const constellation = getConstellation(fortuneData.constellations, month, day);

    // 결과 텍스트 조합
    document.getElementById("result-name").textContent = `${username} 님`;
    document.getElementById("result-ganji").textContent = `${ganjiChar}년 (${animalChar}띠)`;
    
    // 사주 설명 조합 (밝은 배경에 맞는 텍스트 색상)
    const sajuDesc = `
        <strong class="text-[#8b5a2b] font-bold">"${stemData.keyword}"의 기운과 "${animalChar}"의 성향</strong><br>
        하늘에서는 <span class="font-bold text-gray-800">${stemData.element}</span>의 기운을, 땅에서는 ${branchData.trait} <br>
        <span class="text-gray-500 text-xs mt-1 block">(${stemData.desc})</span>
    `;
    document.getElementById("result-saju-desc").innerHTML = sajuDesc;

    // 별자리 설명 조합
    document.getElementById("result-constellation").textContent = constellation.name;
    document.getElementById("result-star-desc").innerHTML = `
        ${constellation.desc}
    `;

    // 화면 전환: 입력창 숨김 -> 로딩창 표시 -> 3초 후 결과창 표시
    inputSection.classList.add("hidden");
    const loadingSection = document.getElementById("loading-section");
    loadingSection.classList.remove("hidden");
    
    // 로딩바이크 스크롤 이동 (상단으로 즉시 이동)
    window.scrollTo(0, 0);

    setTimeout(() => {
        loadingSection.classList.add("hidden");
        resultSection.classList.remove("hidden");
        // 결과창으로 스크롤 이동 (상단으로 즉시 이동)
        window.scrollTo(0, 0);
    }, 3000); // 3초 대기 (광고 노출 시간 확보)
  });

  btnReset.addEventListener("click", () => {
    resultSection.classList.add("hidden");
    inputSection.classList.remove("hidden");
    // 입력창으로 스크롤 이동 (상단으로 즉시 이동)
    window.scrollTo(0, 0);
    form.reset();
  });
});

function getConstellation(constellations, month, day) {
    // 별자리 날짜 기준
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
    
    let index = month - 1;
    if (day < dates[month - 1]) {
        index = index - 1;
        if (index < 0) index = 11; // 1월 초 -> 이전 해 12월(염소자리)
    }

    return constellations[index];
}
