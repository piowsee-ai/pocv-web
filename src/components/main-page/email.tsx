interface EmailProps {
    firstName: string;
}

export function Email({ firstName }: EmailProps) {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}>
            <h1 style={{ color: "#4f46e5" }}>Welcome, {firstName}!</h1>
            <p>
                🎉 Thanks for subscribing to <strong>Landing AI</strong>. We&apos;re excited to
                have you on board.
            </p>
            <p>
                You&apos;ll be the first to hear about new features, updates, and exclusive
                content. Stay tuned!
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
                No spam. Unsubscribe anytime.
            </p>
        </div>
    );
}