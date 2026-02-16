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
        }
        // Future solutions can be added here
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-slate-200 pt-[220px] sm:pt-[180px] pb-20">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* Hero Section */}
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
                        Our <span className="gradient-text">Solutions</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Discover our collection of specialized tools and infrastructure blueprints designed
                        to accelerate your digital transformation.
                    </p>
                </div>

                {/* Solutions Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutions.map((sol) => (
                        <Link
                            key={sol.id}
                            to={sol.path}
                            className="group glass p-8 flex flex-col h-full hover:bg-white/5 transition-all duration-300 border-none relative overflow-hidden"
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

                    {/* Coming Soon Card */}
                    <div className="glass p-8 flex flex-col h-full items-center justify-center opacity-50 border-dashed border-white/10">
                        <div className="text-3xl mb-4">🚀</div>
                        <p className="text-slate-500 text-sm font-medium italic">More Solutions Coming Soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
