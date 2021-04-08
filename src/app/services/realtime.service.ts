import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';

export interface FlightEvent {
  hardware_board_id: number;
  extender_bit_id: number;
  extender_bit_name: string;
  extender_bus_id: number;
  extender_bus_name: string;
  input_selector_id: string;
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
  public isConnected: boolean = false;
  public keepAliveEvents: KeepAliveEvent[] = [];
  private connectionUrl = 'http://localhost:5000/signalr';
  private reconnectionInterval: any;
  constructor(private http: HttpClient) {}

  public connect = () => {
    clearInterval(this.reconnectionInterval);
    this.reconnectionInterval = this.pollReconnection();
    this.startConnection();
    this.addListeners();
  };

  public disconnect = () => {
    this.hubConnection.stop();
  };

  private getConnection(): HubConnection {
    return new HubConnectionBuilder().withUrl(this.connectionUrl).build();
  }

  private pollReconnection = () => {
    return setInterval(() => {
      if (this.hubConnection.state == HubConnectionState.Disconnected) {
        this.connect();
      }
    }, 1000);
  };
  private startConnection() {
    this.hubConnection = this.getConnection();
    this.hubConnection
      .start()
      .then(() => (this.isConnected = true))
      .catch((err) => (this.isConnected = false));
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

    this.hubConnection.onclose(() => {
      this.isConnected = false;
    });

    this.hubConnection.onreconnected(() => {
      this.isConnected = true;
    });
  }
}
