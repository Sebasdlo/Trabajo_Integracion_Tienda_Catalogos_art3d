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
          bat 'pip install -r Requirements.txt'
          bat 'pytest --cov=. --cov-report=xml --cov-report=term'
        }
      }
    }

    stage('Frontend - Dependencias y pruebas') {
      steps {
        dir('Frontend') {
          bat 'npm install'
          bat 'npm test -- --coverage --watchAll=false'
        }
      }
    }

    stage('Levantar contenedores') {
      steps {
        bat 'docker-compose down || exit 0'
        bat 'docker-compose up --build -d'
      }
    }

    stage('Subir cobertura a Codecov') {
      steps {
        bat 'curl -Os https://uploader.codecov.io/latest/windows/codecov.exe'
        bat 'codecov.exe -f Backend/coverage.xml -F backend -t %CODECOV_TOKEN%'
        bat 'codecov.exe -f Frontend/coverage/lcov.info -F frontend -t %CODECOV_TOKEN%'
      }
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
