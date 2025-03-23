
import React from 'react'
import {faker} from '@faker-js/faker';
import {Button, TableCell} from '@mui/material';
import { useState,useEffect } from 'react';

export default function Contacts() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactsList, setContactsList] = useState([])
  const handleGenerateFakeData = () => {
    setMessage("Generating fake data...");
    setLoading(true);
    const contacts: Array<object> = [];
    let firstName;
    let lastName;
    let email;
    for (let i = 0; i < 100; i++) {
      firstName = (faker.person.firstName as () => string)();
      lastName = (faker.person.lastName as () => string)();
      email = (faker.internet.email as () => string)();
      const contact = {
        firstname: firstName,
        lastname: lastName,
        email: email,
      };
      contacts.push(contact);
    }
    setContactsList(contacts);
    setMessage("Fake data generated.");
    setLoading(false);

  }
  
  return (
    <div >
      
      {/* generating area */}
      {(!loading || contactsList) && 
        <div>
          <h1>Contacts</h1>
          <p>{message}</p>
          <Button onClick={handleGenerateFakeData}>generate</Button>
          
          {contactsList && 
          <table>
            <thead>
                <tr>
                  <th>First Name</th>   
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
            </thead>
            {contactsList.map((contact,index)=>(
              <tr key={index}>
                <TableCell>{contact.firstname} </TableCell>
                <TableCell>{contact.lastname} </TableCell>
                <TableCell>{contact.email} </TableCell>
              </tr>
            ))}
          </table>}
        </div>
  }

    </div>
  )

}
