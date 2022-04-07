import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { BASE_URL } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  constructor() { }

  /* createHubConnection(): HubConnection {
    let hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${BASE_URL}/game`)
      .build();

    hubConnection.start().catch(err => console.error(err.toString()));

    hubConnection.on('Send', (data: any) => {
      
    });

    hubConnection.on('invite', (data: any) => {
      console.log ('Received invite', data);
    });

    return hubConnection;
  } */
}
