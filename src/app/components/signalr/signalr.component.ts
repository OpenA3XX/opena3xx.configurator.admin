// import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// import { FlightEvent, SignalrService } from '../../services/realtime.service';

// @Component({
//   selector: 'signalr',
//   template: `
//     <div class="container mt-5">
//       <h1>Flight Events</h1>

//       <h4 class="mb-3">List of Flight Events</h4>

//       <div *ngIf="signalRService.flightEvents.length == 0">
//         <p>No Flight Events</p>
//       </div>
//       <div *ngFor="let m of signalRService.flightEvents">
//         <div class="mb-2 mt-2">
//           --> {{ m[1] }}
//           <div><strong>Hardware Board Id</strong> {{ m['hardware_board_id'] }}</div>
//           <div><strong>Bit Id</strong> {{ m.extender_bit_id }}</div>
//           <div><strong>Bit Name</strong> {{ m.extender_bit_name }}</div>
//           <div><strong>Bus Name</strong> {{ m.extender_bus_name }}</div>
//           <div><strong>Input Selector Name</strong> {{ m.input_selector_name }}</div>
//           <hr />
//         </div>
//       </div>
//     </div>
//   `,
// })
// export class SignalRComponent implements OnInit {
//   title = 'chat-ui';
//   text: string = '';

//   constructor(public signalRService: SignalrService) {}
//   ngOnInit(): void {
//     this.signalRService.connect();
//   }

//   sendMessage(): void {
//     // this.signalRService.sendMessageToApi(this.text).subscribe({
//     //   next: _ => this.text = '',
//     //   error: (err) => console.error(err)
//     // });
//     // this.signalRService.sendMessageToHub(this.text).subscribe({
//     //   next: (_) => (this.text = ''),
//     //   error: (err) => console.error(err),
//     // });
//   }
// }
