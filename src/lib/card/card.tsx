import './card.css';

type CardProps = {
    title?: string;
    children?: React.ReactNode;
}

export const Card = ({ title = "Card Title", children }: CardProps) => {
    return (
        <div className="card-container">
            <div className="card">
                <div className="card-header">
                    {title}
                </div>
                <div className="card-body">
                    {children || <h2>This is a Card</h2>}
                </div>
            </div>
        </div>
    );
};
