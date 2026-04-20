/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectKnowledge {
  id: string;
  title: string;
  fullDescription: string;
  achievements: string[];
  techStack: string[];
  insights: string;
  metadata: {
    category: string;
    importance: 'high' | 'medium' | 'low';
  };
}

export const projectKnowledgeBase: ProjectKnowledge[] = [
  {
    id: "archiving-2025",
    title: "2025 삼선동 아카이빙 - 성북구 재개발 공동체 기록",
    fullDescription: "재개발을 앞둔 삼선동의 모습들을 수집하고 낮과 밤에 따른 차이점을 포착한 아카이빙 작업입니다.",
    achievements: [
      "필드 레코딩을 통한 기록 수집부터 선별, 평가과정까지 수행",
      "마을의 주택과 주요 모습의 사진 기록 및 메타데이터(Dublin Core) 설계",
      "Omeka S를 활용한 아카이빙 및 디지털 컨텐츠 구축"
    ],
    techStack: ["Dublin Core", "디지털 기록", "마을 아카이빙"],
    insights: "공동체 아카이빙은 단순히 삼선동의 현재 모습을 저장하는 것이 아니라, 앞으로 변화할 지역이기에 현재를 기억할 수 있도록 보존하는 작업임을 깨달았습니다.",
    metadata: {
      category: "Community Archiving",
      importance: "high"
    }
  },
  {
    id: "guro-lib-2025",
    title: "구로도서관 다문화 가정 학생 지식 격차 해소 프로그램",
    fullDescription: "구로구 내 다문화 가정 학생들의 도서관 활용성을 높이고, 성적 향상을 위한 맞춤형 멘토링 프로그램 '바로풀기 교실'을 기획했습니다.",
    achievements: [
      "다문화 가정 학생 맞춤형 학습 멘토링 커리큘럼 설계",
      "다문화 가정 학생의 커뮤니티 형성",
    ],
    techStack: ["프로그램 기획", "공동체", "다문화"],
    insights: "도서관 프로그램 기획의 A부터 Z까지 해볼 수 있었습니다. 실제로 시행하지는 못했지만 추후에도 활용할 가치가 있다고 생각했습니다.",
    metadata: {
      category: "Library Program",
      importance: "high"
    }
  },
  {
    id: "jangsil-2026",
    title: "장실타임(JangsilTime) - Google AI Studio 기반 인터랙티브 앱",
    fullDescription: "지루할 수 있는 대기 시간을 활용할 수 있는 구글 AI 스튜디오 기반의 미니 웹 어플리케이션입니다.",
    achievements: [
      "Gemini API(Google AI Studio)를 활용한 바이브 코딩 체험",
      "Github를 활용한 최적화된 빌드 프로세스 구성 및 배포"
    ],
    techStack: ["AI", "Gemini API", "Github"],
    insights: "생성형 AI를 활용하여 웹 어플리케이션을 만들 수 있었고 사용자를 위해 컨텐츠를 추가하고 개선 과정을 거쳐 후속 조치도 해보았습니다.",
    metadata: {
      category: "AI Web Application",
      importance: "low"
    }
  },
  {
    id: "bus-analysis-2022",
    title: "한성대 마을버스 혼잡도 분석",
    fullDescription: "한성대학교 학생들의 등하교 편의성을 위해 성북 02번과 종로 03번 마을버스 노선의 시간대별 혼잡도를 분석하고, 데이터 기반의 시각화를 진행한 프로젝트입니다.",
    achievements: [
      "2019년도 마을버스 승하차 데이터 수집 및 전처리",
      "가장 혼잡한 시간대와 한적한 시간대 도출로 인한 선택지 증가",
    ],
    techStack: ["Data Analysis", "Public Data API"],
    insights: "공공 데이터는 그 자체로도 가치가 있지만, 사용자의 불편함과 연결될 때 가치있는 정보가 된다는 것을 알 수 있었습니다.",
    metadata: {
      category: "Data Analysis",
      importance: "medium"
    }
  },
  {
    id: "seoul-metro-2023",
    title: "서울교통공사 미래 비전 수립 및 전략 계획 분석",
    fullDescription: "서울교통공사의 경영 현황을 분석하고, 이용자의 편의 개선을 중심으로 실행 계획을 설계했습니다.",
    achievements: [
      "교통 약자를 위한 1역사 1동선 시설 구축 제안",
      "도움 로봇 운영으로 시민 편의성 강화",
      "조직 경영의 전반적인 과정을 기획"
    ],
    techStack: ["Strategic Planning", "SWOT Analysis"],
    insights: "하나의 기관(기업)이 하나의 프로젝트를 시행할 때 기획, 예산, 시행 등의 과정을 연습해 볼 수 있었습니다.",
    metadata: {
      category: "Strategic Planning",
      importance: "low"
    }
  }
];
