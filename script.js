document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('myCanvas');
  const context = canvas.getContext('2d');

  class Camera2D {
      constructor(px, py, W, H, pixelWidth, pixelHeight) {
          this.px = px;
          this.py = py;
          this.W = W;
          this.H = H;
          this.X0 = W / 2;
          this.Y0 = H / 2;
          this.pixelWidth = pixelWidth;
          this.pixelHeight = pixelHeight;
          this.tickLength = 5
      }

      worldToScreen(x, y) {
        const screenX = this.X0 + this.px * x;
        const screenY = this.Y0 - this.py * y; // Инвертируем для учета направления оси Y
        return [screenX, screenY];
    }

      clearWorkspace() {
          context.clearRect(0, 0, this.W, this.H);
      }

      drawVertex(x, y) {
        const [screenX, screenY] = this.worldToScreen(x, y);

        context.beginPath();
        context.arc(screenX, screenY, 3, 0, 2 * Math.PI);
        context.fillStyle = 'red'; // Цвет вершины (можете изменить)
        context.fill();
    }

    drawLine(startX, startY, endX, endY) {
      const [screenStartX, screenStartY] = this.worldToScreen(startX, startY);
      const [screenEndX, screenEndY] = this.worldToScreen(endX, endY);
  
      context.beginPath();
      context.moveTo(screenStartX, screenStartY);
      context.lineTo(screenEndX, screenEndY);
      context.stroke();
  }

      drawAxes() {
          // Построение координатных осей
          this.drawLine(-this.W / (2 * this.px), 0, this.W / (2 * this.px), 0); // Ось X
          this.drawLine(0, this.H / (2 * this.py), 0, -this.H / (2 * this.py));  // Ось Y

          // Разметка делений по обеим осям
          this.drawAxisTicks();
      }

      drawAxisTicks() {
          // Разметка делений по оси X
          this.drawAxisTicksX();

          // Разметка делений по оси Y
          this.drawAxisTicksY();
      }

      drawAxisTicksX() {
        const tickLength = this.tickLength;
        const tickSpacing = this.pixelWidth; // Интервал между делениями в мировых координатах
    
        for (let i = -this.W / (2 * this.px); i <= this.W / (2 * this.px); i += tickSpacing) {
            const x = i;
            const y = 0;
    
            this.drawLine(x, y - tickLength / 2, x, y + tickLength / 2);
            this.drawTickLabel(x, y + tickLength, x);
        }
    }
    
    drawAxisTicksY() {
        const tickLength = this.tickLength;
        const tickSpacing = this.pixelHeight; // Интервал между делениями в мировых координатах
    
        for (let i = -this.H / (2 * this.py); i <= this.H / (2 * this.py); i += tickSpacing) {
            const x = 0;
            const y = i;
    
            this.drawLine(x - tickLength / 2, y, x + tickLength / 2, y);
            this.drawTickLabel(x - tickLength, y, y);
        }
    }

      drawTickLabel(x, y, label) {
          context.font = '10px Arial';
          context.fillStyle = 'black';
          const scaledX = this.X0 + this.px * x;
          const scaledY = this.Y0 - this.py * y;

    context.fillText(label.toFixed(2), scaledX, scaledY + 7);
      }
  }

  class Model2D {
      constructor(vertices, edges) {
          this.originalVertices = vertices;
          this.transformationMatrices = [];
          this.currentVertices = [...vertices];
          this.edges = edges;
      }

      applyAllTransformations() {
        let combinedMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    
        for (const matrix of this.transformationMatrices) {
            combinedMatrix = this.multiplyMatrices(combinedMatrix, matrix);
        }
        this.currentVertices = this.multiplyMatrices(combinedMatrix, this.currentVertices)
        this.transformationMatrices = []
        console.log(this.currentVertices)
    }

      multiplyMatrices(matrixA, matrixB) {
        const result = [];
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixB[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < matrixA[0].length; k++) {
                    sum += matrixA[i][k] * matrixB[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }
  }

  class Scene2D {
      constructor(camera, model) {
          this.camera = camera;
          this.model = model;
      }

      drawVertices() {
        const vertices = this.model.currentVertices;

        for (let i = 0; i < vertices.length; i++) {
            this.camera.drawVertex(vertices[0][i], vertices[1][i]);
        }
    }

    render() {
      this.camera.clearWorkspace();
      this.camera.drawAxes();

      this.drawVertices();  

      const edges = this.model.edges;

      for (let i = 0; i < edges.length; i++) {
        const startVertex = [this.model.currentVertices[0][edges[i][0]], this.model.currentVertices[1][edges[i][0]]];
        const endVertex = [this.model.currentVertices[0][edges[i][1]], this.model.currentVertices[1][edges[i][1]]];
  
        this.camera.drawLine(startVertex[0], startVertex[1], endVertex[0], endVertex[1]);
      }
    }
  }

  const camera = new Camera2D(1, 1, canvas.width, canvas.height, 50, 50);

  const vertices = [
      [50, 100, 100],
      [50, 50, 100 ],
      [1, 1, 1]
      
  ];

  const edges = [
   [0, 1],
   [1, 2],
   [2, 0]
  ];

  const model = new Model2D(vertices, edges);

  const scene = new Scene2D(camera, model);
  scene.render()

  let isDragging = false;
  let dragStartX, dragStartY;

  function applyAllTransformations() {
    model.applyAllTransformations();
    scene.render();
}

document.getElementById('applyTransformationsBtn').addEventListener('click', applyAllTransformations);

 // Обработчик для кнопки T (перенос)
document.getElementById('translateBtn').addEventListener('click', function () {
      const translateX = parseFloat(prompt('Enter translation in X:', '0')) || 0;
      const translateY = parseFloat(prompt('Enter translation in Y:', '0')) || 0;
      const translationMatrix = [
          [1, 0, translateX],
          [0, 1, translateY],
          [0, 0, 1]
      ];
      console.log(translationMatrix)
      model.transformationMatrices.push(translationMatrix);
      applyAllTransformations();
  });

  // Обработчик для кнопки S (масштабирование)
  document.getElementById('scaleBtn').addEventListener('click', function () {
      const scaleX = parseFloat(prompt('Enter scaling factor in X:', '1')) || 1;
      const scaleY = parseFloat(prompt('Enter scaling factor in Y:', '1')) || 1;
      const scalingMatrix = [
          [scaleX, 0, 0],
          [0, scaleY, 0],
          [0, 0, 1]
      ];
      model.transformationMatrices.push(scalingMatrix);
      applyAllTransformations();
  });

  // Обработчик для кнопки R (вращение)
  document.getElementById('rotateBtn').addEventListener('click', function () {
      const angle = parseFloat(prompt('Enter rotation angle in degrees:', '0')) || 0;
      const radianAngle = (angle * Math.PI) / 180;
      const rotationMatrix = [
          [Math.cos(radianAngle), -Math.sin(radianAngle), 0],
          [Math.sin(radianAngle), Math.cos(radianAngle), 0],
          [0, 0, 1]
      ];
      model.transformationMatrices.push(rotationMatrix);
      applyAllTransformations();
  });

  // Обработчик для кнопки M (отражение)
  document.getElementById('mappingBtn').addEventListener('click', function () {
    const reflectionType = prompt('Enter reflection type: (X, Y, XY)').toUpperCase();
    
    // Инициализируем матрицу отражения в зависимости от выбора пользователя
    let reflectionMatrix;
    switch (reflectionType) {
        case 'Y':
            reflectionMatrix = [
                [-1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ];
            break;
        case 'X':
            reflectionMatrix = [
                [1, 0, 0],
                [0, -1, 0],
                [0, 0, 1]
            ];
            break;
        case 'XY':
            reflectionMatrix = [
                [-1, 0, 0],
                [0, -1, 0],
                [0, 0, 1]
            ];
            break;
        default:
            alert('Invalid reflection type.');
            return;
    }
      if (reflectionMatrix) {
        model.transformationMatrices.push(reflectionMatrix);
      }
      applyAllTransformations();
  });

  // Обработчик для кнопки Reset (сброс преобразований)
  document.getElementById('resetBtn').addEventListener('click', function () {
      model.transformationMatrices = [];
      model.currentVertices = [...model.originalVertices]
      applyAllTransformations();
  });

  document.addEventListener('mousedown', function (event) {
      if (event.button === 0) {
          isDragging = true;
          dragStartX = event.clientX;
          dragStartY = event.clientY;
      }
  });

  document.addEventListener('mousemove', function (event) {
      if (isDragging) {
          const deltaX = event.clientX - dragStartX;
          const deltaY = event.clientY - dragStartY;

          camera.X0 += deltaX;
          camera.Y0 += deltaY;

          dragStartX = event.clientX;
          dragStartY = event.clientY;

          scene.render();
      }
  });

  document.addEventListener('mouseup', function (event) {
      if (event.button === 0) {
          isDragging = false;
      }
  });

  document.getElementById('scaleImageBtn').addEventListener('click', function () {
    const scaleCoefficient = parseFloat(prompt('Enter scaling factor:', '1')) || 1;

        // Изменяем свойства камеры
      camera.px *= scaleCoefficient;
      camera.py *= scaleCoefficient;
        // camera.tickLength *= scaleCoefficient
    scene.render();
  });

  document.getElementById('scaleCamera').addEventListener('click', function() {
    const newWidth = parseInt(prompt('Enter new width:', canvas.width), 10) || canvas.width;
    const newHeight = parseInt(prompt('Enter new height:', canvas.height), 10) || canvas.height;

    const newPx = newWidth / camera.W * camera.px
    const newPy = newWidth / camera.W * camera.px
    const newX0 = newWidth / camera.W * camera.X0
    const newY0 = newWidth / camera.W * camera.px / camera.py * camera.Y0 + camera.H / 2 * (newHeight/camera.H - newWidth/camera.W * camera.px / camera.py)

    console.log(newPx, newPy)

    camera.px = newPx
    camera.py = newPy
    camera.X0 = newX0
    camera.Y0 = newY0

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Перерисовка содержимого сцены после изменения размеров canvas
    scene.render();
  })
});