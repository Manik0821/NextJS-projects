import './card.css';

type CardProps = {
    title?: string,
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({title="Card Title",children=<h2>This is a Card</h2>}) => {

    return (
        <div className="card-container">
            <div className="card">
                <div className="card-header">
                    {title}
                </div>
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    )
}