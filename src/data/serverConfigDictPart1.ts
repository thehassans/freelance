export const SERVER_CONFIGS: Record<string, Record<string, string>> = {
  apache: {
    intermediate: `Supports Firefox 27, Android 4.4.2, Chrome 31, Edge, IE 11 on Windows 7, Java 8u31, OpenSSL 1.0.1, Opera 20, and Safari 9
# generated 2026-05-14, Mozilla Guideline v5.7, Apache 2.4.41, OpenSSL 1.1.1k, intermediate configuration
<VirtualHost *:80>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/\\.well\\-known/acme\\-challenge/
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile      /path/to/signed_cert_and_intermediate_certs_and_dhparams
    SSLCertificateKeyFile   /path/to/private_key
    Protocols h2 http/1.1
    Header always set Strict-Transport-Security "max-age=63072000"
</VirtualHost>
SSLProtocol             all -SSLv3 -TLSv1 -TLSv1.1
SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
SSLHonorCipherOrder     off
SSLSessionTickets       off
SSLUseStapling On
SSLStaplingCache "shmcb:logs/ssl_stapling(32768)"`,
    modern: `Supports Firefox 63, Android 10.0, Chrome 70, Edge 75, Java 11, OpenSSL 1.1.1, Opera 57, and Safari 12.1
# generated 2026-05-14, Mozilla Guideline v5.7, Apache 2.4.41, OpenSSL 1.1.1k, modern configuration
<VirtualHost *:80>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/\\.well\\-known/acme\\-challenge/
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile      /path/to/signed_cert_and_intermediate_certs
    SSLCertificateKeyFile   /path/to/private_key
    Protocols h2 http/1.1
    Header always set Strict-Transport-Security "max-age=63072000"
</VirtualHost>
SSLProtocol             all -SSLv3 -TLSv1 -TLSv1.1 -TLSv1.2
SSLHonorCipherOrder     off
SSLSessionTickets       off
SSLUseStapling On
SSLStaplingCache "shmcb:logs/ssl_stapling(32768)"`,
    old: `Supports Firefox 1, Android 2.3, Chrome 1, Edge 12, IE8 on Windows XP, Java 6, OpenSSL 0.9.8, Opera 5, and Safari 1
# generated 2026-05-14, Mozilla Guideline v5.7, Apache 2.4.41, OpenSSL 1.1.1k, old configuration
<VirtualHost *:80>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/\\.well\\-known/acme\\-challenge/
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile      /path/to/signed_cert_and_intermediate_certs_and_dhparams
    SSLCertificateKeyFile   /path/to/private_key
    Protocols h2 http/1.1
    Header always set Strict-Transport-Security "max-age=63072000"
</VirtualHost>
SSLProtocol             all -SSLv3
SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
SSLHonorCipherOrder     on
SSLSessionTickets       off
SSLUseStapling On
SSLStaplingCache "shmcb:logs/ssl_stapling(32768)"`
  },
  'aws alb': {
    intermediate: `AWSTemplateFormatVersion: 2010-09-09
Description: Mozilla ALB configuration generated 2026-05-14
Parameters:
  SSLCertificateId:
    Type: String
Resources:
  ExampleALBListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      Certificates:
        - CertificateArn: !Ref SSLCertificateId
      Port: 443
      Protocol: HTTPS
      SslPolicy: ELBSecurityPolicy-FS-1-2-Res-2019-08`,
    modern: `# unfortunately, AWS ALB does not support the modern configuration`,
    old: `AWSTemplateFormatVersion: 2010-09-09
Description: Mozilla ALB configuration generated 2026-05-14
Parameters:
  SSLCertificateId:
    Type: String
Resources:
  ExampleALBListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      Certificates:
        - CertificateArn: !Ref SSLCertificateId
      Port: 443
      Protocol: HTTPS
      SslPolicy: ELBSecurityPolicy-TLS-1-0-2015-04`
  },
  'aws elb': {
    intermediate: `AWSTemplateFormatVersion: 2010-09-09
Description: Mozilla ELB configuration generated 2026-05-14
Resources:
  ExampleELB:
    Type: AWS::ElasticLoadBalancing::LoadBalancer
    Properties:
      Listeners:
        - LoadBalancerPort: '443'
          InstancePort: '80'
          PolicyNames:
            - Mozilla-intermediate-v5-0
          SSLCertificateId: !Ref SSLCertificateId
          Protocol: HTTPS`,
    modern: `# unfortunately, AWS ELB does not support the modern configuration`,
    old: `AWSTemplateFormatVersion: 2010-09-09
Description: Mozilla ELB configuration generated 2026-05-14
Resources:
  ExampleELB:
    Type: AWS::ElasticLoadBalancing::LoadBalancer
    Properties:
      Listeners:
        - LoadBalancerPort: '443'
          InstancePort: '80'
          PolicyNames:
            - Mozilla-old-v5-0
          SSLCertificateId: !Ref SSLCertificateId
          Protocol: HTTPS`
  },
  caddy: {
    intermediate: `# generated 2026-05-14, Mozilla Guideline v5.7, Caddy 2.1.1, intermediate configuration
example.com
tls {
    protocols tls1.2 tls1.3
    ciphers TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
}
header / Strict-Transport-Security "max-age=63072000"`,
    modern: `# generated 2026-05-14, Mozilla Guideline v5.7, Caddy 2.1.1, modern configuration
example.com
tls {
    protocols tls1.3
}
header / Strict-Transport-Security "max-age=63072000"`,
    old: `# generated 2026-05-14, Mozilla Guideline v5.7, Caddy 2.1.1, old configuration
example.com
tls {
    protocols tls1.0 tls1.3
    ciphers TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256 TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA TLS_RSA_WITH_AES_128_GCM_SHA256 TLS_RSA_WITH_AES_256_GCM_SHA384 TLS_RSA_WITH_AES_128_CBC_SHA TLS_RSA_WITH_AES_256_CBC_SHA TLS_RSA_WITH_3DES_EDE_CBC_SHA
}
header / Strict-Transport-Security "max-age=63072000"`
  },
  dovecot: {
    intermediate: `# generated 2026-05-14, Mozilla Guideline v5.7, Dovecot 2.3.16, OpenSSL 1.1.1k, intermediate configuration
ssl = required
ssl_cert = </path/to/signed_cert_plus_intermediates
ssl_key = </path/to/private_key
ssl_min_protocol = TLSv1.2
ssl_cipher_list = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
ssl_prefer_server_ciphers = no`,
    modern: `# generated 2026-05-14, Mozilla Guideline v5.7, Dovecot 2.3.16, OpenSSL 1.1.1k, modern configuration
ssl = required
ssl_cert = </path/to/signed_cert_plus_intermediates
ssl_key = </path/to/private_key
ssl_min_protocol = TLSv1.3
ssl_prefer_server_ciphers = no`,
    old: `# generated 2026-05-14, Mozilla Guideline v5.7, Dovecot 2.3.16, OpenSSL 1.1.1k, old configuration
ssl = required
ssl_cert = </path/to/signed_cert_plus_intermediates
ssl_key = </path/to/private_key
ssl_min_protocol = TLSv1
ssl_cipher_list = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
ssl_prefer_server_ciphers = yes`
  },
  exim: {
    intermediate: `# generated 2026-05-14, Mozilla Guideline v5.7, Exim 4.93, OpenSSL 1.1.1k, intermediate configuration
tls_advertise_hosts = *
tls_certificate = /path/to/signed_cert_plus_intermediates
tls_privatekey = /path/to/private_key
tls_dhparam = /path/to/dhparam
openssl_options = +no_sslv2 +no_sslv3 +no_tlsv1 +no_tlsv1_1
tls_require_ciphers = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305`,
    modern: `# generated 2026-05-14, Mozilla Guideline v5.7, Exim 4.93, OpenSSL 1.1.1k, modern configuration
tls_advertise_hosts = *
tls_certificate = /path/to/signed_cert_plus_intermediates
tls_privatekey = /path/to/private_key
openssl_options = +no_sslv2 +no_sslv3 +no_tlsv1 +no_tlsv1_1 +no_tlsv1_2`,
    old: `# generated 2026-05-14, Mozilla Guideline v5.7, Exim 4.93, OpenSSL 1.1.1k, old configuration
tls_advertise_hosts = *
tls_certificate = /path/to/signed_cert_plus_intermediates
tls_privatekey = /path/to/private_key
tls_dhparam = /path/to/dhparam
openssl_options = +no_sslv2 +no_sslv3
tls_require_ciphers = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA`
  },
  go: {
    intermediate: `// generated 2026-05-14, Mozilla Guideline v5.7, Go 1.14.4, intermediate configuration
package main
import ( "crypto/tls" "log" "net/http" )
func main() {
    cfg := &tls.Config{
        MinVersion: tls.VersionTLS12,
        CipherSuites: []uint16{
            tls.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
            tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
            tls.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
            tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
            tls.TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,
            tls.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,
        },
    }
    srv := &http.Server{ Addr: ":443", TLSConfig: cfg }
    log.Fatal(srv.ListenAndServeTLS("/path/to/signed_cert", "/path/to/private_key"))
}`,
    modern: `// generated 2026-05-14, Mozilla Guideline v5.7, Go 1.14.4, modern configuration
package main
import ( "crypto/tls" "log" "net/http" )
func main() {
    cfg := &tls.Config{ MinVersion: tls.VersionTLS13 }
    srv := &http.Server{ Addr: ":443", TLSConfig: cfg }
    log.Fatal(srv.ListenAndServeTLS("/path/to/signed_cert", "/path/to/private_key"))
}`,
    old: `// generated 2026-05-14, Mozilla Guideline v5.7, Go 1.14.4, old configuration
package main
import ( "crypto/tls" "log" "net/http" )
func main() {
    cfg := &tls.Config{
        MinVersion: tls.VersionTLS10,
        PreferServerCipherSuites: true,
        CipherSuites: []uint16{
            tls.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
            tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
            // ... truncated for old config ...
        },
    }
    srv := &http.Server{ Addr: ":443", TLSConfig: cfg }
    log.Fatal(srv.ListenAndServeTLS("/path/to/signed_cert", "/path/to/private_key"))
}`
  },
  haproxy: {
    intermediate: `# generated 2026-05-14, Mozilla Guideline v5.7, HAProxy 2.1, OpenSSL 1.1.1k, intermediate configuration
global
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-bind-options prefer-client-ciphers no-sslv3 no-tlsv10 no-tlsv11 no-tls-tickets
    ssl-default-server-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
    ssl-default-server-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-server-options no-sslv3 no-tlsv10 no-tlsv11 no-tls-tickets
    ssl-dh-param-file /path/to/dhparam

frontend ft_test
    mode http
    bind :443 ssl crt /path/to/<cert+privkey+intermediate> alpn h2,http/1.1
    bind :80
    redirect scheme https code 301 if !{ ssl_fc }
    http-response set-header Strict-Transport-Security max-age=63072000`,
    modern: `# generated 2026-05-14, Mozilla Guideline v5.7, HAProxy 2.1, OpenSSL 1.1.1k, modern configuration
global
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-bind-options prefer-client-ciphers no-sslv3 no-tlsv10 no-tlsv11 no-tlsv12 no-tls-tickets
    ssl-default-server-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-server-options no-sslv3 no-tlsv10 no-tlsv11 no-tlsv12 no-tls-tickets
frontend ft_test
    mode http
    bind :443 ssl crt /path/to/<cert+privkey+intermediate> alpn h2,http/1.1
    bind :80
    redirect scheme https code 301 if !{ ssl_fc }
    http-response set-header Strict-Transport-Security max-age=63072000`,
    old: `# generated 2026-05-14, Mozilla Guideline v5.7, HAProxy 2.1, OpenSSL 1.1.1k, old configuration
global
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-bind-options no-sslv3 no-tls-tickets
    ssl-default-server-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
    ssl-default-server-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-server-options no-sslv3 no-tls-tickets
    ssl-dh-param-file /path/to/dhparam

frontend ft_test
    mode http
    bind :443 ssl crt /path/to/<cert+privkey+intermediate> alpn h2,http/1.1
    bind :80
    redirect scheme https code 301 if !{ ssl_fc }
    http-response set-header Strict-Transport-Security max-age=63072000`
  }
};
