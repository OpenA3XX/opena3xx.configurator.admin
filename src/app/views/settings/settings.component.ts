import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import {NgForm, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormComponent } from 'src/app/components/opena3xx-form-components/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/models/field.interface';
import * as _ from 'lodash';

@Component({
  selector: 'opena3xx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  @ViewChild(DynamicFormComponent) form!: DynamicFormComponent;


  dataLoaded: Boolean = false;
  settingsConfig: FieldConfig[] = []

  // settingsConfig: FieldConfig[] = [{
  //     type:"heading",
  //     label: "RabbitMQ Configuration"
  //   },
  //   {
  //     type: "input",
  //     label: "RabbitMQ Host Address",
  //     inputType: "text",
  //     name: "opena3xx-amqp-host",
  //     hint: "Rabbit MQ Host Address is the IP Address where RabbitMQ is running.",
  //     validations: [
  //       {
  //         name: "required",
  //         validator: Validators.required,
  //         message: "RabbitMQ Host is Required"
  //       },
  //       {
  //         name: "pattern",
  //         validator: Validators.pattern(/(localhost|\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?::\d{0,4})?\b)/),
  //         message: "Accept only IPv4 Address or localhost"
  //       }
  //     ]
  //   },
  //   {
  //     type: "input",
  //     label: "RabbitMQ Port",
  //     inputType: "text",
  //     name: "opena3xx-amqp-port",
  //     hint: "Rabbit MQ Port is the port which RabbitMQ is running on. Default is 5672",
  //     validations: [
  //       {
  //         name: "required",
  //         validator: Validators.required,
  //         message: "RabbitMQ Port is required"
  //       },
  //       {
  //         name: "pattern",
  //         validator: Validators.pattern(
  //           "^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$"
  //         ),
  //         message: "RabbitMQ Port is required: 1-65535"
  //       }
  //     ]
  //   },
  //   {
  //     type: "input",
  //     label: "RabbitMQ Username",
  //     inputType: "text",
  //     name: "opena3xx-amqp-username",
  //     hint: "Rabbit MQ Username used for authencation",
  //     validations: [
  //       {
  //         name: "required",
  //         validator: Validators.required,
  //         message: "RabbitMQ Username is required"
  //       }
  //     ]
  //   },
  //   {
  //     type: "input",
  //     label: "RabbitMQ Password",
  //     inputType: "password",
  //     name: "opena3xx-amqp-password",
  //     hint: "Rabbit MQ Password used for authencation",
  //     validations: [
  //       {
  //         name: "required",
  //         validator: Validators.required,
  //         message: "Password Required"
  //       }
  //     ]
  //   },
  //   {
  //     type: "input",
  //     label: "RabbitMQ Virtual Host",
  //     inputType: "text",
  //     name: "opena3xx-amqp-vhost",
  //     hint: "Rabbit MQ vhost used for authencation",
  //     validations: [
  //       {
  //         name: "required",
  //         validator: Validators.required,
  //         message: "RabbitMQ Virtual Host is Required"
  //       }
  //     ]
  //   },
  //   {
  //     type:"heading",
  //     label: "SEQ Configuration"
  //   },
  //   {
  //     type: "input",
  //     label: "SEQ Host Address",
  //     inputType: "text",
  //     name: "opena3xx-seq-host",
  //     hint: "SEQ IP Address",
  //     validations: [
  //       {
  //         name: "required",
  //         validator: Validators.required,
  //         message: "SEQ Host is Required"
  //       },
  //       {
  //         name: "pattern",
  //         validator: Validators.pattern(/(localhost|\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?::\d{0,4})?\b)/),
  //         message: "Accept only IPv4 Address or localhost"
  //       }
  //     ]
  //   },
  //   {
  //     type: "input",
  //     label: "SEQ Port",
  //     inputType: "text",
  //     name: "opena3xx-seq-port",
  //     hint: "SEQ Port",
  //     validations: [
  //       {
  //         name: "required",
  //         validator: Validators.required,
  //         message: "SEQ Port is required"
  //       },
  //       {
  //         name: "pattern",
  //         validator: Validators.pattern(
  //           "^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$"
  //         ),
  //         message: "SEQ Port is required: 1-65535"
  //       }
  //     ]
  //   },
  //   {
  //     type: "button",
  //     label: "Save All Settings"
  //   }
  // ];

  constructor
  (
    public dialog: MatDialog,
    private httpService: HttpService,
    private router: Router,
  ){

    this.httpService.getSettingsForm()
    .pipe(
      map(data_received => {
        this.settingsConfig = data_received as FieldConfig[];
        this.dataLoaded = true;
        console.log(this.settingsConfig);
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigateByUrl(`/`)
  }

  submit(value: any) {
    console.log(value);
  }
  
}



