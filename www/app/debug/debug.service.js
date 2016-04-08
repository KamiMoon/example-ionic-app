angular.module('preserveusMobile')

    .service('DebugService', function ($log, $localStorage) {

        
        
        if (!$localStorage.debugStatements) {
            $localStorage.debugStatements = [];
        }

        this.log = function (statement) {

            if (typeof statement !== 'string' && statement.message) {
                statement = statement.message;
            }

            statement = statement + ': ' + new Date().toLocaleString();

            $log.log(statement);

            $localStorage.debugStatements.push(statement);
        };

        this.getDebugStatements = function () {
            return $localStorage.debugStatements;
        };

        this.clear = function () {
            $localStorage.debugStatements = [];
        };

    });
