import { Component } from '@angular/core';

@Component({
  selector: 'opena3xx-dashboard',
  template: `
    <h1>Welcome</h1>
    <mat-grid-list cols="8" rowHeight="6:3">
      <mat-grid-tile>
        <button mat-flat-button color="primary">
          <mat-icon mat-list-icon>home</mat-icon>
          Home
        </button>
      </mat-grid-tile>
      <mat-grid-tile>
        <button mat-flat-button color="primary">
          <mat-icon mat-list-icon>login</mat-icon>
          Hardware Input Types
        </button>
      </mat-grid-tile>
      <mat-grid-tile>
        <button mat-flat-button color="primary">
          <mat-icon mat-list-icon>logout</mat-icon>
          Hardware Output Types
        </button>
      </mat-grid-tile>
      <mat-grid-tile>4</mat-grid-tile>
      <mat-grid-tile>5</mat-grid-tile>
      <mat-grid-tile>6</mat-grid-tile>
      <mat-grid-tile>7</mat-grid-tile>
      <mat-grid-tile>8</mat-grid-tile>
      <mat-grid-tile>9</mat-grid-tile>
      <mat-grid-tile>10</mat-grid-tile>
      <mat-grid-tile>11</mat-grid-tile>
      <mat-grid-tile>12</mat-grid-tile>
      <mat-grid-tile>13</mat-grid-tile>
      <mat-grid-tile>14</mat-grid-tile>
      <mat-grid-tile>15</mat-grid-tile>
      <mat-grid-tile>16</mat-grid-tile>
    </mat-grid-list>
    <iframe src="http://localhost:15672/#/channels" width="100%" height="500px"></iframe>
  `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {}
