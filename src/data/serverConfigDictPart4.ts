export const SERVER_CONFIGS_PART_4: Record<string, Record<string, string>> = {
  redis: {
    intermediate: `port 0
tls-port 6379
tls-cluster yes
tls-replication yes

tls-cert-file /path/to/signed_cert_plus_intermediates
tls-key-file /path/to/private_key
tls-ca-cert-file /path/to/ca_certificates.crt
tls-ca-cert-dir /path/to/ca_certificates
tls-dh-params-file /path/to/dhparam

tls-protocols "TLSv1.2 TLSv1.3"
tls-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
tls-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
tls-prefer-server-ciphers no`,
    modern: `port 0
tls-port 6379
tls-cluster yes
tls-replication yes

tls-cert-file /path/to/signed_cert_plus_intermediates
tls-key-file /path/to/private_key
tls-ca-cert-file /path/to/ca_certificates.crt
tls-ca-cert-dir /path/to/ca_certificates

tls-protocols "TLSv1.3"
tls-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
tls-prefer-server-ciphers no`,
    old: `port 0
tls-port 6379
tls-cluster yes
tls-replication yes

tls-cert-file /path/to/signed_cert_plus_intermediates
tls-key-file /path/to/private_key
tls-ca-cert-file /path/to/ca_certificates.crt
tls-ca-cert-dir /path/to/ca_certificates
tls-dh-params-file /path/to/dhparam

tls-protocols "TLSv1 TLSv1.1 TLSv1.2 TLSv1.3"
tls-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
tls-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
tls-prefer-server-ciphers yes`
  },
  squid: {
    intermediate: `http_port 3128 ssl-bump \\
  tls-cert=/path/to/ca_signing_cert \\
  tls-key=/path/to/ca_signing_private_key \\
  cipher=ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305 \\
  tls-dh=/path/to/dhparam \\
  options=NO_SSLv3,NO_TLSv1,NO_TLSv1_1,NO_TICKET

sslcrtd_program /usr/lib/squid/security_file_certgen -s /var/cache/squid/ssl_db -M 4MB
acl step1 at_step SslBump1
ssl_bump peek step1
ssl_bump bump all

https_port 443 accel defaultsite=example.net \\
  tls-cert=/path/to/signed_cert_plus_intermediates \\
  tls-key=/path/to/private_key \\
  cipher=ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305 \\
  tls-dh=/path/to/dhparam \\
  options=NO_SSLv3,NO_TLSv1,NO_TLSv1_1,NO_TICKET`,
    modern: `http_port 3128 ssl-bump \\
  tls-cert=/path/to/ca_signing_cert \\
  tls-key=/path/to/ca_signing_private_key \\
  options=NO_SSLv3,NO_TLSv1,NO_TLSv1_1,NO_TLSv1_2,NO_TICKET

sslcrtd_program /usr/lib/squid/security_file_certgen -s /var/cache/squid/ssl_db -M 4MB
acl step1 at_step SslBump1
ssl_bump peek step1
ssl_bump bump all

https_port 443 accel defaultsite=example.net \\
  tls-cert=/path/to/signed_cert_plus_intermediates \\
  tls-key=/path/to/private_key \\
  options=NO_SSLv3,NO_TLSv1,NO_TLSv1_1,NO_TLSv1_2,NO_TICKET`,
    old: `http_port 3128 ssl-bump \\
  tls-cert=/path/to/ca_signing_cert \\
  tls-key=/path/to/ca_signing_private_key \\
  cipher=ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA \\
  tls-dh=/path/to/dhparam \\
  options=NO_SSLv3,NO_TICKET

sslcrtd_program /usr/lib/squid/security_file_certgen -s /var/cache/squid/ssl_db -M 4MB
acl step1 at_step SslBump1
ssl_bump peek step1
ssl_bump bump all

https_port 443 accel defaultsite=example.net \\
  tls-cert=/path/to/signed_cert_plus_intermediates \\
  tls-key=/path/to/private_key \\
  cipher=ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA \\
  tls-dh=/path/to/dhparam \\
  options=NO_SSLv3,NO_TICKET`
  },
  tomcat: {
    intermediate: `<Connector port="80" redirectPort="443" />
<Connector port="443" SSLEnabled="true">
    <SSLHostConfig
        ciphers="ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305"
        disableSessionTickets="true"
        honorCipherOrder="false"
        protocols="TLSv1.2, TLSv1.3">
        <Certificate
            certificateFile="/path/to/signed_certificate"
            certificateChainFile="/path/to/intermediate_certificate"
            certificateKeyFile="/path/to/private_key" />
    </SSLHostConfig>
    <UpgradeProtocol className="org.apache.coyote.http2.Http2Protocol" />
</Connector>`,
    modern: `<Connector port="80" redirectPort="443" />
<Connector port="443" SSLEnabled="true">
    <SSLHostConfig
        disableSessionTickets="true"
        honorCipherOrder="false"
        protocols="TLSv1.3">
        <Certificate
            certificateFile="/path/to/signed_certificate"
            certificateChainFile="/path/to/intermediate_certificate"
            certificateKeyFile="/path/to/private_key" />
    </SSLHostConfig>
    <UpgradeProtocol className="org.apache.coyote.http2.Http2Protocol" />
</Connector>`,
    old: `<Connector port="80" redirectPort="443" />
<Connector port="443" SSLEnabled="true">
    <SSLHostConfig
        ciphers="ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA"
        disableSessionTickets="true"
        honorCipherOrder="true"
        protocols="TLSv1, TLSv1.1, TLSv1.2, TLSv1.3">
        <Certificate
            certificateFile="/path/to/signed_certificate"
            certificateChainFile="/path/to/intermediate_certificate"
            certificateKeyFile="/path/to/private_key" />
    </SSLHostConfig>
    <UpgradeProtocol className="org.apache.coyote.http2.Http2Protocol" />
</Connector>`
  },
  traefik: {
    intermediate: `[http.routers]
  [http.routers.router-secure]
    rule = "Host(\`example.com\`)"
    service = "service-id"
    middlewares = ["hsts-header"]
    [http.routers.router-secure.tls]
      options = "intermediate"
  [http.routers.router-insecure]
    rule = "Host(\`example.com\`)"
    service = "service-id"
    middlewares = ["redirect-to-https", "hsts-header"]
[http.middlewares]
  [http.middlewares.redirect-to-https.redirectScheme]
    scheme = "https"
  [http.middlewares.hsts-header.headers]
    [http.middlewares.hsts-header.headers.customResponseHeaders]
      Strict-Transport-Security = "max-age=63072000"
[[tls.certificates]]
  certFile = "/path/to/signed_cert_plus_intermediates"
  keyFile = "/path/to/private_key"
[tls.options]
  [tls.options.intermediate]
    minVersion = "VersionTLS12"
    cipherSuites = [
      "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
    ]`,
    modern: `[http.routers]
  [http.routers.router-secure]
    rule = "Host(\`example.com\`)"
    service = "service-id"
    middlewares = ["hsts-header"]
    [http.routers.router-secure.tls]
      options = "modern"
  [http.routers.router-insecure]
    rule = "Host(\`example.com\`)"
    service = "service-id"
    middlewares = ["redirect-to-https", "hsts-header"]
[http.middlewares]
  [http.middlewares.redirect-to-https.redirectScheme]
    scheme = "https"
  [http.middlewares.hsts-header.headers]
    [http.middlewares.hsts-header.headers.customResponseHeaders]
      Strict-Transport-Security = "max-age=63072000"
[[tls.certificates]]
  certFile = "/path/to/signed_cert_plus_intermediates"
  keyFile = "/path/to/private_key"
[tls.options]
  [tls.options.modern]
    minVersion = "VersionTLS13"`,
    old: `[http.routers]
  [http.routers.router-secure]
    rule = "Host(\`example.com\`)"
    service = "service-id"
    middlewares = ["hsts-header"]
    [http.routers.router-secure.tls]
      options = "old"
  [http.routers.router-insecure]
    rule = "Host(\`example.com\`)"
    service = "service-id"
    middlewares = ["redirect-to-https", "hsts-header"]
[http.middlewares]
  [http.middlewares.redirect-to-https.redirectScheme]
    scheme = "https"
  [http.middlewares.hsts-header.headers]
    [http.middlewares.hsts-header.headers.customResponseHeaders]
      Strict-Transport-Security = "max-age=63072000"
[[tls.certificates]]
  certFile = "/path/to/signed_cert_plus_intermediates"
  keyFile = "/path/to/private_key"
[tls.options]
  [tls.options.old]
    minVersion = "TLSv1"
    cipherSuites = [
      "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256",
      "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA",
      "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
      "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA",
      "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
      "TLS_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_RSA_WITH_AES_128_CBC_SHA256",
      "TLS_RSA_WITH_AES_128_CBC_SHA",
      "TLS_RSA_WITH_AES_256_CBC_SHA",
      "TLS_RSA_WITH_3DES_EDE_CBC_SHA"
    ]`
  }
};
