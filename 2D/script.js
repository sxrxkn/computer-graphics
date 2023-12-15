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
          this.axisSize = [this.W, this.H]
          this.tickLength = 5
      }

    worldToScreen(x, y) {
        const screenX = this.X0 + this.px * x;
        const screenY = this.Y0 - this.py * y; 
        return [screenX, screenY];
    }

    screenToWorld(x, y) {
        const worldX = (x - camera.X0 + 0.5) / camera.px
        const worldY = -((y - camera.Y0 + 0.5) / camera.py)
        return [worldX, worldY]
    }

    clearWorkspace() {
        context.clearRect(0, 0, this.W, this.H);
    }

      drawVertex(x, y) {
        const [screenX, screenY] = this.worldToScreen(x, y);

        context.beginPath();
        context.arc(screenX, screenY, 3, 0, 2 * Math.PI);
        context.fillStyle = 'red'; 
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
        this.drawLine(-this.axisSize[0] / (2 * this.px), 0, this.axisSize[0] / (2 * this.px), 0); 
        this.drawLine(0, this.axisSize[1] / (2 * this.py), 0, -this.axisSize[1] / (2 * this.py));

        // Разметка делений по обеим осям
        this.drawAxisTicks();
      }

      drawAxisTicks() {
        this.drawAxisTicksX();

        this.drawAxisTicksY();
      }

      drawAxisTicksX() {
        const tickLength = this.tickLength;
        const tickSpacing = this.pixelWidth; // Интервал между делениями в мировых координатах
    
        for (let i = -this.axisSize[0] / (2 * this.px); i <= this.axisSize[0] / (2 * this.px); i += tickSpacing) {
            const x = i;
            const y = 0;
    
            this.drawLine(x, y - tickLength / 2, x, y + tickLength / 2);
            this.drawTickLabel(x, y + tickLength, x);
        }
    }
    
    drawAxisTicksY() {
        const tickLength = this.tickLength;
        const tickSpacing = this.pixelHeight;
    
        for (let i = -this.axisSize[1] / (2 * this.py); i <= this.axisSize[1] / (2 * this.py); i += tickSpacing) {
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
          this.currentAffineTransformation = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
          this.originalVertices = vertices.map(row => row.slice());
          this.transformationMatrices = [];
          this.currentVertices = this.originalVertices.map(row => row.slice());
          this.edges = edges;
      }

      applyAllTransformations() {
        // let combinedMatrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    
        // for (const matrix of this.transformationMatrices) {
        //     combinedMatrix = this.multiplyMatrices(combinedMatrix, matrix);
        // }
        this.currentVertices = this.multiplyMatrices(this.currentAffineTransformation, this.originalVertices)
        console.log(model.originalVertices, model.currentVertices)
        // this.currentVertices = this.multiplyMatrices(combinedMatrix, this.currentVertices)
        this.transformationMatrices = []
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

        for (let i = 0; i < vertices[0].length; i++) {
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

//   const vertices = [
//       [50, 100, 100],
//       [50, 50, 100 ],
//       [1, 1, 1]
//   ];

//   const edges = [
//    [0, 1],
//    [1, 2],
//    [2, 0]
//   ];

  const model = new Model2D([[],[],[]], []);

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
      model.currentAffineTransformation = model.multiplyMatrices(translationMatrix, model.currentAffineTransformation)
    
    //   model.transformationMatrices.push(translationMatrix);
    //   applyAllTransformations();
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
      model.currentAffineTransformation = model.multiplyMatrices(scalingMatrix,model.currentAffineTransformation)
    //   model.transformationMatrices.push(scalingMatrix);
    //   applyAllTransformations();
  });

  // Обработчик для кнопки R (вращение)
  document.getElementById('rotateBtn').addEventListener('click', function () {
      const angle = parseFloat(prompt('Enter rotation angle in degrees:', '0')) || 0;
      const radianAngle = (angle * Math.PI) / 180;
      console.log(radianAngle)
      const rotationMatrix = [
          [Math.cos(radianAngle), -Math.sin(radianAngle), 0],
          [Math.sin(radianAngle), Math.cos(radianAngle), 0],
          [0, 0, 1]
      ];
      model.currentAffineTransformation = model.multiplyMatrices(rotationMatrix, model.currentAffineTransformation)
    //   model.transformationMatrices.push(rotationMatrix);
    //   applyAllTransformations();
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
        model.currentAffineTransformation = model.multiplyMatrices(reflectionMatrix, model.currentAffineTransformation)
        // model.transformationMatrices.push(reflectionMatrix);
      }
    //   applyAllTransformations();
  });

  // Обработчик для кнопки Reset (сброс преобразований)
  document.getElementById('resetBtn').addEventListener('click', function () {
      model.currentAffineTransformation = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      model.currentVertices = this.originalVertices.map(row => row.slice())
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
    
    const newPy = newHeight / camera.H * camera.py
    const newPx = newPy
    const newY0 = newHeight / camera.H * camera.Y0
    const newX0 = ((-2 * camera.X0 + camera.W) * (newHeight / camera.H * camera.py) / (-2 * camera.px)) - (newWidth / -2)
    
    camera.axisSize = [camera.axisSize[0] * newPx, camera.axisSize[1] * newPy]
    camera.px = newPx
    camera.py = newPy
    camera.X0 = newX0
    camera.Y0 = newY0
    

    canvas.width = newWidth;
    canvas.height = newHeight;
    camera.H = newHeight
    camera.W = newWidth

    scene.render();
  })


  let isDrawing = false;

  document.getElementById('addFigureBtn').addEventListener('click', function () {
    isDrawing = !isDrawing;
    console.log(isDrawing);

    if (isDrawing) {
        // Включение режима рисования
        canvas.addEventListener('mousedown', handleDrawing);
    } else {
        canvas.removeEventListener('mousedown', handleDrawing);
    }

    let currentVertices = [];

    function handleDrawing(event) {
        if (isDrawing) {
            currentVertices = [];

            const x = event.clientX - canvas.getBoundingClientRect().left;
            const y = event.clientY - canvas.getBoundingClientRect().top;
            const worldCoordinates = camera.screenToWorld(x, y);

            model.currentVertices[0].push(worldCoordinates[0]);
            model.currentVertices[1].push(worldCoordinates[1]);
            model.currentVertices[2].push(1);

            model.originalVertices[0].push(worldCoordinates[0]);
            model.originalVertices[1].push(worldCoordinates[1]);
            model.originalVertices[2].push(1);

            const lastVertexIndex = model.currentVertices[0].length - 1;
            if (lastVertexIndex >= 0) {
                const newEdge = [lastVertexIndex - 1, lastVertexIndex];
                model.edges.push(newEdge);
            }

          
            scene.render();
        }
    }
});

  document.getElementById("mappingToGivenAxisBtn").addEventListener('click', function () {
    const point1 = prompt('Enter coordinates for point 1 (comma-separated):');
    const point2 = prompt('Enter coordinates for point 2 (comma-separated):');

    const parsePoint = (pointString) => pointString.split(',').map(Number);

    let [x1, y1] = parsePoint(point1);
    let [x2, y2] = parsePoint(point2);

    // if (y1 > y2) {
    //     [x1, x2] = [x2, x1];
    //     [y1, y2] = [y2, y1];
    // }
    
    
    console.log([x1,y1], [x2,y2]);
    model.originalVertices[0].push(x1,x2);
    model.originalVertices[1].push(y1,y2)
    model.originalVertices[2].push(1,1)

    model.currentVertices[0].push(x1,x2);
    model.currentVertices[1].push(y1,y2)
    model.currentVertices[2].push(1,1)
    model.edges.push([model.currentVertices[0].length - 2, model.currentVertices[0].length - 1])


    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const axisLength = Math.sqrt(deltaX**2 + deltaY**2);

    
    
    // Создаем матрицу поворота
    const cos = deltaX / axisLength
    let sin = deltaY / axisLength;

    const translationMatrix1 = [
        [1, 0, x1 * -1],
        [0, 1, y1 * -1],
        [0, 0, 1]
    ];

    const rotationMatrix1 = [
        [cos, sin, 0],
        [-sin, cos, 0],
        [0, 0, 1]
    ];

    const reflectionMatrix = [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, 1]
    ];

    const rotationMatrix2 = [
        [cos, -sin, 0],
        [sin, cos, 0],
        [0, 0, 1]
    ];
    
    const translationMatrix2 = [
        [1, 0, x1],
        [0, 1, y1],
        [0, 0, 1]
    ];
    model.currentAffineTransformation = model.multiplyMatrices(translationMatrix1, model.currentAffineTransformation)
   
    model.currentAffineTransformation = model.multiplyMatrices(rotationMatrix1, model.currentAffineTransformation)
    model.currentAffineTransformation = model.multiplyMatrices(reflectionMatrix, model.currentAffineTransformation)
    model.currentAffineTransformation = model.multiplyMatrices(rotationMatrix2, model.currentAffineTransformation)
  

    model.currentAffineTransformation = model.multiplyMatrices(translationMatrix2, model.currentAffineTransformation)
  })

});

