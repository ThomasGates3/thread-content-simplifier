
export enum ContentTemplate {
  NEWS_HOOK = 'NEWS_HOOK',
  EDUCATIONAL_THREAD = 'EDUCATIONAL_THREAD',
  OPINION_ANALYSIS = 'OPINION_ANALYSIS',
  QUICK_TIP = 'QUICK_TIP'
}

export interface HemingwayAudit {
  gradeLevel: string;
  longestSentenceWordCount: number;
  removedComplexWords: string[];
}

export interface SimplifiedContent {
  transformedContent: string;
  audit: HemingwayAudit;
  engagementPrediction: string;
}

export interface AppState {
  input: string;
  customInstructions: string;
  template: ContentTemplate;
  isProcessing: boolean;
  result: SimplifiedContent | null;
  error: string | null;
}
