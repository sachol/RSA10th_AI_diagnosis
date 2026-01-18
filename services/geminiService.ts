
import { GoogleGenAI } from "@google/genai";
import { QuizResult } from "../types";

export const getMentorFeedback = async (result: QuizResult): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const scorePercentage = (result.score / result.total) * 100;
  
  // 성적 구간별 페르소나 및 조언 방향 설정
  let scoreContext = "";
  if (scorePercentage <= 40) {
    scoreContext = "AI가 아직은 낯선 상태입니다. 하지만 지금 이 진단을 시작했다는 것 자체가 상위 1%로 가는 첫걸음임을 강조하고, 기초부터 현장에서 함께 성장하자는 따뜻한 용기를 주세요.";
  } else if (scorePercentage <= 70) {
    scoreContext = "기초는 튼튼하지만 실무 활용에 대한 구체적인 로드맵이 필요한 상태입니다. AI를 활용해 업무 시간을 절반으로 줄이고 매출을 높이는 현장 전문가로 거듭나도록 조언하세요.";
  } else if (scorePercentage < 100) {
    scoreContext = "매우 뛰어난 리터러시를 보유하고 있습니다. 이제는 단순 활용을 넘어 현장에서 AI를 통해 초격차를 만드는 리더가 될 수 있음을 강조하며 전략적 마인드를 고취시키세요.";
  } else {
    scoreContext = "완벽합니다! 이미 준비된 AI 전문가입니다. 부동산 시장의 판도를 바꾸는 혁신가로서 현장에서 동료들에게 선한 영향력을 끼치는 멘토가 되어달라고 격려하세요.";
  }

  const prompt = `
    사용자 이름: ${result.userName}
    퀴즈 점수: ${result.score} / ${result.total} (${scorePercentage}%)
    구간별 진단: ${scoreContext}
    
    당신은 대한민국 최고의 부동산 교육 기관 'RSA 10기'를 이끄는 인공지능 교육 전문가이자 교수님, 따뜻한 멘토입니다.
    사용자 호칭은 반드시 "${result.userName} 공인중개사님"으로 통일하십시오.

    [피드백 필수 포함 지침]
    1. 도입: 퀴즈 완료에 대한 진심 어린 축하와 공인중개사로서의 열정을 칭찬.
    2. 본론: 점수에 따른 맞춤형 분석을 제공하되, '점수' 자체보다 '앞으로의 변화'에 집중하여 조언.
    3. 핵심: AI는 이제 선택이 아닌 필수 무기입니다. 챗GPT, 자동화 도구가 실제 "부동산 현장"에서 중개사님의 가장 든든한 직원이 되어줄 것임을 설명하세요.
    4. 마무리: "강의장"에서 배우는 단계가 아니라, 실제 "치열한 부동산 현장(필드)"에서 AI라는 강력한 무기를 장착하고 당당하게 마주할 날을 약속하며 마무리하십시오.

    [형식]
    - 문단을 3~4개로 나누어 가독성 있게 작성.
    - 공백 포함 500자 이상 600자 내외로 풍성하고 깊이 있게 작성.
    - 따뜻하고 품격 있는 교수님의 어조 (~입니다, ~하세요).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "훌륭한 도전이었습니다! AI는 단순한 도구가 아니라 부동산 현장에서 여러분의 가장 강력한 파트너가 될 것입니다. 현장에서 곧 뵙겠습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `${result.userName} 공인중개사님, 진심으로 환영합니다. 비록 지금은 AI가 낯설지라도, 부동산 현장에서 이를 도구로 사용하는 순간 중개사님의 가치는 수십 배 뛸 것입니다. RSA 10기 과정이 끝나는 날, 현장에서 압도적인 경쟁력을 갖춘 모습으로 뵙기를 고대합니다!`;
  }
};
