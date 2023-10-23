import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  myForm!: FormGroup; 
  emailOpened = false;
  @ViewChild('f') submitForm!: NgForm;
  displayedData=''
  title="";

  constructor(private service : ApiService, private formBuilder: FormBuilder){}
  msg = '';
  // subForm !: FormGroup;
  
  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      tcase: [ '', Validators.required], // Set the default value to ''
      lang: [{ value: '', disabled: false }, Validators.required], // Disable the second control by default
      query: ['', Validators.required] 
    });
    // this.retrieve();

    // Subscribe to changes in the first control to enable/disable the second control
    this.myForm.get('tcase')?.valueChanges.subscribe((value) => {
      if (value === 'unit testing' || value === '') {
        this.myForm.get('lang')?.enable();
      } else {
        this.myForm.get('lang')?.disable();
        this.myForm.patchValue({ lang: '' }); // Clear the lang control text
      }
    });
  }

  part1= ''
  part2= ''
  part3= ''
  content = ''
  // isDisabled = false;

  showBufferAnimation: boolean = false;
  // bufferTimeout: any; 
  startBufferAnimation() {
    this.showBufferAnimation = true;
  }

  clearBufferAnimation() {
    this.showBufferAnimation = false;
    // clearTimeout(this.bufferTimeout);
  }
  onClick(){
    console.log('started===')
    this.service.send(this.submitForm['value']).subscribe(
      data =>{
        console.log("respose received");
        this.displayedData = data['text'];
        this.clearBufferAnimation();

        // this.router.navigate(['/'])
        switch(this.submitForm['value']['tcase']){
          case 'unit testing':
          case 'Functionality test case':
            const parts = this.displayedData.split("$$$",2);

            this.part1 = parts[1];
            this.part2 = parts[0].trimEnd();

            const bulk = this.part1.split("***");
            this.part1 = bulk[0];
            this.part3 = bulk[1];
            this.content = `Test Steps: \n${this.part1}\n**********************************************************************\n**********************************************************************\n\nTest Data in ${this.submitForm['value']['lang']} language:\n${this.part2}\n**********************************************************************\n**********************************************************************\n\nTest Results:\n${this.part3}\n`;

            break;
          case 'Performance test case':
            const comp = this.displayedData.split("$$$",2);
            
            this.part1 = comp[0];
            this.part2 = '';
            this.part3 = comp[1];
            this.content = `Test Steps: \n${this.part1}\n**********************************************************************\n**********************************************************************\n**********************************************************************\n\nTest Results:\n${this.part3}\n`;
            break;
          case 'UI test case':
          case 'Security test case':
          case 'Integration test case':
          case 'Database test case':
          case 'Usability test case':
          case 'User acceptance test case':
          case 'Regression test case':
            const dum = this.displayedData.split("$$$");

            this.part1 = dum[0];
            this.part2 = dum[1];
            this.part3 = dum[2];     
            this.content = `${this.part1}\n**********************************************************************\n**********************************************************************\n\n${this.part2}\n**********************************************************************\n**********************************************************************\n\n${this.part3}\n`;
            break;
          default:
        }
      },
      error => {
        console.log(error);
      }
    )
  } 


  downloadTextFile() {
    //if empty cant download
    // this.content = `Test Steps: \n${this.part1}\n**********************************************************************\n**********************************************************************\n\nTest Data in ${this.submitForm['value']['lang']}  language:\n${this.part2}\n**********************************************************************\n**********************************************************************\n\nTest Results:\n${this.part3}\n`;
    if(this.submitForm['value']['tcase'] == 'unit testing'){
      const fileName = `${this.submitForm['value']['query']} - Unit test case in ${this.submitForm['value']['lang']}.txt`;
      const blob = new Blob([this.content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, fileName);
    }else{
      const fileN = `${this.submitForm['value']['tcase']} - ${this.submitForm['value']['query']}.txt`;
      const bl = new Blob([this.content], { type: 'text/plain;charset=utf-8' });
      saveAs(bl, fileN);
    }
  }

  openEmail() {

    // console.log('displayedData:', this.displayedData);
    if (this.emailOpened) {
      return;
    }
    // const subject = `Test Steps: \n${this.part1}\n**********************************************************************\n**********************************************************************\n\nTest Data in ${this.submitForm['value']['lang']}  language:\n${this.part2}\n**********************************************************************\n**********************************************************************\n\nTest Results:\n${this.part3}\n`;
    // const subject= `${this.displayedData.split("$$$",2)}`;
    

    // const encodedSubject = encodeURIComponent(subject);
    // const mailtoLink = `mailto:?subject=${encodedSubject}`; 
  // Open the email client with the email link
    // window.location.href = mailtoLink;

  // Set a short timeout to prevent the email window from closing immediately
    // setTimeout(() => {
    //   this.emailOpened = true;
    // }, 500);
    
    // const subject= `${this.displayedData.split("$$$",2)}`;
    switch(this.submitForm['value']['tcase']){
      case 'unit testing':
        const [functionCode, testCaseInfo] = this.displayedData.split("$$$");
        const subject = `Test Case: ${testCaseInfo}`;

        const encodedSubject = encodeURIComponent(subject);
        const mailtoUrl = `mailto:?subject=${encodedSubject}`;
        setTimeout(() => {
          const emailWindow = window.open(mailtoUrl, '_blank');
          if (emailWindow) {
            this.emailOpened = true;
            emailWindow.onbeforeunload = () => {
              this.emailOpened = false;
            };
          }
        }, 100);
        break;
      case 'Functionality test case':
        const sub = `this.displayedData.split("$$$",2)`;
        const testCaseNameRege = /Test Case Name: (.+)/;
        const testCaseNameMatc = sub.match(testCaseNameRege);
        const testCaseNam = testCaseNameMatc ? testCaseNameMatc[1] : "No Test Case Name Found";
        const subje = `Test Case: ${testCaseNam}`;

        const encodedSubje = encodeURIComponent(subje);
        const mailtoU = `mailto:?subject=${encodedSubje}`;
        setTimeout(() => {
          const emailWindow = window.open(mailtoU, '_blank');
          if (emailWindow) {
            this.emailOpened = true;
            emailWindow.onbeforeunload = () => {
              this.emailOpened = false;
            };
          }
        }, 100);
        break;
      case 'Performance test case':
      case 'UI test case':
      case 'Security test case':
      case 'Integration test case':
      case 'Database test case':
      case 'Usability test case':
      case 'User acceptance test case':
      case 'Regression test case':
        const testCaseNameRegex = /Test Case Name: (.+)/;
        const testCaseNameMatch = this.displayedData.match(testCaseNameRegex);
        const testCaseName = testCaseNameMatch ? testCaseNameMatch[1] : "Functionality test case";
        const subjec = `Test Case: ${testCaseName}`;
        const encodedSubjec = encodeURIComponent(subjec);
        const mailtoUr = `mailto:?subject=${encodedSubjec}`;
        setTimeout(() => {
          const emailWindow = window.open(mailtoUr, '_blank');
          if (emailWindow) {
            this.emailOpened = true;
            emailWindow.onbeforeunload = () => {
              this.emailOpened = false;
            };
          }
        }, 100);
        break;
      default:
        const subj = `Hi there!`;

        const encodedSubj = encodeURIComponent(subj);
        const mailto = `mailto:?subject=${encodedSubj}`;
        setTimeout(() => {
          const emailWindow = window.open(mailto, '_blank');
          if (emailWindow) {
            this.emailOpened = true;
            emailWindow.onbeforeunload = () => {
              this.emailOpened = false;
            };
          }
        }, 100);
    }
    
    
  }


  // isSecondControlDisabled() {
  //   return this.myForm.get('tcase')?.value !== 'unit testing';
  // }
}
