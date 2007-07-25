(function () {

    /**
    * ContainerEffect encapsulates animation transitions that are executed when 
    * an Overlay is shown or hidden.
    * @namespace YAHOO.widget
    * @class ContainerEffect
    * @constructor
    * @param {YAHOO.widget.Overlay} overlay The Overlay that the animation 
    * should be associated with
    * @param {Object} attrIn The object literal representing the animation 
    * arguments to be used for the animate-in transition. The arguments for 
    * this literal are: attributes(object, see YAHOO.util.Anim for description), 
    * duration(Number), and method(i.e. Easing.easeIn).
    * @param {Object} attrOut The object literal representing the animation 
    * arguments to be used for the animate-out transition. The arguments for  
    * this literal are: attributes(object, see YAHOO.util.Anim for description), 
    * duration(Number), and method(i.e. Easing.easeIn).
    * @param {HTMLElement} targetElement Optional. The target element that  
    * should be animated during the transition. Defaults to overlay.element.
    * @param {class} Optional. The animation class to instantiate. Defaults to 
    * YAHOO.util.Anim. Other options include YAHOO.util.Motion.
    */
    YAHOO.widget.ContainerEffect = 
    
        function (overlay, attrIn, attrOut, targetElement, animClass) {
    
        if (!animClass) {
            animClass = YAHOO.util.Anim;
        }
        
        /**
        * The overlay to animate
        * @property overlay
        * @type YAHOO.widget.Overlay
        */
        this.overlay = overlay;
    
        /**
        * The animation attributes to use when transitioning into view
        * @property attrIn
        * @type Object
        */
        this.attrIn = attrIn;
    
        /**
        * The animation attributes to use when transitioning out of view
        * @property attrOut
        * @type Object
        */
        this.attrOut = attrOut;
    
        /**
        * The target element to be animated
        * @property targetElement
        * @type HTMLElement
        */
        this.targetElement = targetElement || overlay.element;
    
        /**
        * The animation class to use for animating the overlay
        * @property animClass
        * @type class
        */
        this.animClass = animClass;
    
    };


    var Dom = YAHOO.util.Dom,
        CustomEvent = YAHOO.util.CustomEvent,
        Easing = YAHOO.util.Easing,
        ContainerEffect = YAHOO.widget.ContainerEffect;


    /**
    * A pre-configured ContainerEffect instance that can be used for fading 
    * an overlay in and out.
    * @method FADE
    * @static
    * @param {Overlay} overlay The Overlay object to animate
    * @param {Number} dur The duration of the animation
    * @return {ContainerEffect} The configured ContainerEffect object
    */
    ContainerEffect.FADE = function (overlay, dur) {
    
        var fade = new ContainerEffect(overlay, 
        
            { attributes: { opacity: { from: 0, to: 1 } }, 
                duration: dur, 
                method: Easing.easeIn }, 
            
            { attributes: { opacity: { to: 0 } },
                duration: dur, 
                method: Easing.easeOut }, 
            
            overlay.element);
        
    
        fade.handleStartAnimateIn = function (type,args,obj) {
            Dom.addClass(obj.overlay.element, "hide-select");
        
            if (! obj.overlay.underlay) {
                obj.overlay.cfg.refireEvent("underlay");
            }
        
            if (obj.overlay.underlay) {
    
                obj.initialUnderlayOpacity = 
                    Dom.getStyle(obj.overlay.underlay, "opacity");
    
                obj.overlay.underlay.style.filter = null;
    
            }
        
            Dom.setStyle(obj.overlay.element, "visibility", "visible");
            Dom.setStyle(obj.overlay.element, "opacity", 0);
        };
        
    
        fade.handleCompleteAnimateIn = function (type,args,obj) {
            Dom.removeClass(obj.overlay.element, "hide-select");
        
            if (obj.overlay.element.style.filter) {
                obj.overlay.element.style.filter = null;
            }
        
            if (obj.overlay.underlay) {
                Dom.setStyle(obj.overlay.underlay, "opacity", 
                    obj.initialUnderlayOpacity);
            }
        
            obj.overlay.cfg.refireEvent("iframe");
            obj.animateInCompleteEvent.fire();
        };
        
    
        fade.handleStartAnimateOut = function (type, args, obj) {
            Dom.addClass(obj.overlay.element, "hide-select");
        
            if (obj.overlay.underlay) {
                obj.overlay.underlay.style.filter = null;
            }
        };
        
    
        fade.handleCompleteAnimateOut =  function (type, args, obj) {
            Dom.removeClass(obj.overlay.element, "hide-select");
            if (obj.overlay.element.style.filter) {
                obj.overlay.element.style.filter = null;
            }
            Dom.setStyle(obj.overlay.element, "visibility", "hidden");
            Dom.setStyle(obj.overlay.element, "opacity", 1);
        
            obj.overlay.cfg.refireEvent("iframe");
        
            obj.animateOutCompleteEvent.fire();
        };
        
        fade.init();
        return fade;
    };
    
    
    /**
    * A pre-configured ContainerEffect instance that can be used for sliding an 
    * overlay in and out.
    * @method SLIDE
    * @static
    * @param {Overlay} overlay The Overlay object to animate
    * @param {Number} dur The duration of the animation
    * @return {ContainerEffect} The configured ContainerEffect object
    */
    ContainerEffect.SLIDE = function (overlay, dur) {
    
        var x = overlay.cfg.getProperty("x") || Dom.getX(overlay.element),
    
            y = overlay.cfg.getProperty("y") || Dom.getY(overlay.element),
    
            clientWidth = Dom.getClientWidth(),
    
            offsetWidth = overlay.element.offsetWidth,
    
            slide = new ContainerEffect(overlay, 
            
            { attributes: { points: { to: [x, y] } },
                duration: dur,
                method: Easing.easeIn },
    
            { attributes: { points: { to: [(clientWidth + 25), y] } },
                duration: dur,
                method: Easing.easeOut },
    
            overlay.element, YAHOO.util.Motion);
        
        
        slide.handleStartAnimateIn = function (type,args,obj) {
            obj.overlay.element.style.left = ((-25) - offsetWidth) + "px";
            obj.overlay.element.style.top  = y + "px";
        };
        
        slide.handleTweenAnimateIn = function (type, args, obj) {
        
            var pos = Dom.getXY(obj.overlay.element),
                currentX = pos[0],
                currentY = pos[1];
        
            if (Dom.getStyle(obj.overlay.element, "visibility") == 
                "hidden" && currentX < x) {

                Dom.setStyle(obj.overlay.element, "visibility", "visible");

            }
        
            obj.overlay.cfg.setProperty("xy", [currentX, currentY], true);
            obj.overlay.cfg.refireEvent("iframe");
        };
        
        slide.handleCompleteAnimateIn = function (type, args, obj) {
            obj.overlay.cfg.setProperty("xy", [x, y], true);
            obj.startX = x;
            obj.startY = y;
            obj.overlay.cfg.refireEvent("iframe");
            obj.animateInCompleteEvent.fire();
        };
        
        slide.handleStartAnimateOut = function (type, args, obj) {
    
            var vw = Dom.getViewportWidth(),
                pos = Dom.getXY(obj.overlay.element),
                yso = pos[1],
                currentTo = obj.animOut.attributes.points.to;
    
            obj.animOut.attributes.points.to = [(vw + 25), yso];
    
        };
        
        slide.handleTweenAnimateOut = function (type, args, obj) {
    
            var pos = Dom.getXY(obj.overlay.element),
                xto = pos[0],
                yto = pos[1];
        
            obj.overlay.cfg.setProperty("xy", [xto, yto], true);
            obj.overlay.cfg.refireEvent("iframe");
        };
        
        slide.handleCompleteAnimateOut = function (type, args, obj) {
            Dom.setStyle(obj.overlay.element, "visibility", "hidden");
        
            obj.overlay.cfg.setProperty("xy", [x, y]);
            obj.animateOutCompleteEvent.fire();
        };
        
        slide.init();
        return slide;
    };
    
    ContainerEffect.prototype = {
    
        /**
        * Initializes the animation classes and events.
        * @method init
        */
        init: function () {

            this.beforeAnimateInEvent = this.createEvent("beforeAnimateIn");
            this.beforeAnimateInEvent.signature = CustomEvent.LIST;
            
            this.beforeAnimateOutEvent = this.createEvent("beforeAnimateOut");
            this.beforeAnimateOutEvent.signature = CustomEvent.LIST;
        
            this.animateInCompleteEvent = this.createEvent("animateInComplete");
            this.animateInCompleteEvent.signature = CustomEvent.LIST;
        
            this.animateOutCompleteEvent = 
                this.createEvent("animateOutComplete");
            this.animateOutCompleteEvent.signature = CustomEvent.LIST;
        
            this.animIn = new this.animClass(this.targetElement, 
                this.attrIn.attributes, this.attrIn.duration, 
                this.attrIn.method);

            this.animIn.onStart.subscribe(this.handleStartAnimateIn, this);
            this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this);

            this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, 
                this);
        
            this.animOut = new this.animClass(this.targetElement, 
                this.attrOut.attributes, this.attrOut.duration, 
                this.attrOut.method);

            this.animOut.onStart.subscribe(this.handleStartAnimateOut, this);
            this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this);
            this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, 
                this);

        },
        
        /**
        * Triggers the in-animation.
        * @method animateIn
        */
        animateIn: function () {
            this.beforeAnimateInEvent.fire();
            this.animIn.animate();
        },
        
        /**
        * Triggers the out-animation.
        * @method animateOut
        */
        animateOut: function () {
            this.beforeAnimateOutEvent.fire();
            this.animOut.animate();
        },
        
        /**
        * The default onStart handler for the in-animation.
        * @method handleStartAnimateIn
        * @param {String} type The CustomEvent type
        * @param {Object[]} args The CustomEvent arguments
        * @param {Object} obj The scope object
        */
        handleStartAnimateIn: function (type, args, obj) { },
    
        /**
        * The default onTween handler for the in-animation.
        * @method handleTweenAnimateIn
        * @param {String} type The CustomEvent type
        * @param {Object[]} args The CustomEvent arguments
        * @param {Object} obj The scope object
        */
        handleTweenAnimateIn: function (type, args, obj) { },
    
        /**
        * The default onComplete handler for the in-animation.
        * @method handleCompleteAnimateIn
        * @param {String} type The CustomEvent type
        * @param {Object[]} args The CustomEvent arguments
        * @param {Object} obj The scope object
        */
        handleCompleteAnimateIn: function (type, args, obj) { },
        
        /**
        * The default onStart handler for the out-animation.
        * @method handleStartAnimateOut
        * @param {String} type The CustomEvent type
        * @param {Object[]} args The CustomEvent arguments
        * @param {Object} obj The scope object
        */
        handleStartAnimateOut: function (type, args, obj) { },
    
        /**
        * The default onTween handler for the out-animation.
        * @method handleTweenAnimateOut
        * @param {String} type The CustomEvent type
        * @param {Object[]} args The CustomEvent arguments
        * @param {Object} obj The scope object
        */
        handleTweenAnimateOut: function (type, args, obj) { },
    
        /**
        * The default onComplete handler for the out-animation.
        * @method handleCompleteAnimateOut
        * @param {String} type The CustomEvent type
        * @param {Object[]} args The CustomEvent arguments
        * @param {Object} obj The scope object
        */
        handleCompleteAnimateOut: function (type, args, obj) { },
        
        /**
        * Returns a string representation of the object.
        * @method toString
        * @return {String} The string representation of the ContainerEffect
        */
        toString: function () {
            var output = "ContainerEffect";
            if (this.overlay) {
                output += " [" + this.overlay.toString() + "]";
            }
            return output;
        }
    
    };

    YAHOO.lang.augmentProto(ContainerEffect, YAHOO.util.EventProvider);

})();