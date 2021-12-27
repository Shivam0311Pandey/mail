document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  console.log('Hello');  

  document.querySelector('#compose-form').onsubmit = () =>{
    // Get the compose content
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    event.preventDefault();
    fetch('/emails',{
      method: 'POST',
      body: JSON.stringify({
        'recipients': recipients,
        'subject' : subject,
        'body' : body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      if(result.message){
        load_mailbox('sent');
      } else{
        document.querySelector('.error_message').innerHTML= result.error;
      }
    });
  };
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show the content
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails=>{
    console.log(emails);
    emails.forEach(displayContent);
  });
}

function displayContent(content){
  
  // Show the content box
  const element = document.createElement('div');
  element.className = 'dropbox_content_box';
  element.innerHTML = `<span class='sender'>${content.sender}</span> &nbsp <span>${content.subject}</span><span class='timestamp'>${content.timestamp}</span>`;
  if(!`${content.read}`){
    document.querySelector('.dropbox_content_box').style.backgroundColor = '#f8f8f8';
  }
  document.querySelector('.mailbox_content').append(element);
  element.onclick = () =>{
    console.log(`${content.id}`);
  };
}
