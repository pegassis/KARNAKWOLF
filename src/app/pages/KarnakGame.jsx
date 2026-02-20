import React, { useEffect, useRef, useState } from "react";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Load highscore from localStorage
    const savedHighScore = localStorage.getItem("snakeGameHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const gridSize = 20;
    const tileCount = isMobile ? 20 : 30;
    const canvasSize = gridSize * tileCount;

    let currentScore = 0;
    let food = { x: 10, y: 10 };
    let snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let gameRunning = true;
    let gameSpeed = 12;
    let frameCount = 0;
    let animationId;

    // Generate random food position
    function generateFood() {
      let newFood;
      let foodOnSnake;
      do {
        foodOnSnake = false;
        newFood = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        };
        for (let segment of snake) {
          if (segment.x === newFood.x && segment.y === newFood.y) {
            foodOnSnake = true;
            break;
          }
        }
      } while (foodOnSnake);
      return newFood;
    }

    // Draw gradient background
    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(0.5, "#16213e");
      gradient.addColorStop(1, "#0f3460");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvasSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvasSize, i * gridSize);
        ctx.stroke();
      }
    }

    // Draw snake with gradient
    function drawSnake() {
      snake.forEach((segment, index) => {
        const isHead = index === 0;

        if (isHead) {
          // Head with gradient
          const headGradient = ctx.createRadialGradient(
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            0,
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            gridSize
          );
          headGradient.addColorStop(0, "#FFD426");
          headGradient.addColorStop(1, "#FF6B35");
          ctx.fillStyle = headGradient;

          ctx.shadowColor = "rgba(255, 212, 38, 0.6)";
          ctx.shadowBlur = 15;
          ctx.fillRect(
            segment.x * gridSize + 2,
            segment.y * gridSize + 2,
            gridSize - 4,
            gridSize - 4
          );

          // Eyes
          ctx.fillStyle = "#000";
          const eyeSize = 3;
          const eyeOffset = 5;
          ctx.fillRect(
            segment.x * gridSize + (direction.x > 0 ? eyeOffset + 2 : eyeOffset - 2),
            segment.y * gridSize + (direction.y !== 0 ? eyeOffset : eyeOffset),
            eyeSize,
            eyeSize
          );
          ctx.fillRect(
            segment.x * gridSize + (direction.x > 0 ? eyeOffset + 2 : eyeOffset - 2),
            segment.y * gridSize + (direction.y !== 0 ? eyeOffset + 6 : eyeOffset + 8),
            eyeSize,
            eyeSize
          );
        } else {
          // Body with gradient
          const bodyGradient = ctx.createLinearGradient(
            segment.x * gridSize,
            segment.y * gridSize,
            segment.x * gridSize + gridSize,
            segment.y * gridSize + gridSize
          );
          bodyGradient.addColorStop(0, "#35D935");
          bodyGradient.addColorStop(1, "#2DB92D");
          ctx.fillStyle = bodyGradient;

          ctx.shadowColor = "rgba(53, 217, 53, 0.4)";
          ctx.shadowBlur = 10;
          ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
          );
        }
      });

      ctx.shadowColor = "transparent";
    }

    // Draw food with animation
    function drawFood() {
      const pulse = Math.sin(frameCount * 0.1) * 3 + 5;
      const foodGradient = ctx.createRadialGradient(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        0,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 + pulse
      );
      foodGradient.addColorStop(0, "#FF1744");
      foodGradient.addColorStop(1, "#C60000");
      ctx.fillStyle = foodGradient;

      ctx.shadowColor = "rgba(255, 23, 68, 0.8)";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 + pulse / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.shadowColor = "transparent";
    }

    // Draw UI
    function drawUI() {
      // Score box
      ctx.fillStyle = "rgba(210, 187, 187, 0.7)";
      ctx.fillRect(10, 10, 140, 70);

      ctx.strokeStyle = "#FFD426";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 140, 70);

      ctx.fillStyle = "#FFD426";
      ctx.font = "bold 12px Arial";
      ctx.fillText("SCORE", 20, 28);

      ctx.font = "bold 32px Arial";
      ctx.fillText(currentScore, 50, 60);


    }

    // Update game
    function update() {
      direction = nextDirection;

      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      // Wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
      }

      // Self collision
      for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          endGame();
          return;
        }
      }

      snake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);

        // Increase speed every 3 apples eaten
        if (currentScore % 30 === 0 && gameSpeed > 2) {
          gameSpeed = Math.max(gameSpeed - 1, 2);
        }

        playSound();
        food = generateFood();
      } else {
        snake.pop();
      }
    }

    function playSound() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = "sine";

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (e) {
        // Audio context error handling
      }
    }

    function endGame() {
      gameRunning = false;
      cancelAnimationFrame(animationId);

      const newHighScore = Math.max(currentScore, highScore);
      setHighScore(newHighScore);
      localStorage.setItem("snakeGameHighScore", newHighScore.toString());

      setGameState("gameOver");
    }

    function gameLoop() {
      frameCount++;
      drawBackground();
      drawSnake();
      drawFood();
      drawUI();

      if (frameCount % gameSpeed === 0) {
        update();
      }

      if (gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
      }
    }

    // Keyboard and Touch controls
    let lastTouchX = null;
    let lastTouchY = null;

    const handleKeyDown = (e) => {
      if (!gameRunning) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) nextDirection = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case "ArrowDown":
          if (direction.y === 0) nextDirection = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case "ArrowLeft":
          if (direction.x === 0) nextDirection = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case "ArrowRight":
          if (direction.x === 0) nextDirection = { x: 1, y: 0 };
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    const handleTouchStart = (e) => {
      if (!gameRunning) return;
      e.preventDefault();
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (!gameRunning || !lastTouchX || !lastTouchY) return;
      e.preventDefault();

      const currentX = e.changedTouches[0].clientX;
      const currentY = e.changedTouches[0].clientY;
      const diffX = currentX - lastTouchX;
      const diffY = currentY - lastTouchY;
      const threshold = 30;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > threshold && direction.x === 0) {
          nextDirection = { x: 1, y: 0 };
        } else if (diffX < -threshold && direction.x === 0) {
          nextDirection = { x: -1, y: 0 };
        }
      } else {
        if (diffY > threshold && direction.y === 0) {
          nextDirection = { x: 0, y: 1 };
        } else if (diffY < -threshold && direction.y === 0) {
          nextDirection = { x: 0, y: -1 };
        }
      }

      lastTouchX = null;
      lastTouchY = null;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, [gameState, highScore, isMobile]);

  const canvasSize = isMobile ? 400 : 600;

  const startGame = () => {
    setScore(0);
    setGameState("playing");
  };

  const restartGame = () => {
    setScore(0);
    setGameState("playing");
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: isMobile ? "10px" : "20px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1b0800 0%, #0b0b0b 100%)",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          color: "#FFD426",
          textShadow: "0 0 15px #FF6B35, 0 0 30px rgba(255, 107, 53, 0.5)",
          marginBottom: isMobile ? "8px" : "10px",
          fontSize: isMobile ? "1.8rem" : "3rem",
          fontWeight: "bold",
          letterSpacing: "2px",
        }}
      >
         KARNAK SNAKE
      </h1>
      <p style={{ color: "#35D935", fontSize: isMobile ? "1.5rem" : "1.5rem", marginBottom: isMobile ? "12px" : "20px" }}>
        Easter Egg!
      </p>

      <div style={{ position: "relative", display: "inline-block", marginBottom: isMobile ? "20px" : "30px" }}>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            display: "block",
            border: "2px solid #ed0e0e",
            borderRadius: "12px",
            boxShadow: "0 0 30px rgba(82, 13, 1, 0.6), 0 0 60px rgba(0, 0, 0, 0.3)",
            maxWidth: "100%",
            height: "auto",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          }}
        />

        {gameState === "menu" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.85)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              zIndex: 10,
              backdropFilter: "blur(5px)",
            }}
          >
            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ color: "#FFD426", fontSize: "2.5rem", marginBottom: "20px", textShadow: "0 0 10px #FF6B35" }}>
                WELCOME TO SNAKE
              </h2>
              <p style={{ color: "#35D935", fontSize: "1.1rem", marginBottom: "15px" }}>
                Use Arrow Keys to move
              </p>
              <p style={{ color: "#FF8C42", fontSize: "1rem", marginBottom: "25px" }}>
                Eat red food to grow , Avoid hitting walls and yourself
              </p>
            </div>

            <div style={{ marginBottom: "30px", fontSize: "1.1rem" }}>
              <p style={{ color: "#fff", marginBottom: "10px" }}>
                High Score: <span style={{ color: "#35D935", fontSize: "1.5rem", fontWeight: "bold" }}>{highScore}</span>
              </p>
            </div>

            <button
              onClick={startGame}
              style={{
                padding: "18px 50px",
                fontSize: "1.3rem",
                background: "linear-gradient(135deg, #FF6B35 0%, #FFD426 100%)",
                color: "#000",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s",
                boxShadow: "0 8px 20px rgba(255, 107, 53, 0.5)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.08)";
                e.target.style.boxShadow = "0 12px 30px rgba(255, 107, 53, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 8px 20px rgba(255, 107, 53, 0.5)";
              }}
            >
              🚀 START GAME
            </button>
          </div>
        )}

        {gameState === "gameOver" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              zIndex: 10,
              backdropFilter: "blur(5px)",
            }}
          >
            <h2 style={{ color: "#FF6B35", fontSize: "2.8rem", marginBottom: "25px", textShadow: "0 0 10px #FF6B35" }}>
              GAME OVER
            </h2>

            <div style={{ marginBottom: "40px", fontSize: "1.2rem" }}>
              <p style={{ color: "#FFD426", marginBottom: "15px" }}>
                Final Score: <span style={{ fontSize: "2rem", fontWeight: "bold" }}>{score}</span>
              </p>
              <p style={{ color: "#35D935", marginBottom: "10px" }}>
                High Score: <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{highScore}</span>
              </p>
            </div>

            <button
              onClick={restartGame}
              style={{
                padding: "18px 50px",
                fontSize: "1.3rem",
                background: "linear-gradient(135deg, #FF6B35 0%, #FFD426 100%)",
                color: "#000",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s",
                boxShadow: "0 8px 20px rgba(255, 107, 53, 0.5)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.08)";
                e.target.style.boxShadow = "0 12px 30px rgba(255, 107, 53, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 8px 20px rgba(255, 107, 53, 0.5)";
              }}
            >
               PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          maxWidth: isMobile ? "95vw" : "600px",
          margin: isMobile ? "15px auto" : "30px auto",
          padding: isMobile ? "15px" : "25px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "2px solid #35D935",
          borderRadius: "12px",
          color: "#fff",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 style={{ color: "#FFD426", marginBottom: isMobile ? "15px" : "20px", fontSize: isMobile ? "1rem" : "1.3rem" }}> HOW TO PLAY</h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "10px" : "20px", textAlign: "left" }}>
          <div>
            <p style={{ marginBottom: "10px", lineHeight: "1.6", fontSize: isMobile ? "0.85rem" : "1rem" }}>
              <strong style={{ color: "#35D935" }}> Arrow Keys:</strong> Move snake (PC only)
            </p>
            <p style={{ marginBottom: "10px", lineHeight: "1.6", fontSize: isMobile ? "0.85rem" : "1rem" }}>
              <strong style={{ color: "#FF1744" }}> Swipe:</strong> Swipe on the Blue Screen  (mobile)
            </p>
          </div>
          <div>
            <p style={{ marginBottom: "10px", lineHeight: "1.6", fontSize: isMobile ? "0.85rem" : "1rem" }}>
              <strong style={{ color: "#FFD426" }}> Eat Food:</strong> Grow longer and score points
            </p>
            <p style={{ marginBottom: "10px", lineHeight: "1.6", fontSize: isMobile ? "0.85rem" : "1rem" }}>
              <strong style={{ color: "#FF6B35" }}> Speed Increases:</strong> Every 3 apples
            </p>
            
          </div>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <p style={{ color: "#B0B0B0", fontSize: "0.9rem" }}>
          Beat your high score!
        </p>
      </div>
    </div>
  );
};

export default SnakeGame;