import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_wuh8fnj';
  private templateId = 'template_20dmy9d';
  private publicKey = '3T80zoyTojTmcfN3v';

  constructor() {}

  sendEmail(data: {
    user_name: string;
    user_email: string;
    course_title: string;
  }): Observable<EmailJSResponseStatus> {
    const payload = {
      user_name: data.user_name,
      user_email: data.user_email,
      course_title: data.course_title
    };

    return from(
      emailjs.send(this.serviceId, this.templateId, payload, this.publicKey)
    );
  }
}
