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
export class RealTimeService {
  private hubConnection: HubConnection;
  public flightEvents: FlightEvent[] = [];
  private connectionUrl = 'http://localhost:5000/signalr';

  constructor(private http: HttpClient) {}

  public connect = () => {
    this.startConnection();
    this.addListeners();
  };

  private getConnection(): HubConnection {
    return new HubConnectionBuilder().withUrl(this.connectionUrl).build();
  }

  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection
      .start()
      .then(() => console.log('connection started'))
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
  }

  private addListeners() {
    this.hubConnection.on('HardwareEvents', (payload: string) => {
      let data: FlightEvent = JSON.parse(payload);
      this.flightEvents.push(data);
    });
  }
}
