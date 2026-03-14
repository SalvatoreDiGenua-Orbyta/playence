import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

export const cardExpandAnimation = trigger('cardExpand', [
  state('collapsed', style({ height: '85vh', borderRadius: '1.5rem' })),
  state('expanded', style({ height: '100vh', borderRadius: '0px' })),
  transition('collapsed <=> expanded', animate('350ms cubic-bezier(0.4, 0, 0.2, 1)')),
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('80ms', animate('400ms ease-out', style({ opacity: 1, transform: 'none' })))
    ], { optional: true })
  ])
]);
