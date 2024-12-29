import { Component, inject, input, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../shared.service';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';

import {
  Analytics,
  BriefResults,
  PollResults,
} from '../../models/results.model';
import { ErrorComponent } from '../error/error.component';
import { LoadingPageComponent } from '../loading-page/loading-page.component';
import { TransformDataService } from '../transform-data.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [ErrorComponent, LoadingPageComponent, MatTabsModule, TabViewModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ResultsComponent implements OnInit {
  private sharedService = inject(SharedService);
  private transformService = inject(TransformDataService);
  password = input.required<string>();
  pollAnalyticResults = signal<{ranking: number,suggestion: string, suggester: string, voter:string}[][]>([]);
  pollBriefResults = signal<BriefResults[]>([]);

  isLoadingResults = signal(false);
  errorMsg = signal('');

  ngOnInit(): void {
    console.log('INIT', this.password());
    this.isLoadingResults.set(true);
    this.sharedService.getPollResults(this.password()).subscribe({
      next: (res) => {
        this.pollAnalyticResults.set(this.transformService.transformAnalytics(
          this.transformService.transformObjectToArray(res.analytics))
        );
        this.pollBriefResults.set(
          this.transformService.transformObjectToArray(res.totalRanks)
        );
        console.log(this.pollAnalyticResults())
        this.errorMsg.set('');
        this.isLoadingResults.set(false);
      },
      error: (error) => {
        this.errorMsg.set(error);
        this.isLoadingResults.set(false);
      },
    });
  }
}
