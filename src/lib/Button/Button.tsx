import './Button.css'

type ButtonProps = {
    type? : "primary" | "secondary" | 'tertiary';
    click? : boolean;
    disabled? : boolean;
    value? : string;
}

export const Button : React.FC<ButtonProps> = ({
    type="primary",
    click=true,
    disabled=false,
    value="Primary button"
}) => {

    return (
        <div className="btn-type-cont">
        {/* Logic: Render this button ONLY if type is 'primary' */}
        {type === 'primary' && (
            <button className="btn-primary" disabled={disabled} >
                {value} (Primary)
            </button>
        )}

        {/* Logic: Render this button ONLY if type is 'secondary' */}
        {type === 'secondary' && (
            <button className="btn-secondary" disabled={disabled} >
                {value} (Secondary)
            </button>
        )}

        {/* Logic: Render this button ONLY if type is 'tertiary' */}
        {type === 'tertiary' && (
            <div className="btn-tertiary">
                {value}
            </div>
        )}
    </div>
    ); 
};