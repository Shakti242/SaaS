// pages/api/webhook.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { verifySignature } from '@clerk/nextjs/api';
import { db } from '@/lib/db';  // Ensure your Prisma client is correctly imported

// This is the secret key used to verify Clerk's signatures
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || '';

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to read raw body
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("webhook call recieved")
    // Ensure that the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Get the raw body for signature verification
    const rawBody = (await buffer(req)).toString();

    // Get the signature from headers
    const signature = req.headers['clerk-signature'] as string;

    // Verify the signature
    try {
        verifySignature(CLERK_WEBHOOK_SECRET, rawBody, signature);
    } catch (err) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse the request body as JSON
    const event = JSON.parse(rawBody);

    // Handle the event
    if (event.type === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        try {
            // Update user information in your database
            await db.user.update({
                where: { clerkId: id },
                data: {
                    email: email_addresses[0].email_address,
                    name: `${first_name} ${last_name}`,
                    profileImage: image_url,
                },
            });

            return res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Handle other event types as necessary
    return res.status(200).json({ message: 'Unhandled event type' });
};

export default handler;
