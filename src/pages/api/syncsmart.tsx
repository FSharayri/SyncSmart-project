import type { NextApiRequest, NextApiResponse } from 'next'

// linting error ? not anymore . . .
interface Contact {
  firstname: string;
  lastname: string;
  email: string;
}



export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts'
  const SyncSmartToken = process.env.HUBSPOT_SYNCSMART_TOKEN
  if (!SyncSmartToken) {
    res.status(500).json({ error: 'SyncSmart Token not found' })
    return
  }
  if (req.method === 'POST') {
    // Process a POST request
    const { contactsList } = req.body as { contactsList: Contact[] };
    if (!contactsList) {
      res.status(400).json({ error: 'ContactsList not found in request body' })
      return
    }
    try{
    const SyncSmartList = await Promise.all(
      contactsList.map(contact => 
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SyncSmartToken}`,
          },
          body: JSON.stringify({
            properties: {
              firstname: contact.firstname,
              lastname: contact.lastname,
              email: contact.email,
            },
          })
        })
      )
    )
    const failed = SyncSmartList.filter(res => !res.ok)
    if (failed.length > 0) {
      res.status(500).json({ error: 'Some contacts failed to upload' })
      return
    }
    res.status(200).json({ message: 'Contacts uploaded to SyncSmart successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Unable to upload contacts to SyncSmart', err  })
  } 
  }else if (req.method === 'GET') {
    // Process a GET request
    try {
      // simple solution to a problem with the data duplication, fetching the most recently created 100 contacts is more accurate because those are the contacts that were generated from a fake data library and uploaded to SyncSmart
      const response = await fetch(url + '/search', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SyncSmartToken}`,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          limit:100,
          sorts: [
            {
              propertyName: 'createdate',
              direction: 'DESCENDING',
            },
          ],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching contacts: ${response.statusText}`);
      }
      const data = await response.json() as { results: Contact[] };
      
      console.log("Latest 100 contacts:", data.results.slice(0,5));
      res.status(200).json(data.results); 
      
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}