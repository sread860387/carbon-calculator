/**
 * Vercel Serverless Function - Contribute Data API
 * Sends production carbon data to SEA for benchmarking
 *
 * SETUP INSTRUCTIONS:
 * 1. Add environment variable in Vercel dashboard: RESEND_API_KEY
 * 2. Sign up at https://resend.com and get API key
 * 3. Configure the "from" email domain in Resend dashboard
 * 4. Or use any other email service (SendGrid, AWS SES, etc.)
 */

interface VercelRequest {
  method?: string;
  body: any;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
}

interface ContributeDataRequest {
  contactName: string;
  contactEmail: string;
  organization?: string;
  consentGiven: boolean;
  includeContactInfo: boolean;
  productionData: {
    productionName?: string;
    productionType?: string;
    country?: string;
    totalShootDays?: number;
    totalEmissions: number;
    moduleBreakdown: Array<{
      name: string;
      co2e: number;
      entries: number;
    }>;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data: ContributeDataRequest = req.body;

    // Validate required fields
    if (!data.contactName || !data.contactEmail || !data.consentGiven) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Build email content
    const emailBody = buildEmailContent(data);

    // Send email using Resend (or your preferred email service)
    const emailSent = await sendEmail({
      to: 'info@sustainableentertainmentalliance.org',
      subject: `Benchmarking Data Contribution - ${data.productionData.productionName || 'Production'}`,
      html: emailBody,
      replyTo: data.contactEmail
    });

    if (!emailSent) {
      throw new Error('Failed to send email');
    }

    return res.status(200).json({
      success: true,
      message: 'Data submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting contribution:', error);
    return res.status(500).json({
      error: 'Failed to submit data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function buildEmailContent(data: ContributeDataRequest): string {
  const { productionData, contactName, contactEmail, organization, includeContactInfo } = data;

  const modulesWithEmissions = productionData.moduleBreakdown.filter(m => m.co2e > 0);
  const totalEntries = modulesWithEmissions.reduce((sum, m) => sum + m.entries, 0);

  let html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #034334; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .section { margin-bottom: 30px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .data-table th { background-color: #034334; color: white; }
    .data-row { background-color: #f9f9f9; }
    .total-row { background-color: #e8f5e9; font-weight: bold; }
    .info-box { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Benchmarking Data Contribution</h1>
    <p>Carbon Calculator for Film & TV Production</p>
  </div>

  <div class="content">
    <div class="section">
      <h2>Submission Details</h2>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Consent Given:</strong> Yes</p>
    </div>
`;

  // Contact Information (if permitted)
  if (includeContactInfo) {
    html += `
    <div class="section">
      <h2>Contact Information</h2>
      <div class="info-box">
        <p><strong>Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${contactEmail}</p>
        ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
      </div>
    </div>
`;
  } else {
    html += `
    <div class="section">
      <p><em>Contact information not included per submitter preference.</em></p>
      <p><em>Reply-to email: ${contactEmail}</em></p>
    </div>
`;
  }

  // Production Data
  html += `
    <div class="section">
      <h2>Production Information</h2>
      <div class="info-box">
        ${productionData.productionName ? `<p><strong>Production Name:</strong> ${productionData.productionName}</p>` : ''}
        ${productionData.productionType ? `<p><strong>Production Type:</strong> ${productionData.productionType}</p>` : ''}
        ${productionData.country ? `<p><strong>Country:</strong> ${productionData.country}</p>` : ''}
        ${productionData.totalShootDays ? `<p><strong>Total Shoot Days:</strong> ${productionData.totalShootDays}</p>` : ''}
      </div>
    </div>

    <div class="section">
      <h2>Carbon Footprint Summary</h2>
      <div class="info-box">
        <p style="font-size: 24px; color: #034334; margin: 0;">
          <strong>${productionData.totalEmissions >= 1000
            ? `${(productionData.totalEmissions / 1000).toFixed(2)} tonnes CO₂e`
            : `${productionData.totalEmissions.toFixed(2)} kg CO₂e`
          }</strong>
        </p>
        ${productionData.totalShootDays ? `
          <p style="margin-top: 10px;">
            <strong>Average per Shoot Day:</strong>
            ${(productionData.totalEmissions / productionData.totalShootDays).toFixed(2)} kg CO₂e
          </p>
        ` : ''}
        <p><strong>Total Data Entries:</strong> ${totalEntries}</p>
        <p><strong>Modules with Data:</strong> ${modulesWithEmissions.length}</p>
      </div>
    </div>

    <div class="section">
      <h2>Emissions Breakdown by Module</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Entries</th>
            <th>Emissions (kg CO₂e)</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
`;

  modulesWithEmissions.forEach(module => {
    const percentage = ((module.co2e / productionData.totalEmissions) * 100).toFixed(1);
    html += `
          <tr class="data-row">
            <td>${module.name}</td>
            <td>${module.entries}</td>
            <td>${module.co2e.toFixed(2)}</td>
            <td>${percentage}%</td>
          </tr>
`;
  });

  html += `
          <tr class="total-row">
            <td>TOTAL</td>
            <td>${totalEntries}</td>
            <td>${productionData.totalEmissions.toFixed(2)}</td>
            <td>100.0%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" style="border-top: 2px solid #034334; padding-top: 20px;">
      <p><strong>Data Source:</strong> DEFRA 2023 Greenhouse Gas Reporting Conversion Factors</p>
      <p><strong>Calculator Version:</strong> 4.2.9</p>
    </div>
  </div>

  <div class="footer">
    <p>This data was submitted through the Carbon Calculator for Film & TV Production</p>
    <p>Sustainable Entertainment Alliance</p>
  </div>
</body>
</html>
`;

  return html;
}

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    // For development/testing, log the email instead
    console.log('Would send email:', {
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo,
      bodyLength: options.html.length
    });
    // Return true for development
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'SEA Carbon Calculator <noreply@sustainableentertainmentalliance.org>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
