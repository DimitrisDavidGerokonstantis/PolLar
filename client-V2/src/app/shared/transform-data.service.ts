import { Injectable } from '@angular/core';
import {
  SuggestionsData,
  UserSuggestions,
} from '../models/poll-status-results.model';
import {
  SuggestionsToVoteData,
  transformedSuggestionsToVoteData,
} from '../models/votingData.model';
import { Analytics } from '../models/results.model';

@Injectable({
  providedIn: 'root',
})
export class TransformDataService {
  transformCurrentSuggestionsData(
    currentSuggestions: SuggestionsData[],
    suggestionsPerParticipant: number
  ): UserSuggestions[] {
    let suggestionsPerUser: UserSuggestions[] = [];

    for (
      let i = 0;
      i < currentSuggestions.length / suggestionsPerParticipant;
      i++
    ) {
      let currentUserSuggestions: string[] = [];
      let current_rank = 1;
      let current_user = 0;
      let current_user_name = '';
      for (
        let j = i * suggestionsPerParticipant;
        j < i * suggestionsPerParticipant + suggestionsPerParticipant;
        j++
      ) {
        currentUserSuggestions.push(currentSuggestions[j].suggestion);
        current_rank += 1;
        current_user = currentSuggestions[j].user_id;
        current_user_name = currentSuggestions[j].nickname;
      }
      suggestionsPerUser.push({
        user: current_user,
        suggestions: currentUserSuggestions,
        name: current_user_name,
      });
    }
    return suggestionsPerUser;
  }

  transformVotingData(
    data: SuggestionsToVoteData[]
  ): transformedSuggestionsToVoteData {
    let transformedData: transformedSuggestionsToVoteData = {};
    data.forEach((suggestion) => {
      if (!transformedData[suggestion.userNickname]) {
        transformedData[suggestion.userNickname] = [];
      }
      transformedData[suggestion.userNickname].push({
        suggestion: suggestion.suggestion,
        sugID: suggestion.id,
        sugUserID: suggestion.userid,
      });
    });
    return transformedData;
  }

  transformObjectToArray(obj: { [key: number]: object }) {
    let result = new Array(Object.keys(obj).length);
    for (let key in obj) {
      result[key] = obj[key];
    }
    return result;
  }

  transformAnalytics(analytics: Analytics[]){
    let objectResult : {[key: number]: {ranking: number,voter:string ,suggestion: string, suggester: string}[]} = {}
    analytics.forEach((voteInfo=>{
      if(!objectResult[voteInfo.voterId]) objectResult[voteInfo.voterId]=[]
      objectResult[voteInfo.voterId].push({
        ranking: voteInfo.ranking,
        suggestion: voteInfo.suggestionVoted,
        suggester: voteInfo.userSuggestedNickname,
        voter: voteInfo.voterNickname
      })
    }))
    let arrayResult = []
    for(let voter in objectResult){
      objectResult[voter].sort((vote1, vote2) => vote1.ranking-vote2.ranking)
      arrayResult.push(objectResult[voter])
    }
    return arrayResult
  }
}
