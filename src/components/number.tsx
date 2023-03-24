import './number.less'

function hasClassName(inElement: HTMLElement, inClassName: string) {
    const regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)');
    return regExp.test(inElement.className);
}

function addClassName(inElement: HTMLElement, inClassName: string) {
    if (!hasClassName(inElement, inClassName))
        inElement.className = [inElement.className, inClassName].join(' ');
}

function removeClassName(inElement: HTMLElement, inClassName: string) {
    if (hasClassName(inElement, inClassName)) {
        const regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)', 'g');
        const curClasses = inElement.className;
        inElement.className = curClasses.replace(regExp, ' ');
    }
}

export function toggleShape() {
    const shape = document.getElementById('shape')!!;
    if (hasClassName(shape, 'ring')) {
        removeClassName(shape, 'ring');
        addClassName(shape, 'cube');
    } else {
        removeClassName(shape, 'cube');
        addClassName(shape, 'ring');
    }


    const stage = document.getElementById('stage')!!;
    if (hasClassName(shape, 'ring')) {
        stage.style.webkitTransform = 'translateZ(-200px)';
        stage.style.transform = 'translateZ(-200px)';
    } else {
        stage.style.webkitTransform = '';
    }
}

export function toggleBackfaces() {
    const backfacesVisible = (document.getElementById('backfaces') as any).checked;
    const shape = document.getElementById('shape')!!;
    if (backfacesVisible) {
        addClassName(shape, 'backfaces');
    } else {
        removeClassName(shape, 'backfaces');
    }
}

export default function () {
    return <div id="container">
        <div id="stage">
            <div id="shape" className="cube backfaces">
                <div className="plane one">1</div>
                <div className="plane two">2</div>
                <div className="plane three">3</div>
                <div className="plane four">4</div>
                <div className="plane five">5</div>
                <div className="plane six">6</div>
                <div className="plane seven">7</div>
                <div className="plane eight">8</div>
                <div className="plane nine">9</div>
                <div className="plane ten">10</div>
                <div className="plane eleven">11</div>
                <div className="plane twelve">12</div>
            </div>
        </div>
    </div>
}
