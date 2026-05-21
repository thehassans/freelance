export const SERVER_CONFIGS_PART_2: Record<string, Record<string, string>> = {
  jetty: {
    intermediate: `<!-- generated 2026-05-14, Mozilla Guideline v5.7, Jetty 9.4.28, intermediate configuration -->
<Configure id="sslContextFactory" class="org.eclipse.jetty.util.ssl.SslContextFactory$Server">
  <Set name="KeyStorePath">
    <Property name="jetty.home" default="." />
    <Property name="jetty.sslContext.keyStorePath" default="/path/to/key_store" />
  </Set>
  <Set name="IncludeProtocols">
    <Array type="String">
        <Item>TLSv1.2</Item>
        <Item>TLSv1.3</Item>
    </Array>
  </Set>
  <Set name="IncludeCipherSuites">
    <Array type="String">
      <Item>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256</Item>
      <Item>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256</Item>
      <Item>TLS_DHE_RSA_WITH_AES_256_GCM_SHA384</Item>
      <Item>TLS_DHE_RSA_WITH_AES_128_GCM_SHA256</Item>
      <Item>TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256</Item>
    </Array>
  </Set>
  <Set name="useCipherSuitesOrder">
    <Property name="jetty.sslContext.useCipherSuitesOrder" default="false" />
  </Set>
</Configure>`,
    modern: `<!-- generated 2026-05-14, Mozilla Guideline v5.7, Jetty 9.4.28, modern configuration -->
<Configure id="sslContextFactory" class="org.eclipse.jetty.util.ssl.SslContextFactory$Server">
  <Set name="KeyStorePath">
    <Property name="jetty.home" default="." />
    <Property name="jetty.sslContext.keyStorePath" default="/path/to/key_store" />
  </Set>
  <Set name="IncludeProtocols">
    <Array type="String">
        <Item>TLSv1.3</Item>
    </Array>
  </Set>
  <Set name="useCipherSuitesOrder">
    <Property name="jetty.sslContext.useCipherSuitesOrder" default="false" />
  </Set>
</Configure>`,
    old: `<!-- generated 2026-05-14, Mozilla Guideline v5.7, Jetty 9.4.28, old configuration -->
<Configure id="sslContextFactory" class="org.eclipse.jetty.util.ssl.SslContextFactory$Server">
  <Set name="KeyStorePath">
    <Property name="jetty.home" default="." />
    <Property name="jetty.sslContext.keyStorePath" default="/path/to/key_store" />
  </Set>
  <Set name="IncludeProtocols">
    <Array type="String">
        <Item>TLSv1</Item>
        <Item>TLSv1.1</Item>
        <Item>TLSv1.2</Item>
        <Item>TLSv1.3</Item>
    </Array>
  </Set>
  <Set name="IncludeCipherSuites">
    <Array type="String">
      <Item>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256</Item>
      <Item>TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256</Item>
      <Item>TLS_DHE_RSA_WITH_AES_128_GCM_SHA256</Item>
      <Item>TLS_DHE_RSA_WITH_AES_256_GCM_SHA384</Item>
      <Item>TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384</Item>
      <Item>TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA</Item>
      <Item>TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA</Item>
      <Item>TLS_DHE_RSA_WITH_AES_128_CBC_SHA256</Item>
      <Item>TLS_DHE_RSA_WITH_AES_256_CBC_SHA256</Item>
      <Item>TLS_RSA_WITH_AES_128_GCM_SHA256</Item>
      <Item>TLS_RSA_WITH_AES_256_GCM_SHA384</Item>
      <Item>TLS_RSA_WITH_AES_128_CBC_SHA256</Item>
      <Item>TLS_RSA_WITH_AES_256_CBC_SHA256</Item>
      <Item>TLS_RSA_WITH_AES_128_CBC_SHA</Item>
      <Item>TLS_RSA_WITH_AES_256_CBC_SHA</Item>
      <Item>TLS_RSA_WITH_3DES_EDE_CBC_SHA</Item>
    </Array>
  </Set>
  <Set name="useCipherSuitesOrder">
    <Property name="jetty.sslContext.useCipherSuitesOrder" default="true" />
  </Set>
</Configure>`
  },
  lighttpd: {
    intermediate: `# generated 2026-05-14, Mozilla Guideline v5.7, lighttpd 1.4.67, OpenSSL 1.1.1k, intermediate configuration
$SERVER["socket"] == "[::]:80" { }
$HTTP["scheme"] == "http" {
    url.redirect = ("" => "https://\${url.authority}\${url.path}\${qsa}")
}
$HTTP["scheme"] == "https" {
    setenv.add-response-header = ( "Strict-Transport-Security" => "max-age=63072000" )
}
$SERVER["socket"] == ":443" { ssl.engine = "enable" }
$SERVER["socket"] == "[::]:443" { ssl.engine = "enable" }
ssl.privkey = "/path/to/private_key"
ssl.pemfile = "/path/to/signed_cert_followed_by_intermediates"
ssl.openssl.ssl-conf-cmd = ("MinProtocol" => "TLSv1.2")
ssl.openssl.ssl-conf-cmd += ("Options" => "-ServerPreference")
ssl.openssl.ssl-conf-cmd += ("CipherString" => "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305")
ssl.stapling-file = "/path/to/cert-staple.der"`,
    modern: `# generated 2026-05-14, Mozilla Guideline v5.7, lighttpd 1.4.67, OpenSSL 1.1.1k, modern configuration
$SERVER["socket"] == "[::]:80" { }
$HTTP["scheme"] == "http" {
    url.redirect = ("" => "https://\${url.authority}\${url.path}\${qsa}")
}
$HTTP["scheme"] == "https" {
    setenv.add-response-header = ( "Strict-Transport-Security" => "max-age=63072000" )
}
$SERVER["socket"] == ":443" { ssl.engine = "enable" }
$SERVER["socket"] == "[::]:443" { ssl.engine = "enable" }
ssl.privkey = "/path/to/private_key"
ssl.pemfile = "/path/to/signed_cert_followed_by_intermediates"
ssl.openssl.ssl-conf-cmd = ("MinProtocol" => "TLSv1.3")
ssl.openssl.ssl-conf-cmd += ("Options" => "-ServerPreference")
ssl.stapling-file = "/path/to/cert-staple.der"`,
    old: `# generated 2026-05-14, Mozilla Guideline v5.7, lighttpd 1.4.67, OpenSSL 1.1.1k, old configuration
$SERVER["socket"] == "[::]:80" { }
$HTTP["scheme"] == "http" {
    url.redirect = ("" => "https://\${url.authority}\${url.path}\${qsa}")
}
$HTTP["scheme"] == "https" {
    setenv.add-response-header = ( "Strict-Transport-Security" => "max-age=63072000" )
}
$SERVER["socket"] == ":443" { ssl.engine = "enable" }
$SERVER["socket"] == "[::]:443" { ssl.engine = "enable" }
ssl.privkey = "/path/to/private_key"
ssl.pemfile = "/path/to/signed_cert_followed_by_intermediates"
ssl.openssl.ssl-conf-cmd = ("MinProtocol" => "TLSv1")
ssl.openssl.ssl-conf-cmd += ("Options" => "+ServerPreference")
ssl.openssl.ssl-conf-cmd += ("CipherString" => "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA")
ssl.stapling-file = "/path/to/cert-staple.der"`
  },
  mysql: {
    intermediate: `# generated 2026-05-14, Mozilla Guideline v5.7, MySQL 8.0.19, OpenSSL 1.1.1k, intermediate configuration
[mysqld]
require_secure_transport = on
ssl-cert = /path/to/signed_cert_plus_intermediates
ssl-key = /path/to/private_key
ssl-cipher = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
tls_version = TLSv1.2,TLSv1.3`,
    modern: `# generated 2026-05-14, Mozilla Guideline v5.7, MySQL 8.0.19, OpenSSL 1.1.1k, modern configuration
[mysqld]
require_secure_transport = on
ssl-cert = /path/to/signed_cert_plus_intermediates
ssl-key = /path/to/private_key
tls_version = TLSv1.3`,
    old: `# generated 2026-05-14, Mozilla Guideline v5.7, MySQL 8.0.19, OpenSSL 1.1.1k, old configuration
[mysqld]
require_secure_transport = on
ssl-cert = /path/to/signed_cert_plus_intermediates
ssl-key = /path/to/private_key
ssl-cipher = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
tls_version = TLSv1,TLSv1.1,TLSv1.2,TLSv1.3`
  },
  nginx: {
    intermediate: `server {
    listen 80 default_server;
    listen [::]:80 default_server;
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_certificate /path/to/signed_cert_plus_intermediates;
    ssl_certificate_key /path/to/private_key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;
    ssl_dhparam /path/to/dhparam;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;
    add_header Strict-Transport-Security "max-age=63072000" always;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/root_CA_cert_plus_intermediates;
    resolver 127.0.0.1;
}`,
    modern: `server {
    listen 80 default_server;
    listen [::]:80 default_server;
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_certificate /path/to/signed_cert_plus_intermediates;
    ssl_certificate_key /path/to/private_key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers off;
    add_header Strict-Transport-Security "max-age=63072000" always;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/root_CA_cert_plus_intermediates;
    resolver 127.0.0.1;
}`,
    old: `server {
    listen 80 default_server;
    listen [::]:80 default_server;
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_certificate /path/to/signed_cert_plus_intermediates;
    ssl_certificate_key /path/to/private_key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_session_tickets off;
    ssl_dhparam /path/to/dhparam;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA;
    ssl_prefer_server_ciphers on;
    add_header Strict-Transport-Security "max-age=63072000" always;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/root_CA_cert_plus_intermediates;
    resolver 127.0.0.1;
}`
  }
};
