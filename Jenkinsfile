pipeline {
  agent any

  environment {
    REGISTRY = "ghcr.io/acme/hrms"
    SHA_TAG = "sha-${env.GIT_COMMIT.take(12)}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Lint and Unit Test') {
      parallel {
        stage('Backend') {
          steps {
            dir('services/employee-profile-service') {
              sh 'npm ci'
              sh 'npm run lint'
              sh 'npm test -- --ci'
            }
          }
        }
        stage('Frontend') {
          steps {
            dir('frontend/hrms-web') {
              sh 'npm ci'
              sh 'npm run lint'
              sh 'npm test -- --watch=false'
            }
          }
        }
      }
    }

    stage('Security Scan') {
      steps {
        sh 'trivy fs --severity HIGH,CRITICAL --exit-code 1 .'
        sh 'snyk test --all-projects || true'
      }
    }

    stage('Build and Push') {
      steps {
        sh 'docker build -t $REGISTRY/employee-profile-service:$SHA_TAG services/employee-profile-service'
        sh 'docker build -t $REGISTRY/hrms-web:$SHA_TAG frontend/hrms-web'
        sh 'docker push $REGISTRY/employee-profile-service:$SHA_TAG'
        sh 'docker push $REGISTRY/hrms-web:$SHA_TAG'
      }
    }

    stage('Deploy') {
      when {
        anyOf {
          branch 'development'
          tag pattern: 'v[0-9]+\\.[0-9]+\\.[0-9]+', comparator: 'REGEXP'
        }
      }
      steps {
        script {
          def ns = env.BRANCH_NAME == 'development' ? 'hrms-development' : 'hrms-production'
          sh "helm upgrade --install hrms-employee infra/helm/employee-profile-service -n ${ns} --create-namespace --set image.tag=$SHA_TAG"
          sh "helm upgrade --install hrms-gateway infra/helm/gateway -n ${ns}"
        }
      }
    }
  }

  post {
    failure {
      sh 'helm rollback hrms-employee 0 -n hrms-development || true'
    }
  }
}

