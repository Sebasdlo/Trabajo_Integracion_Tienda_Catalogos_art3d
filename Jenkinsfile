pipeline {
  agent any

  environment {
    GOOGLE_APPLICATION_CREDENTIALS = 'Backend\\firebase.json'
  }

  stages {
    stage('Clonar repositorio') {
      steps {
        git url: 'https://github.com/Sebasdlo/Trabajo_Integracion_Tienda_Catalogos_art3d.git', branch: 'main'
      }
    }

    stage('Copiar credenciales Firebase') {
      steps {
        withCredentials([file(credentialsId: 'firebase-credentials', variable: 'FIREBASE_FILE')]) {
          bat '''
          if not exist Backend mkdir Backend
          copy "%FIREBASE_FILE%" Backend\\firebase.json
          '''
        }
      }
    }

    stage('Build y Deploy con Docker') {
      steps {
        bat '''
        docker-compose down || exit 0
        docker-compose up --build -d
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Despliegue completado correctamente'
    }
    failure {
      echo '❌ Hubo un error en el pipeline'
    }
  }
}
