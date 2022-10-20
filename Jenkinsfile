pipeline{
    agent any

    stages {
        stage('Build...') {
            steps {
                sh 'npm i'
                sh 'npm run build'
            }
        }
        stage('Deploy...') {
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                sh 'npm run init-database'
                sh 'npm start'
            }
        }
    }
}