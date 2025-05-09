export interface UIState {
  expanded: boolean;
  activeTab: 'tab1' | 'tab2';
  loadingGuide?: boolean;
  loadingCode?: boolean;
  guideContent?: string;
  codeContent?: string;
  guideError?: boolean;
  codeError?: boolean;
}