pipeline {
  agent any

  environment {
    GOOGLE_APPLICATION_CREDENTIALS = 'Backend/firebase.json'
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
          script {
            if (isUnix()) {
              sh 'pip install -r Requirements.txt'
              sh 'pytest --cov=. --cov-report=xml --cov-report=term'
            } else {
              bat 'pip install -r Requirements.txt'
              bat 'pytest --cov=. --cov-report=xml --cov-report=term'
            }
          }
        }
      }
    }

    stage('Frontend - Dependencias y pruebas') {
      steps {
        dir('Frontend') {
          script {
            if (isUnix()) {
              sh 'npm install'
              sh 'npm test -- --coverage --watchAll=false'
            } else {
              bat 'npm install'
              bat 'npm test -- --coverage --watchAll=false'
            }
          }
        }
      }
    }

    stage('Levantar contenedores') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose down || true'
            sh 'docker-compose up --build -d'
          } else {
            bat 'docker-compose down || exit 0'
            bat 'docker-compose up --build -d'
          }
        }
      }
    }

    stage('Subir cobertura a Codecov') {
      steps {
        script {
          if (isUnix()) {
            sh 'curl -Os https://uploader.codecov.io/latest/linux/codecov'
            sh 'chmod +x codecov'
            sh './codecov -f Backend/coverage.xml -F backend -t $CODECOV_TOKEN'
            sh './codecov -f Frontend/coverage/lcov.info -F frontend -t $CODECOV_TOKEN'
          } else {
            bat 'curl -Os https://uploader.codecov.io/latest/windows/codecov.exe'
            bat 'codecov.exe -f Backend/coverage.xml -F backend -t %CODECOV_TOKEN%'
            bat 'codecov.exe -f Frontend/coverage/lcov.info -F frontend -t %CODECOV_TOKEN%'
          }
        }
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
