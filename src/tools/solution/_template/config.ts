import { ToolConfig, ConfigFile, Category, FeatureLayer } from './ToolTemplate';

const files: ConfigFile[] = [
  {
    id: 'example',
    name: 'Example Configuration',
    filename: 'example.tf',
    icon: '📄',
    description: 'Example configuration file description.',
    category: 'core',
    securityNotes: [
      'Security best practice 1',
      'Security best practice 2',
    ],
    content: `# Example Terraform configuration
provider "example" {
  region = var.region
}

resource "example_resource" "main" {
  name = var.name
}`,
  },
];

const categories: Category[] = [
  { id: 'all', label: 'All', icon: '📁' },
  { id: 'core', label: 'Core', icon: '☁️' },
  { id: 'compute', label: 'Compute', icon: '⚙️' },
  { id: 'security', label: 'Security', icon: '🔐' },
];

const featureLayers: FeatureLayer[] = [
  {
    icon: '☁️',
    title: 'Cloud Infrastructure',
    bgClass: 'bg-blue-500/10',
    items: [
      'Cloud provider integration',
      'Multi-region support',
      'High availability',
    ],
  },
  {
    icon: '⚙️',
    title: 'Compute',
    bgClass: 'bg-green-500/10',
    items: [
      'Auto-scaling',
      'Load balancing',
      'Container support',
    ],
  },
  {
    icon: '🔐',
    title: 'Security',
    bgClass: 'bg-red-500/10',
    items: [
      'Encryption at rest',
      'Secret management',
      'IAM integration',
    ],
  },
  {
    icon: '📊',
    title: 'Monitoring',
    bgClass: 'bg-purple-500/10',
    items: [
      'Logging',
      'Metrics',
      'Alerting',
    ],
  },
];

export const exampleConfig: ToolConfig = {
  title: 'Example IaC',
  subtitle: 'Infrastructure-as-Code solution for Example Cloud.',
  icon: '🚀',
  files,
  categories,
  featureLayers,
};
