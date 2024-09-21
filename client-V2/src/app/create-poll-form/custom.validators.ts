import { AbstractControl } from "@angular/forms";


export function minimumParticipants(control: AbstractControl){
    if(control.get('numOfParticipants')?.value<5 && !control.get('checkbox1')?.value)
        return {validNumberOfParticipants: false}
    return null
}

export function participantsSuggestionsRelation(control: AbstractControl){
    if((control.get('numOfParticipants')?.value-1)*(control.get('suggestionsPerParticipant')?.value)>=3)
        return null
    return {validRelationOfParticipantsAndSuggestions: false}
}
