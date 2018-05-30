/* Contacts Collection */
const contacts = {
    'Sunday James': {
        firstName: 'Sunday',
        lastName: 'James',
        phones: ['09000000980', '0809999542', '07033007634']
    },
    'James Kemi': {
        firstName: 'James',
        lastName: 'Kemi',
        email: 'jae@yahoo.com',
        phones: ['09033563201', '08042331174', '09033117943']
    },
    'Fashade Tunde': {
        firstName: 'Fashade',
        lastName: 'Tunde',
        email: 'faade@yahoo.com',
        phones: ['07055783218']
    },
    'Fadekemi Tunde': {
        firstName: 'Fadekemi',
        lastName: 'Tunde',
        email: 'faade@yahoo.com',
        phones: ['07051174008']
    },
    'Folake Bami': {
        firstName: 'Folake',
        lastName: 'Bami',
        email: 'faade@yahoo.com',
        phones: ['09054587216']
    },
    'John Femi': {
        firstName: 'John',
        lastName: 'Femi',
        email: 'faade@yahoo.com',
        phones: ['09052167943']
    },
};


/* Contact Class */
class Contact {
    constructor([firstName, lastName, email, phones]) {
        this.firstName = firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
        this.lastName = lastName[0].toUpperCase() + lastName.slice(1).toLowerCase();
        if (email) {
            this.email = email;
        }
        this.phones = phones.filter(item => item.length).map(item => item);
    }

    toString() {
        return `${this.firstName} ${this.lastName}`
    }
}


/* Query-select Elements */
const saveBtn = document.querySelector('button');
const addContactBtn = document.querySelector('#add-contact');
const editBtn = document.querySelector('#edit-contact');
const deleteBtn = document.querySelector('#delete-contact');
const searchInput = document.querySelector('#search');
const contactsList = document.querySelector('#contacts ul');
const newContactSection = document.querySelector('#new-contact');
const contactDetailSection = document.querySelector('#contact-detail');


/* Add Event Listeners */
saveBtn.addEventListener('click', saveNewContact);
addContactBtn.addEventListener('click', getNewContact);
editBtn.addEventListener('click', editContact);
deleteBtn.addEventListener('click', deleteContact);
searchInput.addEventListener('input', searchNames);
contactsList.addEventListener('click', showContactDetails);


/* Displays Available contacts */
displayContacts(Object.keys(contacts).sort());


/* Displays the form to get contact details */
function getNewContact({firstName = '', lastName = '', email = '', phones = ['']}) {
    newContactSection.style.display = '';           /* displays Contact Information Section */
    contactDetailSection.style.display = 'none';    /* hides Contact Details Section */

    document.forms['contact-form'].firstname.value = firstName;
    document.forms['contact-form'].lastname.value = lastName;
    document.forms['contact-form'].email.value = email;
    
    const phoneNumbers = document.querySelector('#phone-numbers');
    phoneNumbers.innerHTML = '';    //Emptys Initial content

    const phoneNumberLabel = document.createElement('label');
    phoneNumberLabel.innerText = 'Phone';
    phoneNumbers.appendChild(phoneNumberLabel);

    /* Puts each member of phones into an Input Element */
    phones.forEach(phoneNumber => {
        const newPhoneInput = document.createElement('input');
        newPhoneInput.setAttribute('type', 'number');
        newPhoneInput.setAttribute('name', 'phone');
        newPhoneInput.setAttribute('placeholder', 'Phone Number');
        newPhoneInput.value = phoneNumber;
        phoneNumbers.appendChild(newPhoneInput);
    });

    const addMore = document.createElement('a');
    addMore.setAttribute('href', '#');
    addMore.setAttribute('id', 'add-more');
    addMore.innerText = 'Add More...';
    addMore.addEventListener('click', addMorePhone);
    phoneNumbers.appendChild(addMore);
}


/* Adds one more phone input field to the form */
function addMorePhone(event) {
    const newPhoneInput = document.createElement('input');
    newPhoneInput.setAttribute('type', 'number');
    newPhoneInput.setAttribute('name', 'phone');
    newPhoneInput.setAttribute('placeholder', 'Phone Number');
    document.querySelector('#phone-numbers').insertBefore(newPhoneInput, document.querySelector('#add-more'));

    event.preventDefault();
}


/* Saves values in the form input fields as a Contact
   object and displays the contact details
*/ 
function saveNewContact(event) {
    const [firstNameInput, lastNameInput, emailInput, ...phonesInput] = document.querySelectorAll('form input');
    const [firstName, lastName, email, phones] = [firstNameInput.value.trim(), lastNameInput.value.trim(), emailInput.value.trim(), phonesInput.map( phone => phone.value.trim())]
    
    /* validates user inputs */
    const errorMessage = validateContactInputs([firstName, lastName, email, phones]);

    if (errorMessage) {     /* Displays error message if it exists during validation */
        document.querySelector('#error').innerText = errorMessage;
       setTimeout(() => { document.querySelector('#error').innerText = ''}, 3000);
    } else {    /* Checks whether there exits a contact with the same names */
        const doesContactNameExit = Object.keys(contacts).some(contact => contact.toLowerCase() === `${firstName} ${lastName}`.toLowerCase());
        
        /* If contact exists, prompts if it is to be replaced */
        if (!doesContactNameExit || confirm('This will replace another contact with the same names')) {
            const newContact = new Contact([firstName, lastName, email, phones]); /* Creates/replaces contact */
            contacts[newContact] = newContact;

            /* Displays the new contact details */
            displayContacts(Object.keys(contacts).sort(), newContact.toString());
        }
    }

    event.preventDefault();
};


/* Checks Inputs entered by the user and returns an error message if it exists */
function validateContactInputs([firstName, lastName, email, phones]) {
    if (!firstName) return 'Please supply first name';
        
    if (!lastName) return 'Please supply last name';

    if (email && !email.match(/^\w+@.*\.[A-Za-z]+$/)) return 'Please supply a valid email';
    
    const noneEmptyPhones = phones.filter( phone => phone.length);
    
    if (!noneEmptyPhones.length) return 'Please supply at least one valid phone number';

    if (!noneEmptyPhones.every(phone => phone.match(/^\+?\d{9,16}/))) return 'At least one phone number is invalid';
}


/* Displays contacts and hightlights the contact-name whose details is to be displayed */
function displayContacts(listOfContacts, highlightContactName = listOfContacts[0]) {

    contactsList.innerHTML = ''; /* Removes contacts already in display */

    /* *
     * Creates li for each contact name, groups the li's according to the first
     * character of the contact's name and hightlights the contact name whose
     * details is to be displayed.
     * */
    listOfContacts.forEach( (contactName, contactIndex) => {
        
        /*  Creates a new li group according to the first character of the contact's
         *  name if it hasn't already been created
         */
        if (!contactIndex || listOfContacts[contactIndex - 1][0] != contactName[0]) {
            const newGroupOfContactsLi = document.createElement('li');
            newGroupOfContactsLi.className = 'set';
            newGroupOfContactsLi.innerText = contactName[0];
            contactsList.appendChild(newGroupOfContactsLi);
        }

        /* creates a li and a elements with the contact's name as value */
        const li = document.createElement('li');
        const anchorElement = document.createElement('a');
       
        anchorElement.setAttribute('href', '#contact-detail');
        anchorElement.setAttribute('class', 'contact');
        anchorElement.innerText = contactName;
        anchorElement.id = (highlightContactName === contactName) ? 'highlight' : '';
        
        li.appendChild(anchorElement);
        contactsList.appendChild(li);
    });

    showHighligtedContactDetails();
}


/* Highlights the contact whose details is to be shown, then calls another function to show it */
function showContactDetails(event) {
    if (event.target.className !== 'contact') return;
    document.querySelector('#highlight').id = '';
    event.target.setAttribute('id', 'highlight');

    showHighligtedContactDetails();
}


/* Shows the details of the highlighted contact */
function showHighligtedContactDetails() {
    const contactDetailList = document.querySelector('#contact-detail ul');
    contactDetailList.innerHTML = ''; /* Clears away the details of an intial contact */

    /* If no contact is highlighted, hides the edit and delete bottons */
    if (!document.querySelector('#highlight')) {
        document.querySelector('#alter-btns').style.display = 'none';
        return;
    }

    const targetContactName = document.querySelector('#highlight').innerText;

    const targetContact = contacts[targetContactName];

    const name = document.createElement('li');
    name.innerText = `Name: ${targetContactName}`;
    contactDetailList.appendChild(name);
    
    if (targetContact.email) {
        const email = document.createElement('li');
        email.innerText = `Email: ${targetContact.email}`;
        contactDetailList.appendChild(email);
    }

    const phone = document.createElement('li');
    phone.innerHTML = targetContact.phones.reduce((previous, current, currentIndex) =>
        (`${previous} ${current}${(currentIndex === targetContact.phones.length - 1) ? '' : ','}`), 'Phone: ');

    contactDetailList.appendChild(phone);
    
    document.querySelector('#alter-btns').style.display = '';

    newContactSection.style.display = 'none';
    contactDetailSection.style.display = '';
}


/* Searches and displays the contacts with characters in the search field */ 
function searchNames(event) {
    const searchInputValue = document.querySelector('#search').value;
    if (searchInputValue) {
        displayContacts(
            Object.keys(contacts)
            .sort()
            .filter( (name) => name.toLowerCase()
                .includes(searchInputValue.toLowerCase())
            )
        );
    } else {
        displayContacts(Object.keys(contacts).sort());
    }
}


/* Edits the details of a contact */
function editContact(event) {
    const targetContactName = document.querySelector('#highlight').innerText;
    const targetContact = contacts[targetContactName];

    getNewContact(targetContact);
    
    delete contacts[targetContactName];

    event.preventDefault();
}


/* Deletes a contact */
function deleteContact(event) {
    if (confirm(`You are about to delete a contact, This can't be undone`)) {
        delete contacts[document.querySelector('#highlight').innerText];

        const searchInput = document.querySelector('#search').value;
        searchInput ? searchNames() : displayContacts(Object.keys(contacts).sort());
    }
    event.preventDefault();
}