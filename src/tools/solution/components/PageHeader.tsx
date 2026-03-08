import { Link } from 'react-router-dom';

interface Breadcrumb {
    label: string;
    path?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs: Breadcrumb[];
    icon?: string;
    gradient?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, icon, gradient }: PageHeaderProps) {
    return (
        <div className="relative pt-32 pb-8 overflow-hidden">
            {/* Background Ambient Glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${gradient || 'rgba(59, 130, 246, 0.05)'} 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    zIndex: 0
                }}
            />

            <div className="container relative z-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-[10px] uppercase tracking-widest font-bold">
                    {breadcrumbs.map((crumb, i) => (
                        <div key={i} className="flex items-center gap-2">
                            {i > 0 && <span className="text-slate-600">/</span>}
                            {crumb.path ? (
                                <Link to={crumb.path} className="text-slate-500 hover:text-indigo-400 transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-indigo-400">{crumb.label}</span>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Title Block */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {icon && (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shadow-xl border border-white/10 text-2xl sm:text-3xl">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: subtitle ? '0.5rem' : 0 }}>
                            {title}
                        </h1>
                        {subtitle && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
