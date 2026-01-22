# Data Contribution Feature Setup Guide

## Overview

The carbon calculator includes a feature that allows users to contribute their production data to the Sustainable Entertainment Alliance's benchmarking report. This document explains how to set up the email functionality.

## Features

- **Privacy-First**: Users must explicitly consent to data sharing
- **Optional Contact Info**: Users can choose whether to include their contact information
- **Professional Email**: Sends formatted HTML email with production data
- **Anonymization**: Production names are anonymized unless agreed otherwise

## Setup Instructions

### 1. Choose an Email Service

The API endpoint is configured to work with [Resend](https://resend.com), but you can use any email service:

- **Resend** (Recommended) - Modern, developer-friendly, generous free tier
- **SendGrid** - Enterprise-grade email service
- **AWS SES** - Amazon's email service
- **Mailgun** - Popular email API service

### 2. Sign Up for Resend (Recommended)

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your domain (or use their testing domain for development)
4. Get your API key from the dashboard

### 3. Configure Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key
   - **Environments**: Production, Preview, Development

4. Click **Save**

### 4. Configure Email Sender Domain

In the API file (`api/contribute-data.ts`), update the `from` email address:

```typescript
from: 'SEA Carbon Calculator <noreply@sustainableentertainmentalliance.org>',
```

**Important**: The domain must be verified in your Resend account. For testing, you can use:

```typescript
from: 'noreply@resend.dev', // Resend's testing domain
```

### 5. Test the Feature

1. Deploy your changes to Vercel
2. Go to the Dashboard page with some emissions data
3. Click "Contribute Your Data" button
4. Fill out the form and submit
5. Check that the email arrives at info@sustainableentertainmentalliance.org

### 6. Alternative Email Services

If you prefer not to use Resend, modify the `sendEmail` function in `/api/contribute-data.ts`:

#### Using SendGrid:

```typescript
async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: options.to }],
        subject: options.subject
      }],
      from: { email: 'noreply@yourdomain.com' },
      content: [{ type: 'text/html', value: options.html }],
      reply_to: { email: options.replyTo }
    })
  });

  return response.ok;
}
```

#### Using AWS SES:

```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

async function sendEmail(options: EmailOptions): Promise<boolean> {
  const client = new SESClient({ region: process.env.AWS_REGION });

  const command = new SendEmailCommand({
    Source: 'noreply@yourdomain.com',
    Destination: { ToAddresses: [options.to] },
    Message: {
      Subject: { Data: options.subject },
      Body: { Html: { Data: options.html } }
    },
    ReplyToAddresses: [options.replyTo]
  });

  try {
    await client.send(command);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
```

## Development Mode

If the `RESEND_API_KEY` environment variable is not set, the API will log the email details to the console instead of sending them. This is useful for local development.

To test locally:
1. Run `npm run dev`
2. The API endpoint will be available at `http://localhost:5173/api/contribute-data`
3. Email content will be logged to the server console

## Email Content

The email sent to SEA includes:

### Production Information
- Production name
- Production type
- Country
- Total shoot days
- Start/end dates

### Carbon Footprint Data
- Total emissions (kg CO₂e)
- Average per shoot day
- Total entries
- Modules with data

### Module Breakdown Table
- Module name
- Number of entries
- Emissions (kg CO₂e)
- Percentage of total

### Contact Information (Optional)
- Submitter name
- Submitter email
- Organization

## Privacy & Data Handling

### User Consent
Users must explicitly check a consent checkbox that states:
> "I understand that the Sustainable Entertainment Alliance will use this data for benchmarking purposes. Production names will be anonymized in published reports unless explicitly agreed otherwise. Data will be handled in accordance with SEA's privacy policy and will not be shared with third parties for commercial purposes."

### What Gets Shared
- **Always Shared**: Production carbon data, emissions breakdown
- **Optional**: Contact name, email, organization
- **Anonymized**: Production names in published reports

### Email Security
- Uses HTTPS for API calls
- API key stored as environment variable (not in code)
- Reply-to address included for follow-up

## Troubleshooting

### Email Not Sending
1. Check that `RESEND_API_KEY` is set in Vercel environment variables
2. Verify the domain is configured in Resend
3. Check Vercel function logs for errors
4. Ensure API endpoint is not blocked by CORS

### "Permission Denied" Error
- This usually means the API key is invalid or not set
- Re-generate the API key in Resend dashboard
- Update the environment variable in Vercel

### Email Going to Spam
- Verify your domain with SPF/DKIM records in Resend
- Use a verified domain (not resend.dev) for production
- Add email authentication records to your DNS

## Support

For questions or issues:
- Email: info@sustainableentertainmentalliance.org
- Technical issues: Check Vercel function logs in your dashboard

## Future Enhancements

Potential improvements:
- Batch submissions for multiple productions
- Automatic periodic reports
- Integration with SEA's data portal
- Confirmation email to submitter
- Data validation dashboard for SEA
