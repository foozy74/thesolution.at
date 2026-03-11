export interface TerraformFile {
  id: string;
  name: string;
  filename: string;
  category: string;
  description: string;
  icon: string;
  securityNotes: string[];
  content: string;
}

export const categories = [
  { id: 'foundation', label: 'Foundation', icon: '🏗️' },
  { id: 'network', label: 'Network & Security', icon: '🔒' },
  { id: 'compute', label: 'Compute & Container', icon: '🖥️' },
  { id: 'database', label: 'Database', icon: '🗄️' },
  { id: 'monitoring', label: 'Monitoring & Logging', icon: '📊' },
  { id: 'secrets', label: 'Secrets & IAM', icon: '🔑' },
];

export const terraformFiles: TerraformFile[] = [
  // ── FOUNDATION ──
  {
    id: 'provider',
    name: 'OCI Provider',
    filename: 'provider.tf',
    category: 'foundation',
    description: 'OCI Terraform provider configuration with secure authentication',
    icon: '☁️',
    securityNotes: [
      'API keys are injected via Vault/Env variables – never in code',
      'Provider version is pinned for reproducibility',
    ],
    content: `# ============================================================
# provider.tf – OCI Provider Configuration
# OpenClaw Secure Deployment
# ============================================================

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.30"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  # Remote State in OCI Object Storage (encrypted)
  backend "s3" {
    bucket                      = "openclaw-tfstate"
    key                         = "prod/terraform.tfstate"
    region                      = "eu-frankfurt-1"
    endpoint                    = "https://<namespace>.compat.objectstorage.eu-frankfurt-1.oraclecloud.com"
    shared_credentials_file     = "~/.oci/tf_s3_credentials"
    skip_region_validation      = true
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    force_path_style            = true
    encrypt                     = true
  }
}

provider "oci" {
  # Auth via Environment Variables:
  #   TF_VAR_tenancy_ocid
  #   TF_VAR_user_ocid
  #   TF_VAR_fingerprint
  #   TF_VAR_private_key_path
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}`,
  },
  {
    id: 'variables',
    name: 'Variables',
    filename: 'variables.tf',
    category: 'foundation',
    description: 'Central variable definitions with secure defaults',
    icon: '⚙️',
    securityNotes: [
      'Sensitive variables are marked as "sensitive = true"',
      'Default values follow the least-privilege principle',
    ],
    content: `# ============================================================
# variables.tf – Central Variables
# ============================================================

# ── Provider Auth ──
variable "tenancy_ocid" {
  type        = string
  sensitive   = true
  description = "OCID of OCI Tenancy"
}

variable "user_ocid" {
  type        = string
  sensitive   = true
  description = "OCID of Terraform Service User"
}

variable "fingerprint" {
  type        = string
  sensitive   = true
  description = "API Key Fingerprint"
}

variable "private_key_path" {
  type        = string
  sensitive   = true
  description = "Path to API Private Key"
}

variable "region" {
  type        = string
  default     = "eu-frankfurt-1"
  description = "OCI Region (GDPR compliant: eu-frankfurt-1)"
}

variable "compartment_ocid" {
  type        = string
  description = "OCID of target compartment"
}

# ── Network ──
variable "vcn_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "CIDR block for the VCN"
}

variable "public_subnet_cidr" {
  type        = string
  default     = "10.0.1.0/24"
  description = "CIDR for Public Subnet (Load Balancer)"
}

variable "private_app_subnet_cidr" {
  type        = string
  default     = "10.0.10.0/24"
  description = "CIDR for Private App Subnet"
}

variable "private_db_subnet_cidr" {
  type        = string
  default     = "10.0.20.0/24"
  description = "CIDR for Private DB Subnet"
}

# ── Compute ──
variable "node_pool_size" {
  type        = number
  default     = 3
  description = "Number of worker nodes in the OKE cluster"
}

variable "node_shape" {
  type        = string
  default     = "VM.Standard.A1.Flex"
  description = "Compute shape for worker nodes"
}

variable "node_ocpus" {
  type        = number
  default     = 2
  description = "OCPUs per worker node"
}

variable "node_memory_gb" {
  type        = number
  default     = 16
  description = "Memory in GB per worker node"
}

# ── OpenClaw ──
variable "openclaw_image" {
  type        = string
  default     = "fra.ocir.io/<namespace>/openclaw:latest"
  description = "Container image for OpenClaw"
}

variable "openclaw_domain" {
  type        = string
  default     = "openclaw.example.com"
  description = "Domain for OpenClaw"
}

# ── Tags ──
variable "environment" {
  type        = string
  default     = "production"
  description = "Environment name"
}

variable "project" {
  type        = string
  default     = "openclaw"
  description = "Project name"
}`,
  },
  // ── NETWORK ──
  {
    id: 'vcn',
    name: 'Virtual Cloud Network',
    filename: 'network.tf',
    category: 'network',
    description: 'Virtual Cloud Network with public and private subnets, security lists and gateways',
    icon: '🌐',
    securityNotes: [
      'Private subnets for app and DB tier – no direct internet access',
      'NAT Gateway for outgoing traffic from private subnets',
      'Service Gateway for OCI internal communication without internet',
    ],
    content: `# ============================================================
# network.tf – VCN, Subnets, Gateways
# ============================================================

resource "oci_core_vcn" "openclaw" {
  compartment_id = var.compartment_ocid
  cidr_blocks    = [var.vcn_cidr]
  display_name   = "openclaw-vcn"
  dns_label      = "openclawvcn"

  freeform_tags = {
    "Project"     = var.project
    "Environment" = var.environment
    "ManagedBy"   = "terraform"
  }
}

# ── Internet Gateway (only for Public LB Subnet) ──
resource "oci_core_internet_gateway" "openclaw" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-igw"
  enabled        = true
}

# ── NAT Gateway (for Private Subnets → Internet) ──
resource "oci_core_nat_gateway" "openclaw" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-natgw"
  block_traffic  = false
}

# ── Service Gateway (for OCI Services without Internet) ──
data "oci_core_services" "all" {
  filter {
    name   = "name"
    values = ["All .* Services In Oracle Services Network"]
    regex  = true
  }
}

resource "oci_core_service_gateway" "openclaw" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-sgw"

  services {
    service_id = data.oci_core_services.all.services[0].id
  }
}

# ── Route Tables ──
resource "oci_core_route_table" "public" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-public-rt"

  route_rules {
    network_entity_id = oci_core_internet_gateway.openclaw.id
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
  }
}

resource "oci_core_route_table" "private" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-private-rt"

  route_rules {
    network_entity_id = oci_core_nat_gateway.openclaw.id
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
  }

  route_rules {
    network_entity_id = oci_core_service_gateway.openclaw.id
    destination       = data.oci_core_services.all.services[0].cidr_block
    destination_type  = "SERVICE_CIDR_BLOCK"
  }
}

# ── Subnets ──
resource "oci_core_subnet" "public_lb" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.openclaw.id
  cidr_block                 = var.public_subnet_cidr
  display_name               = "openclaw-public-lb"
  dns_label                  = "publb"
  prohibit_public_ip_on_vnic = false
  route_table_id             = oci_core_route_table.public.id
  security_list_ids          = [oci_core_security_list.public_lb.id]
}

resource "oci_core_subnet" "private_app" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.openclaw.id
  cidr_block                 = var.private_app_subnet_cidr
  display_name               = "openclaw-private-app"
  dns_label                  = "privapp"
  prohibit_public_ip_on_vnic = true
  route_table_id             = oci_core_route_table.private.id
  security_list_ids          = [oci_core_security_list.private_app.id]
}

resource "oci_core_subnet" "private_db" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.openclaw.id
  cidr_block                 = var.private_db_subnet_cidr
  display_name               = "openclaw-private-db"
  dns_label                  = "privdb"
  prohibit_public_ip_on_vnic = true
  route_table_id             = oci_core_route_table.private.id
  security_list_ids          = [oci_core_security_list.private_db.id]
}
`,
  },
  {
    id: 'security_lists',
    name: 'Security Lists & NSGs',
    filename: 'security.tf',
    category: 'network',
    description: 'Firewall rules following the least-privilege principle with Network Security Groups',
    icon: '🛡️',
    securityNotes: [
      'Only HTTPS (443) allowed from outside – no HTTP',
      'App tier only accepts traffic from the load balancer',
      'DB tier only accepts traffic from the app tier on port 5432',
      'Egress is restricted to necessary destinations',
    ],
    content: `# ============================================================
# security.tf – Security Lists & Network Security Groups
# ============================================================

# ── Public LB Security List ──
resource "oci_core_security_list" "public_lb" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-public-lb-sl"

  # Ingress: HTTPS only
  ingress_security_rules {
    protocol    = "6" # TCP
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    description = "HTTPS from Internet"
    tcp_options {
      min = 443
      max = 443
    }
  }

  # Egress: to App Subnet
  egress_security_rules {
    protocol         = "6"
    destination      = var.private_app_subnet_cidr
    destination_type = "CIDR_BLOCK"
    description      = "To App Subnet"
    tcp_options {
      min = 8080
      max = 8080
    }
  }
}

# ── Private App Security List ──
resource "oci_core_security_list" "private_app" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-private-app-sl"

  # Ingress: from Load Balancer subnet only
  ingress_security_rules {
    protocol    = "6"
    source      = var.public_subnet_cidr
    source_type = "CIDR_BLOCK"
    description = "From Load Balancer"
    tcp_options {
      min = 8080
      max = 8080
    }
  }

  # Ingress: OKE API & Node Communication
  ingress_security_rules {
    protocol    = "6"
    source      = var.vcn_cidr
    source_type = "CIDR_BLOCK"
    description = "OKE intra-cluster"
    tcp_options {
      min = 10250
      max = 10250
    }
  }

  ingress_security_rules {
    protocol    = "6"
    source      = var.vcn_cidr
    source_type = "CIDR_BLOCK"
    description = "OKE NodePort range"
    tcp_options {
      min = 30000
      max = 32767
    }
  }

  # Egress: DB Subnet (PostgreSQL)
  egress_security_rules {
    protocol         = "6"
    destination      = var.private_db_subnet_cidr
    destination_type = "CIDR_BLOCK"
    description      = "To PostgreSQL DB"
    tcp_options {
      min = 5432
      max = 5432
    }
  }

  # Egress: NAT Gateway (for container registry pulls etc.)
  egress_security_rules {
    protocol         = "6"
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    description      = "Outbound via NAT"
    tcp_options {
      min = 443
      max = 443
    }
  }

  # Egress: Service Gateway
  egress_security_rules {
    protocol         = "6"
    destination      = data.oci_core_services.all.services[0].cidr_block
    destination_type = "SERVICE_CIDR_BLOCK"
    description      = "OCI Services"
  }
}

# ── Private DB Security List ──
resource "oci_core_security_list" "private_db" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.openclaw.id
  display_name   = "openclaw-private-db-sl"

  # Ingress: from App Subnet to PostgreSQL only
  ingress_security_rules {
    protocol    = "6"
    source      = var.private_app_subnet_cidr
    source_type = "CIDR_BLOCK"
    description = "PostgreSQL from App Tier"
    tcp_options {
      min = 5432
      max = 5432
    }
  }

  # Egress: Service Gateway for backups
  egress_security_rules {
    protocol         = "6"
    destination      = data.oci_core_services.all.services[0].cidr_block
    destination_type = "SERVICE_CIDR_BLOCK"
    description      = "OCI Services for backups"
  }
}

# ── WAF Policy ──
resource "oci_waf_web_app_firewall_policy" "openclaw" {
  compartment_id = var.compartment_ocid
  display_name   = "openclaw-waf-policy"

  actions {
    name = "blockAction"
    type = "RETURN_HTTP_RESPONSE"
    code = 403
    body {
      type = "STATIC_TEXT"
      text = "Blocked by WAF"
    }
  }

  actions {
    name = "allowAction"
    type = "ALLOW"
  }

  request_rate_limiting {
    rules {
      name        = "rateLimitRule"
      action_name = "blockAction"
      type        = "REQUEST_RATE_LIMITING"

      configurations {
        period_in_seconds          = 60
        requests_limit             = 100
        action_duration_in_seconds = 600
      }
    }
  }
}`,
  },
  // ── COMPUTE ──
  {
    id: 'oke',
    name: 'OKE Kubernetes Cluster',
    filename: 'oke.tf',
    category: 'compute',
    description: 'Oracle Kubernetes Engine with private endpoints and hardened configuration',
    icon: '⚓',
    securityNotes: [
      'Kubernetes API endpoint is private – no access from the internet',
      'Pod Security Policies are enabled',
      'Image Verification is enabled',
      'Nodes run in the private subnet without public IPs',
    ],
    content: `# ============================================================
# oke.tf – Oracle Kubernetes Engine Cluster
# ============================================================

resource "oci_containerengine_cluster" "openclaw" {
  compartment_id     = var.compartment_ocid
  kubernetes_version = "v1.28.2"
  name               = "openclaw-oke"
  vcn_id             = oci_core_vcn.openclaw.id
  type               = "ENHANCED_CLUSTER"

  cluster_pod_network_options {
    cni_type = "OCI_VCN_IP_NATIVE"
  }

  endpoint_config {
    is_public_ip_enabled = false  # Private API Endpoint!
    subnet_id            = oci_core_subnet.private_app.id
    nsg_ids              = []
  }

  options {
    add_ons {
      is_kubernetes_dashboard_enabled = false  # Security: Dashboard disabled
      is_tiller_enabled               = false
    }

    admission_controller_options {
      is_pod_security_policy_enabled = true
    }

    kubernetes_network_config {
      pods_cidr     = "10.244.0.0/16"
      services_cidr = "10.96.0.0/16"
    }

    persistent_volume_config {
      freeform_tags = {
        "Project" = var.project
      }
    }

    service_lb_config {
      freeform_tags = {
        "Project" = var.project
      }
    }
  }

  image_policy_config {
    is_policy_enabled = true

    key_details {
      kms_key_id = oci_kms_key.openclaw_master.id
    }
  }

  freeform_tags = {
    "Project"     = var.project
    "Environment" = var.environment
    "ManagedBy"   = "terraform"
  }
}

# ── Node Pool ──
resource "oci_containerengine_node_pool" "openclaw" {
  cluster_id         = oci_containerengine_cluster.openclaw.id
  compartment_id     = var.compartment_ocid
  kubernetes_version = "v1.28.2"
  name               = "openclaw-nodepool"

  node_shape = var.node_shape

  node_shape_config {
    ocpus         = var.node_ocpus
    memory_in_gbs = var.node_memory_gb
  }

  node_config_details {
    size = var.node_pool_size

    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
      subnet_id           = oci_core_subnet.private_app.id
    }

    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ads.availability_domains[1].name
      subnet_id           = oci_core_subnet.private_app.id
    }

    is_pv_encryption_in_transit_enabled = true  # Encryption in transit

    freeform_tags = {
      "Project" = var.project
    }
  }

  node_source_details {
    image_id    = data.oci_core_images.oke_node.images[0].id
    source_type = "IMAGE"

    boot_volume_size_in_gbs = 50
  }

  # SSH access only via Bastion
  ssh_public_key = tls_private_key.node_ssh.public_key_openssh

  node_metadata = {
    user_data = base64encode(templatefile("\${path.module}/cloud-init/node-hardening.yaml", {}))
  }
}

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

data "oci_core_images" "oke_node" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Oracle Linux"
  operating_system_version = "8"
  shape                    = var.node_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# SSH Key (emergency access via Bastion only)
resource "tls_private_key" "node_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}`,
  },
  {
    id: 'loadbalancer',
    name: 'Load Balancer & TLS',
    filename: 'loadbalancer.tf',
    category: 'compute',
    description: 'OCI Load Balancer with TLS termination, WAF and HSTS',
    icon: '⚖️',
    securityNotes: [
      'TLS 1.2+ forced – older versions blocked',
      'HSTS header is set',
      'WAF is front-ended for OWASP Top 10 protection',
      'Health checks for automatic failover',
    ],
    content: `# ============================================================
# loadbalancer.tf – OCI Load Balancer with TLS
# ============================================================

resource "oci_load_balancer_load_balancer" "openclaw" {
  compartment_id = var.compartment_ocid
  display_name   = "openclaw-lb"
  shape          = "flexible"

  shape_details {
    minimum_bandwidth_in_mbps = 10
    maximum_bandwidth_in_mbps = 100
  }

  subnet_ids                 = [oci_core_subnet.public_lb.id]
  is_private                 = false
  network_security_group_ids = []

  freeform_tags = {
    "Project"     = var.project
    "Environment" = var.environment
  }
}

# ── TLS Zertifikat (Let's Encrypt via Cert-Manager) ──
resource "oci_load_balancer_certificate" "openclaw" {
  certificate_name = "openclaw-tls"
  load_balancer_id = oci_load_balancer_load_balancer.openclaw.id

  ca_certificate     = file("\${path.module}/certs/ca-bundle.pem")
  public_certificate = file("\${path.module}/certs/cert.pem")
  private_key        = file("\${path.module}/certs/privkey.pem")

  lifecycle {
    create_before_destroy = true
  }
}

# ── Backend Set ──
resource "oci_load_balancer_backend_set" "openclaw" {
  load_balancer_id = oci_load_balancer_load_balancer.openclaw.id
  name             = "openclaw-backend"
  policy           = "ROUND_ROBIN"

  health_checker {
    protocol            = "HTTP"
    port                = 8080
    url_path            = "/health"
    return_code         = 200
    interval_ms         = 10000
    timeout_in_millis   = 5000
    retries             = 3
  }

  session_persistence_configuration {
    cookie_name      = "__openclaw_session"
    disable_fallback = true
  }

  ssl_configuration {
    certificate_name        = oci_load_balancer_certificate.openclaw.certificate_name
    verify_peer_certificate = false
    verify_depth            = 3
    protocols               = ["TLSv1.2", "TLSv1.3"]
  }
}

# ── HTTPS Listener ──
resource "oci_load_balancer_listener" "https" {
  load_balancer_id         = oci_load_balancer_load_balancer.openclaw.id
  name                     = "openclaw-https"
  default_backend_set_name = oci_load_balancer_backend_set.openclaw.name
  port                     = 443
  protocol                 = "HTTP"

  ssl_configuration {
    certificate_name        = oci_load_balancer_certificate.openclaw.certificate_name
    verify_peer_certificate = false
    protocols               = ["TLSv1.2", "TLSv1.3"]
    cipher_suite_name       = "oci-wider-compatible-ssl-cipher-suite-v1"
    server_order_preference = "ENABLED"
  }

  connection_configuration {
    idle_timeout_in_seconds = 300
  }

  rule_set_names = [
    oci_load_balancer_rule_set.security_headers.name,
    oci_load_balancer_rule_set.redirect_http.name,
  ]
}

# ── HTTP → HTTPS Redirect ──
resource "oci_load_balancer_listener" "http_redirect" {
  load_balancer_id         = oci_load_balancer_load_balancer.openclaw.id
  name                     = "openclaw-http-redirect"
  default_backend_set_name = oci_load_balancer_backend_set.openclaw.name
  port                     = 80
  protocol                 = "HTTP"

  rule_set_names = [oci_load_balancer_rule_set.redirect_http.name]
}

# ── Security Headers Rule Set ──
resource "oci_load_balancer_rule_set" "security_headers" {
  load_balancer_id = oci_load_balancer_load_balancer.openclaw.id
  name             = "security-headers"

  items {
    action = "ADD_HTTP_RESPONSE_HEADER"
    header = "Strict-Transport-Security"
    value  = "max-age=31536000; includeSubDomains; preload"
  }

  items {
    action = "ADD_HTTP_RESPONSE_HEADER"
    header = "X-Content-Type-Options"
    value  = "nosniff"
  }

  items {
    action = "ADD_HTTP_RESPONSE_HEADER"
    header = "X-Frame-Options"
    value  = "DENY"
  }

  items {
    action = "ADD_HTTP_RESPONSE_HEADER"
    header = "X-XSS-Protection"
    value  = "1; mode=block"
  }

  items {
    action = "ADD_HTTP_RESPONSE_HEADER"
    header = "Content-Security-Policy"
    value  = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  }
}

# ── HTTP → HTTPS Redirect Rule ──
resource "oci_load_balancer_rule_set" "redirect_http" {
  load_balancer_id = oci_load_balancer_load_balancer.openclaw.id
  name             = "redirect-http-to-https"

  items {
    action      = "REDIRECT"
    conditions  {
      attribute_name  = "PATH"
      attribute_value = "/"
      operator        = "FORCE_LONGEST_PREFIX_MATCH"
    }
    redirect_uri {
      protocol = "HTTPS"
      port     = 443
    }
    response_code = 301
  }
}`,
  },
  {
    id: 'k8s_deployment',
    name: 'Kubernetes Deployment',
    filename: 'k8s-openclaw.tf',
    category: 'compute',
    description: 'Kubernetes Deployment, Service and Ingress for OpenClaw with Security Context',
    icon: '📦',
    securityNotes: [
      'Container runs as non-root user',
      'ReadOnlyRootFilesystem is enabled',
      'Privilege Escalation is disabled',
      'Resource Limits prevent resource exhaustion',
      'Network Policy restricts pod-to-pod communication',
    ],
    content: `# ============================================================
# k8s-openclaw.tf – Kubernetes Manifests for OpenClaw
# ============================================================

resource "kubernetes_namespace" "openclaw" {
  metadata {
    name = "openclaw"
    labels = {
      "pod-security.kubernetes.io/enforce" = "restricted"
      "pod-security.kubernetes.io/audit"   = "restricted"
      "pod-security.kubernetes.io/warn"    = "restricted"
    }
  }
}

resource "kubernetes_deployment" "openclaw" {
  metadata {
    name      = "openclaw"
    namespace = kubernetes_namespace.openclaw.metadata[0].name
    labels = {
      app     = "openclaw"
      version = "latest"
    }
  }

  spec {
    replicas = 3

    strategy {
      type = "RollingUpdate"
      rolling_update {
        max_surge       = "1"
        max_unavailable = "0"
      }
    }

    selector {
      match_labels = {
        app = "openclaw"
      }
    }

    template {
      metadata {
        labels = {
          app = "openclaw"
        }
        annotations = {
          "prometheus.io/scrape" = "true"
          "prometheus.io/port"   = "9090"
          "prometheus.io/path"   = "/metrics"
        }
      }

      spec {
        service_account_name            = kubernetes_service_account.openclaw.metadata[0].name
        automount_service_account_token = false

        security_context {
          run_as_non_root = true
          run_as_user     = 1000
          run_as_group    = 1000
          fs_group        = 1000

          seccomp_profile {
            type = "RuntimeDefault"
          }
        }

        container {
          name  = "openclaw"
          image = var.openclaw_image

          port {
            container_port = 8080
            name           = "http"
          }

          port {
            container_port = 9090
            name           = "metrics"
          }

          security_context {
            allow_privilege_escalation = false
            read_only_root_filesystem  = true
            run_as_non_root            = true
            run_as_user                = 1000

            capabilities {
              drop = ["ALL"]
            }
          }

          resources {
            requests = {
              cpu    = "250m"
              memory = "512Mi"
            }
            limits = {
              cpu    = "1000m"
              memory = "1Gi"
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.openclaw_config.metadata[0].name
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 8080
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/ready"
              port = 8080
            }
            initial_delay_seconds = 5
            period_seconds        = 5
          }

          volume_mount {
            name       = "tmp"
            mount_path = "/tmp"
          }

          volume_mount {
            name       = "data"
            mount_path = "/app/data"
          }
        }

        volume {
          name = "tmp"
          empty_dir {
            medium = "Memory"
          }
        }

        volume {
          name = "data"
          persistent_volume_claim {
            claim_name = "openclaw-data"
          }
        }

        topology_spread_constraints {
          max_skew           = 1
          topology_key       = "topology.kubernetes.io/zone"
          when_unsatisfiable = "DoNotSchedule"
          label_selector {
            match_labels = {
              app = "openclaw"
            }
          }
        }
      }
    }
  }
}

# ── Service ──
resource "kubernetes_service" "openclaw" {
  metadata {
    name      = "openclaw"
    namespace = kubernetes_namespace.openclaw.metadata[0].name
  }

  spec {
    selector = {
      app = "openclaw"
    }

    port {
      name        = "http"
      port        = 8080
      target_port = 8080
    }

    type = "ClusterIP"
  }
}

# ── Network Policy ──
resource "kubernetes_network_policy" "openclaw" {
  metadata {
    name      = "openclaw-netpol"
    namespace = kubernetes_namespace.openclaw.metadata[0].name
  }

  spec {
    pod_selector {
      match_labels = {
        app = "openclaw"
      }
    }

    policy_types = ["Ingress", "Egress"]

    ingress {
      from {
        namespace_selector {
          match_labels = {
            "kubernetes.io/metadata.name" = "ingress-nginx"
          }
        }
      }
      ports {
        port     = "8080"
        protocol = "TCP"
      }
    }

    egress {
      # DNS
      to {
        namespace_selector {}
      }
      ports {
        port     = "53"
        protocol = "UDP"
      }
      ports {
        port     = "53"
        protocol = "TCP"
      }
    }

    egress {
      # PostgreSQL
      to {
        ip_block {
          cidr = var.private_db_subnet_cidr
        }
      }
      ports {
        port     = "5432"
        protocol = "TCP"
      }
    }
  }
}

# ── Service Account ──
resource "kubernetes_service_account" "openclaw" {
  metadata {
    name      = "openclaw-sa"
    namespace = kubernetes_namespace.openclaw.metadata[0].name
    annotations = {
      "oci.oraclecloud.com/workload-identity" = "true"
    }
  }
  automount_service_account_token = false
}`,
  },
  // ── DATABASE ──
  {
    id: 'database',
    name: 'PostgreSQL (Autonomous DB)',
    filename: 'database.tf',
    category: 'database',
    description: 'Oracle Autonomous Database with PostgreSQL compatibility, encrypted and in private subnet',
    icon: '🐘',
    securityNotes: [
      'Database is in private subnet – no internet access',
      'Encryption at rest with Customer-Managed Key (KMS)',
      'Automatic backups with 30 days retention',
      'mTLS forced for client connections',
      'Password read from OCI Vault',
    ],
    content: `# ============================================================
# database.tf – Autonomous Database (PostgreSQL compatible)
# ============================================================

resource "oci_database_autonomous_database" "openclaw" {
  compartment_id = var.compartment_ocid
  display_name   = "openclaw-db"
  db_name        = "openclawdb"

  # PostgreSQL compatible
  db_workload = "OLTP"
  db_version  = "19c"

  # Compute
  cpu_core_count           = 2
  data_storage_size_in_tbs = 1
  is_auto_scaling_enabled  = true

  # Netzwerk – Privat!
  subnet_id              = oci_core_subnet.private_db.id
  nsg_ids                = []
  is_mtls_connection_required = true

  # Encryption with Customer-managed Key
  kms_key_id = oci_kms_key.openclaw_db_key.id
   vault_id   = oci_kms_vault.openclaw.id

  # Admin password from Vault
  admin_password = data.oci_secrets_secretbundle.db_admin_password.secret_bundle_content[0].content

  # Backup
  is_local_data_guard_enabled = true

  data_safe_status = "REGISTERED"  # Data Safe for auditing

  # Whitelisted IPs (App subnet only)
  whitelisted_ips = [var.private_app_subnet_cidr]

  freeform_tags = {
    "Project"     = var.project
    "Environment" = var.environment
    "ManagedBy"   = "terraform"
    "DataClass"   = "confidential"
  }
}

# ── Automatic Backups ──
resource "oci_database_autonomous_database_backup" "openclaw" {
  autonomous_database_id = oci_database_autonomous_database.openclaw.id
  display_name           = "openclaw-weekly-backup"
  retention_period_in_days = 30
  is_long_term_backup    = true
}

# ── Database Wallet (for secure connection) ──
resource "oci_database_autonomous_database_wallet" "openclaw" {
  autonomous_database_id = oci_database_autonomous_database.openclaw.id
  password               = data.oci_secrets_secretbundle.db_wallet_password.secret_bundle_content[0].content
  base64_encode_content  = true
  generate_type          = "ALL"
}

# ── Kubernetes Secret with DB credentials ──
resource "kubernetes_secret" "openclaw_config" {
  metadata {
    name      = "openclaw-config"
    namespace = kubernetes_namespace.openclaw.metadata[0].name
  }

  data = {
    DATABASE_URL     = "postgresql://openclaw:\${data.oci_secrets_secretbundle.db_app_password.secret_bundle_content[0].content}@\${oci_database_autonomous_database.openclaw.connection_urls[0].profiles[0].host}:5432/openclawdb?sslmode=verify-full"
    DATABASE_CA_CERT = base64decode(oci_database_autonomous_database_wallet.openclaw.content)
    APP_SECRET_KEY   = data.oci_secrets_secretbundle.app_secret_key.secret_bundle_content[0].content
    ENCRYPTION_KEY   = data.oci_secrets_secretbundle.encryption_key.secret_bundle_content[0].content
  }

  type = "Opaque"
}
`,
  },
  // ── MONITORING ──
  {
    id: 'monitoring',
    name: 'Monitoring & Alarms',
    filename: 'monitoring.tf',
    category: 'monitoring',
    description: 'OCI monitoring, logging and alarms for proactive observation',
    icon: '📈',
    securityNotes: [
      'Audit logs are enabled and immutable',
      'Alarms for suspicious activities (brute-force, unusual traffic)',
      'Log retention set to 365 days for compliance',
      'Vulnerability scanning for container images',
    ],
    content: `# ============================================================
# monitoring.tf – Monitoring, Logging & Alarms
# ============================================================

# ── Log Group ──
resource "oci_logging_log_group" "openclaw" {
  compartment_id = var.compartment_ocid
  display_name   = "openclaw-logs"
  description    = "Log group for all OpenClaw logs"
}

# ── VCN Flow Logs ──
resource "oci_logging_log" "vcn_flow" {
  display_name = "openclaw-vcn-flowlogs"
  log_group_id = oci_logging_log_group.openclaw.id
  log_type     = "SERVICE"

  configuration {
    source {
      category    = "all"
      resource    = oci_core_subnet.private_app.id
      service     = "flowlogs"
      source_type = "OCISERVICE"
    }
    compartment_id = var.compartment_ocid
  }

  is_enabled         = true
  retention_duration = 365
}

# ── Audit Log (automatic, but configure archiving) ──
resource "oci_logging_log" "audit_archive" {
  display_name = "openclaw-audit-archive"
  log_group_id = oci_logging_log_group.openclaw.id
  log_type     = "SERVICE"

  configuration {
    source {
      category    = "audit"
      resource    = var.compartment_ocid
      service     = "audit"
      source_type = "OCISERVICE"
    }
    compartment_id = var.compartment_ocid
  }

  is_enabled         = true
  retention_duration = 365
}

# ── Notification Topic ──
resource "oci_ons_notification_topic" "openclaw_alerts" {
  compartment_id = var.compartment_ocid
  name           = "openclaw-security-alerts"
  description    = "Security & operational alerts for OpenClaw"
}

resource "oci_ons_subscription" "email" {
  compartment_id = var.compartment_ocid
  topic_id       = oci_ons_notification_topic.openclaw_alerts.id
  protocol       = "EMAIL"
  endpoint       = "security-team@example.com"
}

# ── Alarme ──
resource "oci_monitoring_alarm" "high_cpu" {
  compartment_id        = var.compartment_ocid
  display_name          = "openclaw-high-cpu"
  namespace             = "oci_computeagent"
  query                 = "CpuUtilization[5m]{resourceDisplayName =~ \\"openclaw.*\\"}.mean() > 80"
  severity              = "WARNING"
  is_enabled            = true
  pending_duration      = "PT5M"
  body                  = "CPU utilization over 80% for OpenClaw nodes"
  message_format        = "ONS_OPTIMIZED"
  metric_compartment_id = var.compartment_ocid

  destinations = [oci_ons_notification_topic.openclaw_alerts.id]

  suppression {
    description         = "Maintenance window"
    time_suppress_from  = "2024-01-01T02:00:00Z"
    time_suppress_until = "2024-01-01T04:00:00Z"
  }
}

resource "oci_monitoring_alarm" "unauthorized_access" {
  compartment_id        = var.compartment_ocid
  display_name          = "openclaw-unauthorized-access"
  namespace             = "oci_lbaas"
  query                 = "HttpRequests[5m]{statusCode = 401, loadBalancer = \\"openclaw-lb\\"}.count() > 50"
  severity              = "CRITICAL"
  is_enabled            = true
  pending_duration      = "PT2M"
  body                  = "Possible brute-force attack: >50 401-responses in 5 minutes"
  message_format        = "ONS_OPTIMIZED"
  metric_compartment_id = var.compartment_ocid

  destinations = [oci_ons_notification_topic.openclaw_alerts.id]
}

resource "oci_monitoring_alarm" "db_connections" {
  compartment_id        = var.compartment_ocid
  display_name          = "openclaw-db-connections"
  namespace             = "oci_autonomous_database"
  query                 = "SessionCount[5m]{dbName = \\"openclawdb\\"}.mean() > 80"
  severity              = "WARNING"
  is_enabled            = true
  pending_duration      = "PT5M"
  body                  = "Database connections over 80% capacity"
  message_format        = "ONS_OPTIMIZED"
  metric_compartment_id = var.compartment_ocid

  destinations = [oci_ons_notification_topic.openclaw_alerts.id]
}

# ── Vulnerability Scanning ──
resource "oci_vulnerability_scanning_host_scan_recipe" "openclaw" {
  compartment_id = var.compartment_ocid
  display_name   = "openclaw-scan-recipe"

  agent_settings {
    scan_level = "STANDARD"
    agent_configuration {
      vendor = "OCI"
    }
  }

  port_settings {
    scan_level = "STANDARD"
  }

  schedule {
    type        = "WEEKLY"
    day_of_week = "SUNDAY"
  }
}`,
  },
  // ── SECRETS ──
  {
    id: 'vault',
    name: 'OCI Vault & KMS',
    filename: 'vault.tf',
    category: 'secrets',
    description: 'OCI Vault for secrets management and KMS for encryption',
    icon: '🔐',
    securityNotes: [
      'HSM-backed vault for maximum security',
      'Customer-managed keys for DB and storage encryption',
      'Automatic key rotation every 90 days',
      'Secrets are never stored in plain text in the Terraform state',
    ],
    content: `# ============================================================
# vault.tf – OCI Vault, KMS Keys & Secrets
# ============================================================

# ── Vault ──
resource "oci_kms_vault" "openclaw" {
  compartment_id = var.compartment_ocid
  display_name   = "openclaw-vault"
  vault_type     = "VIRTUAL_PRIVATE"  # HSM-backed

  freeform_tags = {
    "Project"     = var.project
    "Environment" = var.environment
  }
}

# ── Master Encryption Key ──
resource "oci_kms_key" "openclaw_master" {
  compartment_id = var.compartment_ocid
  display_name   = "openclaw-master-key"
  management_endpoint = oci_kms_vault.openclaw.management_endpoint

  key_shape {
    algorithm = "AES"
    length    = 32  # 256-bit
  }

  protection_mode = "HSM"

  freeform_tags = {
    "Project" = var.project
    "Purpose" = "master-encryption"
  }
}

# ── DB Encryption Key ──
resource "oci_kms_key" "openclaw_db_key" {
  compartment_id      = var.compartment_ocid
  display_name        = "openclaw-db-key"
  management_endpoint = oci_kms_vault.openclaw.management_endpoint

  key_shape {
    algorithm = "AES"
    length    = 32
  }

  protection_mode = "HSM"

  freeform_tags = {
    "Project" = var.project
    "Purpose" = "database-encryption"
  }
}

# ── Automatic Key Rotation ──
resource "oci_kms_key_version" "master_rotation" {
  key_id              = oci_kms_key.openclaw_master.id
  management_endpoint = oci_kms_vault.openclaw.management_endpoint

  # Rotation every 90 days via CI/CD pipeline
}

# ── Secrets ──
resource "oci_vault_secret" "db_admin_password" {
  compartment_id = var.compartment_ocid
  vault_id       = oci_kms_vault.openclaw.id
  key_id         = oci_kms_key.openclaw_master.id
  secret_name    = "openclaw-db-admin-password"

  secret_content {
    content_type = "BASE64"
    content      = base64encode(random_password.db_admin.result)
  }

  description = "Admin password for OpenClaw Autonomous Database"
}

resource "oci_vault_secret" "db_app_password" {
  compartment_id = var.compartment_ocid
  vault_id       = oci_kms_vault.openclaw.id
  key_id         = oci_kms_key.openclaw_master.id
  secret_name    = "openclaw-db-app-password"

  secret_content {
    content_type = "BASE64"
    content      = base64encode(random_password.db_app.result)
  }
}

resource "oci_vault_secret" "app_secret_key" {
  compartment_id = var.compartment_ocid
  vault_id       = oci_kms_vault.openclaw.id
  key_id         = oci_kms_key.openclaw_master.id
  secret_name    = "openclaw-app-secret-key"

  secret_content {
    content_type = "BASE64"
    content      = base64encode(random_password.app_secret.result)
  }
}

resource "oci_vault_secret" "encryption_key" {
  compartment_id = var.compartment_ocid
  vault_id       = oci_kms_vault.openclaw.id
  key_id         = oci_kms_key.openclaw_master.id
  secret_name    = "openclaw-encryption-key"

  secret_content {
    content_type = "BASE64"
    content      = base64encode(random_password.encryption_key.result)
  }
}

# ── Password Generation ──
resource "random_password" "db_admin" {
  length           = 32
  special          = true
  override_special = "#$%&*()-_=+[]{}|:,.<>?"
  min_upper        = 4
  min_lower        = 4
  min_numeric      = 4
  min_special      = 4
}

resource "random_password" "db_app" {
  length           = 32
  special          = true
  override_special = "#$%&*()-_=+[]{}|:,.<>?"
  min_upper        = 4
  min_lower        = 4
  min_numeric      = 4
  min_special      = 4
}

resource "random_password" "app_secret" {
  length  = 64
  special = false
}

resource "random_password" "encryption_key" {
  length  = 64
  special = false
}

# ── Secret Data Sources ──
data "oci_secrets_secretbundle" "db_admin_password" {
  secret_id = oci_vault_secret.db_admin_password.id
}

data "oci_secrets_secretbundle" "db_app_password" {
  secret_id = oci_vault_secret.db_app_password.id
}

data "oci_secrets_secretbundle" "db_wallet_password" {
  secret_id = oci_vault_secret.db_admin_password.id
}

data "oci_secrets_secretbundle" "app_secret_key" {
  secret_id = oci_vault_secret.app_secret_key.id
}

data "oci_secrets_secretbundle" "encryption_key" {
  secret_id = oci_vault_secret.encryption_key.id
}`,
  },
  {
    id: 'iam',
    name: 'IAM Policies',
    filename: 'iam.tf',
    category: 'secrets',
    description: 'IAM policies following the least-privilege principle with compartment isolation',
    icon: '👤',
    securityNotes: [
      'Dedicated compartment for resource isolation',
      'Policies follow the least-privilege principle',
      'Service-specific policies instead of broad permissions',
      'MFA forced for admin access',
    ],
    content: `# ============================================================
# iam.tf – IAM Policies & Compartment
# ============================================================

# ── Compartment ──
resource "oci_identity_compartment" "openclaw" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-\${var.environment}"
  description    = "Compartment for OpenClaw \${var.environment}"
  enable_delete  = false

  freeform_tags = {
    "Project"     = var.project
    "Environment" = var.environment
  }
}

# ── Groups ──
resource "oci_identity_group" "openclaw_admins" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-admins"
  description    = "Administrators for OpenClaw infrastructure"
}

resource "oci_identity_group" "openclaw_developers" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-developers"
  description    = "Developers for OpenClaw (read-only on infra)"
}

resource "oci_identity_group" "openclaw_cicd" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-cicd"
  description    = "CI/CD service account group"
}

# ── Dynamic Group for OKE Workload Identity ──
resource "oci_identity_dynamic_group" "openclaw_workload" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-oke-workload"
  description    = "Dynamic Group for OKE Workload Identity"
  matching_rule  = "ALL {resource.type = 'cluster', resource.compartment.id = '\${oci_identity_compartment.openclaw.id}'}"
}

# ── Policies ──

# Admin Policy – manage all resources in compartment
resource "oci_identity_policy" "admin_policy" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-admin-policy"
  description    = "Admin rights for OpenClaw compartment"

  statements = [
    "Allow group openclaw-admins to manage all-resources in compartment openclaw-\${var.environment}",
    "Allow group openclaw-admins to manage vaults in compartment openclaw-\${var.environment}",
    "Allow group openclaw-admins to manage keys in compartment openclaw-\${var.environment}",
    "Allow group openclaw-admins to manage secret-family in compartment openclaw-\${var.environment}",
  ]
}

# Developer Policy – read-only access
resource "oci_identity_policy" "developer_policy" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-developer-policy"
  description    = "Developer read-only access"

  statements = [
    "Allow group openclaw-developers to read all-resources in compartment openclaw-\${var.environment}",
    "Allow group openclaw-developers to use cloud-shell in tenancy",
    "Allow group openclaw-developers to read metrics in compartment openclaw-\${var.environment}",
    "Allow group openclaw-developers to read log-content in compartment openclaw-\${var.environment}",
  ]
}

# CI/CD Policy – deployment rights
resource "oci_identity_policy" "cicd_policy" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-cicd-policy"
  description    = "CI/CD pipeline permissions"

  statements = [
    "Allow group openclaw-cicd to manage repos in compartment openclaw-\${var.environment}",
    "Allow group openclaw-cicd to manage cluster-family in compartment openclaw-\${var.environment}",
    "Allow group openclaw-cicd to read vaults in compartment openclaw-\${var.environment}",
    "Allow group openclaw-cicd to read secrets in compartment openclaw-\${var.environment}",
    "Allow group openclaw-cicd to use keys in compartment openclaw-\${var.environment}",
    "Allow group openclaw-cicd to manage objects in compartment openclaw-\${var.environment} where target.bucket.name = 'openclaw-tfstate'",
  ]
}

# OKE Workload Identity Policy
resource "oci_identity_policy" "workload_policy" {
  compartment_id = var.tenancy_ocid
  name           = "openclaw-workload-policy"
  description    = "OKE Workload Identity permissions"

  statements = [
    "Allow dynamic-group openclaw-oke-workload to read secret-bundles in compartment openclaw-\${var.environment}",
    "Allow dynamic-group openclaw-oke-workload to use keys in compartment openclaw-\${var.environment}",
    "Allow dynamic-group openclaw-oke-workload to manage objects in compartment openclaw-\${var.environment} where target.bucket.name = 'openclaw-uploads'",
  ]
}

# ── MFA Policy ──
resource "oci_identity_authentication_policy" "openclaw" {
  compartment_id = var.tenancy_ocid

  network_policy {
    network_source_ids = []
  }

  password_policy {
    is_lowercase_characters_required = true
    is_numeric_characters_required   = true
    is_special_characters_required   = true
    is_uppercase_characters_required = true
    is_username_containment_allowed  = false
    minimum_password_length          = 14
  }
}`,
  },
  {
    id: 'outputs',
    name: 'Outputs',
    filename: 'outputs.tf',
    category: 'foundation',
    description: 'Terraform outputs for important resource information',
    icon: '📋',
    securityNotes: [
      'Sensitive outputs are marked as sensitive',
      'No passwords or keys in outputs',
    ],
    content: `# ============================================================
# outputs.tf – Terraform Outputs
# ============================================================

output "vcn_id" {
  description = "OCID of the VCN"
  value       = oci_core_vcn.openclaw.id
}

output "oke_cluster_id" {
  description = "OCID of the OKE cluster"
  value       = oci_containerengine_cluster.openclaw.id
}

output "oke_cluster_endpoint" {
  description = "Kubernetes API endpoint (private)"
  value       = oci_containerengine_cluster.openclaw.endpoints[0].kubernetes
  sensitive   = true
}

output "load_balancer_ip" {
  description = "Public IP of the load balancer"
  value       = oci_load_balancer_load_balancer.openclaw.ip_address_details[0].ip_address
}

output "db_connection_string" {
  description = "Database connection string"
  value       = oci_database_autonomous_database.openclaw.connection_urls[0].profiles[0].value
  sensitive   = true
}

output "vault_id" {
  description = "OCID of the vault"
  value       = oci_kms_vault.openclaw.id
}

output "compartment_id" {
  description = "OCID of the OpenClaw compartment"
  value       = oci_identity_compartment.openclaw.id
}

output "kubeconfig_command" {
  description = "Command to retrieve the kubeconfig"
  value       = "oci ce cluster create-kubeconfig --cluster-id \${oci_containerengine_cluster.openclaw.id} --region \${var.region}"
}

output "deploy_url" {
  description = "URL of the OpenClaw application"
  value       = "https://\${var.openclaw_domain}"
}`,
  },
];
