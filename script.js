(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Three.js floating constellation hearts ---------- */
  (function(){
    var mount=$("#three-bg");
    if(!mount||!window.THREE||reduce)return;
    try{
      var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);
      camera.position.z=12;
      var renderer=new THREE.WebGLRenderer({canvas:mount,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight,false);
      var group=new THREE.Group();scene.add(group);
      var heartShape=new THREE.Shape();
      heartShape.moveTo(0,-.25);heartShape.bezierCurveTo(-1.4,-1.1,-1.7,.25,-.85,.72);heartShape.bezierCurveTo(-.45,1,.0,.55,.0,.45);heartShape.bezierCurveTo(.5,1.05,1.65,.65,1.1,-.15);heartShape.bezierCurveTo(.75,-.6,.25,-.9,0,-.25);
      var geo=new THREE.ExtrudeGeometry(heartShape,{depth:.14,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.08,bevelThickness:.08});
      var colors=[0xffc4dc,0xbadfff,0xe2c6ff,0xffe7a4];
      for(var i=0;i<15;i++){var mat=new THREE.MeshStandardMaterial({color:colors[i%colors.length],metalness:.25,roughness:.3,transparent:true,opacity:.48});var mesh=new THREE.Mesh(geo,mat);mesh.position.set((Math.random()-.5)*19,(Math.random()-.5)*12,(Math.random()-.5)*7);var scale=.12+Math.random()*.22;mesh.scale.setScalar(scale);mesh.userData={phase:Math.random()*6,speed:.3+Math.random()*.55};group.add(mesh);}
      scene.add(new THREE.AmbientLight(0xffffff,1.8));var glow=new THREE.PointLight(0xffd4f0,3,25);glow.position.set(2,3,6);scene.add(glow);
      function resizeThree(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)}
      addEventListener("resize",resizeThree,{passive:true});
      function draw(t){requestAnimationFrame(draw);group.rotation.y=Math.sin(t*.00018)*.11;group.rotation.x=Math.cos(t*.00013)*.05;group.children.forEach(function(m){m.position.y+=Math.sin(t*.00045*m.userData.speed+m.userData.phase)*.0018;m.rotation.z=Math.sin(t*.0003+m.userData.phase)*.12});renderer.render(scene,camera)}
      requestAnimationFrame(draw);
    }catch(e){mount.style.display="none";}
  })();

  /* ---------- Anime.js page entrance ---------- */
  if(window.anime&&!reduce){anime({targets:".hero .eyebrow, .hero-title span, .hero .rot-word, .hero-name, .hero .cue",translateY:[22,0],opacity:[0,1],delay:anime.stagger(130,{start:120}),duration:1050,easing:"easeOutExpo"});}

  /* ---------- Homescreen keepsake: a soft pointer tilt on larger screens ---------- */
  var homeFrame=$("#homeScreenFrame");
  if(homeFrame&&!reduce&&matchMedia("(pointer:fine)").matches){
    homeFrame.addEventListener("pointermove",function(e){var r=homeFrame.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;homeFrame.style.transform="perspective(900px) rotateY("+(x*7).toFixed(2)+"deg) rotateX("+(-y*6).toFixed(2)+"deg) translateY(-4px)";});
    homeFrame.addEventListener("pointerleave",function(){homeFrame.style.transform="";});
  }
  if(homeFrame&&window.anime&&!reduce){var homeReveal=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){anime({targets:"#homeScreenFrame",rotate:[-6,-2],scale:[.94,1],duration:1200,easing:"easeOutElastic(1,.7)"});anime({targets:".orbiting-heart",translateY:[10,-8],scale:[.5,1.15],duration:950,delay:350,easing:"easeOutBack"});homeReveal.disconnect();}});},{threshold:.35});homeReveal.observe(homeFrame);}

  /* ---------- Rotating wish words ---------- */
  var words = ["My Love", "My Cutie", "My Sweety", "My Everything", "My Favourite Person", "My Beautiful Railly", "My Forever"];
  var rot = $("#rotator"), wi = 0;
  function nextWord() {
    var old = $(".rot-word", rot);
    old.classList.add("out");
    setTimeout(function () {
      wi = (wi + 1) % words.length;
      var n = document.createElement("span");
      n.className = "rot-word";
      n.textContent = words[wi];
      rot.innerHTML = "";
      rot.appendChild(n);
    }, 600);
  }
  setInterval(nextWord, 2600);

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); if(window.anime&&!reduce){anime({targets:e.target,opacity:[0,1],translateY:[18,0],duration:850,easing:"easeOutCubic"});} io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = (el.classList.contains("poem") ? 0 : (i % 3) * 80) + "ms";
    io.observe(el);
  });

  /* ---------- Progress, dots, parallax ---------- */
  var prog = $("#progress");
  var sections = $$("section[data-title]");
  var dots = $("#dots");
  sections.forEach(function (s) {
    var a = document.createElement("a");
    a.href = "#" + s.id; a.title = s.getAttribute("data-title"); a.setAttribute("aria-label", a.title);
    dots.appendChild(a);
  });
  var dotEls = $$("a", dots);
  var figs = $$(".masonry img, .polaroid img");
  var ticking = false;
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    var mid = scrollY + innerHeight / 2, cur = 0;
    sections.forEach(function (s, i) { if (s.offsetTop <= mid) cur = i; });
    dotEls.forEach(function (d, i) { d.classList.toggle("on", i === cur); });
    if (!reduce) {
      figs.forEach(function (img) {
        var r = img.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = "translateY(" + (p * -14).toFixed(1) + "px) scale(1.06)";
      });
    }
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Background: stars and floating hearts ---------- */
  var cv = $("#bg"), cx = cv.getContext("2d"), W, H, dpr = Math.min(devicePixelRatio || 1, 2);
  var stars = [], hearts = [];
  function size() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = []; var n = Math.round(W * H / 9000);
    for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, t: Math.random() * 6 });
  }
  size(); addEventListener("resize", size);
  function heart(c, x, y, s, col, a) {
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = a; c.fillStyle = col;
    c.beginPath(); c.moveTo(0, 0.35);
    c.bezierCurveTo(-1, -0.4, -0.5, -1.1, 0, -0.55);
    c.bezierCurveTo(0.5, -1.1, 1, -0.4, 0, 0.35);
    c.fill(); c.restore();
  }
  function spawnHeart() {
    hearts.push({ x: Math.random() * W, y: H + 30, s: Math.random() * 14 + 8, v: Math.random() * .6 + .3, w: Math.random() * 2 + 1, p: Math.random() * 6, c: ["#ff9ec0", "#a9cbff", "#ffd77a", "#ffffff"][Math.floor(Math.random() * 4)] });
  }
  var tick = 0;
  function loop() {
    tick++;
    cx.clearRect(0, 0, W, H);
    stars.forEach(function (s) {
      s.t += .02;
      cx.globalAlpha = .4 + Math.sin(s.t) * .35; cx.fillStyle = "#fff";
      cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.3); cx.fill();
    });
    if (!reduce && tick % 28 === 0 && hearts.length < 26) spawnHeart();
    hearts.forEach(function (h) {
      h.y -= h.v; h.p += .02;
      heart(cx, h.x + Math.sin(h.p) * 22, h.y, h.s, h.c, .35);
    });
    hearts = hearts.filter(function (h) { return h.y > -40; });
    requestAnimationFrame(loop);
  }
  loop();

  /* ---------- Wish lanterns ---------- */
  var wishes = ["Happy Birthday my love", "Happy Birthday my cutie", "Happy Birthday my sweety", "You are my sunshine", "My Railly", "Happy Birthday my queen", "Forever your Moha", "My heart is yours", "Happy Birthday beautiful", "My favourite person", "Make a wish my love", "You are my everything", "Happy Birthday my angel", "Smile my cutie"];
  var lan = $("#lanterns");
  function addLantern(i) {
    var l = document.createElement("div");
    l.className = "lantern"; l.textContent = wishes[i % wishes.length];
    l.style.left = (Math.random() * 70 + 2) + "%";
    l.style.animationDuration = (11 + Math.random() * 7) + "s";
    l.style.animationDelay = (-Math.random() * 14) + "s";
    l.style.fontSize = (.85 + Math.random() * .4) + "rem";
    lan.appendChild(l);
  }
  for (var i = 0; i < wishes.length; i++) addLantern(i);

  /* ---------- Confetti, balloons, fireworks (shared overlay) ---------- */
  var fx = document.createElement("canvas");
  fx.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:70";
  document.body.appendChild(fx);
  var fc = fx.getContext("2d"), parts = [], running = false;
  function fxSize() { fx.width = innerWidth * dpr; fx.height = innerHeight * dpr; fc.setTransform(dpr, 0, 0, dpr, 0, 0); }
  fxSize(); addEventListener("resize", fxSize);
  var palette = ["#ff9ec0", "#ffd77a", "#a9cbff", "#9fcf6a", "#ffffff", "#e8392f", "#3d7bff"];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function confetti() {
    for (var i = 0; i < 160; i++) parts.push({ k: "c", x: innerWidth / 2 + rnd(-60, 60), y: innerHeight * .6, vx: rnd(-9, 9), vy: rnd(-17, -6), g: .35, r: rnd(4, 9), a: rnd(0, 6), va: rnd(-.3, .3), col: palette[i % palette.length], life: 220 });
    for (var j = 0; j < 14; j++) parts.push({ k: "b", x: rnd(0, innerWidth), y: innerHeight + rnd(20, 300), vx: rnd(-.4, .4), vy: rnd(-3.4, -1.6), g: 0, r: rnd(22, 38), a: rnd(0, 6), va: 0, col: palette[j % palette.length], life: 520 });
    run();
  }
  function firework(x, y) {
    var col = palette[Math.floor(Math.random() * palette.length)];
    for (var i = 0; i < 70; i++) {
      var a = (i / 70) * 6.283, v = rnd(2, 6.5);
      parts.push({ k: "f", x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .06, r: 2.4, col: col, life: 90 });
    }
    run();
  }
  function run() { if (!running) { running = true; requestAnimationFrame(step); } }
  function step() {
    fc.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach(function (p) {
      p.life--; p.x += p.vx; p.y += p.vy; p.vy += p.g;
      if (p.k === "c") { p.a += p.va; p.vx *= .99; fc.save(); fc.translate(p.x, p.y); fc.rotate(p.a); fc.fillStyle = p.col; fc.fillRect(-p.r / 2, -p.r / 3, p.r, p.r / 1.6); fc.restore(); }
      else if (p.k === "b") {
        p.a += .03; var x = p.x + Math.sin(p.a) * 14;
        fc.globalAlpha = .9; fc.fillStyle = p.col;
        fc.beginPath(); fc.ellipse(x, p.y, p.r * .8, p.r, 0, 0, 6.3); fc.fill();
        fc.strokeStyle = "rgba(255,255,255,.6)"; fc.beginPath(); fc.moveTo(x, p.y + p.r); fc.lineTo(x + 4, p.y + p.r + 40); fc.stroke();
        fc.globalAlpha = 1;
      } else { fc.globalAlpha = Math.max(p.life / 90, 0); fc.fillStyle = p.col; fc.beginPath(); fc.arc(p.x, p.y, p.r, 0, 6.3); fc.fill(); fc.globalAlpha = 1; }
    });
    parts = parts.filter(function (p) { return p.life > 0 && p.y < innerHeight + 120 && p.y > -200; });
    if (parts.length) requestAnimationFrame(step); else { running = false; fc.clearRect(0, 0, innerWidth, innerHeight); }
  }
  $("#burst").addEventListener("click", confetti);
  var showTimer;
  $("#finalBurst").addEventListener("click", function () {
    confetti();
    var n = 0; clearInterval(showTimer);
    showTimer = setInterval(function () { firework(rnd(innerWidth * .15, innerWidth * .85), rnd(innerHeight * .15, innerHeight * .5)); if (++n > 14) clearInterval(showTimer); }, 420);
  });
  var fin = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && !reduce) { firework(innerWidth * .3, innerHeight * .3); setTimeout(function () { firework(innerWidth * .7, innerHeight * .35); }, 500); fin.disconnect(); } });
  }, { threshold: .5 });
  fin.observe($("#finale"));

  /* ---------- Cake ---------- */
  var cake = $("#cake"), blow = $("#blow"), msg = $("#wishmsg"), hint = $("#cakeHint"), ct = $("#cakeTitle");
  var wishLines = ["May every wish you made come true, my love.", "Happy Birthday Railly. I wished for you, and I already have you.", "My wish is simple. Many more birthdays beside you."];
  function light() {
    if (cake.classList.contains("lit")) return;
    cake.classList.remove("out"); cake.classList.add("lit");
    hint.textContent = "Now close your eyes and make a wish"; ct.textContent = "Make a wish, my love";
    blow.hidden = false; msg.classList.remove("show");
  }
  cake.addEventListener("click", light);
  cake.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); light(); } });
  blow.addEventListener("click", function () {
    cake.classList.remove("lit"); cake.classList.add("out"); blow.hidden = true;
    msg.textContent = wishLines[Math.floor(Math.random() * wishLines.length)]; msg.classList.add("show");
    hint.textContent = "Tap the cake to light them again"; ct.textContent = "Wish made";
    confetti();
  });

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox"), lbi = $("img", lb);
  $$(".zoomable").forEach(function (f) {
    f.addEventListener("click", function () { lbi.src = $("img", f).src; lbi.alt = $("img", f).alt; lb.hidden = false; });
  });
  lb.addEventListener("click", function () { lb.hidden = true; });
  addEventListener("keydown", function (e) { if (e.key === "Escape") lb.hidden = true; });

  /* ---------- Five-question love quiz ---------- */
  var quizQuestions = [
    {q:"What makes a day feel extra lovely?", a:["A sweet message from you 💌","A little adventure together 🌸","A cozy chat and lots of laughter ☁️"]},
    {q:"Pick our dream date, sweetheart", a:["A sunset walk and hand-holding 🌅","Jollibee and a silly movie 🍗","Roblox, snacks, and your company 🎮"]},
    {q:"What should our love always have?", a:["Honesty and loyalty 🤍","Respect and patience 🌷","All of these, every day 💖"]},
    {q:"What would I happily do for you?", a:["Listen to every story 🎧","Cheer for every dream ✨","Show up with care, again and again 🫶"]},
    {q:"The most important question…", a:["Will you let me keep making you smile? 😊","May I be your favorite person? 💞","Will you be my girlfriend, if your heart says yes? 💌"]}
  ];
  var quizCard = $("#quizCard"), qi = 0;
  function showQuiz(){
    if(!quizCard)return;
    var item=quizQuestions[qi];
    quizCard.innerHTML='<p class="quiz-progress">Question '+(qi+1)+' of 5</p><h3>'+item.q+'</h3><div class="quiz-options"></div>';
    var options=$(".quiz-options",quizCard);
    item.a.forEach(function(answer){var b=document.createElement("button");b.className="quiz-option";b.textContent=answer;b.addEventListener("click",function(){qi++;if(qi<quizQuestions.length)showQuiz();else quizCard.innerHTML='<p class="quiz-result">Every answer is sweeter because it is yours. Thank you for playing, my love! 💗</p>';});options.appendChild(b);});
  }
  showQuiz();

  /* ---------- A gentle, no-pressure proposal response ---------- */
  var yesBtn=$("#yesBtn"), answerMsg=$("#answerMsg");
  if(yesBtn)yesBtn.addEventListener("click",function(){answerMsg.textContent="Whatever your answer, I will respect your heart. If it is yes, you just made my whole world sparkle. 💖";yesBtn.textContent="A little love for you 💖";confetti();});

  /* ---------- Many-language love note ---------- */
  var languageWords=[
    ["English","I love you"],["Filipino / Tagalog","Mahal kita"],["Hindi","मैं तुमसे प्यार करता हूँ"],["Bengali","আমি তোমাকে ভালোবাসি"],["Tamil","நான் உன்னை காதலிக்கிறேன்"],["Telugu","నేను నిన్ను ప్రేమిస్తున్నాను"],["Marathi","मी तुझ्यावर प्रेम करतो"],["Gujarati","હું તને પ્રેમ કરું છું"],["Punjabi","ਮੈਂ ਤੈਨੂੰ ਪਿਆਰ ਕਰਦਾ ਹਾਂ"],["Kannada","ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ"],["Malayalam","ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു"],["Urdu","میں تم سے محبت کرتا ہوں"],["Spanish","Te amo"],["French","Je t’aime"],["Italian","Ti amo"],["Portuguese","Eu te amo"],["German","Ich liebe dich"],["Dutch","Ik hou van jou"],["Swedish","Jag älskar dig"],["Norwegian","Jeg elsker deg"],["Danish","Jeg elsker dig"],["Finnish","Rakastan sinua"],["Icelandic","Ég elska þig"],["Irish","Tá grá agam duit"],["Welsh","Rwy’n dy garu di"],["Polish","Kocham cię"],["Czech","Miluji tě"],["Slovak","Ľúbim ťa"],["Ukrainian","Я тебе кохаю"],["Russian","Я тебя люблю"],["Greek","Σ’ αγαπώ"],["Turkish","Seni seviyorum"],["Arabic","أحبك"],["Hebrew","אני אוהב אותך"],["Persian","دوستت دارم"],["Chinese (Mandarin)","我爱你"],["Cantonese","我愛你"],["Japanese","愛してる"],["Korean","사랑해"],["Thai","ฉันรักคุณ"],["Vietnamese","Anh yêu em"],["Indonesian","Aku cinta kamu"],["Malay","Saya cintakan awak"],["Swahili","Nakupenda"],["Afrikaans","Ek is lief vir jou"],["Zulu","Ngiyakuthanda"],["Xhosa","Ndiyakuthanda"],["Yoruba","Mo nífẹ̀ẹ́ rẹ"],["Hausa","Ina son ka"],["Amharic","እወድሃለሁ"],["Hawaiian","Aloha au iā ʻoe"],["Māori","Aroha ahau ki a koe"],["Samoan","Ou te alofa ia te oe"],["Esperanto","Mi amas vin"],["Latin","Te amo"]
  ];
  var langBtn=$("#loveLanguages"), langList=$("#languageList"), langNote=$("#languageNote");
  if(langBtn)langBtn.addEventListener("click",function(){langList.hidden=false;langList.innerHTML="";languageWords.forEach(function(pair,i){var span=document.createElement("span");span.textContent=pair[0]+" — "+pair[1];span.style.animationDelay=(i%12)*45+"ms";langList.appendChild(span);});langNote.textContent="A little collection from many languages around our beautiful world — and in every one, my heart means you. 💗";langBtn.textContent="My love, in 54 languages 💞";langBtn.disabled=true;confetti();});

  /* ---------- Hand drawn icons ---------- */
  function svg(inner) { return '<svg viewBox="0 0 100 100" aria-hidden="true">' + inner + "</svg>"; }
  $("#iconBlue").innerHTML = svg('<defs><linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9cbff"/><stop offset="1" stop-color="#3d7bff"/></linearGradient></defs><path d="M50 92C20 66 8 46 8 30a22 22 0 0 1 42-9 22 22 0 0 1 42 9c0 16-12 36-42 62z" fill="url(#gb)"/><path d="M26 28a10 10 0 0 1 12-9" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>');
  $("#iconChicken").innerHTML = svg('<path d="M30 70c-12-4-16-22-6-34 8-10 24-12 36-6 14 6 18 22 10 34-6 9-20 12-40 6z" fill="#e8a23a"/><path d="M34 62c-6-3-7-14-1-21 6-6 16-8 24-3" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/><rect x="62" y="64" width="22" height="9" rx="4.5" transform="rotate(35 62 64)" fill="#fff4d6"/><circle cx="84" cy="80" r="7" fill="#fff4d6"/><circle cx="78" cy="86" r="6" fill="#fff4d6"/><path d="M22 20q14-12 30-4" stroke="#e8392f" stroke-width="7" fill="none" stroke-linecap="round"/>');
  $("#iconAvocado").innerHTML = svg('<path d="M30 52a20 20 0 0 1 40 0v12H30z" fill="#fff4d6"/><path d="M26 56a24 24 0 0 1 48 0z" fill="#9fcf6a"/><circle cx="50" cy="40" r="10" fill="#6b4a2a"/><path d="M34 60h32L50 92z" fill="#e8b56a"/><path d="M34 60l16 32 16-32" stroke="#c98a3a" stroke-width="3" fill="none"/>');
  $("#iconRoblox").innerHTML = svg('<rect x="22" y="22" width="56" height="56" rx="8" transform="rotate(18 50 50)" fill="#fff"/><rect x="40" y="40" width="20" height="20" rx="3" transform="rotate(18 50 50)" fill="#0b1b3a"/>');
  $("#iconTravel").innerHTML = svg('<path d="M14 58l72-30-18 50-16-16-12 14-4-18z" fill="#a9cbff"/><path d="M36 60l32-24" stroke="#3d7bff" stroke-width="4" stroke-linecap="round"/><path d="M12 86q38-12 76 0" stroke="#ffd77a" stroke-width="3" stroke-dasharray="3 6" fill="none" stroke-linecap="round"/>');
  $("#iconHeritage").innerHTML = svg('<circle cx="50" cy="50" r="30" fill="#3d7bff"/><path d="M28 40q12-14 28-6t-2 18-16 14-10-26z" fill="#9fcf6a"/><path d="M60 58q10-4 14 6t-10 8z" fill="#9fcf6a"/><circle cx="78" cy="24" r="10" fill="#ffd77a"/>');

  /* ---------- Optional music: add music.mp3 to this folder ---------- */
  var audio = new Audio("music.mp3"); audio.loop = true; audio.preload = "none";
  var mb = $("#musicBtn");
  audio.addEventListener("canplay", function () { mb.hidden = false; }, { once: true });
  audio.addEventListener("error", function () { mb.hidden = true; });
  audio.load();
  mb.addEventListener("click", function () {
    if (audio.paused) { audio.play(); mb.textContent = "Pause music"; } else { audio.pause(); mb.textContent = "Music"; }
  });
  setTimeout(function () { if (audio.readyState === 0) { try { audio.preload = "metadata"; audio.load(); } catch (e) {} } }, 300);
})();
