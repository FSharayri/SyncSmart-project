import React from 'react'
import { Button, Table, TableCell, CircularProgress } from '@mui/material'
import { useState } from 'react'
import type {Faker} from '@faker-js/faker' 
import {faker} from '@faker-js/faker' 
interface Contact {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Contacts() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [contactsList, setContactsList] = useState([])
  const [SyncSmartList, setSyncSmartList] = useState([])
  const [LyntonList, setLyntonList] = useState([])
  const [syncsmartpostreq, setSyncSmartPostReq] = useState(false)
  const [lyntonpostreq, setLyntonPostReq] = useState(false)

  const handleGenerateFakeData = () => {
    setMessage("Generating fake data...")
    setLoading(true)
    const contacts: Array<object> = []
    let firstName, lastName, email
    for (let i = 0; i < 100; i++) {
      firstName = (faker.person.firstName as () => string)()
      lastName = (faker.person.lastName as () => string)()
      email = (faker.internet.email as () => string)()
      const contact = {
        firstname: firstName,
        lastname: lastName,
        email: email,
      }
      contacts.push(contact)
    }
    setContactsList(contacts as [])
    setMessage("Fake data generated.")
    setLoading(false)
  }

  const handleUploadtoSyncSmart = async () => {
    setMessage("Uploading contacts to SyncSmart...")
    setLoading(true)
    try {
      const res = await fetch('/api/syncsmart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ contactsList }),
      })
      if (res.ok) {
        setMessage("Contacts uploaded to SyncSmart successfully.")
        setSyncSmartPostReq(true)
      } else {
        setMessage("Unable to upload contacts to SyncSmart endpoint.")
      }
    } catch (error) {
      setMessage("Unable to complete POST Request (SyncSmart): " + (error as string))
      console.error('Request Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlefetchSyncSmart = async () => {
    setMessage("Fetching contacts from SyncSmart...")
    setLoading(true)
    try {
      const res = await fetch('/api/syncsmart', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json() as Contact[]
        setSyncSmartList(data as [])
        setMessage("Contacts fetched from SyncSmart successfully.")
      } else {
        setMessage("Unable to fetch contacts from SyncSmart endpoint.")
      }
    } catch (error) {
      setMessage("Unable to complete fetch Request (SyncSmart):" + (error as string))
      console.error('Request Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ height:'5vh', alignItems:'center', justifyContent:'center',display:'flex', flexDirection:'row', gap:'1rem'}}>
        <p style={{ display:'inline' }} >{message}</p>
        <p style={{ display:'inline'}} >{loading && <CircularProgress size={10}/>}</p>
      </div>
      {/* Flex container for the three sections */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
        {/* Generate Fake Contacts */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
          <h1>Generate Fake Contacts</h1>
          <Button  variant="contained" onClick={handleGenerateFakeData} disabled={loading || contactsList.length>0}>Generate {contactsList.length>0? '✅':''}</Button>
          {contactsList[0] && 
            <Table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {contactsList.map((contact, index) => (
                  <tr key={index}>
                    <TableCell>{contact.firstname}</TableCell>
                    <TableCell>{contact.lastname}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          }
        </div>
        {/* SyncSmart */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
          <h1>SyncSmart</h1>
          <Button variant="contained" onClick={handleUploadtoSyncSmart} disabled={loading || syncsmartpostreq}>Upload to SyncSmart {syncsmartpostreq? '✅':''}</Button>
          <Button variant="contained" onClick={handlefetchSyncSmart} disabled={loading || SyncSmartList.length>0}>Fetch contacts from SyncSmart {SyncSmartList.length>0? '✅':''}</Button>
          {SyncSmartList[0] && 
            <Table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {SyncSmartList.map((contact, index) => (
                  <tr key={index}>
                    <TableCell>{contact.properties.firstname}</TableCell>
                    <TableCell>{contact.properties.lastname}</TableCell>
                    <TableCell>{contact.properties.email}</TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          }
        </div>
        {/* Lynton */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
          <h1>Lynton</h1>
          {/* <Button onClick={handleUploadtoLynton}>Upload to Lynton</Button> */}
        </div>
      </div>
    </div>
  )
}