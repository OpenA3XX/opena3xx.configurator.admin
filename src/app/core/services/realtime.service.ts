import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

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
  private hubConnection: HubConnection | null = null;
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
    if (this.hubConnection && this.hubConnection.state !== HubConnectionState.Disconnected) {
      this.hubConnection.stop().catch(error => {
        console.error('Error disconnecting from SignalR:', error);
      });
    }
    this.isConnected = false;
    clearInterval(this.reconnectionInterval);
  };

  private getConnection(): HubConnection {
    return new HubConnectionBuilder().withUrl(this.connectionUrl).build();
  }

  private pollReconnection = () => {
    return setInterval(() => {
      if (this.hubConnection && this.hubConnection.state === HubConnectionState.Disconnected) {
        this.connect();
      }
    }, 1000);
  };

  private startConnection() {
    try {
      this.hubConnection = this.getConnection();
      this.hubConnection
        .start()
        .then(() => (this.isConnected = true))
        .catch((error) => {
          console.error('Error connecting to SignalR:', error);
          this.isConnected = false;
        });
    } catch (error) {
      console.error('Error creating SignalR connection:', error);
      this.isConnected = false;
    }
  }

  private addListeners() {
    if (!this.hubConnection) {
      console.error('HubConnection is null, cannot add listeners');
      return;
    }

    this.hubConnection.on('HardwareInputSelectors', (payload: string) => {
      try {
        const data: FlightEvent = JSON.parse(payload);
        this.flightEvents.unshift(data);
      } catch (error) {
        console.error('Error parsing HardwareInputSelectors payload:', error);
      }
    });

    this.hubConnection.on('KeepAlive', (payload: string) => {
      try {
        const data: KeepAliveEvent = JSON.parse(payload);
        this.keepAliveEvents.unshift(data);
      } catch (error) {
        console.error('Error parsing KeepAlive payload:', error);
      }
    });

    this.hubConnection.onclose(() => {
      this.isConnected = false;
    });

    this.hubConnection.onreconnected(() => {
      this.isConnected = true;
    });
  }
}
