pipeline{
    agent any

    stages {
        stage('Build...') {
            steps {
                npm i
                npm run build
            }
        }
        stage('Deploy...') {
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                npm run init-database
                npm start
            }
        }
    }
}