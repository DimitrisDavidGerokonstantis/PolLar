export interface PollStatusResponse {
  suggestionsUserIds?: { user_id: number }[];
  suggestionsData?: SuggestionsData[];
  numofusers: number;
  phase: number;
  checkbox?: boolean;
  votingStatus?: VotesData[];
}

export interface SuggestionsData {
  nickname: string;
  user_id: number;
  username: string;
  suggestion: string;
}

export interface UserSuggestions {
  user: number;
  suggestions: string[];
  name: string;
}

export interface VotesData {
  userId: number;
  userName: string;
  numOfVotes: number;
}
