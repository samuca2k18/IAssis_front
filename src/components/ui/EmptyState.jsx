export default function EmptyState({ icon, title, description }) {
    return (
        <div className="text-center py-12 px-5 text-muted-foreground">
            <div className="text-5xl mb-3 opacity-40">{icon}</div>
            <h3 className="text-base font-semibold text-secondary-foreground mb-1">{title}</h3>
            {description && <p className="text-sm">{description}</p>}
        </div>
    );
}
