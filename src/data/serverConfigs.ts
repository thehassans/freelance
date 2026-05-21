export const CIPHERS = {
  modern: 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256',
  intermediate: 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305',
  old: 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA'
};

export const PROTOCOLS = {
  modern: 'TLSv1.3',
  intermediate: 'TLSv1.2 TLSv1.3',
  old: 'TLSv1 TLSv1.1 TLSv1.2 TLSv1.3'
};

type ProfileType = 'modern' | 'intermediate' | 'old';

export function getServerConfig(server: string, profile: ProfileType, appVer: string, sslVer: string): string {
  const date = new Date().toISOString().split('T')[0];
  const head = `# generated ${date}, FreelancerKit Guideline, ${server} ${appVer}, OpenSSL ${sslVer}, ${profile} configuration`;
  
  const c = CIPHERS[profile];
  const p = PROTOCOLS[profile];

  switch(server.toLowerCase()) {
    case 'apache':
      return `${head}
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

# ${profile} configuration
SSLProtocol             ${profile === 'modern' ? 'all -SSLv3 -TLSv1 -TLSv1.1 -TLSv1.2' : (profile === 'intermediate' ? 'all -SSLv3 -TLSv1 -TLSv1.1' : 'all -SSLv3')}
${profile !== 'modern' ? `SSLCipherSuite          ${c}\n` : ''}SSLHonorCipherOrder     ${profile === 'old' ? 'on' : 'off'}
SSLSessionTickets       off
SSLUseStapling On
SSLStaplingCache "shmcb:logs/ssl_stapling(32768)"`;

    case 'nginx':
      return `${head}
server {
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

    ssl_protocols ${p};
    ${profile !== 'modern' ? `ssl_ciphers ${c};` : ''}
    ssl_prefer_server_ciphers ${profile === 'old' ? 'on' : 'off'};

    add_header Strict-Transport-Security "max-age=63072000" always;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /path/to/root_CA_cert_plus_intermediates;
    resolver 127.0.0.1;
}`;

    case 'redis':
      return `${head}
port 0
tls-port 6379
tls-cluster yes
tls-replication yes

tls-cert-file /path/to/signed_cert_plus_intermediates
tls-key-file /path/to/private_key
tls-ca-cert-file /path/to/ca_certificates.crt
tls-ca-cert-dir /path/to/ca_certificates

tls-dh-params-file /path/to/dhparam
tls-protocols "${p}"
${profile !== 'modern' ? `tls-ciphers ${c}\n` : ''}${profile !== 'old' ? `tls-ciphersuites ${CIPHERS.modern}\n` : ''}tls-prefer-server-ciphers ${profile === 'old' ? 'yes' : 'no'}
`;

    case 'haproxy':
      return `${head}
global
    # ${profile} configuration
    ${profile !== 'modern' ? `ssl-default-bind-ciphers ${c}\n    ssl-default-bind-ciphersuites ${CIPHERS.modern}` : `ssl-default-bind-ciphersuites ${CIPHERS.modern}`}
    ssl-default-bind-options ${profile === 'modern' ? 'prefer-client-ciphers no-sslv3 no-tlsv10 no-tlsv11 no-tlsv12 no-tls-tickets' : 'prefer-client-ciphers no-sslv3 no-tlsv10 no-tlsv11 no-tls-tickets'}

    ${profile !== 'modern' ? `ssl-default-server-ciphers ${c}\n    ssl-default-server-ciphersuites ${CIPHERS.modern}` : `ssl-default-server-ciphersuites ${CIPHERS.modern}`}
    ssl-default-server-options ${profile === 'modern' ? 'no-sslv3 no-tlsv10 no-tlsv11 no-tlsv12 no-tls-tickets' : 'no-sslv3 no-tlsv10 no-tlsv11 no-tls-tickets'}

    ssl-dh-param-file /path/to/dhparam

frontend ft_test
    mode    http
    bind    :443 ssl crt /path/to/<cert+privkey+intermediate> alpn h2,http/1.1
    bind    :80
    redirect scheme https code 301 if !{ ssl_fc }
    http-response set-header Strict-Transport-Security max-age=63072000`;

    case 'aws alb':
    case 'awsalb':
      return `AWSTemplateFormatVersion: 2010-09-09
Description: Mozilla ALB configuration generated for ${server} ${profile}.
Parameters:
  SSLCertificateId:
    Description: The ARN of the ACM SSL certificate
    Type: String
Resources:
  ExampleALBListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      Certificates:
        - CertificateArn: !Ref SSLCertificateId
      Port: 443
      Protocol: HTTPS
      SslPolicy: ${profile === 'intermediate' ? 'ELBSecurityPolicy-FS-1-2-Res-2019-08' : (profile === 'old' ? 'ELBSecurityPolicy-TLS-1-0-2015-04' : 'unsupported')}`;

    case 'aws elb':
    case 'awselb':
      return `AWSTemplateFormatVersion: 2010-09-09
Description: Mozilla ELB configuration generated for ${server} ${profile}.
Resources:
  ExampleELB:
    Type: AWS::ElasticLoadBalancing::LoadBalancer
    Properties:
      Listeners:
        - LoadBalancerPort: '443'
          Protocol: HTTPS
          PolicyNames:
            - Mozilla-${profile}-v5-0
      Policies:
        - PolicyName: Mozilla-${profile}-v5-0
          PolicyType: SSLNegotiationPolicyType
          # Attributes omitted for brevity.`;

    case 'mysql':
      return `${head}
[mysqld]
require_secure_transport = on
ssl-cert = /path/to/signed_cert_plus_intermediates
ssl-key = /path/to/private_key
${profile !== 'modern' ? `ssl-cipher = ${c}\n` : ''}tls_version = ${p.replace(/ /g, ',')}`;

    case 'postgresql':
      return `${head}
ssl = on
ssl_cert_file = '/path/to/signed_cert_plus_intermediates'
ssl_key_file = '/path/to/private_key'
ssl_dh_params_file = '/path/to/dhparam'
${profile !== 'modern' ? `ssl_ciphers = '${c}'\n` : ''}ssl_min_protocol_version = '${profile === 'old' ? 'TLSv1' : (profile === 'intermediate' ? 'TLSv1.2' : 'TLSv1.3')}'`;

    case 'tomcat':
      return `${head}
<Connector port="80" redirectPort="443" />
<Connector port="443" SSLEnabled="true">
    <SSLHostConfig
        ${profile !== 'modern' ? `ciphers="${c}"` : ''}
        disableSessionTickets="true"
        honorCipherOrder="${profile === 'old' ? 'true' : 'false'}"
        protocols="${p.replace(/ /g, ', ')}">
        <Certificate certificateFile="/path/to/signed_certificate" certificateKeyFile="/path/to/private_key" />
    </SSLHostConfig>
</Connector>`;

    case 'caddy':
      return `${head}
example.com
tls {
    protocols ${profile === 'modern' ? 'tls1.3' : (profile === 'intermediate' ? 'tls1.2 tls1.3' : 'tls1.0 tls1.3')}
    ${profile !== 'modern' ? `ciphers ${c.replace(/:/g, ' ')}\n` : ''}}
header / Strict-Transport-Security "max-age=63072000"`;

    case 'dovecot':
      return `${head}
ssl = required
ssl_cert = </path/to/signed_cert_plus_intermediates
ssl_key = </path/to/private_key
ssl_min_protocol = ${profile === 'old' ? 'TLSv1' : (profile === 'intermediate' ? 'TLSv1.2' : 'TLSv1.3')}
${profile !== 'modern' ? `ssl_cipher_list = ${c}\n` : ''}ssl_prefer_server_ciphers = ${profile === 'old' ? 'yes' : 'no'}`;

    case 'exim':
      return `${head}
tls_advertise_hosts = *
tls_certificate = /path/to/signed_cert_plus_intermediates
tls_privatekey = /path/to/private_key
tls_dhparam = /path/to/dhparam
openssl_options = ${profile === 'modern' ? '+no_sslv2 +no_sslv3 +no_tlsv1 +no_tlsv1_1 +no_tlsv1_2' : (profile === 'intermediate' ? '+no_sslv2 +no_sslv3 +no_tlsv1 +no_tlsv1_1' : '+no_sslv2 +no_sslv3')}
${profile !== 'modern' ? `tls_require_ciphers = ${c}\n` : ''}`;

    case 'go':
      return `// ${head}
package main
import ( "crypto/tls" "log" "net/http" )
func main() {
    cfg := &tls.Config{
        MinVersion: ${profile === 'modern' ? 'tls.VersionTLS13' : (profile === 'intermediate' ? 'tls.VersionTLS12' : 'tls.VersionTLS10')},
    }
    srv := &http.Server{ Addr: ":443", TLSConfig: cfg }
    log.Fatal(srv.ListenAndServeTLS("/path/to/cert", "/path/to/key"))
}`;

    case 'jetty':
      return `<!-- ${head} -->
<Configure id="sslContextFactory" class="org.eclipse.jetty.util.ssl.SslContextFactory$Server">
  <Set name="KeyStorePath"> <Property name="jetty.sslContext.keyStorePath" default="/path/to/key_store" /> </Set>
  <Set name="IncludeProtocols"> <Array type="String"> <Item>${profile === 'modern' ? 'TLSv1.3' : (profile === 'intermediate' ? 'TLSv1.2</Item><Item>TLSv1.3' : 'TLSv1</Item><Item>TLSv1.1</Item><Item>TLSv1.2</Item><Item>TLSv1.3')}</Item> </Array> </Set>
</Configure>`;

    case 'lighttpd':
      return `${head}
$HTTP["scheme"] == "https" { setenv.add-response-header = ( "Strict-Transport-Security" => "max-age=63072000" ) }
$SERVER["socket"] == ":443" { ssl.engine = "enable" }
ssl.privkey = "/path/to/private_key"
ssl.pemfile = "/path/to/signed_cert_followed_by_intermediates"
ssl.openssl.ssl-conf-cmd = ("MinProtocol" => "${profile === 'modern' ? 'TLSv1.3' : (profile === 'intermediate' ? 'TLSv1.2' : 'TLSv1')}")
${profile !== 'modern' ? `ssl.openssl.ssl-conf-cmd += ("CipherString" => "${c}")` : ''}
ssl.stapling-file = "/path/to/cert-staple.der"`;

    case 'oracle http':
    case 'oraclehttp':
      return `${head}
<VirtualHost *:443>
    SSLEngine on
    SSLWallet /path/to/wallet
    Header always set Strict-Transport-Security "max-age=63072000"
</VirtualHost>
SSLProtocol ${profile === 'modern' ? 'All -TLSv1 -TLSv1.1 -TLSv1.2' : (profile === 'intermediate' ? 'All -TLSv1 -TLSv1.1' : 'All')}
${profile !== 'modern' ? `SSLCipherSuite ${c}\n` : ''}SSLHonorCipherOrder on`;

    case 'postfix':
      return `${head}
smtpd_tls_security_level = may
smtpd_tls_auth_only = yes
smtpd_tls_cert_file = /path/to/signed_cert_plus_intermediates
smtpd_tls_key_file = /path/to/private_key
smtpd_tls_mandatory_protocols = ${profile === 'modern' ? '!SSLv2, !SSLv3, !TLSv1, !TLSv1.1, !TLSv1.2' : (profile === 'intermediate' ? '!SSLv2, !SSLv3, !TLSv1, !TLSv1.1' : '!SSLv2, !SSLv3')}
${profile !== 'modern' ? `tls_medium_cipherlist = ${c}\n` : ''}`;

    case 'proftpd':
      return `${head}
TLSEngine on
TLSRequired on
TLSCertificateChainFile /path/to/certificate_chain
TLSECCertificateFile /path/to/signed_cert
TLSECCertificateKeyFile /path/to/private_key
TLSDHParamFile /path/to/dhparam
TLSProtocol ${p}
${profile !== 'modern' ? `TLSCipherSuite ${c}\n` : ''}TLSServerCipherPreference ${profile === 'old' ? 'on' : 'off'}
TLSSessionTickets off
TLSStapling on`;

    case 'squid':
      return `${head}
https_port 443 accel defaultsite=example.net tls-cert=/path/to/signed_cert_plus_intermediates tls-key=/path/to/private_key ${profile !== 'modern' ? `cipher=${c}` : ''} options=${profile === 'modern' ? 'NO_SSLv3,NO_TLSv1,NO_TLSv1_1,NO_TLSv1_2,NO_TICKET' : (profile === 'intermediate' ? 'NO_SSLv3,NO_TLSv1,NO_TLSv1_1,NO_TICKET' : 'NO_SSLv3,NO_TICKET')}`;

    case 'traefik':
      return `${head}
[http.routers.router-secure.tls]
  options = "${profile}"
[http.middlewares.hsts-header.headers.customResponseHeaders]
  Strict-Transport-Security = "max-age=63072000"
[[tls.certificates]]
  certFile = "/path/to/signed_cert_plus_intermediates"
  keyFile = "/path/to/private_key"
[tls.options.${profile}]
  minVersion = "${profile === 'modern' ? 'VersionTLS13' : (profile === 'intermediate' ? 'VersionTLS12' : 'TLSv1')}"`;
      
    default:
      return `${head}
# Supported configuration snippet not found for ${server}.
# Please refer to the official documentation.`;
  }
}
