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
  document.querySelector('#compose-body').value = '';  

  document.querySelector('.mailbox_content').innerHTML=" ";
  document.querySelector('.view_content').innerHTML=" ";


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';

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
  
  document.querySelector('.mailbox_content').innerHTML=" ";
  document.querySelector('.view_content').innerHTML=" ";

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
  element.setAttribute('data-id', `${content.id}`);
  document.querySelector('.mailbox_content').append(element);
  if(`${content.read}`){
    document.querySelector('.dropbox_content_box').style.backgroundColor = '#f8f8f8';
  }
  element.onclick = viewContent;
  //() =>{console.log(`${content.id}`);}; 
}

function viewContent(){
  const id = parseInt(this.dataset.id);
  console.log(id);
  fetch(`/emails/${id}`,{
    method: 'PUT',
    body: JSON.stringify({
      "read": true
    })
  })
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email =>{
    document.querySelector('.mailbox_content').innerHTML=" ";
    document.querySelector('#emails-view').style.display = 'none';
    const element = document.querySelector('.view_content');
    const firstPart = document.createElement('div');
    firstPart.innerHTML=`<div><b>From:</b> ${email.sender}</div><div><b>To:</b> ${email.recipients}</div><div><b>Subject:</b> ${email.subject}</div><div><b>Timestamp:</b> ${email.timestamp}</div>`;
    const secondPart = document.createElement('div');
    secondPart.innerHTML = `<button class='btn btn-sm btn-outline-primary'>Reply</button>`;
    const thirdPart = document.createElement('div');
    thirdPart.innerHTML=`<hr>${email.body}`;
    element.append(firstPart);
    element.append(secondPart);
    element.append(thirdPart);
  });
}
