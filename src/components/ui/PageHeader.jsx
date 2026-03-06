export default function PageHeader({ title, description, action }) {
    return (
        <div className="pt-8 px-8 pb-0 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1">{title}</h2>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {action && action}
            </div>
        </div>
    );
}
