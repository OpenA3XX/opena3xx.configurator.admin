import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';

export interface FlightEvent {
  hardware_board_id: number;
  extender_bit_id: number;
  extender_bit_name: string;
  extender_bus_id: number;
  extender_bus_name: string;
  input_selector_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection;
  public flightEvents: FlightEvent[] = [];
  private connectionUrl = 'http://localhost:5000/signalr';
  private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  public connect = () => {
    this.startConnection();
    this.addListeners();
  };

  //   public sendMessageToApi(message: string) {
  //     return this.http
  //       .post(this.apiUrl, this.buildChatMessage(message))
  //       .pipe(tap((_) => console.log('message sucessfully sent to api controller')));
  //   }

  //   public sendMessageToHub(message: string) {
  //     var promise = this.hubConnection
  //       .invoke('BroadcastAsync', this.buildChatMessage(message))
  //       .then(() => {
  //         console.log('message sent successfully to hub');
  //       })
  //       .catch((err) => console.log('error while sending a message to hub: ' + err));

  //     return from(promise);
  //   }

  private getConnection(): HubConnection {
    return (
      new HubConnectionBuilder()
        .withUrl(this.connectionUrl)
        //  .configureLogging(LogLevel.Trace)
        .build()
    );
  }

  //   private buildChatMessage(message: string): chatMesage {
  //     return {
  //       connectionId: this.hubConnection.connectionId,
  //       text: message,
  //     };
  //   }

  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection
      .start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
  }

  private addListeners() {
    this.hubConnection.on('messageReceivedFromRabbitMq', (data: FlightEvent) => {
      this.flightEvents.push(data);
      console.log('Pushed');
      console.log('message received from RabbitMQ Controller', this.flightEvents);
    });
    this.hubConnection.on('messageReceivedFromHub', (data: FlightEvent) => {
      console.log('message received from Hub');
      this.flightEvents.push(data);
    });
    this.hubConnection.on('newUserConnected', (_) => {
      console.log('new user connected');
    });
  }
}
