export const SERVER_METADATA = [
  {
    name: "Apache",
    description: "Apache HTTP Server is one of the world's most widely-used web servers. Securing Apache with modern TLS cryptographic modules ensures robust defense against man-in-the-middle attacks and maintains compliance with strict data privacy regulations."
  },
  {
    name: "AWS ALB",
    description: "AWS Application Load Balancer natively handles routing and SSL termination for modern web applications. Enforcing strict TLS listener policies on your ALB prevents downgrade attacks before traffic ever reaches your sensitive backend infrastructure."
  },
  {
    name: "AWS ELB",
    description: "AWS Classic Elastic Load Balancer provides baseline traffic routing for legacy systems. Updating your ELB security policies to drop SSLv3 and TLS 1.0 is a critical first step in hardening legacy cloud environments."
  },
  {
    name: "Caddy",
    description: "Caddy is a modern, developer-friendly web server known for automatic HTTPS provisioning. By enforcing strict intermediate or modern profile directives, Caddy can provide impenetrable TLS encryption for microservices and APIs."
  },
  {
    name: "Dovecot",
    description: "Dovecot is a secure, high-performance IMAP and POP3 email server. Hardening Dovecot's SSL/TLS cipher suites prevents credential interception, ensuring that enterprise email communication remains strictly confidential."
  },
  {
    name: "Exim",
    description: "Exim is a widely deployed message transfer agent (MTA) for Unix systems. Generating a strict cryptographic configuration for Exim safeguards SMTP transit data against eavesdropping and enhances overall email infrastructure integrity."
  },
  {
    name: "Go",
    description: "The Go programming language provides a highly performant, built-in TLS package. Explicitly configuring Go's MinVersion and CipherSuites in your net/http server blocks weak ciphers and ensures forward secrecy."
  },
  {
    name: "HAProxy",
    description: "HAProxy is an industry-standard load balancer and proxy server. Injecting hardened bind-ciphers and TLS parameters into your HAProxy frontend guarantees that edge-termination meets rigorous PCI-DSS and HIPAA compliance standards."
  },
  {
    name: "Jetty",
    description: "Eclipse Jetty is a highly scalable Java-based web server and servlet container. Explicitly disabling weak cipher suites in Jetty's SslContextFactory protects enterprise Java web applications from protocol vulnerabilities."
  },
  {
    name: "lighttpd",
    description: "lighttpd is a secure, fast, and lightweight web server designed for high-performance environments. Applying modern TLS profiles in lighttpd ensures rapid, encrypted data delivery without sacrificing cryptographic integrity."
  },
  {
    name: "MySQL",
    description: "MySQL is the world's most popular open-source relational database. Enforcing strict TLS protocols for MySQL connections guarantees that highly sensitive query data and credentials cannot be intercepted on the wire."
  },
  {
    name: "nginx",
    description: "Nginx is a high-performance web server and reverse proxy. Securing Nginx with modern TLS 1.3 cipher suites prevents downgrade attacks and ensures strict compliance with PCI-DSS data transmission standards."
  },
  {
    name: "Oracle HTTP",
    description: "Oracle HTTP Server serves as the web-tier component for Oracle Fusion Middleware. Deploying strict SSLWallets and CipherSuite parameters protects enterprise ERP data streams from interception."
  },
  {
    name: "Postfix",
    description: "Postfix is a robust, open-source mail transfer agent. Enforcing strong mandatory TLS protocols prevents opportunistic encryption downgrades during cross-server SMTP relays."
  },
  {
    name: "PostgreSQL",
    description: "PostgreSQL is a powerful, open-source object-relational database. Requiring strict SSL connections and modern TLS protocols ensures that mission-critical operational data is fully encrypted in transit."
  },
  {
    name: "ProFTPD",
    description: "ProFTPD is a highly configurable FTP server. Enforcing TLSv1.2 or TLSv1.3 ensures that file transfers and user credentials remain impenetrable to passive network sniffing."
  },
  {
    name: "Redis",
    description: "Redis is an in-memory data structure store used as a database, cache, and message broker. Enabling strict TLS configurations for Redis secures internal cluster replication and prevents unauthorized memory snooping."
  },
  {
    name: "Squid",
    description: "Squid is a caching proxy for the web supporting HTTP, HTTPS, and FTP. Applying secure SSL bump policies enables secure traffic inspection without introducing weak cipher vulnerabilities."
  },
  {
    name: "Tomcat",
    description: "Apache Tomcat is an open-source implementation of the Java Servlet and JavaServer Pages technologies. Hardening the Tomcat SSLHostConfig blocks legacy protocols like SSLv3, shielding enterprise Java payloads."
  },
  {
    name: "Traefik",
    description: "Traefik is a modern HTTP reverse proxy and load balancer. Configuring Traefik with strict TLS options guarantees seamless and deeply secure encrypted routing for dynamic microservice architectures."
  }
];
