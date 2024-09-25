export interface PollResults {
  analytics: { [key: number]: Analytics };
  totalRanks: { [key: number]: BriefResults };
  phase: number;
}

export interface Analytics {
  voteId: number;
  voter: string;
  voterNickname: string;
  voterId: number;
  pollPassword: string;
  pollPhase: number;
  suggestionVoted: string;
  suggestionVotedId: number;
  ranking: number;
  userSuggested: string;
  userSuggestedNickname: string;
  userSuggestedId: number;
}

export interface BriefResults {
  suggestionVoted: string;
  suggestionVotedId: number;
  totalRank: number;
}
