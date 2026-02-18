import { Link } from 'react-router-dom';

export function SolutionLanding() {
    const solutions = [
        {
            id: 'openclaw-iac',
            title: 'OpenClaw IaC',
            description: 'Enterprise-grade Infrastructure-as-Code for Oracle Cloud. Secure, scalable, and production-ready.',
            icon: '🛡️',
            path: '/tools/solution/openclaw-iac',
            tags: ['IaC', 'Terraform', 'OCI', 'Security']
        },
        {
            id: 'databricks-iac',
            title: 'Databricks IaC',
            description: 'Infrastructure-as-Code for Databricks. Automate workspaces, clusters, and jobs with Terraform and Asset Bundles.',
            icon: '⚡',
            path: '/tools/solution/databricks-iac',
            tags: ['IaC', 'Databricks', 'Terraform', 'CI/CD']
        }
    ];

    return (
        <section className="container" style={{ paddingTop: '8rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Our <span className="gradient-text">Solutions</span></h2>

            <div className="grid grid-2">
                {solutions.map((sol) => (
                    <Link
                        key={sol.id}
                        to={sol.path}
                        className="glass p-8 flex flex-col h-full hover:bg-white/5 transition-all duration-300 border-none relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                            {sol.icon}
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                            {sol.title}
                        </h2>

                        <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                            {sol.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                                {sol.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-white/5 text-slate-500 rounded border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                        </div>

                        <div className="mt-8 flex items-center text-indigo-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Explore Solution <span className="ml-2">→</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
