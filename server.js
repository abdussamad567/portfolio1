const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INQUIRIES_FILE = path.join(__dirname, 'inquiries.json');

// MIME types
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Ensure inquiries.json exists
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle Contact API Endpoint
  if (req.url === '/api/contact' && req.method === 'POST') {
    try {
      const data = await parseBody(req);
      const { name, email, project } = data;

      // Validation
      if (!name || !email || !project) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'All fields (name, email, project) are required.' }));
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(email);

      const inquiry = {
        id: 'inq_' + Date.now(),
        timestamp: new Date().toISOString(),
        name: name.trim(),
        contact: email.trim(),
        isEmail,
        project: project.trim(),
        targetRecipient: 'abdussamad5826@gmail.com',
        status: 'saved_locally'
      };

      // Check if Resend API Key is configured in environment
      const resendApiKey = process.env.RESEND_API_KEY;
      let emailDispatched = false;
      let deliveryNote = '';

      if (resendApiKey) {
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Portfolio Contact <onboarding@resend.dev>',
              to: ['abdussamad5826@gmail.com'],
              subject: `New Portfolio Inquiry from ${name}`,
              reply_to: isEmail ? email : undefined,
              html: `
                <h2>New Project Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Contact:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #111;">${project.replace(/\n/g, '<br>')}</blockquote>
                <p style="color:#888;font-size:12px;">Sent from Abdus Samad Portfolio</p>
              `
            })
          });

          if (resendResponse.ok) {
            inquiry.status = 'delivered_via_resend';
            emailDispatched = true;
            deliveryNote = 'Delivered directly to abdussamad5826@gmail.com via Resend.';
          }
        } catch (resendErr) {
          console.error('Resend delivery error:', resendErr.message);
        }
      }

      // If not dispatched via Resend, attempt direct delivery via FormSubmit to abdussamad5826@gmail.com
      if (!emailDispatched) {
        try {
          const fsRes = await fetch('https://formsubmit.co/ajax/abdussamad5826@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Referer': 'http://localhost:3000/',
              'Origin': 'http://localhost:3000/'
            },
            body: JSON.stringify({
              name,
              contact: email,
              message: project,
              _subject: `New Portfolio Inquiry from ${name}`
            })
          });

          const fsData = await fsRes.json();
          if (fsData.success === 'true' || fsData.success === true) {
            inquiry.status = 'delivered_via_formsubmit';
            emailDispatched = true;
            deliveryNote = 'Delivered directly to your Gmail inbox (abdussamad5826@gmail.com).';
          } else if (fsData.message && fsData.message.includes('Activation')) {
            inquiry.status = 'activation_email_sent';
            deliveryNote = "An activation link was just sent to abdussamad5826@gmail.com. Please open Gmail and click 'Activate Form' once to enable instant delivery!";
          }
        } catch (fsErr) {
          console.error('FormSubmit delivery attempt error:', fsErr.message);
        }
      }

      // Save inquiry to inquiries.json
      let currentInquiries = [];
      try {
        currentInquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
      } catch (e) {
        currentInquiries = [];
      }
      currentInquiries.unshift(inquiry);
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(currentInquiries, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        delivered: emailDispatched,
        savedLocally: true,
        recipient: 'abdussamad5826@gmail.com',
        message: deliveryNote || (emailDispatched
          ? 'Your inquiry has been successfully delivered to abdussamad5826@gmail.com.'
          : 'Your inquiry has been recorded and saved locally to inquiries.json.')
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Server error processing inquiry.' }));
    }
    return;
  }

  // Static File Serving
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio server live at http://localhost:${PORT}/`);
  console.log(`Contact submissions configured for: abdussamad5826@gmail.com`);
});
