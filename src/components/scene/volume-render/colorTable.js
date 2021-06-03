
function ColorTable(option){
   this.tableName = option.tableName;
   this.opacityMinValue = option.opacityMinValue;
   this.opacityMaxValue = option.opacityMaxValue;
   this.gradientMinOpacity = option.gradientMinOpacity;
   this.gradientMaxOpacity = option.gradientMaxOpacity;
   this.visibleMinValue = option.visibleMinValue;
   this.visibleMaxValue = option.visibleMaxValue;
}

ColorTable.prototype.setColorTable = function(layer,index){
	if(!Cesium.defined(layer)){
		return;
	}
	var minValue = layer.minValue;
	var maxValue = layer.maxValue;
	var minExtent = this.visibleMinValue;
	var maxExtent = this.visibleMaxValue;
	if(minExtent > maxExtent){
		var temp = minExtent;
		minExtent = maxExtent;
		maxExtent = temp;
	}
	this.setOpacityFunction(layer,minValue,maxValue,minExtent,maxExtent);
	this.setColorFunction(layer,minValue,maxValue,minExtent,maxExtent,index);
};

ColorTable.prototype.setOpacityFunction = function(layer,minValue,maxValue,minExtent,maxExtent){
	var minOpacity =  this.opacityMinValue;
	var maxOpacity =  this.opacityMaxValue;
	var opacityFunction = new Cesium.PiecewiseFunction();
	opacityFunction.addPoint(minValue, 0.0);
	opacityFunction.addPoint(minValue + (maxValue - minValue) * minExtent, minOpacity);
	opacityFunction.addPoint(minValue + (maxValue - minValue) * maxExtent, maxOpacity);
	opacityFunction.addPoint(minValue + (maxValue - minValue) * (maxExtent + 0.01), minOpacity);
	opacityFunction.addPoint(maxValue, 0.0);

	layer.opacityTransferFunction = opacityFunction;
};

ColorTable.prototype.setColorFunction = function(layer,minValue,maxValue,minExtent,maxExtent,index){
	var colorfun = new Cesium.ColorTransferFunction();
	var extentRange = maxExtent - minExtent;
	var span = extentRange / 15;

	switch(index){
		case 1:
			colorfun.addRGBPoint(minValue, 9/255, 9/255, 212/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * minExtent, 9/255, 10/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span), 9/255, 51/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 2), 9/255, 102/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 3), 9/255, 153/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 4), 9/255, 204/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 5), 9/255, 255/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 6), 51/255, 255/255, 204/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 7), 102/255, 255/255, 153/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 8), 153/255, 255/255, 102/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 9), 204/255, 255/255, 51/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 10), 255/255, 255/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 11), 255/255, 204/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 12), 255/255, 153/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 13), 255/255, 102/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 14), 255/255, 51/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 15), 255/255, 0, 0);
			break;
		case 2:
			colorfun.addRGBPoint(minValue, 255/255, 103/255, 103/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * minExtent, 255/255, 0, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span), 255/255, 51/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 2),255/255, 102/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 3), 255/255, 153/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 4), 255/255, 204/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 5), 255/255, 255/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 6), 51/255, 255/255, 204/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 7), 102/255, 255/255, 153/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 8), 153/255, 255/255, 102/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 9), 204/255, 255/255, 51/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 10), 255/255, 255/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 11), 255/255, 204/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 12), 255/255, 153/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 13), 255/255, 102/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 14), 255/255, 51/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 15), 255/255, 0, 0);
			break;
		case 3:
			colorfun.addRGBPoint(minValue, 157/255, 0, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * minExtent, 157/255, 0, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span), 157/255, 51/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 2), 157/255, 102/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 3), 157/255, 153/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 4), 157/255, 204/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 5), 157/255, 255/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 6), 51/255, 255/255, 204/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 7), 102/255, 255/255, 153/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 8), 153/255, 255/255, 102/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 9), 204/255, 255/255, 51/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 10), 255/255, 255/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 11), 255/255, 204/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 12), 255/255, 153/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 13), 255/255, 102/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 14), 255/255, 51/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 15), 255/255, 0, 0);
			break;
		case 4:
			colorfun.addRGBPoint(minValue, 149/255, 232/255, 249/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * minExtent,  149/255, 0, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span),  149/255, 51/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 2),  149/255, 102/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 3),  149/255, 153/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 4),  149/255, 204/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 5),  149/255, 255/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 6), 51/255, 255/255, 204/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 7), 102/255, 255/255, 153/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 8), 153/255, 255/255, 102/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 9), 204/255, 255/255, 51/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 10), 255/255, 255/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 11), 255/255, 204/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 12), 255/255, 153/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 13), 255/255, 102/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 14), 255/255, 51/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 15), 255/255, 0, 0);
			break;
		case 5:
			colorfun.addRGBPoint(minValue, 26/255, 255/255, 156/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * minExtent, 26/255, 0, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span), 26/255, 51/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 2), 26/255, 102/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 3), 26/255, 153/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 4), 26/255, 204/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 5), 26/255, 255/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 6), 51/255, 255/255, 204/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 7), 102/255, 255/255, 153/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 8), 153/255, 255/255, 102/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 9), 204/255, 255/255, 51/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 10), 255/255, 255/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 11), 255/255, 204/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 12), 255/255, 153/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 13), 255/255, 102/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 14), 255/255, 51/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 15), 255/255, 0, 0);
			break;
		default:
			colorfun.addRGBPoint(minValue, 0, 0, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * minExtent, 0, 0, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span), 0, 51/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 2), 0, 102/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 3), 0, 153/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 4), 0, 204/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 5), 0, 255/255, 255/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 6), 51/255, 255/255, 204/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 7), 102/255, 255/255, 153/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 8), 153/255, 255/255, 102/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 9), 204/255, 255/255, 51/255);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 10), 255/255, 255/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 11), 255/255, 204/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 12), 255/255, 153/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 13), 255/255, 102/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 14), 255/255, 51/255, 0);
			colorfun.addRGBPoint(minValue + (maxValue - minValue) * (minExtent + span * 15), 255/255, 0, 0);
			break;
	}

	if(minExtent + span * 15 < 1.0){
		colorfun.addRGBPoint(maxValue, 255/255, 0, 0);
	}

	layer.colorTransferFunction = colorfun;
};

ColorTable.prototype.setGradientOpacityValue = function(layer){
	var minValue = layer.minValue;
	var maxValue = layer.maxValue;
	var minExtent = this.gradientMinOpacity;
	var maxExtent = this.gradientMaxOpacity;
	if(minExtent > maxExtent){
		var temp = minExtent;
		minExtent = maxExtent;
		maxExtent = temp;
	}
	layer.gradientOpacityMinValue = Math.abs(maxValue - minValue) * 0.1 *minExtent;
	layer.gradientOpacityMaxValue = Math.abs(maxValue - minValue) * 0.1 * maxExtent;
}

export default ColorTable