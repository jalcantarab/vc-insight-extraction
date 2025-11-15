
export type ItemType = 'signals' | 'insights' | 'opportunities' | 'ideas';

export interface ExtractedItem {
  id: string;
  type: ItemType;
  text: string;
  tags?: string[];
  speaker?: string;
  timestamp?: string;
  okrIds?: string[];
}

export interface Signal extends ExtractedItem {
    type: 'signals';
}
export interface Insight extends ExtractedItem {
    type: 'insights';
}
export interface Opportunity extends ExtractedItem {
    type: 'opportunities';
}
export interface Idea extends ExtractedItem {
    type: 'ideas';
}

export interface ExtractedData {
  signals: Signal[];
  insights: Insight[];
  opportunities: Opportunity[];
  ideas: Idea[];
}

export interface OKR {
    id: string;
    text: string;
}
