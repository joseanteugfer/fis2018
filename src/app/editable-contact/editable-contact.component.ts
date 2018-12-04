import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: '[app-editable-contact]',
  templateUrl: './editable-contact.component.html',
  styleUrls: ['./editable-contact.component.css']
})
export class EditableContactComponent implements OnInit {

  @Input() contact: Contact;

  constructor(private contactService: ContactService) { }

  editing = false;

  onEdit(){
    if (this.editing) {
      this.contactService.updateContact(this.contact)
         .subscribe(() => this.editing = !this.editing);
    } else {
      this.editing = ! this.editing;
    }
  }

  ngOnInit() {
  }

}
