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
          pip install -r Requirements.txt
          pytest --cov=. --cov-report=xml --cov-report=term
          '''
        }
      }
    }

    stage('Frontend - Dependencias y pruebas') {
      steps {
        dir('Frontend') {
          bat '''
          npm install
          npm test -- --coverage --watchAll=false
          '''
        }
      }
    }

    stage('Levantar contenedores') {
      steps {
        bat '''
        docker-compose down || exit 0
        docker-compose up --build -d
        '''
      }
    }
    stage('Subir cobertura a Codecov') {
      steps {
        powershell '''
        Invoke-WebRequest -Uri "https://uploader.codecov.io/latest/windows/codecov.ps1" -OutFile "codecov.ps1"
        powershell -ExecutionPolicy Bypass -File codecov.ps1 `
            -f "Backend/coverage.xml" -F backend -t "$env:CODECOV_TOKEN"
        powershell -ExecutionPolicy Bypass -File codecov.ps1 `
            -f "Frontend/coverage/lcov.info" -F frontend -t "$env:CODECOV_TOKEN"
        '''
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
