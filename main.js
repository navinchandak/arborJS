
//
//  main.js
//
//  A project template for using arbor.js
//
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}
(function($){
    function getMousePos(canvas, evt){
        // get canvas position
        var obj = canvas;
        var top = 0;
        var left = 0;
        while (obj && obj.tagName != 'BODY') {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
 
        // return relative mouse position
        var mouseX = evt.clientX - left + window.pageXOffset;
        var mouseY = evt.clientY - top + window.pageYOffset;
        return {
            x: mouseX,
            y: mouseY
        };
    }
    var Renderer = function(canvas){
        var canvas = $(canvas).get(0)
        var ctx = canvas.getContext("2d");
        var particleSystem
        var nodes;
        var highlight=false;
        var tooltipState=false;
        var rightmousedown=0;

        var tooltip=function(){
            var id = 'tt';
            var top = 3;
            var left = 3;
            var maxw = 300;
            var speed = 10;
            var timer = 20;
            var endalpha = 95;
            var alpha = 0;
            var tt,t,c,b,h;
            var ie = document.all ? true : false;
            return{
                pos:function(e){
                    var u = ie ? e.clientY + document.documentElement.scrollTop : e.pageY;
                    var l = ie ? e.clientX + document.documentElement.scrollLeft : e.pageX;
                    tt.style.top = (u - h) + 'px';
                    tt.style.left = (l + left) + 'px';
                },
                show:function(e,v,w){
                    if(tt == null){
                        tt = document.createElement('div');
                        tt.setAttribute('id',id);
                        t = document.createElement('div');
                        t.setAttribute('id',id + 'top');
                        c = document.createElement('div');
                        c.setAttribute('id',id + 'cont');
                        b = document.createElement('div');
                        b.setAttribute('id',id + 'bot');
                        tt.appendChild(t);
                        tt.appendChild(c);
                        tt.appendChild(b);
                        document.body.appendChild(tt);
                        tt.style.opacity = 0;
                        tt.style.filter = 'alpha(opacity=0)';
	   
                        document.onmousemove = this.pos;
                    }
                    tt.style.display = 'block';
                    c.innerHTML = v;
                    tt.style.width = w ? w + 'px' : 'auto';
                    if(!w && ie){
                        t.style.display = 'none';
                        b.style.display = 'none';
                        tt.style.width = tt.offsetWidth;
                        t.style.display = 'block';
                        b.style.display = 'block';
                    }
                    if(tt.offsetWidth > maxw){
                        tt.style.width = maxw + 'px'
                    }
                    h = parseInt(tt.offsetHeight) + top;
                    clearInterval(tt.timer);
                    tt.timer = setInterval(function(){
                        tooltip.fade(1)
                    },timer);
                    this.pos(e);
                },

                fade:function(d){
                    var a = alpha;
                    if((a != endalpha && d == 1) || (a != 0 && d == -1)){
                        var i = speed;
                        if(endalpha - a < speed && d == 1){
                            i = endalpha - a;
                        }else if(alpha < speed && d == -1){
                            i = a;
                        }
                        alpha = a + (i * d);
                        tt.style.opacity = alpha * .01;
                        tt.style.filter = 'alpha(opacity=' + alpha + ')';
                    } else {
                        clearInterval(tt.timer);
                        if(d == -1){
                            tt.style.display = 'none'
                        }
                    }
                },
                hide:function(){
                    clearInterval(tt.timer);
                    tt.timer = setInterval(function(){
                        tooltip.fade(-1)
                    },timer);
                }
            };
        }();

        var that = {
    
            init:function(system){
                //
                // the particle system will call the init function once, right before the
                // first frame is to be drawn. it's a good place to set up the canvas and
                // to pass the canvas size to the particle system
                //
                // save a reference to the particle system for use in the .redraw() loop
                particleSystem = system
                canvas.addEventListener('mouseup',function(evt){ 
                    } ,false);
                canvas.addEventListener('mouseup',function(e){ 
                    //system.graft(the
                    //document.getElementById("hi").innerHTML += (e.which+" "+tooltipState);
                    if(e.which == 3 && tooltipState==false) {
                        curr=(new Date()).getTime();
                        diff=curr-rightmousedown;
                        if(diff<150 ) {
        					
                            tooltipState=true;
                            var pos = $(canvas).offset();
                            mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
                            node = particleSystem.nearest(mouseP).node;
                            tooltip.show(e,node.name);
                        }
                    }
                    else if (tooltipState==true)
                    {
                        tooltip.hide();
                        tooltipState=false;
                    }
                },false);
       

                that.canvas_drag_zoom.init();
                document.getElementById('default').addEventListener( 'click', function(e) {
                    that.canvas_drag_zoom.center();
                }, false  );  


                // inform the system of the screen dimensions so it can map coords for us.
                // if the canvas is ever resized, screenSize should be called again with
                // the new dimensions
                particleSystem.screenSize(canvas.width, canvas.height) 
                particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
                // set up some event handlers to allow for node-dragging
                this.initMouseHandling();
       		
       		
            },
      
            redraw:function(){
                // 
                // redraw will be called repeatedly during the run whenever the node positions
                // change. the new positions for the nodes can be accessed by looking at the
                // .p attribute of a given node. however the p.x & p.y values are in the coordinates
                // of the particle system rather than the screen. you can either map them to
                // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
                // which allow you to step through the actual node objects but also pass an
                // x,y point in the screen's coordinate system
                // 
                ctx.clearRect(-that.canvas_drag_zoom.axisPos.x/that.canvas_drag_zoom.scale,
                    -that.canvas_drag_zoom.axisPos.y/that.canvas_drag_zoom.scale,
                    800/that.canvas_drag_zoom.scale,
                    600/that.canvas_drag_zoom.scale);
                ctx.fillStyle = "black";
                scale=that.canvas_drag_zoom.scale;
                if(scale>1) {
                    font_size=15/scale;
                }
                else font_size=15;
                ctx.font = 'italic '+font_size+'px sans-serif';
                ctx.textAlign="center";
        
                particleSystem.eachEdge (function (edge, pt1, pt2)
                {	
                    ctx.strokeStyle = "rgba(0,0,0, .333)";
                    ctx.lineWidth = 1;
                    ctx.beginPath ();
                    ctx.moveTo (pt1.x, pt1.y);
                    ctx.lineTo (pt2.x, pt2.y);
                    ctx.stroke ();
                    ctx.save();
                    ctx.translate((pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
                    ctx.rotate(Math.atan((pt2.y-pt1.y)/(pt2.x-pt1.x)));
                    ctx.fillText (edge.data.name, 0, 0);
                    ctx.restore();

                });


                particleSystem.eachNode(function(node, pt){
                    // node: {mass:#, p:{x,y}, name:"", data:{}}
                    // pt:   {x:#, y:#}  node position in screen coords
                    // draw a rectangle centered at pt
                    var w = 10
                    ctx.fillStyle = (node.data.alone) ? "orange" : "black"
                    ctx.save();
                    if(highlight==true && node.data.alpha==false) {
                        ctx.globalAlpha=0.5;
                    }
                    else ctx.globalAlpha=1;
                    ctx.beginPath();
                    ctx.fillStyle="red"
                    ctx.arc(pt.x, pt.y, w, 0,2* Math.PI, true);
                    ctx.fill();
                    ctx.fillStyle="black";
                    ctx.fillText (node.name, pt.x, pt.y+5);
                    ctx.restore();
                })    			
            },
      

            canvas_drag_zoom : {
                scale : 1,
                axisPos: {
                    x:0,
                    y:0
                },
                init: function() {
                    ctx.save();
                    var prevPos;
                    canvas.addEventListener('DOMMouseScroll',this.func , false);
                    var handler=function(e){
                        that.canvas_drag_zoom.dragging(e,canvas,prevPos);
                    }
                    canvas.addEventListener('contextmenu', 
                        function(evt) {
                            evt.preventDefault();
                            prevPos=getMousePos(canvas,evt); 
                            mousedownid=canvas.addEventListener('mousemove',
                                handler,false);
                        } ,false);
                    document.addEventListener('mouseup',
                        function(evt) {
                            if(evt.which==3) 

                            {
                                canvas.removeEventListener('mousemove',handler,false);
                            }
                        } , false);
                },
                dragging: function (e,canvas,prevPos) {
                    currPos=getMousePos(canvas,e);
                    var x=currPos.x-prevPos.x;
                    var y=currPos.y-prevPos.y;
                    prevPos.x=currPos.x;
                    prevPos.y=currPos.y;
                    that.canvas_drag_zoom.translate(canvas.getContext('2d'),x,y);
                    that.redraw();
                },
                func: function (evt) {
                    var canvas=document.getElementById("test");
                    var mousePos = getMousePos(canvas, evt);	
                    var k;
                    if(evt.detail<0) {
                        k=1.2; 
                        that.canvas_drag_zoom.scale=that.canvas_drag_zoom.scale*1.2;
                    }
                    else {
                        k=1/1.2;
                        that.canvas_drag_zoom.scale=that.canvas_drag_zoom.scale/1.2;
                    }
                    var x=mousePos.x*(1-k)+(k-1)*that.canvas_drag_zoom.axisPos.x;
                    var y=mousePos.y*(1-k)+(k-1)*that.canvas_drag_zoom.axisPos.y;
                    ctx.scale(k,k);
                    that.canvas_drag_zoom.translate(ctx,x,y);
                    that.redraw();
                },
                translate:function (ctx,x,y) {
                    that.canvas_drag_zoom.axisPos.x+=x;
                    that.canvas_drag_zoom.axisPos.y+=y; 
                    ctx.translate(x/that.canvas_drag_zoom.scale,y/that.canvas_drag_zoom.scale);
                },
                center:function () {
                    ctx.restore();
                    ctx.save();
                    that.canvas_drag_zoom.scale=1;
                    that.canvas_drag_zoom.axisPos.x = 0;
                    that.canvas_drag_zoom.axisPos.y = 0;
                    that.redraw();
                }
            } , 
            initMouseHandling:function(){
                // no-nonsense drag and drop (thanks springy.js)
                var dragged = null;
                // set up a handler object that will initially listen for mousedowns then
                // for moves and mouseups while dragging
                var handler = {
        
                    clicked:function(e){
                        var pos = $(canvas).offset();
                        _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
                        dragged = particleSystem.nearest(_mouseP);
                        //highlight of necessary nodes
                        if ( dragged && dragged.node!==null) {         
                            nodes=new Array();
                            nodes.push(dragged.node);
                            fromEdges=particleSystem.getEdgesFrom(dragged.node);     
                            toEdges=particleSystem.getEdgesTo(dragged.node);
                            for(i=0;i<fromEdges.length;i++)	 {
                                node=particleSystem.getNode(fromEdges[i].target);
                                nodes.push(node);
                            }
                            for(i=0;i<toEdges.length;i++)	 {
                                node=particleSystem.getNode(toEdges[i].source);
                                nodes.push(node);
                            }
                            handler.highlight(nodes);
                        }
                        //dragging of nodes
                        if (dragged && dragged.node !== null){
                            // while we're dragging, don't let physics move the node
                            dragged.node.fixed = true
                        }

                        $(canvas).bind('mousemove', handler.dragged)
                        $(window).bind('mouseup', handler.dropped)
                        return false
                    },
                    highlight : function ( arr) {
                        highlight=true;
                        for(i=0;i<arr.length;i++)	 {
                            arr[i].data.alpha=true;
                        }
                        that.redraw();
                        $(window).bind('mouseup',handler.aplhaDefault);
                    },
          
     
                    dragged:function(e){
                        var pos = $(canvas).offset();
                        var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

                        if (dragged && dragged.node !== null){
                            var p = particleSystem.fromScreen(s)
                            dragged.node.p = p
                        }

                        return false
                    },
                    aplhaDefault: function(e) {
                        for(i=0;i<nodes.length;i++) {
                            nodes.pop().data.alpha=false;
                        }
                        highlight=false;
                        that.redraw();
                    },
                    dropped:function(e){
                        if (dragged===null || dragged.node===undefined) return
                        if (dragged.node !== null) dragged.node.fixed = false
                        dragged.node.tempMass = 1000
                        dragged = null
                        $(canvas).unbind('mousemove', handler.dragged)
                        $(window).unbind('mouseup', handler.dropped)
                        _mouseP = null
                        return false
                    }
                }
        
                // start listening
                $(canvas).mousedown(function(evt) {
                    if (evt.which == 1) {
                        handler.clicked(evt)
                    }
                    if (evt.which == 3) {
                        rightmousedown=new Date().getTime();
                    }
                } );

            },
      
        }
        return that
    }    

    $(document).ready(function(){
        var sys = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
        sys.parameters({
            gravity:true
        }) // use center-gravity to make the graph settle nicely (ymmv)
        sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

        // add some nodes to the graph and watch it go...
        /*  sys.addEdge('a','b')
    sys.addEdge('a','c')
    sys.addEdge('a','d')
    sys.addEdge('a','e')
    sys.addNode('f', {alone:true, mass:.25})*/
	
	
        var theUI = {
            nodes:{
                "A":{
                    color:"red", 
                    shape:"dot", 
                    alpha:false
                }, 
                "B":{
                    color:"#b2b19d", 
                    shape:"dot", 
                    alpha:false
                }, 
                "C":{
                    color:"#b2b19d", 
                    shape:"dot", 
                    alpha:false
                }, 
                "D":{
                    color:"#b2b19d", 
                    shape:"dot", 
                    alpha:false
                },
                "E":{
                    color:"red",
                    shape:"dot",
                    alpha:false
                }
            },
            edges:{
                "A":{
                    "B":{
                        length:.8,
                        width:1, 
                            name:"A-B",
                            target:"B"
                        
                    },
                    "C":{
                        length:.8,
                        width:1, 
                        
                            name:"A-C",
                            target:"C"
                        
                    },
                    "D":{
                        length:.8,
                        width:1, 
                        
                            name:"A-D",
                            target:"D"
                        
                    }
                },
                "D":{
                    "E":{
                        length:.8,
                        width:1,
                        
                            name:"D-E",
                            target:"E"
                        
                    }
                }
            }
        }

        sys.graft(theUI);
    // or, equivalently:
    //
    // sys.graft({
    //   nodes:{
    //     f:{alone:true, mass:.25}
    //   }, 
    //   edges:{
    //     a:{ b:{},
    //         c:{},
    //         d:{},
    //         e:{}
    //     }
    //   }
    // })
    
    })

})(this.jQuery)
