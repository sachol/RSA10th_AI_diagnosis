
import { GoogleGenAI } from "@google/genai";
import { QuizResult } from "../types";

// Fix: Refactored to use named parameters for GoogleGenAI initialization and process.env.API_KEY directly
export const getMentorFeedback = async (result: QuizResult): Promise<string> => {
  const scorePercentage = (result.score / result.total) * 100;
  
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

  // Use process.env.API_KEY directly as per the guidelines
  if (!process.env.API_KEY) {
    let demoFeedback = `${result.userName} 공인중개사님, 진단에 참여해주셔서 감사합니다!\n\n현재 데모 모드로 작동 중입니다. ${result.score}점이라는 결과는 멋진 시작입니다. `;
    if (scorePercentage > 70) demoFeedback += "이미 훌륭한 AI 감각을 갖추고 계시네요! ";
    demoFeedback += "부동산 현장에서 AI는 단순한 도구가 아니라 중개사님의 가장 강력한 파트너가 될 것입니다. 실제 필드에서 AI라는 날개를 달고 성공하시는 그날까지 RSA가 함께하겠습니다. 현장에서 뵙겠습니다!";
    return demoFeedback;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    사용자 이름: ${result.userName}
    퀴즈 점수: ${result.score} / ${result.total} (${scorePercentage}%)
    구간별 진단 방향: ${scoreContext}
    
    당신은 대한민국 최고의 부동산 교육 기관 'RSA 10기'를 이끄는 인공지능 교육 전문가이자 교수님, 따뜻한 멘토입니다.
    사용자 호칭은 반드시 "${result.userName} 공인중개사님"으로 통일하십시오.

    [피드백 필수 포함 지침]
    1. 도입: 퀴즈 완료에 대한 진심 어린 축하와 공인중개사로서의 열정을 칭찬.
    2. 본론: 점수에 따른 맞춤형 분석을 제공하되, '점수' 자체보다 '앞으로의 변화'에 집중하여 조언.
    3. 핵심: AI는 이제 선택이 아닌 필수 무기입니다. 챗GPT가 실제 "부동산 현장"에서 어떻게 든든한 직원이 될지 설명하세요.
    4. 마무리: "강의실"이 아닌, 실제 "치열한 부동산 현장(필드)"에서 AI라는 무기를 장착하고 당당하게 마주할 날을 기대하며 인사하십시오.

    [형식]
    - 문단을 3~4개로 나누어 가독성 있게 작성.
    - 공백 포함 500자 내외로 풍성하게 작성.
    - 따뜻하고 품격 있는 교수님의 어조 (~입니다, ~하세요).
  `;

  try {
    // Correctly using ai.models.generateContent with 'gemini-3-pro-preview' as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Accessing .text property directly as per guidelines (not a method)
    return response.text || "훌륭한 도전이었습니다! AI는 부동산 현장에서 여러분의 가장 강력한 파트너가 될 것입니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `${result.userName} 공인중개사님, 도전하는 모습이 아름답습니다. 부동산 현장에서 AI를 도구로 사용하는 순간 중개사님의 가치는 수십 배 뛸 것입니다. 필드에서 곧 뵙겠습니다!`;
  }
};
