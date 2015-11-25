define(function (require,exports,module) {
	var $ = require('./zepto.min');//seajs化zepto


	var ArrayT = Array.prototype,
		StringT = Array.prototype,
		ObjectT = Array.prototype;

	var abs = Math.abs;

	
	var	timeGap = 500,
		timeAn = 200;
		//成功移动最小事件间隔



	function _getElement (s) {
		return $(s);
	}
	function _FatherToChild (el) {
		var cArr = ArrayT.slice.call(el.children),
			content = [];
		cArr && cArr.forEach(function (item) {
			content.push(item);
		});
		return content;
	}
	function _initPostion (el) {

	}
	function __n2p () {
		var t = 0;
		for (var i = arguments.length - 1;i > -1;i--) {
			t += arguments[i];
		}
		return t + 'px';
	}





	function slider (contentOuter,config) {
		this.contentOuter;
		this.type;
		this.callback;
		this.content;

		return new this.init(contentOuter,config);
	}
	/*
	*	1.content想要滑动的块的父级
	*	2.config
	*		2.1 type 类型page,only
	*		2.2 callback 每次滑动成功后执行回调
	*
	*/
	var init = slider.prototype.init = function (contentOuter,config) {
		var father = this.contentOuter = _getElement(contentOuter)[0];
		touch.call(this,father);
		this.content = _FatherToChild(father);
		this.type = config.type;
		this.callback = config.callback;	
		this.count = 0;
		this.timeGap = 500;
		this.onTouch(father,this.content);
		this.onMove(father,this.content);
		this.onEnd(father,this.content);
	};

	/*
	*	
	*	
	*	初始化slider
	*		
	*
	*/
	function touch (father) {
		this.x0;
		this.x1;
		this.y0;
		this.y1;
		this.time;
		this.len = father?father.children.length : '';
		this.dis = 0;
		this.moveFlag = false;
		this.count = 0;
		this.width = father?$(father).offset().width : '';
	};
	touch.prototype.onTouch = function (el,content) {
		var self = this;
		$(el).on('touchstart',function (e) {
			e.stopPropagation();
			var ev = e.touches[0];
			self.time = new Date();	
			self.x0 = ev.pageX;
			self.y0 = ev.pageY;
		})
	}
	touch.prototype.onMove = function (el,content) {
		var self = this;
		$(el).on('touchmove',function (e) {
			e.stopPropagation();
			var ev = e.touches[0];
			self.x1 = ev.pageX;
			self.y1 = ev.pageY;
			self.dis += self.x1 - self.x0;
			if (abs(self.y1 - self.y0)/abs(self.x1 - self.x0) <= 1 && self._shouldWork()) {
				e.preventDefault();
				self.moveFlag = true;
				content.forEach(function (item,index) {
					var i = $(item);
					i.on('touchmove',function (e) {
						e.preventDefault();
					});
					i.css({
						'-webkit-transform':'translate3d(' + __n2p(self.dis,(index - self.count) * self.width)+ ',0,0)'
					})
				})
			} 
			self.x0 = self.x1;
			self.y0 = self.y1;
		});
	};
	touch.prototype.onEnd = function (el,content) {
		var self = this;
		$(el).on('touchend',function (e) {
			var ev = e.touches[0];
			if (self.moveFlag && self._isWork(el,self.dis,new Date())) {
				self._successMove(self.dis > 0?false:true,content);
			} else {
				self._failMove(content);
			}
			self.moveFlag = false;
			with (self) {
				y0 = y1 = x0 = x1 = dis = 0;
			}
		});
	};
	touch.prototype.f5 = function () {
		this.contentOuter.style.height = $(this.content[this.count]).offset().height + 'px';
	}
	touch.prototype._successMove = function (b,content) {
		var self = this;
		if (b) {
			this.count++;
		} else {
			this.count--;
		}
		self.f5();
		content.forEach(function (item,index) {
			self._addAnmation(item);
			self._anmationMove(item,index);
		})
	};
	touch.prototype._failMove = function (content) {
		var self = this;
		content.forEach(function (item,index) {
			self._addAnmation(item);
			self._anmationMove(item,index);
		});
	}
	touch.prototype._addAnmation = function (el) {
		var self = this;
		$(el).css('-webkit-transition','-webkit-transform ' + timeAn * 0.001 + 's');
		setTimeout(function () {
			self._removeAnmation(el);
		},timeAn);
	}
	touch.prototype._shouldWork = function () {
		return this.count * this.width - this.dis >= 0 && ((this.count == this.len - 1)?this.dis >= 0 : true);
	}
	touch.prototype._removeAnmation = function (el) {
		$(el).css('-webkit-transition','');
	}
	
	touch.prototype._anmationMove = function (item,index) {
		$(item).css('-webkit-transform','translate3d(' + __n2p((index - this.count) * this.width)   + ', 0px, 0px);')
	}
	touch.prototype._isWork = function (el,dis,newTime) {
		return Math.abs(this.dis) > $(el).offset().width * 0.3 || (newTime - this.time < timeGap);
	}
	/*
	*	
	*	
	*	初始化touch
	*		
	*
	*/

	
	slider.prototype.init.prototype = new touch();
	try {
		navigator.control.gesture(false);
	} catch (e) {

	}
	module.exports = slider; 
});