import { Component, viewChild, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatUIComponent, UserModel, ChatUIModule, MessageModel } from '@syncfusion/ej2-angular-interactive-chat';
import { ToastComponent, ToastModule } from '@syncfusion/ej2-angular-notifications';
import { SpeechToTextModule, TranscriptChangedEventArgs, ErrorEventArgs, SpeechToTextComponent} from '@syncfusion/ej2-angular-inputs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ChatUIModule, SpeechToTextModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChatApp';

  @ViewChild('toast') toastInstance!: ToastComponent;
  @ViewChild('chatUI') chatUIInstance!: ChatUIComponent;
  @ViewChild('speechtotext') speechToTextInstance!: SpeechToTextComponent;

  private msgIdx: number = -1;

  public toastPosition = { X: 'Right'};
  public target = ".integration-control-section";

  public user: UserModel = { id: 'admin', user: 'Admin', avatarUrl: 'https://ej2.syncfusion.com/angular/demos/assets/chat-ui/images/andrew.png' };

  ngAfterViewInit(): void {
    this.setupFooterButtons();
  }
onTranscriptChange(args: TranscriptChangedEventArgs): void{
  const chatuiFooter = document.querySelector('#chatui-footer') as HTMLElement;
  if(chatuiFooter){
    chatuiFooter.innerText=args.transcript;
  }
}
  setupFooterButtons(): void {
    if (this.chatUIInstance) {
      const chatuiElement = this.chatUIInstance.element as HTMLElement;
      const chatuiFooter = chatuiElement.querySelector('#chatui-footer') as HTMLElement;
      const sendButton = chatuiElement.querySelector('#chatui-sendButton') as HTMLElement;

      sendButton.addEventListener('click', () => this.sendIconClicked());
      chatuiFooter.addEventListener('input', () => this.toggleButtons());
      chatuiFooter.addEventListener('keydown', (e) => this.onKeyDown(e));

      this.toggleButtons();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.sendIconClicked();
      event.preventDefault(); // Prevent the default behavior of the Enter key
    }
  }

onErrorHandler(args: ErrorEventArgs): void{
  const toastContent: string = args.errorMessage;
  if(args.error === 'unsupported-browser') {
    this.speechToTextInstance.disabled = true;
    this.toastInstance.show( { content: toastContent, timeOut: 0});
  }
  else {
    this.toastInstance.show( { content: toastContent, timeOut: 5000});
  }
}
  toggleButtons(): void {
    const chatuiFooter = document.querySelector('#chatui-footer') as HTMLElement;
    const sendButton = document.querySelector('#chatui-sendButton') as HTMLElement;
    const speechButton = document.querySelector('#speechtotext') as HTMLElement;

    const hasText = chatuiFooter.innerText.trim() !== '';
    sendButton.classList.toggle('visible', hasText);
    speechButton.classList.toggle('visible', !hasText);

    if (!hasText && (chatuiFooter.innerHTML.trim() === '' || chatuiFooter.innerHTML === '<br>')) {
      chatuiFooter.innerHTML = '';
    }
  }

  sendIconClicked(): void {
    const chatuiFooter = document.querySelector('#chatui-footer') as HTMLElement;
    const newMsg: MessageModel = { id: 'msg-' + (this.msgIdx + 1), text: chatuiFooter.innerText, author: this.user };
      this.chatUIInstance.addMessage(newMsg);
      chatuiFooter.innerText = ''
      this.toggleButtons();
  }
  public formatDate(messageDate: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCompare = new Date(messageDate);
    dateToCompare.setHours(0, 0, 0, 0);
    
    return dateToCompare.getTime() === today.getTime() ? 'Today' : messageDate.toDateString();
  }  
}
