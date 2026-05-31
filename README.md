# [Your Band Name] Carnival Registration — Template Guide

This guide explains how to update and maintain the Carnival registration system each year. No coding required for most tasks — the Admin Dashboard handles content updates through a point-and-click interface.

---

## Quick Start (New Year Setup)

To get a fresh registration form up and running for a new year:

- **Open `admin.html` in your browser** (no internet or server required — just double-click the file) and use the tabs to update the year, theme, costume names, prices, and photos.
- **Replace costume and add-on photos** using the Upload buttons in the admin dashboard — use JPEG or PNG files, recommended size 800×1000px or larger.
- **Update your integrations** (EmailJS, Formspree, Google Sheets URLs) under the Integrations tab if you have new accounts or new sheet URLs for the new year.
- **Export the config** from admin.html and commit all updated files — including any new images — to your GitHub repository.
- **Test a full registration** from start to finish to confirm emails send, the Google Sheet logs the entry, and the form looks correct on mobile.

---

## File Overview

| File | Purpose | When to edit |
|---|---|---|
| `index.html` | The live, deployed registration form for the current year | Do not edit directly — use `admin.html` or update `registration-template.html` instead |
| `registration-template.html` | Reusable template with a `SITE_CONFIG` block at the top for all customizable values | Starting point for each new year; copy and rename for a new season |
| `admin.html` | Browser-based dashboard for updating content without touching code | Every time you need to change text, prices, photos, or integration keys |
| `email-template.html` | The HTML design for confirmation emails sent via EmailJS | When you want to update the look or wording of your confirmation email |

---

## Using the Admin Dashboard

The admin dashboard (`admin.html`) lets you manage all form content visually. You do not need a web server — just open the file directly in Chrome, Firefox, or Safari.

### Opening admin.html

1. Navigate to your project folder on your computer.
2. Double-click `admin.html` — it opens in your default browser.
3. You will see a tabbed interface with sections for each part of the form.
4. Changes are previewed live as you type.

### Tab-by-Tab Walkthrough

**Event Info**
Update the band name, year, event theme, subtitle, and any introductory text shown at the top of the registration form. This is also where you set the lookbook PDF link.

**Costumes**
Add or edit costume sections (Girls Backline, Boys Backline, Girls Frontline, Boys Frontline, Girls Ultra, Boys Ultra). For each costume you can set:
- Costume name and description
- Price
- "Includes" description (e.g., "Includes headpiece, bodice, and shorts")
- Photo (upload or enter a filename)

**Add-Ons**
Manage optional add-ons (backpacks, capes, flags, shoes, etc.). Each add-on has a name, price, and photo.

**Parent Apparel**
Set t-shirt and jersey options, sizes, and prices for parent/adult apparel.

**Promo Codes**
Add or update discount codes. Set the code string, discount amount or percentage, and an expiry date. Expired codes will automatically stop working on the form.

**Integrations**
Enter your EmailJS, Formspree, and Google Sheets Web App credentials. See the dedicated setup sections below for where to find each value.

**Contact Info**
Update the band's contact email, phone number, and social media handles shown in the form footer.

### Uploading Photos

- Supported formats: **JPEG, JPG, PNG, WebP**
- Recommended dimensions: **800×1000px minimum** (portrait orientation works best for costume photos)
- Keep file sizes under 500KB where possible for faster page loads
- File names are **case-sensitive** — if your config says `girls-backline.jpg`, the file must be named exactly that (no capital letters, no spaces)
- Use the Upload button next to each photo field in the admin dashboard; the file will be copied into your project folder

### Exporting Config and Committing to the Repo

1. After making all your changes in admin.html, click **Export Config** (or equivalent Save/Export button in the dashboard).
2. This updates the `SITE_CONFIG` block inside `registration-template.html`.
3. Open your terminal (or GitHub Desktop) and commit all changed files — including any new image files you uploaded.
4. Push to GitHub. If GitHub Pages is enabled, your live form will update within a minute or two.

---

## Setting Up EmailJS

EmailJS sends the confirmation email to registrants automatically when the form is submitted. You will need a free account.

1. Go to [emailjs.com](https://www.emailjs.com) and create a free account.
2. In the EmailJS dashboard, click **Email Services** > **Add New Service**. Choose your email provider (Gmail, Outlook, Yahoo, etc.) and follow the prompts to connect your account. Note the **Service ID** shown after connecting.
3. Click **Email Templates** > **Create New Template**. Design your confirmation email. Use the variables listed below — EmailJS replaces them with real data at send time.
4. Note the **Template ID** shown in the template editor.
5. Go to **Account** > **API Keys** and copy your **Public Key**.
6. Open `admin.html`, go to the **Integrations** tab, and enter:
   - **EmailJS Public Key**
   - **EmailJS Service ID**
   - **EmailJS Template ID**
7. Export and commit your config.

### Email Template Variables

Use these placeholders inside your EmailJS email template (wrap each in double curly braces, e.g. `{{to_name}}`):

| Variable | Description |
|---|---|
| `to_email` | Registrant's email address |
| `to_name` | Registrant's name (used in greeting) |
| `parentName` | Parent or guardian name |
| `firstName` | Masquerader first name |
| `lastName` | Masquerader last name |
| `costume` | Selected costume name |
| `country` | Country of origin |
| `addons` | List of selected add-ons |
| `topSize` | Top/bodice size |
| `bottomSize` | Bottom size |
| `tshirts` | Parent apparel selection |
| `estimatedTotal` | Total cost of registration |
| `depositDue` | Deposit amount due |
| `frontlineHeadpiece` | Frontline headpiece option (if applicable) |
| `frontlineSizeCat` | Frontline size category |

> **Free tier limit:** 200 emails/month. Upgrade if you expect more registrations.

---

## Setting Up Formspree

Formspree receives form submissions and can forward them to your email inbox or a connected spreadsheet.

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Click **New Form** and give it a name (e.g., "Carnival 2027 Registrations").
3. Copy the **form endpoint URL** — it looks like `https://formspree.io/f/xxxxxxxx`.
4. Open `admin.html`, go to the **Integrations** tab, and paste the endpoint URL into the Formspree field.
5. In your Formspree dashboard, configure **email notifications** so you receive an email for each submission.
6. Optional: enable the **Google Sheets integration** directly inside Formspree if you prefer not to use the Apps Script approach.
7. Export and commit your config.

> **Free tier limits:** 50 submissions/month on the free plan; 1,000/month on the paid plan. Plan accordingly for your band's registration volume.

---

## Setting Up Google Sheets (Apps Script)

This integration logs every form submission directly to a Google Sheet in real time.

1. Create a new Google Sheet. In **Row 1**, add these column headers exactly as shown (one per cell):

   ```
   Timestamp | Parent Name | Phone | Email | Instagram | Masquerader Count | Masquerader Details | Parent Apparel | Estimated Total | Deposit Due | Notes | Consent
   ```

2. In Google Sheets, go to **Extensions** > **Apps Script**.

3. Delete any existing code in the editor and paste in the following complete script:

   ```javascript
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var data = JSON.parse(e.postData.contents);
       
       sheet.appendRow([
         new Date().toLocaleString(),
         data.parentName || '',
         data.phone || '',
         data.email || '',
         data.instagram || '',
         data.masqCount || '',
         data.masqueraders || '',
         data.tshirts || '',
         data.estimatedTotal || '',
         data.depositDue || '',
         data.notes || '',
         data.consent || ''
       ]);
       
       return ContentService
         .createTextOutput(JSON.stringify({status: 'success'}))
         .setMimeType(ContentService.MimeType.JSON);
     } catch(err) {
       return ContentService
         .createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

4. Click **Save** (the floppy disk icon). Give the project a name like "Carnival Registration Logger" when prompted.

5. Click **Deploy** > **New deployment**.

6. Under **Select type**, choose **Web app**.

7. Set **Execute as** to **Me**.

8. Set **Who has access** to **Anyone**.

9. Click **Deploy** and follow the authorization prompts — you will need to grant the script permission to edit your sheet.

10. Copy the **Web App URL** shown after deployment.

11. Open `admin.html`, go to the **Integrations** tab, and paste the Web App URL into the Google Sheets field. Export and commit your config.

> **Important notes:**
> - Every time you edit the Apps Script, you must create a **new deployment** (not re-deploy the existing one) to get an updated URL. Update the URL in admin.html accordingly.
> - The sheet logs every submission automatically from the moment the deployment is live.
> - Test the setup by submitting a test registration and confirming a new row appears in your sheet.

---

## Using the Email Template (email-template.html)

The file `email-template.html` contains the full HTML design for your confirmation email. Use it to style your EmailJS template.

1. Open `email-template.html` in a text editor (e.g., VS Code, Notepad++, TextEdit).
2. Select all and copy the entire HTML content.
3. In your **EmailJS dashboard**, open your email template and click the **`</>` (HTML)** button to switch to HTML editing mode.
4. Delete any existing content and paste in the copied HTML.
5. The template uses EmailJS variable syntax — for example, `{{to_name}}`, `{{costume}}`, `{{estimatedTotal}}` — which EmailJS automatically replaces with real values at send time.
6. Click **Save Template** in EmailJS.
7. Use the **Send Test** button in the EmailJS template editor to send yourself a test email and verify the formatting looks correct across devices.

---

## Deploying to GitHub Pages

GitHub Pages hosts your HTML form for free as a public URL.

1. Push all your files — HTML, images, and any other assets — to a GitHub repository.
2. In the repository on GitHub.com, go to **Settings** > **Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set branch to `main` (or `master`) and folder to `/ (root)`.
5. Click **Save**. Your form will be live within a minute or two at:
   ```
   https://yourusername.github.io/your-repo-name/registration-template.html
   ```

### Custom Domain Setup

1. Purchase a domain from any registrar (Namecheap, GoDaddy, Google Domains, etc.).
2. In your registrar's DNS settings, create a `CNAME` record pointing your domain to `yourusername.github.io`.
3. In your GitHub repository, create a file named `CNAME` (no extension) in the root folder. The file should contain only your domain name, for example:
   ```
   register.yourbandname.com
   ```
4. In **Settings** > **Pages**, enter your custom domain and enable **Enforce HTTPS**.
5. DNS changes can take up to 24–48 hours to propagate.

---

## Annual Update Checklist

Use this checklist at the start of each new registration season:

- [ ] Event name, theme, year, subtitle
- [ ] Costume photos (Girls Backline, Boys Backline, Girls Frontline, Boys Frontline, Girls Ultra, Boys Ultra)
- [ ] Costume prices
- [ ] Costume includes descriptions
- [ ] Add-on prices and photos
- [ ] Parent apparel photos and prices
- [ ] Promo codes (update code string and expiry date)
- [ ] Lookbook PDF URL
- [ ] Contact information (if changed)
- [ ] EmailJS template (if email design changed)
- [ ] Create a new Google Sheet for the new year and re-deploy Apps Script with the new sheet active
- [ ] Update or reuse Formspree form (same endpoint is fine to reuse; create a new one for cleaner data separation)
- [ ] Test a full registration end-to-end — confirm email sends, sheet logs the row, and the form displays correctly on mobile

---

## Troubleshooting

**Emails not sending**
Check that your EmailJS Public Key, Service ID, and Template ID are all entered correctly in the Integrations tab of admin.html. Confirm the service is still connected in your EmailJS dashboard (Gmail connections can expire and may need to be re-authorized). Also check that you have not exceeded the 200 emails/month free tier.

**Form submissions not appearing in Google Sheets**
The most common cause is an outdated deployment URL. Any time you edit the Apps Script code, you must create a **new deployment** — re-deploying the existing version does not update the URL. Get the new Web App URL and update it in admin.html.

**Photos not showing on the form**
File names are case-sensitive on GitHub Pages (even if they are not on your local computer). Make sure the filename in your config exactly matches the actual filename — including capitalization and extension. If you recently uploaded a new photo via admin.html, confirm the file was committed and pushed to GitHub.

**Promo code not working**
Open admin.html and go to the **Promo Codes** tab. Check that the expiry date is set correctly and has not passed. An expired code will be silently rejected.

**Admin changes not showing on the form**
Make sure you are viewing `registration-template.html` in your browser, not `index.html`. The `index.html` file is the previous year's deployed form and is not updated by admin.html. Changes you make in admin.html update `registration-template.html` only.

**Page shows old content after pushing to GitHub**
GitHub Pages can take 1–2 minutes to rebuild after a push. Hard-refresh your browser (`Ctrl+Shift+R` on Windows/Linux, `Cmd+Shift+R` on Mac) to bypass your browser cache.
