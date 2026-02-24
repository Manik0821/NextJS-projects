import './card.css';

type CardProps = {
    title?: string,
    children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({title="",children}) => {

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