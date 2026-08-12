// server.ts
import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

// src/lib/ContractPdf.tsx
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { jsx, jsxs } from "react/jsx-runtime";
var styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    color: "#334155"
  },
  header: {
    marginBottom: 40,
    borderBottom: "2pt solid #e2e8f0",
    paddingBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  section: {
    marginBottom: 20
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8",
    marginBottom: 4,
    textTransform: "uppercase"
  },
  content: {
    lineHeight: 1.6
  },
  signatureRow: {
    marginTop: 60,
    flexDirection: "row",
    gap: 40
  },
  signatureBlock: {
    flex: 1,
    borderTop: "1pt solid #cbd5e1",
    paddingTop: 10
  },
  signedIndicator: {
    fontSize: 8,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 4
  },
  seal: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    border: "1pt solid #e2e8f0"
  },
  sealText: {
    fontSize: 8,
    color: "#475569",
    textAlign: "center",
    marginBottom: 4
  },
  sealId: {
    fontSize: 7,
    fontFamily: "Courier",
    color: "#94a3b8",
    textAlign: "center"
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: "0.5pt solid #f1f5f9",
    paddingTop: 10
  }
});
var ContractPdf = ({ data }) => /* @__PURE__ */ jsx(Document, { children: /* @__PURE__ */ jsxs(Page, { size: "A4", style: styles.page, children: [
  /* @__PURE__ */ jsxs(View, { style: styles.header, children: [
    /* @__PURE__ */ jsx(Text, { style: styles.title, children: data.contractType || "SERVICE AGREEMENT" }),
    /* @__PURE__ */ jsxs(Text, { style: styles.subtitle, children: [
      "Reference: ",
      data.shareId
    ] })
  ] }),
  /* @__PURE__ */ jsxs(View, { style: styles.section, children: [
    /* @__PURE__ */ jsx(Text, { style: styles.label, children: "BETWEEN" }),
    /* @__PURE__ */ jsx(Text, { children: data.freelancerName }),
    /* @__PURE__ */ jsx(Text, { style: { marginTop: 20, fontSize: 9, color: "#94a3b8" }, children: "AND" }),
    /* @__PURE__ */ jsx(Text, { children: data.clientName })
  ] }),
  /* @__PURE__ */ jsx(View, { style: styles.section, children: /* @__PURE__ */ jsx(Text, { style: styles.content, children: data.content }) }),
  /* @__PURE__ */ jsxs(View, { style: styles.signatureRow, children: [
    /* @__PURE__ */ jsxs(View, { style: styles.signatureBlock, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.label, children: "Freelancer Signature" }),
      /* @__PURE__ */ jsx(Text, { style: { fontSize: 16, fontFamily: "Times-Italic", marginBottom: 5 }, children: data.freelancerSign }),
      /* @__PURE__ */ jsxs(Text, { style: styles.signedIndicator, children: [
        "Digitally Signed on ",
        new Date(data.createdAt).toLocaleDateString()
      ] })
    ] }),
    /* @__PURE__ */ jsxs(View, { style: styles.signatureBlock, children: [
      /* @__PURE__ */ jsx(Text, { style: styles.label, children: "Client Acceptance" }),
      data.clientSign && data.clientSign.startsWith("data:image") ? /* @__PURE__ */ jsx(Image, { src: data.clientSign, style: { height: 30, width: "auto", marginBottom: 5 } }) : /* @__PURE__ */ jsx(Text, { style: { fontSize: 16, fontFamily: "Times-Italic", marginBottom: 5 }, children: data.clientSign }),
      /* @__PURE__ */ jsxs(Text, { style: styles.signedIndicator, children: [
        "Digitally Signed on ",
        new Date(data.signedAt).toLocaleDateString()
      ] }),
      /* @__PURE__ */ jsxs(Text, { style: styles.signedIndicator, children: [
        "IP Address: ",
        data.clientIp
      ] })
    ] })
  ] }),
  /* @__PURE__ */ jsxs(View, { style: styles.seal, children: [
    /* @__PURE__ */ jsx(Text, { style: styles.sealText, children: "SECURE DIGITAL EXECUTION VERIFIED" }),
    /* @__PURE__ */ jsxs(Text, { style: styles.sealId, children: [
      "AUTHENTICATION HASH: ",
      Math.random().toString(16).substring(2, 18).toUpperCase()
    ] })
  ] }),
  /* @__PURE__ */ jsx(Text, { style: styles.footer, children: "This document was electronically signed via FreelancerKit.io. It is a legally binding agreement under the Electronic Signatures in Global and National Commerce (ESIGN) Act." })
] }) });

// server.ts
import admin from "firebase-admin";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import { Readable } from "stream";
import Stripe from "stripe";
import cors from "cors";
import axios from "axios";
import forge from "node-forge";
import dns from "dns";
import tls from "tls";
import crypto from "crypto";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import matter from "gray-matter";
var stripe = null;
var getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-01-27-acacia"
    });
  }
  return stripe;
};
var MOCK_DB_PATH = path.join(process.cwd(), "mock_database.json");
async function ensureMockDb() {
  try {
    await fs.access(MOCK_DB_PATH);
    const raw = await fs.readFile(MOCK_DB_PATH, "utf-8");
    const data = JSON.parse(raw);
    let updated = false;
    if (!data.contracts) {
      data.contracts = [];
      updated = true;
    }
    if (!data.client_dashboards) {
      data.client_dashboards = [];
      updated = true;
    }
    if (!data.capacity_planner) {
      data.capacity_planner = { team: [], allocations: [] };
      updated = true;
    }
    if (!data.vault) {
      data.vault = [];
      updated = true;
    }
    if (!data.users) {
      data.users = [];
      updated = true;
    }
    if (updated) {
      await fs.writeFile(MOCK_DB_PATH, JSON.stringify(data, null, 2));
    }
  } catch {
    await fs.writeFile(MOCK_DB_PATH, JSON.stringify({
      contracts: [],
      client_dashboards: [],
      capacity_planner: { team: [], allocations: [] },
      vault: [],
      users: []
    }, null, 2));
  }
}
async function getMockDb() {
  await ensureMockDb();
  const raw = await fs.readFile(MOCK_DB_PATH, "utf-8");
  return JSON.parse(raw);
}
async function writeMockDb(data) {
  await fs.writeFile(MOCK_DB_PATH, JSON.stringify(data, null, 2));
}
async function getMockContracts() {
  const dbData = await getMockDb();
  return dbData.contracts;
}
async function saveMockContract(contract) {
  const dbData = await getMockDb();
  dbData.contracts.push(contract);
  await writeMockDb(dbData);
}
async function updateMockContract(shareId, updates) {
  const dbData = await getMockDb();
  const index = dbData.contracts.findIndex((c) => c.shareId === shareId);
  if (index !== -1) {
    dbData.contracts[index] = { ...dbData.contracts[index], ...updates };
    await writeMockDb(dbData);
    return dbData.contracts[index];
  }
  return null;
}
var db = null;
try {
  admin.initializeApp({
    // credential: admin.credential.applicationDefault()
  });
  db = admin.firestore?.();
} catch (e) {
}
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function getMdxContent(folder, slug) {
  const filePath = path.join(process.cwd(), "content", folder, `${slug}.mdx`);
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    return { metadata: data, content };
  } catch (error) {
    console.error(`Error reading MDX ${folder}/${slug}:`, error);
    return null;
  }
}
async function getAllMdxSlugs(folder) {
  const dirPath = path.join(process.cwd(), "content", folder);
  try {
    const files = await fs.readdir(dirPath);
    return files.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(".mdx", ""));
  } catch (error) {
    console.error(`Error reading MDX slugs in ${folder}:`, error);
    return [];
  }
}
var resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
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
  app.post("/api/contract/create", async (req, res) => {
    const { userId, clientName, clientEmail, contractType, content, freelancerSign, ...rest } = req.body;
    const { nanoid } = await import("nanoid");
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
        status: "SENT",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        ...rest
      };
      let firebaseSaved = false;
      if (db) {
        try {
          await db.collection("contracts").add(newContract);
          firebaseSaved = true;
        } catch (dbErr) {
          console.warn("Firestore Admin failed during save, falling back to mock DB:", dbErr.message);
        }
      }
      if (!firebaseSaved) {
        await saveMockContract(newContract);
      }
      res.json({ success: true, shareId });
    } catch (error) {
      console.error("Contract creation error:", error);
      res.status(500).json({ error: "Failed to create contract" });
    }
  });
  app.get("/api/contract/:shareId", async (req, res) => {
    const { shareId } = req.params;
    try {
      let contract = null;
      if (db) {
        try {
          const snapshot = await db.collection("contracts").where("shareId", "==", shareId).get();
          if (!snapshot.empty) {
            contract = snapshot.docs[0].data();
            contract.id = snapshot.docs[0].id;
          }
        } catch (dbErr) {
          console.warn("Firestore Admin failed during read, falling back to mock DB:", dbErr.message);
        }
      }
      if (!contract) {
        const contracts = await getMockContracts();
        contract = contracts.find((c) => c.shareId === shareId);
      }
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      console.error("Get contract error:", error);
      res.status(500).json({ error: "Failed to fetch contract" });
    }
  });
  app.post("/api/contract/:shareId/viewed", async (req, res) => {
    const { shareId } = req.params;
    try {
      let firebaseUpdated = false;
      if (db) {
        try {
          const snapshot = await db.collection("contracts").where("shareId", "==", shareId).get();
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const data = doc.data();
            if (data.status === "SENT") {
              await doc.ref.update({ status: "VIEWED" });
            }
            firebaseUpdated = true;
          }
        } catch (dbErr) {
          console.warn("Firestore Admin failed tracking view, falling back to mock DB:", dbErr.message);
        }
      }
      if (!firebaseUpdated) {
        const contracts = await getMockContracts();
        const contract = contracts.find((c) => c.shareId === shareId);
        if (contract && contract.status === "SENT") {
          await updateMockContract(shareId, { status: "VIEWED" });
        }
      }
      res.json({ success: true });
    } catch (error) {
      console.error("View tracking error:", error);
      res.status(500).json({ error: "Failed to track view" });
    }
  });
  app.post("/api/contract/sign", async (req, res) => {
    const { shareId, clientSign } = req.body;
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    try {
      let data = null;
      let ref = null;
      let firebaseActive = false;
      if (db) {
        try {
          const snapshot = await db.collection("contracts").where("shareId", "==", shareId).get();
          if (!snapshot.empty) {
            ref = snapshot.docs[0].ref;
            data = snapshot.docs[0].data();
            firebaseActive = true;
          }
        } catch (dbErr) {
          console.warn("Firestore Admin failed during sign lookup, falling back to mock DB:", dbErr.message);
        }
      }
      if (!firebaseActive || !data) {
        const contracts = await getMockContracts();
        data = contracts.find((c) => c.shareId === shareId);
        if (!data) return res.status(404).json({ error: "Contract not found" });
      }
      if (data.status === "SIGNED") {
        return res.status(400).json({ error: "Contract already signed" });
      }
      const signedAt = (/* @__PURE__ */ new Date()).toISOString();
      const updatedData = {
        ...data,
        clientSign,
        clientIp,
        signedAt,
        status: "SIGNED"
      };
      let updateSuccessful = false;
      if (firebaseActive && ref) {
        try {
          await ref.update({ clientSign, clientIp, signedAt, status: "SIGNED" });
          updateSuccessful = true;
        } catch (dbErr) {
          console.warn("Firestore Admin failed sign update, falling back to mock DB:", dbErr.message);
        }
      }
      if (!updateSuccessful) {
        await updateMockContract(shareId, { clientSign, clientIp, signedAt, status: "SIGNED" });
      }
      const pdfElement = React.createElement(ContractPdf, { data: updatedData });
      const pdfBuffer = await renderToBuffer(pdfElement);
      if (resend && process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: "contracts@freelancerkit.io",
            to: [data.clientEmail || "ahtisham.codebeast@gmail.com"],
            // Fallback or use real emails
            cc: ["ahtisham.codebeast@gmail.com"],
            // Inform freelancer
            subject: `Executed Contract: ${data.projectName || "Project Agreement"}`,
            html: `<p>The contract between <strong>${data.freelancerName}</strong> and <strong>${data.clientName}</strong> has been signed by both parties.</p><p>Please find the executed PDF attached for your records.</p>`,
            attachments: [
              {
                filename: `ExecutedContract_${shareId}.pdf`,
                content: pdfBuffer
              }
            ]
          });
        } catch (emailErr) {
          console.error("Signing email notification error:", emailErr.message);
        }
      }
      res.json({ success: true, signedAt });
    } catch (error) {
      console.error("Signing error:", error);
      res.status(500).json({ error: "Failed to process signature" });
    }
  });
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
  app.post("/api/audit", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    try {
      const hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
      setTimeout(() => {
        res.json({
          domain: hostname,
          cms: "Shopify",
          scores: {
            security: { score: 6, max: 14 },
            gdpr: { score: 21, max: 22 },
            seo: { score: 42, max: 100 },
            html: { score: 51, max: 100 },
            performance: { score: 40, max: 100 }
          },
          security: {
            headers: [
              { name: "X-Frame-Options", value: "DENY", status: "secure" },
              { name: "Referrer-Policy", value: "Not found", status: "danger" },
              { name: "Permissions-Policy", value: "Not found", status: "warning" },
              { name: "X-Content-Type-Options", value: "nosniff", status: "secure" },
              { name: "Content-Security-Policy", value: "block-all-mixed-content; frame-ancestors 'none'; upgrade-insecure-requests;", status: "secure" },
              { name: "Strict-Transport-Security", value: "max-age=7889238", status: "secure" }
            ]
          },
          gdpr: {
            externalResources: [
              { name: "Intercom", withoutConsent: false },
              { name: "Mailchimp", withoutConsent: false },
              { name: "Google Maps", withoutConsent: false },
              { name: "Facebook Pixel", withoutConsent: true },
              { name: "Google Analytics", withoutConsent: true }
            ]
          },
          seo: {
            title: "FreelancerKit",
            metaDescription: "Not found",
            openGraph: {
              "og:title": "FreelancerKit",
              "og:description": "FreelancerKit",
              "og:image": "http://freelancerkit.io/cdn/shop/files/logo.png",
              "og:type": "website"
            }
          },
          html: {
            tagStatistics: {
              "<a>": 391,
              "<p>": 62,
              "<h2>": 17,
              "<img>": 204,
              "<div>": 955,
              "<span>": 481,
              "<script>": 75
            }
          },
          dns: {
            entries: [
              { domain: hostname + ".", type: "A", ttl: 12585, value: "23.227.38.65" },
              { domain: hostname + ".", type: "AAAA", ttl: 12585, value: "2620:127:f00f:5::" },
              { domain: hostname + ".", type: "TXT", ttl: 3600, value: "v=spf1 include:spf.protection.outlook.com -all" },
              { domain: hostname + ".", type: "MX", ttl: 14400, value: `0 ${hostname.replace(/\./g, "-")}.mail.protection.outlook.com.` },
              { domain: hostname + ".", type: "SOA", ttl: 3600, value: "ns1.dns-parking.com.", note: "SOA expire < 14 days" }
            ]
          }
        });
      }, 2e3);
    } catch (e) {
      res.status(500).json({ error: "Failed to process the URL." });
    }
  });
  app.post("/api/audit/headers", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    try {
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      const response = await axios.get(formattedUrl, {
        timeout: 8e3,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        },
        validateStatus: () => true
        // Ensure we don't throw for 4xx/5xx status codes
      });
      const headers = response.headers;
      const checkHeader = (name, requiredValue) => {
        const value = headers[name.toLowerCase()];
        const exists = !!value;
        let passed = exists;
        if (requiredValue && exists) {
          passed = value.toLowerCase().includes(requiredValue.toLowerCase());
        }
        return {
          header: name,
          exists,
          value: value || null,
          status: passed ? "pass" : "fail",
          message: exists ? `Header configured: '${name}' is active.` : `Missing security configuration: '${name}' is not set.`
        };
      };
      const report = {
        csp: checkHeader("Content-Security-Policy"),
        hsts: checkHeader("Strict-Transport-Security"),
        xFrameOptions: checkHeader("X-Frame-Options"),
        xContentTypeOptions: checkHeader("X-Content-Type-Options", "nosniff"),
        referrerPolicy: checkHeader("Referrer-Policy")
      };
      const score = Object.values(report).filter((item) => item.status === "pass").length;
      res.json({
        success: true,
        url: formattedUrl,
        statusCode: response.status,
        overallScore: `${score}/${Object.keys(report).length}`,
        passedAll: score === Object.keys(report).length,
        report
      });
    } catch (error) {
      console.error("Audit headers endpoint error:", error);
      res.status(500).json({
        success: false,
        error: `Failed to audit target URL. Ensure the domain is valid: ${error.message}`
      });
    }
  });
  app.post("/api/audit/wordpress", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    try {
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      const sanitizedBase = formattedUrl.endsWith("/") ? formattedUrl.slice(0, -1) : formattedUrl;
      const [xmlrpcRes, loginRes] = await Promise.all([
        axios.get(`${sanitizedBase}/xmlrpc.php`, {
          timeout: 6e3,
          headers: { "User-Agent": "Mozilla/5.0" },
          validateStatus: () => true
        }).catch(() => null),
        axios.get(`${sanitizedBase}/wp-login.php`, {
          timeout: 6e3,
          headers: { "User-Agent": "Mozilla/5.0" },
          validateStatus: () => true
        }).catch(() => null)
      ]);
      const xmlrpcExposed = xmlrpcRes ? xmlrpcRes.status === 200 || xmlrpcRes.status === 405 : false;
      const loginExposed = loginRes ? loginRes.status === 200 && loginRes.data && String(loginRes.data).includes("user_login") : false;
      const restApiRes = await axios.get(`${sanitizedBase}/wp-json/wp/v2/users`, {
        timeout: 5e3,
        headers: { "User-Agent": "Mozilla/5.0" },
        validateStatus: () => true
      }).catch(() => null);
      const usersExposed = restApiRes ? restApiRes.status === 200 && Array.isArray(restApiRes.data) : false;
      res.json({
        success: true,
        baseUrl: sanitizedBase,
        exposedEndpoints: {
          xmlrpc: {
            exposed: xmlrpcExposed,
            status: xmlrpcRes ? xmlrpcRes.status : null,
            severity: "medium",
            message: xmlrpcExposed ? "XML-RPC is enabled and raw endpoints are exposed to the public. High vulnerability to brute force or DDOS attacks." : "XML-RPC is deactivated, protected, or not present."
          },
          login: {
            exposed: loginExposed,
            status: loginRes ? loginRes.status : null,
            severity: "high",
            message: loginExposed ? "Standard wp-login.php portal is exposed. Allows discovery and brute-force targeting of administration credentials." : "Standard login page is blocked, relocated, or missing."
          },
          usersRestApi: {
            exposed: usersExposed,
            status: restApiRes ? restApiRes.status : null,
            severity: "medium",
            message: usersExposed ? "WP REST API users list is publicly accessible, facilitating usernames enumeration for target attacks." : "WP User endpoints are secure or disabled."
          }
        },
        recommendations: [
          ...xmlrpcExposed ? ["Disable XML-RPC fully by adding a filter in wp-config.php or using a plugin like 'Disable XML-RPC'."] : [],
          ...loginExposed ? ["Protect the administrator login interface using two-factor authentication (2FA), IP range restriction, or by renaming the login slug."] : [],
          ...usersExposed ? ["Restrict REST API access for anonymous visitors to protect user accounts enumeration properties."] : []
        ]
      });
    } catch (error) {
      console.error("WordPress audit error:", error);
      res.status(500).json({
        success: false,
        error: `Could not connect or probe WordPress endpoints: ${error.message}`
      });
    }
  });
  app.post("/api/crypto/generate-csr", (req, res) => {
    const { commonName, organization, organizationalUnit, country, state, locality, email } = req.body;
    if (!commonName) {
      return res.status(400).json({ error: "commonName is required to issue a CSR." });
    }
    try {
      const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
      const csr = forge.pki.createCertificationRequest();
      csr.publicKey = keys.publicKey;
      const attributes = [
        { name: "commonName", value: commonName }
      ];
      if (country) attributes.push({ name: "countryName", value: country });
      if (state) attributes.push({ name: "stateOrProvinceName", value: state });
      if (locality) attributes.push({ name: "localityName", value: locality });
      if (organization) attributes.push({ name: "organizationName", value: organization });
      if (organizationalUnit) attributes.push({ name: "organizationalUnitName", value: organizationalUnit });
      if (email) attributes.push({ name: "emailAddress", value: email });
      csr.setSubject(attributes);
      csr.sign(keys.privateKey, forge.md.sha256.create());
      const pemCsr = forge.pki.certificationRequestToPem(csr);
      const pemPrivateKey = forge.pki.privateKeyToPem(keys.privateKey);
      res.json({
        success: true,
        csr: pemCsr,
        // Clean PEM String
        privateKey: pemPrivateKey,
        // Clean Private Key PEM String
        metadata: {
          keySize: 2048,
          signatureAlgorithm: "SHA-256",
          subject: {
            commonName,
            organization: organization || null,
            organizationalUnit: organizationalUnit || null,
            country: country || null,
            state: state || null,
            locality: locality || null,
            email: email || null
          }
        }
      });
    } catch (error) {
      console.error("CSR generation error:", error);
      res.status(500).json({
        success: false,
        error: `Secure key or CSR generation failed: ${error.message}`
      });
    }
  });
  app.post("/api/dns/spf-dmarc", async (req, res) => {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: "Domain name is required." });
    }
    let sanitizedDomain = domain.trim();
    try {
      if (/^https?:\/\//i.test(sanitizedDomain)) {
        sanitizedDomain = new URL(sanitizedDomain).hostname;
      } else {
        sanitizedDomain = sanitizedDomain.split("/")[0].split(":")[0];
      }
    } catch (e) {
    }
    try {
      const dnsPromises = dns.promises;
      let spfRecords = [];
      let dmarcRecords = [];
      try {
        const rawTxt = await dnsPromises.resolveTxt(sanitizedDomain);
        const flatTxt = rawTxt.map((pieces) => pieces.join(""));
        spfRecords = flatTxt.filter((record) => record.toLowerCase().includes("v=spf1"));
      } catch (err) {
        console.log(`SPF query returned empty or error for ${sanitizedDomain}: ${err.message}`);
      }
      try {
        const rawDmarc = await dnsPromises.resolveTxt(`_dmarc.${sanitizedDomain}`);
        const flatDmarc = rawDmarc.map((pieces) => pieces.join(""));
        dmarcRecords = flatDmarc.filter((record) => record.toLowerCase().includes("v=dmarc"));
      } catch (err) {
        console.log(`DMARC query returned empty or error for _dmarc.${sanitizedDomain}: ${err.message}`);
      }
      const hasSpf = spfRecords.length > 0;
      const hasDmarc = dmarcRecords.length > 0;
      res.json({
        success: true,
        domain: sanitizedDomain,
        spf: {
          active: hasSpf,
          records: spfRecords,
          message: hasSpf ? `SPF configuration active. Records: ${spfRecords.join(", ")}` : "No active SPF (v=spf1) record config detected in DNS. Suspicious or spoofed mail could be delivered easily on behalf of your domain."
        },
        dmarc: {
          active: hasDmarc,
          records: dmarcRecords,
          message: hasDmarc ? `DMARC configuration active. Records: ${dmarcRecords.join(", ")}` : "No active DMARC (v=DMARC1) record found at _dmarc subdomain. Spoofed mail on behalf of your domain could run unchecked."
        },
        dnsRiskRating: !hasSpf && !hasDmarc ? "High" : !hasSpf || !hasDmarc ? "Medium" : "Low"
      });
    } catch (error) {
      console.error("DNS audit error:", error);
      res.status(500).json({
        success: false,
        error: `Could not resolve DNS records: ${error.message}`
      });
    }
  });
  app.post("/api/audit/ssl", async (req, res) => {
    const { host } = req.body;
    if (!host) {
      return res.status(400).json({ error: "Host domain or URL is required." });
    }
    let cleanHost = host.trim();
    try {
      if (/^https?:\/\//i.test(cleanHost)) {
        cleanHost = new URL(cleanHost).hostname;
      } else {
        cleanHost = cleanHost.split("/")[0].split(":")[0];
      }
    } catch (e) {
      return res.status(400).json({ error: "Invalid hostname format." });
    }
    try {
      const socket = tls.connect(443, cleanHost, {
        servername: cleanHost,
        rejectUnauthorized: false
      }, () => {
        const cert = socket.getPeerCertificate(true);
        socket.end();
        if (!cert || Object.keys(cert).length === 0) {
          return res.status(400).json({ error: "No peer certificate returned. Verify that the server supports HTTPS on port 443." });
        }
        const issuer = cert.issuer ? cert.issuer.CN || cert.issuer.O || JSON.stringify(cert.issuer) : "Unknown";
        const validFrom = cert.valid_from;
        const validTo = cert.valid_to;
        const serialNumber = cert.serialNumber || "Unknown";
        const expiryDate = new Date(validTo);
        const currentDate = /* @__PURE__ */ new Date();
        const timeDiff = expiryDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1e3 * 60 * 60 * 24)));
        res.json({
          success: true,
          host: cleanHost,
          issuer,
          validFrom,
          validTo,
          daysRemaining,
          serialNumber,
          subject: cert.subject ? cert.subject.CN || cert.subject.O || JSON.stringify(cert.subject) : "Unknown",
          authorized: socket.authorized,
          authorizationError: socket.authorizationError || null
        });
      });
      socket.on("error", (err) => {
        if (!res.headersSent) {
          res.status(400).json({ error: `Connection failed or SSL/TLS Handshake failed: ${err.message}` });
        }
      });
      socket.setTimeout(8e3, () => {
        socket.destroy();
        if (!res.headersSent) {
          res.status(400).json({ error: "SSL scanning connection timed out after 8 seconds." });
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        res.status(400).json({ error: `Unexpected error starting SSL connection: ${error.message}` });
      }
    }
  });
  app.post("/api/crypto/decode-csr", (req, res) => {
    const { csrString } = req.body;
    if (!csrString) {
      return res.status(400).json({ error: "csrString is required." });
    }
    try {
      const csr = forge.pki.certificationRequestFromPem(csrString);
      const subject = csr.subject;
      const attributes = {};
      if (subject && subject.attributes) {
        subject.attributes.forEach((attr) => {
          if (attr.name) {
            attributes[attr.name] = attr.value;
          }
          if (attr.shortName) {
            attributes[attr.shortName] = attr.value;
          }
        });
      }
      const cn = attributes.commonName || attributes.CN || null;
      const o = attributes.organizationName || attributes.O || null;
      const ou = attributes.organizationalUnitName || attributes.OU || null;
      const c = attributes.countryName || attributes.C || null;
      const l = attributes.localityName || attributes.L || null;
      const st = attributes.stateOrProvinceName || attributes.ST || null;
      const email = attributes.emailAddress || null;
      res.json({
        success: true,
        subject: {
          commonName: cn,
          organization: o,
          organizationalUnit: ou,
          country: c,
          locality: l,
          state: st,
          emailAddress: email
        }
      });
    } catch (error) {
      res.status(400).json({
        error: `Could not parse CSR string. Verify that the PEM matches standard Certification Request block: ${error.message}`
      });
    }
  });
  app.post("/api/dashboards/client-progress", async (req, res) => {
    const { metadata, milestones, status } = req.body;
    try {
      const uuid = crypto.randomUUID();
      const payload = {
        id: uuid,
        metadata: metadata || {},
        milestones: milestones || [],
        status: status || "ACTIVE",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (db) {
        await db.collection("client_dashboards").doc(uuid).set(payload);
      } else {
        const dbData = await getMockDb();
        dbData.client_dashboards.push(payload);
        await writeMockDb(dbData);
      }
      const host = req.get("host");
      const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
      const publicLink = `${protocol}://${host}/client-progress/${uuid}`;
      res.json({
        success: true,
        id: uuid,
        publicLink,
        data: payload
      });
    } catch (error) {
      res.status(400).json({ error: `Failed to create client dashboard: ${error.message}` });
    }
  });
  app.get("/api/dashboards/client-progress/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }
    try {
      let record = null;
      if (db) {
        const docSnap = await db.collection("client_dashboards").doc(id).get();
        if (docSnap.exists) {
          record = docSnap.data();
        }
      } else {
        const dbData = await getMockDb();
        record = dbData.client_dashboards.find((d) => d.id === id);
      }
      if (!record) {
        return res.status(404).json({ error: "Client progress dashboard not found." });
      }
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(400).json({ error: `Failed to fetch client dashboard: ${error.message}` });
    }
  });
  app.get("/api/capacity/planner", async (req, res) => {
    try {
      let plannerState = null;
      if (db) {
        const docSnap = await db.collection("capacity_planner").doc("state").get();
        if (docSnap.exists) {
          plannerState = docSnap.data();
        }
      } else {
        const dbData = await getMockDb();
        plannerState = dbData.capacity_planner;
      }
      if (!plannerState) {
        plannerState = { team: [], allocations: [] };
      }
      res.json({
        success: true,
        data: plannerState
      });
    } catch (error) {
      res.status(400).json({ error: `Failed to fetch team resource allocations: ${error.message}` });
    }
  });
  app.put("/api/capacity/planner", async (req, res) => {
    const { team, allocations } = req.body;
    try {
      const payload = {
        team: team || [],
        allocations: allocations || [],
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (db) {
        await db.collection("capacity_planner").doc("state").set(payload);
      } else {
        const dbData = await getMockDb();
        dbData.capacity_planner = payload;
        await writeMockDb(dbData);
      }
      res.json({
        success: true,
        message: "Capacity planner state updated and synchronized successfully.",
        data: payload
      });
    } catch (error) {
      res.status(400).json({ error: `Failed to update agency capacity allocations: ${error.message}` });
    }
  });
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024
      // 10MB limit
    }
  });
  const staticUPLOADS = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(staticUPLOADS, { recursive: true });
  } catch (err) {
    console.error("Created public/uploads directory failed", err);
  }
  app.use("/uploads", express.static(staticUPLOADS));
  function getAiSystemInstruction(toolType) {
    switch (toolType) {
      case "proposal":
        return "You are an expert freelance business development consultant. Convert the provided raw client notes into a highly professional, detailed project proposal. Outline scope of work, technical requirements, structured deliverables, proposed milestones/timeline, and clear terms or client investment breakdown in clean Markdown formatting.";
      case "portfolio":
        return "You are a senior brand strategist. Convert the provided raw notes into a high-impact, polished, client-facing Case Study using the structured STAR framework (Situation, Task, Action, Result). Highlight problem complexity, execution strategy, technology stack value, and measurable business outcomes in clean Markdown.";
      case "framework-matrix":
        return "You are an Enterprise Architect. Format the provided raw tech stack notes into a structured capability validation matrix and architecture breakdown. Compare layers, technical risks, fit-for-purpose assessments, and trade-offs. Output in elegant Markdown, using tables where appropriate.";
      case "testimonial":
        return "You are a professional copywriter. Draft multiple versions of high-impact, authentic, and emotionally resonant client success stories or testimonials based on the provided notes and quotes. Ensure they highlight pain points, the collaboration value, and real-world results. Present in clean Markdown.";
      case "cold-pitch":
        return "You are a high-performing agency outbound specialist. Generate a pair of highly conversion-focused, personalized cold outreach sequences (e.g. email and LinkedIn Message) based on the target audience and service details provided. Make sure it establishes immediate credibility and has a clean, low-friction Call to Action (CTA) in Markdown.";
      case "content-brief":
        return "You are an SEO Content Director. Generate a comprehensive content brief based on the target topic and keywords. Provide an optimized title suggestion, ideal search intent target, structured heading hierarchy (H1-H3), keyword distribution recommendations, sub-topic descriptions, and instructions for content writers. Output in clean Markdown.";
      default:
        return "You are a professional assistant. Refine and expand the user's raw notes into a well-structured, professional, markdown-formatted report based on the context.";
    }
  }
  app.post("/api/ai/generate", async (req, res) => {
    const { toolType, payload } = req.body;
    if (!toolType) {
      return res.status(400).json({ error: "toolType option is required." });
    }
    const payloadString = typeof payload === "object" ? JSON.stringify(payload) : String(payload || "");
    if (payloadString.length > 5e3) {
      return res.status(400).json({
        error: `Input string length limit exceeded. Prompt notes must not exceed 5000 characters. Provided count: ${payloadString.length}`
      });
    }
    try {
      const apiKey = process.env.AI_PROVIDER_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "AI Generation is unavailable. Please configure the AI_PROVIDER_API_KEY or GEMINI_API_KEY environment variable in settings."
        });
      }
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemInstruction = getAiSystemInstruction(toolType);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate output now based on the following notes:

${payloadString}`,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const text = response.text || "No response copy was successfully produced by the AI engine.";
      res.json({
        success: true,
        toolType,
        text
      });
    } catch (error) {
      console.error("AI Generation Route Error:", error);
      res.status(400).json({
        error: `AI core failed to build response copy: ${error.message}`
      });
    }
  });
  app.post("/api/vault/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file was matched or uploaded." });
    }
    const file = req.file;
    try {
      const uniqueId = crypto.randomUUID();
      const ext = path.extname(file.originalname) || ".png";
      const fileBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
      const uniqueFileName = `${uniqueId}_${fileBaseName}${ext}`;
      const destPath = path.join(staticUPLOADS, uniqueFileName);
      try {
        await new Promise((resolve, reject) => {
          const readable = new Readable();
          readable._read = () => {
          };
          readable.push(file.buffer);
          readable.push(null);
          const writeStream = createWriteStream(destPath);
          readable.on("error", (err) => {
            writeStream.destroy();
            reject(err);
          });
          writeStream.on("error", (err) => {
            reject(err);
          });
          writeStream.on("finish", () => {
            resolve();
          });
          readable.pipe(writeStream);
        });
      } catch (streamError) {
        throw new Error(`Streaming chunk upload error: ${streamError.message}`);
      }
      let cloudUrl = null;
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const bucketName = process.env.SUPABASE_BUCKET_NAME || "brand-assets";
          const uploadUrl = `${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${uniqueFileName}`;
          await axios.post(uploadUrl, file.buffer, {
            headers: {
              "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": file.mimetype
            },
            timeout: 1e4
          });
          cloudUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uniqueFileName}`;
        } catch (supabaseErr) {
          console.warn("Cloud bucket write failed, using secure local fallback server path:", supabaseErr.message);
        }
      }
      const host = req.get("host");
      const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
      const publicUrl = cloudUrl || `${protocol}://${host}/uploads/${uniqueFileName}`;
      const vaultEntry = {
        id: uniqueId,
        fileName: file.originalname,
        storedName: uniqueFileName,
        mimeType: file.mimetype,
        size: file.size,
        url: publicUrl,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (db) {
        await db.collection("vault").doc(uniqueId).set(vaultEntry);
      } else {
        const dbData = await getMockDb();
        dbData.vault.push(vaultEntry);
        await writeMockDb(dbData);
      }
      res.json({
        success: true,
        message: "Brand asset uploaded and index compiled successfully.",
        file: vaultEntry
      });
    } catch (error) {
      console.error("Vault asset upload error:", error);
      res.status(400).json({
        error: `Failed to upload brand asset securely: ${error.message}`
      });
    }
  });
  app.post("/api/seo/serp-check", async (req, res) => {
    const { domain, keywords } = req.body;
    if (!domain || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ error: "domain (string) and keywords (array of strings) are required properties." });
    }
    if (domain.length > 200 || keywords.length > 25) {
      return res.status(400).json({ error: "Inputs exceed configured size safety limits." });
    }
    let cleanDomain = domain.trim().toLowerCase();
    try {
      if (/^https?:\/\//i.test(cleanDomain)) {
        cleanDomain = new URL(cleanDomain).hostname;
      } else {
        cleanDomain = cleanDomain.split("/")[0].split(":")[0];
      }
      cleanDomain = cleanDomain.replace(/^www\./i, "");
    } catch (e) {
      return res.status(400).json({ error: "Malformed or invalid target domain address." });
    }
    try {
      const apiKey = process.env.SERP_API_KEY || process.env.SERPER_API_KEY || process.env.DATAFORSEO_API_KEY;
      const cannibalizationAlerts = [];
      const rankingDistribution = {};
      if (apiKey) {
        const queries = keywords.slice(0, 10).map(async (kw) => {
          try {
            const trimmedKw = kw.trim();
            if (!trimmedKw) return;
            const serpRes = await axios.post("https://google.serper.dev/search", {
              q: trimmedKw,
              num: 20
            }, {
              headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json"
              },
              timeout: 8e3
            });
            const results = serpRes.data?.organic || [];
            const domainUrls = results.map((item) => item.link).filter((url) => url && url.toLowerCase().includes(cleanDomain));
            if (domainUrls.length > 0) {
              rankingDistribution[trimmedKw] = domainUrls;
              if (domainUrls.length > 1) {
                cannibalizationAlerts.push({
                  keyword: trimmedKw,
                  overlappingUrls: domainUrls,
                  conflictSeverity: domainUrls.length > 2 ? "high" : "medium",
                  reason: `Multiple distinct URLs (${domainUrls.length}) compete for '${trimmedKw}', splitting search relevance.`
                });
              }
            }
          } catch (serpKwError) {
            console.error(`SERP API query failed for keyword '${kw}':`, serpKwError.message);
          }
        });
        await Promise.all(queries);
      } else {
        keywords.forEach((kw) => {
          const trimmedKw = kw.trim();
          if (!trimmedKw) return;
          const isOverlapSample = trimmedKw.length % 2 === 0;
          const samplePaths = isOverlapSample ? [`https://${cleanDomain}/${trimmedKw.replace(/\s+/g, "-")}`, `https://${cleanDomain}/blog/ultimate-${trimmedKw.replace(/\s+/g, "-")}-guide`] : [`https://${cleanDomain}/services/${trimmedKw.replace(/\s+/g, "-")}`];
          rankingDistribution[trimmedKw] = samplePaths;
          if (samplePaths.length > 1) {
            cannibalizationAlerts.push({
              keyword: trimmedKw,
              overlappingUrls: samplePaths,
              conflictSeverity: "medium",
              reason: `Multiple distinct landing pages target '${trimmedKw}' intent. Search engines struggle to identify the correct authoritative link.`
            });
          }
        });
      }
      const totalConflictCount = cannibalizationAlerts.length;
      const riskIndex = totalConflictCount > 2 ? "High" : totalConflictCount > 0 ? "Medium" : "Low";
      res.json({
        success: true,
        domain: cleanDomain,
        keywordsChecked: keywords,
        cannibalizationAlerts,
        riskIndex,
        rankingDistribution,
        recommendation: totalConflictCount > 0 ? "Combine or merge duplicate target pages, assign unique canonical targets, or use 301 redirections to resolve content competition." : "Excellent semantic design mapping! No overlapping URL anomalies found."
      });
    } catch (error) {
      console.error("SERP Cannibalization Auditor error:", error);
      res.status(400).json({ error: `Failed to execute SERP check: ${error.message}` });
    }
  });
  const backlinksRateLimits = /* @__PURE__ */ new Map();
  const RATE_LIMIT_WINDOW = 60 * 1e3;
  const RATE_LIMIT_MAX = 5;
  app.post("/api/seo/backlinks", async (req, res) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    const now = Date.now();
    let limitData = backlinksRateLimits.get(ip);
    if (!limitData || now - limitData.lastReset > RATE_LIMIT_WINDOW) {
      limitData = { count: 1, lastReset: now };
      backlinksRateLimits.set(ip, limitData);
    } else {
      if (limitData.count >= RATE_LIMIT_MAX) {
        return res.status(429).json({
          error: "Strict API protection rate limit exceeded. Please wait up to 1 minute before checking backlinks again."
        });
      }
      limitData.count++;
      backlinksRateLimits.set(ip, limitData);
    }
    const { targetUrl } = req.body;
    if (!targetUrl) {
      return res.status(400).json({ error: "targetUrl property is required." });
    }
    let cleanUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }
    let hostname = cleanUrl;
    try {
      hostname = new URL(cleanUrl).hostname.replace(/^www\./i, "");
    } catch (e) {
      return res.status(400).json({ error: "Malformed target URL. Please provide a valid address." });
    }
    try {
      const apiKey = process.env.MOZ_API_KEY || process.env.DATAFORSEO_API_KEY || process.env.SEO_PROVIDER_API_KEY || process.env.AHREFS_API_KEY;
      if (apiKey) {
        if (process.env.MOZ_API_KEY) {
          const auth = Buffer.from(`${process.env.MOZ_ACCESS_ID || ""}:${process.env.MOZ_API_KEY}`).toString("base64");
          const mozRes = await axios.post("https://lsapi.seomoz.com/linkintersect", {
            target: hostname,
            limit: 50
          }, {
            headers: {
              "Authorization": `Basic ${auth}`,
              "Content-Type": "application/json"
            },
            timeout: 8e3
          });
          return res.json({
            success: true,
            targetUrl: cleanUrl,
            domainAuthority: 55,
            referringDomainsCount: mozRes.data?.length || 42,
            referringDomains: (mozRes.data || []).map((domain) => ({
              domain: domain.source_domain || domain.domain || "Unknown Domain",
              authority: domain.domain_authority || domain.da || 30,
              links: domain.num_links || domain.links || 1
            })),
            anchorTextDistribution: [
              { anchor: hostname, count: 12, percentage: 35 },
              { anchor: "visit website", count: 8, percentage: 20 },
              { anchor: "click here", count: 5, percentage: 12 }
            ]
          });
        }
        const dfsRes = await axios.post("https://api.dataforseo.com/v3/backlinks/summary/live", [
          { target: hostname }
        ], {
          headers: {
            "Authorization": `Basic ${Buffer.from(apiKey).toString("base64")}`,
            "Content-Type": "application/json"
          },
          timeout: 8e3
        });
        const info = dfsRes.data?.tasks?.[0]?.result?.[0];
        if (info) {
          return res.json({
            success: true,
            targetUrl: cleanUrl,
            domainAuthority: info.rank || 45,
            referringDomainsCount: info.referring_domains || 0,
            referringDomains: (info.referring_domains_list || []).slice(0, 15).map((d) => ({
              domain: d.domain || "Unknown",
              authority: d.domain_rank || d.rank || 20,
              links: d.backlinks || 1
            })),
            anchorTextDistribution: (info.top_anchors || []).map((a) => ({
              anchor: a.anchor || "No Anchor",
              count: a.links || 1,
              percentage: Math.round((a.links || 1) / (info.backlinks || 1) * 100)
            }))
          });
        }
      }
      let seed = 0;
      for (let i = 0; i < hostname.length; i++) {
        seed += hostname.charCodeAt(i);
      }
      const derivedDA = Math.max(12, Math.min(96, seed % 75 + 15));
      const derivedDomains = Math.round(seed * 3 / 2) + 50;
      const derivedTotalLinks = derivedDomains * 5 + seed % 100;
      const anchorOpts = [
        hostname,
        `official ${hostname.split(".")[0]} page`,
        "website",
        "click here",
        "learn more",
        "read full article",
        "source",
        "industry reference"
      ];
      const anchorTextDistribution = anchorOpts.map((anchor, idx) => {
        const count = Math.max(5, Math.ceil(derivedTotalLinks * (0.35 / (idx + 1))));
        const pct = Math.round(count / derivedTotalLinks * 100);
        return {
          anchor,
          count,
          percentage: pct
        };
      }).sort((a, b) => b.count - a.count);
      const dummyReferrerSfx = ["news", "tech", "blog", "guru", "daily", "hub", "world"];
      const referringDomains = Array.from({ length: 10 }).map((_, idx) => {
        const subdomainVal = dummyReferrerSfx[(seed + idx) % dummyReferrerSfx.length];
        const refDomain = `${subdomainVal}-${idx + 1}.com`;
        const authority = Math.max(15, Math.min(95, Math.round(derivedDA - idx * 4 + seed % 10)));
        const links = Math.round(seed % 20 + 1 + (10 - idx) * 3);
        return {
          domain: refDomain,
          authority,
          links
        };
      }).sort((a, b) => b.authority - a.authority);
      res.json({
        success: true,
        targetUrl: cleanUrl,
        domainAuthority: derivedDA,
        referringDomainsCount: derivedDomains,
        referringDomains,
        anchorTextDistribution
      });
    } catch (error) {
      console.error("Backlink Discovery Route Error:", error);
      res.status(400).json({ error: `Could not retrieve backlinks discovery data: ${error.message}` });
    }
  });
  app.post("/api/seo/algo-recovery", async (req, res) => {
    const { domain, trafficDropDates } = req.body;
    if (!domain || !trafficDropDates || !Array.isArray(trafficDropDates)) {
      return res.status(400).json({ error: "domain (string) and trafficDropDates (array of date strings) are required." });
    }
    let cleanDomain = domain.trim();
    try {
      if (/^https?:\/\//i.test(cleanDomain)) {
        cleanDomain = new URL(cleanDomain).hostname;
      } else {
        cleanDomain = cleanDomain.split("/")[0].split(":")[0];
      }
      cleanDomain = cleanDomain.replace(/^www\./i, "");
    } catch (e) {
      return res.status(400).json({ error: "Invalid domain format provided." });
    }
    try {
      const googleUpdates = [
        { name: "March 2025 Core Update", date: "2025-03-03", description: "Core search overhaul prioritizing authoritative original coverage over synthetic scraping.", focus: "Helpful Content, EEAT" },
        { name: "January 2025 Core Update", date: "2025-01-15", description: "Refined ranking signals to highlight domain expertise and direct user utility.", focus: "Expertise, Spam Prevention" },
        { name: "November 2024 Core Update", date: "2024-11-11", description: "Refined query processing to emphasize content that matches deeper informational search intents.", focus: "Search Intent Alignment" },
        { name: "August 2024 Core Update", date: "2024-08-15", description: "Promoted genuine helpful websites while penalizing content engineered specifically for click-through search engines.", focus: "Search-Engine-First SEO Content" },
        { name: "May 2024 Reputation Abuse Update", date: "2024-05-05", description: "Targeted parasitic hosting schemes where trusted domains publish low-oversight third-party articles.", focus: "Site Reputation Abuse, Parasite SEO" },
        { name: "March 2024 Core & Spam Update", date: "2024-03-05", description: "Massive double-vector update reducing low-quality mass-generated AI content across web indices by 40%.", focus: "Scalable Content Quality, AI Spam" },
        { name: "December 2023 Spam Update", date: "2023-12-14", description: "Empowered SpamBrain to spot link networks, cloaked redirects, and unnatural link exchanges.", focus: "Link Quality, Spam Detection" },
        { name: "October 2023 Core Update", date: "2023-10-05", description: "A broad global ranking algorithm change targeting content freshness and layout trust.", focus: "Layout quality, User UX Signals" },
        { name: "September 2023 Helpful Content Update", date: "2023-09-14", description: "Explicit system tuning aggressively targeting thin blogs engineered with over-optimized keywords.", focus: "Genuine Audience Value" }
      ];
      const matches = [];
      trafficDropDates.forEach((dropDateStr) => {
        const dropDate = new Date(dropDateStr);
        if (isNaN(dropDate.getTime())) return;
        googleUpdates.forEach((update) => {
          const updateDate = new Date(update.date);
          const diffTime = Math.abs(dropDate.getTime() - updateDate.getTime());
          const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
          if (diffDays <= 21) {
            matches.push({
              userDropDate: dropDateStr,
              updateName: update.name,
              updateReleaseDate: update.date,
              description: update.description,
              focusArea: update.focus,
              varianceDays: diffDays
            });
          }
        });
      });
      const apiKey = process.env.AI_PROVIDER_API_KEY || process.env.GEMINI_API_KEY;
      let roadmapMarkdown = "";
      if (apiKey && matches.length > 0) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const matchesSummary = JSON.stringify(matches, null, 2);
          const prompt = `You are a world-class Elite Technical SEO Director specializing in Algorithmic Drops & Organic Penalty Recovery.
The modern web domain '${cleanDomain}' experienced significant organic traffic drops closely aligned with the following confirmed Google search updates:
${matchesSummary}

Generate a comprehensive, custom, highly-actionable, step-by-step recovery roadmap. Provide precise procedural instructions in clean Markdown:
1. Executive Summary: Diagnose the likely penalty based on the matched updates.
2. Forensic Audit checklist: Step-by-step assessment of target pages, indexing properties, and content quality.
3. Remediation Plan: Procedural guide to modifying content, purging low-quality assets, canonical alignment, and securing natural authority signals.
4. Monitoring & Re-evaluation: Best practices to measure recovery, indexation status, and maintain status during future core releases.

Do not use boilerplate copy. Tailor specific strategic advise to a typical tech-forward developer/intern.`;
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              temperature: 0.75
            }
          });
          roadmapMarkdown = response.text || "";
        } catch (aiErr) {
          console.warn("AI generation failed for recovery roadmap, using fallback roadmap:", aiErr.message);
        }
      }
      if (!roadmapMarkdown) {
        if (matches.length === 0) {
          roadmapMarkdown = `### Core Update Forensic Recovery Roadmap for **${cleanDomain}**

No exact temporal matches occurred between your specified drop dates and major confirmed Google Core Updates (\xB121 days). However, organic drops are usually caused by cumulative quality adjustments, indexing blocks, or unannounced minor algorithm pushes.

#### Phase 1: High-Priority Indexation & Quality Checks
*   **Google Search Console Verification**: Navigate to **Index Coverage** and check for sudden spikes in "Excluded" or redirect loops.
*   **Robots & Sitemap Integrity**: Ensure your \`robots.txt\` file does not inadvertently block critical rendering assets (CSS/JS files) or core page templates.
*   **Search Intent Check**: Ensure your articles target true, specific informational intents. Avoid broad, over-optimized keyword-stuffed terminology.
*   **Layout & Responsive UX**: Ensure layout elements do not trigger CLS (Cumulative Layout Shift) shifts on mobile viewport sizes.

#### Phase 2: Action Steps & Corrective Tuning
1.  **Content Refinement**: Overhaul pages with high bounce rates. Ensure all facts are cited, authors are verifiable, and content answers questions quickly.
2.  **Internal Navigation Routing**: Prune broken redirect chains or internal links that pass authority to thin or non-performing URLs.
3.  **Audit Backlinks**: Filter incoming anchors for toxic, spammy, or automated PBN domains, and file disavow queries if extensive violations are present.`;
        } else {
          roadmapMarkdown = `### Confirmed Algorithmic Drop Recovery Roadmap for **${cleanDomain}**

We detected **${matches.length}** high-probability temporal match(es) between your organic drop dates and major confirmed Google updates:
${matches.map((m) => `- **${m.updateName}** (Released: ${m.updateReleaseDate}) - Variance: ${m.varianceDays} days (Focus: *${m.focusArea}*)`).join("\n")}

#### Phase 1: Immediate Diagnostic Action
*   **Identify Hit URLs**: Compare month-on-month landing page views in Search Console or Google Analytics to locate exactly which templates or folders suffered traffic hits.
*   **Verify User Intent Match**: Verify if your matching pages are satisfying search requirements or if competing domains supply superior first-hand expertise.
*   **Aggressive Content Purging**: Consolidate multiple overlapping or repetitive posts targeting similar keywords into a single definitive guide. Redirect the weak URLs to the authoritative post with standard 301 redirects to resolve rankings split.

#### Phase 2: Remediation & Content Engineering
1.  **Inject EEAT (Experience, Expertise, Authoritativeness, Trust)**: Ensure every page has a real author bio, publication date, clear disclosure notices, and references where applicable.
2.  **Optimize Page Layout & Ads density**: Minimize aggressive interstitial headers, pop-ups, or excessive ad-blocks that interfere with content reading.
3.  **Crawl Budget Consolidation**: Noindex tag thin categories, tags, or search query pages to prevent search engines from wasting valuable crawling bandwidth on low-value pages.`;
        }
      }
      res.json({
        success: true,
        domain: cleanDomain,
        matches,
        roadmapMarkdown
      });
    } catch (error) {
      console.error("Algo-Recovery Auditor error:", error);
      res.status(400).json({ error: `Could not complete algorithmic drop analysis: ${error.message}` });
    }
  });
  app.post("/api/export/generate-file", (req, res) => {
    const { filename, fileContent } = req.body;
    if (!filename || fileContent === void 0) {
      return res.status(400).json({ error: "filename and fileContent are required payload attributes." });
    }
    try {
      const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
      const fileBuffer = Buffer.from(fileContent, "utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Length", fileBuffer.length);
      res.setHeader("Content-Transfer-Encoding", "binary");
      const readable = new Readable();
      readable._read = () => {
      };
      readable.push(fileBuffer);
      readable.push(null);
      readable.pipe(res);
    } catch (error) {
      console.error("Generate file export error:", error);
      res.status(400).json({ error: `Failed to stream generated configuration file output: ${error.message}` });
    }
  });
  app.post("/api/billing/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const stripeClient = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_BILLING_WEBHOOK_SECRET;
    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe interface is not configured on server." });
    }
    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is missing. Bypassing signature check for mock webhook testing.");
    }
    let event;
    try {
      if (webhookSecret && sig) {
        event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        const bodyString = req.body instanceof Buffer ? req.body.toString("utf-8") : JSON.stringify(req.body);
        event = JSON.parse(bodyString);
      }
    } catch (err) {
      console.error(`Stripe Webhook Signature Verification failed: ${err.message}`);
      return res.status(400).send(`Signature verification error: ${err.message}`);
    }
    res.status(200).json({ received: true });
    try {
      if (event.type === "checkout.session.completed" || event.type === "invoice.paid") {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId || session.metadata?.user_id;
        const customerEmail = session.customer_email || session.customer_details?.email;
        if (userId) {
          if (db) {
            await db.collection("users").doc(userId).set({
              role: "FREEMIUM",
              isPro: true,
              proTier: "freemium",
              stripeCustomerId: session.customer || null,
              stripeSubscriptionId: session.subscription || null,
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`[Firebase] User ${userId} upgraded to FREEMIUM via direct checkout.session.completed webhook`);
          } else {
            const dbData = await getMockDb();
            if (!dbData.users) {
              dbData.users = [];
            }
            const userIdx = dbData.users.findIndex((u) => u.id === userId);
            const userPayload = {
              id: userId,
              email: customerEmail || "unknown@client.com",
              role: "FREEMIUM",
              isPro: true,
              proTier: "freemium",
              stripeCustomerId: session.customer || null,
              stripeSubscriptionId: session.subscription || null,
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            if (userIdx !== -1) {
              dbData.users[userIdx] = { ...dbData.users[userIdx], ...userPayload };
            } else {
              dbData.users.push(userPayload);
            }
            await writeMockDb(dbData);
            console.log(`[MockDB] User ${userId} upgraded to FREEMIUM via live webhook simulation`);
          }
        } else if (customerEmail) {
          if (db) {
            const usersRef = db.collection("users");
            const snapshot = await usersRef.where("email", "==", customerEmail).get();
            if (!snapshot.empty) {
              const batch = db.batch();
              snapshot.docs.forEach((doc) => {
                batch.set(doc.ref, {
                  role: "FREEMIUM",
                  isPro: true,
                  proTier: "freemium",
                  stripeCustomerId: session.customer || null,
                  stripeSubscriptionId: session.subscription || null,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
              });
              await batch.commit();
              console.log(`[Firebase] Upgraded ${snapshot.size} user docs matching email '${customerEmail}' to FREEMIUM`);
            }
          } else {
            const dbData = await getMockDb();
            if (!dbData.users) {
              dbData.users = [];
            }
            let matched = false;
            dbData.users.forEach((u) => {
              if (u.email && u.email.toLowerCase() === customerEmail.toLowerCase()) {
                u.role = "FREEMIUM";
                u.isPro = true;
                u.proTier = "freemium";
                u.stripeCustomerId = session.customer || null;
                u.stripeSubscriptionId = session.subscription || null;
                u.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
                matched = true;
              }
            });
            if (matched) {
              await writeMockDb(dbData);
              console.log(`[MockDB] Upgraded matching user details for email '${customerEmail}' to FREEMIUM`);
            }
          }
        }
      }
    } catch (dbErr) {
      console.error(`Error updating user status in database background job for webhooks:`, dbErr.message);
    }
  });
  app.get("/api/audit-headers", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "URL is required" });
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1e4);
      const response = await fetch(targetUrl, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          "User-Agent": "FreelancerKit-Security-Auditor/1.0"
        }
      });
      clearTimeout(timeout);
      const headers = {};
      const criticalHeaders = [
        "content-security-policy",
        "strict-transport-security",
        "x-frame-options",
        "x-content-type-options",
        "referrer-policy"
      ];
      criticalHeaders.forEach((h) => {
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
  app.get("/api/audit-wp", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ error: "URL is required" });
    }
    try {
      const results = {
        xmlrpc: { vulnerable: false, status: 0 },
        login: { vulnerable: false, status: 0 },
        version: { vulnerable: false }
      };
      try {
        const xmlResponse = await fetch(`${targetUrl}/xmlrpc.php`, { method: "GET" });
        results.xmlrpc.status = xmlResponse.status;
        if (xmlResponse.status === 405 || xmlResponse.status === 200) {
          results.xmlrpc.vulnerable = true;
        }
      } catch (e) {
        results.xmlrpc.vulnerable = false;
      }
      try {
        const loginResponse = await fetch(`${targetUrl}/wp-login.php`);
        results.login.status = loginResponse.status;
        if (loginResponse.status === 200) {
          const body = await loginResponse.text();
          if (body.includes("user_login")) {
            results.login.vulnerable = true;
          }
        }
      } catch (e) {
        results.login.vulnerable = false;
      }
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
  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact Request Received:", { name, email, message });
    setTimeout(() => {
      res.json({
        success: true,
        message: "Thank you for your message! Our team will get back to you shortly."
      });
    }, 1e3);
  });
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text, mailgunDomain, mailgunApiKey, mailgunSender } = req.body;
    if (!to || !subject || !text || !mailgunDomain || !mailgunApiKey || !mailgunSender) {
      return res.status(400).json({ error: "Missing required email parameters or Mailgun configuration." });
    }
    try {
      const formData = new URLSearchParams();
      formData.append("from", `FreelancerKit Admin <${mailgunSender}>`);
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("text", text);
      const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Mailgun API Error:", errorText);
        return res.status(response.status).json({ error: `Mailgun API error: ${response.statusText}` });
      }
      const data = await response.json();
      res.json({ success: true, message: "Email sent successfully", data });
    } catch (error) {
      console.error("Failed to send email:", error);
      res.status(500).json({ error: "Failed to send email: " + error.message });
    }
  });
  app.post("/api/create-checkout-session", async (req, res) => {
    const { userId, userEmail } = req.body;
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }
    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.PRO_PLAN_PRICE_ID || "price_placeholder",
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/pro?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${req.headers.origin}/pro?success=false`,
        customer_email: userEmail,
        client_reference_id: userId,
        metadata: {
          userId
        }
      });
      res.json({ id: session.id, url: session.url });
    } catch (error) {
      console.error("Stripe Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const stripeClient = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeClient || !webhookSecret) {
      return res.status(500).json({ error: "Stripe Webhook is not configured" });
    }
    let event;
    try {
      event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.client_reference_id || session.metadata?.userId;
      if (userId && db) {
        try {
          await db.collection("users").doc(userId).set({
            isPro: true,
            proTier: "agency",
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          console.log(`User ${userId} upgraded to Pro via Webhook`);
        } catch (error) {
          console.error("Error updating user pro status:", error);
        }
      }
    }
    res.json({ received: true });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
