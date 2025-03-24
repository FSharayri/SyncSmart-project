import type { NextApiRequest, NextApiResponse } from 'next'

// linting error ? not anymore . . .
interface Contact {
  firstName: string;
  lastName: string;
  email: string;
}
interface RequestBody {
  contacts: Contact[];
}


export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts'
  const SyncSmartToken = process.env.SYNCSMART_TOKEN
  if (!SyncSmartToken) {
    res.status(500).json({ error: 'SyncSmart Token not found' })
    return
  }
  if (req.method === 'POST') {
    // Process a POST request
    const { contacts } = req.body as RequestBody;
    if (!contacts) {
      res.status(400).json({ error: 'Contacts not found in request body' })
      return
    }
    try{
    const SyncSmartList = await Promise.all(
      contacts.map(contact => 
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SyncSmartToken}`,
          },
          body: JSON.stringify({
            properties: {
              firstname: contact.firstName,
              lastname: contact.lastName,
              email: contact.email,
            },
          }),
        })
      )
    )
    const failed = SyncSmartList.filter(res => !res.ok)
    if (failed.length > 0) {
      res.status(500).json({ error: 'Some contacts failed to upload' })
      return
    }
    res.status(200).json({ message: 'Contacts uploaded to SyncSmart successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Unable to upload contacts to SyncSmart' })
  } 
  }else if (req.method === 'GET') {
    // Process a GET request
    try {
      const response = await fetch(url + '?limit=100&sort=-createdate', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SyncSmartToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching contacts: ${response.statusText}`);
      }
      const data = await response.json() as { results: Contact[] };
      console.log("Latest 100 contacts:", data.results.slice(0,5));
      return data.results;
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
    
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}