export const SERVER_CONFIGS_PART_3: Record<string, Record<string, string>> = {
  'oracle http': {
    intermediate: `<VirtualHost *:80>
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
<VirtualHost *:443>
    SSLEngine on
    SSLWallet /path/to/wallet
    Header always set Strict-Transport-Security "max-age=63072000"
</VirtualHost>
SSLProtocol             All -TLSv1 -TLSv1.1
SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
SSLHonorCipherOrder     on`,
    modern: `# unfortunately, Oracle HTTP 12.2.1 and OpenSSL 1.1.1k does not support the modern configuration`,
    old: `<VirtualHost *:80>
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
<VirtualHost *:443>
    SSLEngine on
    SSLWallet /path/to/wallet
    Header always set Strict-Transport-Security "max-age=63072000"
</VirtualHost>
SSLProtocol             All
SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
SSLHonorCipherOrder     on`
  },
  postfix: {
    intermediate: `smtpd_tls_security_level = may
smtpd_tls_auth_only = yes
smtpd_tls_cert_file = /path/to/signed_cert_plus_intermediates
smtpd_tls_key_file = /path/to/private_key
smtpd_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
smtpd_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
smtpd_tls_mandatory_ciphers = medium
smtpd_tls_dh1024_param_file = /path/to/dhparam

tls_medium_cipherlist = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
tls_preempt_cipherlist = no`,
    modern: `smtpd_tls_security_level = may
smtpd_tls_auth_only = yes
smtpd_tls_cert_file = /path/to/signed_cert_plus_intermediates
smtpd_tls_key_file = /path/to/private_key
smtpd_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1, !TLSv1.2
smtpd_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1, !TLSv1.2
tls_preempt_cipherlist = no`,
    old: `smtpd_tls_security_level = may
smtpd_tls_auth_only = yes
smtpd_tls_cert_file = /path/to/signed_cert_plus_intermediates
smtpd_tls_key_file = /path/to/private_key
smtpd_tls_mandatory_protocols = !SSLv2, !SSLv3
smtpd_tls_protocols = !SSLv2, !SSLv3
smtpd_tls_mandatory_ciphers = medium
smtpd_tls_dh1024_param_file = /path/to/dhparam

tls_medium_cipherlist = ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
tls_preempt_cipherlist = yes`
  },
  postgresql: {
    intermediate: `ssl = on
ssl_cert_file = '/path/to/signed_cert_plus_intermediates'
ssl_key_file = '/path/to/private_key'
ssl_dh_params_file = '/path/to/dhparam'
ssl_ciphers = 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305'
ssl_min_protocol_version = 'TLSv1.2'`,
    modern: `ssl = on
ssl_cert_file = '/path/to/signed_cert_plus_intermediates'
ssl_key_file = '/path/to/private_key'
ssl_min_protocol_version = 'TLSv1.3'`,
    old: `ssl = on
ssl_cert_file = '/path/to/signed_cert_plus_intermediates'
ssl_key_file = '/path/to/private_key'
ssl_dh_params_file = '/path/to/dhparam'
ssl_ciphers = 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA'
ssl_min_protocol_version = 'TLSv1'`
  },
  proftpd: {
    intermediate: `TLSEngine                     on
TLSRequired                   on
TLSCertificateChainFile       /path/to/certificate_chain
TLSECCertificateFile          /path/to/signed_cert
TLSECCertificateKeyFile       /path/to/private_key
TLSDHParamFile                /path/to/dhparam
TLSProtocol                   TLSv1.2 TLSv1.3
TLSCipherSuite                ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305
TLSServerCipherPreference     off
TLSSessionTickets              off
TLSStapling                   on
TLSStaplingCache              "shmcb:logs/ssl_stapling(32768)"`,
    modern: `TLSEngine                     on
TLSRequired                   on
TLSCertificateChainFile       /path/to/certificate_chain
TLSECCertificateFile          /path/to/signed_cert
TLSECCertificateKeyFile       /path/to/private_key
TLSProtocol                   TLSv1.3
TLSServerCipherPreference     off
TLSSessionTickets              off
TLSStapling                   on
TLSStaplingCache              "shmcb:logs/ssl_stapling(32768)"`,
    old: `TLSEngine                     on
TLSRequired                   on
TLSCertificateChainFile       /path/to/certificate_chain
TLSECCertificateFile          /path/to/signed_cert
TLSECCertificateKeyFile       /path/to/private_key
TLSDHParamFile                /path/to/dhparam
TLSProtocol                   TLSv1 TLSv1.1 TLSv1.2 TLSv1.3
TLSCipherSuite                ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA
TLSServerCipherPreference     on
TLSSessionTickets              off
TLSStapling                   on
TLSStaplingCache              "shmcb:logs/ssl_stapling(32768)"`
  }
};
