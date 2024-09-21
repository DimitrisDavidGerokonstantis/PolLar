import { Component, input } from '@angular/core';
import { FullPollInfo } from '../../models/create-poll-request.model';

@Component({
  selector: 'app-download-info',
  standalone: true,
  imports: [],
  templateUrl: './download-info.component.html',
  styleUrl: './download-info.component.css',
})
export class DownloadInfoComponent {
  info = input.required<FullPollInfo>();

  onDownloadInfo(event: Event) {
    event.preventDefault();
    var usernamesString = '';
    const usernames = this.info().userNames.map((user) => {
      usernamesString += `${user}\n`;
    });
    const allow1 = this.info().checkboxAllow ? 'Yes' : 'No';
    const allow2 = this.info().checkboxAllow2 ? 'Yes' : 'No';
    const contents = `Title: ${this.info().title}\nPassword: ${
      this.info().password
    }\nAdmin's Username: ${this.info().username}\nRank1 Points: ${
      this.info().rank1points
    }\nRank2 Points: ${this.info().rank2points}\nRank3 Points: ${
      this.info().rank3points
    }\nSuggestions per user: ${this.info().numOfSug}\nNumber of participants: ${
      this.info().numOfPart
    }\n\nParticipants' usernames:\n${usernamesString}\nAllow participants to vote again for the \nsame participant in different rank: ${allow1}\nAllow participants to see other participants' suggestions \nduring the suggestions' phase: ${allow2} \n`;
    const element = document.createElement('a');
    const file = new Blob([contents], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `poll-${this.info().password}-info.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
}
