function createTooltip(frameDiv) { 
    let tooltip = function (frameDiv) {
        let div = document.createElement('DIV');
        div.className = "tooltip";
        this._div = div;
        this.message = '';
        frameDiv.appendChild(div);
    };

    tooltip.prototype.setVisible = function (visible) {
        if (visible) {
            this._div.style.right = '10px'
        } else {
            this._div.style.right = '-300px'
        }
    };

    tooltip.prototype.showAt = function (message,top) { //top:200px => string
        if(top){
            this._div.style.top = top;
        }
        if (message) {
            this.setVisible(true);
            this._div.innerHTML = message;
        }
    };
    return new tooltip(frameDiv);
}
export default createTooltip;