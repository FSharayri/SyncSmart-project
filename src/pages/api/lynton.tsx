import type { NextApiRequest, NextApiResponse } from 'next'

// linting error ? not anymore . . .
interface Contact {
  firstname: string;
  lastname: string;
  email: string;
}



export default async function handler( req: NextApiRequest, res: NextApiResponse) {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts'
  const LyntonToken = process.env.HUBSPOT_LYNTON_TOKEN
  if (!LyntonToken) {
    res.status(500).json({ error: 'Lynton Token not found' })
    return
  }
  if (req.method === 'POST') {
    // Process a POST request
    const { SyncSmartList } = req.body as { SyncSmartList: Contact[] };
    if (!SyncSmartList) {
      res.status(400).json({ error: 'ContactsList not found in request body' })
      return
    }
    try{

    const LyntonList = await Promise.all(
      SyncSmartList.map(contact => 
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${LyntonToken}`,
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
    const failed = LyntonList.filter(res => !res.ok)
    if (failed.length > 0) {
      res.status(500).json({ error: 'Some contacts failed to upload' })
      return
    }
    res.status(200).json({ message: 'Contacts uploaded to Lynton successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Unable to upload contacts to Lynton' })
  } 
  
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}