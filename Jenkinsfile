pipeline {
  agent any

  environment {
    // Ruta a credenciales Firebase para backend (si aplica)
    GOOGLE_APPLICATION_CREDENTIALS = 'Backend/firebase.json'

    // Token de Codecov guardado como secreto en Jenkins
    CODECOV_TOKEN = credentials('CODECOV_TOKEN')
  }

  stages {

    stage('Clonar repositorio') {
      steps {
        git url: 'https://github.com/Sebasdlo/Trabajo_Integracion_Tienda_Catalogos_art3d.git', branch: 'main'
      }
    }

    stage('Backend - Dependencias y pruebas') {
      steps {
        dir('Backend') {
          bat '''
          echo 🔧 Instalando dependencias Python
          pip install -r Requirements.txt

          echo 🧪 Ejecutando pruebas con coverage
          pytest --cov=. --cov-report=xml --cov-report=term
          '''
        }
      }
    }

    stage('Frontend - Dependencias y pruebas') {
      steps {
        dir('Frontend') {
          bat '''
          echo 🔧 Instalando dependencias Node.js
          npm install

          echo 🧪 Ejecutando pruebas con coverage
          npm test -- --coverage --watchAll=false
          '''
        }
      }
    }

    stage('Build y Deploy con Docker') {
      steps {
        bat '''
        echo 🐳 Reiniciando contenedores
        docker-compose down || exit 0
        docker-compose up --build -d
        '''
      }
    }

stage('Subir cobertura a Codecov') {
  steps {
    bat """
    echo 📤 Subiendo reportes a Codecov
    bash -c "curl -s https://codecov.io/bash | bash -s -- -f Backend/coverage.xml -F backend -t ${env.CODECOV_TOKEN}"
    bash -c "curl -s https://codecov.io/bash | bash -s -- -f Frontend/coverage/lcov.info -F frontend -t ${env.CODECOV_TOKEN}"
    """
  }
}


  post {
    success {
      echo '✅ CI/CD completado correctamente'
    }
    failure {
      echo '❌ Hubo un error en el pipeline'
    }
  }
}
