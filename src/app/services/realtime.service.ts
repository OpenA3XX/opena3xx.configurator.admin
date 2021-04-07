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
  timestamp: string;
}

export interface KeepAliveEvent {
  hardware_board_id: number;
  timestamp: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class RealTimeService {
  private hubConnection: HubConnection;
  public flightEvents: FlightEvent[] = [];
  public keepAliveEvents: KeepAliveEvent[] = [];
  private connectionUrl = 'http://localhost:5000/signalr';

  constructor(private http: HttpClient) {}

  public connect = () => {
    this.startConnection();
    this.addListeners();
  };

  public disconnect = () => {
    this.hubConnection.stop();
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
    this.hubConnection.on('HardwareInputSelectors', (payload: string) => {
      let data: FlightEvent = JSON.parse(payload);
      this.flightEvents.unshift(data);
    });
    this.hubConnection.on('KeepAlive', (payload: string) => {
      let data: KeepAliveEvent = JSON.parse(payload);
      this.keepAliveEvents.unshift(data);
    });
  }
}
