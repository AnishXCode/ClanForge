export const SNAKE_GAME_HTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; background-color: #0F172A; display: flex; justify-content: center; align-items: center; height: 100vh; color: white; font-family: sans-serif; }
        canvas { border: 2px solid #22D3EE; box-shadow: 0 0 20px rgba(34, 211, 238, 0.2); }
    </style>
</head>
<body>
    <h3 id="score">Score: 0</h3>
    <canvas id="game" width="300" height="300"></canvas>
    
    <script>
        // ... PASTE YOUR ENTIRE GAME LOGIC HERE ...
        // Ensure you have the 'window.ReactNativeWebView.postMessage' logic for Game Over
    </script>
</body>
</html>
`;