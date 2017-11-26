var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Body = Matter.Body,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint,
  Composites = Matter.Composites,
  Common = Matter.Common,
  Vertices = Matter.Vertices,
  MouseConst = Matter.MouseConstraint,
  　　Mouse = Matter.Mouse,
  Svg = Matter.Svg;
var _engine;
var scale = 1;
var scaleList = ["0.5", "0.8", "1", "1.2", "1.5"];
var numa = Bodies.rectangle(1280, 640, 2560, 160, {
  label: "numa",
  isStatic: true,
  render: {
    fillStyle: "rgba(180, 153, 129, 0.8)",
    strokeStyle: "rgb(180, 153, 129)"
  },
  collisionFilter: {
    mask: 0x0002
  }
});;
var Jyuuminlist = ['GodTanu.png', 'newcoin_jp.png', 'hakase_jiisan.png', 'HowDoYouLikeU.png', 'itumo_nem.png', 'haru28bit.png', 'TrendStream.png', 'Bungaku_Crypto.png', 'dreamcanada.png', 'tomotomo_9696.png', 'gon61811.png', 'him0net.png', 'mizunashi.png', 'wildcatneko.png', 'uhohoiarale.png', 'namuyan_mine.png', '0Ki1981.png', 'Y1aTz9CFIjoVoUD.png', 'momosuke4989.png', 'nyatla.png', 'hbkr.png', 'yuma300.png', 'onoonokatio.png'];

function WorldStart() {
  var container = document.getElementById("container");
  _engine = Engine.create();
  var render = Render.create({
    element: container,
    engine: _engine,
    options: {
      wireframes: false,
      width: 1280,
      height: 720
    }
  });
  _engine.world.bounds.min.x = -2560;
  _engine.world.bounds.min.y = 0;
  _engine.world.bounds.max.x = 2560;
  _engine.world.bounds.max.y = 1000;
  var mouseConstraint = MouseConst.create(_engine, {
    mouse: Mouse.create(container)
  });
  World.add(_engine.world, mouseConstraint);
  var pathelement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathelement.setAttribute("d", "M160,336L96,320L0,256L0,1024L1024,1024L1024,688L960,656L896,608L768,544L704,528L640,496L576,512L384,448L256,384L224,368Z");
  var options = {
    isStatic: true,
    friction: 0,
    render: {
      fillStyle: "#1b8d1b",
      strokeStyle: "#1b8d1b"
    }
  };
  var yama = Bodies.fromVertices(350, 410, Svg.pathToVertices(pathelement), options);
  World.add(_engine.world, yama);
  for (var i = 0; i < Jyuuminlist.length; i++) {
    var rnd = parseInt(Math.random() * 32);
    var x = 320 + rnd * 10;
    var y = -(i * 320);
    SpawnJyuumin(x, y, Jyuuminlist[i]);
  }
  SpawnNuma();
  World.add(_engine.world, [
    Bodies.rectangle(0, 1000, 5120, 160, {
      label: "killer",
      isStatic: true
    }),
    Bodies.rectangle(1280, 640, 2560, 160, {
      label: "numaSensor",
      isStatic: true,
      isSensor: true,
      render: {
        visible: false
      }
    })
  ]);
  Matter.Events.on(_engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];
      if (pair.bodyA.label === "numaSensor") {
        pair.bodyB.frictionAir = 0.5;
      } else if (pair.bodyB.label === "numaSensor") {
        pair.bodyA.frictionAir = 0.5;
      } else if (pair.bodyA.label === "killer") {
        Matter.Composite.remove(_engine.world, pair.bodyB);
      } else if (pair.bodyB.label === "killer") {
        Matter.Composite.remove(_engine.world, pair.bodyA);
      }
    }
  });
  Matter.Events.on(_engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];
      if (pair.bodyA.label === "numaSensor") {
        pair.bodyB.frictionAir = 0.012;
      } else if (pair.bodyB.label === "numaSensor") {
        pair.bodyA.frictionAir = 0.012;
      }
    }
  });
  Engine.run(_engine);
  Render.run(render);
}

function SpawnJyuumin(x, y, imagename) {
  World.add(_engine.world, Bodies.circle(x, y, 60 * scale, { //追加
    label: "jyuumin",
    density: 0.002, //密度 default:0.001
    friction: 0.1, //摩擦 default:0.1
    frictionAir: 0.012, //空気摩擦 default:0.01
    restitution: 0.3, // 弾力性 default:0
    render: { //レンダリング設定
      sprite: { //スプライト設定
        texture: `images/${imagename}`, //テクスチャ画像を指定
        xScale: scale,
        yScale: scale
      }
    },
    collisionFilter: {
      mask: 0x0001
    }
  }));
}

function SpawnNuma() {
  World.add(_engine.world, numa);
}

function WorldReset() {
  World.clear(_engine.world);
  Engine.clear(_engine);
  _engine.events = {};
}

function WorldRestart() {
  WorldReset();
  $("#container").empty();
  WorldStart();
  SeekBGM();
}

function SeekBGM() {
  player.seekTo(23);
}

function Spawn(imagename) {
  var x = 320 + parseInt(Math.random() * 32) * 10;
  var y = -(parseInt(Math.random() * 5) * 320);
  SpawnJyuumin(x, y, imagename);
  Matter.Composite.remove(_engine.world, numa);
  SpawnNuma();
}

function AddJyuuminButton() {
  for (var i = 0; i < Jyuuminlist.length; i++) {
    var elem = $("<button></button>");
    elem.html(`<img src="images/${Jyuuminlist[i]}" width="80" height="80">`);
    elem.addClass("JyuuminButton");
    elem.attr("onclick", `Spawn("${Jyuuminlist[i]}");`);
    $("#buttonlist").append(elem);
  }
}

function checkCookie() {
  if ($.cookie("scale") && scaleList.indexOf($.cookie("scale")) !== -1) {
    scale = $.cookie("scale");
    $(`input[type=radio][name=scale][value="${scale}"]`).prop("checked", true);
  }
}
$(function() {
  $("input[type=radio][name=scale]").change(function() {
    var val = $(this).val();
    if (scaleList.indexOf(val) !== -1) {
      $.cookie("scale", val);
      scale = val;
    } else {
      scale = 1;
    }
  });
});
$(function() {
  checkCookie();
  AddJyuuminButton();
  WorldStart();
});
