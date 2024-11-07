$(document).ready(function () {
  // エンターをクリックして説明画面に移行
  $("#enterButton").click(function () {
    $("#entranceScreen").addClass("hidden");
    $("#gameDescription").removeClass("hidden");
  });

  // ゲーム説明の「ゲームを開始」をクリックしてスロットマシーンの画面に移行
  $("#startGameButton").click(function () {
    $("#gameDescription").addClass("hidden");
    $("#slotMachine").removeClass("hidden");
  });
});

$(document).ready(function () {
  const symbols = ["🍒", "🍋", "🍇", "🍐", "⭐"];
  //   最初の持ち点
  let score = 100;

  function updateScore() {
    $("#score").text(score);
  }

  function spinReel() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  }

  function showJackpot() {
    // JACKPOTメッセージの準備
    $("#jackpotMessage").text("JACKPOT!!").show();

    // 動画を動的に作成して背景に追加
    const video = $("<video>", {
      id: "coinVideo",
      class: "background-video",
      autoplay: true,
      muted: true,
    }).append(
      $("<source>", {
        src: "./img/11269_1280x720.mp4", // 動画のパス
        type: "video/mp4",
      })
    );

    // JACKPOTモードに切り替え
    $("body").addClass("jackpot-active");
    $("body").append(video);
    video[0].play();

    // 7秒後にJACKPOTメッセージを非表示にし、動画を削除
    setTimeout(() => {
      $("#jackpotMessage").hide();
      video.remove(); // 動画を削除
      $("body").removeClass("jackpot-active"); // 元の画面に戻す
    }, 7000);
  }

  function animateReel(reelId) {
    const reelElement = $(`#${reelId}`);
    let currentSymbolIndex = 0;

    const interval = setInterval(() => {
      currentSymbolIndex = (currentSymbolIndex + 1) % symbols.length;
      reelElement.text(symbols[currentSymbolIndex]);
    }, 100);

    return interval;
  }

  function stopReel(interval, reelId, baseSymbol = null) {
    clearInterval(interval);

    // baseSymbol がある場合、そのシンボルと一致する確率を50%に設定
    let finalSymbol;
    if (baseSymbol && Math.random() < 0.5) {
      finalSymbol = baseSymbol;
    } else {
      finalSymbol = spinReel();
    }

    $(`#${reelId}`).text(finalSymbol);
    return finalSymbol;
  }

  function launchFireworks() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.speed = Math.random() * 6 + 4;
      this.angle = Math.random() * Math.PI * 2;
      this.size = Math.random() * 5 + 2;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.alpha = 1;

      this.update = function () {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.size *= 0.96;
        this.alpha -= 0.01;
      };

      this.draw = function () {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
    }

    function createFirework(x, y) {
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(x, y));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.alpha <= 0 || particle.size <= 0.5) {
          particles.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    }

    function launchMultipleFireworks() {
      const interval = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = (Math.random() * canvas.height) / 2;
        createFirework(x, y);
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 10000);
    }

    launchMultipleFireworks();
    animate();
  }

  //   function showJackpot() {
  //     // JACKPOTメッセージを表示
  //     $("#jackpotMessage").removeClass("hidden");

  //     // 動画を再生
  //     const video = $("#coinVideo");
  //     video.removeClass("hidden"); // ビデオを表示
  //     video.currentTime = 0; // 動画を最初から再生
  //     video.play();

  //     // 10秒後にJACKPOTメッセージを非表示にする
  //     setTimeout(() => {
  //       $("#jackpotMessage").addClass("hidden");
  //       video.pause(); // 動画を停止
  //       video.currentTime = 0; // 動画をリセット
  //     }, 10000);
  //   }

  $("#startButton").click(function () {
    $("#result").text("");

    const interval1 = animateReel("reel1");
    const interval2 = animateReel("reel2");
    const interval3 = animateReel("reel3");

    setTimeout(() => {
      const reel1 = stopReel(interval1, "reel1");
      setTimeout(() => {
        const reel2 = stopReel(interval2, "reel2", reel1); // reel1 と一致する確率を高める
        setTimeout(() => {
          const reel3 = stopReel(interval3, "reel3");
          console.log(reel1, reel2, reel3);
          if (reel1 === reel2 && reel2 === reel3) {
            if (reel1 === "⭐") {
              score += 20; // スターが揃った場合、特別な得点
              showJackpot(); // JACKPOT処理を実行
            } else {
              score += 10; // 通常の得点
              $("#result").text("おめでとう！大当たり！");
              launchFireworks();
            }
          } else {
            score -= 5;
            $("#result").text("残念！もう一度挑戦してね❤︎");
          }
          updateScore();
          console.log(score);
        }, 1000);
      }, 1000);
    }, 1000);
  });
  // 初期スコアの表示
  updateScore();
  console.log(score);
  // ページ読み込み時にビデオを非表示に設定
  //   $("#coinVideo").addClass("hidden");
});
