export interface SuggestionsToVoteData {
  id: number;
  suggestion: string;
  userid: number;
  ppwd: string;
  username: string;
  userNickname: string;
}

export interface transformedSuggestionsToVoteData {
  [key: string]: { suggestion: string; sugID: number; sugUserID: number }[];
}

export interface VotingData {
  mydata: SuggestionsToVoteData[];
  phase: number;
}

export interface myVotesData {
  nickname: string;
  username: string;
  user: number;
  sugid: number;
  rank: number;
  suggestion: string;
  password: string;
  phase: number;
  sugUser: number;
}
