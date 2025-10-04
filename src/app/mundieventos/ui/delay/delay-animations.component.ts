import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-delay-animations',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delay-animations.component.html',
    styleUrls: ['./delay-animations.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ]
})
export class DelayAnimationsComponent implements OnInit, OnDestroy {
    @Input() delay: number = 0;
    @Input() loadingText: string = 'Cargando...';
    showContent = false;
    progress = 0;
    private progressInterval: any;

    ngOnInit() {
        this.startProgressAnimation();

        setTimeout(() => {
            this.showContent = true;
            this.clearProgressInterval();
        }, this.delay);
    }

    private startProgressAnimation() {
        const updateInterval = 100;
        const increments = (100 / (this.delay / updateInterval));

        this.progressInterval = setInterval(() => {
            this.progress += increments;
            if (this.progress >= 100) {
                this.progress = 100;
                this.clearProgressInterval();
            }
        }, updateInterval);
    }

    private clearProgressInterval() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    ngOnDestroy() {
        this.clearProgressInterval();
    }
}