export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Verify Your Email - Hostel Finder</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      line-height: 1.6;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .header {
      background: linear-gradient(135deg, #3A2C99 0%, #5B4BCC 100%);
      padding: 30px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }

    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-decoration: none;
    }

    .main-content {
      padding: 40px 30px;
      color: #334155;
    }

    .otp-container {
      background: #f1f5f9;
      border: 2px dashed #3A2C99;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }

    .otp-code {
      font-size: 32px;
      font-weight: 700;
      color: #3A2C99;
      letter-spacing: 4px;
      margin: 0;
    }

    .footer {
      background: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    .footer-link {
      color: #3A2C99;
      text-decoration: none;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 95% !important;
        margin: 20px auto !important;
      }
      
      .header, .main-content, .footer {
        padding: 20px !important;
      }
      
      .otp-code {
        font-size: 24px !important;
        letter-spacing: 2px !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#f8fafc">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <!-- Header with Logo -->
              <tr>
                <td class="header">
                  <img src="{{logo}}" alt="Hostel Finder" style="height: 50px; width: auto; margin-bottom: 10px;" />
                  <h1 class="logo">Hostel Finder</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td class="main-content">
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1e293b;">
                    Verify Your Email Address
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Welcome to Hostel Finder! You're just one step away from accessing your account.
                  </p>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Please use the verification code below to complete your registration for: 
                    <strong style="color: #3A2C99;">{{email}}</strong>
                  </p>
                  
                  <div class="otp-container">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b; font-weight: 500;">
                      Your verification code:
                    </p>
                    <p class="otp-code">{{otp}}</p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    ⏰ This code will expire in 24 hours for security reasons.
                  </p>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    If you didn't create an account with Hostel Finder, please ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p class="footer-text">
                    This email was sent by <a href="{{website}}" class="footer-link">Hostel Finder</a><br>
                    Need help? Contact us at <a href="mailto:{{supportEmail}}" class="footer-link">{{supportEmail}}</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`

export const STUDENT_CONTACT_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>New Student Inquiry</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #3A2C99;
      text-decoration: none;
      display: inline-block;
      padding: 12px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    .info-box {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      padding: 15px;
      margin: 15px 0;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold; color: #3A2C99;">
                          🏠 New Student Inquiry for Your Property
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          A student has shown interest in your property listing!
                        </td>
                      </tr>
                      <tr>
                        <td class="info-box">
                          <div style="font-weight: bold; margin-bottom: 10px;">Property Details:</div>
                          <div><strong>Property:</strong> {{propertyHeading}}</div>
                          <div><strong>Location:</strong> {{propertyCity}}</div>
                          <div><strong>Rent:</strong> ₹{{propertyRent}}</div>
                        </td>
                      </tr>
                      <tr>
                        <td class="info-box">
                          <div style="font-weight: bold; margin-bottom: 10px;">Student Details:</div>
                          <div><strong>Name:</strong> {{studentName}}</div>
                          <div><strong>Email:</strong> {{studentEmail}}</div>
                          <div><strong>Phone:</strong> {{studentPhone}}</div>
                          <div><strong>Message:</strong> {{message}}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Please contact the student to discuss further details.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <a href="mailto:{{studentEmail}}" class="button">Reply to Student</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          You can also call them at {{studentPhone}} or reply to this email.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const OWNER_CONTACT_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Owner Contacted You</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #3A2C99;
      text-decoration: none;
      display: inline-block;
      padding: 12px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    .info-box {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      padding: 15px;
      margin: 15px 0;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold; color: #3A2C99;">
                          📞 Owner Contacted You About Your Inquiry
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          The property owner has reached out to you regarding your inquiry!
                        </td>
                      </tr>
                      <tr>
                        <td class="info-box">
                          <div style="font-weight: bold; margin-bottom: 10px;">Property Details:</div>
                          <div><strong>Property:</strong> {{propertyHeading}}</div>
                          <div><strong>Location:</strong> {{propertyCity}}</div>
                          <div><strong>Rent:</strong> ₹{{propertyRent}}</div>
                        </td>
                      </tr>
                      <tr>
                        <td class="info-box">
                          <div style="font-weight: bold; margin-bottom: 10px;">Owner Details:</div>
                          <div><strong>Name:</strong> {{ownerName}}</div>
                          <div><strong>Email:</strong> {{ownerEmail}}</div>
                          <div><strong>Phone:</strong> {{ownerPhone}}</div>
                          <div><strong>Contact Method:</strong> {{contactMethod}}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Please check your messages or expect a call/message from the owner.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <a href="mailto:{{ownerEmail}}" class="button">Contact Owner</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          You can also call them at {{ownerPhone}} or reply to this email.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const PROPERTY_VERIFICATION_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Property Verification Request - Hostel Finder</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      line-height: 1.6;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      padding: 30px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }

    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-decoration: none;
    }

    .main-content {
      padding: 40px 30px;
      color: #334155;
    }

    .property-info {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .property-details {
      font-size: 16px;
      color: #92400e;
      margin: 5px 0;
    }

    .status-badge {
      display: inline-block;
      background: #f59e0b;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin: 10px 0;
    }

    .footer {
      background: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    .footer-link {
      color: #3A2C99;
      text-decoration: none;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 95% !important;
        margin: 20px auto !important;
      }
      
      .header, .main-content, .footer {
        padding: 20px !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#f8fafc">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <!-- Header with Logo -->
              <tr>
                <td class="header">
                  <img src="{{logo}}" alt="Hostel Finder" style="height: 50px; width: auto; margin-bottom: 10px;" />
                  <h1 class="logo">Hostel Finder</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td class="main-content">
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1e293b;">
                    Property Verification Request
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Hello <strong>{{ownerName}}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Your property has been submitted for verification. Our team will review it and get back to you soon.
                  </p>
                  
                  <div class="property-info">
                    <div class="status-badge">Under Review</div>
                    <div class="property-details"><strong>Property:</strong> {{propertyTitle}}</div>
                    <div class="property-details"><strong>Location:</strong> {{propertyLocation}}</div>
                    <div class="property-details"><strong>Rent:</strong> ₹{{propertyRent}}</div>
                    <div class="property-details"><strong>Submitted:</strong> {{submissionDate}}</div>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    ⏰ Verification typically takes 24-48 hours. You'll receive an email once the review is complete.
                  </p>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    Thank you for choosing Hostel Finder!
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p class="footer-text">
                    This email was sent by <a href="{{website}}" class="footer-link">Hostel Finder</a><br>
                    Need help? Contact us at <a href="mailto:{{supportEmail}}" class="footer-link">{{supportEmail}}</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const ADMIN_PROPERTY_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>New Property Request - Hostel Finder Admin</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      line-height: 1.6;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .header {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      padding: 30px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }

    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-decoration: none;
    }

    .main-content {
      padding: 40px 30px;
      color: #334155;
    }

    .property-info {
      background: #fef2f2;
      border: 2px solid #dc2626;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .property-details {
      font-size: 16px;
      color: #991b1b;
      margin: 5px 0;
    }

    .status-badge {
      display: inline-block;
      background: #dc2626;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin: 10px 0;
    }

    .cta-button {
      display: inline-block;
      background: #dc2626;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }

    .footer {
      background: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    .footer-link {
      color: #3A2C99;
      text-decoration: none;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 95% !important;
        margin: 20px auto !important;
      }
      
      .header, .main-content, .footer {
        padding: 20px !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#f8fafc">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <!-- Header with Logo -->
              <tr>
                <td class="header">
                  <img src="{{logo}}" alt="Hostel Finder" style="height: 50px; width: auto; margin-bottom: 10px;" />
                  <h1 class="logo">Admin Alert</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td class="main-content">
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1e293b;">
                    🚨 New Property Verification Request
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Hello Admin,
                  </p>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    A new property has been submitted for verification and requires your review and approval.
                  </p>
                  
                  <div class="property-info">
                    <div class="status-badge">⚠️ Pending Review</div>
                    <div class="property-details"><strong>Property:</strong> {{propertyTitle}}</div>
                    <div class="property-details"><strong>Type:</strong> {{propertyType}}</div>
                    <div class="property-details"><strong>Location:</strong> {{propertyLocation}}</div>
                    <div class="property-details"><strong>Rent:</strong> ₹{{propertyRent}}</div>
                    <div class="property-details"><strong>Owner:</strong> {{ownerName}} ({{ownerEmail}})</div>
                    <div class="property-details"><strong>Submitted:</strong> {{submissionDate}}</div>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="{{adminPanelUrl}}" class="cta-button">Review & Approve Property</a>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    ⏰ Please review this property listing and take appropriate action (approve/reject) as soon as possible.
                  </p>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    You can also access the admin panel directly to manage all pending properties.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p class="footer-text">
                    This email was sent by <a href="{{website}}" class="footer-link">Hostel Finder Admin System</a><br>
                    Admin Panel: <a href="{{adminPanelUrl}}" class="footer-link">{{adminPanelUrl}}</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const PROPERTY_APPROVED_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Property Approved - Hostel Finder</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      line-height: 1.6;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .header {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      padding: 30px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }

    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-decoration: none;
    }

    .main-content {
      padding: 40px 30px;
      color: #334155;
    }

    .property-info {
      background: #d1fae5;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .property-details {
      font-size: 16px;
      color: #065f46;
      margin: 5px 0;
    }

    .status-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin: 10px 0;
    }

    .cta-button {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }

    .footer {
      background: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    .footer-link {
      color: #3A2C99;
      text-decoration: none;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 95% !important;
        margin: 20px auto !important;
      }
      
      .header, .main-content, .footer {
        padding: 20px !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#f8fafc">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <!-- Header with Logo -->
              <tr>
                <td class="header">
                  <img src="{{logo}}" alt="Hostel Finder" style="height: 50px; width: auto; margin-bottom: 10px;" />
                  <h1 class="logo">Hostel Finder</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td class="main-content">
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1e293b;">
                    🎉 Congratulations! Your Property is Approved
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Hello <strong>{{ownerName}}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Great news! Your property has been approved and is now live on Hostel Finder. Students can now view and contact you about your property.
                  </p>
                  
                  <div class="property-info">
                    <div class="status-badge">✅ Approved & Live</div>
                    <div class="property-details"><strong>Property:</strong> {{propertyTitle}}</div>
                    <div class="property-details"><strong>Location:</strong> {{propertyLocation}}</div>
                    <div class="property-details"><strong>Rent:</strong> ₹{{propertyRent}}</div>
                    <div class="property-details"><strong>Approved:</strong> {{approvalDate}}</div>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="{{propertyUrl}}" class="cta-button">View Your Property</a>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    💡 <strong>Pro Tip:</strong> Keep your property details updated and respond quickly to student inquiries for better visibility.
                  </p>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    Thank you for being part of Hostel Finder!
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p class="footer-text">
                    This email was sent by <a href="{{website}}" class="footer-link">Hostel Finder</a><br>
                    Need help? Contact us at <a href="mailto:{{supportEmail}}" class="footer-link">{{supportEmail}}</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Reset Your Password - Hostel Finder</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      line-height: 1.6;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .header {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      padding: 30px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }

    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-decoration: none;
    }

    .main-content {
      padding: 40px 30px;
      color: #334155;
    }

    .otp-container {
      background: #fef2f2;
      border: 2px dashed #dc2626;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }

    .otp-code {
      font-size: 32px;
      font-weight: 700;
      color: #dc2626;
      letter-spacing: 4px;
      margin: 0;
    }

    .footer {
      background: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-radius: 0 0 12px 12px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    .footer-link {
      color: #3A2C99;
      text-decoration: none;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 95% !important;
        margin: 20px auto !important;
      }
      
      .header, .main-content, .footer {
        padding: 20px !important;
      }
      
      .otp-code {
        font-size: 24px !important;
        letter-spacing: 2px !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#f8fafc">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <!-- Header with Logo -->
              <tr>
                <td class="header">
                  <img src="{{logo}}" alt="Hostel Finder" style="height: 50px; width: auto; margin-bottom: 10px;" />
                  <h1 class="logo">Hostel Finder</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td class="main-content">
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #1e293b;">
                    Reset Your Password
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    We received a request to reset your password for your Hostel Finder account.
                  </p>
                  
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
                    Account: <strong style="color: #3A2C99;">{{email}}</strong>
                  </p>
                  
                  <div class="otp-container">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b; font-weight: 500;">
                      Your password reset code:
                    </p>
                    <p class="otp-code">{{otp}}</p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    ⚠️ This code will expire in 15 minutes for security reasons.
                  </p>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
                    If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p class="footer-text">
                    This email was sent by <a href="{{website}}" class="footer-link">Hostel Finder</a><br>
                    Need help? Contact us at <a href="mailto:{{supportEmail}}" class="footer-link">{{supportEmail}}</a>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

