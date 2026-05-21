import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { ContractPdf } from './src/lib/ContractPdf.js'; // Note: tsx might require .js or similar or use a better way
import admin from 'firebase-admin';
import fs from 'fs/promises';
import Stripe from 'stripe';

let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27-acacia' as any,
    });
  }
  return stripe;
};

// File-based Mock DB for persistence tracking since Firebase setup is pending
const MOCK_DB_PATH = path.join(process.cwd(), 'mock_database.json');

async function ensureMockDb() {
  try {
    await fs.access(MOCK_DB_PATH);
  } catch {
    await fs.writeFile(MOCK_DB_PATH, JSON.stringify({ contracts: [] }));
  }
}

async function getMockContracts() {
  await ensureMockDb();
  const data = await fs.readFile(MOCK_DB_PATH, 'utf-8');
  return JSON.parse(data).contracts;
}

async function saveMockContract(contract: any) {
  const contracts = await getMockContracts();
  contracts.push(contract);
  await fs.writeFile(MOCK_DB_PATH, JSON.stringify({ contracts }));
}

async function updateMockContract(shareId: string, updates: any) {
  const contracts = await getMockContracts();
  const index = contracts.findIndex((c: any) => c.shareId === shareId);
  if (index !== -1) {
    contracts[index] = { ...contracts[index], ...updates };
    await fs.writeFile(MOCK_DB_PATH, JSON.stringify({ contracts }));
    return contracts[index];
  }
  return null;
}

// Initialize Firebase Admin (Attempt)
// This assumes the environment has default credentials or we will catch errors gracefully
try {
  admin.initializeApp({
    // credential: admin.credential.applicationDefault()
  });
} catch (e) {
  console.error("Firebase Admin initialization failed. Proceeding with caution.");
}

const db = admin.firestore?.();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MDX Content Helpers
import matter from 'gray-matter';

async function getMdxContent(folder: string, slug: string) {
  const filePath = path.join(process.cwd(), 'content', folder, `${slug}.mdx`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    return { metadata: data, content };
  } catch (error) {
    console.error(`Error reading MDX ${folder}/${slug}:`, error);
    return null;
  }
}

async function getAllMdxSlugs(folder: string) {
  const dirPath = path.join(process.cwd(), 'content', folder);
  try {
    const files = await fs.readdir(dirPath);
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''));
  } catch (error) {
    console.error(`Error reading MDX slugs in ${folder}:`, error);
    return [];
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' })); // Handling base64 signatures

  // Content API Routes
  app.get("/api/content/:folder", async (req, res) => {
    const { folder } = req.params;
    const slugs = await getAllMdxSlugs(folder);
    
    const items = await Promise.all(slugs.map(async (slug) => {
       const data = await getMdxContent(folder, slug);
       return { slug, ...data?.metadata };
    }));
    
    res.json(items);
  });

  app.get("/api/content/:folder/:slug", async (req, res) => {
    const { folder, slug } = req.params;
    const data = await getMdxContent(folder, slug);
    if (!data) return res.status(404).json({ error: "Content not found" });
    res.json(data);
  });

  // API Route to Create Contract
  app.post("/api/contract/create", async (req, res) => {
    const { userId, clientName, clientEmail, contractType, content, freelancerSign } = req.body;
    const { nanoid } = await import('nanoid');
    const shareId = nanoid(12);

    try {
      const newContract = {
        userId,
        shareId,
        clientName,
        clientEmail,
        contractType,
        content,
        freelancerSign,
        status: 'SENT',
        createdAt: new Date().toISOString()
      };

      if (db) {
        await db.collection('contracts').add(newContract);
      } else {
        await saveMockContract(newContract);
      }

      res.json({ success: true, shareId });
    } catch (error) {
      console.error("Contract creation error:", error);
      res.status(500).json({ error: "Failed to create contract" });
    }
  });

  // API Route to track view
  app.post("/api/contract/:shareId/viewed", async (req, res) => {
    const { shareId } = req.params;
    try {
      if (db) {
        const snapshot = await db.collection('contracts').where('shareId', '==', shareId).get();
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          if (data.status === 'SENT') {
            await doc.ref.update({ status: 'VIEWED' });
          }
        }
      } else {
        // Fallback to Mock DB
        const contracts = await getMockContracts();
        const contract = contracts.find((c: any) => c.shareId === shareId);
        if (contract && contract.status === 'SENT') {
          await updateMockContract(shareId, { status: 'VIEWED' });
        }
      }
      res.json({ success: true });
    } catch (error) {
      console.error("View tracking error:", error);
      res.status(500).json({ error: "Failed to track view" });
    }
  });

  // API Route to Sign Contract
  app.post("/api/contract/sign", async (req, res) => {
    const { shareId, clientSign } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
      let data: any;
      let ref: any;

      if (db) {
        const snapshot = await db.collection('contracts').where('shareId', '==', shareId).get();
        if (snapshot.empty) return res.status(404).json({ error: "Contract not found" });
        ref = snapshot.docs[0].ref;
        data = snapshot.docs[0].data();
      } else {
        const contracts = await getMockContracts();
        data = contracts.find((c: any) => c.shareId === shareId);
        if (!data) return res.status(404).json({ error: "Contract not found" });
      }

      if (data.status === 'SIGNED') {
        return res.status(400).json({ error: "Contract already signed" });
      }

      const signedAt = new Date().toISOString();
      const updatedData = {
        ...data,
        clientSign,
        clientIp,
        signedAt,
        status: 'SIGNED'
      };

      // 1. Update Database
      if (db && ref) {
        await ref.update({ clientSign, clientIp, signedAt, status: 'SIGNED' });
      } else {
        await updateMockContract(shareId, { clientSign, clientIp, signedAt, status: 'SIGNED' });
      }

      // 2. Generate PDF
      const pdfElement = React.createElement(ContractPdf, { data: updatedData }) as any;
      const pdfBuffer = await renderToBuffer(pdfElement);

      // 3. Email execution notification
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'contracts@freelancerkit.io',
          to: [data.clientEmail || 'ahtisham.codebeast@gmail.com'], // Fallback or use real emails
          cc: ['ahtisham.codebeast@gmail.com'], // Inform freelancer
          subject: `Executed Contract: ${data.projectName || 'Project Agreement'}`,
          html: `<p>The contract between <strong>${data.freelancerName}</strong> and <strong>${data.clientName}</strong> has been signed by both parties.</p><p>Please find the executed PDF attached for your records.</p>`,
          attachments: [
            {
              filename: `ExecutedContract_${shareId}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
      }

      res.json({ success: true, signedAt });
    } catch (error) {
      console.error("Signing error:", error);
      res.status(500).json({ error: "Failed to process signature" });
    }
  });

  // API Route for Fx Rates (Proxy to bypass CORS/client-side blocking)
  app.get("/api/fx-rates/:base", async (req, res) => {
    const { base } = req.params;
    try {
      const response = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("FX Rate Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch rates" });
    }
  });

  // API Route for Security Header Auditor (Full Payload)
  app.post("/api/audit", async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      
      // Simulate backend processing time
      setTimeout(() => {
        res.json({
          domain: hostname,
          cms: 'Shopify',
          scores: {
            security: { score: 6, max: 14 },
            gdpr: { score: 21, max: 22 },
            seo: { score: 42, max: 100 },
            html: { score: 51, max: 100 },
            performance: { score: 40, max: 100 }
          },
          security: {
            headers: [
              { name: 'X-Frame-Options', value: 'DENY', status: 'secure' },
              { name: 'Referrer-Policy', value: 'Not found', status: 'danger' },
              { name: 'Permissions-Policy', value: 'Not found', status: 'warning' },
              { name: 'X-Content-Type-Options', value: 'nosniff', status: 'secure' },
              { name: 'Content-Security-Policy', value: "block-all-mixed-content; frame-ancestors 'none'; upgrade-insecure-requests;", status: 'secure' },
              { name: 'Strict-Transport-Security', value: 'max-age=7889238', status: 'secure' }
            ]
          },
          gdpr: {
            externalResources: [
              { name: 'Intercom', withoutConsent: false },
              { name: 'Mailchimp', withoutConsent: false },
              { name: 'Google Maps', withoutConsent: false },
              { name: 'Facebook Pixel', withoutConsent: true },
              { name: 'Google Analytics', withoutConsent: true }
            ]
          },
          seo: {
            title: 'FreelancerKit',
            metaDescription: 'Not found',
            openGraph: {
              'og:title': 'FreelancerKit',
              'og:description': 'FreelancerKit',
              'og:image': 'http://freelancerkit.io/cdn/shop/files/logo.png',
              'og:type': 'website'
            }
          },
          html: {
            tagStatistics: {
              '<a>': 391,
              '<p>': 62,
              '<h2>': 17,
              '<img>': 204,
              '<div>': 955,
              '<span>': 481,
              '<script>': 75
            }
          },
          dns: {
            entries: [
              { domain: hostname + '.', type: 'A', ttl: 12585, value: '23.227.38.65' },
              { domain: hostname + '.', type: 'AAAA', ttl: 12585, value: '2620:127:f00f:5::' },
              { domain: hostname + '.', type: 'TXT', ttl: 3600, value: 'v=spf1 include:spf.protection.outlook.com -all' },
              { domain: hostname + '.', type: 'MX', ttl: 14400, value: `0 ${hostname.replace(/\./g, '-')}.mail.protection.outlook.com.` },
              { domain: hostname + '.', type: 'SOA', ttl: 3600, value: 'ns1.dns-parking.com.', note: 'SOA expire < 14 days' }
            ]
          }
        });
      }, 2000); // 2 seconds loading simulation
    } catch (e) {
      res.status(500).json({ error: "Failed to process the URL." });
    }
  });

  // API Route for Security Header Auditor
  app.get("/api/audit-headers", async (req, res) => {
    const targetUrl = req.query.url as string;
    
    if (!targetUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Abort controller for 10s timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(targetUrl, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'FreelancerKit-Security-Auditor/1.0'
        }
      });
      
      clearTimeout(timeout);

      const headers: Record<string, string> = {};
      const criticalHeaders = [
        'content-security-policy',
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy'
      ];

      criticalHeaders.forEach(h => {
        const val = response.headers.get(h);
        if (val) headers[h] = val;
      });

      res.json({ 
        headers, 
        status: response.status,
        url: response.url 
      });
    } catch (error) {
      console.error("Audit error:", error);
      res.status(500).json({ 
        error: "Failed to audit target URL. Ensure the site is active and supports HTTPS." 
      });
    }
  });

  // API Route for WordPress Security Auditor
  app.get("/api/audit-wp", async (req, res) => {
    const targetUrl = req.query.url as string;
    
    if (!targetUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const results = {
        xmlrpc: { vulnerable: false, status: 0 },
        login: { vulnerable: false, status: 0 },
        version: { vulnerable: false }
      };

      // 1. XML-RPC Check
      try {
        const xmlResponse = await fetch(`${targetUrl}/xmlrpc.php`, { method: 'GET' });
        results.xmlrpc.status = xmlResponse.status;
        // 405 or 200 = Vulnerable
        if (xmlResponse.status === 405 || xmlResponse.status === 200) {
          results.xmlrpc.vulnerable = true;
        }
      } catch (e) {
        results.xmlrpc.vulnerable = false;
      }

      // 2. Default Login Check
      try {
        const loginResponse = await fetch(`${targetUrl}/wp-login.php`);
        results.login.status = loginResponse.status;
        if (loginResponse.status === 200) {
          const body = await loginResponse.text();
          if (body.includes('user_login')) {
            results.login.vulnerable = true;
          }
        }
      } catch (e) {
        results.login.vulnerable = false;
      }

      // 3. Version Disclosure
      try {
        const homeResponse = await fetch(targetUrl);
        if (homeResponse.status === 200) {
          const body = await homeResponse.text();
          if (body.includes('<meta name="generator" content="WordPress')) {
            results.version.vulnerable = true;
          }
        }
      } catch (e) {
        results.version.vulnerable = false;
      }

      res.json(results);
    } catch (error) {
      console.error("WP Audit error:", error);
      res.status(500).json({ 
        error: "Failed to audit WordPress site. Ensure the URL is valid and the site is reachable." 
      });
    }
  });

  // API Route for Contact Form
  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    
    // In a real app, you would send an email or save to a database here
    console.log("Contact Request Received:", { name, email, message });
    
    // Simulating a small delay
    setTimeout(() => {
      res.json({ 
        success: true, 
        message: "Thank you for your message! Our team will get back to you shortly." 
      });
    }, 1000);
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    const { userId, userEmail } = req.body;
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.PRO_PLAN_PRICE_ID || 'price_placeholder',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/pro?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${req.headers.origin}/pro?success=false`,
        customer_email: userEmail,
        client_reference_id: userId,
        metadata: {
          userId: userId,
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook
  app.post("/api/stripe-webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const stripeClient = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeClient || !webhookSecret) {
      return res.status(500).json({ error: "Stripe Webhook is not configured" });
    }

    let event;

    try {
      event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.userId;

      if (userId && db) {
        try {
          await db.collection('users').doc(userId).set({
            isPro: true,
            proTier: 'agency',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          console.log(`User ${userId} upgraded to Pro via Webhook`);
        } catch (error) {
          console.error("Error updating user pro status:", error);
        }
      }
    }

    res.json({ received: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
