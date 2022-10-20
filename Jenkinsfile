pipeline{
    agent any

    stages {
        stage('Build...') {
            steps {
                sh 'sudo docker compose down'
                sh 'sudo docker compose build --no-cache'
            }
        }
        stage('Deploy...') {
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                sh 'sudo docker compose up -d'
            }
        }
    }
}