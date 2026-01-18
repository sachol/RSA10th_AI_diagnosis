
import { Question } from './types';

export const QUESTIONS: Question[] = [
  // EASY - 10 questions
  { id: 1, difficulty: 'EASY', category: 'AI_BASICS', text: "AI(인공지능)가 중개업무에 도입될 때 가장 큰 목적은?", options: ["중개사를 대체하기 위해", "단순 업무를 자동화하여 상담에 집중하기 위해", "인터넷 속도를 빠르게 하기 위해", "집값을 강제로 올리기 위해"], correctAnswer: 1, explanation: "AI는 중개사의 보조 도구로서 생산성을 극대화하는 역할을 합니다." },
  { id: 2, difficulty: 'EASY', category: 'CHATBOT', text: "챗GPT와 대화할 때 입력하는 질문이나 명령어를 무엇이라 하나요?", options: ["코드", "스크립트", "프롬프트", "데이터"], correctAnswer: 2, explanation: "AI에게 내리는 구체적인 지시문을 프롬프트(Prompt)라고 합니다." },
  { id: 3, difficulty: 'EASY', category: 'AUTOMATION', text: "AI가 가장 잘하는 부동산 관련 업무는?", options: ["매물 홍보 문구 초안 작성", "직접 현장 방문 및 계약서 날인", "고객과의 감정적 갈등 해결", "부동산 중개 수수료 직접 수령"], correctAnswer: 0, explanation: "AI는 방대한 데이터를 바탕으로 텍스트를 생성하는 데 탁월합니다." },
  { id: 4, difficulty: 'EASY', category: 'AI_BASICS', text: "부동산 AI 기술 중 '가상 스테이징'의 의미는?", options: ["집을 실제로 리모델링함", "가구 없는 빈집에 AI로 가상 가구를 배치함", "집의 위치를 지도로 보여줌", "집값을 예측함"], correctAnswer: 1, explanation: "빈 공간을 AI로 연출하여 매수자의 상상력을 자극하는 기술입니다." },
  { id: 11, difficulty: 'EASY', category: 'CHATBOT', text: "챗GPT는 어떤 방식의 인공지능인가요?", options: ["그림만 그리는 AI", "대화형 생성 AI", "소리만 듣는 AI", "로봇 청소기용 AI"], correctAnswer: 1, explanation: "챗GPT는 텍스트를 생성하고 대화하는 데 최적화된 생성 AI입니다." },
  { id: 12, difficulty: 'EASY', category: 'STRATEGY', text: "AI 리터러시(Literacy)란 무엇인가요?", options: ["AI를 다루는 하드웨어 기술", "AI를 이해하고 비판적으로 활용하는 능력", "컴퓨터를 조립하는 능력", "스마트폰을 최신형으로 바꾸는 것"], correctAnswer: 1, explanation: "AI 시대에 도구를 이해하고 올바르게 사용하는 지적 능력을 뜻합니다." },

  // MEDIUM - 10 questions
  { id: 5, difficulty: 'MEDIUM', category: 'CHATBOT', text: "좋은 프롬프트를 작성하기 위한 3요소로 적절한 것은?", options: ["길이, 폰트, 색상", "역할 부여, 배경 정보, 구체적 지시", "질문 횟수, 접속 시간, 아이디", "컴퓨터 사양, 인터넷 속도, 가격"], correctAnswer: 1, explanation: "AI에게 명확한 페르소나와 상황을 제시해야 품질 높은 답변이 나옵니다." },
  { id: 6, difficulty: 'MEDIUM', category: 'ETHICS', text: "AI가 잘못된 정보를 사실처럼 말하는 현상을 무엇이라 하나요?", options: ["버그", "할루시네이션(환각)", "렉", "디버깅"], correctAnswer: 1, explanation: "생성 AI의 특성상 그럴듯한 거짓말을 하는 환각 현상이 발생할 수 있습니다." },
  { id: 7, difficulty: 'MEDIUM', category: 'STRATEGY', text: "AI를 활용한 '데이터 기반 중개'의 장점은?", options: ["운에 맡기는 영업이 가능함", "객관적 시세 분석으로 고객 신뢰도 확보", "수수료를 더 많이 받을 수 있음", "정부 규제를 피할 수 있음"], correctAnswer: 1, explanation: "빅데이터를 활용한 분석은 전문가로서의 권위를 세워줍니다." },
  { id: 8, difficulty: 'MEDIUM', category: 'AUTOMATION', text: "멀티모달(Multi-modal) AI의 특징은?", options: ["한 번에 한 가지 일만 함", "텍스트, 이미지, 음성을 동시에 처리함", "영문 텍스트만 처리함", "인터넷 없이 작동함"], correctAnswer: 1, explanation: "다양한 형태의 정보를 복합적으로 이해하는 고급 AI 기술입니다." },
  { id: 13, difficulty: 'MEDIUM', category: 'STRATEGY', text: "중개사가 AI를 활용해 블로그 포스팅을 할 때 가장 주의할 점은?", options: ["최대한 길게 쓴다", "AI가 쓴 글을 반드시 직접 검수한다", "영어로만 작성한다", "무조건 복사해서 붙여넣기 한다"], correctAnswer: 1, explanation: "전문가로서 정보의 정확성을 최종 확인하는 절차가 필수입니다." },

  // HARD - 10 questions
  { id: 9, difficulty: 'HARD', category: 'STRATEGY', text: "AI 시대에 중개사가 살아남기 위한 가장 핵심적인 역량은?", options: ["단순 매물 정보 나열", "AI를 도구로 활용하는 '리터러시'와 대면 서비스의 진정성", "AI보다 더 빠르게 타자 치기", "모든 AI 기술을 직접 개발하기"], correctAnswer: 1, explanation: "도구 활용 능력과 인간만의 공감/협상 능력을 결합해야 합니다." },
  { id: 10, difficulty: 'HARD', category: 'ETHICS', text: "부동산 AI 활용 시 개인정보 보호와 관련하여 가장 올바른 태도는?", options: ["고객의 전화번호를 그대로 AI에 입력해 분석한다", "민감한 정보는 비식별화(익명화) 처리 후 활용한다", "무료 AI면 아무 정보나 넣어도 안전하다", "AI는 정보를 저장하지 않으므로 괜찮다"], correctAnswer: 1, explanation: "민감한 고객 정보는 AI 입력 시 반드시 마스킹 처리가 필요합니다." },
  { id: 14, difficulty: 'HARD', category: 'STRATEGY', text: "RAG(검색 증강 생성) 기술이 부동산 AI 상담에서 중요한 이유는?", options: ["답변 속도가 매우 빠르기 때문", "최신 법령이나 실시간 매물 정보를 AI 답변에 결합하기 위해", "AI의 목소리를 예쁘게 만들기 위해", "이미지 생성 비용을 줄이기 위해"], correctAnswer: 1, explanation: "AI가 학습하지 않은 최신/전문 데이터를 실시간으로 가져와 답변의 정확도를 높입니다." },
  { id: 15, difficulty: 'HARD', category: 'STRATEGY', text: "생성형 AI의 '토큰(Token)' 개념과 관련된 설명 중 맞는 것은?", options: ["AI가 먹는 가상 화폐이다", "텍스트를 처리하는 데이터의 최소 단위이다", "부동산 중개권의 이름이다", "컴퓨터의 메모리 용량이다"], correctAnswer: 1, explanation: "AI가 문장을 이해하고 생성할 때 나누는 텍스트의 조각 단위입니다." },
  { id: 16, difficulty: 'HARD', category: 'AI_BASICS', text: "파인튜닝(Fine-tuning)이란 무엇을 의미하나요?", options: ["컴퓨터를 새로 사는 것", "특정 도메인(예: 부동산)에 맞춰 AI를 미세 조정 학습시키는 것", "AI의 전원을 끄는 것", "단순히 프롬프트를 길게 쓰는 것"], correctAnswer: 1, explanation: "사전 학습된 모델을 특정 분야의 데이터로 더 정교하게 만드는 과정입니다." }
];
