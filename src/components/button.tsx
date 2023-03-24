import './button.less'

export default function (props: any) {
    return <div className="button-wrapper" data-tippy-content="Click to copy button 82" onClick={props.onClick}>
        <button className="button-82-pushable" role="button">
            <span className="button-82-shadow"></span>
            <span className="button-82-edge"></span>
            <span className="button-82-front text">
        {props.children}
    </span>
        </button>
    </div>
}
